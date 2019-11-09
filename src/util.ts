export type column = {
    Header: string | JSX.Element | (() => JSX.Element),
    Cell?: (args?: {
        value: any;
        row: any;
        dataKey: string;
        rowIndex: number;
    }) => JSX.Element;
    children?: column[]
    colSpan?: number
    dataKey?: string
    width: '*' | number
    fixed: 'left' | 'right' | undefined
}

export type metaColumn = column & {
    metaKey: string
    isFirst?: boolean
    isLast?: boolean
    rowSpan: number
    isFirstFixedColumn?: boolean
    isLastFixedColumn?: boolean
    isLeaf?: boolean
    leafIndex?: number
}

export function flatten(columns, result = []) {
    columns.forEach(col => col.children ? flatten(col.children, result) : result.push(col))
    return result
}

export function createColumnMeta(
    columns,
    maxDepth,
    parentKey: string = '',
    parentFix: string = undefined,
    depth = 1/* start from 1 */,
    warnings: string[] = [],
    store: { wildcard?: boolean } = {}
) {

    const columnsWithMeta: metaColumn[] = []

    columns.forEach((column, i) => {
        const key = `${parentKey ? parentKey + '-' : ''}` + getColumnKey(column)

        // errors
        if (column.Cell && typeof column.Cell !== 'function') throw new Error('designare-table: Cell must be react function component')
        if (column.Cell && column.Cell.prototype && column.Cell.prototype.render) throw new Error('designare-table: Cell must be () => JSX.Element')
        if (column.width && column.width !== '*' && isNaN(column.width)) throw new Error('designare-table: width must be either "*" or number')
        if (column.colSpan && isNaN(column.colSpan)) throw new Error('designare-table: column.colSpan must be number')
        if (column.Cell && column.children) throw new Error('designare-table: column can not have both Cell and children')
        if (column.colSpan && column.children) throw new Error('designare-table: column can not have both colSpan and children')

        // warnings
        if (column.rowSpan) {
            warnings.push(`do not suppport rowSpan for now. Warning from ${column.Header}`)
        }
        if (column.width && column.width === '*') {
            if (column.fixed) {
                warnings.push(`width '*' can only be assigned to non-fixed column. Warning from ${column.Header}`)
            }
            if (store.wildcard === true) {
                warnings.push(`width '*' can only be assigned to one column. Warning from ${column.Header}`)
            }
            store.wildcard = true
        }
        if (column.children) {
            if (column.width !== undefined) {
                warnings.push(`width can only be assigned to column without children. Warning from ${column.Header}`)
            }
        }

        const clone = {
            ...column,
            metaKey: key + '#' + i,
            depth,
            fixed: parentFix || column.fixed,
            colSpan: column.children ? childrenLength(column.children) : column.colSpan ? column.colSpan / 1 : 1,
            rowSpan: column.children ? 1 : 1 + maxDepth - depth,
            columnIndex: i
        }
        if (clone.children) {
            const [children] = createColumnMeta(column.children, maxDepth, key, column.fixed, depth + 1, warnings, store)
            clone.children = children
        }
        columnsWithMeta.push(clone)
    })
    return [columnsWithMeta, warnings] as [metaColumn[], string[]]
}

export function forEachLeafColumn(columns, visitor, n = { count: 0 }, isLast = true) {
    for (let i = 0, len = columns.length; i < len; i++) {
        const column = columns[i]
        column.children
            ? forEachLeafColumn(column.children, visitor, n, i === len - 1)
            : visitor(column, n.count++, isLast && i === len - 1)
    }
}

export function getColumnSize(columnsWithMeta) {
    return columnsWithMeta.reduce((prev, curr) => prev += curr.colSpan, 0)
}

export function getColumnKey(column, keys = []) {
    const { dataKey, children } = column
    if (children) {
        children.forEach(col => { getColumnKey(col, keys) })
    } else if (dataKey) {
        keys.push(dataKey)
    }
    return keys.join(':')
}

// test cases
export function childrenLength(children, sum = 0) {
    children.forEach(sub => {
        if (sub.children) {
            childrenLength(sub.children, sum)
            return
        }
        sum += 1
    })
    return sum
}

// test cases
export function depthOf(columns, depth = 1) {
    return columns
        ? depth + columns.reduce((prev, col) => Math.max(prev, depthOf(col.children, depth)), 0)
        : 0
}

export function groupByDepth(columns) {
    const result = []
    const walkOne = (column, depth = 1/* start from 1 */) => {
        const index = depth - 1
        result[index] = result[index] || []
        result[index].push(column)
        if (column.children) {
            column.children.forEach(sub => walkOne(sub, depth + 1))
        }
    }
    columns.forEach(col => walkOne(col))
    return result
}

export function widthArray(element, requiredLen, startOrend = 'end', msg?, debug?) {
    let child = element && element.firstElementChild
    let rowIndex = 0, placeholder = -1, matrix = [], result = [], n = 0
    const rowOf = index => matrix[index] || (matrix[index] = [])
    const getColIndex = (array, i = 0) => {
        while (array[i] !== undefined) { i++ }
        return i
    }
    let next = true
    while (next) {
        const temp = []
        const array = child ? child.children : []
        const row = rowOf(rowIndex)
        for (let i = 0, len = array.length; i < len; i++) {
            const cell = array[i]
            let colSpan = cell.getAttribute('colspan') || 1
            let rowSpan = cell.getAttribute('rowspan') || 1
            colSpan = colSpan / 1
            rowSpan = rowSpan / 1
            const colIndex = getColIndex(row)

            if (colSpan > 1) {
                const width = cell.offsetWidth / colSpan
                n = 0
                while (n < colSpan) {
                    row[colIndex + n++] = placeholder
                    temp.push(width)
                }
                continue
            }

            if (rowSpan >= 1) {
                const width = cell.offsetWidth
                n = 0
                while (n < rowSpan) { rowOf(rowIndex + n++)[colIndex] = width }
                continue
            }
        }

        matrix = padMatrix(matrix)
        result = matrix.length > 0 ? max.apply(null, matrix) : []
        const hasPlaceHolder = result.filter(i => i === placeholder).length > 0
        const hasNaN = result.filter(isNaN).length > 0

        if (result.length > 0 && (hasPlaceHolder || hasNaN)) {
            if (child.nextSibling) {
                child = child.nextSibling
                rowIndex++
            } else {
                temp.forEach(width => {
                    const colIndex = row.indexOf(placeholder)
                    row[colIndex] = width
                })
                result = matrix.length > 0 ? max.apply(null, matrix) : []
                next = false
            }
        } else {
            next = false
        }
    }
    if (debug) { console.log(msg, result) }
    return pad(result, requiredLen, startOrend, -1 /* pad With */)
}

export function pad(array = [], expectedLen, startOrend = 'end', padWith?) {
    const length = array.length
    if (length > expectedLen) throw new CustomError('pad', array, `fail to pad array:${array}, its length exceeds the expectedLen: ${expectedLen}`)
    if (length < expectedLen) {
        const pad = new Array(expectedLen - length)
        pad.fill(padWith, 0, pad.length)
        return startOrend === 'start' ? pad.concat(array) : [].concat(array).concat(pad)
    }
    return array
}

export function padMatrix(matrix) {
    const maxLen = matrix.reduce((prev, curr) => Math.max(prev, curr.length), 0)
    return matrix.map(a => pad(a, maxLen, 'end'))
}

/**
 * input:
 * [1, 4]
 * [3, 2]
 * output:
 * [3, 4]
 * 
 * @param  {...any} args 
 */
export function max(...args) {
    const r = [],
        len = args[0].length,
        lenMatch = args.every(a => a.length === len),
        maxReducer = (prev, curr) => Math.max(prev, curr)
    if (!lenMatch) throw 'lenght not match'
    for (let i = 0; i < len; i++) {
        const col = args.map(a => a[i])
        r.push(col.reduce(maxReducer))
    }
    return r
}

export function shift(array, indexOfDragged, indexOfDropped) {
    indexOfDragged = indexOfDragged / 1
    indexOfDropped = indexOfDropped / 1
    if (isNaN(indexOfDragged)) throw 'indexOfDragged should be number'
    if (isNaN(indexOfDropped)) throw 'indexOfDropped should be number'
    const result = Array.from(array)
    if (indexOfDragged < indexOfDropped) {
        // shift left
        const temp = result[indexOfDragged]
        for (let i = indexOfDragged; i < indexOfDropped; i++) {
            result[i] = result[i + 1]
        }
        result[indexOfDropped] = temp
    } else if (indexOfDragged > indexOfDropped) {
        // shift right
        const temp = result[indexOfDragged]
        for (let i = indexOfDragged; i > indexOfDropped; i--) {
            result[i] = result[i - 1]
        }
        result[indexOfDropped] = temp
    }

    return result
}

class CustomError extends Error {
    value: any
    constructor(name, value, ...params) {
        super(...params)
        this.name = name
        this.value = value
    }
}
