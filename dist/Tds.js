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
var Td_1 = require("./Td");
var messages_1 = require("./messages");
var defaultCell = function (_a) {
    var value = _a.value;
    return React.createElement(Td_1.default, null, value);
};
function Tds(props) {
    if (isNaN(props.rowIndex))
        throw messages_1.ERR2;
    var context = react_1.useContext(context_1.TBodyContext);
    var rowIndex = props.rowIndex;
    var data = context.data, getColumns = context.getColumns;
    var row = data[rowIndex];
    var columns = getColumns();
    var isMyCell = function (fixed) { return fixed === context.fixed; };
    return (columns.map(function (col, i) {
        return flattenOne(col).map(function (column, childrenIndex, children) {
            var dataKey = column.dataKey, _a = column.Cell, Cell = _a === void 0 ? defaultCell : _a, metaKey = column.metaKey, fixed = column.fixed, isFirstFixedColumn = column.isFirstFixedColumn, isLastFixedColumn = column.isLastFixedColumn, restColumnProps = __rest(column, ["dataKey", "Cell", "metaKey", "fixed", "isFirstFixedColumn", "isLastFixedColumn"]);
            var params = __assign(__assign({ value: row[dataKey], row: row,
                rowIndex: rowIndex,
                dataKey: dataKey,
                isFirstFixedColumn: isFirstFixedColumn,
                isLastFixedColumn: isLastFixedColumn }, restColumnProps), props);
            return (React.createElement(context_1.TdsContext.Provider, { key: metaKey, value: __assign(__assign({}, context), { contextName: 'tds', isFirstFixedCell: isFirstFixedColumn ? childrenIndex === 0 : false, isLastFixedCell: isLastFixedColumn ? childrenIndex === (children.length - 1) : false }) }, isMyCell(fixed)
                ? Cell(params)
                : React.createElement("td", { key: metaKey, style: { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 } }, "\u00A0")));
        });
    }));
}
exports.default = Tds;
function flattenOne(column, result) {
    if (result === void 0) { result = []; }
    column.children ? column.children.forEach(function (col) { return flattenOne(col, result); }) : result.push(column);
    return result;
}
