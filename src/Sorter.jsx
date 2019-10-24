import React from 'react'
import { ThsContext } from './context'
import Icons from './Icons'
import { ERR3 } from './errorMessage'

const defaultStyle = { position: 'relative', cursor: 'pointer', userSelect: 'none', padding: '0 4px' }
const commonStyle = { position: 'absolute', left: 4, top: '50%', width: 9, transform: 'translate(0,-8px)' }

export default class Sorter extends React.Component {
    static contextType = ThsContext
    static defaultProps = {
        by: 'string',
        directions: ['asc', 'des'],
        onClickCapture: () => { },
        render: ({ direction, directions, defaultColor, activeColor }) => {
            const icons = directions.filter(d => d !== 'default')
            return (
                <React.Fragment>
                    {
                        icons.length === 2
                            ? <React.Fragment>
                                <div className={`designare-icon designare-transition`} style={{ ...commonStyle, color: direction === 'asc' ? activeColor : defaultColor }}>
                                    <Icons.SortUp />
                                </div>
                                <div className={`designare-icon designare-transition`} style={{ ...commonStyle, color: direction === 'des' ? activeColor : defaultColor }}>
                                    <Icons.SortDown />
                                </div>
                            </React.Fragment>
                            :
                            <div className={`designare-icon designare-transition`} style={{
                                ...commonStyle,
                                top: '50%',
                                transform: icons[0] === 'asc' ? 'translateY(-30%)' : 'translateY(-55%)',
                                color: direction === icons[0] ? activeColor : defaultColor
                            }}
                            >
                                {icons[0] === 'asc' ? <Icons.SortUp /> : icons[0] === 'des' ? <Icons.SortDown /> : null}
                            </div>
                    }
                </React.Fragment>
            )
        }
    }

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

    setActiveSorter = sorter => {
        if (!this.dataKey) throw ERR3
        if (sorter && this.dataKey === sorter.dataKey) {
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
        const sorter = getSorter() || getDefaultSorter()
        this.setActiveSorter(sorter)
    }

    componentDidMount() {
        const { addEventListener } = this.context
        addEventListener('tableDidMount', this.tableDidMount)
    }

    componentDidUpdate() {
        this.update()
    }

    update() {
        const { getSorter } = this.context
        const sorter = getSorter()
        if (sorter) this.setActiveSorter(sorter)
    }

    componentWillUnmount() {
        this.context.removeEventListener('tableDidMount', this.tableDidMount)
    }

    render() {
        const { contextName, getActiveSorter, getSorter, onChangeSorter } = this.context
        if (contextName !== 'thead') throw 'Sorter component should be within Header component'
        const { activeColor, by, defaultColor, className = '', directions = [], style, onClickCapture, render: Render, ...restProps } = this.props
        const s = getActiveSorter(), dataKey = this.dataKey
        const isActive = s.dataKey === dataKey && directions.includes(s.direction)
        const status = directions.concat('default')
        const i = isActive ? status.indexOf(s.direction) : 0
        const onClick = () => {
            const isSorterInControlledMode = getSorter() ? true : false
            const next = isActive ? i + 1 : 0
            const direction = status[next % status.length]

            onChangeSorter({ dataKey, direction, by, ...restProps })
            onClickCapture()
            if (!isSorterInControlledMode) {
                this.setActiveSorter({ dataKey, direction })
            }
        }

        return (
            <span className={`designare-table-sorter ${className}`} style={{ ...defaultStyle, ...style }} onClickCapture={onClick} {...restProps}>
                &nbsp;&nbsp;
                {/* Render(isActive ? status[i] : 'default', directions, defaultColor, activeColor) */}
                <Render direction={isActive ? status[i] : 'default'} directions={directions} defaultColor={this.defaultColor} activeColor={this.activeColor} />
            </span>
        )
    }
}

function sortByNumeric(a, b) {
    let left = a / 1, right = b / 1 // convert to number
    left = isNaN(left) ? 0 : left
    right = isNaN(right) ? 0 : right
    return left - right
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

