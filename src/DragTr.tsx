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
    private ref: React.RefObject<HTMLElement>
    private onDragEnd: (event: React.DragEvent<HTMLTableRowElement>) => void

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
        el.classList.add('designare-highlight-top')
    }

    deHighlightTop = () => {
        const el = this.ref.current
        el.classList.remove('designare-highlight-top')
    }

    highlightBottom = () => {
        const el = this.ref.current
        el.classList.add('designare-highlight-bottom')
    }

    deHighlightBottom = () => {
        const el = this.ref.current
        el.classList.remove('designare-highlight-bottom')
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
