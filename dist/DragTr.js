var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var React = require("react");
var context_1 = require("./context");
var messages_1 = require("./messages");
var util_1 = require("./util");
var DragTr = (function (_super) {
    __extends(DragTr, _super);
    function DragTr(props) {
        var _this = _super.call(this, props) || this;
        _this.getRowIndex = function (row) {
            var getRowId = _this.props.getRowId;
            var rowId = getRowId(row), data = _this.data;
            var rowIndex;
            for (var i = 0, len = data.length; i < len; i++) {
                if (rowId === getRowId(data[i])) {
                    rowIndex = i;
                    break;
                }
            }
            return rowIndex;
        };
        _this.highlightTop = function () {
            var el = _this.ref.current;
            if (_this.originalBorderTopColor !== undefined || _this.originalBorderTopStyle !== undefined)
                return;
            _this.originalBorderTopColor = el.style.borderTopColor;
            _this.originalBorderTopStyle = el.style.borderTopStyle;
            _this.originalBorderTopWidth = el.style.borderTopWidth;
            el.style.borderTopColor = _this.activeColor;
            el.style.borderTopStyle = 'dashed';
            el.style.borderTopWidth = _this.originalBorderTopWidth || '1px';
        };
        _this.deHighlightTop = function () {
            var el = _this.ref.current;
            el.style.borderTopColor = _this.originalBorderTopColor;
            el.style.borderTopStyle = _this.originalBorderTopStyle;
            el.style.borderTopWidth = _this.originalBorderTopWidth;
            _this.originalBorderTopColor = undefined;
            _this.originalBorderTopStyle = undefined;
            _this.originalBorderTopWidth = undefined;
        };
        _this.highlightBottom = function () {
            var el = _this.ref.current;
            if (_this.originalBorderBottomColor !== undefined || _this.originalBorderBottomStyle !== undefined)
                return;
            _this.originalBorderBottomColor = el.style.borderBottomColor;
            _this.originalBorderBottomStyle = el.style.borderBottomStyle;
            _this.originalBorderBottomWidth = el.style.borderBottomWidth;
            el.style.borderBottomColor = _this.activeColor;
            el.style.borderBottomStyle = 'dashed';
            el.style.borderBottomWidth = _this.originalBorderBottomWidth || '1px';
        };
        _this.deHighlightBottom = function () {
            var el = _this.ref.current;
            el.style.borderBottomColor = _this.originalBorderBottomColor;
            el.style.borderBottomStyle = _this.originalBorderBottomStyle;
            el.style.borderBottomWidth = _this.originalBorderBottomWidth;
            _this.originalBorderBottomColor = undefined;
            _this.originalBorderBottomStyle = undefined;
            _this.originalBorderBottomWidth = undefined;
        };
        _this.onDragStart = function (evt) {
            _this.global['designare-draggable-row-index'] = _this.getRowIndex(_this.props.row);
        };
        _this.onDragOver = function (evt) {
            evt.preventDefault();
            var sourceIndex = _this.global['designare-draggable-row-index'];
            var targetIndex = _this.getRowIndex(_this.props.row);
            sourceIndex > targetIndex ? _this.highlightTop() : undefined;
            sourceIndex < targetIndex ? _this.highlightBottom() : undefined;
        };
        _this.onDragLeave = function (evt) {
            var sourceIndex = _this.global['designare-draggable-row-index'];
            var targetIndex = _this.getRowIndex(_this.props.row);
            sourceIndex > targetIndex ? _this.deHighlightTop() : undefined;
            sourceIndex < targetIndex ? _this.deHighlightBottom() : undefined;
        };
        _this.onDrop = function (evt) {
            evt.preventDefault();
            _this.onDragLeave(evt);
            var sourceIndex = _this.global['designare-draggable-row-index'];
            var targetIndex = _this.getRowIndex(_this.props.row);
            if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
                var shifted = util_1.shift(_this.data, sourceIndex, targetIndex);
                _this.context.onChangeRows(shifted);
            }
        };
        _this.ref = React.createRef();
        if (!props.getRowId)
            throw messages_1.ERR4;
        if (!props.row)
            throw messages_1.ERR5;
        return _this;
    }
    Object.defineProperty(DragTr.prototype, "global", {
        get: function () {
            return this.context.global;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragTr.prototype, "data", {
        get: function () {
            return this.context.originalData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragTr.prototype, "activeColor", {
        get: function () {
            return this.context.activeColor;
        },
        enumerable: true,
        configurable: true
    });
    DragTr.prototype.render = function () {
        var _a = this.props, children = _a.children, row = _a.row, getRowId = _a.getRowId, restProps = __rest(_a, ["children", "row", "getRowId"]);
        if (this.context.fixed) {
            console.warn(messages_1.WARNING1);
        }
        return (this.context.fixed
            ? React.createElement("tr", __assign({ ref: this.ref }, restProps), children)
            : React.createElement("tr", __assign({ ref: this.ref, draggable: true, onDragStart: this.onDragStart, onDragOver: this.onDragOver, onDragLeave: this.onDragLeave, onDrop: this.onDrop, onDragEnd: this.onDragEnd }, restProps), children));
    };
    DragTr.contextType = context_1.TBodyContext;
    return DragTr;
}(React.Component));
exports.default = DragTr;
