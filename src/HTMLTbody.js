import React from 'react'
import { Context, TBodyContext } from './context'
import { flatten } from './util'
import Tds from './Tds'

export default class HTMLTbody extends React.Component {
    static contextType = Context

    render() {
        const { tr: Tr, fixed, ...restProps } = this.props
        const { columns, data } = this.context
        const myColumns = fixed ? columns.filter(c => c.fixed === fixed) : columns
        const isEmpty = myColumns.length < 1
        
        return (
            <TBodyContext.Provider value={{
                ...this.context,
                contextName: 'tbody',
                fixed,
                getColumn: () => myColumns
            }}
            >
                <tbody {...restProps}>
                    {
                        data.map((row, rowIndex) => {
                            return isEmpty
                                ? <tr key={rowIndex}></tr>
                                : <Tr
                                    key={rowIndex}
                                    row={row}
                                    rowIndex={rowIndex}
                                    fixed={fixed}
                                    getColumns={() => flatten(columns)}
                                    cells={<Tds rowIndex={rowIndex}/>}
                                />
                        })
                    }
                </tbody>
            </TBodyContext.Provider>
        )
    }
}

