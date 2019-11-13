Object.defineProperty(exports, "__esModule", { value: true });
var config = { attributes: true, childList: true, subtree: true };
function default_1(instance) {
    var observer = new MutationObserver(function (mutationsList) {
        instance.context.global['resizing']
            ? instance.context.syncScrollBarStatus()
            : window.requestAnimationFrame(function () {
                instance.context.reSyncWidthAndHeight();
            });
    });
    return {
        observe: function (el) { return observer ? observer.observe(el, config) : undefined; },
        disconnect: function () { return observer ? observer.disconnect() : undefined; }
    };
}
exports.default = default_1;
