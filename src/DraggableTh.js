import React from 'react'
import Th from './Th'
import { ThsContext } from './context'
import { WARNING1 } from './messages'

export default class DraggableTh extends React.Component {
    static contextType = ThsContext

    ref = React.createRef()

    get column() {
        return this.context.getColumn()
    }

    onDragStart = evt => {
        const column = this.column
        evt.dataTransfer.setData('designare-column-index', column.columnIndex)
    }

    onDragOver = evt => {
        // console.log(`d over`)
        // console.log(`this.ref`,this.ref.current)
        const sourceIndex = evt.dataTransfer.getData("designare-column-index")
        const targetIndex = this.column.columnIndex
        if (sourceIndex < targetIndex) {
            const classList = this.ref.current.classList
            // console.log(`classList`, classList)
            classList.contains('designare-target-right') ? undefined : classList.add('designare-target-right')
        }
    }

    onDragExit = evt => {
        console.log(`exit`)
    }

    onDragLeave = evt => {
        const sourceIndex = evt.dataTransfer.getData("designare-column-index")
        const targetIndex = this.column.columnIndex
        if (sourceIndex < targetIndex) {
            const classList = this.ref.current.classList
            // console.log(`classList`, classList)
            classList.contains('designare-target-right') ? classList.remove('designare-target-right') : undefined
        }
    }

    onDrop = evt => {

    }

    render() {
        if (this.column.fixed) console.warn(WARNING1)
        return (
            this.context.fixed
                ? <Th>{this.props.children}</Th>
                : <Th
                    deliverRef={this.ref}
                    draggable='true'
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDragExit={this.onDragExit}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                >
                    {this.props.children}
                </Th>
        )
    }
}
