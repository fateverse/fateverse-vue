<template>
  <el-checkbox-group v-model="localVal" v-bind="$attrs" @change="change">
    <el-checkbox 
      v-for="item in options"
      :label="item.label"
      :value="item.value"
      :key="item.value"
      :disabled="item.disabled || false"
    />
  </el-checkbox-group>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: []
  },
  modelValue: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['change', 'update:modelValue'])

const localVal = ref([])

watchEffect(()=>{
  localVal.value = props.modelValue
})

const change = (val) => {
  emits('update:modelValue', val)
  emits('change', val)
}
</script>

<style lang="scss" scoped>

</style>