export default class DraggableTh extends React.Component<any, any, any> {
    static contextType: React.Context<{}>;
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    ref: React.RefObject<any>;
    get global(): any;
    get originalColumns(): any;
    get column(): any;
    get activeColor(): any;
    highlightRight: () => void;
    originalBorderRightColor: any;
    originalBorderRightStyle: any;
    originalBorderRightWidth: any;
    deHighlightRight: () => void;
    highlightLeft: () => void;
    originalBorderLeftColor: any;
    originalBorderLeftStyle: any;
    originalBorderLeftWidth: any;
    deHighlightLeft: () => void;
    onDragStart: (evt: any) => void;
    onDragOver: (evt: any) => void;
    onDragLeave: (evt: any) => void;
    onDrop: (evt: any) => void;
    render(): JSX.Element;
}
import * as React from "react";
