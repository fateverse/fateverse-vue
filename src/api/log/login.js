import request from "@/utils/request.js";

//查询登录日志
export const getLoginLogList = (params) => {
  return request({
    url: "/log/login-info/list",
    method: "get",
    params
  });
};
//查询登录日志详情
export const getLoginLogDetail = (infoId) => {
  return request({
    url: `/log/login-info/${infoId}`,
    method: "get"
  });
};
//删除登录日志
export const deleteLoginLog = (infoIds) => {
  return request({
    url: `/log/login-info/${infoIds}`,
    method: "delete"
  });
};
