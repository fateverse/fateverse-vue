<template>
  <div class="tag-style">
    <el-tag v-if="tagConfig.isType" :type="tagConfig.listClass" :effect="tagConfig.theme || 'plain'">
      {{ filterDict(cacheStore.getDict(dictType), value) }}
    </el-tag>
    <el-tag v-else :color="tagConfig.listClass" :effect="tagConfig.theme || 'plain'"
            :class="{'null-tag':filterDict(cacheStore.getDict(dictType), value)===undefined}">
      {{ filterDict(cacheStore.getDict(dictType), value) }}
    </el-tag>
  </div>
</template>

<script setup>
import {useCacheStore} from "@/stores/cache.js";
import {defineProps, nextTick} from "vue";

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
  if (!data) return
  if (data instanceof Array) {
    if (value == true || value == false) {
      tagConfig.value = data.find(item => item.value == value.toString())
    } else if (typeof value === "object") {
      if (value !== null) {
        tagConfig.value = data.find(item => item.value == value[0])
      } else {
        tagConfig.value = {}
      }
    } else {
      tagConfig.value = data.find(item => item.value == value)
    }
  }
  return tagConfig.value.label
}
</script>

<style scoped lang="scss">
.tag-style {
  :deep(.el-tag.el-tag--dark) {
    border-color: transparent !important;
  }

  .null-tag {
    border-color: transparent;
    background-color: transparent;
  }
}
</style>
