export default class SyncScrolling {
    private map;
    private debouncedReAddOnScroll;
    private listeners;
    constructor();
    onScroll: (evt: any) => void;
    reAddOnScroll: (except: any) => void;
    add: (scrollable: any, mode?: string) => void;
    remove: (scrollable: any) => void;
    refill: () => void;
}
