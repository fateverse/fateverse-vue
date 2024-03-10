<template>
  <el-select v-model="localVal" v-bind="$attrs" @change="change">
    <el-option 
      v-for="item in options" 
      :label="item.label" 
      :value="item.value" 
      :key="item.value" 
      :disabled="item.disabled || false"
    />
  </el-select>
</template>

<script setup>

const props = defineProps({
  options: {
    type: Array,
    default: []
  },
  modelValue: {
    type: [String, Number, Array],
    default: undefined
  }
})

const emits = defineEmits(['change', 'update:modelValue'])

const localVal = ref()

watchEffect(()=>{
  localVal.value = props.modelValue
})

const change = (val) => {
  let value
  emits('update:modelValue', val)
  if(val instanceof Array) {
    value = val.map(item=>props.options.find(v=>item == v.value))
  } else {
    value = props.options.find(v=>v.value == val)
  }
  emits('change', value)
}

</script>

<style lang="scss" scoped>

</style>