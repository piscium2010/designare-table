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
const messages_1 = require("./messages");
const util_1 = require("./util");
class DragTr extends React.Component {
    constructor(props) {
        super(props);
        this.getRowIndex = row => {
            const { getRowId } = this.props;
            const rowId = getRowId(row), data = this.data;
            let rowIndex;
            for (let i = 0, len = data.length; i < len; i++) {
                if (rowId === getRowId(data[i])) {
                    rowIndex = i;
                    break;
                }
            }
            return rowIndex;
        };
        this.highlightTop = () => {
            const el = this.ref.current;
            if (this.originalBorderTopColor !== undefined || this.originalBorderTopStyle !== undefined)
                return;
            this.originalBorderTopColor = el.style.borderTopColor;
            this.originalBorderTopStyle = el.style.borderTopStyle;
            this.originalBorderTopWidth = el.style.borderTopWidth;
            el.style.borderTopColor = this.activeColor;
            el.style.borderTopStyle = 'dashed';
            el.style.borderTopWidth = this.originalBorderTopWidth || '1px';
        };
        this.deHighlightTop = () => {
            const el = this.ref.current;
            el.style.borderTopColor = this.originalBorderTopColor;
            el.style.borderTopStyle = this.originalBorderTopStyle;
            el.style.borderTopWidth = this.originalBorderTopWidth;
            this.originalBorderTopColor = undefined;
            this.originalBorderTopStyle = undefined;
            this.originalBorderTopWidth = undefined;
        };
        this.highlightBottom = () => {
            const el = this.ref.current;
            if (this.originalBorderBottomColor !== undefined || this.originalBorderBottomStyle !== undefined)
                return;
            this.originalBorderBottomColor = el.style.borderBottomColor;
            this.originalBorderBottomStyle = el.style.borderBottomStyle;
            this.originalBorderBottomWidth = el.style.borderBottomWidth;
            el.style.borderBottomColor = this.activeColor;
            el.style.borderBottomStyle = 'dashed';
            el.style.borderBottomWidth = this.originalBorderBottomWidth || '1px';
        };
        this.deHighlightBottom = () => {
            const el = this.ref.current;
            el.style.borderBottomColor = this.originalBorderBottomColor;
            el.style.borderBottomStyle = this.originalBorderBottomStyle;
            el.style.borderBottomWidth = this.originalBorderBottomWidth;
            this.originalBorderBottomColor = undefined;
            this.originalBorderBottomStyle = undefined;
            this.originalBorderBottomWidth = undefined;
        };
        this.onDragStart = evt => {
            this.global['designare-draggable-row-index'] = this.getRowIndex(this.props.row);
        };
        this.onDragOver = evt => {
            evt.preventDefault(); // allow drag
            const sourceIndex = this.global['designare-draggable-row-index'];
            const targetIndex = this.getRowIndex(this.props.row);
            sourceIndex > targetIndex ? this.highlightTop() : undefined;
            sourceIndex < targetIndex ? this.highlightBottom() : undefined;
        };
        this.onDragLeave = evt => {
            const sourceIndex = this.global['designare-draggable-row-index'];
            const targetIndex = this.getRowIndex(this.props.row);
            sourceIndex > targetIndex ? this.deHighlightTop() : undefined;
            sourceIndex < targetIndex ? this.deHighlightBottom() : undefined;
        };
        this.onDrop = evt => {
            evt.preventDefault();
            this.onDragLeave(evt);
            const sourceIndex = this.global['designare-draggable-row-index'];
            const targetIndex = this.getRowIndex(this.props.row);
            if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
                const shifted = util_1.shift(this.data, sourceIndex, targetIndex);
                console.log(`r`, shifted);
                this.context.onChangeRows(shifted);
            }
        };
        this.ref = React.createRef();
        if (!props.getRowId)
            throw messages_1.ERR4;
        if (!props.row)
            throw messages_1.ERR5;
    }
    get global() {
        return this.context.global;
    }
    get data() {
        return this.context.originalData;
    }
    get activeColor() {
        return this.context.activeColor;
    }
    render() {
        let _a = this.props, { ref, children, row, getRowId } = _a, restProps = __rest(_a, ["ref", "children", "row", "getRowId"]);
        if (this.context.fixed) {
            console.warn(messages_1.WARNING1);
        }
        ref = this.ref;
        return (this.context.fixed
            ? React.createElement("tr", Object.assign({ ref: this.ref }, restProps), children)
            : React.createElement("tr", Object.assign({ ref: this.ref, draggable: 'true', onDragStart: this.onDragStart, onDragOver: this.onDragOver, onDragLeave: this.onDragLeave, onDrop: this.onDrop, onDragEnd: this.onDragEnd }, restProps), children));
    }
}
exports.default = DragTr;
DragTr.contextType = context_1.TBodyContext;
