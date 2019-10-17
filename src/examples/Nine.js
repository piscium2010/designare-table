import React, { useState } from 'react'
import Table, { Header, Body, Tds, Ths, Th, Td, Sorter, Filter } from '../index'
import { data } from '../data/two'

export default function Eight(props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [numbers, setNumbers] = useState([2, 5])
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
                        dataKey: '',
                        Cell: ({ value, row, rowIndex }) => {
                            const checked = selectedKeys.includes(rowIndex) || selectAll
                            return <Td><input type='checkbox' onChange={evt => onToggle(evt, rowIndex)} checked={checked} /></Td>
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
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>+/-</span>
                                    <Filter name='+/-' by={(cell, value, row) => value[0] <= cell && cell <= value[1]}>
                                        {
                                            f => {
                                                return <div style={{ padding: 15 }}>
                                                    <input placeholder='min' value={numbers[0]} onChange={evt => {
                                                        setNumbers([evt.target.value, numbers[1]])
                                                    }} />&nbsp;
                                                    <input placeholder='max' value={numbers[1]} onChange={evt => {
                                                        // console.log(`change`)
                                                        setNumbers([numbers[0], evt.target.value])
                                                    }}
                                                    />
                                                    
                                                    <button onClick={evt => {
                                                        f.trigger(numbers)
                                                        // console.log(`ok`,)
                                                    }} >OK</button>
                                                    <button onClick={evt => {
                                                        setNumbers(['', ''])
                                                        f.trigger()
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
                    }
                ]}
                data={data}
                defaultFilters={[
                    {
                        dataKey: 'percent', value: numbers
                    }
                ]}
                onChangeFilters={filters => {
                    console.log(`on change filters`,filters)
                }}
            >
                <Header
                />
                <Body
                />
            </Table>
        </div>
    )
}
