import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '@/layout/index.vue'
import { getToken } from '../utils/auth'
import { usePermisstionStroe } from '@/stores/permisstion.js'
import { useAuthStore } from '@/stores/userstore.js'
NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: ()=>import('@/views/login/index.vue'),
      meta: {
        hidden: true,
        title: '登录'
      }
    },
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',
      meta: {
        hidden: false
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: ()=>import('@/views/home/index.vue'),
          meta: {
            title: '首页',
            breadcrumb: true
          }
        },
        {
          path: '/auth',
          name: 'auth',
          component: ()=>import('@/views/auth/index.vue'),
          meta: {
            title: '个人中心',
            breadcrumb: true
          }
        },
        {
          path: '/rapid/gen/edit/:tableId(\\d+)',
          name: 'genEdit',
          component: ()=>import('@/views/rapid/gen/editTable.vue'),
          meta: {
            title: '数据库生成配置',
            breadcrumb: true
          }
        },
        {
          path: '/role-auth/user/:roleId(\\d+)/:roleName',
          name: 'distribute',
          component: ()=>import('@/views/system/role/DistributeUser.vue'),
          meta: {
            title: '角色分配用户',
            breadcrumb: true
          }
        },
        {
          path: '/post-auth/user/:postId(\\d+)/:postName',
          name: 'assignUser',
          component: ()=>import('@/views/system/post/DistributeUser.vue'),
          meta: {
            title: '岗位分配用户',
            breadcrumb: true
          }
        },
        {
          path: '/menu-auth/role/:menuId(\\d+)/:menuName',
          name: 'assignRole',
          component: ()=>import('@/views/system/menu/DistributeRole.vue'),
          meta: {
            title: '菜单分配角色',
            breadcrumb: true
          }
        },
        {
          path: '/system/notice/inform/index/:queryId',
          name: 'notify',
          component: ()=>import('@/views/system/notice/inform/index.vue'),
          meta: {
            title: '通知公告',
            breadcrumb: false
          }
        },
        {
          path: '/rapid/data/:dsId(\\d+)',
          name: 'rapid',
          component: ()=>import('@/views/rapid/gen/index.vue'),
          meta: {
            title: '数据源关联数据',
            breadcrumb: true
          }
        },
      ]
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: ()=>import('@/views/forbidden/index.vue'),
    }
  ]
})

router.beforeEach(async (to,form,next)=>{
  const permisstionStore = usePermisstionStroe()
  const authStore = useAuthStore()
  NProgress.start()
  if(!getToken()) {
    if(to.path === '/login' || to.path === '/forbidden') {
      next()
      NProgress.done()
    }else {
      next({path: '/login'})
    }
  }else {
    if(to.path === '/login') {
      next('/')
      NProgress.done()
    }else {
      permisstionStore.setIsLoadRoutes(true)
      if(permisstionStore.isLoadRoutes && permisstionStore.asyncRouters.length==0){
        await permisstionStore.setAsyncRouters()
        await authStore.setUserInfo()
        next({...to, replace: true})
      } else {
        next()
      }
    }

  }


})

router.afterEach(()=>{
  NProgress.done()
})

export default router
