import * as React from 'react'
import { useRef, useEffect } from 'react'
import Thead from './HTMLThead'
import Animate from './Animate'
import { Context } from './context'
import * as debounce from 'lodash/debounce'

export default class Header extends React.Component {
    static contextType = Context
    static defaultProps = {
        className: '',
        onScroll: () => { }
    }

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
        this.headerRef
        this.tableRef = React.createRef()
        this.leftRef = React.createRef()
        this.rightRef = React.createRef()
        this.shadowLeft = false
        this.shadowRight = false
        this.debouncedReset = debounce(this.reset, 100)
    }

    onScroll = evt => {
        this.shadow(evt.target.scrollLeft)
        this.props.onScroll(evt)
        this.debouncedReset()
    }

    shadow = scrollLeft => {
        const scrollRight = this.tableWidth - scrollLeft - this.headerWidth
        if (scrollLeft == 0) {
            this.shadowLeft ? this.leftRef.current.classList.remove('designare-shadow') : undefined
            this.shadowLeft = false
        } else {
            this.shadowLeft ? undefined : this.leftRef.current.classList.add('designare-shadow')
            this.shadowLeft = true
        }
        if (scrollRight <= 0) {
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
        this.shadow(this.headerRef.current.scrollLeft)
    }

    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context
        const { className, tr, style, ...restProps } = this.props
        return (
            <div
                className={`designare-table-fixed-header ${className}`}
                style={{ flex: '0 0 auto', overflow: 'hidden', opacity: isInit() ? 1 : 0, ...style }}
                {...restProps}
            >
                <Animate style={{ marginBottom: 0, position: 'relative', overflowX: 'hidden', backgroundColor: 'inherit' }}>
                    <Left leftRef={this.leftRef}>
                        <Thead fixed='left' tr={tr} />
                    </Left>
                    <Normal
                        deliverHeaderRef={ref => this.headerRef = ref}
                        tableRef={this.tableRef}
                        syncScrolling={syncScrolling}
                        removeSyncScrolling={removeSyncScrolling}
                        onScroll={this.onScroll}
                    >
                        <Thead tr={tr} />
                    </Normal>
                    <Right rightRef={this.rightRef}>
                        <Thead fixed='right' tr={tr} />
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
