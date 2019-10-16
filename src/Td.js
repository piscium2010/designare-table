import React from 'react'
import { TdsContext } from './context'

export default class Td extends React.Component {
    static contextType = TdsContext

    componentDidUpdate() {
        this.context.reSyncWidthAndHeight()
    }
    
    render() {
        if (this.context.contextName !== 'tds') throw 'Td should be within Cell component'
        return <td {...this.props}>{this.props.children}</td>
    }
}