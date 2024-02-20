<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="genForm">
      <el-form-item label="数据源" prop="dataSourceId">
        <el-select v-model="queryParams.dataSourceId" placeholder="数据源" clearable filterable>
          <el-option
              v-for="item in dataSourceOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="表名称" prop="tableName">
        <el-input v-model="queryParams.tableName" placeholder="请输入表名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="表备注" prop="tableComment">
        <el-input v-model="queryParams.tableComment" placeholder="请输入表备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="dateValue">
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
      <el-button type="primary" plain :icon="UploadFilled"  @click="handleImport()">导入</el-button>
      <el-button type="warning" @click="handleExport" :icon="Download" plain :disabled="disabled">导出</el-button>
      <el-button type="danger" :icon="Delete"
                 @click="handleMoreDelete(tableId,tableName)" :disabled="disabled" plain>删除
      </el-button>
    </div>

    <div class="table">
      <el-table
          :data="list"
          :lazy="true"
          v-loading="loading"
          @select="handleSelect"
          v-tabh
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="tableName" label="表名称" align="center"/>
        <el-table-column prop="tableComment" label="表描述" align="center"/>
        <el-table-column prop="className" label="实体类" align="center"/>
        <el-table-column prop="dataSourceId" label="数据源" align="center">
          <template #default="scope">
            <el-tag>{{ getDataSourceOptionItem(scope.row.dataSourceId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable align="center"/>
        <el-table-column prop="updateTime" label="更新时间" sortable align="center"/>
        <el-table-column label="操作" width="260" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handlePreview(scope.row.tableId)" link>预览</el-button>
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.tableId)" link>编辑</el-button>
            <el-button type="primary" size="mini"
                       @click="handleSynchronization(scope.row.tableId)" link>同步
            </el-button>
            <el-button type="primary" size="mini" @click="handleDownLoad(scope.row.tableId)" link>下载
            </el-button>
            <popover-delete :name="scope.row.tableName" :type="'表'"
                            @delete="handleDeleteTable(scope.row.tableId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <import-table ref="importTableRef" :data-source-option="dataSourceOption" @importSuccess="getList"/>

    <el-dialog v-model="preview.isVisited" title="预览代码" width="1500px">
      <el-tabs v-model="preview.activeName" class="demo-tabs">
        <el-tab-pane
            v-for="(value,key) in preview.code"
            :label="key" :name="key">
          <el-link :underline="false" :icon="CopyDocument" @click="clipboardSuccess(value)"
                   style="float:right">复制
          </el-link>
          <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script setup>
import {getTableList, deleteTable, deleteMoreTable, previewCode} from "@/api/rapid/code-gen";
import {getDataSourceOption} from '@/api/rapid/data-source'
import {downLoadZip} from "@/utils/downloadZip";
import {Search, Refresh, Delete, Edit, View, Download, CopyDocument, UploadFilled} from '@element-plus/icons-vue'
import Paging from "@/components/pagination/index.vue";
import ImportTable from './importTable.vue'
import java from 'highlight.js/lib/languages/java'
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import sql from 'highlight.js/lib/languages/sql'
import hljs from "highlight.js/lib/highlight";
import "highlight.js/styles/github-gist.css";
import {ElMessage, ElMessageBox} from "element-plus";
import useClipboard from "vue-clipboard3"
import {syncDatabase} from "@/api/rapid/code-gen";

hljs.registerLanguage("java", java);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("vue", javascript);
hljs.registerLanguage("ts", javascript);
hljs.registerLanguage("tsx", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("sql", sql);

const router = useRouter()
const dsId = reactive(router.currentRoute.value.params.dsId)
const queryParams = reactive({
  dataSourceId: null,
  dataSourceType: '',
  tableName: '',
  tableComment: '',
  startTime: '',
  endTime: ''
})
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
})
const disabled = ref(true)
const tableId = ref()
const tableName = ref()
const list = ref([])
const loading = ref(true)
const total = ref()
const dateValue = ref()
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
const dataSourceOption = ref()
const code = ref()
const genForm = ref()
const preview = ref({
  code: null,
  isVisited: false,
  activeName: null
})
const importTableRef = ref(null)
const title = ref('')
const {toClipboard} = useClipboard()
onMounted(()=>{
  if(dsId){
    queryParams.dataSourceId = parseInt(dsId)
    getList()
  }
})
const clipboardSuccess = (value) => {
  try {
    toClipboard(value)
    ElMessage.success("复制成功")
  } catch (e) {
    ElMessage.error("复制失败")
  }
}
const getOption = () => {
  getDataSourceOption().then(res => {
    if (res.code === 1000) {
      dataSourceOption.value = res.data
      getList();
    }
  })
}

const getDataSourceOptionItem = (dataSourceId) => {
  for (let item of dataSourceOption.value) {
    if (item.value === dataSourceId) {
      return item.label;
    }
  }
  return "";
}
/** 下载代码 */
const handleDownLoad = async (tableId) => {
  downLoadZip(`/code-gen/table/downloads/${[tableId]}`)
}
const handleEdit = (tableId) => {
  router.push({
    path: `/rapid/gen/edit/${tableId}`,
  })

}
//同步
const handleSynchronization = async (tableId) => {
  syncDatabase(tableId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
/** 高亮显示 */
const highlightedCode = (code, key) => {
  let language = key.split(".")[1];
  const result = hljs.highlight(language, code || "", true);
  // console.log(result.value)
  return result.value;
}

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
  getTableList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    }
  })
}

//重置功能
const handleReset = () => {
  genForm.value.resetFields()
  dateValue.value = []
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
//勾选table数据行的 Checkbox
const handleSelect = async (selection) => {
  if (selection.length !== 0) {
    disabled.value = false
    tableId.value = selection.map(item => item.tableId).join()
    tableName.value = selection.map(item => item.tableName).join()
  } else {
    disabled.value = true
  }
}
const handleDeleteTable = (tableId) => {
  deleteTable(tableId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
//多删
const handleMoreDelete = (tableId, tableName) => {
  ElMessageBox.confirm(`确认删除名称为${tableName}的表格吗?`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMoreTable({
      tables: tableId
    }).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg)
        getList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}
//预览功能
const handlePreview = async (tableId) => {
  previewCode(tableId).then(res => {
    if (res.code === 1000) {
      let code = res.data;
      preview.value = {
        isVisited: true,
        activeName: Object.keys(code)[0],
        code: code
      }
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const handleImport = async () => {
  title.value = "导入数据源"
  nextTick(() => {
    importTableRef.value.show()
  })
}


getOption();
</script>
