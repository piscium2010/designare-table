export default class HTMLThead extends React.Component<any, any, any> {
    static contextType: React.Context<{}>;
    static defaultProps: {
        tr: ({ cells }: {
            cells: any;
        }) => JSX.Element;
    };
    constructor(props: any);
    observer: {
        observe: (el: any) => void;
        disconnect: () => void;
    };
    ref: React.RefObject<any>;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
import * as React from "react";
