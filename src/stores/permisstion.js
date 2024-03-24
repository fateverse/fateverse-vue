import { defineStore } from "pinia";
import { ref } from "vue";
import { getRouters } from "@/api/system/menu";
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView.vue'
import router from "../router";
const VueComUrl = import.meta.glob('../views/**/*.vue')

export const usePermisstionStroe = defineStore('permisstion', () => {
  const asyncRouters = ref([])
  //定义是否加载路由变量
  const isLoadRoutes = ref(false)
  const menuList = ref([])

  const setIsLoadRoutes = (status) => {
    return isLoadRoutes.value = status
  }
  const setAsyncRouters = async () => {
    await getRouters().then(res => {
      if (res.code === 1000) {
        const sRouter = JSON.parse(JSON.stringify(res.data))
        const mData = JSON.parse(JSON.stringify(res.data))
        asyncRouters.value = formatAsyncRouters(sRouter)
        menuList.value = generateMenu(mData)
        addAsyncRouters(asyncRouters.value)
        isLoadRoutes.value = false
      } else {
        isLoadRoutes.value = true
        setTimeout(() => setAsyncRouters(), 3000)
      }
    })
  }

  const formatAsyncRouters = (routers) => {
    return routers.filter(route => {
      if (route.component) {
        if (route.component === 'Layout') {
          route.component = Layout
        } else if (route.component === 'ParentView') {
          route.component = ParentView
        }
        else {
          route.component = loadView(route.component)
        }
      }
      if (route.children !== null && route.children && route.children.length !== 0) {
        route.children = formatAsyncRouters(route.children)
      }
      return true
    })
  }

  const addAsyncRouters = (routers) => {
    routers.forEach(route => {
      router.addRoute(route)
    })
  }

  const generateMenu = (routes) => {
    return routes.filter(item => {
      if (item.children && item.children.length !== 0) {
        generateMenu(item.children)
      }
      if (item.pathParams != null) {
        item.path = formatPath(item.path, JSON.parse(item.pathParams))
      }
      item.title = item.meta.title
      item.icon = item.meta.icon
      return true
    })
  }

  // 拼接地址
  const formatPath = (path, query) =>  {
    const queryArr = []
    let newPath = path
    for (const key in query) {
      queryArr.push({label: key, value: query[key]})
    }
    queryArr.forEach((item, index)=>{
      if(!index) {
        newPath += `?${item.label}=${item.value}`
      } else {
        newPath += `&${item.label}=${item.value}`
      }
    })
    return newPath
  }


  const loadView = (view) => {
    if (import.meta.env.MODE === 'development') {
      return () => import(/* @vite-ignore */`/src/views/${view}.vue`)
    } else {
      return VueComUrl['../views/' + view + '.vue']
    }
  }

  const removeMenu = () => {
    menuList.value.length = 0
    asyncRouters.value.length = 0
  }


  return {
    asyncRouters,
    menuList,
    isLoadRoutes,
    setAsyncRouters,
    setIsLoadRoutes,
    removeMenu
  }
})