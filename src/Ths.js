import React, { useContext, Fragment } from 'react'
import { TheadContext, ThsContext } from './context'
import Th from './Th'

export default function Ths(props) {
    const context = useContext(TheadContext)
    const { columnsOfRow } = props

    return (
        <Fragment>
            {
                columnsOfRow.map(column => {
                    const { Header, metaKey, ...restColumnProps } = column
                    const type = typeof Header
                    const headerProps = { metaKey, ...restColumnProps }
                    return (
                        <ThsContext.Provider
                            key={metaKey}
                            value={{
                                ...context,
                                getColumn: () => column,
                                contextName: 'thead'
                            }}
                        >
                            {
                                type === 'function'
                                    ? Header(headerProps)
                                    : type === 'string'
                                        ? <Th>{Header}</Th>
                                        : Header
                            }
                        </ThsContext.Provider>
                    )
                })
            }
        </Fragment>
    )
}