export default class SyncScrolling {
    map: Map<any, any>;
    debouncedReAddOnScroll: any;
    onScroll: (evt: any) => void;
    reAddOnScroll: (except: any) => void;
    add: (scrollable: any, mode?: string) => void;
    remove: (scrollable: any) => void;
}
