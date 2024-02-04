<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
      <span v-if="item.meta.noRedirect || index === breadcrumbList.length-1" class="no-redirect">
        {{ item.meta.title }}
      </span>
      <router-link v-else :to="item.redirect || item.path">
        {{ item.meta.title }}
      </router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

watch(route, ()=> {
  getBreadcrumb()
})

//面包屑导航数据
const breadcrumbList = ref([])

//获取面包屑导航数据
const getBreadcrumb = () => {
  let matched = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  if(!isDashboard(first)) {
    matched = [{path: '/home', meta: {title: '首页'}}].concat(matched)
  }
  breadcrumbList.value.length = 0;
  const reBreadcrumbList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
  breadcrumbList.value.push(...reBreadcrumbList)
}

const isDashboard = (meta) => {
  const name = meta && meta.name
  if(!name) {
    return
  }
  return name.trim().toLocaleLowerCase() === 'Home'.toLocaleLowerCase()
}

getBreadcrumb()
</script>
