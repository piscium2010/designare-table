"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
function Animate(props) {
    const ref = react_1.useRef(null);
    react_1.useEffect(() => {
        window.requestAnimationFrame(() => {
            ref.current.classList.add('animate');
        });
    }, []);
    return (React.createElement("div", Object.assign({ ref: ref }, props), props.children));
}
exports.default = Animate;
