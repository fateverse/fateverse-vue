import { useAuthStore } from '@/stores/userstore.js'

export const hasPerm = (el, binding, vnode) => {
  const authStore = useAuthStore()
  const allPermission = "*:*:*"; //所有权限
  const { value } = binding
  const permisstions = authStore.permisstions
  if (value && value instanceof Array && value.length > 0) {
    const permissiosFlag = value
    const hasPermission = permisstions.some(permission => {
      return allPermission === permission || permissiosFlag.includes(permission)
    })
    console.log(hasPermission);
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error('操作权限标识应为string[]')
  }
}