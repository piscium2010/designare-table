import React from 'react'
import { Context, TBodyContext } from './context'
import { flatten } from './util'

export default class Tbody extends React.Component {
    static contextType = Context

    render() {
        const { tr: Tr, fix, ...restProps } = this.props
        const { columns, data } = this.context
        const myColumns = fix ? columns.filter(c => c.fix === fix) : columns
        const isEmpty = myColumns.length < 1
        // console.log(`data`,data)
        return (
            <TBodyContext.Provider value={{
                ...this.context,
                contextName: 'tbody',
                fix,
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
                                    fix={fix}
                                    getColumns={() => flatten(columns)}
                                />
                        })
                    }
                </tbody>
            </TBodyContext.Provider>
        )
    }
}

