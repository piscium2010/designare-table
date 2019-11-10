import * as React from 'react'
import { Fragment } from 'react'
import { Context, TBodyContext } from './context'
import { flatten, metaColumn } from './util'
import Tds from './Tds'
import Observer from './DOMObserver'

interface IHTMLTbodyProps extends React.HTMLAttributes<HTMLElement> {
    tr?: (args: { row: any, rowIndex: number, fixed: string, getColumns: () => metaColumn[], cells: JSX.Element }) => JSX.Element
    fixed?: string
}

export default class HTMLTbody extends React.Component<IHTMLTbodyProps, {}> {
    static contextType = Context

    static defaultProps = {
        tr: ({ cells }) => <tr>{cells}</tr>
    }

    private observer
    private ref: React.RefObject<HTMLElement>

    constructor(props) {
        super(props)
        this.observer = Observer(this)
        this.ref = React.createRef()
    }

    componentDidMount() {
        this.observer.observe(this.ref.current)
    }

    componentWillUnmount() {
        this.observer.disconnect()
    }

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
                getColumns: () => columns
            }}
            >
                <tbody {...restProps} ref={this.ref as any}>
                    {
                        isEmpty
                            ? null
                            : data.map((row, rowIndex) => (
                                <Fragment key={rowIndex}>
                                    {Tr({
                                        row,
                                        rowIndex,
                                        fixed,
                                        getColumns: () => flatten(columns),
                                        cells: <Tds rowIndex={rowIndex} />
                                    })}
                                </Fragment>
                            ))
                    }
                </tbody>
            </TBodyContext.Provider>
        )
    }
}

