import * as React from 'react';
interface IDragTrProps extends React.HTMLAttributes<HTMLElement> {
    row: any;
    getRowId: (row: any) => any;
}
export default class DragTr extends React.Component<IDragTrProps, {}> {
    static contextType: React.Context<{}>;
    private ref;
    private originalBorderTopColor;
    private originalBorderTopStyle;
    private originalBorderTopWidth;
    private originalBorderBottomColor;
    private originalBorderBottomStyle;
    private originalBorderBottomWidth;
    private onDragEnd;
    constructor(props: any);
    get global(): any;
    get data(): any;
    get activeColor(): any;
    getRowIndex: (row: any) => any;
    highlightTop: () => void;
    deHighlightTop: () => void;
    highlightBottom: () => void;
    deHighlightBottom: () => void;
    onDragStart: (evt: any) => void;
    onDragOver: (evt: any) => void;
    onDragLeave: (evt: any) => void;
    onDrop: (evt: any) => void;
    render(): JSX.Element;
}
export {};
