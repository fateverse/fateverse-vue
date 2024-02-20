<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="queryForm">
      <el-form-item label="正则名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输正则名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="正则内容" prop="regular">
        <el-input v-model="queryParams.regular" placeholder="请输正则内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="验证内容" prop="validation">
        <el-input v-model="queryParams.validation" placeholder="请输验证内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="enable">
        <el-select v-model="queryParams.enable" placeholder="请选择是否启用" clearable  filterable>
          <el-option
              v-for="dict in cacheStore.getDict('regular_enable')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="query-btn">
      <el-button type="primary" v-perm="['rapid:regular:add']" @click="handleAdd" :icon="Plus" plain>新增</el-button>
      <el-button type="warning" v-perm="['rapid:regular:export']" @click="handleExport" :icon="Download" plain>导出
      </el-button>
      <el-button type="danger" v-perm="['rapid:regular:del']" @click="handleMoreDelete(regularId,regularNameList)" :icon="Delete" plain
                 :disabled="disabled">删除
      </el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="id"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="name" label="正则名称" align="center"/>
        <el-table-column prop="regular" label="正则内容" align="center"/>
        <el-table-column prop="enable" label="是否启用" align="center">
          <template #default="scope">
            <tag dict-type="regular_enable" :value="scope.row.enable"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column prop="updateTime" label="更新时间" align="center"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" v-perm="['rapid:regular:edit']"
                       @click="handleEdit(scope.row.id)"  link>编辑
            </el-button>
            <popover-delete :name="scope.row.name" :type="'正则校验'" :perm="['rapid:regular:del']"
                            @delete="handleDelete(scope.row.id)"/>
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
            <el-form-item label="正则名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入正则名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="正则内容" prop="regular">
              <el-input v-model="form.regular" placeholder="请输入正则内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="验证内容" prop="validation">
              <el-input v-model="form.validation" placeholder="请输入验证内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="是否启用" prop="enable">
              <el-select v-model="form.enable" placeholder="请选择是否启用" clearable  filterable>
                <el-option
                    v-for="dict in cacheStore.getDict('regular_enable')"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                />
              </el-select>
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
import {getRegularList, getRegularDetails, addRegular, editRegular, delRegular} from "@/api/rapid/regular";
import {Search, Refresh, Delete, Plus, Edit, Download} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {useCacheStore} from '@/stores/cache.js'
import Paging from "@/components/pagination/index.vue";

const cacheStore = useCacheStore()
cacheStore.setCacheKey(['regular_enable'])
import {downLoadExcel} from "@/utils/downloadZip";
import Tag from '@/components/Tag.vue'
//查询参数
const queryParams = reactive({
  name: '',
  regular: '',
  validation: '',
  enable: undefined,
})
//页面信息
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
})
const disabled = ref(true)
const list = ref([])
const queryForm = ref([])
const regularId = ref([])
const regularNameList = ref([])
const loading = ref(true)
const total = ref()
const singleTable = ref()
const title = ref('')
const isVisited = ref(false)
const form = ref()
const formInstance = ref()
const formRules = ref({
  name: [
    {required: true, message: "正则名称不能为空", trigger: "blur"},
  ],
  regular: [
    {required: true, message: "正则内容不能为空", trigger: "blur"},
  ],
  validation: [
    {required: true, message: "验证内容不能为空", trigger: "blur"},
  ],
  enable: [
    {required: true, message: "是否启用 1:启动 2:关闭不能为空", trigger: "change"},
  ],
})
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
  getRegularList(params).then(res => {
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
    name: null,
    regular: null,
    validation: null,
    enable: null,
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
    if (title.value === '新增校验规则表') {
      addRegular(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      editRegular(form.value).then(res => {
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
  title.value = "新增校验规则表"
  isVisited.value = true
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
}
//修改
const handleEdit = async (id) => {
  restFrom()
  getRegularDetails(id).then(res => {
    if (res.code === 1000) {
      form.value = res.data
      title.value = "编辑校验规则表"
      isVisited.value = true
    } else {
      ElMessage.error(res.msg)
    }
  })
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
}
//导出excel
const handleExport = () => {
  downLoadExcel('/code-gen/rapid/regular/export', {...queryParams})
}

//勾选table数据行的 Checkbox
const handleSelect = async (selection, row) => {
  if (selection.length !== 0) {
    disabled.value = false
    regularId.value = selection.map(item => item.id).join()
    regularNameList.value = selection.map(item => item.name).join()
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
const handleMoreDelete=(regularId,regularNameList)=>{
  ElMessageBox.confirm(`确认删除名称为${regularNameList}的校验规则表吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDelete(regularId)
  })
}
//删除
const handleDelete = async (id) => {
    delRegular(id).then(res => {
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
