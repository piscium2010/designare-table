import React, { Fragment } from 'react'
import { Context, TheadContext } from './context'
import { groupByDepth } from './util'
import Ths from './Ths'

export default class HTMLThead extends React.Component {
    static contextType = Context

    render() {
        const { tr: Tr, fixed, ...restProps } = this.props
        const { columns = [] } = this.context

        return (
            <TheadContext.Provider value={{ ...this.context, fixed: fixed }}>
                <thead {...restProps}>
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



