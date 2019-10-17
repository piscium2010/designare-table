import React, { useState } from 'react'
import Table, { Header, Body, Tds, Ths, Th, Td, Sorter, Filter } from '../index'
import { getData } from '../data/three'

export default function (props) {

    const [selectedKeys, setSelectedKeys] = useState([])
    const onToggle = (evt, index) => {
        const s = new Set(selectedKeys)
        evt.target.checked ? s.add(index) : s.delete(index)
        setSelectedKeys([...s])
    }

    return (
        <div style={{ margin: 'auto' }}>
            <div style={{ width: '80%', margin: 'auto' }}>
                <Table
                    selectedKeys={selectedKeys}
                    style={{ background: 'aliceblue' }}
                    columns={[
                        {
                            Header: '',
                            fixed:'left',
                            key: '',
                            Cell: ({ value, row, index, selectedKeys }) => {
                                const checked = selectedKeys.includes(index)
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
                            key: 'name'
                        },
                        {
                            Header: ({ index }) => {
                                return (
                                    <Th>
                                        <span style={{ display: 'table-cell' }}>PREV.CLOSE</span>
                                    </Th>
                                )
                            },
                            fixed:'left',
                            key: 'prev_close',
                        },
                        {
                            Header: ({ index }) => {
                                return (
                                    <Th>
                                        <span style={{ display: 'table-cell' }}>+/-</span>
                                    </Th>
                                )
                            },
                            fixed:'left',
                            key: 'percent'
                        },
                        {
                            Header: 'Time',
                            fixed:'left',
                            key: 'time'
                        },
                        {
                            Header: 'Month',
                            fixed:'left',
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
                            Header: 'Lorem ipsum dolor sit amet.',
                            key: 'ytd'
                        }
                    ]}
                    data={getData(100)}
                >

                    <Header />
                    <Body />
                </Table>
            </div>
        </div>
    )
}
