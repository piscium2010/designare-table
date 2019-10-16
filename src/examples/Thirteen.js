import React from 'react'
import SwiftTable, { Header, Body, Tds, Ths, Th, Td } from '../index'
import { data } from '../data/one'

const a = [
    {
        Header: 'Name',
        dataKey: 'name'
    },
    {
        Header: () => <Th>PREV.CLOSE</Th>,
        dataKey: 'prev_close'
    },
    {
        Header: '-/+',
        dataKey: 'percent'
    },
    {
        Header: 'Time',
        dataKey: 'time',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: 'YTD',
        dataKey: 'ytd',
    }
]

const b = [
    {
        Header: 'Name',
        dataKey: 'name'
    },
    {
        Header: () => <Th>PREV.CLOSE</Th>,
        dataKey: 'prev_close'
    },
    {
        Header: '-/+',
        dataKey: 'percent'
    },
    {
        Header: 'Time',
        dataKey: 'time',
    },
    {
        Header: '3 MO.',
        dataKey: 'three_month',
    },
    {
        Header: 'YTD',
        dataKey: 'ytd',
    },
    {
        Header: 'Tag',
        dataKey: 'percent'
    }
]

export default class One extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: a
        }
    }

    componentDidMount() {
        // this.update()
    }

    update = () => {
        setTimeout(() => {
            this.setState({ columns: b })
        }, 3000);
        setTimeout(() => {
            this.setState({ columns: a })
        }, 6000);
        setTimeout(() => {
            this.setState({ columns: b })
        }, 9000);
    }

    render() {
        const { columns } = this.state
        return (
            <React.Fragment>
                <div style={{ width: 600, margin: 'auto' }}>
                    <SwiftTable
                        columns={columns}
                        data={data}
                        style={{height: 200}}
                    />
                       
                </div>
                {/* <div style={{ width: 600, margin: 'auto', height: 500 }}>
                    <SwiftTable
                        columns={columns}
                        data={data}
                    />
                </div> */}
            </React.Fragment>
        )
    }
}
