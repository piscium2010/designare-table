import React from 'react'
import { Context } from './context'
import debounce from 'lodash/debounce'
import Header from './Header'
import Body from './Body'
import Pagination from './Pagination'
import {
    flatten,
    createColumnMeta,
    forEachLeafColumn,
    depthOf,
    groupByDepth,
    widthArray,
    max
} from './util'
import SyncScrolling from './SyncScrolling'
import Spinner from './Loading'
import { ERR0, ERR1 } from './messages'
import './app.less'

const doNothing = () => { }

export default class Table extends React.Component {
    static defaultProps = {
        children: <React.Fragment><Header /><Body /></React.Fragment>,
        defaultSorter: {},
        onChangeColumns: doNothing,
        onChangeRows: doNothing,
        onChangeSorter: doNothing,
        onChangeFilters: doNothing,
        onChangePaging: doNothing,
        activeColor: '#1890ff',
        defaultColor: '#bfbfbf',
        resizable: false,
        rowHeight: 38
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    constructor(props) {
        super(props)
        this.root = React.createRef()
        this.filterLayersRef = React.createRef()
        this.isInit = false
        this.activeSorter = { columnMetaKey: '', direction: '' }
        this.tableDidMountListeners = new Map()
        this.activeFilters = new Map()
        this.syncScrollingInstance = new SyncScrolling()
        this.dimensionInfo = {}
        this.resizedWidthInfo = new Map()
        this.debouncedUpdate = debounce(this._update, 60)
        this.debouncedSyncWidthAndHeight = debounce(this.syncWidthAndHeight, 100, { leading: true, trailing: true })
        this.debouncedReSyncWidthAndHeight = debounce(this.reSyncWidthAndHeight, 100, { leading: true, trailing: true })
        this.warnings = new Map()
        this.cells = new Map()
        this.headerCells = new Map()
        this.global = Object.seal({
            'designare-draggable-column-index': undefined,
            'designare-draggable-row-index': undefined,
            'resizing': false
        })
        this.contextAPI = {
            getFilterLayerContainer: this.getFilterLayerContainer,

            getDefaultFilters: this.getDefaultFilters,
            getFilters: this.getFilters,
            setActiveFilter: this.setActiveFilter,
            getActiveFilters: this.getActiveFilters,
            removeActiveFilter: this.removeActiveFilter,
            onChangeFilters: props.onChangeFilters,

            getDefaultSorter: this.getDefaultSorter,
            getSorter: this.getSorter,
            setActiveSorter: this.setActiveSorter,
            getActiveSorter: this.getActiveSorter,
            onChangeSorter: props.onChangeSorter,

            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener,

            syncScrolling: this.syncScrolling,
            removeSyncScrolling: this.removeSyncScrolling,

            reSyncWidthAndHeight: this.debouncedReSyncWidthAndHeight,
            syncScrollBarStatus: this.syncScrollBarStatus,

            getColGroups: this.getColGroups,

            setResizedWidthInfo: this.setResizedWidthInfo,

            isInit: () => this.isInit,

            cells: this.cells,
            headerCells: this.headerCells,

            activeColor: props.activeColor,
            defaultColor: props.defaultColor,
            rowHeight: props.rowHeight,

            global: this.global,
            onChangeColumns: props.onChangeColumns,
            onChangeRows: props.onChangeRows,

            resizable: props.resizable
        }
        this.state = {
            hasError: false,
            pageNo: 'defaultPageNo' in props ? props.defaultPageNo : 1,
            pageSize: 'defaultPageSize' in props ? props.defaultPageSize : 10,
        }
        this.defaultFilters = 'defaultFilters' in props ? Array.from(props.defaultFilters) : undefined
        this.defaultSorter = 'defaultSorter' in props ? props.defaultSorter : undefined
    }

    get pageNo() {
        return 'pageNo' in this.props ? this.props.pageNo : this.state.pageNo
    }

    get pageSize() {
        return 'pageSize' in this.props ? this.props.pageSize : this.state.pageSize
    }

    get total() {
        return 'total' in this.props ? this.props.total : this.props.data ? this.props.data.length : 0
    }

    get isPaging() {
        const pageSize = 'pageSize' in this.props ? true : false
        const pageSizeOptions = 'pageSizeOptions' in this.props ? true : false
        return pageSize || pageSizeOptions
    }

    get isClientPaging() {
        const total = 'total' in this.props ? true : false
        return this.isPaging && !total
    }

    getDefaultFilters = () => {
        return this.defaultFilters ? Array.from(this.defaultFilters) : undefined
    }

    getFilters = () => {
        return this.props.filters ? Array.from(this.props.filters) : undefined
    }

    getActiveFilters = () => {
        return this.activeFilters
    }

    setActiveFilter = ({ columnMetaKey, dataKey, filterValue, name, by }) => {
        const previous = this.activeFilters.get(columnMetaKey) || {}
        if (previous.dataKey !== dataKey || previous.filterValue !== filterValue) {
            // console.log(`set`,dataKey, filterValue)
            this.activeFilters.set(columnMetaKey, { filterValue, name, dataKey, by })

            // validate
            const keyMap = new Map(), nameMap = new Map()
            this.activeFilters.forEach(f => {
                const { dataKey, name } = f
                keyMap.has(dataKey) ? keyMap.set(dataKey, keyMap.get(dataKey) + 1) : keyMap.set(dataKey, 1)
                if (name !== undefined) { // optional prop
                    nameMap.has(name) ? nameMap.set(name, nameMap.get(name) + 1) : nameMap.set(name, 1)
                }
            })
            keyMap.forEach((v, dataKey) => {
                if (v > 1)
                    throw new Error(`More than one Filter is found for dataKey ${dataKey}.\n Please specify 'name' to distinguish each filter \n e.g.\nfilter: <Filter name='address'/> \ntable: <Table filters={[{name:'address', filterValue:'west lake'}]}/>`)
            })
            nameMap.forEach((v, name) => {
                if (v > 1)
                    throw new Error(`More than one Filter is found for name ${name}.\n name should be unique for each filter`)
            })
            keyMap.clear()
            nameMap.clear()
            this._update()
        }
    }

    removeActiveFilter = columnMetaKey => {
        if (this.activeFilters.has(columnMetaKey)) {
            this.activeFilters.delete(columnMetaKey)
            this._update()
        }
    }

    getDefaultSorter = () => {
        return this.defaultSorter
    }

    getSorter = () => {
        return this.props.sorter
    }

    setActiveSorter = ({ columnMetaKey, dataKey, direction, by }) => {
        if (dataKey !== this.activeSorter.dataKey || direction !== this.activeSorter.direction) {
            this.activeSorter = { columnMetaKey, dataKey, direction, by }
            this._update()
        }
    }

    // used when user resize column
    setResizedWidthInfo = (metaKey, width) => {
        this.resizedWidthInfo.set(metaKey, width)
    }

    getActiveSorter = () => {
        return this.activeSorter
    }

    getFilterLayerContainer = columnMetaKey => {
        return this.filterLayersRef.current.getElementsByClassName(columnMetaKey)[0]
    }

    getColGroups = evt => {
        const findDOM = find.bind(null, this.root.current)
        const roots = []
        const colgroups = []
        // header
        const [headerWrapper, headerRoot, header] = findDOM('header')
        const [leftHeaderWrapper, leftHeaderRoot, leftHeader] = findDOM('header', 'left')
        const [rightHeaderWrapper, rightHeaderRoot, rightHeader] = findDOM('header', 'right')

        // body
        const [bodyWrapper, bodyRoot, body] = findDOM('body')
        const [leftBodyWrapper, leftBodyRoot, leftBody] = findDOM('body', 'left')
        const [rightBodyWrapper, rightBodyRoot, rightBody] = findDOM('body', 'right')

        const headerColGroup = headerRoot.getElementsByTagName('colgroup')[0]
        const leftHeaderColGroup = leftHeaderRoot.getElementsByTagName('colgroup')[0]
        const rightHeaderColGroup = rightHeaderRoot.getElementsByTagName('colgroup')[0]
        const bodyColGroup = bodyRoot.getElementsByTagName('colgroup')[0]
        const leftBodyColGroup = leftBodyRoot.getElementsByTagName('colgroup')[0]
        const rightBodyColGroup = rightBodyRoot.getElementsByTagName('colgroup')[0]

        headerColGroup ? colgroups.push(headerColGroup) : undefined
        leftHeaderColGroup ? colgroups.push(leftHeaderColGroup) : undefined
        rightHeaderColGroup ? colgroups.push(rightHeaderColGroup) : undefined
        bodyColGroup ? colgroups.push(bodyColGroup) : undefined
        leftBodyColGroup ? colgroups.push(leftBodyColGroup) : undefined
        rightBodyColGroup ? colgroups.push(rightBodyColGroup) : undefined

        headerRoot ? roots.push(headerRoot) : undefined
        leftHeaderRoot ? roots.push(leftHeaderRoot) : undefined
        rightHeaderRoot ? roots.push(rightHeaderRoot) : undefined
        bodyRoot ? roots.push(bodyRoot) : undefined
        leftBodyRoot ? roots.push(leftBodyRoot) : undefined
        rightBodyRoot ? roots.push(rightBodyRoot) : undefined

        const minWidthArray = Array.from(this.dimensionInfo.originalMaxWidthArray)
        const maxWidthArray = Array.from(this.dimensionInfo.maxWidthArray)

        return [roots, colgroups, minWidthArray, maxWidthArray]
    }

    addEventListener = (type = 'tableDidMount', func) => {
        switch (type) {
            case 'tableDidMount':
                this.tableDidMountListeners.set(func, '')
                break
            default:
                throw `invalid event type: ${type}`
        }
    }

    removeEventListener = (type = 'tableDidMount', func) => {
        switch (type) {
            case 'tableDidMount':
                this.tableDidMountListeners.delete(func, '')
                break
            default:
                throw `invalid event type: ${type}`
        }
    }

    syncScrolling = (scrollable, mode = 'scrollLeft') => {
        this.syncScrollingInstance.add(scrollable, mode)
    }

    removeSyncScrolling = scrollable => {
        this.syncScrollingInstance.remove(scrollable)
    }

    sort = data => {
        const result = Array.from(data)
        const { dataKey, direction, by } = this.getActiveSorter() // typescript?
        if (dataKey && direction && direction !== 'default' && typeof by === 'function') {
            result.sort((a, b) => by(a[dataKey], b[dataKey]))
            if (direction === 'des') result.reverse()
        }

        return result
    }

    filter = data => {
        let result = data
        this.activeFilters.forEach(f => {
            const { dataKey, by, filterValue } = f
            if (typeof by === 'function') {
                result = result.filter(row => by({ dataKey, filterValue, row }))
            }
        })
        return result
    }

    filterAndSort = data => {
        let result = data
        // console.log(`original`,data)
        result = this.filter(result)
        // console.log(`filtered`,result)
        result = this.sort(result)
        return result
    }

    paging = data => {
        const { pageNo, pageSize } = this
        const start = (pageNo - 1) * pageSize
        // console.log(`this.isClientPaging `,this.isClientPaging )
        return this.isClientPaging ? data.slice(start, start + pageSize) : data
    }

    onGoToPage = pageNo => {
        let next
        next = Math.max(1, pageNo)
        next = Math.min(Math.ceil(this.total / this.pageSize), next)
        this.setState({ pageNo: next }, () => {
            this.props.onChangePaging({ pageNo: next, pageSize: this.pageSize })
        })
    }

    setPageSize = pageSize => {
        this.setState({ pageSize, pageNo: 1 }, () => {
            this.props.onChangePaging({ pageSize, pageNo: 1 })
        })
    }

    _update = () => {
        this.setState({})
        // this.forceUpdate()
    }

    printWarnings = warnings => {
        warnings.forEach(str => {
            if (!this.warnings.has(str)) {
                console.warn(`designare-table: ${str} `)
                this.warnings.set(str, 'printed')
            }
        })
    }

    syncWidthAndHeight = force => {
        const { rowHeight } = this.props
        const { dimensionInfo, flattenSortedColumns, root, resizedWidthInfo, depthOfColumns } = this
        syncWidthAndHeight(
            root.current,
            flattenSortedColumns,
            rowHeight,
            dimensionInfo,
            resizedWidthInfo,
            depthOfColumns,
            force
        )
    }

    reSyncWidthAndHeight = (force = false) => {
        // return
        // console.log(`rsync`)
        const { dimensionInfo, flattenSortedColumns, root } = this
        const dimensionId = code(flattenSortedColumns)
        const isReSized = force || dimensionId !== dimensionInfo.dimensionId || isDimensionChanged(
            root.current,
            getColumnSize(flattenSortedColumns),
            dimensionInfo
        )
        if (isReSized) {
            console.log(`resized`)
            // return
            this.debouncedSyncWidthAndHeight(force)
        }
    }

    syncScrollBarStatus = () => {
        syncScrollBarStatus(this.root.current)
    }

    resize = () => this.reSyncWidthAndHeight(true)

    componentDidUpdate() {
        if (this.state.hasError) return
        // this.reSyncWidthAndHeight()
        // this.debouncedReSyncWidthAndHeight()
        // console.log(`dimensionId`,this.dimensionInfo.dimensionId, code(this.flattenSortedColumns))
        // if(code(this.flattenSortedColumns) !== this.dimensionInfo.dimensionId) {
        //     this.debouncedReSyncWidthAndHeight()
        // }
    }

    componentDidMount() {
        // console.log(`table did mount`,)
        if (this.state.hasError) return
        const { flattenSortedColumns } = this
        const columnSize = getColumnSize(flattenSortedColumns)
        if (columnSize > 0) {
            if (this.cells.size % columnSize !== 0)
                throw ERR0
            if (this.headerCells.size % flattenSortedColumns.length !== 0)
                throw ERR1
        }

        this.syncWidthAndHeight()
        window.addEventListener('resize', this.resize)
        this.isInit = true
        window.requestAnimationFrame(() => {
            this.tableDidMountListeners.forEach((v, k) => k())
            this._update()
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    render() {
        // console.log(`render table`)
        if (this.state.hasError) return <div style={{ color: '#b51a28' }}>{this.state.error}</div>

        const {
            activeColor,
            defaultColor,
            className = '',
            columns = [],
            data = [],
            style,
            loading,
            pageSizeOptions,
        } = this.props
        this.depthOfColumns = depthOf(columns)
        const [columnsWithMeta, warnings] = createColumnMeta(columns, this.depthOfColumns)
        this.printWarnings(warnings)
        this.sortedColumns = sortColumns(columnsWithMeta)
        this.data = this.filterAndSort(data)
        this.data = this.paging(this.data)
        this.flattenSortedColumns = flatten(this.sortedColumns)

        return (
            <div className={`designare-table ${className}`} ref={this.root} style={{ position: 'relative', ...style }}>
                <div ref={this.filterLayersRef}>
                    {
                        groupByDepth(this.sortedColumns).map((levelColumns, i) => {
                            return levelColumns.map(column => (
                                <div className={`designare-table-filter-layer-container ${column.metaKey}`} key={column.metaKey}></div>
                            ))
                        })
                    }
                </div>
                <Context.Provider
                    value={{
                        originalColumns: columns,
                        columns: this.sortedColumns,
                        originalData: data,
                        data: this.data,
                        flattenSortedColumns: this.flattenSortedColumns,
                        ...this.contextAPI
                    }}
                >
                    {this.props.children}
                </Context.Provider>
                {
                    this.isInit && this.isPaging && data.length > 0 &&
                    <Pagination
                        isFirstPage={this.pageNo === 1}
                        isLastPage={this.pageNo === Math.ceil(this.total / this.pageSize)}
                        pageNo={this.pageNo}
                        onGoToPage={this.onGoToPage}
                        pageSize={this.pageSize}
                        setPageSize={this.setPageSize}
                        total={this.total}
                        pageSizeOptions={pageSizeOptions}
                    />
                }
                {loading && <Spinner loading={loading} style={{ color: activeColor }} />}
            </div>
        )
    }
}

function sortColumns(columns) {
    const leftColumns = columns.filter(c => c.fixed === 'left')
    const normalColumns = columns.filter(c => !c.fixed)
    const rightColumns = columns.filter(c => c.fixed === 'right').reverse()
    leftColumns.length > 0 ? leftColumns[leftColumns.length - 1].isLastFixedColumn = true : undefined
    rightColumns[0] ? rightColumns[0].isFirstFixedColumn = true : undefined
    const r = [].concat(leftColumns).concat(normalColumns).concat(rightColumns)
    createLeafColumnIndex(r)
    return r
}

function createLeafColumnIndex(columns) {
    forEachLeafColumn(columns, (col, i, isLast) => {
        col.isFirst = i === 0
        col.isLast = isLast
        col.isLeaf = true
        col.leafIndex = i
    })
}

function syncWidthAndHeight(table, columns, rowHeight = -1, dimensionInfo, resizedWidthInfo, depthOfColumns, force) {
    // console.log(`columns`, columns)
    const findDOM = find.bind(null, table), dimensionId = code(columns)
    const columnSize = getColumnSize(columns)
    // console.log(`columnSize`,columnSize)
    // header
    const [headerWrapper, headerRoot, header] = findDOM('header')
    // console.log(`heaerRoot`,headerRoot)
    const [leftHeaderWrapper, leftHeaderRoot, leftHeader] = findDOM('header', 'left')
    const [rightHeaderWrapper, rightHeaderRoot, rightHeader] = findDOM('header', 'right')

    // body
    const [bodyWrapper, bodyRoot, body] = findDOM('body')
    const [leftBodyWrapper, leftBodyRoot, leftBody] = findDOM('body', 'left')
    const [rightBodyWrapper, rightBodyRoot, rightBody] = findDOM('body', 'right')

    // console.log(`remove`,dimensionInfo.dimensionId, dimensionId)
    if (dimensionInfo.dimensionId !== dimensionId || force) {
        // remove column width
        setStyle(headerRoot, 'minWidth', '0')
        setStyle(leftHeaderRoot, 'minWidth', '0')
        setStyle(rightHeaderRoot, 'minWidth', '0')
        setStyle(bodyRoot, 'minWidth', '0')
        setStyle(leftBodyRoot, 'minWidth', '0')
        setStyle(rightBodyRoot, 'minWidth', '0')
        removeColgroup(headerRoot)
        removeColgroup(leftHeaderRoot)
        removeColgroup(rightHeaderRoot)
        removeColgroup(bodyRoot)
        removeColgroup(leftBodyRoot)
        removeColgroup(rightBodyRoot)
    }

    const rootWidth = table.getBoundingClientRect().width

    // for sync width
    const headerWidthArray = widthArray(header, columnSize, 'end', 'headerWidthArray')
    const leftHeaderWidthArray = widthArray(leftHeader, columnSize, 'end', 'leftHeaderWidthArray')
    const rightHeaderWidthArray = widthArray(rightHeader, columnSize, 'start', 'rightHeaderWidthArray')

    let bodyWidthArray
    let leftBodyWidthArray
    let rightBodyWidthArray

    try {
        bodyWidthArray = widthArray(body, columnSize, 'end', 'bodyWidthArray')
        leftBodyWidthArray = widthArray(leftBody, columnSize, 'end', 'leftBodyWidthArray')
        rightBodyWidthArray = widthArray(rightBody, columnSize, 'start', 'rightBodyWidthArray')
    } catch (error) {
        if (error.name === 'pad') {
            const len = error.value.length
            throw `sum of column.colSpan: ${columnSize} does not match length of td: ${len}`
        }
    }


    const columnWidthArray = columns.reduce((prev, curr) => {
        let { width = -1, colSpan = 1 } = curr, r
        colSpan = colSpan / 1
        width = width === '*' ? -1 : width / colSpan
        r = new Array(colSpan)
        r.fill(width, 0, r.length)
        return prev.concat(r)
    }, [])
    const resizedWidthArray = columns.reduce((prev, curr) => {
        let { metaKey, colSpan = 1 } = curr, r
        let width = resizedWidthInfo.get(metaKey) || -1
        colSpan = colSpan / 1
        r = new Array(colSpan)
        r.fill(width / colSpan, 0, r.length)
        return prev.concat(r)
    }, [])

    let originalMaxWidthArray = max(
        headerWidthArray,
        leftHeaderWidthArray,
        rightHeaderWidthArray,
        bodyWidthArray,
        leftBodyWidthArray,
        rightBodyWidthArray,
        columnWidthArray
    )

    let maxWidthArray = max(
        originalMaxWidthArray,
        resizedWidthArray
    )

    let sum = maxWidthArray.reduce((prev, curr) => prev + curr, 0)

    const leftOver = Math.floor(rootWidth - sum)
    if (leftOver > 0) {
        let balance = leftOver
        for (let i = 0, len = columns.length; i < len; i++) {
            if (columns[i].width === '*') {
                maxWidthArray[i] += balance
                originalMaxWidthArray[i] += balance
                balance = 0
                break
            }
        }
        if (balance > 0) {
            for (let i = 0, len = columns.length; i < len; i++) {
                let avg = balance / (len - i)
                avg = avg - avg % 1
                maxWidthArray[i] += avg
                originalMaxWidthArray[i] += avg
                balance -= avg
            }
        }
        sum += leftOver
    }
    // console.log(`originalMaxWidthArray`,originalMaxWidthArray)
    // console.log(`leftOver`,leftOver)

    const mergeMax = (w, i) => w > -1 ? maxWidthArray[i] : w
    const positive = w => w > -1

    const headerColgroup = createColgroup(maxWidthArray)
    const leftHeaderColgroup = createColgroup(leftHeaderWidthArray.map(mergeMax).filter(positive))
    const rightHeaderColgroup = createColgroup(rightHeaderWidthArray.map(mergeMax).filter(positive))

    const bodyColgroup = createColgroup(maxWidthArray)
    const leftBodyColgroup = createColgroup(leftBodyWidthArray.map(mergeMax).filter(positive))
    const rightBodyColgroup = createColgroup(rightBodyWidthArray.map(mergeMax).filter(positive))

    // sync width
    // if (dimensionInfo.dimensionId !== dimensionId || force) {

    // }

    const tableWidth = sum + 'px'
    setStyle(leftHeaderRoot, 'minWidth', `${tableWidth}`)
    setStyle(rightHeaderRoot, 'minWidth', `${tableWidth}`)
    setStyle(leftBodyRoot, 'minWidth', `${tableWidth}`)
    setStyle(rightBodyRoot, 'minWidth', `${tableWidth}`)
    if (leftOver < 0) {
        setStyle(headerRoot, 'minWidth', `${tableWidth}`)
        setStyle(bodyRoot, 'minWidth', `${tableWidth}`)
    }

    removeColgroup(headerRoot)
    removeColgroup(leftHeaderRoot)
    removeColgroup(rightHeaderRoot)
    removeColgroup(bodyRoot)
    removeColgroup(leftBodyRoot)
    removeColgroup(rightBodyRoot)

    appendChild(headerRoot, headerColgroup)
    appendChild(leftHeaderRoot, leftHeaderColgroup)
    appendChild(rightHeaderRoot, rightHeaderColgroup)
    appendChild(bodyRoot, bodyColgroup)
    appendChild(leftBodyRoot, leftBodyColgroup)
    appendChild(rightBodyRoot, rightBodyColgroup)

    // for sync height - should happen after width is synced
    const headerHeightArray = heightArray(header)
    const leftHeaderHeightArray = heightArray(leftHeader)
    const rightHeaderHeightArray = heightArray(rightHeader)
    const maxHeaderHeightArray = max(headerHeightArray, leftHeaderHeightArray, rightHeaderHeightArray)

    const bodyHeightArray = heightArray(body)
    const leftBodyHeightArray = heightArray(leftBody)
    const rightBodyHeightArray = heightArray(rightBody)
    // console.log(`leftBodyHeightArray`, leftBodyHeightArray)
    const maxBodyHeightArray = max(
        bodyHeightArray,
        leftBodyHeightArray.length === 0 ? bodyHeightArray : leftBodyHeightArray, // ignore when length === 0
        rightBodyHeightArray.length === 0 ? bodyHeightArray : rightBodyHeightArray // ignore when length === 0
    )
    // sync height
    const headers = getChildren(header)
    const leftHeaders = getChildren(leftHeader)
    const rightHeaders = getChildren(rightHeader)
    const rows = getChildren(body)
    const leftRows = getChildren(leftBody)
    const rightRows = getChildren(rightBody)

    for (let i = 0, len = maxHeaderHeightArray.length; i < len; i++) {
        const height = Math.max(maxHeaderHeightArray[i], Math.ceil(rowHeight / depthOfColumns))
        headers[i].style['height'] = `${height}px`
        leftHeaders[i].style['height'] = `${height}px`
        rightHeaders[i].style['height'] = `${height}px`
    }

    for (let i = 0, len = maxBodyHeightArray.length; i < len; i++) {
        const height = Math.max(maxBodyHeightArray[i], rowHeight)
        rows[i].style['height'] = `${height}px`
        leftRows[i] ? leftRows[i].style['height'] = `${height}px` : undefined
        rightRows[i] ? rightRows[i].style['height'] = `${height}px` : undefined
    }

    syncScrollBarStatus(table)

    window.requestAnimationFrame(() => {
        dimensionInfo.originalMaxWidthArray = originalMaxWidthArray
        dimensionInfo.dimensionId = dimensionId
        const info = getDimensionInfo(table, columnSize)
        Object.assign(dimensionInfo, info)
    })
}

function syncScrollBarStatus(table) {
    const findDOM = find.bind(null, table)
    // header
    const [headerWrapper, headerRoot, header] = findDOM('header')

    // body
    const [bodyWrapper, bodyRoot, body] = findDOM('body')
    const [leftBodyWrapper, leftBodyRoot, leftBody] = findDOM('body', 'left')
    const [rightBodyWrapper, rightBodyRoot, rightBody] = findDOM('body', 'right')

    if (bodyRoot && bodyRoot.offsetHeight - bodyRoot.parentElement.offsetHeight > 1) {
        //body scroll vertically
        syncHeaderBodyVerticalScrollStatus(headerRoot, true)
        hideVerticalScrollBarOfTableFixedHeader(table, true)
        hideVerticalScrollBarOfBody(leftBodyRoot, true)

    } else {
        syncHeaderBodyVerticalScrollStatus(headerRoot, false)
        hideVerticalScrollBarOfTableFixedHeader(table, false)
        hideVerticalScrollBarOfBody(leftBodyRoot, false)
    }

    if (bodyRoot && bodyRoot.offsetWidth - bodyRoot.parentElement.offsetWidth > 1) {
        //body scroll horizontally
        hideHorizontalScrollBarOfFixBody(leftBodyRoot, true)
        hideHorizontalScrollBarOfFixBody(rightBodyRoot, true)
        syncBodyHorizontalScrollStatus(leftBodyRoot, true)
        syncBodyHorizontalScrollStatus(rightBodyRoot, true)
    } else {
        hideHorizontalScrollBarOfFixBody(leftBodyRoot, false)
        hideHorizontalScrollBarOfFixBody(rightBodyRoot, false)
        syncBodyHorizontalScrollStatus(leftBodyRoot, false)
        syncBodyHorizontalScrollStatus(rightBodyRoot, false)
    }

    // hide rightBody scrollbar when and only when it is empty
    if (rightBody && rightBody.children.length === 0) {
        hideVerticalScrollBarOfBody(rightBodyRoot, true)
    } else {
        hideVerticalScrollBarOfBody(rightBodyRoot, false)
    }

}

function getDimensionInfo(table, columnSize) {
    const findDOM = find.bind(null, table)
    // header
    const [headerWrapper, headerRoot, header] = findDOM('header')
    const [leftHeaderWrapper, leftHeaderRoot, leftHeader] = findDOM('header', 'left')
    const [rightHeaderWrapper, rightHeaderRoot, rightHeader] = findDOM('header', 'right')

    // body
    const [bodyWrapper, bodyRoot, body] = findDOM('body')
    const [leftBodyWrapper, leftBodyRoot, leftBody] = findDOM('body', 'left')
    const [rightBodyWrapper, rightBodyRoot, rightBody] = findDOM('body', 'right')

    const headerWidthArray = widthArray(header, columnSize, 'end', 'headerWidthArray')
    // console.log(`headerWidthArray`,headerWidthArray)
    const leftHeaderWidthArray = widthArray(leftHeader, columnSize, 'end', 'leftHeaderWidthArray')
    const rightHeaderWidthArray = widthArray(rightHeader, columnSize, 'start', 'rightHeaderWidthArray')
    const bodyWidthArray = widthArray(body, columnSize, 'end', 'bodyWidthArray')
    const leftBodyWidthArray = widthArray(leftBody, columnSize, 'end', 'leftBodyWidthArray')
    const rightBodyWidthArray = widthArray(rightBody, columnSize, 'start', 'rightBodyWidthArray')

    const maxWidthArray = max(
        headerWidthArray,
        leftHeaderWidthArray,
        rightHeaderWidthArray,
        bodyWidthArray,
        leftBodyWidthArray,
        rightBodyWidthArray
    )

    const headerHeightArray = heightArray(header)
    const leftHeaderHeightArray = heightArray(leftHeader)
    const rightHeaderHeightArray = heightArray(rightHeader)

    const bodyHeightArray = heightArray(body)
    const leftBodyHeightArray = heightArray(leftBody)
    const rightBodyHeightArray = heightArray(rightBody)

    return {
        headerWidthArray,
        leftHeaderWidthArray,
        rightHeaderWidthArray,
        bodyWidthArray,
        leftBodyWidthArray,
        rightBodyWidthArray,
        headerHeightArray,
        leftHeaderHeightArray,
        rightHeaderHeightArray,
        bodyHeightArray,
        leftBodyHeightArray,
        rightBodyHeightArray,
        maxWidthArray
    }
}

function isDimensionChanged(table, columnSize, dimensionInfo) {
    let result = false
    const info = getDimensionInfo(table, columnSize)
    const keys = Object.keys(info)
    for (let i = 0, len = keys.length; i < len; i++) {
        const k = keys[i]
        if (isArrayChange(dimensionInfo[k], info[k])) {
            console.log(k, ' is resized')
            console.log(dimensionInfo[k], info[k])
            result = true
            break
        }
    }
    return result
}

function heightArray(element) {
    const r = [], array = (element && element.children) || []
    for (let i = 0, len = array.length; i < len; i++) {
        const height = array[i].offsetHeight
        r.push(height)
    }
    return r
}

function removeColgroup(element) {
    const colgroup = element && element.getElementsByTagName('colgroup')[0]
    if (colgroup) {
        // element.style.minWidth = 'unset'
        element.removeChild(colgroup)
    }
}

function createColgroup(widthArray) {
    const sum = widthArray.reduce((prev, curr) => prev + curr, 0)
    const colgroup = document.createElement('colgroup')
    for (let i = 0, len = widthArray.length; i < len; i++) {
        // const width = i === len - 1 ? Math.ceil(widthArray[i] / sum * 100) + '%' : widthArray[i] + 'px'
        const width = widthArray[i] + 'px'
        const col = document.createElement('col')
        col.style.width = width
        colgroup.appendChild(col)
    }
    return colgroup
}

function find(table, a, b) {
    const className = `designare-table-${a}${b ? '-' + b : ''}`
    const wrapper = table.getElementsByClassName(className)[0]
    const container = wrapper && wrapper.getElementsByTagName('table')[0]
    const content = container && container.getElementsByTagName(a === 'header' ? 'thead' : 'tbody')[0]
    return [wrapper, container, content]
}

function getChildren(element) {
    return element ? element.children : []
}

function setStyle(element, key, value) {
    element ? element.style[key] = value : undefined
}

function appendChild(element, child) {
    element ? element.appendChild(child) : undefined
}

function hideHorizontalScrollBarOfFixBody(bodyRoot, scroll = false) {
    if (scroll) {
        bodyRoot ? bodyRoot.parentElement.style.height = 'calc(100% + 15px)' : undefined
        bodyRoot ? bodyRoot.parentElement.parentElement.style.height = 'calc(100% - 15px)' : undefined
    } else {
        bodyRoot ? bodyRoot.parentElement.style.height = '100%' : undefined
        bodyRoot ? bodyRoot.parentElement.parentElement.style.height = '100%' : undefined
    }

}

function hideVerticalScrollBarOfBody(bodyRoot, scroll = false) {
    if (scroll) {
        // hide
        bodyRoot ? bodyRoot.parentElement.parentElement.style.marginRight = '15px' : undefined
        bodyRoot ? bodyRoot.parentElement.style.marginRight = '-15px' : undefined
    } else {
        // normal
        bodyRoot ? bodyRoot.parentElement.parentElement.style.marginRight = '0' : undefined
        bodyRoot ? bodyRoot.parentElement.style.marginRight = '0' : undefined
    }
}

function syncHeaderBodyVerticalScrollStatus(headerRoot, scroll = false) {
    if (scroll) {
        headerRoot ? headerRoot.parentElement.parentElement.style.overflowY = 'scroll' : undefined
    } else {
        headerRoot ? headerRoot.parentElement.parentElement.style.overflowY = 'hidden' : undefined
    }
}

function syncBodyHorizontalScrollStatus(bodyRoot, scroll = false) {
    if (scroll) {
        bodyRoot ? bodyRoot.parentElement.style.overflowX = 'scroll' : undefined
    } else {
        bodyRoot ? bodyRoot.parentElement.style.overflowX = 'hidden' : undefined
    }
}

function hideVerticalScrollBarOfTableFixedHeader(table, scroll = false) {
    const el = table.getElementsByClassName('designare-table-fixed-header')[0]
    if (scroll) {
        el.classList.add('designare-mask')
    } else {
        el.classList.remove('designare-mask')
    }
}

function isArrayChange(a, b) {
    const len = a.length, length = b.length
    if (len !== length) return true
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) return true
    }
    return false
}

function code(columnsWithMeta, result = [], root = true) {
    for (let i = 0, len = columnsWithMeta.length; i < len; i++) {
        const col = columnsWithMeta[i]
        const { metaKey, width = '' } = col
        result.push(metaKey + width)
        col.children ? code(col.children, result, false) : undefined
    }
    return root ? result.join('') : undefined
}

function getColumnSize(columns) {
    return columns.reduce((prev, curr) => prev + curr.colSpan, 0)
}