"use strict";
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
var context_1 = require("./context");
var Icons_1 = require("./Icons");
var messages_1 = require("./messages");
var defaultStyle = { position: 'relative', cursor: 'pointer', userSelect: 'none', padding: '0 4px' };
var commonStyle = { position: 'absolute', left: 4, top: '50%', width: 9, transform: 'translate(0,-8px)' };
var Sorter = (function (_super) {
    __extends(Sorter, _super);
    function Sorter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setActiveSorter = function (sorter) {
            if (!_this.dataKey)
                throw messages_1.ERR3;
            if (sorter && _this.dataKey === sorter.dataKey) {
                var direction = sorter.direction;
                var _a = _this.props, by = _a.by, _b = _a.directions, directions = _b === void 0 ? [] : _b;
                var status_1 = ['default'].concat(directions);
                if (status_1.indexOf(direction) < 0) {
                    throw "direction: " + (direction || 'empty') + " is not in Sorter of " + _this.dataKey;
                }
                _this.context.setActiveSorter({ columnMetaKey: _this.columnMetaKey, direction: direction, by: sortMethod(by), dataKey: _this.dataKey });
            }
        };
        _this.tableDidMount = function () {
            var _a = _this.context, getDefaultSorter = _a.getDefaultSorter, getSorter = _a.getSorter;
            var sorter = getSorter() || getDefaultSorter();
            _this.setActiveSorter(sorter);
        };
        return _this;
    }
    Object.defineProperty(Sorter.prototype, "activeColor", {
        get: function () {
            return this.props.activeColor || this.context.activeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sorter.prototype, "defaultColor", {
        get: function () {
            return this.props.defaultColor || this.context.defaultColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sorter.prototype, "dataKey", {
        get: function () {
            return this.context.getColumn().dataKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sorter.prototype, "columnMetaKey", {
        get: function () {
            return this.context.getColumn().metaKey;
        },
        enumerable: true,
        configurable: true
    });
    Sorter.prototype.componentDidMount = function () {
        var addEventListener = this.context.addEventListener;
        addEventListener('tableDidMount', this.tableDidMount);
    };
    Sorter.prototype.componentDidUpdate = function () {
        this.update();
    };
    Sorter.prototype.update = function () {
        var getSorter = this.context.getSorter;
        var sorter = getSorter();
        if (sorter)
            this.setActiveSorter(sorter);
    };
    Sorter.prototype.componentWillUnmount = function () {
        this.context.removeEventListener('tableDidMount', this.tableDidMount);
    };
    Sorter.prototype.render = function () {
        var _this = this;
        var _a = this.context, contextName = _a.contextName, getActiveSorter = _a.getActiveSorter, getSorter = _a.getSorter, onChangeSorter = _a.onChangeSorter;
        if (contextName !== 'thead')
            throw 'Sorter component should be within Header component';
        var _b = this.props, activeColor = _b.activeColor, by = _b.by, defaultColor = _b.defaultColor, _c = _b.className, className = _c === void 0 ? '' : _c, _d = _b.directions, directions = _d === void 0 ? [] : _d, style = _b.style, onClickCapture = _b.onClickCapture, Render = _b.render, restProps = __rest(_b, ["activeColor", "by", "defaultColor", "className", "directions", "style", "onClickCapture", "render"]);
        var s = getActiveSorter(), dataKey = this.dataKey;
        var isActive = s.dataKey === dataKey && directions.indexOf(s.direction) >= 0;
        var status = directions.concat('default');
        var i = isActive ? status.indexOf(s.direction) : 0;
        var onClick = function (evt) {
            var isSorterInControlledMode = getSorter() ? true : false;
            var next = isActive ? i + 1 : 0;
            var direction = status[next % status.length];
            onChangeSorter(__assign({ dataKey: dataKey, direction: direction, by: by }, restProps));
            onClickCapture(evt);
            if (!isSorterInControlledMode) {
                _this.setActiveSorter({ dataKey: dataKey, direction: direction });
            }
        };
        return (React.createElement("span", __assign({ className: "designare-table-sorter " + className, style: __assign(__assign({}, defaultStyle), style), onClickCapture: onClick }, restProps),
            "\u00A0\u00A0",
            React.createElement(Render, { direction: isActive ? status[i] : 'default', directions: directions, defaultColor: this.defaultColor, activeColor: this.activeColor })));
    };
    Sorter.contextType = context_1.ThsContext;
    Sorter.defaultProps = {
        by: 'string',
        directions: ['asc', 'des'],
        onClickCapture: function () { },
        render: function (_a) {
            var direction = _a.direction, directions = _a.directions, defaultColor = _a.defaultColor, activeColor = _a.activeColor;
            var icons = directions.filter(function (d) { return d !== 'default'; });
            return (React.createElement(React.Fragment, null, icons.length === 2
                ? React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "designare-icon designare-transition", style: __assign(__assign({}, commonStyle), { color: direction === 'asc' ? activeColor : defaultColor }) },
                        React.createElement(Icons_1.default.SortUp, null)),
                    React.createElement("div", { className: "designare-icon designare-transition", style: __assign(__assign({}, commonStyle), { color: direction === 'des' ? activeColor : defaultColor }) },
                        React.createElement(Icons_1.default.SortDown, null)))
                :
                    React.createElement("div", { className: "designare-icon designare-transition", style: __assign(__assign({}, commonStyle), { top: '50%', transform: icons[0] === 'asc' ? 'translateY(-30%)' : 'translateY(-55%)', color: direction === icons[0] ? activeColor : defaultColor }) }, icons[0] === 'asc' ? React.createElement(Icons_1.default.SortUp, null) : icons[0] === 'des' ? React.createElement(Icons_1.default.SortDown, null) : null)));
        }
    };
    return Sorter;
}(React.Component));
exports.default = Sorter;
function sortByNumeric(a, b) {
    var left = a / 1, right = b / 1;
    left = isNaN(left) ? 0 : left;
    right = isNaN(right) ? 0 : right;
    return left - right;
}
function sortByString(a, b) {
    var left = a, right = b;
    if (left > right)
        return 1;
    if (left == right)
        return 0;
    if (left < right)
        return -1;
}
function sortMethod(by) {
    var func = by;
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
                throw "prop 'by' of Sorter should be one of 'number', 'string', 'date' or function";
    }
    return func;
}
