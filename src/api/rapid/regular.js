import request from '@/utils/request.js'

// 请求校验规则表list
export const getRegularList = (params) => {
    return request({
        url: '/code-gen/rapid/regular',
        method: 'get',
        params
    })
}

// 获取校验规则表详情
export const getRegularDetails = (regularId) => {
    return request({
        url: '/code-gen/rapid/regular/' + regularId,
        method: 'get'
    })
}

// 获取校验规则选项列表
export const getRegularOpt = (regularId) => {
    return request({
        url: '/code-gen/rapid/regular/option',
        method: 'get'
    })
}

// 新增校验规则表
export const addRegular = (data) => {
    return request({
        url: '/code-gen/rapid/regular',
        method: 'post',
        data
    })
}

// 修改校验规则表
export const editRegular = (data) => {
    return request({
        url: '/code-gen/rapid/regular',
        method: 'put',
        data
    })
}

// 删除校验规则表
export const delRegular =(regularId) => {
    return request({
        url: '/code-gen/rapid/regular/' + regularId,
        method: 'delete'
    })
}