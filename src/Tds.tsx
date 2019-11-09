import * as React from 'react'
import { useContext } from 'react'
import { TBodyContext, TdsContext } from './context'
import Td from './Td'
import { ERR2 } from './messages'
import { metaColumn } from './util'

const defaultCell = ({ value }) => <Td>{value}</Td>

export default function Tds(props) {
    if (isNaN(props.rowIndex)) throw ERR2
    const context = useContext(TBodyContext) as { data: any[], getColumns: () => metaColumn[], fixed?: string }
    const { rowIndex } = props
    const { data, getColumns } = context
    const row = data[rowIndex]
    const columns = getColumns()
    const isMyCell = fixed => fixed === context.fixed

    return (
        columns.map((col, i) =>
            flattenOne(col).map(
                (column, childrenIndex, children) => {
                    const {
                        dataKey,
                        Cell = defaultCell,
                        metaKey,
                        fixed,
                        isFirstFixedColumn,
                        isLastFixedColumn,
                        ...restColumnProps
                    } = column
                    const params = {
                        value: row[dataKey],
                        row,
                        rowIndex,
                        dataKey,
                        isFirstFixedColumn,
                        isLastFixedColumn,
                        ...restColumnProps,
                        ...props
                    }
                    return (
                        <TdsContext.Provider
                            key={metaKey}
                            value={{
                                ...context,
                                contextName: 'tds',
                                isFirstFixedCell: isFirstFixedColumn ? childrenIndex === 0 : false,
                                isLastFixedCell: isLastFixedColumn ? childrenIndex === (children.length - 1) : false
                            }}
                        >
                            {
                                isMyCell(fixed)
                                    ? Cell(params)
                                    : <td key={metaKey} style={{ visibility: 'hidden', pointerEvents: 'none', zIndex: 0 }}>&nbsp;</td>
                            }
                        </TdsContext.Provider>
                    )
                })
        )
    ) as any
}

function flattenOne(column, result = []) {
    column.children ? column.children.forEach(col => flattenOne(col, result)) : result.push(column)
    return result
}
