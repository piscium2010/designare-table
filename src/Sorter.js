import React from 'react'
import { ThsContext } from './context'
import Icons from './icons'

const defaultStyle = { display: 'table-cell', position: 'relative', cursor: 'pointer', userSelect: 'none', width: 15 }
const commonStyle = { transition: 'color .3s', position: 'absolute', left: 5 }

export default class Sorter extends React.Component {
    static contextType = ThsContext

    static defaultProps = {
        activeColor: '#1890ff',
        by: 'string',
        defaultColor: '#bfbfbf',
        directions: ['asc', 'des'],
        onClickCapture: () => { },
        render: (direction, directions, defaultColor, activeColor) => {
            const icons = directions.filter(d => d !== 'default')
            return (
                <React.Fragment>
                    {
                        icons.length === 2
                            ? <React.Fragment>
                                <i style={{ color: direction === 'asc' ? activeColor : defaultColor, bottom: 'calc(50% - 9px)', ...commonStyle }}>
                                    <Icons.SortUp />
                                </i>
                                <i style={{ color: direction === 'des' ? activeColor : defaultColor, top: 'calc(50% - 6px)', ...commonStyle }}>
                                    <Icons.SortDown />
                                </i>
                            </React.Fragment>
                            :
                            <i style={{
                                color: direction === icons[0] ? activeColor : defaultColor,
                                top: '50%', transform: icons[0] === 'asc' ? 'translateY(-30%)' : 'translateY(-55%)',
                                ...commonStyle
                            }}
                            >
                                {icons[0] === 'asc' ? <Icons.SortUp /> : icons[0] === 'des' ? <Icons.SortDown /> : null}
                            </i>
                    }
                </React.Fragment>
            )
        }
    }

    get dataKey() {
        return this.context.getColumn().dataKey
    }

    get columnMetaKey() {
        return this.context.getColumn().metaKey
    }

    setActiveSorter = sorter => {
        if (sorter && this.dataKey === sorter.dataKey) {
            console.log(`in`,this.dataKey)
            const direction = sorter.direction
            const { by, directions = [] } = this.props
            const status = ['default'].concat(directions)
            if (!status.includes(direction)) {
                throw `direction: ${direction || 'empty'} is not in Sorter of ${this.dataKey}`
            }
            this.context.setActiveSorter({ columnMetaKey: this.columnMetaKey, direction, by: sortMethod(by), dataKey: this.dataKey })
        }
    }

    tableDidMount = () => {
        const { getDefaultSorter, getSorter } = this.context
        const sorter = getSorter(), defaultSorter = getDefaultSorter()
        if (!sorter && defaultSorter) {
            this.setActiveSorter(defaultSorter)
        }
    }

    componentDidMount() {
        // console.log(`sorter did mount`,)
        const { addEventListener, getSorter } = this.context
        const sorter = getSorter()
        addEventListener('tableDidMount', this.tableDidMount)
        if (sorter) this.setActiveSorter(sorter)
    }

    componentWillUnmount() {
        this.context.removeEventListener('tableDidMount', this.tableDidMount)
    }

    render() {
        const { contextName, getActiveSorter, getSorter, onChangeSorter } = this.context
        // console.log(`this.context`,this.context)
        if (contextName !== 'thead') throw 'Sorter component should be within Header component'
        const { activeColor, by, defaultColor, className = '', directions = [], style, onClickCapture, render, ...restProps } = this.props
        const s = getActiveSorter(), dataKey = this.dataKey
        const isActive = s.dataKey === dataKey && directions.includes(s.direction)
        const status = directions.concat('default')
        const i = isActive ? status.indexOf(s.direction) : 0
        const onClick = () => {
            const isSorterInControlledMode = getSorter() ? true : false
            const next = isActive ? i + 1 : 0
            console.log(`sorter`,s)
            const direction = status[next % status.length]

            onChangeSorter({ dataKey, direction, by })
            onClickCapture()
            if (!isSorterInControlledMode) {
                this.setActiveSorter({ dataKey, direction })
            }
        }

        return (
            <div className={`designare-sort ${className}`} style={{ ...defaultStyle, ...style }} onClickCapture={onClick} {...restProps}>
                {render(isActive ? status[i] : 'default', directions, defaultColor, activeColor)}
            </div>
        )
    }
}

function sortByNumeric(a, b) {
    const left = a / 1, right = b / 1 // convert to number
    if (left > right) {  return 1 }
    if (left === right) { return 0 }
    if (left < right) { return -1 }
}

function sortByString(a, b) {
    const left = a, right = b
    if (left > right) return 1
    if (left == right) return 0
    if (left < right) return -1
}

function sortMethod(by) {
    let func = by
    switch (func) {
        case 'number':
            func = sortByNumeric
            break
        case 'string':
            func = sortByString
            break
        case 'date':
            func = sortByNumeric
            break
        case 'server':
            break
        default:
            if (typeof func !== 'function') throw `prop 'by' of Sorter should be one of 'number', 'string', 'date' or function`
    }
    return func
}
