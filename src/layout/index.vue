<template>
  <el-container>
    <el-aside 
    :class="siderbarStore.isCollapse ? 'collapse' : 'expand'"
    >
      <SiderBar></SiderBar>
    </el-aside>
    <el-main :class="siderbarStore.isCollapse ? 'main-collapse' : ''">
      <NavBar></NavBar>
      <TagsView></TagsView>
      <AppMain></AppMain>
    </el-main>
  </el-container>
</template>

<script setup>
import SiderBar from './siderbar/index.vue'
import NavBar from './navbar/index.vue'
import TagsView from './tagsview/index.vue'
import AppMain from './appmain/AppMain.vue';
import { useSiderBar } from '../stores/siderbar';
const siderbarStore = useSiderBar()
</script>

<style lang="scss" scoped>
.expand {
  animation: Expand 0.15s ease forwards;
}
@keyframes Expand {
  from {
    width: 64px;
  }
  
  to {
    width: 200px;
  }
}
.collapse {
  animation: Collapse 0.15s ease forwards;
}
@keyframes Collapse {
  from {
    width: 200px;
  }

  to {
    width: 64px;
  }
}
</style>