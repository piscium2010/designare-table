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
const Th_1 = require("./Th");
const context_1 = require("./context");
const messages_1 = require("./messages");
const util_1 = require("./util");
class DragTh extends React.Component {
    constructor() {
        super(...arguments);
        this.ref = React.createRef();
        this.highlightRight = () => {
            const el = this.ref.current;
            if (this.originalBorderRightColor !== undefined || this.originalBorderRightStyle !== undefined)
                return;
            this.originalBorderRightColor = el.style.borderRightColor;
            this.originalBorderRightStyle = el.style.borderRightStyle;
            this.originalBorderRightWidth = el.style.borderRightWidth;
            el.style.borderRightColor = this.activeColor;
            el.style.borderRightStyle = 'dashed';
            el.style.borderRightWidth = this.originalBorderRightWidth || '1px';
        };
        this.deHighlightRight = () => {
            const el = this.ref.current;
            el.style.borderRightColor = this.originalBorderRightColor;
            el.style.borderRightStyle = this.originalBorderRightStyle;
            el.style.borderRightWidth = this.originalBorderRightWidth;
            this.originalBorderRightColor = undefined;
            this.originalBorderRightStyle = undefined;
            this.originalBorderRightWidth = undefined;
        };
        this.highlightLeft = () => {
            const el = this.ref.current;
            if (this.originalBorderLeftColor !== undefined || this.originalBorderLeftStyle !== undefined)
                return;
            this.originalBorderLeftColor = el.style.borderLeftColor;
            this.originalBorderLeftStyle = el.style.borderLeftStyle;
            this.originalBorderLeftWidth = el.style.borderLeftWidth;
            el.style.borderLeftColor = this.activeColor;
            el.style.borderLeftStyle = 'dashed';
            el.style.borderLeftWidth = this.originalBorderLeftWidth || '1px';
        };
        this.deHighlightLeft = () => {
            const el = this.ref.current;
            el.style.borderLeftColor = this.originalBorderLeftColor;
            el.style.borderLeftStyle = this.originalBorderLeftStyle;
            el.style.borderLeftWidth = this.originalBorderLeftWidth;
            this.originalBorderLeftColor = undefined;
            this.originalBorderLeftStyle = undefined;
            this.originalBorderLeftWidth = undefined;
        };
        this.onDragStart = evt => {
            const column = this.column;
            this.global['designare-draggable-column-index'] = column.columnIndex;
        };
        this.onDragOver = evt => {
            evt.preventDefault();
            const sourceIndex = this.global['designare-draggable-column-index'];
            const targetIndex = this.column.columnIndex;
            sourceIndex < targetIndex ? this.highlightRight() : undefined;
            sourceIndex > targetIndex ? this.highlightLeft() : undefined;
        };
        this.onDragLeave = evt => {
            const sourceIndex = this.global['designare-draggable-column-index'];
            const targetIndex = this.column.columnIndex;
            sourceIndex < targetIndex ? this.deHighlightRight() : undefined;
            sourceIndex > targetIndex ? this.deHighlightLeft() : undefined;
        };
        this.onDrop = evt => {
            evt.preventDefault();
            this.onDragLeave(evt);
            const sourceIndex = this.global['designare-draggable-column-index'];
            const targetIndex = this.column.columnIndex;
            if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
                const shiftedColumns = util_1.shift(this.originalColumns, sourceIndex, targetIndex);
                this.context.onChangeColumns(shiftedColumns);
            }
        };
    }
    get global() {
        return this.context.global;
    }
    get originalColumns() {
        return this.context.originalColumns;
    }
    get column() {
        return this.context.getColumn();
    }
    get activeColor() {
        return this.context.activeColor;
    }
    render() {
        let _a = this.props, { deliverRef, children } = _a, restProps = __rest(_a, ["deliverRef", "children"]), column = this.column;
        if (column.fixed) {
            console.warn(messages_1.WARNING1);
        }
        if (column.depth > 1) {
            console.warn(messages_1.WARNING2);
        }
        deliverRef = this.ref;
        return (this.context.fixed || column.depth > 1
            ? React.createElement(Th_1.default, Object.assign({ deliverRef: this.ref }, restProps), children)
            : React.createElement(Th_1.default, Object.assign({ deliverRef: this.ref, draggable: true, onDragStart: this.onDragStart, onDragOver: this.onDragOver, onDragLeave: this.onDragLeave, onDrop: this.onDrop, onDragEnd: this.onDragEnd }, restProps), children));
    }
}
exports.default = DragTh;
DragTh.contextType = context_1.ThsContext;
