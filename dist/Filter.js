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
const ReactDOM = require("react-dom");
const context_1 = require("./context");
const Icons_1 = require("./Icons");
const FilterLayer_1 = require("./FilterLayer");
const defaultStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', cursor: 'pointer', userSelect: 'none' };
class Filter extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { show: false, top: 0, right: 0 };
        this.ref = React.createRef();
        this.on = () => {
            const { top, right, height } = this.ref.current.getBoundingClientRect();
            this.container.classList.add('show');
            window.requestAnimationFrame(() => {
                this.setState({ show: true, top: top + height, right });
            });
        };
        this.off = () => {
            this.container.classList.remove('show');
            this.setState({ show: false });
        };
        this.onToggleFilter = evt => {
            const show = !this.state.show;
            show ? this.on() : this.off();
            this.props.onClick(evt);
        };
        this.onBlur = evt => {
            const className = evt.target.className;
            if (className.includes
                && className.includes(this.columnMetaKey)
                && className.includes('designare-table-filter')) {
                return;
            }
            this.off();
        };
        this.setActiveFilter = filterValue => {
            const { by, name } = this.props;
            const { getColumn, removeActiveFilter } = this.context;
            const { metaKey: columnMetaKey, dataKey } = getColumn();
            if (filterValue === undefined) {
                removeActiveFilter(columnMetaKey);
            }
            else {
                this.context.setActiveFilter({ columnMetaKey, filterValue, name, dataKey, by });
            }
        };
        this.updateLayer = () => {
            const filters = this.filters;
            const filter = this.my(filters);
            const isFilterInControlledMode = filters ? true : false;
            const { children: content } = this.props;
            const { show, top, right } = this.state;
            const filterAPI = {
                trigger: filterValue => {
                    const _a = this.props, { name, by } = _a, restProps = __rest(_a, ["name", "by"]);
                    const nextFilters = [], columnMetaKey = this.columnMetaKey, dataKey = this.dataKey;
                    this.filterValue = filterValue;
                    this.activeFilters.forEach((filter, metaKey) => {
                        if (metaKey !== columnMetaKey) {
                            nextFilters.push(filter);
                        }
                    });
                    const me = { filterValue, name, dataKey, by };
                    isFilterInControlledMode ? Object.assign(me, restProps) : undefined;
                    isFilterInControlledMode ? undefined : this.setActiveFilter(filterValue);
                    nextFilters.push(me);
                    this.context.onChangeFilters(nextFilters);
                },
                filterValue: isFilterInControlledMode
                    ? filter ? filter.filterValue : undefined
                    : this.filterValue
            };
            ReactDOM.render(React.createElement(FilterLayer_1.default, { animation: 'slide-down', className: 'designare-table-layer designare-shadow', onBlur: this.onBlur, top: top, right: window.innerWidth - right, show: show, content: content, filterAPI: filterAPI }), this.container);
        };
        this.tableDidMount = () => {
            const filters = this.filters || this.defaultFilters;
            if (filters) {
                const filter = this.my(filters);
                this.setActiveFilter(filter ? filter.filterValue : undefined);
                this.filterValue = filter ? filter.filterValue : undefined;
            }
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
    get container() {
        return this._container || (this._container = this.context.getFilterLayerContainer(this.columnMetaKey));
    }
    get defaultFilters() {
        return this.context.getDefaultFilters();
    }
    get filters() {
        return this.context.getFilters();
    }
    get activeFilters() {
        return this.context.getActiveFilters();
    }
    get isActive() {
        let result = false;
        this.activeFilters.forEach((f, columnMetaKey) => {
            if (columnMetaKey === this.columnMetaKey && f.filterValue !== undefined) {
                result = true;
            }
        });
        return result;
    }
    my(filters = []) {
        const dataKey = this.dataKey, name = this.props.name;
        return filters.find(f => f.name ? f.name === name : f.dataKey === dataKey);
    }
    componentDidMount() {
        this.context.addEventListener('tableDidMount', this.tableDidMount);
    }
    componentDidUpdate() {
        const filters = this.filters;
        if (filters) {
            const filter = this.my(filters);
            this.setActiveFilter(filter ? filter.filterValue : undefined);
        }
        this.updateLayer();
    }
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.container);
        this.context.removeEventListener('tableDidMount', this.tableDidMount);
    }
    render() {
        if (this.context.contextName !== 'thead')
            throw 'designare-table: Filter component should be within Header component';
        const { show } = this.state;
        const _a = this.props, { by, className = '', children: C, style = {}, onClick, activeColor, defaultColor, render: Render } = _a, restProps = __rest(_a, ["by", "className", "children", "style", "onClick", "activeColor", "defaultColor", "render"]);
        const width = style.width || 18;
        const isActive = this.isActive || show;
        return (React.createElement("span", null,
            "\u00A0\u00A0\u00A0",
            React.createElement("div", Object.assign({ ref: this.ref, className: `designare-table-filter designare-transition ${className} ${this.columnMetaKey} ${isActive ? 'active' : ''}`, onClick: this.onToggleFilter, style: Object.assign(Object.assign(Object.assign({ width: width }, defaultStyle), style), { color: isActive ? this.activeColor : this.defaultColor }) }, restProps),
                React.createElement(Render, null))));
    }
}
exports.default = Filter;
Filter.contextType = context_1.ThsContext;
Filter.defaultProps = {
    children: () => 'please implement your filter content',
    onClick: () => { },
    render: () => React.createElement(Icons_1.default.Filter, null)
};
