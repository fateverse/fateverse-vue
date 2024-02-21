<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="queryForm">
      <el-form-item label="参数名称" prop="configName">
        <el-input v-model="queryParams.configName" placeholder="请输参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input v-model="queryParams.configKey" placeholder="请输参数键名"></el-input>
      </el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <el-select v-model="queryParams.configType" placeholder="请选择系统内置" clearable filterable>
          <el-option
              v-for="dict in cacheStore.getDict('yes_no')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch()" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" v-perm="['admin:config:add']" @click="handleAdd" :icon="Plus" plain>新增</el-button>
      <el-button type="danger" v-perm="['admin:config:del']" @click="handleMoreDelete(configIds,configNameList)"
                 :icon="Delete" plain
                 :disabled="disabled">删除
      </el-button>
      <el-button type="warning" v-perm="['admin:config:export']" @click="handleExport" :icon="Download" plain>导出
      </el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="configId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" type="index" width="60"/>
        <el-table-column prop="configName" label="参数名称" align="center"/>
        <el-table-column prop="configKey" label="参数键名" align="center"/>
        <el-table-column prop="configValue" label="参数键值" align="center"/>
        <el-table-column prop="configType" label="系统内置" align="center">
          <template #default="scope">
            <tag dict-type="yes_no" :value="scope.row.configType"/>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" v-perm="['admin:config:edit']"
                       @click="handleEdit(scope.row.configId)" link>编辑
            </el-button>
            <popover-delete :name="scope.row.dsName" :type="'参数配置表'" :perm="['admin:config:del']"
                            @delete="handleDelete(scope.row.configId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>

    <el-dialog v-model="isVisited" :title="title" width="900px">
      <el-form :model="form" ref="formInstance" :rules="formRules" label-width="100px" class="dialog-form">
        <el-row>
          <el-col :span="11">
            <el-form-item label="参数名称" prop="configName">
              <el-input v-model="form.configName" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="参数键名" prop="configKey">
              <el-input v-model="form.configKey" placeholder="请输入参数键名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="参数键值" prop="configValue">
              <el-input v-model="form.configValue" placeholder="请输入参数值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="系统内置" prop="configType">
              <el-select v-model="form.configType" placeholder="请选择系统内置" clearable filterable>
                <el-option
                    v-for="dict in cacheStore.getDict('yes_no')"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输备注"></el-input>
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
import {getConfigList, getConfigDetails, addConfig, editConfig, delConfig} from "@/api/system/config";
import {Search, Refresh, Delete, Plus, Edit, Download} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {useCacheStore} from '@/stores/cache.js'
import Paging from "@/components/pagination/index.vue";

const cacheStore = useCacheStore()
import Tag from '@/components/Tag.vue'
import {downLoadExcel} from "@/utils/downloadZip";
//查询参数
const queryParams = reactive({
  configName: '',
  configKey: '',
  configType: undefined,
})
//页面信息
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
})
const disabled = ref(true)
const list = ref([])
const queryForm = ref([])
const configIds = ref([])
const configNameList = ref([])
const loading = ref(true)
const total = ref()
const title = ref('')
const isVisited = ref(false)
const form = ref()
const formInstance = ref()
const formRules = ref({
  configName: [
    {required: true, message: "参数名称不能为空", trigger: "blur"},
  ],
  configKey: [
    {required: true, message: "参数键名不能为空", trigger: "blur"},
  ],
  configValue: [
    {required: true, message: "参数键值不能为空", trigger: "blur"},
  ],
  configType: [
    {required: true, message: "系统内置不能为空", trigger: "change"},
  ],
})
//搜索功能
const handleSearch = () => {
  getList()
}
//重置搜索
const handleReset = () => {
  queryForm.value.resetFields()
  getList()
}
//获取数据
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  loading.value = true
  getConfigList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    } else {
      ElMessage.error(res.msg)
    }
  })
}
//重置from表单
const restFrom = () => {
  form.value = {
    configName: null,
    configKey: null,
    configValue: null,
    configType: null,
    remark: null
  }
}
//取消
const handleCancel = () => {
  restFrom()
  isVisited.value = false
}
//提交
const handleSubmit = async (instance) => {
  if (!instance) return
  instance.validate(async (valid) => {
    if (!valid) return
    if (title.value === '新增参数配置表') {
      addConfig(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      editConfig(form.value).then(res => {
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
//添加
const handleAdd = async () => {
  restFrom()
  title.value = "新增参数配置表"
  isVisited.value = true
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate()
  })
}
//修改
const handleEdit = async (configId) => {
  restFrom()
  getConfigDetails(configId).then(res => {
    if (res.code === 1000) {
      form.value = res.data
      title.value = "编辑参数配置表"
      isVisited.value = true
    } else {
      ElMessage.error(res.msg)
    }
  })
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate()
  })
}
//导出excel
const handleExport = () => {
  downLoadExcel('/admin/config/export', {...queryParams})
}

//勾选table数据行的 Checkbox
const handleSelect = async (selection) => {
  if (selection.length !== 0) {
    disabled.value = false
    configIds.value = selection.map(item => item.configId).join()
    configNameList.value = selection.map(item => item.configName).join()
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
const handleMoreDelete = (configId, configName) => {
  ElMessageBox.confirm(`确认删除名称为${configName}的参数配置表吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDelete(configId)
  })
}
//删除
const handleDelete = async (configId) => {
  delConfig(configId).then(res => {
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
