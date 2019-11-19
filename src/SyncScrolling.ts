import * as debounce from 'lodash/debounce'

export default class SyncScrolling {
    private map = new Map()
    private debouncedReAddOnScroll: (except?: HTMLElement) => void

    constructor() {
        this.debouncedReAddOnScroll = debounce(this.reAddOnScroll, 1000)
    }

    onScroll = evt => {
        const master = evt.target
        const { scrollLeft, scrollTop } = master
        const direction = this.map.get(master)

        this.map.forEach((slaveDirection, k) => {
            const slave = k === master ? undefined : k
            if (slave) {
                slave.removeEventListener('scroll', this.onScroll)
                switch (direction) {
                    case 'scrollLeft':
                        slaveDirection === 'scrollTop' ? undefined : slave.scrollLeft = scrollLeft
                        break
                    case 'scrollTop':
                        slaveDirection === 'scrollLeft' ?  undefined : slave.scrollTop = scrollTop
                        break
                    case 'both':
                         slaveDirection === 'both' || slaveDirection === 'scrollTop' ? slave.scrollTop = scrollTop : undefined
                         slaveDirection === 'both' || slaveDirection === 'scrollLeft' ? slave.scrollLeft = scrollLeft : undefined
                        break
                    default:
                        throw `invalid mode: ${direction}. Mode should be one of 'scrollLeft', 'scrollTop', 'both'`
                }
            }
        })
        this.debouncedReAddOnScroll(master/* except */)
    }

    reAddOnScroll = except => {
        this.map.forEach((v, k) => {
            k === except ? undefined : k.addEventListener('scroll', this.onScroll)
        })
    }

    add = (scrollable, mode = 'scrollLeft') => {
        scrollable.addEventListener('scroll', this.onScroll)
        this.map.set(scrollable, mode)
    }

    remove = scrollable => {
        scrollable.removeEventListener('scroll', this.onScroll)
        this.map.delete(scrollable)
    }
}
