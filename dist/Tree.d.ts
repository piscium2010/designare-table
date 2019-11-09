export default function Tree(option: any): {
    getAllParentKeys: (data: any) => any;
    flatten: (data: any, keys?: any[], depth?: number) => any;
};
