import React from 'react'
import Table, { Header, Body, Th, Td } from '../index'
import { data } from '../data/one'

const a = [
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
    }
]

const b = [
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
    },
    {
        Header: 'Tag',
        key: 'percent'
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
        this.update()
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
                <div style={{ margin: 'auto' }}>
                    <Table
                        columns={columns}
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
