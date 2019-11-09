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
const context_1 = require("./context");
const Icons_1 = require("./Icons");
const messages_1 = require("./messages");
const defaultStyle = { position: 'relative', cursor: 'pointer', userSelect: 'none', padding: '0 4px' };
const commonStyle = { position: 'absolute', left: 4, top: '50%', width: 9, transform: 'translate(0,-8px)' };
class Sorter extends React.Component {
    constructor() {
        super(...arguments);
        this.setActiveSorter = sorter => {
            if (!this.dataKey)
                throw messages_1.ERR3;
            if (sorter && this.dataKey === sorter.dataKey) {
                const direction = sorter.direction;
                const { by, directions = [] } = this.props;
                const status = ['default'].concat(directions);
                if (!status.includes(direction)) {
                    throw `direction: ${direction || 'empty'} is not in Sorter of ${this.dataKey}`;
                }
                this.context.setActiveSorter({ columnMetaKey: this.columnMetaKey, direction, by: sortMethod(by), dataKey: this.dataKey });
            }
        };
        this.tableDidMount = () => {
            const { getDefaultSorter, getSorter } = this.context;
            const sorter = getSorter() || getDefaultSorter();
            this.setActiveSorter(sorter);
        };
    }
    get activeColor() {
        return this.props.activeColor || this.context.activeColor;
    }
    get defaultColor() {
        return this.props.defaultColor || this.context.defaultColor;
    }
    get dataKey() {
        return this.context.getColumn().dataKey;
    }
    get columnMetaKey() {
        return this.context.getColumn().metaKey;
    }
    componentDidMount() {
        const { addEventListener } = this.context;
        addEventListener('tableDidMount', this.tableDidMount);
    }
    componentDidUpdate() {
        this.update();
    }
    update() {
        const { getSorter } = this.context;
        const sorter = getSorter();
        if (sorter)
            this.setActiveSorter(sorter);
    }
    componentWillUnmount() {
        this.context.removeEventListener('tableDidMount', this.tableDidMount);
    }
    render() {
        const { contextName, getActiveSorter, getSorter, onChangeSorter } = this.context;
        if (contextName !== 'thead')
            throw 'Sorter component should be within Header component';
        const _a = this.props, { activeColor, by, defaultColor, className = '', directions = [], style, onClickCapture, render: Render } = _a, restProps = __rest(_a, ["activeColor", "by", "defaultColor", "className", "directions", "style", "onClickCapture", "render"]);
        const s = getActiveSorter(), dataKey = this.dataKey;
        const isActive = s.dataKey === dataKey && directions.includes(s.direction);
        const status = directions.concat('default');
        const i = isActive ? status.indexOf(s.direction) : 0;
        const onClick = () => {
            const isSorterInControlledMode = getSorter() ? true : false;
            const next = isActive ? i + 1 : 0;
            const direction = status[next % status.length];
            onChangeSorter(Object.assign({ dataKey, direction, by }, restProps));
            onClickCapture();
            if (!isSorterInControlledMode) {
                this.setActiveSorter({ dataKey, direction });
            }
        };
        return (React.createElement("span", Object.assign({ className: `designare-table-sorter ${className}`, style: Object.assign(Object.assign({}, defaultStyle), style), onClickCapture: onClick }, restProps),
            "\u00A0\u00A0",
            React.createElement(Render, { direction: isActive ? status[i] : 'default', directions: directions, defaultColor: this.defaultColor, activeColor: this.activeColor })));
    }
}
exports.default = Sorter;
Sorter.contextType = context_1.ThsContext;
Sorter.defaultProps = {
    by: 'string',
    directions: ['asc', 'des'],
    onClickCapture: () => { },
    render: ({ direction, directions, defaultColor, activeColor }) => {
        const icons = directions.filter(d => d !== 'default');
        return (React.createElement(React.Fragment, null, icons.length === 2
            ? React.createElement(React.Fragment, null,
                React.createElement("div", { className: `designare-icon designare-transition`, style: Object.assign(Object.assign({}, commonStyle), { color: direction === 'asc' ? activeColor : defaultColor }) },
                    React.createElement(Icons_1.default.SortUp, null)),
                React.createElement("div", { className: `designare-icon designare-transition`, style: Object.assign(Object.assign({}, commonStyle), { color: direction === 'des' ? activeColor : defaultColor }) },
                    React.createElement(Icons_1.default.SortDown, null)))
            :
                React.createElement("div", { className: `designare-icon designare-transition`, style: Object.assign(Object.assign({}, commonStyle), { top: '50%', transform: icons[0] === 'asc' ? 'translateY(-30%)' : 'translateY(-55%)', color: direction === icons[0] ? activeColor : defaultColor }) }, icons[0] === 'asc' ? React.createElement(Icons_1.default.SortUp, null) : icons[0] === 'des' ? React.createElement(Icons_1.default.SortDown, null) : null)));
    }
};
function sortByNumeric(a, b) {
    let left = a / 1, right = b / 1;
    left = isNaN(left) ? 0 : left;
    right = isNaN(right) ? 0 : right;
    return left - right;
}
function sortByString(a, b) {
    const left = a, right = b;
    if (left > right)
        return 1;
    if (left == right)
        return 0;
    if (left < right)
        return -1;
}
function sortMethod(by) {
    let func = by;
    switch (func) {
        case 'number':
            func = sortByNumeric;
            break;
        case 'string':
            func = sortByString;
            break;
        case 'date':
            func = sortByNumeric;
            break;
        case 'server':
            break;
        default:
            if (typeof func !== 'function')
                throw `prop 'by' of Sorter should be one of 'number', 'string', 'date' or function`;
    }
    return func;
}
