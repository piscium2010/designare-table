"use strict";
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
var Td = (function (_super) {
    __extends(Td, _super);
    function Td() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Td.prototype, "rowHeight", {
        get: function () {
            return this.context.rowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Td.prototype.componentDidMount = function () {
        this.context.cells.set(this);
    };
    Td.prototype.componentWillUnmount = function () {
        this.context.cells.delete(this);
    };
    Td.prototype.render = function () {
        if (this.context.contextName !== 'tds')
            throw 'Td should be within Cell component';
        var _a = this.context, isFirstFixedCell = _a.isFirstFixedCell, isLastFixedCell = _a.isLastFixedCell, fixed = _a.fixed;
        var leftLastFixedCellClassName = fixed === 'left' && isLastFixedCell ? 'designare-fixed' : '';
        var rightFirstFixedCellClassName = fixed === 'right' && isFirstFixedCell ? 'designare-fixed' : '';
        var _b = this.props, _c = _b.className, className = _c === void 0 ? '' : _c, style = _b.style, children = _b.children, restProps = __rest(_b, ["className", "style", "children"]);
        return (React.createElement("td", __assign({ className: leftLastFixedCellClassName + " " + rightFirstFixedCellClassName + " " + className, style: __assign({ height: this.rowHeight }, style) }, restProps), children));
    };
    Td.contextType = context_1.TdsContext;
    return Td;
}(React.Component));
exports.default = Td;
