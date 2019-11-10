export default class SyncScrolling {
    private map;
    private debouncedReAddOnScroll;
    constructor();
    onScroll: (evt: any) => void;
    reAddOnScroll: (except: any) => void;
    add: (scrollable: any, mode?: string) => void;
    remove: (scrollable: any) => void;
}
