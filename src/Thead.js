import React from 'react'
import { Context, TheadContext } from './context'
import { groupByDepth, Queue } from './util'
import Ths from './Ths'

export default class Headers extends React.Component {
    static contextType = Context

    ref = React.createRef()

    queue = new Queue()

    getLevelColumns = () => this.queue.first()

    render() {
        const { tr: Tr, fixed, ...restProps } = this.props
        const { columns = [] } = this.context
        const myColumns = fixed ? columns.filter(c => c.fixed === fixed) : columns

        this.queue.clear()

        return (
            <TheadContext.Provider value={{
                ...this.context,
                getLevelColumns: this.getLevelColumns,
                fixed: fixed
            }}
            >
                <thead ref={this.ref} {...restProps}>
                    {
                        groupByDepth(columns).map((levelColumns, i) => {
                            this.queue.push(levelColumns)
                            return <Tr key={i} />
                        })
                    }
                </thead>
            </TheadContext.Provider>
        )
    }
}



