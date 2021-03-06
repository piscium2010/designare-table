import * as React from 'react'
import { useState, useEffect } from 'react'
import Layer from '@piscium2010/lime/Layer'
import '@piscium2010/lime/Layer/layer.css'

export default function FilterLayer({ content, filterAPI, show, ...restProps }) {
    const [visible, setVisible] = useState(show)
    useEffect(() => {
        const timer = show
            ? setVisible(true)
            : window.setTimeout(() => setVisible(false), 250/* spare time for slide out animation which is 200ms */)
        return () => window.clearTimeout(timer as number)
    }, [show])

    return (
        <Layer show={show} {...restProps}>{visible ? <C content={content} filterAPI={filterAPI} /> : null}</Layer>
    )
}

function C(props) {
    const { content, filterAPI } = props
    return content(filterAPI)
}