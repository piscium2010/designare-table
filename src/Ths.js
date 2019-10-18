import React from 'react'
import { TheadContext, ThsContext } from './context'
import Th from './Th'

export default class Ths extends React.Component {
    static contextType = TheadContext

    render() {
        const columnsOfRow = this.context.getLevelColumns()

        return (
            <React.Fragment>
                {
                    columnsOfRow.map(column => {
                        const { Header, metaKey } = column
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
                                    typeof Header === 'function'
                                        ? <Header key={metaKey} />
                                        : <Th key={metaKey}>{Header}</Th>
                                }
                            </ThsContext.Provider>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}