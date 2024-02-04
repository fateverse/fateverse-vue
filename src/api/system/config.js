import request from '@/utils/request.js'

// 请求参数配置表list
export const getConfigList = (params) => {
    return request({
        url: '/admin/config',
        method: 'get',
        params
    })
}

//获取到option列表

// 获取参数配置表详情
export const getConfigDetails = (configId) => {
    return request({
        url: '/admin/config/' + configId,
        method: 'get'
    })
}

// 新增参数配置表
export const addConfig = (data) => {
    return request({
        url: '/admin/config',
        method: 'post',
        data
    })
}

// 修改参数配置表
export const editConfig = (data) => {
    return request({
        url: '/admin/config',
        method: 'put',
        data
    })
}

// 删除参数配置表
export const delConfig =(configId) => {
    return request({
        url: '/admin/config/' + configId,
        method: 'delete'
    })
}

