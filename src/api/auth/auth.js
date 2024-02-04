import request from "@/utils/request.js";

export const modifyUser=(data)=>{
    return request({
        url:'/admin/user',
        method:'put',
        data
    })
}