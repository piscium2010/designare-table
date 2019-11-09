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
const Layer_1 = require("@piscium2010/lime/Layer");
require("@piscium2010/lime/Layer/layer.css");
function FilterLayer(_a) {
    var { content, filterAPI, show } = _a, restProps = __rest(_a, ["content", "filterAPI", "show"]);
    const [visible, setVisible] = react_1.useState(show);
    react_1.useEffect(() => {
        const timer = show
            ? setVisible(true)
            : window.setTimeout(() => setVisible(false), 250 /* spare time for slide out animation which is 200ms */);
        return () => window.clearTimeout(timer);
    }, [show]);
    return (React.createElement(Layer_1.default, Object.assign({ show: show }, restProps), visible ? React.createElement(C, { content: content, filterAPI: filterAPI }) : null));
}
exports.default = FilterLayer;
function C(props) {
    const { content, filterAPI } = props;
    return content(filterAPI);
}
