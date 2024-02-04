import request from '@/utils/request.js'

export const getDictOption = () => {
    return request({
        url: '/admin/dict/type/option',
        method: 'get'
    })
}

// 请求字典类型表list
export const getDictTypeList = (params) => {
    return request({
        url: '/admin/dict/type',
        method: 'get',
        params
    })
}

// 获取字典类型表详情
export const getDictTypeDetails = (dictTypeId) => {
    return request({
        url: '/admin/dict/type/' + dictTypeId,
        method: 'get'
    })
}

// 新增字典类型表
export const addDictType = (data) => {
    return request({
        url: '/admin/dict/type',
        method: 'post',
        data
    })
}

// 修改字典类型表
export const editDictType = (data) => {
    return request({
        url: '/admin/dict/type',
        method: 'put',
        data
    })
}

// 删除字典类型表
export const delDictType =(dictTypeId) => {
    return request({
        url: '/admin/dict/type/' + dictTypeId,
        method: 'delete'
    })
}
