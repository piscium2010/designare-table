import React from 'react'
import { TdsContext } from './context'

export default class Td extends React.Component {
    static contextType = TdsContext

    // get columnWidth() {
    //     const { width = 'auto' } = this.context.column
    //     return width
    // }

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
        // const { style, ...restProps } = this.props
        // return <td style={{ width: this.columnWidth, ...style }} {...restProps}>{this.props.children}</td>
        return <td {...this.props}>{this.props.children}</td>
    }
}