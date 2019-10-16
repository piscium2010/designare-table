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
        const { tr: Tr, fix, ...restProps } = this.props
        const { columns = [] } = this.context
        const myColumns = fix ? columns.filter(c => c.fix === fix) : columns

        this.queue.clear()

        return (
            <TheadContext.Provider value={{
                ...this.context,
                getLevelColumns: this.getLevelColumns,
                fix: fix
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



