import * as React from 'react';
interface IDragThProps extends React.HTMLAttributes<HTMLElement> {
    deliverRef?: React.RefObject<HTMLElement>;
}
export default class DragTh extends React.Component<IDragThProps, {}> {
    static contextType: React.Context<{}>;
    private ref;
    private originalBorderRightColor;
    private originalBorderRightStyle;
    private originalBorderRightWidth;
    private originalBorderLeftColor;
    private originalBorderLeftStyle;
    private originalBorderLeftWidth;
    private onDragEnd;
    get global(): any;
    get originalColumns(): any;
    get column(): any;
    get activeColor(): any;
    highlightRight: () => void;
    deHighlightRight: () => void;
    highlightLeft: () => void;
    deHighlightLeft: () => void;
    onDragStart: (evt: any) => void;
    onDragOver: (evt: any) => void;
    onDragLeave: (evt: any) => void;
    onDrop: (evt: any) => void;
    render(): JSX.Element;
}
export {};
