<template>
  <el-config-provider :locale="locale">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :background="isBackground"
      :small="small"
      :disabled="disabled"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const emit = defineEmits(['goPage', 'changeSize','handleTop'])
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  pageSizes: {
    type: Object,
    default(rawProps) {
      return [10, 15, 20, 30, 50]
    },
  },
  small: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isBackground: {
    type: Boolean,
    default: false,
  },
})
//中文
const locale = zhCn
//总条数
const total = ref(0)
//对应页数
const currentPage = ref(1)
//每页多少条
const pageSize = ref(10)
//默认每页多少条的数组
const pageSizes = ref([])
//是否使用小型分页样式
const small = ref(false)
//是否禁用分页
const disabled = ref(false)
//分页大小
const handleSizeChange = limit => {
  emit('changeSize', limit)
  emit('handleTop')
}
//分页切换
const handleCurrentChange = page => {
  emit('goPage', page)
  emit('handleTop')
}
watchEffect(() => {
  total.value = props.total
  pageSizes.value = props.pageSizes
})
</script>
