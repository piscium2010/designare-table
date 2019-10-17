import React, { useState } from 'react'
import Table, { Header, Body, Th, Td, Filter, Tree } from '../index'
import { data as TreeData } from '../data/four'

export default function (props) {

    const [selectAll, setSelectAll] = useState(false)
    const [selectedKeys, setSelectedKeys] = useState([])
    const [numbers, setNumbers] = useState(['', ''])
    const onToggleAll = (evt) => {
        const checked = evt.target.checked
        setSelectAll(checked)
        if (!checked) {
            setSelectedKeys([])
        }
    }

    const onToggle = (evt, row) => {
        const treeId = row['treeId']
        console.log('treeId', treeId)
        const s = new Set(selectedKeys)
        if (evt.target.checked) {
            s.add(treeId)
        } else {
            s.delete(treeId)
        }
        setSelectedKeys([...s])
    }

    const tree = Tree({
        'treeId': ({ row, index, parentKey }) => {
            return parentKey === undefined ? index + '' : parentKey + '-' + index
        }
    })
    const getDepth = treeId => treeId.match(/-/g) ? treeId.match(/-/g).length : 0
    const data = tree.flatten(TreeData, selectedKeys)
    const allParentKeys = tree.getAllParentKeys(TreeData)
    console.log(`allParentKeys`, allParentKeys)
    return (
        <div style={{ margin: 'auto' }}>
            <Table
                selectAll={selectAll}
                style={{ width: '90%', margin: 'auto' }}
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
                        Cell: ({ value, row, index, selectAll }) => {
                            const checked = selectedKeys.find(k => k == row['treeId']) !== undefined || selectAll
                            return (
                                <Td>
                                    {
                                        row.children
                                            ? <input type='checkbox'
                                                onChange={evt => onToggle(evt, row)} checked={checked}
                                            />
                                            : <span>&nbsp;</span>
                                    }
                                </Td>
                            )
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
                        Cell: ({ value, row }) => {
                            const depth = getDepth(row['treeId'])
                            const Decorator = ({ level, depth, color }) => {
                                // console.log(`level`,level, depth, level >= depth)
                                return <span style={{ display: depth >= level ? 'inline-block' : 'none', width: 5, backgroundColor: color }}>&nbsp;</span>
                            }
                            return (
                                <Td>
                                    <Decorator level={0} depth={depth} color={'green'}/>
                                    <Decorator level={1} depth={depth} color={'yellow'}/>
                                    <Decorator level={2} depth={depth} color={'blue'}/>
                                    <span style={{marginLeft: 10}}>{value}</span>
                                </Td>
                            )
                        },
                        key: 'name',
                        width: 200,
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
                                    <Filter by={(cell, value, row) => value[0] <= cell && cell <= value[1]}>
                                        {
                                            f => {
                                                return <div style={{ padding: 15 }}>
                                                    <input placeholder='min' value={numbers[0]} onChange={evt => setNumbers([evt.target.value, numbers[1]])} />&nbsp;
                                                    <input placeholder='max' value={numbers[1]} onChange={evt => {
                                                        console.log(`change`)
                                                        setNumbers([numbers[0], evt.target.value])
                                                    }}
                                                    />
                                                    <button onClick={evt => f.trigger(numbers)} >OK</button>
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
                    },
                    {
                        Header: ({ index }) => {
                            const [numbers, setNumbers] = useState(['', ''])
                            return (
                                <Th>
                                    <span style={{ display: 'table-cell' }}>Tag</span>
                                    <Filter by={(cell, value, row) => value[0] <= cell && cell <= value[1]}>
                                        {
                                            f => {
                                                return <div style={{ padding: 15 }}>
                                                    <input placeholder='min' value={numbers[0]} onChange={evt => setNumbers([evt.target.value, numbers[1]])} />&nbsp;
                                                    <input placeholder='max' value={numbers[1]} onChange={evt => {
                                                        setNumbers([numbers[0], evt.target.value])
                                                    }}
                                                    />
                                                    <button onClick={evt => f.trigger(numbers)} >OK</button>
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
                        key: 'percent',
                        Cell: ({ value }) => <Td><span style={{ color: value > 1 ? 'red' : 'green' }}>{value}</span></Td>
                    }
                ]}
                data={data}
            >
                <Header
                />
                <Body
                />
            </Table>
        </div>
    )
}
