import request from '@/utils/request.js'

export const getUserList = (params) => {
  return request({
    url: '/admin/user',
    method: 'get',
    params
  })
}

//获取用户详情
export const getUserDetail = (userId) => {
  return request({
    url: `/admin/user/info/${userId}`,
    method: "get"
  });
};
// 新增用户
export const addUser = (data) => {
  return request({
    url: '/admin/user',
    method: 'post',
    data
  })
}
// 修改用户
export const editUser = (data) => {
  return request({
    url: '/admin/user',
    method: 'put',
    data
  })
}

//删除用户信息
export const deleteUser = (userId) => {
  return request({
    url: `/admin/user/${userId}`,
    method: "delete"
  });
};
//根据roleId获取用户信息
export const getUserByRoleId = (roleId, params) => {
  return request({
    url: `/admin/user/role/${roleId}`,
    method: "get",
    params
  });
};
//排除角色id获取用户信息
export const getUserExcludeRoleId = (roleId, params) => {
  return request({
    url: `/admin/user/role/exclude/${roleId}`,
    method: "get",
    params
  });
};
//建立角色用户绑定关系
export const roleBindUser = (data) => {
  return request({
    url: '/admin/user/bind/role',
    method: 'put',
    data
  })
}
// 解除角色与用户之间的绑定状态
export const cancelAuthorization = (data) => {
  return request({
    url: '/admin/user/unbind/role',
    method: 'put',
    data
  })
}
//解除当前角色对应的所有用户的绑定关系
export const unbindAllUser = (roleId) => {
  return request({
    url: '/admin/user/all/unbind/role',
    method: 'put',
    data: {
      id: roleId
    }
  })
}

//根据岗位id获取分配的用户信息
export const getUserInfoByPostId = (postId, params) => {
  return request({
    url: `/admin/user/post/${postId}`,
    method: 'get',
    params
  })
}
//排除岗位id获取用户信息
export const getUserExcludePostId = (postId, params) => {
  return request({
    url: `/admin/user/post/exclude/${postId}`,
    method: "get",
    params
  });
};
//建立岗位与用户绑定关系
export const postBindUser = (userIds, postId) => {
  return request({
    url: '/admin/user/bind/post',
    method: 'put',
    data: {
      ids: userIds,
      id: postId
    }
  })
}
// 解除岗位与用户之间的绑定状态
export const cancelPostAndUserAuthorization = (userIds, postId) => {
  return request({
    url: '/admin/user/unbind/post',
    method: 'put',
    data: {
      ids: userIds,
      id: postId
    }
  })
}
//解除当前岗位对应的所有用户的绑定关系
export const unbindAllUserByPost = (postId) => {
  return request({
    url: '/admin/user/all/unbind/post',
    method: 'put',
    data: {
      id: postId
    }
  })
}
