import request from '@/utils/request.js'

export const getCodeImg = () => {
    return request({
        url: '/auth/captchaImage',
        method: 'get'
    })
}

export const login = (data) => {
    return request({
        url: '/auth/login',
        method: 'post',
        data
    })
}

export const getUserInfo = () => {
    return request({
        url: '/auth/info',
        method: 'get',
    })
}
