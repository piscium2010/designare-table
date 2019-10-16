import React from 'react'
import ReactDOM from 'react-dom'
import { ThsContext } from './context'
import Icons from './icons'
import Layer from '@piscium2010/lime/Layer'
import '@piscium2010/lime/Layer/layer.css'

const defaultStyle = { display: 'table-cell', position: 'absolute', top: 0, right: 3, bottom: 0, display: 'flex', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' }

export default class Filter extends React.Component {
    static contextType = ThsContext
    static defaultProps = { onClick: () => { } }

    ref = React.createRef()
    state = { show: false, top: 0, right: 0 }

    get columnKey() {
        return this.context.getColumn().key
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

    getFilter(filters) {
        if (!filters) return {}
        const columnKey = this.columnKey, name = this.props.name
        const activeFilters = [...this.activeFilters.values()]
        const filterHasSameColumnKeyButHasNoName = activeFilters.find(f => f.key === columnKey && !f.name)
        if (filterHasSameColumnKeyButHasNoName)
            throw `More than one Filter component is found for ${print(filterHasSameColumnKeyButHasNoName)}.\n Please distinguish Filter component by specify unique prop 'name' \n e.g.\nfilter: <Filter name='address'/> \ntable: <SwiftTable filters={[{name:'address', value:'address'}]}/>`
        const one = filters.find(f =>
            f.name ? f.name === name : f.key === columnKey
        )
        return one || {}
    }

    on = () => {
        const { top, right, height } = this.ref.current.getBoundingClientRect()
        this.container.classList.add('show')
        window.requestAnimationFrame(() => {
            this.setState({ show: true, top: top + height, right }, () => console.log(`state`,this.state))
        })
    }

    off = () => {
        this.container.classList.remove('show')
        this.setState({ show: false })
    }

    onToggleFilter = evt => {
        const show = !this.state.show
        console.log(`toggle`,this.state.show)
        show ? this.on() : this.off()
        this.props.onClick(evt)
    }

    onBlur = evt => {
        const className = evt.target.className
        console.log(`blur`, className)
        if (className.includes
            && className.includes(this.columnMetaKey)
            && className.includes('swift-table-filter')) {
            // evt from filter icon, do nothing, leave it to onToggleFilter func
            return
        }
        this.off()
    }

    setActiveFilter = value => {
        // console.log(`value`, value)
        const { by, name } = this.props
        const { getColumn, removeActiveFilter } = this.context
        const { metaKey: columnMetaKey, dataKey } = getColumn()
        if (value === undefined) {
            removeActiveFilter(columnMetaKey)
            return
        }
        this.context.setActiveFilter({ columnMetaKey, value, name, dataKey, by })
    }

    updateLayer = () => {
        const {
            children: content = () => 'implement your filter here'
        } = this.props
        const { show, top, right } = this.state
        const filterAPI = {
            trigger: value => {
                const { name, by } = this.props
                const nextFilters = [], columnMetaKey = this.columnMetaKey, key = this.columnKey
                const isFilterInControlledMode = this.filters ? true : false

                this.activeFilters.forEach((value, metaKey) => {
                    if (metaKey !== columnMetaKey) {
                        nextFilters.push(value)
                    }
                })
                nextFilters.push({ value, name, key, by })
                if (!isFilterInControlledMode) {
                    this.setActiveFilter(value)
                }
                this.context.onChangeFilters(nextFilters)
            }
        }
        ReactDOM.render(
            <Layer
                animation={'slide-down'}
                className='swift-table-layer'
                onBlur={this.onBlur}
                top={top}
                right={window.innerWidth - right}
                show={show}
            >
                {content(filterAPI)}
            </Layer>,
            this.container
        )
    }

    tableDidMount = () => {
        const filters = this.filters || this.defaultFilters
        if (filters) {
            const filter = this.getFilter(filters)
            this.setActiveFilter(filter.value)
        }
    }

    componentDidMount() {
        this.context.addEventListener('tableDidMount', this.tableDidMount)
        this.container.className.includes('show') ? this.on() : undefined
    }

    componentDidUpdate() {
        const filters = this.filters
        if (filters) {
            const filter = this.getFilter(filters)
            this.setActiveFilter(filter.value)
        }
        this.updateLayer()
    }

    componentWillUnmount() {
        this.context.removeEventListener('tableDidMount', this.tableDidMount)
    }

    render() {
        if (this.context.contextName !== 'thead') throw 'Sorder should be within Header component'
        const { by, className = '', children: C, style = {}, onClick, ...restProps } = this.props
        const width = style.width || 15
        const minWidth = style.minWidth || width

        return (
            <div style={{ minWidth: minWidth, width: width, display: 'table-cell' }}>
                <div
                    ref={this.ref}
                    className={`swift-table-filter ${className} ${this.columnMetaKey}`}
                    onClick={this.onToggleFilter}
                    style={{ width: width, ...defaultStyle, ...style }}
                    {...restProps}>
                    <Icons.Filter />
                </div>
            </div>
        )
    }
}

function print(filter) {
    const name = filter.name ? `name: ${filter.name}, ` : ''
    const key = filter.key ? `key: ${filter.key}, ` : ''
    const value = Array.isArray(filter.value) ? `value: [${filter.value}]` : `value: ${filter.value}`
    return `{${name}${key}${value}}`
}
