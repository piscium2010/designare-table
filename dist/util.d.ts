export function flatten(columns: any, result?: any[]): any[];
export function createColumnMeta(columns: any, maxDepth: any, parentKey?: string, parentFix: any, depth?: number, warnings?: any[], store?: {}): any[][];
export function forEachLeafColumn(columns: any, visitor: any, n?: {
    count: number;
}, isLast?: boolean): void;
export function getColumnSize(columnsWithMeta: any): any;
export function getColumnKey(column: any, keys?: any[]): string;
export function childrenLength(children: any, sum?: number): number;
export function depthOf(columns: any, depth?: number): any;
export function groupByDepth(columns: any): any[];
export function widthArray(element: any, requiredLen: any, startOrend?: string, msg: any, debug: any): any[];
export function pad(array?: any[], expectedLen: any, startOrend?: string, padWith: any): any[];
export function padMatrix(matrix: any): any;
/**
 * input:
 * [1, 4]
 * [3, 2]
 * output:
 * [3, 4]
 *
 * @param  {...any} args
 */
export function max(...args: any[]): any[];
export function shift(array: any, indexOfDragged: any, indexOfDropped: any): any[];
