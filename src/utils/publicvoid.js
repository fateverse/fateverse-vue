// import md5 from 'js-md5'
// import { useI18n } from 'vue-i18n'

/**
 * @author 温华
 * @description 这是一个加密函数
 * @param {string | number} data 需要加密的数据
 * @returns {result} 返回已加密的数据
 */
// export const useEncryption = data => {
//   const result = md5(data)
//   return result
// }

/**
 * @author 温华
 * @param {function} func 需要添加防抖的函数
 * @param {number} wait 等待执行的时间
 * @param {boolean} immediate 是否立即执行
 * @returns
 */
export const useDebounce = function (func, wait = 1000, isImmediate = true) {
  var timerId = null
  var flag = true
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timerId)
    if (isImmediate) {
      if (flag) {
        func.apply(context, args)
        flag = false
      }
      timerId = setTimeout(function () {
        flag = true
      }, wait)
    } else {
      timerId = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

export const tableHead = {
  backgroundColor: '#F6F9FF',
  color: '#3D3F46',
  textAlign: 'center',
  // lineHeight: '30px'
}

export const tabCell = {
  textAlign: 'center',
}