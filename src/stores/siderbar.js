import { defineStore } from "pinia";
import { reactive, ref } from "vue";
export  const useSiderBar = defineStore('siderbar',()=>{
  //定义控制侧边栏是否展开变量默认展开
  const isCollapse = ref(false)
  //获取侧边栏状态
  const getSiderBarStatus = () => {
    return isCollapse.value
  }
  //设置侧边栏状态
  const setSiderBarStatus = () => {
    isCollapse.value = !isCollapse.value
  }

  return {
    isCollapse,
    getSiderBarStatus,
    setSiderBarStatus,
  }
})