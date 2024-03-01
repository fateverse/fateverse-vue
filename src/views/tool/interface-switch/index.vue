<template>
  <div>
    <el-form :model="queryParams" class="query-form" inline ref="form">
      <el-form-item label="应用名称" prop="applicationName">
        <el-input
            v-model="queryParams.applicationName"
            placeholder="请输入应用名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="类名" prop="className">
        <el-input
            v-model="queryParams.className"
            placeholder="请输入类名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="方法名" prop="methodName">
        <el-input
            v-model="queryParams.methodName"
            placeholder="请输入方法名"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
          :data="list"
          ref="table"
          :lazy="true"
          v-loading="loading"
          v-tabh
      >
<!--        <el-table-column label="序号" type="index" width="60" align="center"/>-->
        <el-table-column prop="applicationName" label="应用名称" align="center"/>
        <el-table-column prop="className" label="类名" align="center" width="180" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tooltip placement="top" :show-after="20">
              <template #content><span style="font-size: 14px">{{scope.row.className}}</span></template>
              <div>{{ formatterClassName(scope.row.className) }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="methodName" label="方法名" align="center" width="90px"/>
        <el-table-column prop="type" label="类型" align="center" width="100px">
          <template #default="scope">
            <tag dict-type="interface_type" :value="scope.row.type"/>
          </template>
        </el-table-column>
        <el-table-column prop="uris" label="uris" align="center" width="200px" :formatter="formatterUris" :show-overflow-tooltip="true"/>
        <el-table-column prop="httpMethods" label="方法类型" align="center" width="100px">
          <!-- <template #default="scope">
            <tag dict-type="http_method" :value="arrayToString(scope.row.httpMethods)"/>
          </template> -->
        </el-table-column>
        <el-table-column prop="operName" label="操作人" align="center"/>
        <el-table-column prop="operTime" label="变更时间" align="center"/>
        <el-table-column prop="description" label="描述" align="center"/>
        <el-table-column prop="state" label="状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.state" @change="handleEdit(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
  </div>
</template>

<script setup>
import {Refresh, Search} from '@element-plus/icons-vue'
import Paging from "@/components/pagination/index.vue";
import {editMappingSwitch, getMappingList} from "@/api/system/mapping-switch";
import {ElMessage, ElMessageBox} from "element-plus";

const router = useRouter()
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
})
const queryParams = reactive({
  applicationName: "",
  className: "",
  methodName: ""
});
const tree = ref()
const table = ref()
const total = ref()
const loading = ref(true);
const form = ref();
const list = ref([]);
const formatterClassName = (val) => {
  return val.substring(val.lastIndexOf(".")+1)
}
const formatterUris = (val) => {
  return val.uris.map(item => item).join(',')
}

const arrayToString = (arr) => {
  if(Array.isArray(arr)) return arr.join(',')
  return arr
}
const getList =  () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  loading.value = true
  getMappingList(params).then(res => {
    // console.log('res',res)
    if (res.code === 1000) {
      loading.value = false
      list.value = res.data.rows
      total.value = res.data.total
    }
  })
};

const handleEdit = (row) => {
  ElMessageBox.confirm(`确认要修改方法名为'${row.methodName}'接口状态吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
  editMappingSwitch({
    key:row.key,
    state:row.state
  }).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      getList();
    } else {
      ElMessage.error(res.msg);
    }
  });
  });
}
//重置功能
const handleReset = () => {
  form.value.resetFields()
  getList()
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

getList();
</script>

<style lang="scss" scoped>
.dialog-tree {
  border: 1px solid #ad8383;
  height: 300px;
  overflow: auto;
}
.dialog-tree::-webkit-scrollbar {
  width: 6px;
}

// 滚动条轨道
.dialog-tree::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

// 小滑块
.dialog-tree::-webkit-scrollbar-thumb {
  background: rgba(80, 81, 82, 0.29);
  border-radius: 10px;
}
.el-input-number {
  width: 100%;
}

.el-tree-select {
  :deep(.el-select) {
    width: 100%;
  }
}
</style>
