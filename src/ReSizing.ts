export default class ReSizing {
    clientX: number
    constructor(mouseDownEvent) {
        this.clientX = mouseDownEvent.clientX
    }
    move = evt => evt.clientX - this.clientX
}
