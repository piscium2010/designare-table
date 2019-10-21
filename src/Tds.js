import React from 'react'
import { TBodyContext, TdsContext } from './context'
import Td from './Td'
import { ERR2 } from './errorMessage'

const defaultCell = ({ value }) => <Td>{value}</Td>

export default class Tds extends React.Component {
    static contextType = TBodyContext
    constructor(props) {
        super(props)
        if (isNaN(props.rowIndex)) throw ERR2
    }

    render() {
        const { rowIndex } = this.props
        const { data, getColumns } = this.context
        const row = data[rowIndex]
        const myColumns = getColumns()
        const isMyCell = fixed => fixed === this.context.fixed

        // return (
        //     <React.Fragment>
        //         {
        //             myColumns.map(i =>
        //                 flattenOne(i).map(
        //                     column => {
        //                         const { dataKey, Cell = defaultCell, metaKey, fixed, columnIndex } = column
        //                         return isMyCell(fixed)
        //                             ? <TdsContext.Provider
        //                                 value={{
        //                                     ...this.context,
        //                                     contextName: 'tds',
        //                                     column
        //                                 }}
        //                             >
        //                                 <Cell
        //                                     key={metaKey}
        //                                     value={row[dataKey]}
        //                                     row={row}
        //                                     rowIndex={this.rowIndex}
        //                                     columnIndex={columnIndex}
        //                                     dataKey={dataKey}
        //                                     {...this.props}
        //                                 />
        //                             </TdsContext.Provider>
        //                             : <td key={metaKey} style={{ visibility: 'hidden', pointerEvents: 'none' }}>&nbsp;</td>
        //                     })
        //             )
        //         }
        //     </React.Fragment>
        // )
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
