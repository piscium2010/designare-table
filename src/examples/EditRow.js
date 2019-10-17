import React, { useState, useEffect } from 'react'
import Table, { Header, Body, Th, Td, Sorter, Tds } from '../index'
import { data as originData } from '../data/one'

export default function (props) {
    const [data, setData] = useState(originData)
    const [isEditing, setEditing] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [selection, setSelection] = useState([])
    const [sorter, setSorter] = useState({ key: 'name', direction: 'asc' })
    const [map] = useState(new Map())

    const onToggleAll = evt => {
        const { checked } = evt.target
        setCheckAll(checked) || checked ? undefined : setSelection([])
    }

    const onToggle = (evt, id) => {
        const { checked } = evt.target
        const s = new Set(selection)
        checked ? s.add(id) : s.delete(id)
        setSelection([...s])
    }

    const onEdit = evt => {
        map.clear()
        selection.forEach(id => {
            const one = data.find(i => i.id === id)
            map.set(id, { ...one })
        })
        setEditing(true)
    }

    const onSave = () => {
        map.forEach((newValue, id) => {
            const one = data.find(i => i.id === id)
            Object.assign(one, newValue)
        })
        setEditing(false)
        setData(Array.from(data))
    }

    const onCancel = () => { setEditing(false) }

    const EditableCell = ({ value, row, dataKey }) => {
        const [txt, setTxt] = useState('')
        const onChange = newValue => {
            map.get(row.id)[dataKey] = newValue
            setTxt(newValue)
        }
        useEffect(() => {
            isEditing ? setTxt(value) : undefined
        }, [isEditing])

        return (
            <Td>
                {
                    isEditing && selection.includes(row.id)
                        ? <input value={txt} onChange={evt => onChange(evt.target.value)} />
                        : <span>{value}</span>
                }
            </Td>
        )
    }

    return (
        <div>
            {isEditing && <button onClick={onSave}>Save</button>}
            {isEditing && <button onClick={onCancel}>Cancel</button>}
            {!isEditing && <button onClick={onEdit} disabled={selection.length === 0}>Edit</button>}

            <Table
                columns={[
                    {
                        Header: () => (
                            <Th>
                                <input type='checkbox' onChange={onToggleAll} checked={checkAll} />
                            </Th>
                        ),
                        Cell: ({ row }) => {
                            const checked = selection.includes(row.id) || checkAll
                            return (
                                <Td>
                                    <input type='checkbox' onChange={evt => onToggle(evt, row.id)} checked={checked} />
                                </Td>
                            )
                        }
                    },
                    {
                        Header: () => (
                            <Th>
                                <span style={{ display: 'table-cell' }}>Name</span>
                                <Sorter />
                            </Th>
                        ),
                        key: 'name',
                        Cell: EditableCell
                    },
                    {
                        Header: 'PREV.CLOSE',
                        key: 'prev_close',
                        Cell: EditableCell
                    },
                    {
                        Header: () => (
                            <Th>
                                <span style={{ display: 'table-cell' }}>+/-</span>
                                <Sorter directions={['des', 'asc']} by='server' />
                            </Th>
                        ),
                        key: 'percent',
                        Cell: EditableCell
                    },
                    {
                        Header: () => (
                            <Th>
                                <span style={{ display: 'table-cell' }}>Time</span>
                                <Sorter directions={['des']} />
                            </Th>
                        ),
                        key: 'time',
                        Cell: EditableCell
                    },
                    {
                        Header: 'Month',
                        children: [
                            {
                                Header: '3 MO3 MO3 MO',
                                key: 'three_month',
                                Cell: EditableCell
                            },
                            {
                                Header: '6 MO',
                                key: 'six_month',
                                Cell: EditableCell
                            }
                        ]
                    },
                    {
                        Header: 'YTD',
                        key: 'ytd',
                        Cell: EditableCell
                    }
                ]}
                data={data}
                sorter={sorter}
                onChangeSorter={({ key, direction, by }) => setSorter({ key, direction })}
            >
                <Header />
                <Body tr={() => <tr><Tds /></tr>} />
            </Table>
        </div>
    )
}

