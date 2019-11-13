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
var react_1 = require("react");
var Icons_1 = require("./Icons");
var loadingLayout = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};
var maskStyle = {
    backgroundColor: 'white',
    opacity: .5,
    transition: 'opacity .3s',
};
function default_1(props) {
    var _a = __read(react_1.useState(false), 2), isActive = _a[0], setActive = _a[1];
    var Loading = props.loading, _b = props.threshold, threshold = _b === void 0 ? 100 : _b, restProps = __rest(props, ["loading", "threshold"]);
    var timer;
    react_1.useEffect(function () {
        timer = window.setTimeout(function () { return setActive(true); }, threshold);
        return function () { return window.clearTimeout(timer); };
    }, []);
    return (React.createElement(react_1.Fragment, null, isActive
        ? typeof Loading === 'function'
            ? React.createElement(Loading, null)
            : [
                React.createElement("div", { key: 0, style: __assign(__assign({}, loadingLayout), maskStyle) }),
                React.createElement("div", { key: 1, style: loadingLayout }, Loading === true
                    ? React.createElement(Icons_1.default.Loading, __assign({ className: "designare-spin" }, restProps))
                    : Loading)
            ]
        : null));
}
exports.default = default_1;
