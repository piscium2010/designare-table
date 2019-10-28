const config = { attributes: true, childList: true, subtree: true }

export default function (instance) {
    const observer = new MutationObserver(mutationsList => {
        console.log(`mutate`, mutationsList)
        window.requestAnimationFrame(() => {
            instance.context.reSyncWidthAndHeight()
        })
    })

    return {
        observe: el => observer.observe(el, config),
        disconnect: () => observer.disconnect()
    }

}