import * as React from 'react';
interface ISorterProps extends React.HTMLAttributes<HTMLDivElement> {
    activeColor?: string;
    defaultColor?: string;
    by?: string | ((...args: any[]) => number);
    directions?: Array<string>;
    render: (args: {
        direction: string;
        directions: string[];
        defaultColor: string;
        activeColor: string;
    }) => JSX.Element;
}
export default class Sorter extends React.Component<ISorterProps, {}> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        by: string;
        directions: string[];
        onClickCapture: () => void;
        render: ({ direction, directions, defaultColor, activeColor }: {
            direction: any;
            directions: any;
            defaultColor: any;
            activeColor: any;
        }) => JSX.Element;
    };
    get activeColor(): any;
    get defaultColor(): any;
    get dataKey(): any;
    get columnMetaKey(): any;
    setActiveSorter: (sorter: any) => void;
    tableDidMount: () => void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    update(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
