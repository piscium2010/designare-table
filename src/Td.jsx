import React from 'react'
import { TdsContext } from './context'

export default class Td extends React.Component {
    static contextType = TdsContext

    get rowHeight() {
        return this.context.rowHeight
    }

    componentDidUpdate() {
        this.context.reSyncWidthAndHeight()
    }

    componentDidMount() {
        this.context.cells.set(this)
    }

    componentWillUnmount() {
        this.context.cells.delete(this)
    }

    render() {
        if (this.context.contextName !== 'tds') throw 'Td should be within Cell component'
        const { style, children, ...restProps } = this.props
        return <td style={{height: this.rowHeight, ...style}}  {...restProps}>{children}</td>
    }
}