import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo, login } from "../api/login";
import { ElMessage } from "element-plus";
import { removeToken, setToken} from "../utils/auth";

export const useAuthStore = defineStore('auth',()=>{
  const userinfo = ref({})
  const permisstions = ref([])
  const roles = ref([])
  const userLogin = async (data) => {
    let flag
    await login(data).then(res=>{
      if(res?.code === 1000) {
        setToken(res.data)
        flag = true
      }else {
        ElMessage.error(res.msg)
        flag = false
      }
    })
    return flag
  }
  const userLogout = () => {
    removeToken()
  }
  const setUserInfo = async () => {
    await getUserInfo().then(res=>{
      userinfo.value = res.data.user
      permisstions.value = res.data.permissions
      roles.value = res.data.roles
    })
  }

  return {
    userinfo,
    permisstions,
    userLogin,
    userLogout,
    setUserInfo
  }
})
