import React, { useState } from 'react'
import SwiftTable, { Header, Body, Tds, Ths, Th, Td, Sorter, Filter } from '../index'
import { data } from '../data/two'

export default function Ten(props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [numbers, setNumbers] = useState([2, 5])
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
            <div style={{width: '80%', margin: 'auto'}}>
                <div>Header</div>
                <SwiftTable
                    selectedKeys={selectedKeys}
                    selectAll={selectAll}
                    style={{ background: 'aliceblue' }}
                    columns={[
                        {
                            Header: ({ value, row, selectAll }) => {
                                const checked = selectAll
                                return (
                                    <Th>
                                        <input type='checkbox' onChange={onToggleAll} checked={checked} />
                                    </Th>
                                )
                            },
                            key: '',
                            Cell: ({ value, row, index, selectedKeys, selectAll }) => {
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
                            key: 'name',
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
                            key: 'prev_close',
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
                            key: 'percent'
                        },
                        {
                            Header: 'Time',
                            key: 'time'
                        },
                        {
                            Header: 'Month',
                            children: [
                                {
                                    Header: '3 MO',
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
                        }
                    ]}
                    data={data}
                    defaultFilters={[
                        {
                            key: 'percent', value: numbers
                        }
                    ]}
                    onChangeFilters={filters => {
                        console.log(`on change filters`, filters)
                    }}
                >
                    <Header
                    />
                    <Body
                    />
                </SwiftTable>
                <div>Footer</div>
            </div>
        </div>
    )
}
