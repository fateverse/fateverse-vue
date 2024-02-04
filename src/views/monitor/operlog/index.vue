<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="logForm">
      <el-form-item label="操作名称" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入操作名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input v-model="queryParams.operName" placeholder="请输入操作人员" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select v-model="queryParams.businessType" placeholder="操作类型" clearable filterable>
          <el-option
              v-for="item in cacheStore.getDict('oper_type')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="操作状态" clearable filterable>
          <el-option
              v-for="item in [{label:'成功',value: '0'},{label:'失败',value: '1'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间" prop="dateValue">
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
                 @click="handleMoreDelete(operIds)" :disabled="disabled" plain>删除
      </el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="operId"
          :lazy="true"
          ref="singleTable"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="50"/>
        <el-table-column prop="operId" label="日志编号" align="center"/>
        <el-table-column prop="title" label="操作名称" align="center"/>
        <el-table-column prop="businessType" label="操作类型" width="100" align="center">
          <template #default="scope">
            <tag dict-type="oper_type" :value="scope.row.businessType"/>
          </template>
        </el-table-column>
        <el-table-column prop="operName" label="操作人员" align="center"/>
        <el-table-column prop="operIp" label="操作地址" align="center"/>
        <el-table-column prop="operLocation" label="操作地点" align="center"/>
        <el-table-column prop="state" label="操作状态" align="center">
          <template #default="scope">
            <tag dict-type="common_state" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column prop="operTime" label="操作日期" sortable align="center"/>
        <el-table-column prop="consumeTime" label="消耗时间" sortable align="center">
          <template #default="scope">
            {{ scope.row.consumeTime }}ms
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleViewDetails(scope.row.operId)"  link>详细</el-button>
            <popover-delete :name="scope.row.operId"  :type="'日志'"
                            @delete="handleDelete(scope.row.operId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <el-dialog v-model="isVisited" title="操作日志详细" width="1000px">
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统模块：" prop="title">
              <el-text>{{ form.title }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：" prop="operUrl">
              <el-text>{{ form.operUrl }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录信息：" prop="title">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item>{{ form.operName }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ form.operIp }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ form.operLocation }}</el-breadcrumb-item>
              </el-breadcrumb>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式：" prop="requestMethod">
              <el-text>{{ form.requestMethod }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：" prop="method">
              <el-text>{{ form.method }}</el-text>
            </el-form-item>
            <el-form-item label="请求参数：" prop="operParam">
              <json-viewer :value="form.operParam"
                           :expand-depth=5
                           copyable
                           boxed
                           sort></json-viewer>
            </el-form-item>
            <el-form-item label="返回参数：" prop="jsonResult" v-if="form.state ==0">
              <json-viewer :value="form.jsonResult"
                           :expand-depth=5
                           copyable
                           boxed
                           sort></json-viewer>
            </el-form-item>
            <el-form-item label="返回参数：" prop="errorMsg" v-else>
              <el-text>{{ form.errorMsg }}</el-text>
            </el-form-item>
            <el-form-item v-if="form.errorStackTrace" label="异常栈：" prop="errorMsg">
              <el-scrollbar height="450px">
                <div class="nowrap" v-html="form.errorStackTrace"></div>
              </el-scrollbar>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作状态：" prop="state">
              <tag dict-type="common_state" :value="form.state"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消耗时间：" prop="consumeTime">
              <el-text>{{ form.consumeTime }}ms</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间：" prop="operTime">
              <el-text>{{ form.operTime }}</el-text>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import JsonViewer from "vue-json-viewer"
import {Search, Refresh, Delete, View} from "@element-plus/icons-vue";
import {getOperateLog, deleteOperateLog, getOperateLogDetail} from "@/api/log/operation";
import {ElMessage, ElMessageBox} from "element-plus";
import {useCacheStore} from '@/stores/cache.js'
import Paging from "@/components/pagination/index.vue";

const cacheStore = useCacheStore()
cacheStore.setCacheKey(['oper_type'])
import Tag from '@/components/Tag.vue'

const queryParams = reactive({
  title: "",
  operName: "",
  businessType: "",
  state: "",
  startTime: "",
  endTime: ""
});
const form = ref();
const list = ref([]);
const logForm = ref();
const singleTable = ref(null);
const loading = ref(true);
const dateValue = ref();
const total = ref();
const operIds = ref([]);
const disabled = ref(true);
const isVisited = ref(false);
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1
});
const shortcuts = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "上月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "三月前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  };
  const date = dateValue.value;
  if (date !== undefined && date !== null) {
    params.startTime = date[0];
    params.endTime = date[1];
  }
  loading.value = true
  getOperateLog(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows;
      total.value = res.data.total;
      loading.value = false;
    }
  });
};

//重置功能
const handleReset = () => {
  dateValue.value = [];
  logForm.value.resetFields();
  getList();
};
//单选删除功能
const handleDelete = async (operId) => {
  deleteOperateLog(operId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      getList();
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//多删
const handleMoreDelete = (operIds) => {
  ElMessageBox.confirm(`确认删除名称为${operIds}的日志吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    handleDelete(operIds)
  })
}
//勾选table数据行的 Checkbox, 实现单/多选删除功能
const handleSelect = async (selection) => {
  if (selection.length !== 0) {
    disabled.value = false;
    operIds.value = selection.map(item => item.operId).join()
  } else {
    disabled.value = true;
  }
}
//查看详情
const handleViewDetails = async (operId) => {
  getOperateLogDetail(operId).then(res => {
    if (res.code === 1000) {
      isVisited.value = true;
      try {
        if (res.data.operParam !== null) {
          res.data.operParam = JSON.parse(res.data.operParam)
        }
      } catch (e) {
      }
      if (res.data.jsonResult !== null) {
        res.data.jsonResult = JSON.parse(res.data.jsonResult)
      }
      form.value = res.data
    }
  });
};

//切换每页显示条数
const handleSizeChange = (val) => {
  pageInfo.pageSize = val;
  getList();
};
//点击页码进行分页功能
const handleCurrentChange = (val) => {
  pageInfo.pageNum = val;
  getList();
};
getList();
</script>
