import React from 'react'
import ReactDOM from 'react-dom'
import { ThsContext } from './context'
import Icons from './Icons'
import Layer from '@piscium2010/lime/Layer'
import '@piscium2010/lime/Layer/layer.css'

const FilterLayer = ({ content, filterAPI, ...restProps }) => <Layer {...restProps}>{content(filterAPI)}</Layer>
const defaultStyle = { position: 'absolute', top: 0, right: 3, bottom: 0, display: 'flex', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }

export default class Filter extends React.Component {
    static contextType = ThsContext
    static defaultProps = {
        activeColor: '#1890ff',
        children: () => 'please implement your filter content',
        defaultColor: '#bfbfbf',
        onClick: () => { }
    }

    ref = React.createRef()
    state = { show: false, top: 0, right: 0 }

    get dataKey() {
        return this.context.getColumn().dataKey
    }

    get columnMetaKey() {
        return this.context.getColumn().metaKey
    }

    get container() {
        return this.context.getFilterLayerContainer(this.columnMetaKey)
    }

    get defaultFilters() {
        return this.context.getDefaultFilters()
    }

    get filters() {
        return this.context.getFilters()
    }

    get activeFilters() {
        return this.context.getActiveFilters()
    }

    get isActive() {
        let result = false
        this.activeFilters.forEach((f, columnMetaKey) => {
            if (columnMetaKey === this.columnMetaKey && f.filterValue !== undefined) {
                result = true
            }
        })
        return result
    }

    my(filters = []) {
        const dataKey = this.dataKey, name = this.props.name
        return filters.find(f => f.name ? f.name === name : f.dataKey === dataKey)
    }

    on = () => {
        const { top, right, height } = this.ref.current.getBoundingClientRect()
        this.container.classList.add('show')
        window.requestAnimationFrame(() => {
            this.setState({ show: true, top: top + height, right })
        })
    }

    off = () => {
        this.container.classList.remove('show')
        this.setState({ show: false })
    }

    onToggleFilter = evt => {
        const show = !this.state.show
        show ? this.on() : this.off()
        this.props.onClick(evt)
    }

    onBlur = evt => {
        const className = evt.target.className
        if (className.includes
            && className.includes(this.columnMetaKey)
            && className.includes('designare-table-filter')) {
            // evt from filter icon, do nothing, leave it to onToggleFilter func
            return
        }
        this.off()
    }

    setActiveFilter = filterValue => {
        const { by, name } = this.props
        const { getColumn, removeActiveFilter } = this.context
        const { metaKey: columnMetaKey, dataKey } = getColumn()
        if (filterValue === undefined) {
            removeActiveFilter(columnMetaKey)
            return
        }
        this.context.setActiveFilter({ columnMetaKey, filterValue, name, dataKey, by })
    }

    updateLayer = () => {
        const filters = this.filters
        const filter = this.my(filters)
        const isFilterInControlledMode = filters ? true : false
        const { children: content } = this.props
        const { show, top, right } = this.state

        const filterAPI = {
            trigger: filterValue => {
                const { name, by } = this.props
                const nextFilters = [], columnMetaKey = this.columnMetaKey, dataKey = this.dataKey
                this.filterValue = filterValue
                this.activeFilters.forEach((filter, metaKey) => {
                    if (metaKey !== columnMetaKey) {
                        nextFilters.push(filter)
                    }
                })
                nextFilters.push({ filterValue, name, dataKey, by })
                console.log(`isFilterInControlledMode`,isFilterInControlledMode)
                isFilterInControlledMode ? undefined : this.setActiveFilter(filterValue)
                this.context.onChangeFilters(nextFilters)
            },
            filterValue: isFilterInControlledMode
                ? filter ? filter.filterValue : undefined
                : this.filterValue
        }
        // console.log(`update layer`,)
        ReactDOM.render(
            <FilterLayer
                animation={'slide-down'}
                className='designare-table-layer designare'
                onBlur={this.onBlur}
                top={top}
                right={window.innerWidth - right}
                show={show}
                content={content}
                filterAPI={filterAPI}
            />
            ,
            this.container
        )
    }

    tableDidMount = () => {
        const filters = this.filters || this.defaultFilters
        if (filters) {
            const filter = this.my(filters)
            this.setActiveFilter(filter ? filter.filterValue : undefined)
            this.filterValue = filter ? filter.filterValue : undefined
        }
    }

    componentDidMount() {
        // console.log(`filter did mount`,)
        this.context.addEventListener('tableDidMount', this.tableDidMount)
        this.container.className.includes('show') ? this.on() : undefined
    }

    componentDidUpdate() {
        const filters = this.filters
        if (filters) {
            const filter = this.my(filters)
            this.setActiveFilter(filter ? filter.filterValue : undefined)
        }
        this.updateLayer()
    }

    componentWillUnmount() {
        this.context.removeEventListener('tableDidMount', this.tableDidMount)
    }

    render() {
        if (this.context.contextName !== 'thead') throw 'designare-table: Filter component should be within Header component'
        const { show } = this.state
        const { by,
            className = '',
            children: C,
            style = {},
            onClick,
            activeColor,
            defaultColor,
            ...restProps } = this.props
        const width = style.width || 15
        const isActive = this.isActive || show
        return (
            <span>
                &nbsp;&nbsp;&nbsp;
                <div
                    ref={this.ref}
                    className={`designare-table-filter designare-transition ${className} ${this.columnMetaKey} ${isActive ? 'active' : ''}`}
                    onClick={this.onToggleFilter}
                    style={{ width: width, ...defaultStyle, ...style, color: isActive ? activeColor : defaultColor }}
                    {...restProps}>
                    <Icons.Filter />
                </div>
            </span>
        )
    }
}

function print(filter) {
    const name = filter.name ? `name: ${filter.name}, ` : ''
    const dataKey = filter.dataKey ? `dataKey: ${filter.dataKey}, ` : ''
    const value = Array.isArray(filter.value) ? `value: [${filter.value}]` : `value: ${filter.value}`
    return `{${name}${dataKey}${value}}`
}
