import request from '@/utils/request.js'
export const getNoticeList = (params) => {
    return request({
        url: '/notice/notice',
        method: 'get',
        params
    })
}
export const getNoticeDetail = (noticeId) => {
    return request({
        url: '/notice/notice/'+noticeId,
        method: "get"
    });
};


export const addNotice = (data) => {
    return request({
        url: '/notice/notice',
        method: 'post',
        data
    })
}

export const deleteNotice = (noticeId) => {
    return request({
        url: `/notice/notice/${noticeId}`,
        method: "delete"
    });
};
