import React, { useState, useRef, useEffect } from 'react'
import SwiftTable, { Header, Body, Th, Td, Sorter } from '../index'
import { data as originData } from '../data/one'


export default function (props) {
    const [data, setData] = useState(originData)
    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [sorter, setSorter] = useState({ key: 'name', direction: 'asc' })

    const onToggleAll = (evt) => {
        // console.log(`onchange all`,evt.target)
        const checked = evt.target.checked
        // console.log(`change select all to `, checked)
        setSelectAll(checked)
        if (!checked) {
            setSelectedKeys([])
        }
    }

    const onToggle = (evt, index) => {
        const s = new Set(selectedKeys)
        if (evt.target.checked) {
            s.add(index)
        } else {
            s.delete(index)
        }
        setSelectedKeys([...s])
    }

    const StringEditor = ({ value, row, dataKey }) => {
        const ref = useRef(null)
        const [isEditing, setEditing] = useState(false)
        const [txt, setTxt] = useState('')
        const save = evt => { row[dataKey] = txt; setData(Array.from(data)) }
        const onEnter = evt => evt.keyCode === 13 ? save() : undefined

        useEffect(() => {
            isEditing ? ref.current.focus() : undefined
            isEditing ? setTxt(value) : undefined
        }, [isEditing, value])

        return (
            <Td onClick={evt => isEditing ? undefined : setEditing(true)}>
                {
                    isEditing
                        ? <input
                            ref={ref}
                            value={txt}
                            onKeyUp={onEnter}
                            onChange={evt => setTxt(evt.target.value)}
                            onBlur={evt => setEditing(false)}
                        />
                        : <span>{value}</span>
                }
            </Td>
        )
    }


    return (
        <div style={{ margin: 'auto' }}>
            <SwiftTable
                columns={[
                    {
                        Header: () => {
                            const checked = selectAll
                            return (
                                <Th>
                                    <input type='checkbox' onChange={onToggleAll} checked={checked} />
                                </Th>
                            )
                        },
                        key: '',
                        Cell: ({ value, row, index }) => {
                            const checked = selectedKeys.includes(index) || selectAll
                            // console.log('row: ', index, ' checked: ', checked, selectAll)
                            return <Td><input type='checkbox' onChange={evt => onToggle(evt, index)} checked={checked} /></Td>
                        }
                    },
                    {
                        Header: () => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Name</span>
                                    <Sorter />
                                </Th>
                            )
                        },
                        key: 'name',
                        Cell: StringEditor
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>PREV.CLOSE</span>
                                </Th>
                            )
                        },
                        key: 'prev_close',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>+/-</span>
                                    <Sorter directions={['des', 'asc']} by='server' />
                                </Th>
                            )
                        },
                        key: 'percent'
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Time</span>
                                    <Sorter directions={['des']} />
                                </Th>
                            )
                        },
                        key: 'time'
                    },
                    {
                        Header: 'Month',
                        children: [
                            {
                                Header: '3 MO3 MO3 MO',
                                key: 'three_month'
                            },
                            {
                                Header: '6 MO',
                                key: 'six_month'
                            }
                        ]
                    },
                    {
                        Header: 'YTD',
                        key: 'ytd',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Tag</span>
                                </Th>
                            )
                        },
                        key: 'percent',
                        Cell: ({ value }) => <Td><span style={{ color: value.includes('-') ? 'red' : 'green' }}>{value}</span></Td>
                    }
                ]}
                data={data}
                sorter={sorter}
                onChangeSorter={({ key, direction, by }) => {
                    setSorter({ key, direction })
                    console.log(`key`, key, 'direction', direction, 'by', by) // by server
                }}
            />
        </div>
    )
}

