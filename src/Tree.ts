export default function Tree(option) {
    if (Object.keys(option).length !== 1) throw `Invalid tree option`
    const field = Object.keys(option)[0]
    if (typeof option[field] !== 'function') throw `Invalid tree option`
    const getKey = option[field]
    return {
        getAllParentKeys: getAllParentKeys.bind(null, field, getKey, undefined, undefined),
        flatten: flatten.bind(null, field, getKey, undefined, undefined)
    }
}


function flatten(field, getKey, result = [], parentKey, data, keys = [], depth = 0) {
    if (!data) return data
    for (let i = 0, len = data.length; i < len; i++) {
        const row = data[i]
        const key = getKey({ row, index: i, parentKey })
        result.push({ ...row, [field]: key, depth })
        const one = keys.find(k => k == key)
        if (one !== undefined && row.children) {
            flatten(field, getKey, result, key, row.children, keys, depth + 1)
        }
    }
    return result
}

function getAllParentKeys(field, getKey, result = [], parentKey, data) {
    if (!data) return data
    for (let i = 0, len = data.length; i < len; i++) {
        const row = data[i]
        if(row.children) {
            const key = getKey({ row, index: i, parentKey })
            result.push(key)
            getAllParentKeys(field, getKey, result, key, row.children)
        }
    }
    return result
}