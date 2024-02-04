<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="queryInstance">
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="请选择状态" clearable filterable>
          <el-option label="未读" value="0"/>
          <el-option label="已读" value="1"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button type="primary" @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
          :data="list"
          row-key="noticeId"
          :lazy="true"
          v-loading="loading"
      >
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="noticeTitle" label="公告标题" align="center"/>
        <el-table-column prop="state" label="阅读状态" align="center">
          <template #default="scope">
            <tag dict-type="read_state" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini"  @click="handleViewDetails(scope.row.noticeId)" link>详情
            </el-button>
            <popover-delete :name="scope.row.noticeTitle" :type="'通知公告'"
                            @delete="handleDelete(scope.row.noticeId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <!--详情弹窗-->
    <el-dialog v-model="isViewVisited" title="通知公告详情" width="1200px" @close="handleCloseDialog">
      <el-form :model="viewForm" label-width="100px">
        <el-row>
          <el-col :span="24" class="title-block">
            <!--            <el-form-item label="公告标题 :" prop="noticeTitle">-->
            <el-text class="title">{{ viewForm.noticeTitle }}</el-text>
            <!--            </el-form-item>-->
          </el-col>
          <el-col :span="24">
            <!--            <el-form-item label="公告内容 :" prop="noticeContent">-->
            <el-text v-if="viewForm.contentType == 'text'">{{ viewForm.noticeContent }}</el-text>
            <span v-else v-html="viewForm.noticeContent"></span>
            <!--            </el-form-item>-->
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {ElMessage, ElMessageBox} from "element-plus";
import {getNotifyList, getNotifyDetail, deleteSingleNotify} from "@/api/notice/notify";
import {View, Delete, Search, Refresh} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
import Paging from "@/components/pagination/index.vue";

const queryParams = reactive({
  state: null
})
const router = useRouter()
const loading = ref(true)
const list = ref([])
const total = ref([]);
const isViewVisited = ref(false);
const viewForm = ref();
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
});

//重置搜索
const handleReset = () => {
  getList()
}
const getList = async () => {
  let params = {
    cluster: "notice",
    ...queryParams,
    ...pageInfo
  };
  loading.value = true
  getNotifyList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows;
      total.value = res.data.total;
      loading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//查看详情
const handleViewDetails = (noticeId) => {
  getNotifyDetail(noticeId).then(res => {
    // bellSocket.value.searchNotifyList()
    isViewVisited.value = true
    viewForm.value = res.data
  })
}
//关闭详情弹窗
const handleCloseDialog = () => {
  isViewVisited.value = false
}
//删除单个消息
const handleDelete = (noticeId) => {
  deleteSingleNotify(noticeId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
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
getList()
</script>
<style scoped lang="scss">
.title-block {
  text-align: center;
  padding-bottom: 30px;

  .title {
    font-size: 28px;
    font-weight: bold;
  }
}
</style>
<style>
.tox-tinymce-aux {
  z-index: 5000 !important;
}
</style>
