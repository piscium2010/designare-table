import * as React from 'react'
import { TBodyContext } from './context'
import { WARNING1, ERR4, ERR5 } from './messages'
import { shift } from './util'

interface IDragTrProps extends React.HTMLAttributes<HTMLElement> {
    row: any
    getRowId: (row: any) => any
}

export default class DragTr extends React.Component<IDragTrProps, {}> {
    static contextType = TBodyContext
    ref: React.RefObject<HTMLElement>
    originalBorderTopColor: string
    originalBorderTopStyle: string
    originalBorderTopWidth: string
    originalBorderBottomColor: string
    originalBorderBottomStyle: string
    originalBorderBottomWidth: string
    onDragEnd: (event: React.DragEvent<HTMLTableRowElement>) => void

    constructor(props) {
        super(props)
        this.ref = React.createRef()
        if (!props.getRowId) throw ERR4
        if (!props.row) throw ERR5
    }


    get global() {
        return this.context.global
    }

    get data() {
        return this.context.originalData
    }

    get activeColor() {
        return this.context.activeColor
    }

    getRowIndex = row => {
        const { getRowId } = this.props
        const rowId = getRowId(row), data = this.data
        let rowIndex
        for (let i = 0, len = data.length; i < len; i++) {
            if (rowId === getRowId(data[i])) {
                rowIndex = i
                break
            }
        }
        return rowIndex
    }

    highlightTop = () => {
        const el = this.ref.current
        if (this.originalBorderTopColor !== undefined || this.originalBorderTopStyle !== undefined) return
        this.originalBorderTopColor = el.style.borderTopColor
        this.originalBorderTopStyle = el.style.borderTopStyle
        this.originalBorderTopWidth = el.style.borderTopWidth
        el.style.borderTopColor = this.activeColor
        el.style.borderTopStyle = 'dashed'
        el.style.borderTopWidth = this.originalBorderTopWidth || '1px'
    }

    deHighlightTop = () => {
        const el = this.ref.current
        el.style.borderTopColor = this.originalBorderTopColor
        el.style.borderTopStyle = this.originalBorderTopStyle
        el.style.borderTopWidth = this.originalBorderTopWidth
        this.originalBorderTopColor = undefined
        this.originalBorderTopStyle = undefined
        this.originalBorderTopWidth = undefined
    }

    highlightBottom = () => {
        const el = this.ref.current
        if (this.originalBorderBottomColor !== undefined || this.originalBorderBottomStyle !== undefined) return
        this.originalBorderBottomColor = el.style.borderBottomColor
        this.originalBorderBottomStyle = el.style.borderBottomStyle
        this.originalBorderBottomWidth = el.style.borderBottomWidth
        el.style.borderBottomColor = this.activeColor
        el.style.borderBottomStyle = 'dashed'
        el.style.borderBottomWidth = this.originalBorderBottomWidth || '1px'
    }

    deHighlightBottom = () => {
        const el = this.ref.current
        el.style.borderBottomColor = this.originalBorderBottomColor
        el.style.borderBottomStyle = this.originalBorderBottomStyle
        el.style.borderBottomWidth = this.originalBorderBottomWidth
        this.originalBorderBottomColor = undefined
        this.originalBorderBottomStyle = undefined
        this.originalBorderBottomWidth = undefined
    }

    onDragStart = evt => {
        this.global['designare-draggable-row-index'] = this.getRowIndex(this.props.row)
    }

    onDragOver = evt => {
        evt.preventDefault() // allow drag
        const sourceIndex = this.global['designare-draggable-row-index']
        const targetIndex = this.getRowIndex(this.props.row)
        sourceIndex > targetIndex ? this.highlightTop() : undefined
        sourceIndex < targetIndex ? this.highlightBottom() : undefined
    }

    onDragLeave = evt => {
        const sourceIndex = this.global['designare-draggable-row-index']
        const targetIndex = this.getRowIndex(this.props.row)
        sourceIndex > targetIndex ? this.deHighlightTop() : undefined
        sourceIndex < targetIndex ? this.deHighlightBottom() : undefined
    }

    onDrop = evt => {
        evt.preventDefault()
        this.onDragLeave(evt)
        const sourceIndex = this.global['designare-draggable-row-index']
        const targetIndex = this.getRowIndex(this.props.row)
        if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
            const shifted = shift(this.data, sourceIndex, targetIndex)
            this.context.onChangeRows(shifted)
        }
    }

    render() {
        let { children, row, getRowId, ...restProps } = this.props
        if (this.context.fixed) { console.warn(WARNING1) }

        return (
            this.context.fixed
                ? <tr ref={this.ref as any} {...restProps}>{children}</tr>
                : <tr
                    ref={this.ref as any}
                    draggable={true}
                    onDragStart={this.onDragStart}
                    onDragOver={this.onDragOver}
                    onDragLeave={this.onDragLeave}
                    onDrop={this.onDrop}
                    onDragEnd={this.onDragEnd}
                    {...restProps}
                >
                    {children}
                </tr>
        )
    }
}
