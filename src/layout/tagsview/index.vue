<template>
  <div class="link-box">
    <el-scrollbar noresize>
      <div>
        <router-link
            v-for="item in tagsViewStore.visitedViews"
            :key="item.path" :to="{ path: item.path }" class="tag"
            :class="isActive(item) ? 'active' : ''"
            @click.prevent
            @contextmenu.prevent.native="openMenu(item, $event)">
          <span>{{ item.meta.title }}</span>
          <span @click.prevent="closeTagView(item.path)">
            <svg-icon name="close" :class-name="'close-icon'"/>
          </span>
        </router-link>
      </div>
    </el-scrollbar>
    <ul class="contextmenu" :style="{ 'left': left + 'px' }" v-if="visible">
      <li class="el-dropdown-menu__item" @click="closeCurrentTagView">关闭当前</li>
      <li class="el-dropdown-menu__item" @click="closeOtherTagView">关闭其他</li>
    </ul>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {useTagsView} from '@/stores/tagsview.js'
import SvgIcon from '@/components/svgIcon/index.vue'

const route = useRoute()
const tagsViewStore = useTagsView()
const visible = ref(false)
const left = ref()
const tagPath = ref()

watch(route, () => {
  init()
})
onMounted(() => {
  document.addEventListener('click', nullBlockClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', nullBlockClick)
})
const nullBlockClick = () => {
  visible.value = false
}
const init = () => {
  tagsViewStore.addVisitedViews(route)
}
const closeTagView = (path) => {
  tagsViewStore.delVisitedViews(path)
}
const isActive = (tag) => {
  return tag.path === route.path
}
const openMenu = (tag, e) => {
  tagPath.value = tag
  left.value = e.x - 230
  visible.value = true
}
// 关闭当前
const closeCurrentTagView = () => {
  tagsViewStore.delVisitedViews(tagPath.value.path)
  visible.value = false
}
// 关闭其他
const closeOtherTagView = () => {
  tagsViewStore.delOtherVisitedViews(tagPath.value)
  visible.value = false
}
init()
</script>

<style lang="scss" scoped>
.link-box {
  position: relative;
  padding: 12px 0;
  line-height: 30px;

  .tag {
    padding: 6px;
    border: 1px solid darkgray;
    font-size: 13px;
    margin-right: 8px;
    border-radius: 4px;
    background-color: #fff;
  }

  .active {
    background-color: #E9F4FF;
    border: 1px solid #418DFF;
    color: #333333;

    > span:first-child {
      color: #418DFF;
    }

  }

  .contextmenu {
    padding: 5px;
    width: 88px;
    //height: 82px;
    position: absolute;
    top: 47px;
    z-index: 3000;
    background: #fff;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      margin: 0;
      padding: 7px 10px;
      cursor: pointer;

      &:hover {
        background: #eee;
        color: #EDC49A;
      }
    }
  }
}
</style>
