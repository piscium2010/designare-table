import React, { useState, useEffect } from 'react'
import Layer from '@piscium2010/lime/Layer'
import '@piscium2010/lime/Layer/layer.css'

export default function FilterLayer({ content: C, filterAPI, show, ...restProps }) {
    const [visible, setVisible] = useState(show)
    useEffect(() => {
        show
            ? setVisible(true)
            : window.setTimeout(() => setVisible(false), 250/* spare time for slide out animation which is 200ms */)
    }, [show])

    return (
        <Layer show={show} {...restProps}>{visible ? <C {...filterAPI} /> : null}</Layer>
    )
}