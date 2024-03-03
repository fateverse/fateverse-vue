<template>
  <!-- 有子菜单 -->
  <template v-for="item in menuItem" :key="item.path">
    <el-sub-menu v-if="item?.children?.length>0 && !item.hidden" :index="item.path">
      <template #title>
        <svg-icon :name="item.icon"/>
        <span>{{ item.title }}</span>
      </template>
      <Item :menu-item="item.children"></Item>
    </el-sub-menu>
    <el-menu-item v-else-if="!item.hidden&&!item.meta.isFrame" :index="handleGo(item.path)">
      <template #title>
        <div v-if="item.path==='/tool/swagger'">
          <a class="port-link" :href="link" target="_blank">
            <svg-icon :name="item.icon"/>
            {{ item.title }}
          </a>
        </div>
        <div v-else>
          <svg-icon :name="item.icon"/>
          <span>{{ item.title }}</span>
        </div>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup>
import SvgIcon from '@/components/svgIcon/index.vue'
import Item from './MenuItem.vue'

const props = defineProps({
  menuItem: {
    type: Array,
    required: true
  }
})
const link = ref('http://gateway.feashow.cn/doc.html#/home')
const handleGo = (path) => {
  if (path === "/tool/swagger") {
    return ''
  } else {
    return path
  }
}

</script>

