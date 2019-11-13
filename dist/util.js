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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(columns, result) {
    if (result === void 0) { result = []; }
    columns.forEach(function (col) { return col.children ? flatten(col.children, result) : result.push(col); });
    return result;
}
exports.flatten = flatten;
function createColumnMeta(columns, maxDepth, parentKey, parentFix, depth, warnings, store) {
    if (parentKey === void 0) { parentKey = ''; }
    if (parentFix === void 0) { parentFix = undefined; }
    if (depth === void 0) { depth = 1; }
    if (warnings === void 0) { warnings = []; }
    if (store === void 0) { store = {}; }
    var columnsWithMeta = [];
    columns.forEach(function (column, i) {
        var key = "" + (parentKey ? parentKey + '-' : '') + getColumnKey(column);
        if (column.Cell && typeof column.Cell !== 'function')
            throw new Error('designare-table: Cell must be react function component');
        if (column.Cell && column.Cell.prototype && column.Cell.prototype.render)
            throw new Error('designare-table: Cell must be () => JSX.Element');
        if (column.width && column.width !== '*' && isNaN(column.width))
            throw new Error('designare-table: width must be either "*" or number');
        if (column.colSpan && isNaN(column.colSpan))
            throw new Error('designare-table: column.colSpan must be number');
        if (column.Cell && column.children)
            throw new Error('designare-table: column can not have both Cell and children');
        if (column.colSpan && column.children)
            throw new Error('designare-table: column can not have both colSpan and children');
        if (column.rowSpan) {
            warnings.push("do not suppport rowSpan for now. Warning from " + column.Header);
        }
        if (column.width && column.width === '*') {
            if (column.fixed) {
                warnings.push("width '*' can only be assigned to non-fixed column. Warning from " + column.Header);
            }
            if (store.wildcard === true) {
                warnings.push("width '*' can only be assigned to one column. Warning from " + column.Header);
            }
            store.wildcard = true;
        }
        if (column.children) {
            if (column.width !== undefined) {
                warnings.push("width can only be assigned to column without children. Warning from " + column.Header);
            }
        }
        var clone = __assign(__assign({}, column), { metaKey: key + '#' + i, depth: depth, fixed: parentFix || column.fixed, colSpan: column.children ? childrenLength(column.children) : column.colSpan ? column.colSpan / 1 : 1, rowSpan: column.children ? 1 : 1 + maxDepth - depth, columnIndex: i });
        if (clone.children) {
            var _a = __read(createColumnMeta(column.children, maxDepth, key, column.fixed, depth + 1, warnings, store), 1), children = _a[0];
            clone.children = children;
        }
        columnsWithMeta.push(clone);
    });
    return [columnsWithMeta, warnings];
}
exports.createColumnMeta = createColumnMeta;
function forEachLeafColumn(columns, visitor, n, isLast) {
    if (n === void 0) { n = { count: 0 }; }
    if (isLast === void 0) { isLast = true; }
    for (var i = 0, len = columns.length; i < len; i++) {
        var column = columns[i];
        column.children
            ? forEachLeafColumn(column.children, visitor, n, i === len - 1)
            : visitor(column, n.count++, isLast && i === len - 1);
    }
}
exports.forEachLeafColumn = forEachLeafColumn;
function getColumnSize(columnsWithMeta) {
    return columnsWithMeta.reduce(function (prev, curr) { return prev += curr.colSpan; }, 0);
}
exports.getColumnSize = getColumnSize;
function getColumnKey(column, keys) {
    if (keys === void 0) { keys = []; }
    var dataKey = column.dataKey, children = column.children;
    if (children) {
        children.forEach(function (col) { getColumnKey(col, keys); });
    }
    else if (dataKey) {
        keys.push(dataKey);
    }
    return keys.join(':');
}
exports.getColumnKey = getColumnKey;
function childrenLength(children, sum) {
    if (sum === void 0) { sum = 0; }
    children.forEach(function (sub) {
        if (sub.children) {
            childrenLength(sub.children, sum);
            return;
        }
        sum += 1;
    });
    return sum;
}
exports.childrenLength = childrenLength;
function depthOf(columns, depth) {
    if (depth === void 0) { depth = 1; }
    return columns
        ? depth + columns.reduce(function (prev, col) { return Math.max(prev, depthOf(col.children, depth)); }, 0)
        : 0;
}
exports.depthOf = depthOf;
function groupByDepth(columns) {
    var result = [];
    var walkOne = function (column, depth) {
        if (depth === void 0) { depth = 1; }
        var index = depth - 1;
        result[index] = result[index] || [];
        result[index].push(column);
        if (column.children) {
            column.children.forEach(function (sub) { return walkOne(sub, depth + 1); });
        }
    };
    columns.forEach(function (col) { return walkOne(col); });
    return result;
}
exports.groupByDepth = groupByDepth;
function widthArray(element, requiredLen, startOrend, msg, debug) {
    if (startOrend === void 0) { startOrend = 'end'; }
    var child = element && element.firstElementChild;
    var rowIndex = 0, placeholder = -1, matrix = [], result = [], n = 0;
    var rowOf = function (index) { return matrix[index] || (matrix[index] = []); };
    var getColIndex = function (array, i) {
        if (i === void 0) { i = 0; }
        while (array[i] !== undefined) {
            i++;
        }
        return i;
    };
    var next = true;
    var _loop_1 = function () {
        var temp = [];
        var array = child ? child.children : [];
        var row = rowOf(rowIndex);
        for (var i = 0, len = array.length; i < len; i++) {
            var cell = array[i];
            var colSpan = cell.getAttribute('colspan') || 1;
            var rowSpan = cell.getAttribute('rowspan') || 1;
            colSpan = colSpan / 1;
            rowSpan = rowSpan / 1;
            var colIndex = getColIndex(row);
            if (colSpan > 1) {
                var width = cell.offsetWidth / colSpan;
                n = 0;
                while (n < colSpan) {
                    row[colIndex + n++] = placeholder;
                    temp.push(width);
                }
                continue;
            }
            if (rowSpan >= 1) {
                var width = cell.offsetWidth;
                n = 0;
                while (n < rowSpan) {
                    rowOf(rowIndex + n++)[colIndex] = width;
                }
                continue;
            }
        }
        matrix = padMatrix(matrix);
        result = matrix.length > 0 ? max.apply(null, matrix) : [];
        var hasPlaceHolder = result.filter(function (i) { return i === placeholder; }).length > 0;
        var hasNaN = result.filter(isNaN).length > 0;
        if (result.length > 0 && (hasPlaceHolder || hasNaN)) {
            if (child.nextSibling) {
                child = child.nextSibling;
                rowIndex++;
            }
            else {
                temp.forEach(function (width) {
                    var colIndex = row.indexOf(placeholder);
                    row[colIndex] = width;
                });
                result = matrix.length > 0 ? max.apply(null, matrix) : [];
                next = false;
            }
        }
        else {
            next = false;
        }
    };
    while (next) {
        _loop_1();
    }
    if (debug) {
        console.log(msg, result);
    }
    return pad(result, requiredLen, startOrend, -1);
}
exports.widthArray = widthArray;
function pad(array, expectedLen, startOrend, padWith) {
    if (array === void 0) { array = []; }
    if (startOrend === void 0) { startOrend = 'end'; }
    var length = array.length;
    if (length > expectedLen)
        throw new CustomError('pad', array, "fail to pad array:" + array + ", its length exceeds the expectedLen: " + expectedLen);
    if (length < expectedLen) {
        var pad_1 = new Array(expectedLen - length);
        pad_1.fill(padWith, 0, pad_1.length);
        return startOrend === 'start' ? pad_1.concat(array) : [].concat(array).concat(pad_1);
    }
    return array;
}
exports.pad = pad;
function padMatrix(matrix) {
    var maxLen = matrix.reduce(function (prev, curr) { return Math.max(prev, curr.length); }, 0);
    return matrix.map(function (a) { return pad(a, maxLen, 'end'); });
}
exports.padMatrix = padMatrix;
function max() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var r = [], len = args[0].length, lenMatch = args.every(function (a) { return a.length === len; }), maxReducer = function (prev, curr) { return Math.max(prev, curr); };
    if (!lenMatch)
        throw 'lenght not match';
    var _loop_2 = function (i) {
        var col = args.map(function (a) { return a[i]; });
        r.push(col.reduce(maxReducer));
    };
    for (var i = 0; i < len; i++) {
        _loop_2(i);
    }
    return r;
}
exports.max = max;
function shift(array, indexOfDragged, indexOfDropped) {
    indexOfDragged = indexOfDragged / 1;
    indexOfDropped = indexOfDropped / 1;
    if (isNaN(indexOfDragged))
        throw 'indexOfDragged should be number';
    if (isNaN(indexOfDropped))
        throw 'indexOfDropped should be number';
    var result = Array.from(array);
    if (indexOfDragged < indexOfDropped) {
        var temp = result[indexOfDragged];
        for (var i = indexOfDragged; i < indexOfDropped; i++) {
            result[i] = result[i + 1];
        }
        result[indexOfDropped] = temp;
    }
    else if (indexOfDragged > indexOfDropped) {
        var temp = result[indexOfDragged];
        for (var i = indexOfDragged; i > indexOfDropped; i--) {
            result[i] = result[i - 1];
        }
        result[indexOfDropped] = temp;
    }
    return result;
}
exports.shift = shift;
var CustomError = (function (_super) {
    __extends(CustomError, _super);
    function CustomError(name, value) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        var _this = _super.apply(this, __spread(params)) || this;
        _this.name = name;
        _this.value = value;
        return _this;
    }
    return CustomError;
}(Error));
