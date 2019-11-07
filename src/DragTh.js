import React from 'react'
import Th from './Th'
import { ThsContext } from './context'
import { WARNING1, WARNING2 } from './messages'
import { shift } from './util'

export default class DraggableTh extends React.Component {
    static contextType = ThsContext

    ref = React.createRef()

    get global() {
        return this.context.global
    }

    get originalColumns() {
        return this.context.originalColumns
    }
    
    get column() {
        return this.context.getColumn()
    }

    get activeColor() {
        return this.context.activeColor
    }

    highlightRight = () => {
        const el = this.ref.current
        if (this.originalBorderRightColor !== undefined || this.originalBorderRightStyle !== undefined) return
        this.originalBorderRightColor = el.style.borderRightColor
        this.originalBorderRightStyle = el.style.borderRightStyle
        this.originalBorderRightWidth = el.style.borderRightWidth
        el.style.borderRightColor = this.activeColor
        el.style.borderRightStyle = 'dashed'
        el.style.borderRightWidth = this.originalBorderRightWidth || '1px'
    }

    deHighlightRight = () => {
        const el = this.ref.current
        el.style.borderRightColor = this.originalBorderRightColor
        el.style.borderRightStyle = this.originalBorderRightStyle
        el.style.borderRightWidth = this.originalBorderRightWidth
        this.originalBorderRightColor = undefined
        this.originalBorderRightStyle = undefined
        this.originalBorderRightWidth = undefined
    }

    highlightLeft = () => {
        const el = this.ref.current
        if (this.originalBorderLeftColor !== undefined || this.originalBorderLeftStyle !== undefined) return
        this.originalBorderLeftColor = el.style.borderLeftColor
        this.originalBorderLeftStyle = el.style.borderLeftStyle
        this.originalBorderLeftWidth = el.style.borderLeftWidth
        el.style.borderLeftColor = this.activeColor
        el.style.borderLeftStyle = 'dashed'
        el.style.borderLeftWidth = this.originalBorderLeftWidth || '1px'
    }

    deHighlightLeft = () => {
        const el = this.ref.current
        el.style.borderLeftColor = this.originalBorderLeftColor
        el.style.borderLeftStyle = this.originalBorderLeftStyle
        el.style.borderLeftWidth = this.originalBorderLeftWidth
        this.originalBorderLeftColor = undefined
        this.originalBorderLeftStyle = undefined
        this.originalBorderLeftWidth = undefined
    }

    onDragStart = evt => {
        const column = this.column
        this.global['designare-draggable-column-index'] = column.columnIndex
    }

    onDragOver = evt => {
        evt.preventDefault() // allow drag
        const sourceIndex = this.global['designare-draggable-column-index']
        const targetIndex = this.column.columnIndex
        sourceIndex < targetIndex ? this.highlightRight() : undefined
        sourceIndex > targetIndex ? this.highlightLeft() : undefined
    }

    onDragLeave = evt => {
        const sourceIndex = this.global['designare-draggable-column-index']
        const targetIndex = this.column.columnIndex
        sourceIndex < targetIndex ? this.deHighlightRight() : undefined
        sourceIndex > targetIndex ? this.deHighlightLeft() : undefined
    }

    onDrop = evt => {
        evt.preventDefault()
        this.onDragLeave(evt)
        const sourceIndex = this.global['designare-draggable-column-index']
        const targetIndex = this.column.columnIndex
        if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
            const shiftedColumns = shift(this.originalColumns, sourceIndex, targetIndex)
            this.context.onChangeColumns(shiftedColumns)
        }
    }

    render() {
        let { deliverRef, children, ...restProps } = this.props, column = this.column
        if (column.fixed) { console.warn(WARNING1) }
        if (column.depth > 1) { console.warn(WARNING2) }
        deliverRef = this.ref

        return (
            this.context.fixed || column.depth > 1
                ? <Th deliverRef={this.ref} {...restProps}>{children}</Th>
                : <Th
                    deliverRef={this.ref}
                    draggable='true'
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                    onDragEnd={this.onDragEnd}
                    {...restProps}
                >
                    {children}
                </Th>
        )
    }
}
