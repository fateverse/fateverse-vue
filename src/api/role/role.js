import request from '@/utils/request.js'

export const getRoleList = (params) => {
  return request({
    url: '/admin/role',
    method: 'get',
    params
  })
}
//查询角色option
export const getRoleOption = () => {
  return request({
    url: '/admin/role/option',
    method: "get"
  });
};
//查询角色信息
export const getRoleDetail = (roleId) => {
  return request({
    url: `/admin/role/${roleId}`,
    method: "get"
  });
};
//根据菜单id获取分配的角色信息
export const getRoleInfoByMenuId = (params) => {
  return request({
    url: '/admin/role/menu',
    method: 'get',
    params
  })
}
//获取排除在外的角色
export const getRoleExcludeMenuId = (params) => {
  return request({
    url: '/admin/role/menu/list',
    method: "get",
    params
  });
};
// 新增角色
export const addRole = (data) => {
  return request({
    url: '/admin/role',
    method: 'post',
    data
  })
}

// 修改角色
export const editRole = (data) => {
  return request({
    url: '/admin/role',
    method: 'put',
    data
  })
}
//解除当前角色对应的所有菜单的绑定关系
export const unbindAllRole = (menuId) => {
  return request({
    url: '/admin/role/all/unbind/menu',
    method: 'put',
    data: {
      id: menuId
    }
  })
}
// 解除角色与菜单之间的绑定状态
export const cancelAuthorization = (menuId, roleIds) => {
  return request({
    url: '/admin/role/unbind/menu',
    method: 'put',
    data: {
      id: menuId,
      ids: roleIds
    }
  })
}
//建立角色用户绑定关系
export const bindRoleAndMenu = (menuId, roleIds) => {
  return request({
    url: '/admin/role/bind/menu',
    method: 'put',
    data: {
      id: menuId,
      ids: roleIds
    }
  })
}
//删除角色信息
export const deleteRole = (roleId) => {
  return request({
    url: `/admin/role/${roleId}`,
    method: "delete"
  });
};
