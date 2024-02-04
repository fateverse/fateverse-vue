<template>
  <div style="display: flex;justify-content: center">
    <span class="stateIcon" :style="{backgroundColor: filterDictClass(cacheStore.getDict(dictType), value)}"></span>
    <span>{{tag.label}}</span>
    <span> {{ filterDict(cacheStore.getDict(dictType), value) }}</span>
  </div>
</template>

<script setup>
import {defineProps} from "vue";
import {useCacheStore} from "@/stores/cache.js";

const cacheStore = useCacheStore();
const props = defineProps({
  dictType: {
    type: String,
    default: ""
  },
  value: {
    type: Object,
    default: null
  }
});
const tag = reactive({
  listClass: "green",
  isType: true,
  label: ""
});
// const dictList = cacheStore.getDict(props.dictType);
// const dictFormat =  () => {
//   if(dictList===undefined) return;
//   for (let i = 0; i < dictList.length; i++) {
//     if(dictList[i].value=== props.value){
//       tag.label = dictList[i].label;
//       tag.listClass=changeParams(dictList[i].listClass)
//       tag.isType = dictList[i].isType;
//     }
//   }
// };
const filterDictClass = (data, value) => {
  console.log(data,'data');
  if(!data) return

  if(data instanceof Array) {
    tag.value = data.find(item => item.value == value)
  }
  return changeParams(tag.value.listClass)
}
const filterDict = (data, value) => {
  console.log(data,'data');
  if(!data) return

  if(data instanceof Array) {
    tag.value = data.find(item => item.value == value)
  }
  return tag.value.label
}
/**
 * 根据接口返回的listClass切换成对应的颜色
 * @param listClass 后端返回的listClass字段
 * @returns {string}
 */
const changeParams = (listClass) => {
  switch (listClass) {
    case 'danger':
      return 'red'
    case 'success':
      return  '#67C23A'
    case 'info':
      return  '#909399'
    case 'primary':
      return '#409EFF'
    case 'warning':
      return  '#E6A23C'
    default:
      return listClass
  }
}
// dictFormat()
</script>

<style scoped lang="scss">
//.dot{
//  width:8px;
//  height: 20px;
//  margin-left: -5px;
//  background-color: green;
//  z-index: 99999;
//}
:deep(.el-tag){
  position: relative;
  margin-top: 9px;
  margin-right: 7px;
  height: 8px;

}
</style>
