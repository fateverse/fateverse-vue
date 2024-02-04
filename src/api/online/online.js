import request from "@/utils/request.js";
//查询在线用户
export const getOnlineList = (params) => {
    return request({
        url: "/admin/online/user",
        method: "get",
        params
    });
};

//强制退出用户
export const deleteOnlineUser= (tokenId) => {
    return request({
        url: '/admin/online/user/'+tokenId,
        method: "delete"
    });
};
