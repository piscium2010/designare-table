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
            for (var i = 0, len = _this.listeners.length; i < len; i++) {
                var _a = _this.listeners[i], slaveDirection = _a.value, k = _a.key;
                var slave = k === master ? undefined : k;
                if (slave) {
                    slave.removeEventListener('scroll', _this.onScroll);
                    switch (direction) {
                        case 'scrollLeft':
                            slaveDirection === 'scrollTop' ? undefined : slave.scrollLeft = scrollLeft;
                            break;
                        case 'scrollTop':
                            slaveDirection === 'scrollLeft' ? undefined : slave.scrollTop = scrollTop;
                            break;
                        case 'both':
                            slaveDirection === 'both' || slaveDirection === 'scrollTop' ? slave.scrollTop = scrollTop : undefined;
                            slaveDirection === 'both' || slaveDirection === 'scrollLeft' ? slave.scrollLeft = scrollLeft : undefined;
                            break;
                        default:
                    }
                }
            }
            _this.debouncedReAddOnScroll(master);
        };
        this.reAddOnScroll = function (except) {
            _this.map.forEach(function (v, k) {
                k === except ? undefined : k.addEventListener('scroll', _this.onScroll);
            });
        };
        this.add = function (scrollable, mode) {
            if (mode === void 0) { mode = 'scrollLeft'; }
            switch (mode) {
                case 'scrollLeft':
                    break;
                case 'scrollTop':
                    break;
                case 'both':
                    break;
                default:
                    throw "invalid mode: " + mode + ". Mode should be one of 'scrollLeft', 'scrollTop', 'both'";
            }
            scrollable.addEventListener('scroll', _this.onScroll);
            _this.map.set(scrollable, mode);
            _this.refill();
        };
        this.remove = function (scrollable) {
            scrollable.removeEventListener('scroll', _this.onScroll);
            _this.map.delete(scrollable);
            _this.refill();
        };
        this.refill = function () {
            _this.listeners = [];
            _this.map.forEach(function (value, key) { return _this.listeners.push({ value: value, key: key }); });
        };
        this.debouncedReAddOnScroll = debounce(this.reAddOnScroll, 1000);
    }
    return SyncScrolling;
}());
exports.default = SyncScrolling;
