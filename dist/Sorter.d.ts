export default class Sorter extends React.Component<any, any, any> {
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
    constructor(props: Readonly<any>);
    constructor(props: any, context?: any);
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
import * as React from "react";
