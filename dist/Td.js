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
class Td extends React.Component {
    get rowHeight() {
        return this.context.rowHeight;
    }
    componentDidMount() {
        this.context.cells.set(this);
    }
    componentWillUnmount() {
        this.context.cells.delete(this);
    }
    render() {
        if (this.context.contextName !== 'tds')
            throw 'Td should be within Cell component';
        const { isFirstFixedCell, isLastFixedCell, fixed } = this.context;
        const leftLastFixedCellClassName = fixed === 'left' && isLastFixedCell ? 'designare-fixed' : '';
        const rightFirstFixedCellClassName = fixed === 'right' && isFirstFixedCell ? 'designare-fixed' : '';
        const _a = this.props, { className = '', style, children } = _a, restProps = __rest(_a, ["className", "style", "children"]);
        return (React.createElement("td", Object.assign({ className: `${leftLastFixedCellClassName} ${rightFirstFixedCellClassName} ${className}`, style: Object.assign({ height: this.rowHeight }, style) }, restProps), children));
    }
}
exports.default = Td;
Td.contextType = context_1.TdsContext;
