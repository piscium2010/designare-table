import * as React from 'react';
interface IFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    activeColor?: string;
    defaultColor?: string;
    name?: string;
    by?: string | ((...args: any[]) => boolean);
    render: () => JSX.Element;
}
declare type state = {
    show: boolean;
    top: number;
    right: number;
};
export default class Filter extends React.Component<IFilterProps, state> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        children: () => string;
        onClick: () => void;
        render: () => JSX.Element;
    };
    state: {
        show: boolean;
        top: number;
        right: number;
    };
    private _container;
    private ref;
    private filterValue;
    get activeColor(): any;
    get defaultColor(): any;
    get dataKey(): any;
    get columnMetaKey(): any;
    get container(): any;
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
    tableDidMount: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
