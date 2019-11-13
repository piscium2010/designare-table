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
var react_1 = require("react");
var context_1 = require("./context");
var util_1 = require("./util");
var Ths_1 = require("./Ths");
var DOMObserver_1 = require("./DOMObserver");
var HTMLThead = (function (_super) {
    __extends(HTMLThead, _super);
    function HTMLThead(props) {
        var _this = _super.call(this, props) || this;
        _this.observer = DOMObserver_1.default(_this);
        _this.ref = React.createRef();
        return _this;
    }
    HTMLThead.prototype.componentDidMount = function () {
        this.observer.observe(this.ref.current);
    };
    HTMLThead.prototype.componentWillUnmount = function () {
        this.observer.disconnect();
    };
    HTMLThead.prototype.render = function () {
        var _a = this.props, Tr = _a.tr, fixed = _a.fixed, restProps = __rest(_a, ["tr", "fixed"]);
        var _b = this.context.columns, columns = _b === void 0 ? [] : _b;
        return (React.createElement(context_1.TheadContext.Provider, { value: __assign(__assign({}, this.context), { fixed: fixed }) },
            React.createElement("thead", __assign({}, restProps, { ref: this.ref }), util_1.groupByDepth(columns).map(function (columnsOfRow, i) {
                return (React.createElement(react_1.Fragment, { key: i }, Tr({ cells: React.createElement(Ths_1.default, { columnsOfRow: columnsOfRow }) })));
            }))));
    };
    HTMLThead.contextType = context_1.Context;
    HTMLThead.defaultProps = {
        tr: function (_a) {
            var cells = _a.cells;
            return React.createElement("tr", null, cells);
        }
    };
    return HTMLThead;
}(React.Component));
exports.default = HTMLThead;
