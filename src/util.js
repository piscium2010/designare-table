export function flatten(columns, result = []) {
    columns.forEach(col => col.children ? flatten(col.children, result) : result.push(col))
    return result
}

export function createColumnMeta(
    columns,
    maxDepth,
    parentKey = '',
    parentFix,
    depth = 1/* start from 1 */,
    warnings = [],
    store = {}
) {
    const columnsWithMeta = []
    columns.forEach((column, i) => {
        const key = `${parentKey ? parentKey + '-' : ''}` + getColumnKey(column)
        const clone = {
            ...column,
            metaKey: key + '#' + i,
            depth,
            fixed: parentFix || column.fixed,
            colSpan: column.children ? childrenLength(column.children) : column.colSpan || 1,
            rowSpan: column.children ? 1 : 1 + maxDepth - depth,
            columnIndex: i
        }
        if (clone.Cell && typeof clone.Cell !== 'function') throw 'designare-table: Cell must be react function or class component'
        if (clone.width && clone.width === '*') {
            if (clone.fixed) {
                warnings.push(`width '*' can only be assigned to non-fixed column. Warning from ${clone.Header}`)
            }
            if (store.wildcard === true) {
                warnings.push(`width '*' can only be assigned to one column. Warning from ${clone.Header}`)
            }
            store.wildcard = true
        }
        if (clone.children) {
            if (clone.width !== undefined) {
                warnings.push(`width can only be assigned to column without children. Warning from ${clone.Header}`)
            }
            const [ children ] = createColumnMeta(column.children, maxDepth, key, column.fixed, depth + 1, warnings, store)
            clone.children = children 
        }
        columnsWithMeta.push(clone)
    })
    return [columnsWithMeta, warnings]
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

export class Queue {
    i = 0
    q = []
    clear = () => {
        this.i = 0
        this.q = []
    }

    push = v => this.q.push(v)
    first = () => this.q[this.i++]

    get length() {
        return this.q.length - this.i
    }
}

export function widthArray(element, requiredLen, startOrend = 'end', debug) {
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
            if(child.nextSibling){
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
    // console.log(`requiredLen of `, debug, ' ', requiredLen)
    return pad(result, requiredLen, startOrend, -1 /* pad With */)
}

export function pad(array = [], requiredLen, startOrend = 'end', padWith) {
    const length = array.length
    if (length > requiredLen) throw `fail to pad array:${array}, its length exceeds the requiredLen: ${requiredLen}`
    if (length < requiredLen) {
        const pad = new Array(requiredLen - length)
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
