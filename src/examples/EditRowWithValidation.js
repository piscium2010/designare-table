import React, { useState, useEffect } from 'react'
import Table, { Header, Body, Th, Td } from '../index'
import { data as originData } from '../data/one'
import VForm, { v } from '@piscium2010/v-form'


export default function (props) {
    const [data, setData] = useState(originData)
    const [isEditing, setEditing] = useState(false)
    const [checkAll, setCheckAll] = useState(false)
    const [selection, setSelection] = useState([])
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

    const EditableCell = ({ value, row, dataKey, v, message }) => {
        const [txt, setTxt] = useState('')
        const onChange = newValue => {
            const rowData = map.get(row.id)
            const result = v.test({ [dataKey]: newValue })
            setTxt(newValue)
            result.pass ? rowData[dataKey] = newValue : undefined
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
                {message && <span style={{ color: 'red' }}>{message}</span>}
            </Td>
        )
    }

    // Validation Field - showing error message according to validation rules
    const VField = VForm.fieldFactory(EditableCell)

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
                        Header: 'Name',
                        dataKey: 'name',
                        Cell: EditableCell
                    },
                    {
                        Header: 'PREV.CLOSE',
                        dataKey: 'prev_close',
                        Cell: props => <VField name='prev_close' {...props} />
                    },
                    {
                        Header: '+/-',
                        dataKey: 'percent',
                        Cell: EditableCell
                    },
                    {
                        Header: 'Time',
                        dataKey: 'time',
                        Cell: EditableCell
                    },
                    {
                        Header: 'Month',
                        children: [
                            {
                                Header: '3 MO3 MO3 MO',
                                dataKey: 'three_month',
                                Cell: EditableCell
                            },
                            {
                                Header: '6 MO',
                                dataKey: 'six_month',
                                Cell: EditableCell
                            }
                        ]
                    },
                    {
                        Header: 'YTD',
                        dataKey: 'ytd',
                        Cell: EditableCell
                    }
                ]}
                data={data}
            >
                <Header />
                <Body tr={({ rowIndex }) => {
                    const validationForRow = v.create({
                        ['prev_close']: v.expect('required')
                    })
                    return (
                        <VForm validation={validationForRow}>
                            <tr><Body.Row v={validationForRow} rowIndex={rowIndex} /></tr>
                        </VForm>
                    )
                }}
                />
            </Table>
        </div>
    )
}

