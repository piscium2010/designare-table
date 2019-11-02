import debounce from 'lodash/debounce'

export default class SyncScrolling {
    map = new Map()

    constructor() {
        this.debouncedReAddOnScroll = debounce(this.reAddOnScroll, 100)
    }

    onScroll = evt => {
        const master = evt.target
        const { scrollLeft, scrollTop } = master
        const direction = this.map.get(master)
        
        this.map.forEach((v, k) => {
            const slave = k === master ? undefined : k
            if (slave) {
                slave.removeEventListener('scroll', this.onScroll)
                switch (direction) {
                    case 'scrollLeft':
                        slave.scrollLeft = scrollLeft
                        break
                    case 'scrollTop':
                        slave.scrollTop = scrollTop
                        break
                    case 'both':
                        slave.scrollTop = scrollTop
                        slave.scrollLeft = scrollLeft
                        break
                    default:
                        throw `invalid mode: ${v}. Mode should be one of 'scrollLeft', 'scrollTop', 'both'`
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
