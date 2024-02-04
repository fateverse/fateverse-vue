// 存储每个请求的标识和取消函数
const pendingRequest = new Map()

const getPendUrl = (config) => {
  return `${config.method}&${config.url}`
}

export class AxiosCanceler {
  /**
   * 添加请求
   * @param {*} config 请求配置
   */
  addPendingRequest(config) {
    const url = getPendUrl(config)
    const controller = new AbortController() // 请求中止控制器
    config.signal = controller.signal
    if(!pendingRequest.has(url)) {
      pendingRequest.set(url, controller)
    }
  }

  /**
   * 移除请求
   * @param {*} config 请求配置
   */
  removePendingRequest(config) {
    const url = getPendUrl(config)
    if(pendingRequest.has(url)) {
      const abortController = pendingRequest.get(url)
      if(abortController) {
        abortController.abort(url)
      }
      pendingRequest.delete(url)
    }
  }

  /**
   * 移除所有请求
   */
  removeAllPendingRequest() {
    for (const abortController of pendingRequest) {
      if(abortController)
        abortController.abort()
    }
    this.reset()
  }

  reset() {
    pendingRequest.clear()
  }
}
