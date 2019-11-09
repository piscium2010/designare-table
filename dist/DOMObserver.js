"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = { attributes: true, childList: true, subtree: true };
function default_1(instance) {
    const observer = new MutationObserver(mutationsList => {
        // console.log(`mutation`,)
        instance.context.global['resizing']
            ? instance.context.syncScrollBarStatus()
            : window.requestAnimationFrame(() => {
                instance.context.reSyncWidthAndHeight();
            });
    });
    return {
        observe: el => observer ? observer.observe(el, config) : undefined,
        disconnect: () => observer ? observer.disconnect() : undefined
    };
}
exports.default = default_1;
