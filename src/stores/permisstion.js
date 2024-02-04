import { defineStore } from "pinia";
import { defineAsyncComponent, ref } from "vue";
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
      if (route.pathParams != null) {
        let pathParams = route.pathParams
        route.pathParams = JSON.parse(route.pathParams)
        route.query = {}
        for (const key in route.pathParams) {
          route.query = {[key]: route.pathParams[key]}
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
      item.title = item.meta.title
      item.icon = item.meta.icon
      return true
    })
  }


  const loadView = (view) => {
    if (import.meta.env.MODE === 'development') {
      return () => import(/* @vite-ignore */`/src/views/${view}.vue`)
    } else {
      return VueComUrl['../views/' + view + '.vue']
    }
  }


  return {
    asyncRouters,
    menuList,
    isLoadRoutes,
    setAsyncRouters,
    setIsLoadRoutes
  }
})
