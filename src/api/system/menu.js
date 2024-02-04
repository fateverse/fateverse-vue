import request from '@/utils/request'

export const getRouters = () => {
  return request({
    url: '/auth/router',
    method: 'get'
  })
}