"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const context_1 = require("./context");
const ReSizing_1 = require("./ReSizing");
const resizableElementWidth = 3;
const resizableElementStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: resizableElementWidth,
    cursor: 'col-resize',
    zIndex: 1,
    userSelect: 'none'
};
class Th extends React.Component {
    constructor() {
        super(...arguments);
        this.disableDraggable = () => {
            if (this.props.deliverRef && this.props.deliverRef.current) {
                const el = this.props.deliverRef.current;
                this.originalDraggable = el.getAttribute('draggable');
                el.setAttribute('draggable', 'false');
            }
        };
        this.restoreDraggable = () => {
            if (this.props.deliverRef && this.props.deliverRef.current) {
                const el = this.props.deliverRef.current;
                el.setAttribute('draggable', this.originalDraggable);
            }
        };
        this.disableDOMObserver = () => {
            this.global['resizing'] = true;
        };
        this.restoreDOMObserver = () => {
            this.global['resizing'] = false;
        };
        this.onMouseDown = (evt) => {
            this.disableDraggable();
            this.disableDOMObserver();
            const { leafIndex, metaKey } = this.column;
            const { getColGroups, setResizedWidthInfo, flattenSortedColumns } = this.context;
            this.setResizedWidthInfo = setResizedWidthInfo;
            this.leftOrRight = evt.target.dataset['p'];
            this.resizing = new ReSizing_1.default(evt);
            this.dragable = evt.target;
            this.parent = evt.target.parentElement;
            this.parentOriginalZIndex = this.parent.style.zIndex / 1;
            this.parent.style.zIndex = (this.parentOriginalZIndex + 1);
            this.dragable.style.width = '1000px';
            this.leftOrRight === 'left' ? this.dragable.style.left = '-500px' : this.dragable.style.right = '-500px';
            this.metaKey = this.leftOrRight === 'left' ? flattenSortedColumns[leafIndex - 1].metaKey : metaKey;
            const [wrappers, colgroups, minWidthArray] = getColGroups();
            this.colgroups = colgroups.map(g => g.children);
            this.colIndex = this.leftOrRight === 'left' ? leafIndex - 1 : leafIndex;
            this.colWidth = this.colgroups[0][this.colIndex].style.width.replace('px', '') / 1;
            this.minWidthArray = minWidthArray;
            this.wrappers = wrappers;
            this.wrapperWidthArray = this.wrappers.map(w => w.offsetWidth);
            if (this.colgroups.length !== this.wrappers.length)
                throw 'length of colgroup and table are not match';
            window.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.onMouseUp);
        };
        this.onMouseMove = evt => {
            const move = this.resizing.move(evt);
            for (let i = 0, len = this.colgroups.length; i < len; i++) {
                const colgroup = this.colgroups[i];
                const col = colgroup[this.colIndex];
                if (col && (move + this.colWidth) > this.minWidthArray[this.colIndex]) {
                    this.wrappers[i].style.minWidth = move + this.wrapperWidthArray[i] + 'px';
                    col.style.width = move + this.colWidth + 'px';
                    this.setResizedWidthInfo(this.metaKey, move + this.colWidth);
                }
            }
        };
        this.onMouseUp = evt => {
            this.parent.style.zIndex = this.parentOriginalZIndex;
            this.leftOrRight === 'left' ? this.dragable.style.left = '0' : this.dragable.style.right = '0';
            this.dragable.style.width = `${resizableElementWidth}px`;
            window.removeEventListener('mousemove', this.onMouseMove);
            window.removeEventListener('mouseup', this.onMouseUp);
            this.restoreDraggable();
            setTimeout(() => {
                this.restoreDOMObserver();
            }, 100);
        };
    }
    get global() {
        return this.context.global;
    }
    get resizable() {
        return this.context.resizable;
    }
    componentDidMount() {
        if (this.column.isLeaf)
            this.context.headerCells.set(this);
    }
    componentWillUnmount() {
        if (this.column.isLeaf)
            this.context.headerCells.delete(this);
    }
    render() {
        if (this.context.contextName !== 'thead')
            throw 'Th should be within Header component';
        this.column = this.context.getColumn();
        const _a = this.props, { children, className = '', style, deliverRef } = _a, restProps = __rest(_a, ["children", "className", "style", "deliverRef"]);
        const column = this.column;
        const { colSpan, rowSpan, fixed, isFirst, isLast, isLeaf, isFirstFixedColumn, isLastFixedColumn } = column;
        const fixHeader = this.context.fixed;
        const isMyColumn = fixHeader ? fixed === fixHeader : !fixed;
        const thStyle = isMyColumn
            ? { zIndex: fixHeader === 'left' ? 2 : 1 }
            : { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 };
        const fixedColumnShadowClass = isMyColumn && (isFirstFixedColumn || isLastFixedColumn) ? 'designare-fixed' : '';
        return (React.createElement("th", Object.assign({ ref: deliverRef, className: `${fixedColumnShadowClass} ${className}` }, restProps, { colSpan: colSpan, rowSpan: rowSpan, style: Object.assign(Object.assign({}, thStyle), style) }),
            isLeaf && !isFirst && this.resizable &&
                React.createElement("div", { className: `designare-resize-element-left`, style: Object.assign(Object.assign({}, resizableElementStyle), { left: 0 }), "data-p": 'left', onMouseDown: this.onMouseDown }),
            isMyColumn
                ? children
                : React.createElement("span", null, "\u00A0"),
            isLeaf && !isLast && this.resizable &&
                React.createElement("div", { className: `designare-resize-element-right`, style: Object.assign(Object.assign({}, resizableElementStyle), { right: 0 }), "data-p": 'right', onMouseDown: this.onMouseDown })));
    }
}
exports.default = Th;
Th.contextType = context_1.ThsContext;
