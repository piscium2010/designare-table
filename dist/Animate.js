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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
function Animate(props) {
    var ref = react_1.useRef(null);
    react_1.useEffect(function () {
        window.requestAnimationFrame(function () {
            ref.current && ref.current.classList.add('animate');
        });
    }, []);
    return (React.createElement("div", __assign({ ref: ref }, props), props.children));
}
exports.default = Animate;
