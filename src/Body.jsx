import React, { useRef, useEffect } from 'react'
import HTMLTbody from './HTMLTbody'
import { Context } from './context'

export default class Body extends React.Component {
    static contextType = Context
    static defaultProps = {
        className: '',
        tr: ({ cells }) => <tr>{cells}</tr>
    }

    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context
        const { className, tr, style, onScroll, ...restProps } = this.props
        return (
            <div
                className={`designare-table-fixed-body animate ${className}`}
                style={{ flex: '0 1 100%', position: 'relative', overflow: 'hidden', opacity: isInit() ? 1 : 0, ...style }}
                {...restProps}
            >
                <Normal
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                    onScroll={onScroll}
                >
                    <HTMLTbody tr={tr} />
                </Normal>
                <Left
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                >
                    <HTMLTbody fixed='left' tr={tr} />
                </Left>
                <Right
                    syncScrolling={syncScrolling}
                    removeSyncScrolling={removeSyncScrolling}
                >
                    <HTMLTbody fixed='right' tr={tr} />
                </Right>
            </div>
        )
    }
}

function Normal(props) {
    const ref = useRef(null)
    useEffect(() => {
        props.syncScrolling(ref.current, 'both')
        return () => {
            props.removeSyncScrolling(ref.current)
        }
    }, [])

    return (
        <div ref={ref} className='designare-table-body' style={{ width: '100%', height: '100%', overflow: 'auto' }} onScroll={props.onScroll}>
            <table>
                {props.children}
            </table>
        </div>
    )
}

function Left(props) {
    const ref = useRef(null)
    useEffect(() => {
        props.syncScrolling(ref.current, 'scrollTop')
        return () => {
            props.removeSyncScrolling(ref.current)
        }
    }, [])
    return (
        <div className='designare-table-body-left' style={{ position: 'absolute', left: 0, top: 0, bottom: 15, overflow: 'hidden', height: '100%' }}>
            <div ref={ref} style={{ height: '100%', overflowY: 'auto' }}>
                <table>
                    {props.children}
                </table>
            </div>
        </div>
    )
}

function Right(props) {
    const ref = useRef(null)
    useEffect(() => {
        props.syncScrolling(ref.current, 'scrollTop')
        return () => {
            props.removeSyncScrolling(ref.current)
        }
    }, [])
    return (
        <div className='designare-table-body-right' style={{ position: 'absolute', right: 0, top: 0, bottom: 15, overflow: 'hidden', height: '100%' }}>
            <div ref={ref} style={{ height: '100%', overflowY: 'auto' }}>
                <table>
                    {props.children}
                </table>
            </div>
        </div>
    )
}