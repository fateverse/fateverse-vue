import request from '@/utils/request.js'

// 获取list
export const getIPBlackList = (params) => {
  return request({
    url: '/admin/ip/back',
    method: 'get',
    params
  })
}

// 新增
export const addIPBlack = (data) => {
  return request({
    url: '/admin/ip/back',
    method: 'post',
    data
  })
}

// 修改
export const editIPBlack = (data) => {
  return request({
    url: '/admin/ip/back',
    method: 'put',
    data
  })
}

// 删除
export const delIPBlack = (ids) => {
  return request({
    url: '/admin/ip/back/'+ids,
    method: 'delete'
  })
}

// 详情
export const getIPBlackDetail = (id) => {
  return request({
    url: '/admin/ip/back/'+id,
    method: 'get'
  })
}