import React, { useState } from 'react'

export default function (props) {
    const [animation, setAnimation] = useState(false)
    const onClick = evt => setAnimation(true)
    const tabs = ['lorem 1', 'lorem 2', 'lorem 3']
    return (
        <div className='flipper'>
            <div className={animation ? 'container shadow' : 'container'}>

                <div className={animation ? 'turnIn detail' : 'detail'}>
                    <Tabs tabs={tabs} />
                </div>
                <div className={animation ? 'turnOut more' : 'more'} onClick={onClick}>
                    <div style={{marginLeft:'auto', cursor:'pointer', width:'100px'}}>
                    More

                    </div>
                </div>
            </div>
        </div>
    )
}

function Tabs(props) {
    const { tabs } = props
    return (
        <div style={{ display: 'flex' }}>
            {
                tabs.map((t, i) => {
                    return (
                        <div className={`tab ${i === 0 ? 'active' : ''}`} key={i}>{t}</div>
                    )
                })
            }
        </div>
    )
}