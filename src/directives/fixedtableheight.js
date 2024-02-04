import { useDebounce } from "../utils/publicvoid"

let dom
export const fixedHeight = (el, binding, vnode) => {
  dom = el
  // 获取相对距离
  const relativeObj = el.getBoundingClientRect()
  // 获取网页高度
  const clientHeight = document.body.clientHeight
  // 70为分页器高度
  el.style.height = (clientHeight - relativeObj.top - 70) + 'px'
  el.style.overflow = 'auto'
}

window.addEventListener('resize', () => {
  if (dom) {
    const resizeHeight = useDebounce(fixedHeight(dom), 2000, false)
    resizeHeight()
  }
})
