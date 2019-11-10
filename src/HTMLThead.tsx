import * as React from 'react'
import { Fragment } from 'react'
import { Context, TheadContext } from './context'
import { groupByDepth } from './util'
import Ths from './Ths'
import Observer from './DOMObserver'

interface IHTMLTheadProps extends React.HTMLAttributes<HTMLElement> {
    tr?: (args: { cells: JSX.Element }) => JSX.Element
    fixed?: string
}

export default class HTMLThead extends React.Component<IHTMLTheadProps, {}> {
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
        const { columns = [] } = this.context

        return (
            <TheadContext.Provider value={{ ...this.context, fixed: fixed }}>
                <thead {...restProps} ref={this.ref as any}>
                    {
                        groupByDepth(columns).map((columnsOfRow, i) => {
                            return (
                                <Fragment key={i}>
                                    {Tr({ cells: <Ths columnsOfRow={columnsOfRow} /> })}
                                </Fragment>
                            )
                        })
                    }
                </thead>
            </TheadContext.Provider>
        )
    }
}



