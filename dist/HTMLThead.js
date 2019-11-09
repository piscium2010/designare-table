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
const Ths_1 = require("./Ths");
const DOMObserver_1 = require("./DOMObserver");
class HTMLThead extends React.Component {
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
        const { columns = [] } = this.context;
        return (React.createElement(context_1.TheadContext.Provider, { value: Object.assign(Object.assign({}, this.context), { fixed: fixed }) },
            React.createElement("thead", Object.assign({}, restProps, { ref: this.ref }), util_1.groupByDepth(columns).map((columnsOfRow, i) => {
                return (React.createElement(react_1.Fragment, { key: i }, Tr({ cells: React.createElement(Ths_1.default, { columnsOfRow: columnsOfRow }) })));
            }))));
    }
}
exports.default = HTMLThead;
HTMLThead.contextType = context_1.Context;
HTMLThead.defaultProps = {
    tr: ({ cells }) => React.createElement("tr", null, cells)
};
