import React from 'react'
import { TheadContext, ThsContext } from './context'
import Th from './Th'
import { Queue } from './util'

export default class Ths extends React.Component {
    static contextType = TheadContext

    queue = new Queue()

    getColumn = () => this.queue.first() // exclusively used by Th

    prepare = () => {
        this.levelColumns = this.context.getLevelColumns()
    }

    render() {
        this.prepare()
        this.queue.clear()

        return (
            <React.Fragment>
                {
                    this.levelColumns.map(column => {
                        const { Header, metaKey } = column
                        this.queue.push(column)
                        return (
                            <ThsContext.Provider
                                key={metaKey}
                                value={{
                                    ...this.context,
                                    getColumn: () => column,
                                    contextName: 'thead'
                                }}
                            >
                                {
                                    typeof Header === 'string'
                                        ? <Th key={metaKey}>{Header}</Th>
                                        : <Header key={metaKey} />
                                }
                            </ThsContext.Provider>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}