<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="logForm">
      <el-form-item label="登录地址" prop="ipAddr">
        <el-input v-model="queryParams.ipAddr" placeholder="请输入登录地址" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="登录状态" clearable filterable>
          <el-option
              v-for="item in [{label:'成功',value: '0'},{label:'失败',value: '1'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间" prop="dateValue">
        <el-config-provider>
          <el-date-picker
              v-model="dateValue"
              type="datetimerange"
              :shortcuts="shortcuts"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-config-provider>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="danger" :icon="Delete"
                 @click="handleMoreDelete(infoId)" :disabled="disabled" plain>删除
      </el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="infoId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="infoId" label="访问编号" align="center"/>
        <el-table-column prop="userName" label="用户名称"  align="center"/>
        <el-table-column prop="ipddr" label="登录地址" align="center"/>
        <el-table-column prop="loginLocation" label="登录地点" align="center"/>
        <el-table-column prop="browser" label="浏览器" align="center"/>
        <el-table-column prop="os" label="操作系统" align="center"/>
        <el-table-column prop="state" label="登录状态" align="center">
          <template #default="scope">
            <tag dict-type="common_state"  :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作信息" align="center"/>
        <el-table-column prop="loginTime" label="登录日期" sortable align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <popover-delete :name="scope.row.userName" :type="'日志'"
                            @delete="handleDelete(scope.row.infoId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
  </div>
</template>

<script setup>
import {Search, Refresh, Delete} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {getLoginLogList, deleteLoginLog} from "@/api/log/login";
import Paging from "@/components/pagination/index.vue";

const dateValue = ref()
const queryParams = reactive({
  ipAddr: '',
  userName: '',
  state: '',
  startTime: '',
  endTime: ''
})
const list = ref([])
const logForm = ref()
const singleTable = ref(null)
const loading = ref(true)
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1
})
const total = ref()
const infoId = ref([])
const disabled = ref(true)
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三月前',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

//获取所有登录日志
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  const date = dateValue.value
  if (date !== undefined && date !== null) {
    params.startTime = date[0]
    params.endTime = date[1]
  }
  loading.value = true
  getLoginLogList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    }
  })
}

//重置功能
const handleReset = () => {
  dateValue.value = []
  logForm.value.resetFields()
  getList()
}

//删除功能
const handleDelete = async (infoId) => {
  deleteLoginLog(infoId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
//多删
const handleMoreDelete = (infoId) => {
  ElMessageBox.confirm(`确认删除名称为${infoId}的日志吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDelete(infoId)
  })
}
//勾选table数据行的 Checkbox, 多/单选删除功能
const handleSelect = async (selection) => {
  if (selection.length !== 0) {
    disabled.value = false
    infoId.value = selection.map(item => item.infoId).join()
  } else {
    disabled.value = true
  }
}
//切换每页显示条数
const handleSizeChange = (val) => {
  pageInfo.pageSize = val
  getList()
}
//点击页码进行分页功能
const handleCurrentChange = (val) => {
  pageInfo.pageNum = val
  getList()
}
getList()
</script>
