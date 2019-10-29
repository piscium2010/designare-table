import React, { useState, useRef, useEffect } from 'react'
import Icons from './Icons'

export default function Pagination(props) {
    const [isEditing, setEditing] = useState(false)
    const { pageNo, pageSize, setPageSize, total, onGoToPage, isFirstPage, isLastPage, pageSizeOptions = [] } = props
    const onFirst = () => isFirstPage ? undefined : onGoToPage(1)
    const onPrev = () => isFirstPage ? undefined : onGoToPage(pageNo - 1)
    const onNext = () => isLastPage ? undefined : onGoToPage(pageNo + 1)
    const onLast = () => isLastPage ? undefined : onGoToPage(Math.ceil(total / pageSize))

    return (
        <div className={`designare-table-pagination`} style={{ display: 'flex', userSelect: 'none', flex: '1 1 auto', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', height: 35, padding: '6px 0', width: '100%' }}>
                <div style={{ flex: '1 1 40%', display: 'flex', justifyContent: 'space-between' }}>
                    <div className={`designare-table-pagination-desc designare-table-pagination-total`} >
                        {total}
                    </div>
                    {
                        pageSizeOptions.length > 0
                            ? <div style={{ display: 'flex' }}>
                                <div className={`designare-table-pagination-desc`}><span style={{ marginTop: 4 }}><Icons.List /></span></div>
                                {
                                    pageSizeOptions.map((size, i) => (
                                        <div
                                            key={i}
                                            className={`designare-table-pagination-number option ${size === pageSize ? 'active' : ''}`}
                                            onClick={evt => setPageSize(size)}
                                        >
                                            {size}
                                        </div>
                                    ))
                                }
                            </div>
                            : null
                    }
                </div>
                <div style={{ display: 'flex', lineHeight: '24px', marginLeft: 'auto' }}>
                    <div className={`designare-table-pagination-btn ${isFirstPage ? 'disabled' : ''}`} onClick={onFirst}><Icons.First /></div>
                    <div className={`designare-table-pagination-btn ${isFirstPage ? 'disabled' : ''}`} onClick={onPrev} ><Icons.Prev /></div>
                    <div className={`designare-table-pagination-btn`} onClick={evt => setEditing(true)}>
                        <GoTo pageNo={pageNo} onGoToPage={onGoToPage} isEditing={isEditing} setEditing={setEditing} />
                    </div>
                    <div className={`designare-table-pagination-btn ${isLastPage ? 'disabled' : ''}`} onClick={onNext}><Icons.Next /></div>
                    <div className={`designare-table-pagination-btn ${isLastPage ? 'disabled' : ''}`} onClick={onLast}><Icons.Last /></div>
                </div>
            </div>
        </div>
    )
}

function GoTo(props) {
    const ref = useRef(null)
    const { pageNo, isEditing, setEditing, onGoToPage } = props
    const [text, setText] = useState(pageNo)
    const [value, setValue] = useState(pageNo)
    const str = value + ''

    const onBlur = evt => setEditing(false)
    const onChange = evt => setValue(evt.target.value)
    const onEnter = evt => {
        if (evt.keyCode === 13 && !isNaN(value / 1)) {
            setText(value)
            setEditing(false)
            onGoToPage(value / 1)
        }
    }

    useEffect(() => {
        isEditing ? ref.current.focus() : undefined
        isEditing ? setValue(pageNo) : undefined
    }, [isEditing, pageNo])

    useEffect(() => {
        isEditing ? undefined : setText(pageNo)
    }, [pageNo])

    return (
        isEditing
            ? <input
                ref={ref}
                value={value}
                size={Math.max(3, str.length)}
                onBlur={onBlur}
                onKeyDown={onEnter}
                onChange={onChange}
                style={{ fontSize: 'inherit' }}
            />
            : <div style={{ userSelect: 'none' }} onClick={evt => setEditing(true)}>{text}</div>
    )
}

