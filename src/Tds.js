import React from 'react'
import { TBodyContext, TdsContext } from './context'
import Td from './Td'
import { Queue } from './util'

const defaultCell = ({ value, row }) => <Td>{value}</Td>

export default class Tds extends React.Component {
    static contextType = TBodyContext

    queue = new Queue()

    getColumn = () => this.queue.first()

    
    componentDidUpdate() {

    }

    componentDidMount() {

    }

    render() {
        this.queue.clear()
        const { rowIndex } = this.props
        const { data, getColumn } = this.context
        const row = data[rowIndex]
        const myColumns = getColumn()
        const isMyCell = fixed => fixed === this.context.fixed

        return (
            <TdsContext.Provider value={{
                ...this.context,
                getColumn: this.getColumn,
                contextName: 'tds'
            }}
            >
                {
                    myColumns.map(i =>
                        flattenOne(i).map(
                            column => {
                                const { dataKey, Cell = defaultCell, metaKey, fixed, columnIndex } = column
                                this.queue.push(column)
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
