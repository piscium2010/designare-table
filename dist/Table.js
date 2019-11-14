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
var debounce = require("lodash/debounce");
var react_1 = require("react");
var context_1 = require("./context");
var Thead_1 = require("./Thead");
var Tbody_1 = require("./Tbody");
var Pagination_1 = require("./Pagination");
var SyncScrolling_1 = require("./SyncScrolling");
var Loading_1 = require("./Loading");
var messages_1 = require("./messages");
var util_1 = require("./util");
require("./table.css");
var Table = (function (_super) {
    __extends(Table, _super);
    function Table(props) {
        var _this = _super.call(this, props) || this;
        _this.getDefaultFilters = function () {
            return _this.defaultFilters ? Array.from(_this.defaultFilters) : undefined;
        };
        _this.getFilters = function () {
            return _this.props.filters ? Array.from(_this.props.filters) : undefined;
        };
        _this.getActiveFilters = function () {
            return _this.activeFilters;
        };
        _this.setActiveFilter = function (_a) {
            var columnMetaKey = _a.columnMetaKey, dataKey = _a.dataKey, filterValue = _a.filterValue, name = _a.name, by = _a.by;
            var previous = _this.activeFilters.get(columnMetaKey) || {};
            if (previous.dataKey !== dataKey || previous.filterValue !== filterValue) {
                _this.activeFilters.set(columnMetaKey, { filterValue: filterValue, name: name, dataKey: dataKey, by: by });
                var keyMap_1 = new Map(), nameMap_1 = new Map();
                _this.activeFilters.forEach(function (f) {
                    var dataKey = f.dataKey, name = f.name;
                    keyMap_1.has(dataKey) ? keyMap_1.set(dataKey, keyMap_1.get(dataKey) + 1) : keyMap_1.set(dataKey, 1);
                    if (name !== undefined) {
                        nameMap_1.has(name) ? nameMap_1.set(name, nameMap_1.get(name) + 1) : nameMap_1.set(name, 1);
                    }
                });
                keyMap_1.forEach(function (v, dataKey) {
                    if (v > 1)
                        throw new Error("More than one Filter is found for dataKey " + dataKey + ".\n Please specify 'name' to distinguish each filter \n e.g.\nfilter: <Filter name='address'/> \ntable: <Table filters={[{name:'address', filterValue:'west lake'}]}/>");
                });
                nameMap_1.forEach(function (v, name) {
                    if (v > 1)
                        throw new Error("More than one Filter is found for name " + name + ".\n name should be unique for each filter");
                });
                keyMap_1.clear();
                nameMap_1.clear();
                _this.update();
            }
        };
        _this.removeActiveFilter = function (columnMetaKey) {
            if (_this.activeFilters.has(columnMetaKey)) {
                _this.activeFilters.delete(columnMetaKey);
                _this.update();
            }
        };
        _this.getDefaultSorter = function () {
            return _this.defaultSorter;
        };
        _this.getSorter = function () {
            return _this.props.sorter;
        };
        _this.setActiveSorter = function (_a) {
            var columnMetaKey = _a.columnMetaKey, dataKey = _a.dataKey, direction = _a.direction, by = _a.by;
            if (dataKey !== _this.activeSorter.dataKey || direction !== _this.activeSorter.direction) {
                _this.activeSorter = { columnMetaKey: columnMetaKey, dataKey: dataKey, direction: direction, by: by };
                _this.update();
            }
        };
        _this.setResizedWidthInfo = function (columnMetaKey, width) {
            _this.resizedWidthInfo.set(columnMetaKey, width);
        };
        _this.getActiveSorter = function () {
            return _this.activeSorter;
        };
        _this.getFilterLayerContainer = function (columnMetaKey) {
            return _this.filterLayersRef.current.getElementsByClassName(columnMetaKey)[0];
        };
        _this.getColGroups = function () {
            var findDOM = find.bind(null, _this.root.current);
            var roots = [];
            var colgroups = [];
            var _a = __read(findDOM('header'), 3), headerWrapper = _a[0], headerRoot = _a[1], header = _a[2];
            var _b = __read(findDOM('header', 'left'), 3), leftHeaderWrapper = _b[0], leftHeaderRoot = _b[1], leftHeader = _b[2];
            var _c = __read(findDOM('header', 'right'), 3), rightHeaderWrapper = _c[0], rightHeaderRoot = _c[1], rightHeader = _c[2];
            var _d = __read(findDOM('body'), 3), bodyWrapper = _d[0], bodyRoot = _d[1], body = _d[2];
            var _e = __read(findDOM('body', 'left'), 3), leftBodyWrapper = _e[0], leftBodyRoot = _e[1], leftBody = _e[2];
            var _f = __read(findDOM('body', 'right'), 3), rightBodyWrapper = _f[0], rightBodyRoot = _f[1], rightBody = _f[2];
            var headerColGroup = headerRoot.getElementsByTagName('colgroup')[0];
            var leftHeaderColGroup = leftHeaderRoot.getElementsByTagName('colgroup')[0];
            var rightHeaderColGroup = rightHeaderRoot.getElementsByTagName('colgroup')[0];
            var bodyColGroup = bodyRoot.getElementsByTagName('colgroup')[0];
            var leftBodyColGroup = leftBodyRoot.getElementsByTagName('colgroup')[0];
            var rightBodyColGroup = rightBodyRoot.getElementsByTagName('colgroup')[0];
            headerColGroup ? colgroups.push(headerColGroup) : undefined;
            leftHeaderColGroup ? colgroups.push(leftHeaderColGroup) : undefined;
            rightHeaderColGroup ? colgroups.push(rightHeaderColGroup) : undefined;
            bodyColGroup ? colgroups.push(bodyColGroup) : undefined;
            leftBodyColGroup ? colgroups.push(leftBodyColGroup) : undefined;
            rightBodyColGroup ? colgroups.push(rightBodyColGroup) : undefined;
            headerRoot ? roots.push(headerRoot) : undefined;
            leftHeaderRoot ? roots.push(leftHeaderRoot) : undefined;
            rightHeaderRoot ? roots.push(rightHeaderRoot) : undefined;
            bodyRoot ? roots.push(bodyRoot) : undefined;
            leftBodyRoot ? roots.push(leftBodyRoot) : undefined;
            rightBodyRoot ? roots.push(rightBodyRoot) : undefined;
            var minWidthArray = Array.from(_this.dimensionInfo.originalMaxWidthArray);
            var maxWidthArray = Array.from(_this.dimensionInfo.maxWidthArray);
            return [roots, colgroups, minWidthArray, maxWidthArray];
        };
        _this.addEventListener = function (type, func) {
            if (type === void 0) { type = 'tableDidMount'; }
            switch (type) {
                case 'tableDidMount':
                    _this.tableDidMountListeners.set(func, '');
                    break;
                default:
                    throw "invalid event type: " + type;
            }
        };
        _this.removeEventListener = function (type, func) {
            if (type === void 0) { type = 'tableDidMount'; }
            switch (type) {
                case 'tableDidMount':
                    _this.tableDidMountListeners.delete(func);
                    break;
                default:
                    throw "invalid event type: " + type;
            }
        };
        _this.syncScrolling = function (scrollable, mode) {
            if (mode === void 0) { mode = 'scrollLeft'; }
            _this.syncScrollingInstance.add(scrollable, mode);
        };
        _this.removeSyncScrolling = function (scrollable) {
            _this.syncScrollingInstance.remove(scrollable);
        };
        _this.sort = function (data) {
            var result = Array.from(data);
            var _a = _this.getActiveSorter(), dataKey = _a.dataKey, direction = _a.direction, by = _a.by;
            if (dataKey && direction && direction !== 'default' && typeof by === 'function') {
                result.sort(function (a, b) { return by(a[dataKey], b[dataKey]); });
                if (direction === 'des')
                    result.reverse();
            }
            return result;
        };
        _this.filter = function (data) {
            var result = data;
            _this.activeFilters.forEach(function (f) {
                var dataKey = f.dataKey, by = f.by, filterValue = f.filterValue;
                if (typeof by === 'function') {
                    result = result.filter(function (row) { return by({ dataKey: dataKey, filterValue: filterValue, row: row }); });
                }
            });
            return result;
        };
        _this.filterAndSort = function (data) {
            var result = data;
            result = _this.filter(result);
            result = _this.sort(result);
            return result;
        };
        _this.paging = function (data) {
            var _a = _this, pageNo = _a.pageNo, pageSize = _a.pageSize;
            var start = (pageNo - 1) * pageSize;
            return _this.isClientPaging ? data.slice(start, start + pageSize) : data;
        };
        _this.onGoToPage = function (pageNo) {
            var next;
            next = Math.max(1, pageNo);
            next = Math.min(Math.ceil(_this.total / _this.pageSize), next);
            _this.setState({ pageNo: next }, function () {
                _this.props.onChangePaging({ pageNo: next, pageSize: _this.pageSize });
            });
        };
        _this.setPageSize = function (pageSize) {
            _this.setState({ pageSize: pageSize, pageNo: 1 }, function () {
                _this.props.onChangePaging({ pageSize: pageSize, pageNo: 1 });
            });
        };
        _this.update = function () {
            _this.updateId ? ++_this.updateId : (_this.updateId = 1);
            var id = _this.updateId;
            window.requestAnimationFrame(function () {
                id === _this.updateId ? _this.setState({}) : undefined;
            });
        };
        _this.printWarnings = function (warnings) {
            warnings.forEach(function (str) {
                if (!_this.warnings.has(str)) {
                    console.warn("designare-table: " + str + " ");
                    _this.warnings.set(str, 'printed');
                }
            });
        };
        _this.syncWidthAndHeight = function (force) {
            var rowHeight = _this.props.rowHeight;
            var _a = _this, dimensionInfo = _a.dimensionInfo, flattenSortedColumns = _a.flattenSortedColumns, root = _a.root, resizedWidthInfo = _a.resizedWidthInfo, depthOfColumns = _a.depthOfColumns;
            syncWidthAndHeight(root.current, flattenSortedColumns, rowHeight, dimensionInfo, resizedWidthInfo, depthOfColumns, force);
        };
        _this.reSyncWidthAndHeight = function (force) {
            if (force === void 0) { force = false; }
            var _a = _this, dimensionInfo = _a.dimensionInfo, flattenSortedColumns = _a.flattenSortedColumns, root = _a.root;
            var dimensionId = code(flattenSortedColumns);
            var isReSized = force || dimensionId !== dimensionInfo.dimensionId || isDimensionChanged(root.current, getColumnSize(flattenSortedColumns), dimensionInfo);
            if (isReSized) {
                _this.debouncedSyncWidthAndHeight(force);
            }
        };
        _this.syncScrollBarStatus = function () {
            syncScrollBarStatus(_this.root.current);
        };
        _this.resize = function () { return _this.reSyncWidthAndHeight(true); };
        _this.root = React.createRef();
        _this.filterLayersRef = React.createRef();
        _this.isInit = false;
        _this.activeSorter = { columnMetaKey: '', direction: '' };
        _this.tableDidMountListeners = new Map();
        _this.activeFilters = new Map();
        _this.syncScrollingInstance = new SyncScrolling_1.default();
        _this.dimensionInfo = {};
        _this.resizedWidthInfo = new Map();
        _this.debouncedUpdate = debounce(_this.update, 100);
        _this.debouncedSyncWidthAndHeight = debounce(_this.syncWidthAndHeight, 100, { leading: true, trailing: true });
        _this.debouncedReSyncWidthAndHeight = debounce(_this.reSyncWidthAndHeight, 100, { leading: true, trailing: true });
        _this.warnings = new Map();
        _this.cells = new Map();
        _this.headerCells = new Map();
        _this.global = Object.seal({
            'designare-draggable-column-index': undefined,
            'designare-draggable-row-index': undefined,
            'resizing': false
        });
        _this.contextAPI = {
            getFilterLayerContainer: _this.getFilterLayerContainer,
            getDefaultFilters: _this.getDefaultFilters,
            getFilters: _this.getFilters,
            setActiveFilter: _this.setActiveFilter,
            getActiveFilters: _this.getActiveFilters,
            removeActiveFilter: _this.removeActiveFilter,
            onChangeFilters: props.onChangeFilters,
            getDefaultSorter: _this.getDefaultSorter,
            getSorter: _this.getSorter,
            setActiveSorter: _this.setActiveSorter,
            getActiveSorter: _this.getActiveSorter,
            onChangeSorter: props.onChangeSorter,
            addEventListener: _this.addEventListener,
            removeEventListener: _this.removeEventListener,
            syncScrolling: _this.syncScrolling,
            removeSyncScrolling: _this.removeSyncScrolling,
            reSyncWidthAndHeight: _this.debouncedReSyncWidthAndHeight,
            syncScrollBarStatus: _this.syncScrollBarStatus,
            getColGroups: _this.getColGroups,
            setResizedWidthInfo: _this.setResizedWidthInfo,
            isInit: function () { return _this.isInit; },
            cells: _this.cells,
            headerCells: _this.headerCells,
            global: _this.global,
            activeColor: props.activeColor,
            defaultColor: props.defaultColor,
            rowHeight: props.rowHeight,
            onChangeColumns: props.onChangeColumns,
            onChangeRows: props.onChangeRows,
            resizable: props.resizable
        };
        _this.state = {
            hasError: false,
            pageNo: 'defaultPageNo' in props ? props.defaultPageNo : 1,
            pageSize: 'defaultPageSize' in props ? props.defaultPageSize : 10,
        };
        _this.defaultFilters = 'defaultFilters' in props ? Array.from(props.defaultFilters) : undefined;
        _this.defaultSorter = 'defaultSorter' in props ? props.defaultSorter : undefined;
        return _this;
    }
    Table.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    Object.defineProperty(Table.prototype, "pageNo", {
        get: function () {
            return 'pageNo' in this.props ? this.props.pageNo : this.state.pageNo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "pageSize", {
        get: function () {
            return 'pageSize' in this.props ? this.props.pageSize : this.state.pageSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "total", {
        get: function () {
            return 'total' in this.props ? this.props.total : this.props.data ? this.props.data.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "isPaging", {
        get: function () {
            var pageSize = 'pageSize' in this.props ? true : false;
            var pageSizeOptions = 'pageSizeOptions' in this.props ? true : false;
            return pageSize || pageSizeOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Table.prototype, "isClientPaging", {
        get: function () {
            var total = 'total' in this.props ? true : false;
            return this.isPaging && !total;
        },
        enumerable: true,
        configurable: true
    });
    Table.prototype.componentDidMount = function () {
        if (this.state.hasError)
            return;
        var flattenSortedColumns = this.flattenSortedColumns;
        var columnSize = getColumnSize(flattenSortedColumns);
        if (columnSize > 0) {
            if (this.cells.size % columnSize !== 0)
                throw messages_1.ERR0;
            if (this.headerCells.size % flattenSortedColumns.length !== 0)
                throw messages_1.ERR1;
        }
        window.addEventListener('resize', this.resize);
        this.syncWidthAndHeight();
        this.isInit = true;
        this.tableDidMountListeners.forEach(function (v, k) { return k(); });
        this.update();
    };
    Table.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.resize);
    };
    Table.prototype.render = function () {
        if (this.state.hasError)
            return React.createElement("div", { style: { color: '#b51a28' } }, this.state.error);
        var _a = this.props, activeColor = _a.activeColor, defaultColor = _a.defaultColor, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.columns, columns = _c === void 0 ? [] : _c, _d = _a.data, data = _d === void 0 ? [] : _d, style = _a.style, loading = _a.loading, pageSizeOptions = _a.pageSizeOptions;
        this.depthOfColumns = util_1.depthOf(columns);
        var _e = __read(util_1.createColumnMeta(columns, this.depthOfColumns), 2), columnsWithMeta = _e[0], warnings = _e[1];
        this.printWarnings(warnings);
        this.sortedColumns = sortColumns(columnsWithMeta);
        this.data = this.filterAndSort(data);
        this.data = this.paging(this.data);
        this.flattenSortedColumns = util_1.flatten(this.sortedColumns);
        return (React.createElement("div", { className: "designare-table " + className, ref: this.root, style: __assign({ position: 'relative' }, style) },
            React.createElement("div", { ref: this.filterLayersRef }, util_1.groupByDepth(this.sortedColumns).map(function (levelColumns) {
                return levelColumns.map(function (column) { return (React.createElement("div", { className: "designare-table-filter-layer-container " + column.metaKey, key: column.metaKey })); });
            })),
            React.createElement(context_1.Context.Provider, { value: __assign({ originalColumns: columns, columns: this.sortedColumns, originalData: data, data: this.data, flattenSortedColumns: this.flattenSortedColumns }, this.contextAPI) }, this.props.children),
            this.isInit && this.isPaging && data.length > 0 &&
                React.createElement(Pagination_1.default, { isFirstPage: this.pageNo === 1, isLastPage: this.pageNo === Math.ceil(this.total / this.pageSize), pageNo: this.pageNo, onGoToPage: this.onGoToPage, pageSize: this.pageSize, setPageSize: this.setPageSize, total: this.total, pageSizeOptions: pageSizeOptions }),
            loading && React.createElement(Loading_1.default, { loading: loading, style: { color: activeColor } })));
    };
    Table.defaultProps = {
        children: React.createElement(react_1.Fragment, null,
            React.createElement(Thead_1.default, null),
            React.createElement(Tbody_1.default, null)),
        defaultSorter: {},
        onChangeColumns: function () { },
        onChangeRows: function () { },
        onChangeSorter: function () { },
        onChangeFilters: function () { },
        onChangePaging: function () { },
        activeColor: '#1890ff',
        defaultColor: '#bfbfbf',
        resizable: false,
        rowHeight: 38
    };
    return Table;
}(React.Component));
exports.default = Table;
function sortColumns(columns) {
    var leftColumns = columns.filter(function (c) { return c.fixed === 'left'; });
    var normalColumns = columns.filter(function (c) { return !c.fixed; });
    var rightColumns = columns.filter(function (c) { return c.fixed === 'right'; }).reverse();
    leftColumns.length > 0 ? leftColumns[leftColumns.length - 1].isLastFixedColumn = true : undefined;
    rightColumns[0] ? rightColumns[0].isFirstFixedColumn = true : undefined;
    var r = [].concat(leftColumns).concat(normalColumns).concat(rightColumns);
    createLeafColumnIndex(r);
    return r;
}
function createLeafColumnIndex(columns) {
    util_1.forEachLeafColumn(columns, function (col, i, isLast) {
        col.isFirst = i === 0;
        col.isLast = isLast;
        col.isLeaf = true;
        col.leafIndex = i;
    });
}
function syncWidthAndHeight(table, columns, rowHeight, dimensionInfo, resizedWidthInfo, depthOfColumns, force) {
    if (rowHeight === void 0) { rowHeight = -1; }
    var findDOM = find.bind(null, table), dimensionId = code(columns);
    var columnSize = getColumnSize(columns);
    var _a = __read(findDOM('header'), 3), headerWrapper = _a[0], headerRoot = _a[1], header = _a[2];
    var _b = __read(findDOM('header', 'left'), 3), leftHeaderWrapper = _b[0], leftHeaderRoot = _b[1], leftHeader = _b[2];
    var _c = __read(findDOM('header', 'right'), 3), rightHeaderWrapper = _c[0], rightHeaderRoot = _c[1], rightHeader = _c[2];
    var _d = __read(findDOM('body'), 3), bodyWrapper = _d[0], bodyRoot = _d[1], body = _d[2];
    var _e = __read(findDOM('body', 'left'), 3), leftBodyWrapper = _e[0], leftBodyRoot = _e[1], leftBody = _e[2];
    var _f = __read(findDOM('body', 'right'), 3), rightBodyWrapper = _f[0], rightBodyRoot = _f[1], rightBody = _f[2];
    if (dimensionInfo.dimensionId !== dimensionId || force) {
        setStyle(headerRoot, 'minWidth', '0');
        setStyle(leftHeaderRoot, 'minWidth', '0');
        setStyle(rightHeaderRoot, 'minWidth', '0');
        setStyle(bodyRoot, 'minWidth', '0');
        setStyle(leftBodyRoot, 'minWidth', '0');
        setStyle(rightBodyRoot, 'minWidth', '0');
        removeColgroup(headerRoot);
        removeColgroup(leftHeaderRoot);
        removeColgroup(rightHeaderRoot);
        removeColgroup(bodyRoot);
        removeColgroup(leftBodyRoot);
        removeColgroup(rightBodyRoot);
    }
    var rootWidth = table.getBoundingClientRect().width;
    var headerWidthArray = util_1.widthArray(header, columnSize, 'end', 'headerWidthArray');
    var leftHeaderWidthArray = util_1.widthArray(leftHeader, columnSize, 'end', 'leftHeaderWidthArray');
    var rightHeaderWidthArray = util_1.widthArray(rightHeader, columnSize, 'start', 'rightHeaderWidthArray');
    var bodyWidthArray;
    var leftBodyWidthArray;
    var rightBodyWidthArray;
    try {
        bodyWidthArray = util_1.widthArray(body, columnSize, 'end', 'bodyWidthArray');
        leftBodyWidthArray = util_1.widthArray(leftBody, columnSize, 'end', 'leftBodyWidthArray');
        rightBodyWidthArray = util_1.widthArray(rightBody, columnSize, 'start', 'rightBodyWidthArray');
    }
    catch (error) {
        if (error.name === 'pad') {
            var len = error.value.length;
            throw "sum of column.colSpan: " + columnSize + " does not match length of td: " + len;
        }
    }
    var columnWidthArray = columns.reduce(function (prev, curr) {
        var _a = curr.width, width = _a === void 0 ? -1 : _a, _b = curr.colSpan, colSpan = _b === void 0 ? 1 : _b, r;
        colSpan = colSpan / 1;
        width = width === '*' ? -1 : width / colSpan;
        r = new Array(colSpan);
        r.fill(width, 0, r.length);
        return prev.concat(r);
    }, []);
    var resizedWidthArray = columns.reduce(function (prev, curr) {
        var metaKey = curr.metaKey, _a = curr.colSpan, colSpan = _a === void 0 ? 1 : _a, r;
        var width = resizedWidthInfo.get(metaKey) || -1;
        colSpan = colSpan / 1;
        r = new Array(colSpan);
        r.fill(width / colSpan, 0, r.length);
        return prev.concat(r);
    }, []);
    var originalMaxWidthArray = util_1.max(headerWidthArray, leftHeaderWidthArray, rightHeaderWidthArray, bodyWidthArray, leftBodyWidthArray, rightBodyWidthArray, columnWidthArray);
    var maxWidthArray = util_1.max(originalMaxWidthArray, resizedWidthArray);
    var sum = maxWidthArray.reduce(function (prev, curr) { return prev + curr; }, 0);
    var leftOver = Math.floor(rootWidth - sum);
    if (leftOver > 0) {
        var balance = leftOver;
        for (var i = 0, len = columns.length; i < len; i++) {
            if (columns[i].width === '*') {
                maxWidthArray[i] += balance;
                originalMaxWidthArray[i] += balance;
                balance = 0;
                break;
            }
        }
        if (balance > 0) {
            for (var i = 0, len = columns.length; i < len; i++) {
                var userSpecifiedWidth = columns[i].width;
                if (userSpecifiedWidth && !isNaN(userSpecifiedWidth)) {
                    continue;
                }
                var avg = balance / (len - i);
                avg = avg - avg % 1;
                maxWidthArray[i] += avg;
                originalMaxWidthArray[i] += avg;
                balance -= avg;
            }
        }
        sum += leftOver;
    }
    var mergeMax = function (w, i) { return w > -1 ? maxWidthArray[i] : w; };
    var positive = function (w) { return w > -1; };
    var headerColgroup = createColgroup(maxWidthArray);
    var leftHeaderColgroup = createColgroup(leftHeaderWidthArray.map(mergeMax).filter(positive));
    var rightHeaderColgroup = createColgroup(rightHeaderWidthArray.map(mergeMax).filter(positive));
    var bodyColgroup = createColgroup(maxWidthArray);
    var leftBodyColgroup = createColgroup(leftBodyWidthArray.map(mergeMax).filter(positive));
    var rightBodyColgroup = createColgroup(rightBodyWidthArray.map(mergeMax).filter(positive));
    var tableWidth = sum + 'px';
    setStyle(leftHeaderRoot, 'minWidth', "" + tableWidth);
    setStyle(rightHeaderRoot, 'minWidth', "" + tableWidth);
    setStyle(leftBodyRoot, 'minWidth', "" + tableWidth);
    setStyle(rightBodyRoot, 'minWidth', "" + tableWidth);
    if (leftOver < 0) {
        setStyle(headerRoot, 'minWidth', "" + tableWidth);
        setStyle(bodyRoot, 'minWidth', "" + tableWidth);
    }
    removeColgroup(headerRoot);
    removeColgroup(leftHeaderRoot);
    removeColgroup(rightHeaderRoot);
    removeColgroup(bodyRoot);
    removeColgroup(leftBodyRoot);
    removeColgroup(rightBodyRoot);
    appendChild(headerRoot, headerColgroup);
    appendChild(leftHeaderRoot, leftHeaderColgroup);
    appendChild(rightHeaderRoot, rightHeaderColgroup);
    appendChild(bodyRoot, bodyColgroup);
    appendChild(leftBodyRoot, leftBodyColgroup);
    appendChild(rightBodyRoot, rightBodyColgroup);
    var headerHeightArray = heightArray(header);
    var leftHeaderHeightArray = heightArray(leftHeader);
    var rightHeaderHeightArray = heightArray(rightHeader);
    var maxHeaderHeightArray = util_1.max(headerHeightArray, leftHeaderHeightArray, rightHeaderHeightArray);
    var bodyHeightArray = heightArray(body);
    var leftBodyHeightArray = heightArray(leftBody);
    var rightBodyHeightArray = heightArray(rightBody);
    var maxBodyHeightArray = util_1.max(bodyHeightArray, leftBodyHeightArray.length === 0 ? bodyHeightArray : leftBodyHeightArray, rightBodyHeightArray.length === 0 ? bodyHeightArray : rightBodyHeightArray);
    var headers = getChildren(header);
    var leftHeaders = getChildren(leftHeader);
    var rightHeaders = getChildren(rightHeader);
    var rows = getChildren(body);
    var leftRows = getChildren(leftBody);
    var rightRows = getChildren(rightBody);
    for (var i = 0, len = maxHeaderHeightArray.length; i < len; i++) {
        var height = Math.max(maxHeaderHeightArray[i], Math.ceil(rowHeight / depthOfColumns));
        headers[i].style['height'] = height + "px";
        leftHeaders[i].style['height'] = height + "px";
        rightHeaders[i].style['height'] = height + "px";
    }
    for (var i = 0, len = maxBodyHeightArray.length; i < len; i++) {
        var height = Math.max(maxBodyHeightArray[i], rowHeight);
        rows[i].style['height'] = height + "px";
        leftRows[i] ? leftRows[i].style['height'] = height + "px" : undefined;
        rightRows[i] ? rightRows[i].style['height'] = height + "px" : undefined;
    }
    syncScrollBarStatus(table);
    window.requestAnimationFrame(function () {
        dimensionInfo.originalMaxWidthArray = originalMaxWidthArray;
        dimensionInfo.dimensionId = dimensionId;
        var info = getDimensionInfo(table, columnSize);
        Object.assign(dimensionInfo, info);
    });
}
function syncScrollBarStatus(table) {
    var findDOM = find.bind(null, table);
    var _a = __read(findDOM('header'), 3), headerWrapper = _a[0], headerRoot = _a[1], header = _a[2];
    var _b = __read(findDOM('body'), 3), bodyWrapper = _b[0], bodyRoot = _b[1], body = _b[2];
    var _c = __read(findDOM('body', 'left'), 3), leftBodyWrapper = _c[0], leftBodyRoot = _c[1], leftBody = _c[2];
    var _d = __read(findDOM('body', 'right'), 3), rightBodyWrapper = _d[0], rightBodyRoot = _d[1], rightBody = _d[2];
    if (bodyRoot && bodyRoot.offsetHeight - bodyRoot.parentElement.offsetHeight > 1) {
        syncHeaderBodyVerticalScrollStatus(headerRoot, true);
        hideVerticalScrollBarOfTableFixedHeader(table, true);
        hideVerticalScrollBarOfBody(leftBodyRoot, true);
    }
    else {
        syncHeaderBodyVerticalScrollStatus(headerRoot, false);
        hideVerticalScrollBarOfTableFixedHeader(table, false);
        hideVerticalScrollBarOfBody(leftBodyRoot, false);
    }
    if (bodyRoot && bodyRoot.offsetWidth - bodyRoot.parentElement.offsetWidth > 1) {
        hideHorizontalScrollBarOfBody(leftBodyRoot, true);
        hideHorizontalScrollBarOfBody(rightBodyRoot, true);
        syncBodyHorizontalScrollStatus(leftBodyRoot, true);
        syncBodyHorizontalScrollStatus(rightBodyRoot, true);
    }
    else {
        hideHorizontalScrollBarOfBody(leftBodyRoot, false);
        hideHorizontalScrollBarOfBody(rightBodyRoot, false);
        syncBodyHorizontalScrollStatus(leftBodyRoot, false);
        syncBodyHorizontalScrollStatus(rightBodyRoot, false);
    }
    if (isBodyEmpty(rightBody)) {
        hideVerticalScrollBarOfBody(rightBodyRoot, true);
        hideHorizontalScrollBarOfBody(rightBodyRoot, true);
        rightBodyWrapper.style.visibility = 'hidden';
    }
    else {
        hideVerticalScrollBarOfBody(rightBodyRoot, false);
        rightBodyWrapper.style.visibility = 'initial';
    }
}
function getDimensionInfo(table, columnSize) {
    var findDOM = find.bind(null, table);
    var _a = __read(findDOM('header'), 3), headerWrapper = _a[0], headerRoot = _a[1], header = _a[2];
    var _b = __read(findDOM('header', 'left'), 3), leftHeaderWrapper = _b[0], leftHeaderRoot = _b[1], leftHeader = _b[2];
    var _c = __read(findDOM('header', 'right'), 3), rightHeaderWrapper = _c[0], rightHeaderRoot = _c[1], rightHeader = _c[2];
    var _d = __read(findDOM('body'), 3), bodyWrapper = _d[0], bodyRoot = _d[1], body = _d[2];
    var _e = __read(findDOM('body', 'left'), 3), leftBodyWrapper = _e[0], leftBodyRoot = _e[1], leftBody = _e[2];
    var _f = __read(findDOM('body', 'right'), 3), rightBodyWrapper = _f[0], rightBodyRoot = _f[1], rightBody = _f[2];
    var headerWidthArray = util_1.widthArray(header, columnSize, 'end', 'headerWidthArray');
    var leftHeaderWidthArray = util_1.widthArray(leftHeader, columnSize, 'end', 'leftHeaderWidthArray');
    var rightHeaderWidthArray = util_1.widthArray(rightHeader, columnSize, 'start', 'rightHeaderWidthArray');
    var bodyWidthArray = util_1.widthArray(body, columnSize, 'end', 'bodyWidthArray');
    var leftBodyWidthArray = util_1.widthArray(leftBody, columnSize, 'end', 'leftBodyWidthArray');
    var rightBodyWidthArray = util_1.widthArray(rightBody, columnSize, 'start', 'rightBodyWidthArray');
    var maxWidthArray = util_1.max(headerWidthArray, leftHeaderWidthArray, rightHeaderWidthArray, bodyWidthArray, leftBodyWidthArray, rightBodyWidthArray);
    var headerHeightArray = heightArray(header);
    var leftHeaderHeightArray = heightArray(leftHeader);
    var rightHeaderHeightArray = heightArray(rightHeader);
    var bodyHeightArray = heightArray(body);
    var leftBodyHeightArray = heightArray(leftBody);
    var rightBodyHeightArray = heightArray(rightBody);
    return {
        headerWidthArray: headerWidthArray,
        leftHeaderWidthArray: leftHeaderWidthArray,
        rightHeaderWidthArray: rightHeaderWidthArray,
        bodyWidthArray: bodyWidthArray,
        leftBodyWidthArray: leftBodyWidthArray,
        rightBodyWidthArray: rightBodyWidthArray,
        headerHeightArray: headerHeightArray,
        leftHeaderHeightArray: leftHeaderHeightArray,
        rightHeaderHeightArray: rightHeaderHeightArray,
        bodyHeightArray: bodyHeightArray,
        leftBodyHeightArray: leftBodyHeightArray,
        rightBodyHeightArray: rightBodyHeightArray,
        maxWidthArray: maxWidthArray
    };
}
function isDimensionChanged(table, columnSize, dimensionInfo) {
    var result = false;
    var info = getDimensionInfo(table, columnSize);
    var keys = Object.keys(info);
    for (var i = 0, len = keys.length; i < len; i++) {
        var k = keys[i];
        if (isArrayChange(dimensionInfo[k], info[k])) {
            result = true;
            break;
        }
    }
    return result;
}
function heightArray(element) {
    var r = [], array = (element && element.children) || [];
    for (var i = 0, len = array.length; i < len; i++) {
        var height = array[i].offsetHeight;
        r.push(height);
    }
    return r;
}
function removeColgroup(element) {
    var colgroup = element && element.getElementsByTagName('colgroup')[0];
    if (colgroup) {
        element.removeChild(colgroup);
    }
}
function createColgroup(widthArray) {
    var sum = widthArray.reduce(function (prev, curr) { return prev + curr; }, 0);
    var colgroup = document.createElement('colgroup');
    for (var i = 0, len = widthArray.length; i < len; i++) {
        var width = widthArray[i] + 'px';
        var col = document.createElement('col');
        col.style.width = width;
        colgroup.appendChild(col);
    }
    return colgroup;
}
function find(table, a, b) {
    var className = "designare-table-" + a + (b ? '-' + b : '');
    var wrapper = table.getElementsByClassName(className)[0];
    var container = wrapper && wrapper.getElementsByTagName('table')[0];
    var content = container && container.getElementsByTagName(a === 'header' ? 'thead' : 'tbody')[0];
    return [wrapper, container, content];
}
function getChildren(element) {
    return element ? element.children : [];
}
function setStyle(element, key, value) {
    element ? element.style[key] = value : undefined;
}
function appendChild(element, child) {
    element ? element.appendChild(child) : undefined;
}
function hideHorizontalScrollBarOfBody(bodyRoot, scroll) {
    if (scroll === void 0) { scroll = false; }
    if (scroll) {
        bodyRoot ? bodyRoot.parentElement.style.height = 'calc(100% + 15px)' : undefined;
        bodyRoot ? bodyRoot.parentElement.parentElement.style.height = 'calc(100% - 15px)' : undefined;
    }
    else {
        bodyRoot ? bodyRoot.parentElement.style.height = '100%' : undefined;
        bodyRoot ? bodyRoot.parentElement.parentElement.style.height = '100%' : undefined;
    }
}
function hideVerticalScrollBarOfBody(bodyRoot, scroll) {
    if (scroll === void 0) { scroll = false; }
    if (scroll) {
        bodyRoot ? bodyRoot.parentElement.parentElement.style.marginRight = '15px' : undefined;
        bodyRoot ? bodyRoot.parentElement.style.marginRight = '-15px' : undefined;
    }
    else {
        bodyRoot ? bodyRoot.parentElement.parentElement.style.marginRight = '0' : undefined;
        bodyRoot ? bodyRoot.parentElement.style.marginRight = '0' : undefined;
    }
}
function syncHeaderBodyVerticalScrollStatus(headerRoot, scroll) {
    if (scroll === void 0) { scroll = false; }
    if (scroll) {
        headerRoot ? headerRoot.parentElement.parentElement.style.overflowY = 'scroll' : undefined;
    }
    else {
        headerRoot ? headerRoot.parentElement.parentElement.style.overflowY = 'hidden' : undefined;
    }
}
function syncBodyHorizontalScrollStatus(bodyRoot, scroll) {
    if (scroll === void 0) { scroll = false; }
    if (scroll) {
        bodyRoot ? bodyRoot.parentElement.style.overflowX = 'scroll' : undefined;
    }
    else {
        bodyRoot ? bodyRoot.parentElement.style.overflowX = 'hidden' : undefined;
    }
}
function hideVerticalScrollBarOfTableFixedHeader(table, scroll) {
    if (scroll === void 0) { scroll = false; }
    var el = table.getElementsByClassName('designare-table-fixed-header')[0];
    if (scroll) {
        el.classList.add('designare-mask');
    }
    else {
        el.classList.remove('designare-mask');
    }
}
function isArrayChange(a, b) {
    var len = a.length, length = b.length;
    if (len !== length)
        return true;
    for (var i = 0; i < len; i++) {
        if (a[i] !== b[i])
            return true;
    }
    return false;
}
function code(columnsWithMeta, result, root) {
    if (result === void 0) { result = []; }
    if (root === void 0) { root = true; }
    for (var i = 0, len = columnsWithMeta.length; i < len; i++) {
        var col = columnsWithMeta[i];
        var metaKey = col.metaKey, _a = col.width, width = _a === void 0 ? '' : _a;
        result.push(metaKey + width);
        col.children ? code(col.children, result, false) : undefined;
    }
    return root ? result.join('') : undefined;
}
function getColumnSize(columns) {
    return columns.reduce(function (prev, curr) { return prev + curr.colSpan; }, 0);
}
function isBodyEmpty(body) {
    return body && body.children.length === 0;
}
