<template>
  <el-tag v-if="tagConfig.isType" :type="tagConfig.listClass" :effect="tagConfig.theme || 'plain'">
    {{ filterDict(cacheStore.getDict(dictType), value) }}
  </el-tag>
  <el-tag v-else :color="tagConfig.listClass" :effect="tagConfig.theme || 'plain'">
    {{ filterDict(cacheStore.getDict(dictType), value) }}
  </el-tag>
</template>

<script setup>
import { useCacheStore } from "@/stores/cache.js";
import { defineProps, nextTick } from "vue";
const cacheStore = useCacheStore();

const props = defineProps({
  dictType: {
    type: String,
    default: "",
    required: true
  },
  value: {
    type: String || Number,
    default: null
  }
});

const tagConfig = ref({})

const filterDict = (data, value) => {
  if(!data) return
  if(data instanceof Array) {
    if(value==true||value==false){
      tagConfig.value = data.find(item=>item.value == value.toString())
    }else {
      tagConfig.value = data.find(item => item.value == value)
    }
  }
  return tagConfig.value.label
}
</script>
