<template>
  <el-radio-group v-model="localVal" v-bind="$attrs" @change="change">
    <el-radio v-for="item in options" :label="item.value" :key="item.value">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: []
  },
  modelValue: {
    type: [Number, String],
    default: ''
  }
})

const emits = defineEmits(['change', 'update: modelValue'])

const localVal = ref()

watchEffect(()=>{
  localVal.value = props.modelValue
})

const change = (val) => {
  emits('change', val),
  emits('update: modelValue', val)
}
</script>

<style lang="scss" scoped>

</style>