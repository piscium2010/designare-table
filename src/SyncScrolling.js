import debounce from 'lodash/debounce'

export default class SyncScrolling {
    map = new Map()

    constructor() {
        this.debouncedRestore = debounce(this.restore, 100)
    }

    onScroll = evt => {
        let master, slave
        const scrollable = evt.target
        const { scrollLeft, scrollTop } = scrollable
        // console.log(`scrollTop`, scrollTop, evt.target.getAttribute('class'))
        this.map.forEach((v, k) => {
            k === scrollable ? master = k : slave = k
            if (slave) {
                slave.removeEventListener('scroll', this.onScroll)
                switch (v) {
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
        this.debouncedRestore(master/* except */)
    }

    restore = except => {
        this.map.forEach((v, k) => {
            k === except ? undefined : k.addEventListener('scroll', this.onScroll)
        })
    }

    add = (scrollable, mode = 'scrollLeft') => {
        scrollable.addEventListener('scroll', this.onScroll)
        this.map.set(scrollable, mode)
    }

    remove = scrollable => {
        console.log(`remove scroll`)
        scrollable.removeEventListener('scroll', this.onScroll)
        this.map.delete(scrollable)
    }
}
