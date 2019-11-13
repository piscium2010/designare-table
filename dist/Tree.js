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
Object.defineProperty(exports, "__esModule", { value: true });
function Tree(option) {
    if (Object.keys(option).length !== 1)
        throw "Invalid tree option";
    var field = Object.keys(option)[0];
    if (typeof option[field] !== 'function')
        throw "Invalid tree option";
    var getKey = option[field];
    return {
        getAllParentKeys: getAllParentKeys.bind(null, field, getKey, undefined, undefined),
        flatten: flatten.bind(null, field, getKey, undefined, undefined)
    };
}
exports.default = Tree;
function flatten(field, getKey, result, parentKey, data, keys, depth) {
    if (result === void 0) { result = []; }
    if (keys === void 0) { keys = []; }
    if (depth === void 0) { depth = 0; }
    if (!data)
        return data;
    var _loop_1 = function (i, len) {
        var _a;
        var row = data[i];
        var key = getKey({ row: row, index: i, parentKey: parentKey });
        result.push(__assign(__assign({}, row), (_a = {}, _a[field] = key, _a.depth = depth, _a)));
        var one = keys.find(function (k) { return k == key; });
        if (one !== undefined && row.children) {
            flatten(field, getKey, result, key, row.children, keys, depth + 1);
        }
    };
    for (var i = 0, len = data.length; i < len; i++) {
        _loop_1(i, len);
    }
    return result;
}
function getAllParentKeys(field, getKey, result, parentKey, data) {
    if (result === void 0) { result = []; }
    if (!data)
        return data;
    for (var i = 0, len = data.length; i < len; i++) {
        var row = data[i];
        if (row.children) {
            var key = getKey({ row: row, index: i, parentKey: parentKey });
            result.push(key);
            getAllParentKeys(field, getKey, result, key, row.children);
        }
    }
    return result;
}
