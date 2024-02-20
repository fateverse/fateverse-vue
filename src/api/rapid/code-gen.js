import request from '@/utils/request.js'

export const getTableList = (params) => {
    return request({
        url: '/code-gen/table',
        method: 'get',
        params
    })
}

export const getDynamicTable = (params) => {
    return request({
        url: '/code-gen/dynamic-table',
        method: 'get',
        params
    })
}

export const getTableDetail = (tableId) => {
    return request({
        url: `/code-gen/table/${tableId}`,
        method: 'get',
    })
}

export const previewCode = (tableId) => {
    return request({
        url: `/code-gen/table/preview/${tableId}`,
        method: 'get',
    })
}


export const deleteMoreTable = (params) => {
    return request({
        url: '/code-gen/table',
        method: 'delete',
        params
    })
}
export const deleteTable = (tableId) => {
    return request({
        url: `/code-gen/table/${tableId}`,
        method: 'delete',
    })
}
export const importTable = (data) => {
    return request({
        url: "/code-gen/table/import-table",
        method: 'post',
        data
    })
}

export const editCodeGen = (data) => {
    return request({
        url: '/code-gen/table',
        method: 'put',
        data
    })
}
export const syncDatabase = (tableId) => {
    return request({
        url: '/code-gen/table/sync/'+tableId,
        method: 'put'
    })
}

