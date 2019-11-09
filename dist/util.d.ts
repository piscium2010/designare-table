/// <reference types="react" />
export declare type column = {
    Header: string | JSX.Element | (() => JSX.Element);
    Cell?: (args?: {
        value: any;
        row: any;
        dataKey: string;
        rowIndex: number;
    }) => JSX.Element;
    children?: column[];
    colSpan?: number;
    dataKey?: string;
    width: '*' | number;
    fixed: 'left' | 'right' | undefined;
};
export declare type metaColumn = column & {
    metaKey: string;
    isFirst?: boolean;
    isLast?: boolean;
    rowSpan: number;
    isFirstFixedColumn?: boolean;
    isLastFixedColumn?: boolean;
    isLeaf?: boolean;
    leafIndex?: number;
};
export declare function flatten(columns: any, result?: any[]): any[];
export declare function createColumnMeta(columns: any, maxDepth: any, parentKey?: string, parentFix?: string, depth?: number, warnings?: string[], store?: {
    wildcard?: boolean;
}): [metaColumn[], string[]];
export declare function forEachLeafColumn(columns: any, visitor: any, n?: {
    count: number;
}, isLast?: boolean): void;
export declare function getColumnSize(columnsWithMeta: any): any;
export declare function getColumnKey(column: any, keys?: any[]): string;
export declare function childrenLength(children: any, sum?: number): number;
export declare function depthOf(columns: any, depth?: number): any;
export declare function groupByDepth(columns: any): any[];
export declare function widthArray(element: any, requiredLen: any, startOrend?: string, msg?: any, debug?: any): any[];
export declare function pad(array: any[], expectedLen: any, startOrend?: string, padWith?: any): any[];
export declare function padMatrix(matrix: any): any;
export declare function max(...args: any[]): any[];
export declare function shift(array: any, indexOfDragged: any, indexOfDropped: any): unknown[];
