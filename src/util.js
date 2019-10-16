export function flatten(columns, result = []) {
    columns.forEach(col => col.children ? flatten(col.children, result) : result.push(col))
    return result
}

export function createColumnMeta(columns, maxDepth, parentKey = '', parentFix, depth = 1/* start from 1 */) {
    const columnsWithMeta = []
    columns.forEach((column, i) => {
        const key = `${parentKey ? parentKey + '-' : ''}` + getColumnKey(column)
        const clone = {
            ...column,
            metaKey: key + '#' + i,
            depth,
            fix: parentFix || column.fix,
            colSpan: column.children ? childrenLength(column.children) : 1,
            rowSpan: column.children ? 1 : 1 + maxDepth - depth,
            columnIndex: i
        }
        if (clone.children) {
            clone.children = createColumnMeta(clone.children, maxDepth, key, column.fix, depth + 1)
        }
        columnsWithMeta.push(clone)
    })

    return columnsWithMeta
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

    push = v => {
        this.q.push(v)
    }

    first = () => {
        return this.q[this.i++]
    }
}