<template>
  <el-dialog v-model="isVisited" title="导入表" width="1000px">
    <el-form :model="queryParams" inline class="login-log-form" ref="dataSourceFrom">
      <el-form-item label="数据源" prop="businessType">
        <el-select v-model="queryParams.dataSourceId" placeholder="数据源" clearable filterable>
          <el-option
              v-for="item in dataSourceOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表名称" prop="title">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="表备注" prop="title">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="dateValue">
        <el-config-provider>
          <el-date-picker
              v-model="queryParams"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
          />
        </el-config-provider>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchTableSearch()" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
          :data="list"
          row-key="operId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
      >
        <el-table-column type="selection" width="80"/>
        <el-table-column prop="tableName" label="表名称" align="center"/>
        <el-table-column prop="tableComment" label="表描述"  align="center"/>
        <el-table-column prop="createTime" label="创建时间" sortable align="center"/>
        <el-table-column prop="updateTime" label="更新时间" sortable align="center"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleImport(scope.row)"  link>导入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
  </el-dialog>
</template>

<script setup>
import {getDynamicTable, importTable} from "@/api/rapid/code-gen";
import {Search, Refresh, View} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {defineExpose, defineProps} from "vue";
import Paging from "@/components/pagination/index.vue";

const emit = defineEmits(['importSuccess'])

const queryParams = reactive({
  dataSourceId: null,
  tableName: '',
  tableComment: '',
  startTime: '',
  endTime: ''
})

const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
})
const list = ref([])
const dataSourceIds = ref()
const loading = ref(true)
const total = ref(0)
const isVisited = ref(false)

const props = defineProps({
  dataSourceOption: {
    type: Array,
    default: []
  }
})

const searchTableSearch = async () => {
  let params = {
    ...queryParams,
    pageNum: pageInfo.pageNum,
    pageSize: pageInfo.pageSize
  }
  loading.value = true
  getDynamicTable(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    }else {
      ElMessage.error(res.msg)
    }
  })
}


const handleImportTable = async (data) => {
  importTable(data).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      isVisited.value = false
      emit("importSuccess")
    }else {
      ElMessage.error(res.msg)
    }
  })
}

const handleImport = (item) => {
  let data = {
    dataSourceId: queryParams.dataSourceId,
    tables: [item.tableName]
  }
  handleImportTable(data)
}


//勾选table数据行的 Checkbox
const handleSelect = async (selection, row) => {
  if (selection.length !== 0) {
    disabled.value = false
    if (selection.length > 1) {
      const del_row = selection.shift();
      dataSourceIds.value.toggleRowSelection(del_row, false);
    }
  }
}

//重置功能
const handleReset = () => {
  queryParams.dataSourceId = props.dataSourceOption[0].value
  queryParams.tableName = ''
  queryParams.tableComment = ''
  queryParams.startTime = ''
  queryParams.endTime = ''
  searchTableSearch()
}
//切换每页显示条数
const handleSizeChange = async (val) => {
  pageInfo.pageSize = val
  await searchTableSearch()
}

//点击页码进行分页功能
const handleCurrentChange = async (val) => {
  pageInfo.pageNum = val
  await searchTableSearch()
}

const show = () => {
  isVisited.value = true
  queryParams.dataSourceId = props.dataSourceOption[0].value
  searchTableSearch()
}

defineExpose({
  show
})
</script>
