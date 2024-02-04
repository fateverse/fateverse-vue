import request from "@/utils/request.js";

//查询操作日志
export const getOperateLog = (params) => {
  return request({
    url: "/log/log/list",
    method: "get",
    params
  });
};
//查询操作日志详情
export const getOperateLogDetail = (operId) => {
  return request({
    url: `/log/log/${operId}`,
    method: "get"
  });
};
//删除操作日志
export const deleteOperateLog = (operIds) => {
  return request({
    url: `/log/log/${operIds}`,
    method: "delete"
  });
};
