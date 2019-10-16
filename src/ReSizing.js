export default class ReSizing {
    constructor(mouseDownEvent) {
        this.clientX = mouseDownEvent.clientX
    }
    move = evt => evt.clientX - this.clientX
}
