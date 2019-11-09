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
const Th_1 = require("./Th");
function Ths(props) {
    const context = react_1.useContext(context_1.TheadContext);
    const { columnsOfRow } = props;
    return (React.createElement(react_1.Fragment, null, columnsOfRow.map(column => {
        const { Header, metaKey } = column, restColumnProps = __rest(column, ["Header", "metaKey"]);
        const type = typeof Header;
        const headerProps = Object.assign({ metaKey }, restColumnProps);
        return (React.createElement(context_1.ThsContext.Provider, { key: metaKey, value: Object.assign(Object.assign({}, context), { getColumn: () => column, contextName: 'thead' }) }, type === 'function'
            ? Header(headerProps)
            : type === 'string'
                ? React.createElement(Th_1.default, null, Header)
                : Header));
    })));
}
exports.default = Ths;
