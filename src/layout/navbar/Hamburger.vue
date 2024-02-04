<template>
  <div class="toggle" @click="toggleClick">
    <component :is="siderbarStore.getSiderBarStatus() ? 'Fold' : 'Expand'" class="icon"></component>
  </div>
</template>

<script setup>
import {useSiderBar} from '@/stores/siderbar.js'
const siderbarStore = useSiderBar()
const toggleClick = () => {
  siderbarStore.setSiderBarStatus()
}
</script>

<style lang="scss" scoped>
.toggle{
  line-height: 65px;
  padding: 0 15px;
  cursor: pointer;
  &:hover {
    background-color: #79bbff;
  }
}
.icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  transform: translateY(-2px);
}
</style>