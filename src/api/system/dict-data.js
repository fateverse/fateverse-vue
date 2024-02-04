import request from '@/utils/request.js'

// 请求字典类型表list
export const getDictDataList = (params) => {
    return request({
        url: '/admin/dict/data',
        method: 'get',
        params
    })
}

// 获取字典数据表详情
export const getDictDataDetails = (dictCode) => {
    return request({
        url: '/admin/dict/data/' + dictCode,
        method: 'get'
    })
}

// 新增字典数据表
export const addDictData = (data) => {
    return request({
        url: '/admin/dict/data',
        method: 'post',
        data
    })
}

// 修改字典类型表
export const editDictData = (data) => {
    return request({
        url: '/admin/dict/data',
        method: 'put',
        data
    })
}

// 删除字典类型表
export const delDictData = (dictCode) => {
    return request({
        url: `/admin/dict/data/${dictCode}`,
        method: 'delete'
    })
}
