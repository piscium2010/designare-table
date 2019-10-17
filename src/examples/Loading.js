import React from 'react'
import Table, { Header, Body, Th, Td } from '../index'
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
            columns: a,
            loading: false
        }
    }

    componentDidMount() {
        this.update()
    }

    update = () => {
        setTimeout(() => {
            this.setState({ columns: b, loading: true })
        }, 3000);
        // setTimeout(() => {
        //     this.setState({ columns: a })
        // }, 6000);
        // setTimeout(() => {
        //     this.setState({ columns: b })
        // }, 9000);
    }

    render() {
        const { columns, loading } = this.state
        return (
            <div style={{ margin: 'auto' }}>
                <Table
                    columns={columns}
                    data={data}
                    loading={loading}
                />
            </div>
        )
    }
}
