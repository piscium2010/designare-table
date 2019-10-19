import React from 'react'
import { TBodyContext, TdsContext } from './context'
import Td from './Td'

const defaultCell = ({ value }) => <Td>{value}</Td>

export const ERR2 = 'designare-table: rowIndex is required for Tbody.Row'

export default class Tds extends React.Component {
    static contextType = TBodyContext
    constructor(props) {
        super(props)
        if(isNaN(props.rowIndex)) throw ERR2
    }
    
    render() {
        const { rowIndex } = this.props
        const { data, getColumn } = this.context
        const row = data[rowIndex]
        const myColumns = getColumn()
        const isMyCell = fixed => fixed === this.context.fixed

        return (
            <TdsContext.Provider value={{
                ...this.context,
                contextName: 'tds'
            }}
            >
                {
                    myColumns.map(i =>
                        flattenOne(i).map(
                            column => {
                                const { dataKey, Cell = defaultCell, metaKey, fixed, columnIndex } = column
                                return isMyCell(fixed)
                                    ? <Cell
                                        key={metaKey}
                                        value={row[dataKey]}
                                        row={row}
                                        rowIndex={this.rowIndex}
                                        columnIndex={columnIndex}
                                        dataKey={dataKey}
                                        {...this.props}
                                    />
                                    : <td key={metaKey} style={{ visibility: 'hidden', pointerEvents: 'none' }}>&nbsp;</td>
                            })
                    )
                }
            </TdsContext.Provider>
        )
    }
}

function flattenOne(column, result = []) {
    column.children ? column.children.forEach(col => flattenOne(col, result)) : result.push(column)
    return result
}
