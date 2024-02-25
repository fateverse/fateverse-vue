<template>
  <el-form inline :model="queryParams" class="query-form" ref="queryInstance">
    <el-form-item prop="ipAddr" label="IP地址">
      <el-input v-model="queryParams.ipAddr" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item prop="type" label="IP类型">
      <el-input v-model="queryParams.type" placeholder="请输入" clearable></el-input>
    </el-form-item>
    <el-form-item prop="dateValue" label="时间">
      <el-date-picker
          v-model="dateValue"
          type="datetimerange"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间"
          clearable
          value-format="YYYY-MM-DD HH:mm:ss"
          @change="changDate"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>

  <div class="table">
    <div class="table-header-btn">
      <el-button type="primary" :icon="Plus" @click="handleAdd" plain>新增</el-button>
      <el-button type="warning" @click="handleExport" :icon="Download" plain>导出</el-button>
    </div>
    <el-table :data="list" ref="" :lazy="true" v-loading="loading" v-tabh>
      <el-table-column prop="ipAddr" label="IP地址"></el-table-column>
      <el-table-column prop="type" label="IP类型"></el-table-column>
      <el-table-column prop="createTime" label="生成时间"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">修改</el-button>
          <el-button type="danger" link @click="handleDel(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <paging :current-page="queryParams.pageNum" :page-size="queryParams.pageSize" :page-sizes="[10, 20, 30, 40,50]"
          :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>

  <el-dialog v-model="visible" :title="title" width="400">
    <el-form :model="form" ref="formInstance" :rules="rules">
      <el-form-item prop="ipAddr" label="IP地址">
        <el-input v-model="form.ipAddr" placeholder="请输入"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button type="primary" @click="handleSubmit(formInstance)">确认</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import {reactive, ref} from 'vue';
import {getIPBlackList, getIPBlackDetail, addIPBlack, editIPBlack, delIPBlack} from '@/api/ipblacklist';
import {downLoadExcel} from "@/utils/downloadZip";
import {ElMessage, ElMessageBox} from 'element-plus';
import {Plus, Download, Refresh, Search} from '@element-plus/icons-vue'
import Paging from "@/components/pagination/index.vue";

const queryParams = reactive({
  pageSize: 10,
  pageNum: 1,
  ipAddr: '',
  type: '',
  startTime: '',
  endTime: ''
})
const queryInstance = ref()
const dateValue = ref()
const loading = ref(false)
const list = ref([])
const total = ref()
const id = ref()
const form = ref({})
const formInstance = ref()
const rules = reactive({
  ipAddr: [{required: true, message: '请输入', trigger: 'change'}]
})
const visible = ref(false)
const title = ref('')

const changDate = () => {
  const date = dateValue.value;
  if (date !== undefined && date !== null) {
    queryParams.startTime = date[0];
    queryParams.endTime = date[1];
  }
}

const getList = async () => {
  loading.value = true
  const {data, code, msg} = await getIPBlackList(queryParams)
  if (code === 1000) {
    list.value = data.rows
    total.value = data.total
    loading.value = false
    return
  }
  ElMessage.error(msg)
  loading.value = false
}

const handleReset = () => {
  queryInstance.value.resetFields()
  dateValue.value = []
  queryParams.startTime = ''
  queryParams.endTime = ''
  getList()
}

const handleEdit = async (row) => {
  title.value = '修改'
  id.value = row.id
  const {data, code, msg} = await getIPBlackDetail(row.id)
  if (code === 1000) {
    form.value = data
    visible.value = true
    return
  }
  ElMessage.error(msg)
}

const handleAdd = () => {
  title.value = '新增'
  visible.value = true
  formInstance.value.resetFields()
}

const handleDel = (row) => {
  ElMessageBox.confirm('确认删除该条数据吗?', '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const {code, msg} = await delIPBlack(row.id)
    code === 1000 ? ElMessage.success(msg) : ElMessage.error(msg)
    getList()
  }).catch(() => {
  })
}

const handleSubmit = async (instance) => {
  if (!instance) return
  await instance.validate(async (valid, fields) => {
    if (!valid) return
    if (title.value === '新增') {
      const {code, msg} = await addIPBlack(form.value)
      code === 1000 ? ElMessage.success(msg) : ElMessage.error(msg)
    } else {
      form.value.id = id.value
      const {code, msg} = await editIPBlack(form.value)
      code === 1000 ? ElMessage.success(msg) : ElMessage.error(msg)
    }
    handleCancel()
    getList()
  })
}

const handleCancel = () => {
  visible.value = false
}

const handleExport = () => {
  downLoadExcel('/admin/ip/back/export', {...queryParams})
}

//切换每页显示条数
const handleSizeChange = (val) => {
  queryParams.pageSize = val
  getList()
}
//点击页码进行分页功能
const handleCurrentChange = (val) => {
  queryParams.pageNum = val
  getList()
}

getList()
</script>

<style lang="scss" scoped>

</style>
