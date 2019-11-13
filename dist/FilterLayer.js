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
var Layer_1 = require("@piscium2010/lime/Layer");
require("@piscium2010/lime/Layer/layer.css");
function FilterLayer(_a) {
    var content = _a.content, filterAPI = _a.filterAPI, show = _a.show, restProps = __rest(_a, ["content", "filterAPI", "show"]);
    var _b = __read(react_1.useState(show), 2), visible = _b[0], setVisible = _b[1];
    react_1.useEffect(function () {
        var timer = show
            ? setVisible(true)
            : window.setTimeout(function () { return setVisible(false); }, 250);
        return function () { return window.clearTimeout(timer); };
    }, [show]);
    return (React.createElement(Layer_1.default, __assign({ show: show }, restProps), visible ? React.createElement(C, { content: content, filterAPI: filterAPI }) : null));
}
exports.default = FilterLayer;
function C(props) {
    var content = props.content, filterAPI = props.filterAPI;
    return content(filterAPI);
}
