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
const HTMLTbody_1 = require("./HTMLTbody");
const context_1 = require("./context");
const debounce = require("lodash/debounce");
class Body extends React.Component {
    constructor(props) {
        super(props);
        this.onScroll = evt => {
            this.shadow(evt.target.scrollLeft);
            this.props.onScroll(evt);
            this.debouncedReset();
        };
        this.shadow = scrollLeft => {
            const scrollRight = this.tableWidth - scrollLeft - this.bodyWidth;
            if (scrollLeft == 0) {
                this.shadowLeft ? this.leftRef.current.classList.remove('designare-shadow') : undefined;
                this.shadowLeft = false;
            }
            else {
                this.shadowLeft ? undefined : this.leftRef.current.classList.add('designare-shadow');
                this.shadowLeft = true;
            }
            if (scrollRight <= 0) {
                this.shadowRight ? this.rightRef.current.classList.remove('designare-shadow') : undefined;
                this.shadowRight = false;
            }
            else {
                this.shadowRight ? undefined : this.rightRef.current.classList.add('designare-shadow');
                this.shadowRight = true;
            }
        };
        this.reset = () => {
            this.tableWidth = undefined;
            this.bodyWidth = undefined;
        };
        this.bodyRef;
        this.tableRef = React.createRef();
        this.leftRef = React.createRef();
        this.rightRef = React.createRef();
        this.shadowLeft = false;
        this.shadowRight = false;
        this.debouncedReset = debounce(this.reset, 100);
    }
    get bodyWidth() {
        return this._bodyWidth || (this._bodyWidth = this.bodyRef.current.offsetWidth);
    }
    get tableWidth() {
        return this._tableWidth || (this._tableWidth = this.tableRef.current.offsetWidth);
    }
    set bodyWidth(value) {
        this._bodyWidth = value;
    }
    set tableWidth(value) {
        this._tableWidth = value;
    }
    componentDidUpdate() {
        this.shadow(this.bodyRef.current.scrollLeft);
    }
    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context;
        const _a = this.props, { className, tr, style, onScroll } = _a, restProps = __rest(_a, ["className", "tr", "style", "onScroll"]);
        return (React.createElement("div", Object.assign({ className: `designare-table-fixed-body animate ${className}`, style: Object.assign({ flex: '0 1 100%', position: 'relative', overflow: 'hidden', opacity: isInit() ? 1 : 0 }, style) }, restProps),
            React.createElement(Left, { leftRef: this.leftRef, syncScrolling: syncScrolling, removeSyncScrolling: removeSyncScrolling },
                React.createElement(HTMLTbody_1.default, { fixed: 'left', tr: tr })),
            React.createElement(Normal, { deliverBodyRef: ref => this.bodyRef = ref, tableRef: this.tableRef, syncScrolling: syncScrolling, removeSyncScrolling: removeSyncScrolling, onScroll: this.onScroll },
                React.createElement(HTMLTbody_1.default, { tr: tr })),
            React.createElement(Right, { rightRef: this.rightRef, syncScrolling: syncScrolling, removeSyncScrolling: removeSyncScrolling },
                React.createElement(HTMLTbody_1.default, { fixed: 'right', tr: tr }))));
    }
}
exports.default = Body;
Body.contextType = context_1.Context;
Body.defaultProps = {
    className: '',
    onScroll: () => { }
};
function Normal(props) {
    const ref = react_1.useRef(null);
    const { syncScrolling, removeSyncScrolling, onScroll, tableRef, deliverBodyRef } = props;
    react_1.useEffect(() => {
        deliverBodyRef(ref);
        syncScrolling(ref.current, 'both');
        return () => { removeSyncScrolling(ref.current); };
    }, []);
    return (React.createElement("div", { ref: ref, className: 'designare-table-body', style: { width: '100%', height: '100%', overflow: 'auto' }, onScroll: onScroll },
        React.createElement("table", { ref: tableRef }, props.children)));
}
function Left(props) {
    const ref = react_1.useRef(null);
    const { syncScrolling, removeSyncScrolling, leftRef } = props;
    react_1.useEffect(() => {
        syncScrolling(ref.current, 'scrollTop');
        return () => { removeSyncScrolling(ref.current); };
    }, []);
    return (React.createElement("div", { ref: leftRef, className: 'designare-table-body-left' },
        React.createElement("div", { ref: ref, style: { height: '100%', overflowY: 'auto', backgroundColor: 'inherit' } },
            React.createElement("table", null, props.children))));
}
function Right(props) {
    const ref = react_1.useRef(null);
    const { syncScrolling, removeSyncScrolling, rightRef } = props;
    react_1.useEffect(() => {
        syncScrolling(ref.current, 'scrollTop');
        return () => { removeSyncScrolling(ref.current); };
    }, []);
    return (React.createElement("div", { ref: rightRef, className: 'designare-table-body-right' },
        React.createElement("div", { ref: ref, style: { height: '100%', overflowY: 'auto', backgroundColor: 'inherit' } },
            React.createElement("table", null, props.children))));
}
