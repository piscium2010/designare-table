import React, { useState } from 'react'
import Table, { Header, Body, Th, Td, Filter } from '../index'
import { data } from '../data/two'

export default function Eight(props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [numbers, setNumbers] = useState([0, 5])
    // console.log(`numbers`,numbers)
    const onToggleAll = (evt) => {
        const checked = evt.target.checked
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

    return (
        <div style={{ margin: 'auto' }}>
            <Table
                style={{ width: '80%' }}
                columns={[
                    {
                        Header: ({ value, row }) => {
                            const checked = selectAll
                            return (
                                <Th>
                                    <input type='checkbox' onChange={onToggleAll} checked={checked} />
                                </Th>
                            )
                        },
                        Cell: ({ value, row, index }) => {
                            const checked = selectedKeys.includes(index) || selectAll
                            return <Td><input type='checkbox' onChange={evt => onToggle(evt, index)} checked={checked} /></Td>
                        }
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Name</span>
                                </Th>
                            )
                        },
                        dataKey: 'name',
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>PREV.CLOSE</span>
                                    <Filter by={(cell = '', value, row) => cell.indexOf(value) > -1}>
                                        {
                                            f => (<div style={{ padding: 15 }}>
                                                <input onChange={evt => f.trigger(evt.target.value)} />
                                            </div>)
                                        }
                                    </Filter>
                                </Th>
                            )
                        },
                        dataKey: 'prev_close',
                    },
                    {
                        Header: ({ index }) => {
                            const [min, setMin] = useState(numbers[0])
                            const [max, setMax] = useState(numbers[1])
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>+/-</span>
                                    <Filter name='+/-' by={(cell, value, row) => {
                                        let [min, max] = value
                                        min = min === '' || isNaN(min) ? Number.NEGATIVE_INFINITY : min
                                        max = max === '' || isNaN(max) ? Number.POSITIVE_INFINITY : max
                                        return min <= cell && cell <= max
                                    }}>
                                        {
                                            f => {
                                                return <div style={{ padding: 15 }}>
                                                    <input placeholder='min' value={min} onChange={evt => {
                                                        setMin(evt.target.value)
                                                    }}
                                                    />&nbsp;
                                                    <input placeholder='max' value={max} onChange={evt => {
                                                        setMax(evt.target.value)
                                                    }}
                                                    />
                                                    <button onClick={evt => {
                                                        setNumbers([min, max])
                                                    }} >OK</button>
                                                    <button onClick={evt => {
                                                        setNumbers(['', ''])
                                                    }}
                                                    >Reset</button>
                                                </div>
                                            }
                                        }
                                    </Filter>
                                </Th>
                            )
                        },
                        dataKey: 'percent'
                    },
                    {
                        Header: 'Time',
                        dataKey: 'time'
                    },
                    {
                        Header: 'Month',
                        children: [
                            {
                                Header: '3 MO',
                                dataKey: 'three_month'
                            },
                            {
                                Header: '6 MO',
                                dataKey: 'six_month'
                            }
                        ]
                    },
                    {
                        Header: 'YTD',
                        dataKey: 'ytd',
                    },
                    {
                        Header: ({ index }) => {
                            const [numbers, setNumbers] = useState(['', ''])
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Tag</span>
                                    <Filter name='tag' by={(cell, value, row) => cell <= value}>
                                        {
                                            f => {
                                                return <div style={{ padding: 15 }}>
                                                    <input
                                                        placeholder='max'
                                                        onChange={
                                                            evt => f.trigger(evt.target.value)
                                                        }
                                                    />
                                                </div>
                                            }
                                        }
                                    </Filter>
                                </Th>
                            )
                        },
                        dataKey: 'percent',
                        Cell: ({ value }) => <Td><span style={{ color: value > 1 ? 'red' : 'green' }}>{value}</span></Td>
                    }
                ]}
                data={data}
                filters={[
                    {
                        name: '+/-', dataKey: 'percent', value: numbers
                    },
                    // {
                    //     dataKey: 'percent', value: 3
                    // }
                ]}
            >
                <Header
                />
                <Body
                />
            </Table>
        </div>
    )
}
