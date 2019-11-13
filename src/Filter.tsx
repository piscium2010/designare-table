import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ThsContext } from './context'
import Icons from './Icons'
import FilterLayer from './FilterLayer'

const defaultStyle: React.CSSProperties = { position: 'absolute', top: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }

interface IFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    activeColor?: string
    defaultColor?: string
    name?: string
    by?: string | ((...args) => boolean)
    render: () => JSX.Element
}

type state = {
    show: boolean
    top: number
    right: number
}

export default class Filter extends React.Component<IFilterProps, state> {
    static contextType = ThsContext
    static defaultProps = {
        children: () => 'please implement your filter content',
        onClick: () => { },
        render: () => <Icons.Filter />
    }

    state = { show: false, top: 0, right: 0 }

    private _container: HTMLElement
    private ref: React.RefObject<HTMLElement> = React.createRef()
    private filterValue: any

    get activeColor() {
        return this.props.activeColor || this.context.activeColor
    }

    get defaultColor() {
        return this.props.defaultColor || this.context.defaultColor
    }

    get dataKey() {
        return this.context.getColumn().dataKey
    }

    get columnMetaKey() {
        return this.context.getColumn().metaKey
    }

    get container() {
        return this._container || (this._container = this.context.getFilterLayerContainer(this.columnMetaKey))
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
        } else {
            this.context.setActiveFilter({ columnMetaKey, filterValue, name, dataKey, by })
        }
    }

    updateLayer = () => {
        const filters = this.filters
        const filter = this.my(filters)
        const isFilterInControlledMode = filters ? true : false
        const { children: content } = this.props
        const { show, top, right } = this.state
        const filterAPI = {
            trigger: filterValue => {
                const { name, by, ...restProps } = this.props
                const nextFilters = [], columnMetaKey = this.columnMetaKey, dataKey = this.dataKey
                this.filterValue = filterValue
                this.activeFilters.forEach((filter, metaKey) => {
                    if (metaKey !== columnMetaKey) {
                        nextFilters.push(filter)
                    }
                })
                const me = { filterValue, name, dataKey, by }
                isFilterInControlledMode ? Object.assign(me, restProps) : undefined
                isFilterInControlledMode ? undefined : this.setActiveFilter(filterValue)
                nextFilters.push(me)
                this.context.onChangeFilters(nextFilters)
            },
            filterValue: isFilterInControlledMode
                ? filter ? filter.filterValue : undefined
                : this.filterValue
        }

        ReactDOM.render(
            <FilterLayer
                animation={'slide-down'}
                className='designare-table-layer designare-shadow'
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
        this.context.addEventListener('tableDidMount', this.tableDidMount)
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
        ReactDOM.unmountComponentAtNode(this.container)
        this.context.removeEventListener('tableDidMount', this.tableDidMount)
    }

    render() {
        if (this.context.contextName !== 'thead') throw 'designare-table: Filter component should be within Header component'
        const { show } = this.state
        const {
            by,
            className = '',
            children: C,
            style = {},
            onClick,
            activeColor,
            defaultColor,
            render: Render,
            ...restProps } = this.props
        const width = style.width || 18
        const isActive = this.isActive || show

        return (
            <React.Fragment>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <div
                    ref={this.ref as any}
                    className={`designare-table-filter designare-transition ${className} ${this.columnMetaKey} ${isActive ? 'active' : ''}`}
                    onClick={this.onToggleFilter}
                    style={{ width: width, ...defaultStyle, ...style, color: isActive ? this.activeColor : this.defaultColor }}
                    {...restProps}>
                    <Render />
                </div>
            </React.Fragment>
        )
    }
}

