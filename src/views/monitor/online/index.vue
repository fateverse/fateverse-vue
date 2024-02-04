<template>
  <div>
<!--    <el-form :model="queryParams" inline class="query-form" ref="form">-->
<!--      <el-form-item label="登录地址" prop="place">-->
<!--        <el-input v-model="queryParams.place" placeholder="请输入登录地点" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="用户名称" prop="username">-->
<!--        <el-input v-model="queryParams.username" placeholder="请输入用户名称" clearable></el-input>-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>-->
<!--        <el-button @click="handleReset" :icon="Refresh">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
<!--    <div class="query-btn">-->
<!--      <el-button type="danger" @click="handleDelete" :icon="Delete" plain :disabled="disabled">删除</el-button>-->
<!--    </div>-->
    <div class="table">
      <el-table
          :data="list"
          row-key="tokenId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
      >
<!--        <el-table-column type="selection" width="55" align="center"/>-->
<!--        <el-table-column prop="tokenId" label="会话id" align="center"/>-->
        <el-table-column prop="username" label="用户名" align="center"/>
        <el-table-column prop="deptName" label="部门名称"  align="center"/>
        <el-table-column prop="ipAddr" label="登录ip" align="center"/>
        <el-table-column prop="loginLocation" label="登录地点" align="center"/>
        <el-table-column prop="browser" label="浏览器类型" align="center"/>
        <el-table-column prop="os" label="操作系统" align="center"/>
        <el-table-column prop="loginTime" label="登录时间" sortable align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleForcedOffline(scope.row)"  style="color: red" link>强制下线</el-button>
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
import {deleteOnlineUser, getOnlineList} from "@/api/online/online";
import Paging from "@/components/pagination/index.vue";

const queryParams = reactive({
  place: '',
  username: ''
})
const list = ref([])
const form = ref()
const total = ref()
const loading = ref(true)
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1
})
// const tokenId = ref()
const singleTable = ref(null)
const disabled = ref(true)
//获取所有登录日志
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  loading.value = true
  getOnlineList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    }
  })
}
//重置功能
const handleReset = () => {
  form.value.resetFields()
  getList()
}
//勾选table数据行的 Checkbox, 单选功能
// const handleSelect = async (selection, row) => {
//   if (selection.length !== 0) {
//     disabled.value = false
//     tokenId.value = row.tokenId
//     if (selection.length > 1) {
//       const del_row = selection.shift();
//       singleTable.value.toggleRowSelection(del_row, false);
//     }
//   } else {
//     disabled.value = true
//   }
// }
//强制下线
const handleForcedOffline = async (row) => {
  ElMessageBox.confirm(`是否确认强制下线用户名为${row.username}的用户吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteOnlineUser(row.tokenId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg)
        getList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
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

<style lang="scss" scoped>

</style>
