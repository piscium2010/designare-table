import React, { useState, useEffect, Fragment } from 'react'
import Icons from './Icons'

const loadingLayout = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: .5,
    transition: 'opacity .3s',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}

export default function (props) {
    const [isActive, setActive] = useState(false)
    const { loading: Loading, threshold = 100, ...restProps } = props
    let timer
    useEffect(() => {
        timer = window.setTimeout(() => setActive(true), threshold)
        return () => window.clearTimeout(timer)
    }, [])

    return (
        <Fragment>
            {
                isActive
                    ? typeof Loading === 'function'
                        ? <Loading />
                        : <div style={loadingLayout}>
                            {
                                Loading === true
                                    ? <Icons.Loading className={`designare-table-loading`} {...restProps} />
                                    : Loading
                            }
                        </div>
                    : null
            }
        </Fragment>
    )
}