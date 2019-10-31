import React from 'react'
import Th from './Th'
import { ThsContext } from './context'
import { WARNING1, WARNING2 } from './messages'
import { shift } from './util'

export default class DraggableTh extends React.Component {
    static contextType = ThsContext

    ref = React.createRef()

    get column() {
        return this.context.getColumn()
    }

    get activeColor() {
        return this.context.activeColor
    }

    highlightRight = () => {
        console.log(`right`)
        const el = this.ref.current
        if (this.originalBorderRightColor || this.originalBorderRightStyle) return
        this.originalBorderRightColor = el.style.borderRightColor || 'none'
        this.originalBorderRightStyle = el.style.borderRightStyle || 'inherit'
        el.style.borderRightColor = this.activeColor
        el.style.borderRightStyle = 'dashed'
    }

    deHighlightRight = () => {

        const el = this.ref.current
        el.style.borderRightColor = this.originalBorderRightColor
        el.style.borderRightStyle = this.originalBorderRightStyle
        this.originalBorderRightColor = undefined
        this.originalBorderRightStyle = undefined
    }

    highlightLeft = () => {
        console.log(`left`)
        const el = this.ref.current
        if (this.originalBorderLeftColor || this.originalBorderLeftStyle) return
        this.originalBorderLeftColor = el.style.borderLeftColor || 'none'
        this.originalBorderLeftStyle = el.style.borderLeftStyle || 'inherit'
        el.style.borderLeftColor = this.activeColor
        el.style.borderLeftStyle = 'dashed'
    }

    deHighlightLeft = () => {
        const el = this.ref.current
        el.style.borderLeftColor = this.originalBorderLeftColor
        el.style.borderLeftStyle = this.originalBorderLeftStyle
        this.originalBorderLeftColor = undefined
        this.originalBorderLeftStyle = undefined
    }

    onDragStart = evt => {
        const column = this.column
        this.context.global['designare-column-index'] = column.columnIndex
    }

    onDragOver = evt => {
        evt.preventDefault() // allow drag
        const sourceIndex = this.context.global['designare-column-index']
        const targetIndex = this.column.columnIndex
        // console.log('sourceIndex: ', sourceIndex, ' targetIndex: ', targetIndex)
        sourceIndex < targetIndex ? this.highlightRight() : this.highlightLeft()
    }

    onDragEnter = evt => {
        // console.log(`enter`,evt.target)
        // evt.preventDefault()
        // const sourceIndex = evt.dataTransfer.getData('designare-column-index')
        // const targetIndex = evt.target.dataset['columnindex']
        // console.log('enter sourceIndex: ', sourceIndex)
        // sourceIndex < targetIndex ? this.highlightRight() : this.highlightLeft()
    }

    onDragLeave = evt => {
        const sourceIndex = this.context.global['designare-column-index']
        const targetIndex = this.column.columnIndex
        sourceIndex < targetIndex ? this.deHighlightRight() : this.deHighlightLeft()
    }

    onDrop = evt => {
        evt.preventDefault()
        this.onDragLeave(evt)
        const { columns } = this.context
        const sourceIndex = this.context.global['designare-column-index']
        const targetIndex = this.column.columnIndex
        if (sourceIndex) {
            const shiftedColumns = shift(columns, sourceIndex, targetIndex)
            console.log(`r`, shiftedColumns)
        }
    }

    render() {
        // console.log(`this.column`, this.column)
        let { ref, ...restProps } = this.props, column = this.column
        if (column.fixed) { console.warn(WARNING1) }
        if (column.depth > 1) { console.warn(WARNING2) }
        ref = this.ref

        return (
            this.context.fixed || column.depth > 1
                ? <Th deliverRef={this.ref} {...restProps}>{this.props.children}</Th>
                : <Th
                    deliverRef={this.ref}
                    draggable='true'
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                    data-columnindex={column.columnIndex}
                    {...restProps}
                >
                    {this.props.children}
                </Th>
        )
    }
}
