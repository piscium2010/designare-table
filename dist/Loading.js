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
const Icons_1 = require("./Icons");
const loadingLayout = {
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
const maskStyle = {
    backgroundColor: 'white',
    opacity: .5,
    transition: 'opacity .3s',
};
function default_1(props) {
    const [isActive, setActive] = react_1.useState(false);
    const { loading: Loading, threshold = 100 } = props, restProps = __rest(props, ["loading", "threshold"]);
    let timer;
    react_1.useEffect(() => {
        timer = window.setTimeout(() => setActive(true), threshold);
        return () => window.clearTimeout(timer);
    }, []);
    return (React.createElement(react_1.Fragment, null, isActive
        ? typeof Loading === 'function'
            ? React.createElement(Loading, null)
            : [
                React.createElement("div", { key: 0, style: Object.assign(Object.assign({}, loadingLayout), maskStyle) }),
                React.createElement("div", { key: 1, style: loadingLayout }, Loading === true
                    ? React.createElement(Icons_1.default.Loading, Object.assign({ className: `designare-spin` }, restProps))
                    : Loading)
            ]
        : null));
}
exports.default = default_1;
