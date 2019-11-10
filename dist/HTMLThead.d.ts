import * as React from 'react';
interface IHTMLTheadProps extends React.HTMLAttributes<HTMLElement> {
    tr?: (args: {
        cells: JSX.Element;
    }) => JSX.Element;
    fixed?: string;
}
export default class HTMLThead extends React.Component<IHTMLTheadProps, {}> {
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
