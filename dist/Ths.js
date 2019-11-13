"use strict";
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
var react_1 = require("react");
var context_1 = require("./context");
var Th_1 = require("./Th");
function Ths(props) {
    var context = react_1.useContext(context_1.TheadContext);
    var columnsOfRow = props.columnsOfRow;
    return (React.createElement(react_1.Fragment, null, columnsOfRow.map(function (column) {
        var Header = column.Header, metaKey = column.metaKey, restColumnProps = __rest(column, ["Header", "metaKey"]);
        var type = typeof Header;
        var headerProps = __assign({ metaKey: metaKey }, restColumnProps);
        return (React.createElement(context_1.ThsContext.Provider, { key: metaKey, value: __assign(__assign({}, context), { getColumn: function () { return column; }, contextName: 'thead' }) }, type === 'function'
            ? Header(headerProps)
            : type === 'string'
                ? React.createElement(Th_1.default, null, Header)
                : Header));
    })));
}
exports.default = Ths;
