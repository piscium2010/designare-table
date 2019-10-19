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
                        // console.log(`Header`,typeof Header)
                        // console.log(`Header`,Header.type.name)
                        const type = typeof Header

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
                                    type === 'function'
                                        ? <Header key={metaKey} />
                                        : type === 'string'
                                            ? <Th key={metaKey}>{Header}</Th>
                                            : <React.Fragment key={metaKey}>{Header}</React.Fragment>
                                }
                            </ThsContext.Provider>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}