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
var ReactDOM = require("react-dom");
var context_1 = require("./context");
var Icons_1 = require("./Icons");
var FilterLayer_1 = require("./FilterLayer");
var defaultStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' };
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { show: false, top: 0, right: 0 };
        _this.ref = React.createRef();
        _this.on = function () {
            var _a = _this.ref.current.getBoundingClientRect(), top = _a.top, right = _a.right, height = _a.height;
            _this.container.classList.add('show');
            window.requestAnimationFrame(function () {
                _this.setState({ show: true, top: top + height, right: right });
            });
        };
        _this.off = function () {
            _this.container.classList.remove('show');
            _this.setState({ show: false });
        };
        _this.onToggleFilter = function (evt) {
            var show = !_this.state.show;
            show ? _this.on() : _this.off();
            _this.props.onClick(evt);
        };
        _this.onBlur = function (evt) {
            var className = evt.target.className;
            if (className.includes
                && className.includes(_this.columnMetaKey)
                && className.includes('designare-table-filter')) {
                return;
            }
            _this.off();
        };
        _this.setActiveFilter = function (filterValue) {
            var _a = _this.props, by = _a.by, name = _a.name;
            var _b = _this.context, getColumn = _b.getColumn, removeActiveFilter = _b.removeActiveFilter;
            var _c = getColumn(), columnMetaKey = _c.metaKey, dataKey = _c.dataKey;
            if (filterValue === undefined) {
                removeActiveFilter(columnMetaKey);
            }
            else {
                _this.context.setActiveFilter({ columnMetaKey: columnMetaKey, filterValue: filterValue, name: name, dataKey: dataKey, by: by });
            }
        };
        _this.updateLayer = function () {
            var filters = _this.filters;
            var filter = _this.my(filters);
            var isFilterInControlledMode = filters ? true : false;
            var content = _this.props.children;
            var _a = _this.state, show = _a.show, top = _a.top, right = _a.right;
            var filterAPI = {
                trigger: function (filterValue) {
                    var _a = _this.props, name = _a.name, by = _a.by, restProps = __rest(_a, ["name", "by"]);
                    var nextFilters = [], columnMetaKey = _this.columnMetaKey, dataKey = _this.dataKey;
                    _this.filterValue = filterValue;
                    _this.activeFilters.forEach(function (filter, metaKey) {
                        if (metaKey !== columnMetaKey) {
                            nextFilters.push(filter);
                        }
                    });
                    var me = { filterValue: filterValue, name: name, dataKey: dataKey, by: by };
                    isFilterInControlledMode ? Object.assign(me, restProps) : undefined;
                    isFilterInControlledMode ? undefined : _this.setActiveFilter(filterValue);
                    nextFilters.push(me);
                    _this.context.onChangeFilters(nextFilters);
                },
                filterValue: isFilterInControlledMode
                    ? filter ? filter.filterValue : undefined
                    : _this.filterValue
            };
            ReactDOM.render(React.createElement(FilterLayer_1.default, { animation: 'slide-down', className: 'designare-table-layer designare-shadow', onBlur: _this.onBlur, top: top, right: window.innerWidth - right, show: show, content: content, filterAPI: filterAPI }), _this.container);
        };
        _this.tableDidMount = function () {
            var filters = _this.filters || _this.defaultFilters;
            if (filters) {
                var filter = _this.my(filters);
                _this.setActiveFilter(filter ? filter.filterValue : undefined);
                _this.filterValue = filter ? filter.filterValue : undefined;
            }
        };
        return _this;
    }
    Object.defineProperty(Filter.prototype, "activeColor", {
        get: function () {
            return this.props.activeColor || this.context.activeColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "defaultColor", {
        get: function () {
            return this.props.defaultColor || this.context.defaultColor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "dataKey", {
        get: function () {
            return this.context.getColumn().dataKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "columnMetaKey", {
        get: function () {
            return this.context.getColumn().metaKey;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "container", {
        get: function () {
            return this._container || (this._container = this.context.getFilterLayerContainer(this.columnMetaKey));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "defaultFilters", {
        get: function () {
            return this.context.getDefaultFilters();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "filters", {
        get: function () {
            return this.context.getFilters();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "activeFilters", {
        get: function () {
            return this.context.getActiveFilters();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Filter.prototype, "isActive", {
        get: function () {
            var _this = this;
            var result = false;
            this.activeFilters.forEach(function (f, columnMetaKey) {
                if (columnMetaKey === _this.columnMetaKey && f.filterValue !== undefined) {
                    result = true;
                }
            });
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Filter.prototype.my = function (filters) {
        if (filters === void 0) { filters = []; }
        var dataKey = this.dataKey, name = this.props.name;
        return filters.find(function (f) { return f.name ? f.name === name : f.dataKey === dataKey; });
    };
    Filter.prototype.componentDidMount = function () {
        this.context.addEventListener('tableDidMount', this.tableDidMount);
    };
    Filter.prototype.componentDidUpdate = function () {
        var filters = this.filters;
        if (filters) {
            var filter = this.my(filters);
            this.setActiveFilter(filter ? filter.filterValue : undefined);
        }
        this.updateLayer();
    };
    Filter.prototype.componentWillUnmount = function () {
        ReactDOM.unmountComponentAtNode(this.container);
        this.context.removeEventListener('tableDidMount', this.tableDidMount);
    };
    Filter.prototype.render = function () {
        if (this.context.contextName !== 'thead')
            throw 'designare-table: Filter component should be within Header component';
        var show = this.state.show;
        var _a = this.props, by = _a.by, _b = _a.className, className = _b === void 0 ? '' : _b, C = _a.children, _c = _a.style, style = _c === void 0 ? {} : _c, onClick = _a.onClick, activeColor = _a.activeColor, defaultColor = _a.defaultColor, Render = _a.render, restProps = __rest(_a, ["by", "className", "children", "style", "onClick", "activeColor", "defaultColor", "render"]);
        var width = style.width || 18;
        var isActive = this.isActive || show;
        return (React.createElement(React.Fragment, null,
            React.createElement("span", null, "\u00A0\u00A0\u00A0"),
            React.createElement("div", __assign({ ref: this.ref, className: "designare-table-filter designare-transition " + className + " " + this.columnMetaKey + " " + (isActive ? 'active' : ''), onClick: this.onToggleFilter, style: __assign(__assign(__assign({ width: width }, defaultStyle), style), { color: isActive ? this.activeColor : this.defaultColor }) }, restProps),
                React.createElement(Render, null))));
    };
    Filter.contextType = context_1.ThsContext;
    Filter.defaultProps = {
        children: function () { return 'please implement your filter content'; },
        onClick: function () { },
        render: function () { return React.createElement(Icons_1.default.Filter, null); }
    };
    return Filter;
}(React.Component));
exports.default = Filter;
