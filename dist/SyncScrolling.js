"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var debounce = require("lodash/debounce");
var SyncScrolling = (function () {
    function SyncScrolling() {
        var _this = this;
        this.map = new Map();
        this.onScroll = function (evt) {
            var master = evt.target;
            var scrollLeft = master.scrollLeft, scrollTop = master.scrollTop;
            var direction = _this.map.get(master);
            _this.map.forEach(function (v, k) {
                var slave = k === master ? undefined : k;
                if (slave) {
                    slave.removeEventListener('scroll', _this.onScroll);
                    switch (direction) {
                        case 'scrollLeft':
                            slave.scrollLeft = scrollLeft;
                            break;
                        case 'scrollTop':
                            slave.scrollTop = scrollTop;
                            break;
                        case 'both':
                            slave.scrollTop = scrollTop;
                            slave.scrollLeft = scrollLeft;
                            break;
                        default:
                            throw "invalid mode: " + v + ". Mode should be one of 'scrollLeft', 'scrollTop', 'both'";
                    }
                }
            });
            _this.debouncedReAddOnScroll(master);
        };
        this.reAddOnScroll = function (except) {
            _this.map.forEach(function (v, k) {
                k === except ? undefined : k.addEventListener('scroll', _this.onScroll);
            });
        };
        this.add = function (scrollable, mode) {
            if (mode === void 0) { mode = 'scrollLeft'; }
            scrollable.addEventListener('scroll', _this.onScroll);
            _this.map.set(scrollable, mode);
        };
        this.remove = function (scrollable) {
            scrollable.removeEventListener('scroll', _this.onScroll);
            _this.map.delete(scrollable);
        };
        this.debouncedReAddOnScroll = debounce(this.reAddOnScroll, 100);
    }
    return SyncScrolling;
}());
exports.default = SyncScrolling;
