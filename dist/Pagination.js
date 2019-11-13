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
var react_1 = require("react");
var Icons_1 = require("./Icons");
function Pagination(props) {
    var _a = __read(react_1.useState(false), 2), isEditing = _a[0], setEditing = _a[1];
    var pageNo = props.pageNo, pageSize = props.pageSize, setPageSize = props.setPageSize, total = props.total, onGoToPage = props.onGoToPage, isFirstPage = props.isFirstPage, isLastPage = props.isLastPage, _b = props.pageSizeOptions, pageSizeOptions = _b === void 0 ? [] : _b;
    var onFirst = function () { return isFirstPage ? undefined : onGoToPage(1); };
    var onPrev = function () { return isFirstPage ? undefined : onGoToPage(pageNo - 1); };
    var onNext = function () { return isLastPage ? undefined : onGoToPage(pageNo + 1); };
    var onLast = function () { return isLastPage ? undefined : onGoToPage(Math.ceil(total / pageSize)); };
    return (React.createElement("div", { className: "designare-table-pagination", style: { display: 'flex', userSelect: 'none', flex: '1 1 auto', alignItems: 'flex-end' } },
        React.createElement("div", { style: { display: 'flex', height: 35, padding: '6px 0', width: '100%' } },
            React.createElement("div", { style: { flex: '1 1 40%', display: 'flex', justifyContent: 'space-between' } },
                React.createElement("div", { className: "designare-table-pagination-desc designare-table-pagination-total" }, total),
                pageSizeOptions.length > 0
                    ? React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { className: "designare-table-pagination-desc" },
                            React.createElement("span", { style: { marginTop: 4 } },
                                React.createElement(Icons_1.default.List, null))),
                        pageSizeOptions.map(function (size, i) { return (React.createElement("div", { key: i, className: "designare-table-pagination-number option " + (size === pageSize ? 'active' : ''), onClick: function (evt) { return setPageSize(size); } }, size)); }))
                    : null),
            React.createElement("div", { style: { display: 'flex', lineHeight: '24px', marginLeft: 'auto' } },
                React.createElement("div", { className: "designare-table-pagination-btn " + (isFirstPage ? 'disabled' : ''), onClick: onFirst },
                    React.createElement(Icons_1.default.First, null)),
                React.createElement("div", { className: "designare-table-pagination-btn " + (isFirstPage ? 'disabled' : ''), onClick: onPrev },
                    React.createElement(Icons_1.default.Prev, null)),
                React.createElement("div", { className: "designare-table-pagination-btn", onClick: function (evt) { return setEditing(true); } },
                    React.createElement(GoTo, { pageNo: pageNo, onGoToPage: onGoToPage, isEditing: isEditing, setEditing: setEditing })),
                React.createElement("div", { className: "designare-table-pagination-btn " + (isLastPage ? 'disabled' : ''), onClick: onNext },
                    React.createElement(Icons_1.default.Next, null)),
                React.createElement("div", { className: "designare-table-pagination-btn " + (isLastPage ? 'disabled' : ''), onClick: onLast },
                    React.createElement(Icons_1.default.Last, null))))));
}
exports.default = Pagination;
function GoTo(props) {
    var ref = react_1.useRef(null);
    var pageNo = props.pageNo, isEditing = props.isEditing, setEditing = props.setEditing, onGoToPage = props.onGoToPage;
    var _a = __read(react_1.useState(pageNo), 2), text = _a[0], setText = _a[1];
    var _b = __read(react_1.useState(pageNo), 2), value = _b[0], setValue = _b[1];
    var str = value + '';
    var onBlur = function (evt) { return setEditing(false); };
    var onChange = function (evt) { return setValue(evt.target.value); };
    var onEnter = function (evt) {
        if (evt.keyCode === 13 && !isNaN(value / 1)) {
            setText(value);
            setEditing(false);
            onGoToPage(value / 1);
        }
    };
    react_1.useEffect(function () {
        isEditing ? ref.current.focus() : undefined;
        isEditing ? setValue(pageNo) : undefined;
    }, [isEditing, pageNo]);
    react_1.useEffect(function () {
        isEditing ? undefined : setText(pageNo);
    }, [pageNo]);
    return (isEditing
        ? React.createElement("input", { ref: ref, value: value, size: Math.max(3, str.length), onBlur: onBlur, onKeyDown: onEnter, onChange: onChange, style: { fontSize: 'inherit' } })
        : React.createElement("div", { style: { userSelect: 'none' }, onClick: function (evt) { return setEditing(true); } }, text));
}
