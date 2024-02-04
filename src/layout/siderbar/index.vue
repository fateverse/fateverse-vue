<template>
  <div class="logo" ref="logo">
    <span v-if="!siderbarStore.isCollapse">FateVerse</span>
  </div>
  <el-scrollbar :height="`calc(100vh - ${logoHeight}px)`" style="background-color: #ffffff">
    <el-menu
        router
        :default-active="activeMenu"
        :unique-opened="true"
        :collapse="siderbarStore.isCollapse"
        active-text-color="#333"
        text-color="#333"
        style="border: none;"
        :collapse-transition="false"
    >
      <MenuItem :menu-item="permisstionStore.menuList"></MenuItem>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import MenuItem from './MenuItem.vue';
import {useRoute} from 'vue-router'
import {useSiderBar} from '@/stores/siderbar.js'
import {usePermisstionStroe} from '@/stores/permisstion.js'
import {nextTick} from 'vue';

const siderbarStore = useSiderBar()
const permisstionStore = usePermisstionStroe()
const route = useRoute()
const link = ref('')
const title = ref('')
const logo = ref(null)
const logoHeight = ref()
const getLogoH = () => {
  logoHeight.value = logo.value.offsetHeight
}
const activeMenu = computed(() => {
  const {path} = route
  return path
})

onMounted(() => {
  nextTick(() => {
    getLogoH()
  })
})

window.addEventListener('resize', () => {
  getLogoH()
})
</script>
