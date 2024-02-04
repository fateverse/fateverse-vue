import request from '@/utils/request.js'


export const getDataSourceList = (params) => {
    return request({
        url: '/code-gen/data-source',
        method: 'get',
        params
    })
}

export const getDataSourceOption = () => {
    return request({
        url: '/code-gen/data-source/option',
        method: 'get'
    })
}

export const getDataSourceOptionType=()=>{
    return request({
        url:'/code-gen/data-source/option/type',
        method:'get'
    })
}

export const getDataSource = (dsId) => {
    return request({
        url: `/code-gen/data-source/${dsId}`,
        method: 'get'
    })
}

export const addDataSource = (data) => {
    return request({
        url: '/code-gen/data-source',
        method: 'post',
        data
    })
}
export const editDataSource = (data) => {
    return request({
        url: '/code-gen/data-source',
        method: 'put',
        data
    })
}

export const deleteDataSource = (dsId) => {
    return request({
        url: `/code-gen/data-source/${dsId}`,
        method: 'delete'
    })
}

