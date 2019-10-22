import { createColumnMeta, widthArray } from '../src/util'

test('width', () => {
    const maxDepth = 1
    const columns = [
        {
            Header: 'COMPANY',
            dataKey: 'name',
            width: 128,
            children: []
        }
    ]
    const [cols, warnings] = createColumnMeta(columns, maxDepth)
    expect(warnings[0]).toBe(`width can only be assigned to column without children. Warning from COMPANY`);
})

test('width *', () => {
    const maxDepth = 1
    const columns = [
        {
            Header: 'COMPANY',
            dataKey: 'name',
            width: '*'
        },
        {
            Header: 'CHG %',
            dataKey: 'chgp',
            width: '*'
        }]
    const [cols, warnings] = createColumnMeta(columns, maxDepth)
    expect(warnings[0]).toBe(`width '*' can only be assigned to one column. Warning from CHG %`);
})

test('width *: non-fixed', () => {
    const maxDepth = 1
    const columns = [
        {
            Header: 'COMPANY',
            dataKey: 'name',
            width: '*',
            fixed: 'left'

        }
    ]
    const [cols, warnings] = createColumnMeta(columns, maxDepth)
    expect(warnings[0]).toBe(`width '*' can only be assigned to non-fixed column. Warning from COMPANY`);
})

test('widthArray: 0', () => {
    const fakeDom = (value) => {
        return {
            getAttribute: attr => value[attr],
            offsetWidth: value['offsetWidth']
        }
    }

    const element = {
        firstElementChild: {
            children: [
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 })
            ]
        }
    }

    const result = widthArray(element, 5)
    expect(result).toEqual([30, 30, 30, 30, 30])
})

test('widthArray: 1', () => {
    const fakeDom = (value) => {
        return {
            getAttribute: attr => value[attr],
            offsetWidth: value['offsetWidth']
        }
    }

    const element = {
        firstElementChild: {
            children: [
                fakeDom({ colspan: 1, rowspan: 2, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 2, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 2, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 2, offsetWidth: 30 }),
                fakeDom({ colspan: 2, rowspan: 1, offsetWidth: 30 })
            ],
            nextSibling: {
                children: [
                    fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 40 }),
                    fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 60 })
                ]
            }
        }
    }

    const result = widthArray(element, 6)
    expect(result).toEqual([30, 30, 30, 30, 40, 60])
})

test('widthArray: 2', () => {
    const fakeDom = (value) => {
        return {
            getAttribute: attr => value[attr],
            offsetWidth: value['offsetWidth']
        }
    }

    const element = {
        firstElementChild: {
            children: [
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 2, rowspan: 1, offsetWidth: 30 })
            ]
        }
    }

    const result = widthArray(element, 6)
    expect(result).toEqual([30, 30, 30, 30, 15, 15])
})

test('widthArray: 3', () => {
    const fakeDom = (value) => {
        return {
            getAttribute: attr => value[attr],
            offsetWidth: value['offsetWidth']
        }
    }

    const element = {
        firstElementChild: {
            children: [
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 2, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 1, rowspan: 1, offsetWidth: 30 }),
                fakeDom({ colspan: 2, rowspan: 1, offsetWidth: 30 })
            ]
        }
    }

    const result = widthArray(element, 7)
    expect(result).toEqual([30, 30, 15, 15, 30, 15, 15])
})
