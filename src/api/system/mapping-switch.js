import request from '@/utils/request.js'

export const getMappingList = (params) => {
  return request({
    url: '/admin/mapping/switch',
    method: 'get',
    params
  })
}
export const editMappingSwitch = (data) => {
  return request({
    url: '/admin/mapping/switch',
    method: 'put',
    data
  })
}
