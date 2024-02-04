import request from '@/utils/request.js'

export const getCacheOpt = (cacheKey) => {
  return request({
    url: '/admin/dict/data/option/'+ cacheKey,
    method: 'get',
  })
}

export const getCacheType = (cacheKey) => {
  return request({
    url: '/admin/dict/data/type/'+ cacheKey,
    method: 'get',
  })
}