import React, { useState } from 'react'
import SwiftTable, { Header, Body, Tds, Ths, Th, Td, Sorter, Filter } from '../index'
import { data } from '../data/two'

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
                <SwiftTable
                    selectedKeys={selectedKeys}
                    style={{ background: 'aliceblue' }}
                    columns={[
                        {
                            Header: '',
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
                            key: 'name',
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
                            ],
                            fix: 'left'
                        },
                        {
                            Header: 'YTD',
                            key: 'ytd',
                        }
                    ]}
                    data={data}
                >
                    <Header />
                    <Body
                        tr={({ index, fix, getColumns }) => {
                            const Description = () => {
                                if (!selectedKeys.includes(index)) return null
                                const columns = getColumns()
                                const leftSpan = columns.filter(c => c.fix === 'left').length
                                const rightSpan = columns.filter(c => c.fix === 'right').length
                                const span = columns.filter(c => !c.fix).length
                                let element
                                switch (fix) {
                                    case 'left':
                                        element = <td colSpan={leftSpan}>&nbsp;</td>
                                        break;
                                    case 'right':
                                        element = <td colSpan={rightSpan}>&nbsp;</td>
                                        break
                                    default:
                                        element = [
                                            <td key={0} colSpan={leftSpan}>&nbsp;</td>,
                                            <td key={1} colSpan={span}>Description</td>
                                        ]
                                }
                                return <tr>{element}</tr>
                            }
                            return (
                                <React.Fragment>
                                    <tr><Tds /></tr>
                                    <Description />
                                </React.Fragment>
                            )
                        }}
                    />
                </SwiftTable>
            </div>
        </div>
    )
}
