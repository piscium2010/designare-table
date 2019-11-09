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
const react_1 = require("react");
const context_1 = require("./context");
const Td_1 = require("./Td");
const messages_1 = require("./messages");
const defaultCell = ({ value }) => React.createElement(Td_1.default, null, value);
function Tds(props) {
    if (isNaN(props.rowIndex))
        throw messages_1.ERR2;
    const context = react_1.useContext(context_1.TBodyContext);
    const { rowIndex } = props;
    const { data, getColumns } = context;
    const row = data[rowIndex];
    const columns = getColumns();
    const isMyCell = fixed => fixed === context.fixed;
    return (columns.map((col, i) => flattenOne(col).map((column, childrenIndex, children) => {
        const { dataKey, Cell = defaultCell, metaKey, fixed, isFirstFixedColumn, isLastFixedColumn } = column, restColumnProps = __rest(column, ["dataKey", "Cell", "metaKey", "fixed", "isFirstFixedColumn", "isLastFixedColumn"]);
        const params = Object.assign(Object.assign({ value: row[dataKey], row,
            rowIndex,
            dataKey,
            isFirstFixedColumn,
            isLastFixedColumn }, restColumnProps), props);
        return (React.createElement(context_1.TdsContext.Provider, { key: metaKey, value: Object.assign(Object.assign({}, context), { contextName: 'tds', isFirstFixedCell: isFirstFixedColumn ? childrenIndex === 0 : false, isLastFixedCell: isLastFixedColumn ? childrenIndex === (children.length - 1) : false }) }, isMyCell(fixed)
            ? Cell(params)
            : React.createElement("td", { key: metaKey, style: { visibility: 'hidden', pointerEvents: 'none', zIndex: 0 } }, "\u00A0")));
    })));
}
exports.default = Tds;
function flattenOne(column, result = []) {
    column.children ? column.children.forEach(col => flattenOne(col, result)) : result.push(column);
    return result;
}
