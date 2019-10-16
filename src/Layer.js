import React from 'react'
import Layer from '@piscium2010/lime/Layer'
import '@piscium2010/lime/Layer/layer.css'

export default class L extends React.Component {
    render() {
        // console.log(`render L`,)
        const { animation, C, filterAPI, ...restProps } = this.props
        return (
            <Layer animation='slide-down' {...restProps}>{C(filterAPI)}</Layer>
        )
    }
}