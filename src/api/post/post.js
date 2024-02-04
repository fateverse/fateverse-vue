import request from '@/utils/request.js'

//获取岗位信息
export const getPostList = (params) => {
    return request({
        url: '/admin/post',
        method: 'get',
        params
    })
}
//查询岗位详情
export const getPostDetail = (postId) => {
    return request({
        url: `/admin/post/info/${postId}`,
        method: "get"
    });
};

//新增岗位
export const addPost = (data) => {
    return request({
        url: '/admin/post',
        method: 'post',
        data
    })
}
//编辑岗位
export const editPost = (data) => {
    return request({
        url: '/admin/post',
        method: 'put',
        data
    })
}
//获取select下拉框数据
export const getSelectOption = () => {
    return request({
        url: '/admin/post/option',
        method: 'get'
    })
}
//删除角色信息
export const deletePost = (postId) => {
    return request({
        url: `/admin/post/${postId}`,
        method: "delete"
    });
};
