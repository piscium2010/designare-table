export default class SyncScrolling {
    map: Map<any, any>;
    debouncedReAddOnScroll: (except?: HTMLElement) => void;
    constructor();
    onScroll: (evt: any) => void;
    reAddOnScroll: (except: any) => void;
    add: (scrollable: any, mode?: string) => void;
    remove: (scrollable: any) => void;
}
