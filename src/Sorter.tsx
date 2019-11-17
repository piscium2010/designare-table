import * as React from 'react'
import { Fragment } from 'react'
import { ThsContext } from './context'
import Icons from './Icons'
import { ERR3 } from './messages'

const defaultStyle: React.CSSProperties = { position: 'absolute', cursor: 'pointer', userSelect: 'none', top: 0, display: 'inline-block', height: 'inherit' }
const commonStyle: React.CSSProperties = { position: 'absolute', left: 0, top: '0', width: 9, height: 'inherit', display: 'flex' }

interface ISorterProps extends React.HTMLAttributes<HTMLDivElement> {
    activeColor?: string
    defaultColor?: string
    by?: string | ((...args) => number)
    directions?: Array<string>
    render: (args: { direction: string, directions: string[], defaultColor: string, activeColor: string }) => JSX.Element
}

export default class Sorter extends React.Component<ISorterProps, {}> {
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
                                    <Icons.SortUp style={{ width: '100%' }} />
                                </div>
                                <div className={`designare-icon designare-transition`} style={{ ...commonStyle, color: direction === 'des' ? activeColor : defaultColor }}>
                                    <Icons.SortDown style={{ width: '100%' }} />
                                </div>
                            </React.Fragment>
                            :
                            <div className={`designare-icon designare-transition`} style={{
                                ...commonStyle,
                                color: direction === icons[0] ? activeColor : defaultColor
                            }}
                            >
                                {icons[0] === 'asc' ? <Icons.SortUp style={{ width: '100%' }} /> : icons[0] === 'des' ? <Icons.SortDown style={{ width: '100%' }} /> : null}
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
            if (status.indexOf(direction) < 0) {
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
        const isActive = s.dataKey === dataKey && directions.indexOf(s.direction) >= 0
        const status = directions.concat('default')
        const i = isActive ? status.indexOf(s.direction) : 0
        const onClick = evt => {
            const isSorterInControlledMode = getSorter() ? true : false
            const next = isActive ? i + 1 : 0
            const direction = status[next % status.length]

            onChangeSorter({ dataKey, direction, by, ...restProps })
            onClickCapture(evt)
            if (!isSorterInControlledMode) {
                this.setActiveSorter({ dataKey, direction })
            }
        }

        return (
            <Fragment>
                <span style={{ height: 'inherit', paddingRight: 12 }}>
                    &nbsp;
                    <div className={`designare-table-sorter ${className}`} style={{ ...defaultStyle, ...style }} onClickCapture={onClick} {...restProps}>
                        <Render direction={isActive ? status[i] : 'default'} directions={directions} defaultColor={this.defaultColor} activeColor={this.activeColor} />
                    </div>
                </span>
            </Fragment>
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

