import * as React from 'react';
import { metaColumn } from './util';
interface IHTMLTbodyProps extends React.HTMLAttributes<HTMLElement> {
    tr?: (args: {
        row: any;
        rowIndex: number;
        fixed: string;
        getColumns: () => metaColumn[];
        cells: JSX.Element;
    }) => JSX.Element;
    fixed?: string;
}
export default class HTMLTbody extends React.Component<IHTMLTbodyProps, {}> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        tr: ({ cells }: {
            cells: any;
        }) => JSX.Element;
    };
    private observer;
    private ref;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
