import * as React from 'react'
import { ThsContext } from './context'
import ReSizing from './ReSizing'
import { metaColumn } from './util'

const resizableElementWidth = 3
const resizableElementStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: resizableElementWidth,
    cursor: 'col-resize',
    zIndex: 1,
    userSelect: 'none'
}

interface IThProps extends React.HTMLAttributes<HTMLDivElement> {
    deliverRef?: React.RefObject<HTMLElement>
}

export default class Th extends React.Component<IThProps, {}> {
    static contextType = ThsContext
    private column: metaColumn
    private originalDraggable: string
    private setResizedWidthInfo: any
    private leftOrRight: string
    private dragable: HTMLElement
    private resizing: ReSizing
    private parent: HTMLElement
    private parentOriginalZIndex: number
    private metaKey: string
    private colgroups: HTMLElement[]
    private colIndex: number
    private colWidth: number
    private minWidthArray: number[]
    private wrappers: HTMLElement[]
    private wrapperWidthArray: number[]

    get global(): { resizing: boolean } {
        return this.context.global
    }

    get resizable(): boolean {
        return this.context.resizable
    }

    disableDraggable = () => {
        if (this.props.deliverRef && this.props.deliverRef.current) {
            const el = this.props.deliverRef.current
            this.originalDraggable = el.getAttribute('draggable')
            el.setAttribute('draggable', 'false')
        }
    }

    restoreDraggable = () => {
        if (this.props.deliverRef && this.props.deliverRef.current) {
            const el = this.props.deliverRef.current
            el.setAttribute('draggable', this.originalDraggable)
        }
    }

    disableDOMObserver = () => {
        this.global['resizing'] = true
    }

    restoreDOMObserver = () => {
        this.global['resizing'] = false
    }

    onMouseDown = (evt) => {
        this.disableDraggable()
        this.disableDOMObserver()

        const { leafIndex, metaKey } = this.column
        const { getColGroups, setResizedWidthInfo, flattenSortedColumns } = this.context

        this.setResizedWidthInfo = setResizedWidthInfo
        this.leftOrRight = evt.target.dataset['p']
        this.resizing = new ReSizing(evt)
        this.dragable = evt.target
        this.parent = evt.target.parentElement
        this.parentOriginalZIndex = this.parent.style.zIndex as any / 1
        this.parent.style.zIndex = (this.parentOriginalZIndex + 1) as any
        this.dragable.style.width = '1000px'
        this.leftOrRight === 'left' ? this.dragable.style.left = '-500px' : this.dragable.style.right = '-500px'
        this.metaKey = this.leftOrRight === 'left' ? flattenSortedColumns[leafIndex - 1].metaKey : metaKey
        const [wrappers, colgroups, minWidthArray] = getColGroups()
        this.colgroups = colgroups.map(g => g.children)
        this.colIndex = this.leftOrRight === 'left' ? leafIndex - 1 : leafIndex
        this.colWidth = this.colgroups[0][this.colIndex].style.width.replace('px', '') / 1
        this.minWidthArray = minWidthArray
        this.wrappers = wrappers
        this.wrapperWidthArray = this.wrappers.map(w => w.offsetWidth)
        if (this.colgroups.length !== this.wrappers.length) throw 'length of colgroup and table are not match'
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)
    }

    onMouseMove = evt => {
        const move = this.resizing.move(evt)
        for (let i = 0, len = this.colgroups.length; i < len; i++) {
            const colgroup = this.colgroups[i]
            const col = colgroup[this.colIndex]
            if (col && (move + this.colWidth) > this.minWidthArray[this.colIndex]) {
                this.wrappers[i].style.minWidth = move + this.wrapperWidthArray[i] + 'px'
                col.style.width = move + this.colWidth + 'px'
                this.setResizedWidthInfo(this.metaKey, move + this.colWidth)
            }
        }
    }

    onMouseUp = evt => {
        this.parent.style.zIndex = this.parentOriginalZIndex as any
        this.leftOrRight === 'left' ? this.dragable.style.left = '0' : this.dragable.style.right = '0'
        this.dragable.style.width = `${resizableElementWidth}px`
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
        this.restoreDraggable()
        setTimeout(() => {
            this.restoreDOMObserver()
        }, 100)
    }

    componentDidMount() {
        if (this.column.isLeaf) this.context.headerCells.set(this)
    }

    componentWillUnmount() {
        if (this.column.isLeaf) this.context.headerCells.delete(this)
    }

    render() {
        if (this.context.contextName !== 'thead')
            throw 'Th should be within Header component'
        this.column = this.context.getColumn()

        const {
            children,
            className = '',
            style,
            deliverRef,
            ...restProps
        } = this.props
        const column = this.column
        const { colSpan, rowSpan, fixed, isFirst, isLast, isLeaf, isFirstFixedColumn, isLastFixedColumn } = column
        const fixHeader = this.context.fixed
        const isMyColumn = fixHeader ? fixed === fixHeader : !fixed
        const thStyle: React.CSSProperties = isMyColumn
            ? { zIndex: fixHeader === 'left' ? 2 : 1 } // will be used by onMouseDown (drag and drop) as well
            : { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 }
        const fixedColumnShadowClass = isMyColumn && (isFirstFixedColumn || isLastFixedColumn) ? 'designare-fixed' : ''

        return (
            <th
                ref={deliverRef as any}
                className={`${fixedColumnShadowClass} ${className}`}
                {...restProps}
                colSpan={colSpan}
                rowSpan={rowSpan}
                style={{ ...thStyle, ...style }}
            >
                {
                    isLeaf && !isFirst && this.resizable &&
                    <div className={`designare-resize-element-left`} style={{ ...resizableElementStyle, left: 0 }} data-p='left' onMouseDown={this.onMouseDown}></div>
                }
                {
                    isMyColumn
                        ? children
                        : <span>&nbsp;</span>
                }
                {
                    isLeaf && !isLast && this.resizable &&
                    <div className={`designare-resize-element-right`} style={{ ...resizableElementStyle, right: 0 }} data-p='right' onMouseDown={this.onMouseDown}></div>
                }
            </th>
        )
    }

}