import React from 'react'

const defaultStyle = { pointerEvents: 'none' }
const xmlns = 'http://www.w3.org/2000/svg'

const CaretUp = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 320 512" {...restProps} style={{ width: 9, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z"></path>
    </svg>
)

const CaretDown = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 320 512" {...restProps} style={{ width: 9, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
    </svg>
)

const SortUp = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 320 512" {...restProps} style={{ ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z" ></path>
    </svg>
)

const SortDown = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 320 512" {...restProps} style={{ ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path>
    </svg>
)

const Filter = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="filter" role="img" xmlns={xmlns} viewBox="0 0 512 512" {...restProps} style={{ width: 9, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
    </svg>
)

const First = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 24 24" {...restProps} style={{ width: 24, height: 24, ...defaultStyle, ...style }}>
        <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
        <path fill="none" d="M24 24H0V0h24v24z"></path>
    </svg>
)

const Last = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 24 24" {...restProps} style={{ width: 24, height: 24, ...defaultStyle, ...style }}>
        <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z">
        </path><path fill="none" d="M0 0h24v24H0V0z"></path>
    </svg>
)

const Prev = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 24 24" {...restProps} style={{ width: 24, height: 24, ...defaultStyle, ...style }}>
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
)

const Next = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 24 24" {...restProps} style={{ width: 24, height: 24, ...defaultStyle, ...style }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>
)

const Page = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 448 512" className="page" {...restProps} style={{ width: 24, height: 22, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M448 348.106V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80v351.988c0 26.51 21.49 48 48 48h268.118a48 48 0 0 0 33.941-14.059l83.882-83.882A48 48 0 0 0 448 348.106zm-120.569 95.196a15.89 15.89 0 0 1-7.431 4.195v-95.509h95.509a15.88 15.88 0 0 1-4.195 7.431l-83.883 83.883zM416 80v239.988H312c-13.255 0-24 10.745-24 24v104H48c-8.837 0-16-7.163-16-16V80c0-8.837 7.163-16 16-16h352c8.837 0 16 7.163 16 16z"></path>
    </svg>
)

const List = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 512 512" className="th-list" {...restProps} style={{ width: 24, height: 20, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48H48C21.49 32 0 53.49 0 80zm480 0v90.667H192V64h272c8.837 0 16 7.163 16 16zm0 229.333H192V202.667h288v106.666zM32 202.667h128v106.667H32V202.667zM160 64v106.667H32V80c0-8.837 7.163-16 16-16h112zM32 432v-90.667h128V448H48c-8.837 0-16-7.163-16-16zm160 16V341.333h288V432c0 8.837-7.163 16-16 16H192z"></path>
    </svg>
)

const Th = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 512 512" {...restProps} style={{ width: 24, height: 20, ...defaultStyle, ...style }}>
        <g>
            <path fill="currentColor" d="M488 352H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24zm0-320H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm0 160H205.33a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24H488a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24z" className="th-light"></path>
            <path fill="currentColor" d="M125.33 192H24a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24zm0-160H24A24 24 0 0 0 0 56v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24V56a24 24 0 0 0-24-24zm0 320H24a24 24 0 0 0-24 24v80a24 24 0 0 0 24 24h101.33a24 24 0 0 0 24-24v-80a24 24 0 0 0-24-24z"></path>
        </g>
    </svg>
)

const UList = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 512 512" {...restProps} style={{ width: 24, height: 20, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M32.39 224C14.73 224 0 238.33 0 256s14.73 32 32.39 32a32 32 0 0 0 0-64zm0-160C14.73 64 0 78.33 0 96s14.73 32 32.39 32a32 32 0 0 0 0-64zm0 320C14.73 384 0 398.33 0 416s14.73 32 32.39 32a32 32 0 0 0 0-64zM504 80H136a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h368a8 8 0 0 0 8-8V88a8 8 0 0 0-8-8zm0 160H136a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h368a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zm0 160H136a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h368a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8z"></path>
    </svg>
)

const Rows = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 448 512" {...restProps} style={{ width: 24, height: 20, ...defaultStyle, ...style }}>
        <path fill="currentColor" d="M439 48H7a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h432a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8zm0 384H7a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h432a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zm0-128H7a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h432a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8zm0-128H7a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h432a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8z"></path>
    </svg>
)

const MinusSquare = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 448 512" {...restProps} style={{ width: 14, ...defaultStyle, ...style }}><path fill="currentColor" d="M400 64c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352m0-32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-60 242c6.6 0 12-5.4 12-12v-12c0-6.6-5.4-12-12-12H108c-6.6 0-12 5.4-12 12v12c0 6.6 5.4 12 12 12h232z"></path></svg>
)

const PlusSquare = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 448 512" {...restProps} style={{ width: 14, ...defaultStyle, ...style }}><path fill="currentColor" d="M400 64c8.8 0 16 7.2 16 16v352c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V80c0-8.8 7.2-16 16-16h352m0-32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-60 206h-98v-98c0-6.6-5.4-12-12-12h-12c-6.6 0-12 5.4-12 12v98h-98c-6.6 0-12 5.4-12 12v12c0 6.6 5.4 12 12 12h98v98c0 6.6 5.4 12 12 12h12c6.6 0 12-5.4 12-12v-98h98c6.6 0 12-5.4 12-12v-12c0-6.6-5.4-12-12-12z"></path></svg>
)

const Loading = ({ style, ...restProps }) => (
    <svg aria-hidden="true" focusable="false" role="img" xmlns={xmlns} viewBox="0 0 512 512" {...restProps} style={{ width: 28, ...defaultStyle, ...style }}><path fill="currentColor" d="M288 32c0 17.673-14.327 32-32 32s-32-14.327-32-32 14.327-32 32-32 32 14.327 32 32zm-32 416c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm256-192c0-17.673-14.327-32-32-32s-32 14.327-32 32 14.327 32 32 32 32-14.327 32-32zm-448 0c0-17.673-14.327-32-32-32S0 238.327 0 256s14.327 32 32 32 32-14.327 32-32zm33.608 126.392c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm316.784 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zM97.608 65.608c-17.673 0-32 14.327-32 32 0 17.673 14.327 32 32 32s32-14.327 32-32c0-17.673-14.327-32-32-32z"></path></svg>
)

export default { CaretUp, CaretDown, SortUp, SortDown, Filter, First, Last, Prev, Next, Page, List, Th, UList, Rows, MinusSquare, PlusSquare, Loading }

