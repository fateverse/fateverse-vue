<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="sourceForm" @submit.prevent="getList">
      <el-form-item label="数据源名称" prop="dsName">
        <el-input v-model="queryParams.dsName" placeholder="请输入数据源名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" @click="handleAdd" :icon="Plus" plain>新增</el-button>
      <el-button type="warning" @click="handleExport" :icon="Download" plain>导出</el-button>
      <el-button type="danger" @click="handleMoreDelete(sourceId,sourceNameList)" :icon="Delete" plain
                 :disabled="disabled">删除
      </el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="dsId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" type="index" width="60" align="center"/>
        <el-table-column prop="dsName" label="数据源名称" align="center"/>
        <el-table-column prop="dbName" label="数据库名称" align="center"/>
        <el-table-column prop="username" label="用户名称" align="center"/>
        <el-table-column prop="jdbcUrl" label="数据库连接url" align="center" width="140"/>
        <el-table-column prop="confType" label="数据源配置类型" align="center">
          <template #default="scope">
            <tag dict-type="data_source_config" :value="scope.row.confType"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.dsId)"  link>编辑</el-button>
            <popover-delete :name="scope.row.dsName" :type="'数据源信息'"
                            @delete="handleDelete(scope.row.dsId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <el-dialog v-model="isVisited" :title="title" width="900px">
      <el-form :model="form" ref="formInstance" :rules="formRules" class="dialog-form">
        <el-row>
          <el-col :span="11">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择数据源类型" filterable @change="handleTypeChange(form.type)">
                <el-option
                    v-for="typeItem in typeList"
                    :key="typeItem.value"
                    :label="typeItem.label"
                    :value="typeItem.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="数据源名称" prop="dsName">
              <el-input v-model="form.dsName" placeholder="请输入数据源名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="配置类型" prop="confType">
              <el-radio-group v-model="form.confType">
                <el-radio border :label="1">主机</el-radio>
                <el-radio border :label="2">JDBC</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2" v-if="form.confType === 1">
            <el-form-item label="端口" prop="port">
              <el-input-number v-model="form.port"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="11" v-if="form.confType === 1">
            <el-form-item label="主机" prop="host">
              <el-input v-model="form.host" placeholder="请输入主机"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2" v-if="form.confType === 1">
            <el-form-item label="数据库名称" prop="dbName">
              <el-input v-model="form.dbName" placeholder="请输入数据库名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.confType === 2">
            <el-form-item label="连接地址" prop="jdbcUrl">
              <el-input v-model="form.jdbcUrl"
                        :rows="4"
                        type="textarea" placeholder="请输入连接地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.confType === 1">
            <el-form-item label="配置参数" prop="args">
              <el-input v-model="form.args" :rows="4"
                        type="textarea" placeholder="请输入配置参数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务名称" prop="params.serviceName" v-if="form.type === 'ORACLE' && form.confType===1">
              <el-input v-model="form.params.serviceName" placeholder="请输入服务名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="命名空间" prop="params.namespace" v-if="form.type === 'POSTGRES' && form.confType===1">
              <el-input v-model="form.params.namespace" placeholder="请输入命名空间"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formInstance)">确定</el-button>
      </span>
      </template>

    </el-dialog>
  </div>
</template>

<script setup>
import {
  getDataSourceList,
  deleteDataSource,
  getDataSource,
  addDataSource,
  editDataSource,
  getDataSourceOptionType
} from "@/api/rapid/data-source";
import {Search, Refresh, Delete, Plus, Edit, Download} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {nextTick} from 'vue'
import Paging from "@/components/pagination/index.vue";

const queryParams = reactive({
  dsName: '',
})

const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
})

const disabled = ref(true)
const typeList = ref([])
const list = ref([])
const sourceForm = ref([])
const loading = ref(true)
const total = ref()
const title = ref('')
const isVisited = ref(false)
const sourceId = ref();
const sourceNameList = ref();
const singleTable = ref();
const form = ref()
const formInstance = ref()
const formRules = ref({
  type: [{required: true, message: '请输选择数据库类型', trigger: 'blur'}],
  dsName: [{required: true, message: '请输入数据源名称', trigger: 'blur'}],
  username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'}],
  confType: [{required: true, message: '请输选择配置类型', trigger: 'blur'}],
  port: [{required: true, message: '请输入服务端口', trigger: 'blur'}],
  host: [{required: true, message: '请输入主机', trigger: 'blur'}],
  dbName: [{required: true, message: '请输入数据库名称', trigger: 'blur'}],
  jdbcUrl: [{required: true, message: '请输入连接地址', trigger: 'blur'}],
  params: {
    serviceName: [{required: true, message: '请输入服务名称', trigger: 'blur'}],
    namespace: [{required: true, message: '请输入命名空间', trigger: 'blur'}]
  }
})

const handleReset = () => {
  sourceForm.value.resetFields()
  getList()
}
const getTypeOption = () => {
  getDataSourceOptionType().then(res => {
    typeList.value = res.data
  })
}
const handleTypeChange = (type) => {
  if (form.value.confType !== 1) {
    return;
  }
  if (type === 'ORACLE') {
    form.value.params = {
      serviceName: ''
    }
  }
  if (type === 'POSTGRES') {
    form.value.params = {
      namespace: ''
    }
  }
}


const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  loading.value = true
  getDataSourceList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const restFrom = () => {
  form.value = {
    remark: null,
    dsId: null,
    dsName: "",
    username: "",
    password: "",
    host: "",
    port: 0,
    type: "",
    dbName: "",
    jdbcUrl: null,
    confType: 1,
    args: null,
    params: null
  }
  getTypeOption()
}

const handleCancel = () => {
  restFrom()
  isVisited.value = false
}
const handleSubmit = async (instance) => {
  if (!instance) return
  instance.validate(async (valid, fields) => {
    if (!valid) return
    if (title.value === '新增数据源') {
      console.log('form.value', form.value)
      addDataSource(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      editDataSource(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const handleAdd = () => {
  formRules.value.password[0].required = true
  restFrom()
  title.value = "新增数据源"
  isVisited.value = true
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate()
  })
}

const handleEdit = async (dsId) => {
  restFrom()
  getDataSource(dsId).then(res => {
    if (res.code === 1000) {
      formRules.value.password[0].required = false
      form.value = res.data
      title.value = "编辑数据源"
      isVisited.value = true
      nextTick(() => {
        // 清空校验
        formInstance.value.clearValidate()
      })
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleExport = () => {

}

//勾选table数据行的 Checkbox
const handleSelect = async (selection) => {
  if (selection.length !== 0) {
    disabled.value = false
    sourceId.value = selection.map(item => item.dsId).join()
    sourceNameList.value = selection.map(item => item.dsName).join()
  } else {
    disabled.value = true
  }
}

//切换每页显示条数
const handleSizeChange = async (val) => {
  pageInfo.value.pageSize = val
  await getList()
}

//点击页码进行分页功能
const handleCurrentChange = async (val) => {
  pageInfo.value.pageNum = val
  await getList()
}
const handleMoreDelete = (dsId, sourceNameList) => {
  ElMessageBox.confirm(`确认删除名称为${sourceNameList}的数据源信息吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDelete(dsId)
  })
}
const handleDelete = async (dsId) => {
  deleteDataSource(dsId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
getList()
</script>

<style scoped>

</style>
