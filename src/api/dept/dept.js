import request from '@/utils/request.js'

//获取部门信息
export const getDeptList = (params) => {
    return request({
        url: '/admin/dept',
        method: 'get',
        params
    })
}
//获取增加时的部门列表
export const getDeptOption = () => {
    return request({
        url: '/admin/dept/option',
        method: 'get'
    })
}
//获取修改时的部门列表
export const getDeptExcludeOption = (deptId) => {
    return request({
        url: `/admin/dept/option/exclude/${deptId}`,
        method: 'get'
    })
}
//新增部门
export const addDept = (data) => {
    return request({
        url: '/admin/dept',
        method: 'post',
        data
    })
}
//编辑部门
export const editDept = (data) => {
    return request({
        url: '/admin/dept',
        method: 'put',
        data
    })
}
//查询部门详情
export const getDeptDetail = (deptId) => {
    return request({
        url: `/admin/dept/${deptId}`,
        method: "get"
    });
};
//删除部门
export const deleteDept = (deptId) => {
    return request({
        url: `/admin/dept/${deptId}`,
        method: "delete"
    });
};
