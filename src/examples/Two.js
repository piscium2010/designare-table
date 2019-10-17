import React from 'react'
import Table, { Header, Body, Th, Td } from '../index'
import { data } from '../data/one'


export default class Two extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div style={{ margin: 'auto' }}>
                    <Table
                        width={400}
                        columns={[
                            {
                                Header: 'Name',
                                key: 'name'
                            },
                            {
                                Header: () => <Th>PREV.CLOSE</Th>,
                                key: 'prev_close'
                            },
                            {
                                Header: '-/+',
                                key: 'percent'
                            },
                            {
                                Header: 'Time',
                                key: 'time',
                            },
                            {
                                Header: '3 MO.',
                                key: 'three_month',
                            },
                            {
                                Header: 'YTD',
                                key: 'ytd',
                                fix: 'left'
                            },
                            {
                                Header: 'Tag',
                                key: 'percent',
                                Cell: ({ value }) => <Td><span style={{ color: value.includes('-') ? 'red' : 'green' }}>{value}</span></Td>,
                                fix: 'left'
                            }
                        ]}
                        data={data}
                    >
                        <Header />
                        <Body />
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}
