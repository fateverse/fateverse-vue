import request from '@/utils/request.js'

export const getMenuList = (params) => {
  return request({
    url: '/admin/menu',
    method: 'get',
    params
  })
}

export const editMenu = (data) => {
  return request({
    url: '/admin/menu',
    method: 'put',
    data
  })
}

export const addMenu = (data) => {
  return request({
    url: '/admin/menu',
    method: 'post',
    data
  })
}

export const delMenu = (menuId) => {
  return request({
    url: '/admin/menu/'+menuId,
    method: 'delete'
  })
}

export const getMenuInfo = (menuId) => {
  return request({
    url: '/admin/menu/info/'+menuId,
    method: 'get'
  })
}

export const getMenuOpt = (excludeId=0) => {
  return request({
    url: '/admin/menu/option/'+excludeId,
    method: 'get'
  })
}

export const getMenuOptRole = (roleId) => {
  return request({
    url: '/admin/menu/option/role/'+roleId,
    method: 'get'
  })
}