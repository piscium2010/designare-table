import React, { Fragment, useContext } from 'react'
import { TBodyContext, TdsContext } from './context'
import Td from './Td'
import { ERR2 } from './messages'

const defaultCell = ({ value }) => <Td>{value}</Td>

export default function Tds(props) {
    if (isNaN(props.rowIndex)) throw ERR2
    const context = useContext(TBodyContext)
    const { rowIndex } = props
    const { data, getColumns } = context
    const row = data[rowIndex]
    const myColumns = getColumns()
    const isMyCell = fixed => fixed === context.fixed
    
    return (
        <TdsContext.Provider value={{
            ...context,
            contextName: 'tds'
        }}
        >
            {
                myColumns.map(i =>
                    flattenOne(i).map(
                        column => {
                            const {
                                dataKey,
                                Cell = defaultCell,
                                metaKey,
                                fixed,
                                ...restColumnProps
                            } = column
                            const params = {
                                value: row[dataKey],
                                row,
                                rowIndex,
                                dataKey,
                                ...restColumnProps,
                                ...props
                            }
                            return isMyCell(fixed)
                                ? <Fragment key={metaKey}>{Cell(params)}</Fragment>
                                : <td key={metaKey} style={{ visibility: 'hidden', pointerEvents: 'none' }}>&nbsp;</td>
                        })
                )
            }
        </TdsContext.Provider>
    )
}

function flattenOne(column, result = []) {
    column.children ? column.children.forEach(col => flattenOne(col, result)) : result.push(column)
    return result
}
