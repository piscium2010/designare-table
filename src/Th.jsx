import React from 'react'
import { ThsContext } from './context'
import ReSizing from './ReSizing'

const dragableWidth = 2
const dragableStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: dragableWidth,
    cursor: 'col-resize',
    zIndex: 1
    // backgroundColor: 'aliceblue'
}

export default class Th extends React.Component {
    static contextType = ThsContext

    onMouseDown = (evt, leftOrRight) => {
        const { leafIndex, metaKey } = this.column
        const { getColGroups, setResizedWidthInfo, flattenSortedColumns } = this.context

        this.setResizedWidthInfo = setResizedWidthInfo
        this.leftOrRight = leftOrRight
        this.resizing = new ReSizing(evt)
        this.dragable = evt.target
        this.parent = evt.target.parentElement
        this.parentOriginalZIndex = this.parent.style.zIndex / 1
        this.parent.style.zIndex = this.parentOriginalZIndex + 1
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
        this.parent.style.zIndex = this.parentOriginalZIndex
        this.leftOrRight === 'left' ? this.dragable.style.left = '0' : this.dragable.style.right = '0'
        this.dragable.style.width = `${dragableWidth}px`
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
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
            index,
            style,
            ...restProps
        } = this.props
        const column = this.column
        const { colSpan, rowSpan, fixed, isFirst, isLast, isLeaf, isFirstFixedColumn, isLastFixedColumn } = column
        const fixHeader = this.context.fixed
        const isMyColumn = fixHeader ? fixed === fixHeader : !fixed
        const thStyle = isMyColumn ? { zIndex: 1 } : { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 }
        const fixedColumnShadowClass = isMyColumn && (isFirstFixedColumn || isLastFixedColumn) ? 'designare-fixed' : ''

        return (
            <th
                className={`${fixedColumnShadowClass} ${className}`}
                {...restProps}
                colSpan={colSpan}
                rowSpan={rowSpan}
                style={{ position: 'relative', ...thStyle, ...style }}
            >
                {isLeaf && !isFirst && <div style={{ ...dragableStyle, left: 0 }} onMouseDown={evt => this.onMouseDown(evt, 'left')}></div>}
                {isMyColumn ? children : <span>&nbsp;</span>}
                {isLeaf && !isLast && <div style={{ ...dragableStyle, right: 0 }} onMouseDown={evt => this.onMouseDown(evt, 'right')}></div>}
            </th>
        )
    }

}