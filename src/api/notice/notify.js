import request from '@/utils/request.js'
export const getNotifyList = (params) => {
    return request({
        url: '/notice/notify',
        method: 'get',
        params
    })
}
export const getNotifyDetail = (noticeId) => {
    return request({
        url: '/notice/notify/'+noticeId,
        method: "get"
    });
};
//已读单个消息
export const readSingleNotify = (noticeId) => {
    return request({
        url: '/notice/notify/read/'+noticeId,
        method: 'put'
    })
}
//已读全部消息
export const readAllNotify = () => {
    return request({
        url: '/notice/notify/read/all',
        method: 'put'
    })
}
//删除单个消息
export const deleteSingleNotify = (noticeId) => {
    return request({
        url: '/notice/notify/'+noticeId,
        method: "delete"
    });
};
//删除多个消息
export const deleteMoreNotify = (noticeIds) => {
    return request({
        url: '/notice/notify/batch/'+noticeIds,
        method: "delete"
    });
};

