import React, { useState, useEffect } from 'react'
import Table, { Th } from '../index'
import { data } from '../data/five'

const serverData = data(127)

const fakeFetch = (pageNo, pageSize, timeout = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const start = (pageNo - 1) * pageSize
            const end = Math.min(serverData.length, start + pageSize)
            const data = serverData.slice(start, end)
            resolve({ data, total: serverData.length })
        }, timeout);
    })
}

export default function (props) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState()
    const [paging, setPaging] = useState({ pageNo: 1, pageSize: 20 })
    const { pageNo, pageSize } = paging

    useEffect(() => {
        fakeFetch(pageNo, pageSize).then(res => {
            setData(res.data)
            setTotal(res.total)
            setLoading(false)
        })
    }, [])

    return (
        <div>
            {
                data.length > 0
                    ? <Table
                        columns={[
                            {
                                Header: () => <Th>ID</Th>,
                                dataKey: 'id',
                            },
                            {
                                Header: 'PREV.CLOSE',
                                dataKey: 'prev_close',
                            },
                            {
                                Header: '+/-',
                                dataKey: 'percent',
                                // fix:'left'
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
                                fix:'left' // bug
                            }
                        ]}
                        pageSize={pageSize}
                        pageNo={pageNo}
                        total={total}
                        loading={loading}
                        data={data}
                        pageSizeOptions={[10, 20, 50]}
                        onChangePaging={({ pageNo, pageSize }) => {
                            setLoading(true)
                            fakeFetch(pageNo, pageSize).then(res => {
                                setData(res.data)
                                setTotal(res.total)
                                setPaging({pageNo, pageSize})
                                setLoading(false)
                            })
                        }}
                    />
                    : null
            }
        </div>
    )
}
