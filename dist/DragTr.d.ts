export default class DragTr extends React.Component<any, any, any> {
    static contextType: React.Context<{}>;
    constructor(props: any);
    ref: React.RefObject<any>;
    get global(): any;
    get data(): any;
    get activeColor(): any;
    getRowIndex: (row: any) => number;
    highlightTop: () => void;
    originalBorderTopColor: any;
    originalBorderTopStyle: any;
    originalBorderTopWidth: any;
    deHighlightTop: () => void;
    highlightBottom: () => void;
    originalBorderBottomColor: any;
    originalBorderBottomStyle: any;
    originalBorderBottomWidth: any;
    deHighlightBottom: () => void;
    onDragStart: (evt: any) => void;
    onDragOver: (evt: any) => void;
    onDragLeave: (evt: any) => void;
    onDrop: (evt: any) => void;
    render(): JSX.Element;
}
import * as React from "react";
