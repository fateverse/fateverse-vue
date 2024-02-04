import axios from "axios";
import { AxiosCanceler } from "./axiosCanceler";
import { ElMessage, ElMessageBox } from "element-plus";
import { getToken, removeToken } from "./auth";

axios.defaults.headers['Content-Type']='application/json'

const serveice = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 6000
})
const axiosCanceler = new AxiosCanceler()
serveice.interceptors.request.use(config=>{
  const ACCESS_TOKEN = getToken() || ''
  if(ACCESS_TOKEN!==undefined && ACCESS_TOKEN!=='') {
    config.headers['Authorization']=ACCESS_TOKEN
  }
  // 检查是否有重复请求, 有则取消掉
  axiosCanceler.removePendingRequest(config)
  // 将请求加入pendingMap
  axiosCanceler.addPendingRequest(config)
  return config
},error=>{
  Promise.reject(error)
})
serveice.interceptors.response.use(response=>{
  axiosCanceler.removePendingRequest(response.config)
  //二进制数据直接返回
  if(response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
    return response.data
  }
  return response.data
},error=>{
  let response = error.response
  const status = response.status;
  switch(status) {
    case 401:
      ElMessageBox.confirm('登录状态已过期,请重新登录','系统提示',{
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(()=>{
        removeToken()
        window.location = '/login'
      })
      return Promise.reject('会话已过期,请重新登录')
    case 402:
      break;
    case 403:
      ElMessage.warning('禁止访问')
      removeToken()
      window.location = '/forbidden'
      break;
    case 404:
      ElMessage.warning('不存在的地址')
      break;
    case 405:
      ElMessage.warning('传输格式错误,请检查')
      break;
    case 500:
      if (response.data){
        return response.data
      }else {
        ElMessage.error('系统未知错误')
        break;
      }
  }
  return Promise.reject(error)
})

export default serveice
