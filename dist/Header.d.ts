export default class Header extends React.Component<any, any, any> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        className: string;
        onScroll: () => void;
    };
    constructor(props: any);
    set headerWidth(arg: any);
    get headerWidth(): any;
    _headerWidth: any;
    set tableWidth(arg: any);
    get tableWidth(): any;
    _tableWidth: any;
    tableRef: React.RefObject<any>;
    leftRef: React.RefObject<any>;
    rightRef: React.RefObject<any>;
    shadowLeft: boolean;
    shadowRight: boolean;
    debouncedReset: any;
    onScroll: (evt: any) => void;
    shadow: (scrollLeft: any) => void;
    reset: () => void;
    componentDidUpdate(): void;
    render(): JSX.Element;
    headerRef: any;
}
import * as React from "react";
