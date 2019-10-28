import React, { Fragment } from 'react'
import { Context, TheadContext } from './context'
import { groupByDepth } from './util'
import Ths from './Ths'
import Observe from './DOMObserver'

export default class HTMLThead extends React.Component {
    static contextType = Context

    constructor(props) {
        super(props)
        this.observer = Observe(this)
        this.ref = React.createRef()
    }

    componentDidMount() {
        this.observer.observe(this.ref.current)
    }

    componentWillUnmount() {
        this.observer.disconnect()
    }

    render() {
        const { tr: Tr, fixed, ...restProps } = this.props
        const { columns = [] } = this.context

        return (
            <TheadContext.Provider value={{ ...this.context, fixed: fixed }}>
                <thead {...restProps} ref={this.ref}>
                    {
                        groupByDepth(columns).map((columnsOfRow, i) => {
                            return (
                                <Fragment key={i}>
                                    {Tr({ cells: <Ths columnsOfRow={columnsOfRow} /> })}
                                </Fragment>
                            )
                        })
                    }
                </thead>
            </TheadContext.Provider>
        )
    }
}



