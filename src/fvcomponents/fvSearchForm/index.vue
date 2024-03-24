<template>
  <el-form
    :model="form"
    v-bind="$attrs"
    label-width="auto"
    ref="formInstance"
    class="search-form"
  >
    <el-row>
      <el-col
        v-for="(item, index) in filterConfig"
        :span="5"
        :offset="index == 0 || index / 4 ==1 ? 0 : 1"
        :key="item.prop"
      >
        <el-form-item 
          v-bind="item"
          :key="item.prop"
        >
          <template #default>
            <component 
              :is="item.component"
              v-bind="item.props || {}"
              v-on="item.on || {}"
              v-model="form[item.prop]"
            >
            </component>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="filterConfig.length % 4 == 0 ? 4 : 6" class="btn-col">
        <el-form-item>
          <el-button v-if="searchConfig.length>=4" link type="primary" @click="showMore = !showMore">
            {{ showMore ? '收起' : '展开' }}
          </el-button>
          <el-button type="primary" @click="getValues" :icon="Search">搜索</el-button>
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import {Refresh, Search} from '@element-plus/icons-vue'

const props = defineProps({
  searchConfig: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['getInstance', 'search'])

const form = ref({})
const formInstance = ref(null)

const showMore = ref(false)

const filterConfig = computed(()=>{
  const arr = props.searchConfig.filter(item=>{
    if(item.prop) return true
  })
  return arr.length >= 4 && showMore.value ? arr : arr.slice(0, 3)
})

console.log(filterConfig.value, 'filterConfig');

// 搜索功能表单元素默认值
const setDefaultFormValues = () => {
  filterConfig.value.forEach(item=>{
    form.value[item.prop] = item.props.defaultValue || null
  })
}

watchEffect(()=>{
  if(filterConfig.value.length) {
    setDefaultFormValues()
  }
})

const getValues = () => {
  emits('search', form.value)
  return form.value
}

//重置
const handleReset = () => {
  form.value = {}
  setDefaultFormValues()
  emits('search', form.value)
}

onMounted(()=>{
  emits('getInstance', Object.assign({}, unref(formInstance),{
    getValues,
    handleReset,
  }))
})

</script>

<style lang="scss" scoped>
.search-form {
  padding-top: 18px;
}
.btn-col {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>