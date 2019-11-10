import * as React from 'react';
interface IThProps extends React.HTMLAttributes<HTMLDivElement> {
    deliverRef?: React.RefObject<HTMLElement>;
}
export default class Th extends React.Component<IThProps, {}> {
    static contextType: React.Context<{}>;
    private column;
    private originalDraggable;
    private setResizedWidthInfo;
    private leftOrRight;
    private dragable;
    private resizing;
    private parent;
    private parentOriginalZIndex;
    private metaKey;
    private colgroups;
    private colIndex;
    private colWidth;
    private minWidthArray;
    private wrappers;
    private wrapperWidthArray;
    get global(): {
        resizing: boolean;
    };
    get resizable(): boolean;
    disableDraggable: () => void;
    restoreDraggable: () => void;
    disableDOMObserver: () => void;
    restoreDOMObserver: () => void;
    onMouseDown: (evt: any) => void;
    onMouseMove: (evt: any) => void;
    onMouseUp: (evt: any) => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
