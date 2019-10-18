import { createColumnMeta } from '../util'

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