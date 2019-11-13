"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReSizing = (function () {
    function ReSizing(mouseDownEvent) {
        var _this = this;
        this.move = function (evt) { return evt.clientX - _this.clientX; };
        this.clientX = mouseDownEvent.clientX;
    }
    return ReSizing;
}());
exports.default = ReSizing;
