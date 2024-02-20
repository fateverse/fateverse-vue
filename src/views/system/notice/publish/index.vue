<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="queryInstance">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="公告类型" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="请选择公告类型" clearable filterable>
          <el-option label="通知" value="1"/>
          <el-option label="公告" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="内容类型" prop="contentType">
        <el-select v-model="queryParams.contentType" placeholder="请选择内容类型" clearable filterable>
          <el-option label="富文本" value="html"/>
          <el-option label="文本" value="text"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发送类型" prop="sendType">
        <el-select v-model="queryParams.sendType" placeholder="请输入发送类型" filterable clearable>
          <el-option
              v-for="item in sendTypeOption"
              :key="item.value"
              :label="item.name"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button type="primary" @click="handleReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-header-btn">
      <el-button type="primary" @click="handleAdd" :icon="Plus">新增</el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="noticeId"
          :lazy="true"
          v-loading="loading"
          v-tabh
      >
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="noticeTitle" label="公告标题" align="center"/>
        <el-table-column prop="noticeType" label="公告类型" align="center">
          <template #default="scope">
            <tag dict-type="notice_type"  :value="scope.row.noticeType"/>
          </template>
        </el-table-column>
        <el-table-column prop="contentType" label="内容类型" align="center">
          <template #default="scope">
            <tag dict-type="content_type"  :value="scope.row.contentType"/>
          </template>
        </el-table-column>
        <el-table-column prop="sendType" label="发送类型" align="center">
          <template #default="scope">
            {{ getSendTypeOptionItem(scope.row.sendType) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini"  @click="handleViewDetails(scope.row)" link>详情
            </el-button>
            <popover-delete  :name="scope.row.noticeTitle" :type="'公告'"
                            @delete="handleDelete(scope.row.noticeId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <!--新增弹窗-->
    <el-dialog v-model="isVisited" title="新增公告" width="800px">
      <el-form :model="form" ref="formInstance" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="11">
            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" placeholder="请输入公告标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="公告类型" prop="noticeType">
              <el-radio-group v-model="form.noticeType" size="mini">
                <el-radio v-for="notice in cacheStore.getDict('notice_type')" :key="notice.value"
                          :label="notice.value">
                  {{ notice.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发送类型" prop="sendType">
              <el-select v-model="form.sendType" placeholder="发送类型" filterable clearable
                         @change="handleChangeSendType($event)" style="width: 268px">
                <el-option
                    v-for="item in sendTypeOption"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2" v-if="form.sendType!=='all'">
            <el-form-item label="发送对象" prop="senderIds">
              <el-tree-select
                  v-if="form.sendType==='dept'"
                  ref="treeSelect"
                  v-model="form.senderIds"
                  placeholder="请选择发送对象"
                  :data="deptList"
                  :props="deptProps"
                  value-key="value"
                  check-strictly
                  :render-after-expand="false"
                  style="width: 268px"
                  filterable clearable multiple
              />
              <el-select v-else v-model="form.senderIds" placeholder="请选择发送对象"
                         filterable clearable multiple style="width: 268px">
                <el-option
                    v-for="item in senderIdsOption"
                    :key="form.sendType==='role'?item.value:item.userId"
                    :label="form.sendType==='role'?item.label:item.userName"
                    :value="form.sendType==='role'?item.value:item.userId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="内容类型" prop="contentType">
              <el-radio-group v-model="form.contentType" size="mini">
                <el-radio label="html">富文本</el-radio>
                <el-radio label="text">文本</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item v-if="form.contentType=='text'" label="公告内容" prop="noticeContent">
              <el-input v-model="form.noticeContent" placeholder="请输入公告内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.contentType=='html'" label="公告内容" prop="noticeContent">
              <Tinymce image-url="/notice/file" file-url="/notice/file" v-model:value="form.noticeContent"/>
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

    <!--详情弹窗-->
    <el-dialog v-model="isViewVisited" title="公告详情" width="1200px">
      <el-form :model="viewForm" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="公告标题 :" prop="noticeTitle">
              <el-text>{{ viewForm.noticeTitle }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送类型 :" prop="sendType">
              <el-text>{{ getSendTypeOptionItem(viewForm.sendType) }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发送对象 :" prop="senders">
              <div v-for="sender in viewForm.senders">
                <el-text>{{ sender }}</el-text>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公告类型 :" prop="noticeType">
              <tag dict-type="notice_type"  :value="viewForm.noticeType"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="内容类型 :" prop="contentType">
              <tag dict-type="content_type"  :value="viewForm.contentType"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="公告内容 :" prop="noticeContent">
              <el-text v-if="viewForm.contentType == 'text'">{{ viewForm.noticeContent }}</el-text>
              <span v-else v-html="viewForm.noticeContent"></span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import {Search, Refresh, Plus, View, Delete} from "@element-plus/icons-vue";
import {useCacheStore} from '@/stores/cache.js'
import {ElMessage, ElMessageBox} from "element-plus";
import {addNotice, deleteNotice, getNoticeList, getNoticeDetail} from "@/api/notice/notice";
import {getRoleOption} from "@/api/role/role";
import {getDeptOption} from "@/api/dept/dept";
import Tinymce from "@/components/Tinymce.vue";
import {getUserList} from "@/api/user/user";
import Paging from "@/components/pagination/index.vue";

const queryParams = reactive({
  noticeTitle: '',
  noticeType: '',
  contentType: '',
  sendType: '',
  state: ''
})
const queryInstance = ref()
const cacheStore = useCacheStore()
const loading = ref(true)
const sendTypeOption = ref([
  {
    name: '用户',
    value: 'user'
  },
  {
    name: '角色',
    value: 'role'
  },
  {
    name: '部门',
    value: 'dept'
  },
  {
    name: '全发',
    value: 'all'
  }
])
const senderIdsOption = ref([])
const deptList = ref([]);
const deptProps = reactive({
  value: "value",
  label: "label"
});
const list = ref([])
const isVisited = ref(false);
const isViewVisited = ref(false);
const viewForm = ref();
const form = ref();
const content = ref();
const formInstance = ref();
const total = ref([]);
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
});
const rules = reactive({
  noticeTitle: [{required: true, message: '请输入公告标题', trigger: 'blur'}],
  // noticeContent: [{required: true, message: '请输入公告内容', trigger: 'blur'}],
  contentType: [{required: true, message: '请输入内容类型', trigger: 'blur'}],
  noticeType: [{required: true, message: '请选择公告类型', trigger: 'blur'}],
  sendType: [{required: true, message: '请选择发送类型', trigger: 'blur'}],
  senderIds: [{required: true, message: '请选择发送对象', trigger: 'blur'}],
})

const handleChangeSendType = (e) => {
  if (e === 'user') {
    getUser()
  } else if (e === 'role') {
    getRole()
  } else if (e === 'dept') {
    getDepartmentOption()
  } else if (e === 'all') {

  }
}
//获取用户list
const getUser = async () => {
  getUserList().then(res => {
    if (res.code === 1000) {
      senderIdsOption.value = res.data.rows;
    }
  });
};
//获取角色option
const getRole = async () => {
  getRoleOption().then(res => {
    if (res.code === 1000) {
      senderIdsOption.value = res.data;
    }
  });
};
//获取部门option
const getDepartmentOption = async () => {
  getDeptOption().then(res => {
    if (res.code === 1000) {
      deptList.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
const getSendTypeOptionItem = (sendType) => {
  for (let item of sendTypeOption.value) {
    if (item.value === sendType) {
      return item.name;
    }
  }
  return "";
};

//重置搜索
const handleReset = () => {
  queryInstance.value.resetFields()
  getList()
}
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  };
  loading.value = true
  getNoticeList(params).then(res => {
    if (res.code === 1000) {
      list.value = res.data.rows;
      total.value = res.data.total;
      loading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//查看公告详情
const handleViewDetails = async (row) => {
  getNoticeDetail(row.noticeId).then(res => {
    isViewVisited.value = true
    viewForm.value = res.data
  })
}

//删除
const handleDelete = async (noticeId) => {
  // ElMessageBox.confirm(`确认删除名称为${row.noticeTitle}的公告吗?`, '系统提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // }).then(() => {
    deleteNotice(noticeId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg)
        getList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  // })
}
const restForm = () => {
  form.value = {
    action: 'SEND',
    noticeTitle: null,
    noticeContent: null,
    noticeType: "1",
    sendType: null,
    contentType: 'html',
    state: "1",
    senderIds: [],
    cluster: 'notice'
  };
};
//新增公告
const handleAdd = () => {
  restForm();
  isVisited.value = true;
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate()
  })
};

//取消
const handleCancel = () => {
  restForm();
  isVisited.value = false;
};
//提交
const handleSubmit = async (formInstance) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) return;
    if(form.value.sendType==='all'){
      form.value.senderIds=['0']
    }
    addNotice(form.value).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        getList();
        isVisited.value = false;
      } else {
        ElMessage.error(res.msg);
      }
    });
  })
}

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

<style>
.tox-tinymce-aux {
  z-index: 5000 !important;
}
</style>
