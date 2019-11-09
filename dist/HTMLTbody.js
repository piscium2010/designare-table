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
const util_1 = require("./util");
const Tds_1 = require("./Tds");
const DOMObserver_1 = require("./DOMObserver");
class HTMLTbody extends React.Component {
    constructor(props) {
        super(props);
        this.observer = DOMObserver_1.default(this);
        this.ref = React.createRef();
    }
    componentDidMount() {
        this.observer.observe(this.ref.current);
    }
    componentWillUnmount() {
        this.observer.disconnect();
    }
    render() {
        const _a = this.props, { tr: Tr, fixed } = _a, restProps = __rest(_a, ["tr", "fixed"]);
        const { columns, data } = this.context;
        const myColumns = fixed ? columns.filter(c => c.fixed === fixed) : columns;
        const isEmpty = myColumns.length < 1;
        return (React.createElement(context_1.TBodyContext.Provider, { value: Object.assign(Object.assign({}, this.context), { contextName: 'tbody', fixed, getColumns: () => columns }) },
            React.createElement("tbody", Object.assign({}, restProps, { ref: this.ref }), isEmpty
                ? null
                : data.map((row, rowIndex) => (React.createElement(react_1.Fragment, { key: rowIndex }, Tr({
                    key: rowIndex,
                    row,
                    rowIndex,
                    fixed,
                    getColumns: () => util_1.flatten(columns),
                    cells: React.createElement(Tds_1.default, { rowIndex: rowIndex })
                })))))));
    }
}
exports.default = HTMLTbody;
HTMLTbody.contextType = context_1.Context;
HTMLTbody.defaultProps = {
    tr: ({ cells }) => React.createElement("tr", null, cells)
};
