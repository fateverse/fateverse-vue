<template>
  <el-radio-group v-model="localVal" v-bind="$attrs" @change="change">
    <el-radio v-for="item in localOptions" :label="item.value" :key="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup>
import { useCacheStore } from "@/stores/cache.js";
const cacheStore = useCacheStore();
const props = defineProps({
  options: {
    type: Array,
    default: []
  },
  modelValue: {
    type: [Number, String],
    default: ''
  },
  cacheKey: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['change', 'update: modelValue'])

const localVal = ref()

const localOptions = ref([])

watchEffect(()=>{
  localVal.value = props.modelValue
  props.cacheKey ? 
  localOptions.value = cacheStore.getDict(props.cacheKey) :
  localOptions.value = props.options
})

const change = (val) => {
  emits('change', val),
  emits('update: modelValue', val)
}
</script>

<style lang="scss" scoped>

</style>