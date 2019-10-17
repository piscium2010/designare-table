import React from 'react'
import Table, { Header, Body, Tds, Ths, Th, Td, FixHeader, FixBody } from '../index'
import { data } from '../data/one'

const a = [
    {
        Header: 'Name',
        key: 'name',
        fix: 'right'
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
        Header: '3 MO.',
        key: 'three_month',
    },
    {
        Header: '3 MO.',
        key: 'three_month',
    },
    {
        Header: '3 MO.',
        key: 'three_month',
    },
    {
        Header: '3 MO.',
        key: 'three_month',
    },
    {
        Header: 'YTD',
        key: 'ytd',
        fix: 'left'
    }
]

const b = [
    {
        Header: 'Name',
        key: 'name',
        width: 300
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
        Header: 'Month',
        children: [
            { Header: '3 MO', key: 'three_month' },
            { Header: 'Lorem ipsum dolor sit amet.', key: 'six_month' }
        ],
        fix: 'left'
    },
    {
        Header: 'YTD',
        key: 'ytd',
    },
    {
        Header: 'Tag',
        key: 'percent',
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
        }, 1000);
        // setTimeout(() => {
        //     this.setState({ columns: a })
        // }, 6000);
        // setTimeout(() => {
        //     this.setState({ columns: b })
        // }, 9000);
    }

    render() {
        const { columns } = this.state
        return (
            <React.Fragment>
                <div style={{ width: 600, margin: '50px auto' }}>
                    <Table
                        columns={columns}
                        data={data}
                        style={{ display: 'flex', flexDirection: 'column', margin: 'auto', position: 'relative' }}
                    >
                        <Header />
                        <Body />
                    </Table>
                </div>
                <div style={{ width: 600, margin: '50px auto' }}>
                    <Table
                        columns={columns}
                        data={data}
                        style={{ display: 'flex', flexDirection: 'column', margin: 'auto', position: 'relative', height: 200 }}
                    >
                        <Header />
                        <Body />
                    </Table>
                </div>
                <div style={{ width: 600, margin: 'auto' }}>
                    <Table
                        rowHeight={50}
                        columns={columns}
                        data={data}
                        style={{ display: 'flex', flexDirection: 'column', margin: 'auto', position: 'relative', height: 200 }}
                    >
                        <Header />
                        <Body />
                    </Table>
                </div>
            </React.Fragment>
        )
    }
}
