<template>
  <el-popconfirm
      confirm-button-text="确认"
      cancel-button-text="取消"
      icon="WarningFilled"
      icon-color="#E6A23C"
      :title="title"
      @confirm="handleDelete"
      @cancel="handleCancel"
  >
    <template #reference>
      <el-button :type="btnType" size="mini" v-perm="perm" :disabled="isDisabled" :icon="btnIcon" :plain="isPlain">{{btnText}}</el-button>
    </template>
  </el-popconfirm>
</template>

<script setup>
const props = defineProps({
  name: {
    type: Object,
    default: null
  },
  btnType: {
    type: String,
    default: 'text'
  },
  type: {
    type: String,
    default: ''
  },
  btnIcon: {
    type: String,
    default: ''
  },
  btnText: {
    type: String,
    default: '删除'
  },
  perm: {
    type: Array,
    default: ['']
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  isPlain: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits()
const title = ref(`确认${props.btnText}名称为 "${props.name}" 的${props.type}吗!`)
const visible = ref(false)
watch(()=>props.name,(newVal)=>{
  title.value="确认"+props.btnText+"名称为"+'"'+props.name+'"'+"的"+props.type+"吗!"
})
const handleCancel = () => {
  visible.value = false
}
const handleDelete = () => {
  emit("delete")
}
</script>

<style lang="scss">
.el-popconfirm__main {
  display: flex;
  word-break: break-all;
  align-items: center;
}
</style>
