import React from 'react'

const c = ['Lorem ipsum dolor sit amet.', '', 'Lorem ipsum dolor sit amet.']
const c2 = ['', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, reiciendis.', 'Lorem ipsum dolor sit amet.']

export default function (props) {
    const C = props => <div id='pt' style={{ display: 'inline-block', overflowX: 'hidden', overflowY: 'auto', height: props.height, margin: 'auto', background: 'yellowgreen', ...props.style }} >{props.children}</div>
    const D = props => <div id='flex' style={{ display: 'inline-block', overflowX: 'hidden', overflowY: 'auto', height: 300, margin: 'auto', background: 'lightgrey' }} >{props.children}</div>

    const tableWidth = 600
    const tableHeight = 300
    const fixLeftWidth = 200
    const fixRightWidth = 200

    return (
        <div style={{ marginBottom: 200 }}>
            {/* <C>
                <table>
                    <Header>
                        <tr>{headers(10)}</tr>
                    </Header>
                    <Body>
                        <tr>{columns(10)}</tr>
                    </Body>
                </table>
            </C>
            <C>
                <table>
                    <Header>
                        <tr>{headers(5)}</tr>
                    </Header>
                    <Body>
                        <tr>{columns(5)}</tr>
                        <tr>{columns(5, c2)}</tr>
                    </Body>
                </table>
            </C>
            <D>
                <table>
                    <Header>
                        <tr>{headers(10)}</tr>
                    </Header>
                    <Body>
                        <tr>{columns(10)}</tr>
                    </Body>
                </table>
            </D>
            <D>
                <table>
                    <Header>
                        <tr>{headers(5)}</tr>
                    </Header>
                    <Body>
                        <tr>{columns(5)}</tr>
                        <tr>{columns(5, c2)}</tr>
                    </Body>
                </table>
            </D>

            <h1>normal</h1>
            <div id='pt' style={{ position: 'relative', width: 600, margin: '50px auto', overflowX: 'auto', overflowY: 'hidden' }}>
                <table>
                    <Header style={{}}>
                        <tr>{headers(10)}</tr>
                    </Header>
                </table>
                <C>
                    <table>
                        <Body>
                            {rows(1, c => columns(10))}
                            {rows(10, c => columns(10, c2))}
                        </Body>
                    </table>
                </C>
            </div>

            <h1>Fix header</h1>
            <div id='pt' style={{ position: 'relative', width: 600, margin: '50px auto', overflowX: 'auto', overflowY: 'hidden' }}>
                <table>
                    <Header style={{}}>
                        <tr>{headers(10)}</tr>
                    </Header>
                </table>
                <C height={300}>
                    <table>
                        <Body>
                            {rows(1, c => columns(10))}
                            {rows(10, c => columns(10, c2))}
                        </Body>
                    </table>
                </C>
            </div> */}

            <h1>Fix table height & dynamic body height</h1>
            <div id='pt' style={{ display: 'flex', flexDirection: 'column', width: tableWidth, margin: 'auto', position: 'relative', height: tableHeight }}>
                <div style={{ flex: '0 0 auto', overflow: 'hidden' }}>
                    <div style={{ width: '100%', marginBottom: 0 }}>
                        {/* header */}
                        <div style={{ overflowX: 'scroll', overflowY: 'hidden', position: 'relative' }}>
                            <table>
                                <Header>
                                    <tr>{headers(10)}</tr>
                                </Header>
                            </table>
                        </div>
                        {/* fixed left header */}
                        <div style={{ overflow: 'hidden', top: 0, left: 0, position: 'absolute' }}>
                            <table>
                                <colgroup>
                                    <col style={{ width: 100 }}></col>
                                    <col style={{ width: 100 }}></col>
                                </colgroup>
                                <Header>
                                    <tr>{headers(2)}</tr>
                                </Header>
                            </table>
                        </div>
                        {/* fixed right header */}
                        <div style={{ overflow: 'hidden', top: 0, right: 0, position: 'absolute' }}>
                            <table>
                                <colgroup>
                                    <col style={{ width: 100 }}></col>
                                    <col style={{ width: 100 }}></col>
                                </colgroup>
                                <Header>
                                    <tr>{headers(2)}</tr>
                                </Header>
                            </table>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '0 1 100%', position: 'relative', overflow: 'hidden' }}>
                    {/* body */}
                    <div style={{ width: '100%', height: '100%', overflowX: 'auto', overflowY:'hidden' }}>
                        <table>
                            <Body>
                                {rows(1, c => columns(10))}
                                {rows(10, c => columns(10, c2))}
                            </Body>
                        </table>
                    </div>
                    {/* fixed left body */}
                    <div className='left' style={{ position: 'absolute', left: 0, top: 0, bottom: 15, overflow: 'hidden' }}>
                        <div style={{ height: '100%', overflowY: 'scroll', margin: '0 -15px -15px 0', padding: '0 15px 15px 0' }}>
                            <table>
                                <colgroup>
                                    <col style={{ width: 100 }}></col>
                                    <col style={{ width: 100 }}></col>
                                </colgroup>
                                <Body>
                                    {rows(1, c => columns(2))}
                                    {rows(10, c => columns(2, c2))}
                                </Body>
                            </table>
                        </div>
                    </div>
                    {/* fixed right body */}
                    <div className='right' style={{ position: 'absolute', right: 0, top: 0, bottom: 15, overflow: 'hidden' }}>
                        <div style={{ height: '100%', overflowY: 'scroll' }}>
                            <table>
                                <colgroup>
                                    <col style={{ width: 100 }}></col>
                                    <col style={{ width: 100 }}></col>
                                </colgroup>
                                <Body>
                                    {rows(1, c => columns(2))}
                                    {rows(10, c => columns(2, c2))}
                                </Body>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <h1>Fix header</h1>
            <div id='pt' style={{ display: 'flex', flexDirection: 'column', width: tableWidth, margin: 'auto', position: 'relative', height: tableHeight }}>
                <div style={{ flex: '0 0 auto', overflow: 'hidden' }}>
                    <div style={{ width: '100%', marginBottom: 0 }}>
                        {/* header */}
                        <div style={{ overflowX: 'scroll', overflowY: 'hidden', position: 'relative' }}>
                            <table>
                                <Header>
                                    <tr>{headers(10)}</tr>
                                </Header>
                            </table>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '0 1 100%', position: 'relative', overflow: 'hidden' }}>
                    {/* body */}
                    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                        <table>
                            <Body>
                                {rows(1, c => columns(10))}
                                {rows(10, c => columns(10, c2))}
                            </Body>
                        </table>
                    </div>
                </div>
            </div>

            <h1>Normal</h1>
            <div id='pt' style={{ display: 'flex', flexDirection: 'column', margin: 'auto', position: 'relative' }}>
                <div style={{ flex: '0 0 auto', overflow: 'hidden' }}>
                    <div style={{ width: '100%', marginBottom: 0 }}>
                        {/* header */}
                        <div style={{ overflowX: 'scroll', overflowY: 'hidden', position: 'relative' }}>
                            <table>
                                <Header>
                                    <tr>{headers(10)}</tr>
                                </Header>
                            </table>
                        </div>
                    </div>
                </div>
                <div style={{ flex: '0 1 100%', position: 'relative', overflow: 'hidden' }}>
                    {/* body */}
                    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                        <table>
                            <Body>
                                {rows(1, c => columns(10))}
                                {rows(10, c => columns(10, c2))}
                            </Body>
                        </table>
                    </div>
                </div>
            </div>

        </div>

    )
}

const h = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen']

function headers(n) {
    const r = []
    for (let i = 0; i < n; i++) {
        r.push(h[i % h.length])
    }
    return r.map((header, i) => {
        return <th key={i}>{header}</th>
    })
}

function columns(n, array = c) {
    const r = []
    for (let i = 0; i < n; i++) {
        r.push(array[i % array.length])
    }
    return r.map((column, i) => {
        return <td key={i}>{i + column}</td>
    })
}

function rows(n = 1, c) {
    const r = []
    for (let i = 0; i < n; i++) {
        r.push(c())
    }
    return r.map((column, i) => {
        return <tr key={i}>{column}</tr>
    })
}