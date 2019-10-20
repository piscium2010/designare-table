import React, { useRef, useEffect } from 'react'
import Thead from './HTMLThead'
import { Context } from './context'

export default class Header extends React.Component {
    static contextType = Context
    static defaultProps = {
        className: '',
        tr: ({ cells }) => <tr>{cells}</tr>
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
                <Animate style={{ marginBottom: 0, position: 'relative', overflowX: 'hidden' }}>
                    <Normal
                        syncScrolling={syncScrolling}
                        removeSyncScrolling={removeSyncScrolling}
                    >
                        <Thead tr={tr} />
                    </Normal>
                    <Left>
                        <Thead fixed='left' tr={tr} />
                    </Left>
                    <Right>
                        <Thead fixed='right' tr={tr} />
                    </Right>
                </Animate>
            </div>
        )
    }
}

function Normal(props) {
    const ref = useRef(null)
    useEffect(() => {
        props.syncScrolling(ref.current, 'scrollLeft')
        return () => {
            props.removeSyncScrolling(ref.current)
        }
    }, [])

    return (
        <div ref={ref} className='designare-table-header' style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
            <table>
                {props.children}
            </table>
        </div>
    )
}

function Left(props) {
    return (
        <div className='designare-table-header-left' style={{ position: 'absolute', overflow: 'hidden', top: 0, left: 0, }}>
            <table>
                {props.children}
            </table>
        </div>
    )
}

function Right(props) {
    return (
        <div className='designare-table-header-right' style={{ overflow: 'hidden', top: 0, right: 0, position: 'absolute' }}>
            <table>
                {props.children}
            </table>
        </div>
    )
}

function Animate(props) {
    const ref = useRef(null)
    useEffect(() => {
        window.requestAnimationFrame(() => {
        })
        setTimeout(()=>{
            ref.current.classList.add('animate')

        },1000)
    }, [])
    return (
        <div ref={ref} {...props}>{props.children}</div>
    )
}