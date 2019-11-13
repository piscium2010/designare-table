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
var Th_1 = require("./Th");
var context_1 = require("./context");
var messages_1 = require("./messages");
var util_1 = require("./util");
var DragTh = (function (_super) {
    __extends(DragTh, _super);
    function DragTh() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = React.createRef();
        _this.highlightRight = function () {
            var el = _this.ref.current;
            if (_this.originalBorderRightColor !== undefined || _this.originalBorderRightStyle !== undefined)
                return;
            _this.originalBorderRightColor = el.style.borderRightColor;
            _this.originalBorderRightStyle = el.style.borderRightStyle;
            _this.originalBorderRightWidth = el.style.borderRightWidth;
            el.style.borderRightColor = _this.activeColor;
            el.style.borderRightStyle = 'dashed';
            el.style.borderRightWidth = _this.originalBorderRightWidth || '1px';
        };
        _this.deHighlightRight = function () {
            var el = _this.ref.current;
            el.style.borderRightColor = _this.originalBorderRightColor;
            el.style.borderRightStyle = _this.originalBorderRightStyle;
            el.style.borderRightWidth = _this.originalBorderRightWidth;
            _this.originalBorderRightColor = undefined;
            _this.originalBorderRightStyle = undefined;
            _this.originalBorderRightWidth = undefined;
        };
        _this.highlightLeft = function () {
            var el = _this.ref.current;
            if (_this.originalBorderLeftColor !== undefined || _this.originalBorderLeftStyle !== undefined)
                return;
            _this.originalBorderLeftColor = el.style.borderLeftColor;
            _this.originalBorderLeftStyle = el.style.borderLeftStyle;
            _this.originalBorderLeftWidth = el.style.borderLeftWidth;
            el.style.borderLeftColor = _this.activeColor;
            el.style.borderLeftStyle = 'dashed';
            el.style.borderLeftWidth = _this.originalBorderLeftWidth || '1px';
        };
        _this.deHighlightLeft = function () {
            var el = _this.ref.current;
            el.style.borderLeftColor = _this.originalBorderLeftColor;
            el.style.borderLeftStyle = _this.originalBorderLeftStyle;
            el.style.borderLeftWidth = _this.originalBorderLeftWidth;
            _this.originalBorderLeftColor = undefined;
            _this.originalBorderLeftStyle = undefined;
            _this.originalBorderLeftWidth = undefined;
        };
        _this.onDragStart = function (evt) {
            var column = _this.column;
            _this.global['designare-draggable-column-index'] = column.columnIndex;
        };
        _this.onDragOver = function (evt) {
            evt.preventDefault();
            var sourceIndex = _this.global['designare-draggable-column-index'];
            var targetIndex = _this.column.columnIndex;
            sourceIndex < targetIndex ? _this.highlightRight() : undefined;
            sourceIndex > targetIndex ? _this.highlightLeft() : undefined;
        };
        _this.onDragLeave = function (evt) {
            var sourceIndex = _this.global['designare-draggable-column-index'];
            var targetIndex = _this.column.columnIndex;
            sourceIndex < targetIndex ? _this.deHighlightRight() : undefined;
            sourceIndex > targetIndex ? _this.deHighlightLeft() : undefined;
        };
        _this.onDrop = function (evt) {
            evt.preventDefault();
            _this.onDragLeave(evt);
            var sourceIndex = _this.global['designare-draggable-column-index'];
            var targetIndex = _this.column.columnIndex;
            if (!isNaN(sourceIndex) && !isNaN(targetIndex) && sourceIndex != targetIndex) {
                var shiftedColumns = util_1.shift(_this.originalColumns, sourceIndex, targetIndex);
                _this.context.onChangeColumns(shiftedColumns);
            }
        };
        return _this;
    }
    Object.defineProperty(DragTh.prototype, "global", {
        get: function () {
            return this.context.global;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragTh.prototype, "originalColumns", {
        get: function () {
            return this.context.originalColumns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragTh.prototype, "column", {
        get: function () {
            return this.context.getColumn();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DragTh.prototype, "activeColor", {
        get: function () {
            return this.context.activeColor;
        },
        enumerable: true,
        configurable: true
    });
    DragTh.prototype.render = function () {
        var _a = this.props, deliverRef = _a.deliverRef, children = _a.children, restProps = __rest(_a, ["deliverRef", "children"]), column = this.column;
        if (column.fixed) {
            console.warn(messages_1.WARNING1);
        }
        if (column.depth > 1) {
            console.warn(messages_1.WARNING2);
        }
        deliverRef = this.ref;
        return (this.context.fixed || column.depth > 1
            ? React.createElement(Th_1.default, __assign({ deliverRef: this.ref }, restProps), children)
            : React.createElement(Th_1.default, __assign({ deliverRef: this.ref, draggable: true, onDragStart: this.onDragStart, onDragOver: this.onDragOver, onDragLeave: this.onDragLeave, onDrop: this.onDrop, onDragEnd: this.onDragEnd }, restProps), children));
    };
    DragTh.contextType = context_1.ThsContext;
    return DragTh;
}(React.Component));
exports.default = DragTh;
