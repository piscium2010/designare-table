const config = { attributes: true, childList: true, subtree: true }

export default function (instance) {
    const observer = MutationObserver
        ? new MutationObserver(mutationsList => {
            window.requestAnimationFrame(() => {
                instance.context.reSyncWidthAndHeight()
            })
        })
        : undefined

    return {
        observe: el => observer ? observer.observe(el, config) : undefined,
        disconnect: () => observer ? observer.disconnect() : undefined
    }
}