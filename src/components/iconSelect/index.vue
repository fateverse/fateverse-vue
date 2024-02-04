<template>
  <el-select v-model="iconName" placeholder="请选择菜单图标" clearable filterable @change="selectIcon" :teleported="false"
              class="icon-select">
    <el-option
        v-for="item in iconList"
        :value="item"
        :label="item"
    >
      <svg-icon :name="item" :class-name="'middle-icon'"/>
      <span class="icon-name">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script setup>
import iconArray from './requireIcons.js'
import SvgIcon from '@/components/svgIcon/index.vue'
const emit = defineEmits(["getSelectIcon"])
const props = defineProps({
  activeIcon: {
    type: String,
    default: ''
  }
})
const iconName=ref(props.activeIcon)
const iconList = ref(iconArray)
watch(() => props.activeIcon, (value) => {
  iconName.value = value
})
const selectIcon = (val) => {
  emit("getSelectIcon", val)
}
</script>
