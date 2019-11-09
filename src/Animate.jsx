import * as React from 'react'
import { useEffect, useRef } from 'react'

export default function Animate(props) {
    const ref = useRef(null)
    useEffect(() => {
        window.requestAnimationFrame(() => {
            ref.current.classList.add('animate')
        })
    }, [])
    return (
        <div ref={ref} {...props}>{props.children}</div>
    )
}