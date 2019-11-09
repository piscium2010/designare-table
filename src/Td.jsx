import * as React from 'react'
import { TdsContext } from './context'

export default class Td extends React.Component {
    static contextType = TdsContext

    get rowHeight() {
        return this.context.rowHeight
    }

    componentDidMount() {
        this.context.cells.set(this)
    }

    componentWillUnmount() {
        this.context.cells.delete(this)
    }

    render() {
        if (this.context.contextName !== 'tds') throw 'Td should be within Cell component'
        const { isFirstFixedCell, isLastFixedCell, fixed } = this.context
        const leftLastFixedCellClassName = fixed === 'left' && isLastFixedCell ? 'designare-fixed' : ''
        const rightFirstFixedCellClassName = fixed === 'right' && isFirstFixedCell ? 'designare-fixed' : ''
        const { className = '', style, children, ...restProps } = this.props
        return (
            <td
                className={`${leftLastFixedCellClassName} ${rightFirstFixedCellClassName} ${className}`}
                style={{
                    height: this.rowHeight,
                    ...style
                }}
                {...restProps}
            >
                {children}
            </td>
        )
    }
}