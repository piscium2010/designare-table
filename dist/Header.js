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
const HTMLThead_1 = require("./HTMLThead");
const Animate_1 = require("./Animate");
const context_1 = require("./context");
const debounce = require("lodash/debounce");
class Header extends React.Component {
    constructor(props) {
        super(props);
        this.onScroll = evt => {
            this.shadow(evt.target.scrollLeft);
            this.props.onScroll(evt);
            this.debouncedReset();
        };
        this.shadow = scrollLeft => {
            const scrollRight = this.tableWidth - scrollLeft - this.headerWidth;
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
            this.headerWidth = undefined;
        };
        this.headerRef;
        this.tableRef = React.createRef();
        this.leftRef = React.createRef();
        this.rightRef = React.createRef();
        this.shadowLeft = false;
        this.shadowRight = false;
        this.debouncedReset = debounce(this.reset, 100);
    }
    get headerWidth() {
        return this._headerWidth || (this._headerWidth = this.headerRef.current.offsetWidth);
    }
    get tableWidth() {
        return this._tableWidth || (this._tableWidth = this.tableRef.current.offsetWidth);
    }
    set headerWidth(value) {
        this._headerWidth = value;
    }
    set tableWidth(value) {
        this._tableWidth = value;
    }
    componentDidUpdate() {
        this.shadow(this.headerRef.current.scrollLeft);
    }
    render() {
        const { isInit, syncScrolling, removeSyncScrolling } = this.context;
        const _a = this.props, { className, tr, style } = _a, restProps = __rest(_a, ["className", "tr", "style"]);
        return (React.createElement("div", Object.assign({ className: `designare-table-fixed-header ${className}`, style: Object.assign({ flex: '0 0 auto', overflow: 'hidden', opacity: isInit() ? 1 : 0 }, style) }, restProps),
            React.createElement(Animate_1.default, { style: { marginBottom: 0, position: 'relative', overflowX: 'hidden', backgroundColor: 'inherit' } },
                React.createElement(Left, { leftRef: this.leftRef },
                    React.createElement(HTMLThead_1.default, { fixed: 'left', tr: tr })),
                React.createElement(Normal, { deliverHeaderRef: ref => this.headerRef = ref, tableRef: this.tableRef, syncScrolling: syncScrolling, removeSyncScrolling: removeSyncScrolling, onScroll: this.onScroll },
                    React.createElement(HTMLThead_1.default, { tr: tr })),
                React.createElement(Right, { rightRef: this.rightRef },
                    React.createElement(HTMLThead_1.default, { fixed: 'right', tr: tr })))));
    }
}
exports.default = Header;
Header.contextType = context_1.Context;
Header.defaultProps = {
    className: '',
    onScroll: () => { }
};
function Normal(props) {
    const ref = react_1.useRef(null);
    const { syncScrolling, removeSyncScrolling, tableRef, deliverHeaderRef, onScroll } = props;
    react_1.useEffect(() => {
        deliverHeaderRef(ref);
        syncScrolling(ref.current, 'scrollLeft');
        return () => removeSyncScrolling(ref.current);
    }, []);
    return (React.createElement("div", { ref: ref, className: 'designare-table-header', style: { overflowX: 'scroll', overflowY: 'hidden' }, onScroll: onScroll },
        React.createElement("table", { ref: tableRef }, props.children)));
}
function Left(props) {
    const { leftRef } = props;
    return (React.createElement("div", { ref: leftRef, className: 'designare-table-header-left' },
        React.createElement("table", null, props.children)));
}
function Right(props) {
    const { rightRef } = props;
    return (React.createElement("div", { ref: rightRef, className: 'designare-table-header-right' },
        React.createElement("table", null, props.children)));
}
