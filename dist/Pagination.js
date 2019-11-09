"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const Icons_1 = require("./Icons");
function Pagination(props) {
    const [isEditing, setEditing] = react_1.useState(false);
    const { pageNo, pageSize, setPageSize, total, onGoToPage, isFirstPage, isLastPage, pageSizeOptions = [] } = props;
    const onFirst = () => isFirstPage ? undefined : onGoToPage(1);
    const onPrev = () => isFirstPage ? undefined : onGoToPage(pageNo - 1);
    const onNext = () => isLastPage ? undefined : onGoToPage(pageNo + 1);
    const onLast = () => isLastPage ? undefined : onGoToPage(Math.ceil(total / pageSize));
    return (React.createElement("div", { className: `designare-table-pagination`, style: { display: 'flex', userSelect: 'none', flex: '1 1 auto', alignItems: 'flex-end' } },
        React.createElement("div", { style: { display: 'flex', height: 35, padding: '6px 0', width: '100%' } },
            React.createElement("div", { style: { flex: '1 1 40%', display: 'flex', justifyContent: 'space-between' } },
                React.createElement("div", { className: `designare-table-pagination-desc designare-table-pagination-total` }, total),
                pageSizeOptions.length > 0
                    ? React.createElement("div", { style: { display: 'flex' } },
                        React.createElement("div", { className: `designare-table-pagination-desc` },
                            React.createElement("span", { style: { marginTop: 4 } },
                                React.createElement(Icons_1.default.List, null))),
                        pageSizeOptions.map((size, i) => (React.createElement("div", { key: i, className: `designare-table-pagination-number option ${size === pageSize ? 'active' : ''}`, onClick: evt => setPageSize(size) }, size))))
                    : null),
            React.createElement("div", { style: { display: 'flex', lineHeight: '24px', marginLeft: 'auto' } },
                React.createElement("div", { className: `designare-table-pagination-btn ${isFirstPage ? 'disabled' : ''}`, onClick: onFirst },
                    React.createElement(Icons_1.default.First, null)),
                React.createElement("div", { className: `designare-table-pagination-btn ${isFirstPage ? 'disabled' : ''}`, onClick: onPrev },
                    React.createElement(Icons_1.default.Prev, null)),
                React.createElement("div", { className: `designare-table-pagination-btn`, onClick: evt => setEditing(true) },
                    React.createElement(GoTo, { pageNo: pageNo, onGoToPage: onGoToPage, isEditing: isEditing, setEditing: setEditing })),
                React.createElement("div", { className: `designare-table-pagination-btn ${isLastPage ? 'disabled' : ''}`, onClick: onNext },
                    React.createElement(Icons_1.default.Next, null)),
                React.createElement("div", { className: `designare-table-pagination-btn ${isLastPage ? 'disabled' : ''}`, onClick: onLast },
                    React.createElement(Icons_1.default.Last, null))))));
}
exports.default = Pagination;
function GoTo(props) {
    const ref = react_1.useRef(null);
    const { pageNo, isEditing, setEditing, onGoToPage } = props;
    const [text, setText] = react_1.useState(pageNo);
    const [value, setValue] = react_1.useState(pageNo);
    const str = value + '';
    const onBlur = evt => setEditing(false);
    const onChange = evt => setValue(evt.target.value);
    const onEnter = evt => {
        if (evt.keyCode === 13 && !isNaN(value / 1)) {
            setText(value);
            setEditing(false);
            onGoToPage(value / 1);
        }
    };
    react_1.useEffect(() => {
        isEditing ? ref.current.focus() : undefined;
        isEditing ? setValue(pageNo) : undefined;
    }, [isEditing, pageNo]);
    react_1.useEffect(() => {
        isEditing ? undefined : setText(pageNo);
    }, [pageNo]);
    return (isEditing
        ? React.createElement("input", { ref: ref, value: value, size: Math.max(3, str.length), onBlur: onBlur, onKeyDown: onEnter, onChange: onChange, style: { fontSize: 'inherit' } })
        : React.createElement("div", { style: { userSelect: 'none' }, onClick: evt => setEditing(true) }, text));
}
