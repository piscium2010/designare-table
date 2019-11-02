const config = { attributes: true, childList: true, subtree: true }

export default function (instance) {
    const observer = new MutationObserver(mutationsList => {
        // console.log(`mutation`,)
        instance.context.global['resizing']
            ? instance.context.syncScrollBarStatus()
            : window.requestAnimationFrame(() => {
                instance.context.reSyncWidthAndHeight()
            })
    })

    return {
        observe: el => observer ? observer.observe(el, config) : undefined,
        disconnect: () => observer ? observer.disconnect() : undefined
    }
}