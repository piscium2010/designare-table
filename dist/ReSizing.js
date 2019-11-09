"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ReSizing {
    constructor(mouseDownEvent) {
        this.move = evt => evt.clientX - this.clientX;
        this.clientX = mouseDownEvent.clientX;
    }
}
exports.default = ReSizing;
