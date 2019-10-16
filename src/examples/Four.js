import React, { useState } from 'react'
import SwiftTable, { Header, Body, Tds, Ths, Th, Td, Sorter } from '../index'
import { data } from '../data/one'


export default function Four(props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])

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
            <SwiftTable
                selectedKeys={selectedKeys}
                selectAll={selectAll}
                style={{ width: '80%' }}
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
                        Cell: ({ value, row, index, selectedKeys, selectAll }) => {
                            const checked = selectedKeys.includes(index) || selectAll
                            return <Td style={{textAlign: 'center'}} ><input type='checkbox' onChange={evt => onToggle(evt, index)} checked={checked} /></Td>
                        },
                        // width: 50
                    },
                    {
                        Header: ({ index }) => {
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Name</span>
                                    <Sorter />
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
                                    <Sorter name='PREV.CLOSE' directions={['asc']} by='number' />
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
                                    <Sorter directions={['des', 'asc']} />
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
                    },
                    {
                        Header: 'Tag',
                        key: 'percent',
                        Cell: ({ value }) => <Td><span style={{ color: value.includes('-') ? 'red' : 'green' }}>{value}</span></Td>
                    }
                ]}
                data={data}
                defaultSorter={{ key: 'prev_close', direction: 'asc' }}
            >
                <Header
                />
                <Body
                />
            </SwiftTable>
        </div>
    )
}
