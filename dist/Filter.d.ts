export default class Filter extends React.Component<any, any, any> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        children: () => string;
        onClick: () => void;
        render: () => JSX.Element;
    };
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
    ref: React.RefObject<any>;
    state: {
        show: boolean;
        top: number;
        right: number;
    };
    get activeColor(): any;
    get defaultColor(): any;
    get dataKey(): any;
    get columnMetaKey(): any;
    get container(): any;
    _container: any;
    get defaultFilters(): any;
    get filters(): any;
    get activeFilters(): any;
    get isActive(): boolean;
    my(filters?: any[]): any;
    on: () => void;
    off: () => void;
    onToggleFilter: (evt: any) => void;
    onBlur: (evt: any) => void;
    setActiveFilter: (filterValue: any) => void;
    updateLayer: () => void;
    filterValue: any;
    tableDidMount: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
import * as React from "react";
