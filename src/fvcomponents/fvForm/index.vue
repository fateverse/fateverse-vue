<template>
  <el-form
    :model="form"
    v-bind="$attrs"
    label-width="auto"
    ref="formInstance"
  >
    <el-row>
      <el-col
        v-for="item in filterSchma"
        v-bind="item.colProps || { span: 12}"
        :key="item.prop"
      >
        <el-form-item 
          v-bind="item"
          :key="item.prop"
        >
          <template #default>
            <component 
              v-if="item.component"
              :is="item.component"
              v-bind="item.props || {}"
              v-on="item.on || {}"
              v-model="form[item.prop]"
            >
            </component>
            <span v-else>
              {{ form[item.prop] || '--' }}
            </span>
          </template>
          <template #label>
            <slot :name="item?.slots?.label" v-bind="{item, form}">
              {{ item?.label || '' }}
            </slot>
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="jsx">
import { ElMessage } from 'element-plus';



const props = defineProps({
  schema: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['getInstance'])

const form = ref({})
const formInstance = ref(null)

const filterSchma = computed(()=>{
  return props.schema.filter(item=>{
    if(item.prop) return true
  })
})

console.log(filterSchma.value, 'filterSchma');

const validate = async () => {
  let validObj = {}
  await formInstance.value.validate((valid, fields)=>{
    validObj.isValidate = valid
    validObj.fields = fields
  })
  return validObj
}

const getValues = () => {
  return form.value
}

const setValues = (data) => {
  try {
    if(data instanceof Object) {
      form.value = {...data}
    }
  } catch (error) {
    ElMessage.warning('传入参数格式有误')
  }
}

const resetFields = () => {
  formInstance.value.resetFields()
}

onMounted(()=>{
  emits('getInstance',Object.assign({}, unref(formInstance), {
    getValues,
    validate,
    setValues,
    resetFields
  }))
})

defineExpose({ getValues, setValues, validate, resetFields, formInstance, form })

</script>

<style lang="scss" scoped>

</style>