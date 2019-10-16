import React from 'react'
import SwiftTable, { Head, Body, Th, Td } from '../index'
import { data } from '../data/one'


export default class Three extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div>

                </div>
                <div style={{ margin: 'auto' }}>
                    <SwiftTable
                        width={400}
                        columns={[
                            {
                                Header: 'Name',
                                key: 'name',
                                fix: 'left'
                            },
                            {
                                Header: () => <Th>PREV.CLOSE</Th>,
                                key: 'prev_close',
                                fix: 'right'
                            },
                            {
                                Header: '-/+',
                                key: 'percent'
                            },
                            {
                                Header: 'Time',
                                key: 'time'
                            },
                            {
                                Header: 'Month',
                                fix: 'left',
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
                                // fix: 'left'
                            },
                            {
                                Header: 'Tag',
                                key: 'percent',
                                Cell: ({ value }) => <Td><span style={{ color: value.includes('-') ? 'red' : 'green' }}>{value}</span></Td>,
                                // fix: 'left'
                            }
                        ]}
                        data={data}
                    >
                        <Head />
                        <Body />
                    </SwiftTable>
                </div>
            </React.Fragment>
        )
    }
}
