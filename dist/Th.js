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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var context_1 = require("./context");
var ReSizing_1 = require("./ReSizing");
var preventDefault = function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
};
var resizableElementWidth = 3;
var resizableElementStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: resizableElementWidth,
    cursor: 'col-resize',
    zIndex: 1,
    userSelect: 'none'
};
var Th = (function (_super) {
    __extends(Th, _super);
    function Th() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.disableDraggable = function () {
            if (_this.props.deliverRef && _this.props.deliverRef.current) {
                var el = _this.props.deliverRef.current;
                _this.originalDraggable = el.getAttribute('draggable');
                el.setAttribute('draggable', 'false');
            }
        };
        _this.restoreDraggable = function () {
            if (_this.props.deliverRef && _this.props.deliverRef.current) {
                var el = _this.props.deliverRef.current;
                el.setAttribute('draggable', _this.originalDraggable);
            }
        };
        _this.disableDOMObserver = function () {
            _this.global['resizing'] = true;
        };
        _this.restoreDOMObserver = function () {
            _this.global['resizing'] = false;
        };
        _this.onMouseDown = function (evt) {
            _this.disableDraggable();
            _this.disableDOMObserver();
            var _a = _this.column, leafIndex = _a.leafIndex, metaKey = _a.metaKey;
            var _b = _this.context, getColGroups = _b.getColGroups, setResizedWidthInfo = _b.setResizedWidthInfo, flattenSortedColumns = _b.flattenSortedColumns;
            _this.setResizedWidthInfo = setResizedWidthInfo;
            _this.leftOrRight = evt.target.dataset['p'];
            _this.resizing = new ReSizing_1.default(evt);
            _this.dragable = evt.target;
            _this.parent = evt.target.parentElement;
            _this.parentOriginalZIndex = _this.parent.style.zIndex / 1;
            _this.parent.style.zIndex = (_this.parentOriginalZIndex + 1);
            _this.dragable.style.width = '1000px';
            _this.leftOrRight === 'left' ? _this.dragable.style.left = '-500px' : _this.dragable.style.right = '-500px';
            _this.metaKey = _this.leftOrRight === 'left' ? flattenSortedColumns[leafIndex - 1].metaKey : metaKey;
            var _c = __read(getColGroups(), 3), wrappers = _c[0], colgroups = _c[1], minWidthArray = _c[2];
            _this.colgroups = colgroups.map(function (g) { return g.children; });
            _this.colIndex = _this.leftOrRight === 'left' ? leafIndex - 1 : leafIndex;
            _this.colWidth = _this.colgroups[0][_this.colIndex].style.width.replace('px', '') / 1;
            _this.minWidthArray = minWidthArray;
            _this.wrappers = wrappers;
            _this.wrapperWidthArray = _this.wrappers.map(function (w) { return w.offsetWidth; });
            if (_this.colgroups.length !== _this.wrappers.length)
                throw 'length of colgroup and table are not match';
            window.addEventListener('mousemove', _this.onMouseMove);
            window.addEventListener('mouseup', _this.onMouseUp);
        };
        _this.onMouseMove = function (evt) {
            var move = _this.resizing.move(evt);
            for (var i = 0, len = _this.colgroups.length; i < len; i++) {
                var colgroup = _this.colgroups[i];
                var col = colgroup[_this.colIndex];
                if (col && (move + _this.colWidth) > _this.minWidthArray[_this.colIndex]) {
                    _this.wrappers[i].style.minWidth = move + _this.wrapperWidthArray[i] + 'px';
                    col.style.width = move + _this.colWidth + 'px';
                    _this.setResizedWidthInfo(_this.metaKey, move + _this.colWidth);
                }
            }
        };
        _this.onMouseUp = function (evt) {
            _this.parent.style.zIndex = _this.parentOriginalZIndex;
            _this.leftOrRight === 'left' ? _this.dragable.style.left = '0' : _this.dragable.style.right = '0';
            _this.dragable.style.width = resizableElementWidth + "px";
            window.removeEventListener('mousemove', _this.onMouseMove);
            window.removeEventListener('mouseup', _this.onMouseUp);
            _this.restoreDraggable();
            setTimeout(function () {
                _this.restoreDOMObserver();
            }, 100);
        };
        return _this;
    }
    Object.defineProperty(Th.prototype, "global", {
        get: function () {
            return this.context.global;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Th.prototype, "resizable", {
        get: function () {
            return this.context.resizable;
        },
        enumerable: true,
        configurable: true
    });
    Th.prototype.componentDidMount = function () {
        if (this.column.isLeaf)
            this.context.headerCells.set(this);
    };
    Th.prototype.componentWillUnmount = function () {
        if (this.column.isLeaf)
            this.context.headerCells.delete(this);
    };
    Th.prototype.render = function () {
        if (this.context.contextName !== 'thead')
            throw 'Th should be within Header component';
        this.column = this.context.getColumn();
        var _a = this.props, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, style = _a.style, deliverRef = _a.deliverRef, restProps = __rest(_a, ["children", "className", "style", "deliverRef"]);
        var column = this.column;
        var colSpan = column.colSpan, rowSpan = column.rowSpan, fixed = column.fixed, isFirst = column.isFirst, isLast = column.isLast, isLeaf = column.isLeaf, isFirstFixedColumn = column.isFirstFixedColumn, isLastFixedColumn = column.isLastFixedColumn;
        var fixHeader = this.context.fixed;
        var isMyColumn = fixHeader ? fixed === fixHeader : !fixed;
        var thStyle = isMyColumn
            ? { zIndex: fixHeader === 'left' ? 2 : 1 }
            : { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 };
        var fixedColumnShadowClass = isMyColumn && (isFirstFixedColumn || isLastFixedColumn) ? 'designare-fixed' : '';
        return (React.createElement("th", __assign({ ref: deliverRef, className: fixedColumnShadowClass + " " + className + " designare-table-th", onWheel: preventDefault }, restProps, { colSpan: colSpan, rowSpan: rowSpan, style: __assign(__assign({}, thStyle), style) }),
            isLeaf && !isFirst && this.resizable &&
                React.createElement("div", { className: "designare-resize-element-left", style: __assign(__assign({}, resizableElementStyle), { left: 0 }), "data-p": 'left', onMouseDown: this.onMouseDown }),
            isMyColumn
                ? children
                : React.createElement("span", null, "\u00A0"),
            isLeaf && !isLast && this.resizable &&
                React.createElement("div", { className: "designare-resize-element-right", style: __assign(__assign({}, resizableElementStyle), { right: 0 }), "data-p": 'right', onMouseDown: this.onMouseDown })));
    };
    Th.contextType = context_1.ThsContext;
    return Th;
}(React.Component));
exports.default = Th;
