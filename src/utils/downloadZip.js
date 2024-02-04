import axios from 'axios'
import {getToken} from "./auth";
import {ElMessage} from "element-plus";

const baseURL = import.meta.env.VITE_BASE_URL

const mimeMap = {
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip: 'application/zip'
}


export function downLoadZip(url) {
    axios({
        method: 'get',
        url: baseURL + url,
        responseType: 'blob',
        headers: {'Authorization': getToken()}
    }).then(res => {
        try {
            resolveBlob(res, mimeMap.zip)
        }catch (e) {
            ElMessage.error("下载失败,请检查相关配置")
        }
    })
}

export function downLoadExcel(url,params) {
    axios({
        method: 'get',
        url: baseURL + url,
        params,
        responseType: 'blob',
        headers: {'Authorization': getToken()}
    }).then(res => {
        console.log(res)
        try {
            resolveBlob(res, mimeMap.xlsx)
        }catch (e) {
            console.log(res)
            ElMessage.error(res.data.msg)
        }
    })
}


/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
    const aLink = document.createElement('a')
    let blob = new Blob([res.data], {type: mimeType})
    let reg = /fileName=([^&]+)/;
    let contentDisposition = decodeURI(res.headers['content-disposition'])
    let result = reg.exec(contentDisposition)
    console.log(result)
    let fileName = result[1]
    fileName = fileName.replace(/\"/g, '')
    aLink.href = URL.createObjectURL(blob)
    aLink.setAttribute('download', fileName) // 设置下载文件名称
    document.body.appendChild(aLink)
    aLink.click()
    document.body.appendChild(aLink)
}