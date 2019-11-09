import * as React from 'react';
import ReSizing from './ReSizing';
import { metaColumn } from './util';
interface IThProps extends React.HTMLAttributes<HTMLDivElement> {
    deliverRef?: React.RefObject<HTMLElement>;
}
export default class Th extends React.Component<IThProps, {}> {
    static contextType: React.Context<{}>;
    column: metaColumn;
    originalDraggable: string;
    setResizedWidthInfo: any;
    leftOrRight: string;
    dragable: HTMLElement;
    resizing: ReSizing;
    parent: HTMLElement;
    parentOriginalZIndex: number;
    metaKey: string;
    colgroups: HTMLElement[];
    colIndex: number;
    colWidth: number;
    minWidthArray: number[];
    wrappers: HTMLElement[];
    wrapperWidthArray: number[];
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
