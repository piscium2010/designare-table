import * as React from 'react'
import { useRef, useEffect } from 'react'
import HTMLThead from './HTMLThead'
import Animate from './Animate'
import { Context } from './context'

interface ITheadProps extends React.HTMLAttributes<HTMLDivElement> {
    tr?: (args?: {
        cells: JSX.Element
    }) => JSX.Element
}

export default class Thead extends React.Component<ITheadProps, {}> {
    static contextType = Context
    static defaultProps = {
        onScroll: evt => { }
    }

    private _headerWidth: number
    private _tableWidth: number
    private scrollLeft: number
    private headerRef: React.RefObject<HTMLDivElement>
    private tableRef: React.RefObject<HTMLTableElement>
    private leftRef: React.RefObject<HTMLDivElement>
    private rightRef: React.RefObject<HTMLDivElement>
    private shadowLeft: boolean
    private shadowRight: boolean
    private time: any

    get headerWidth() {
        return this._headerWidth || (this._headerWidth = this.headerRef.current.offsetWidth)
    }

    get tableWidth() {
        return this._tableWidth || (this._tableWidth = this.tableRef.current.offsetWidth)
    }

    set headerWidth(value) {
        this._headerWidth = value
    }

    set tableWidth(value) {
        this._tableWidth = value
    }

    constructor(props) {
        super(props)
        this.scrollLeft = -1
        this.headerRef
        this.tableRef = React.createRef()
        this.leftRef = React.createRef()
        this.rightRef = React.createRef()
        this.shadowLeft = false
        this.shadowRight = false
        this.time = new Date()
    }

    onScroll = evt => {
        this.shadow(evt.target.scrollLeft, evt.timeStamp)
        this.props.onScroll(evt)
    }

    shadow = (scrollLeft, current) => {
        if(this.scrollLeft === scrollLeft) return
        this.scrollLeft = scrollLeft

        current - this.time > 2000 ? this.reset() : undefined
        this.time = current

        const scrollRight = this.tableWidth - scrollLeft - this.headerWidth

        if (scrollLeft == 0) {
            this.shadowLeft ? this.leftRef.current.classList.remove('designare-shadow') : undefined
            this.shadowLeft = false
        } else {
            this.shadowLeft ? undefined : this.leftRef.current.classList.add('designare-shadow')
            this.shadowLeft = true
        }
        if (scrollRight - 17 <= 0) {
            this.shadowRight ? this.rightRef.current.classList.remove('designare-shadow') : undefined
            this.shadowRight = false
        } else {
            this.shadowRight ? undefined : this.rightRef.current.classList.add('designare-shadow')
            this.shadowRight = true
        }
    }

    reset = () => {
        this.tableWidth = undefined
        this.headerWidth = undefined
    }

    componentDidUpdate() {
        this.shadow(this.headerRef.current.scrollLeft, new Date())
    }

    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context
        const { className = '', tr, style, ...restProps } = this.props
        return (
            <div
                className={`designare-table-fixed-header ${className}`}
                style={{ flex: '0 0 auto', overflow: 'hidden', opacity: isInit() ? 1 : 0, ...style }}
                {...restProps}
            >
                <Animate style={{ marginBottom: 0, position: 'relative', overflowX: 'hidden', backgroundColor: 'inherit', zIndex: 1 }}
                onScroll={evt => { evt.preventDefault(); evt.target.scrollTop = 0}}
                >
                    <Left leftRef={this.leftRef}>
                        <HTMLThead fixed='left' tr={tr} />
                    </Left>
                    <Normal
                        deliverHeaderRef={ref => this.headerRef = ref}
                        tableRef={this.tableRef}
                        syncScrolling={syncScrolling}
                        removeSyncScrolling={removeSyncScrolling}
                        onScroll={this.onScroll}
                    >
                        <HTMLThead tr={tr} />
                    </Normal>
                    <Right rightRef={this.rightRef}>
                        <HTMLThead fixed='right' tr={tr} />
                    </Right>
                </Animate>
            </div>
        )
    }
}

function Normal(props) {
    const ref = useRef(null)
    const { syncScrolling, removeSyncScrolling, tableRef, deliverHeaderRef, onScroll } = props
    useEffect(() => {
        deliverHeaderRef(ref)
        syncScrolling(ref.current, 'scrollLeft')
        return () => removeSyncScrolling(ref.current)
    }, [])

    return (
        <div
            ref={ref}
            className='designare-table-header'
            style={{ overflowX: 'scroll', overflowY: 'hidden' }}
            onScroll={onScroll}
        >
            <table ref={tableRef}>
                {props.children}
            </table>
        </div>
    )
}

function Left(props) {
    const { leftRef } = props
    return (
        <div
            ref={leftRef}
            className='designare-table-header-left'>
            <table>
                {props.children}
            </table>
        </div>
    )
}

function Right(props) {
    const { rightRef } = props
    return (
        <div
            ref={rightRef}
            className='designare-table-header-right'>
            <table>
                {props.children}
            </table>
        </div>
    )
}
