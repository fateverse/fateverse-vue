<template>
  <div>
    <el-form :model="queryParams" class="query-form" inline ref="queryInstance">
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="queryParams.postName" placeholder="请输入岗位名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="queryParams.postCode" placeholder="请输入岗位编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="岗位状态" clearable filterable>
          <el-option
              v-for="item in cacheStore.getDict('normal_disable')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList" :icon="Search">搜索</el-button>
        <el-button type="primary" @click="handleReset(queryInstance)" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-header-btn">
      <el-button type="primary" @click="handleAdd" :icon="Plus">新增</el-button>
      <!--      <el-button type="info" @click="handleExpand" :icon="Sort">{{ isExpand ? '全部收起' : '全部展开' }}</el-button>-->
    </div>
    <div class="table">
      <el-table
          :data="list"
          row-key="postId"
          :lazy="true"
          v-loading="loading"
      >
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="postName" label="岗位名称"/>
        <el-table-column prop="postCode" label="岗位编码"/>
        <el-table-column prop="postSort" label="排序" width="60px"/>
        <el-table-column prop="state" label="状态">
          <template #default="scope">
            <tag dict-type="normal_disable" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.postId)" link>修改</el-button>
            <el-button type="primary" size="mini"  @click="handleAssignedUser(scope.row)" link>分配用户
            </el-button>
            <popover-delete v-if="scope.row.parentId!==0" :name="scope.row.postName" :type="'岗位'"
                            @delete="handleDelete(scope.row.postId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
    <el-dialog v-model="isVisited" :title="title" width="600px">
      <el-form :model="form" ref="formInstance" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="岗位名称" prop="postName">
              <el-input v-model="form.postName" placeholder="请输入岗位名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="岗位编码" prop="postCode">
              <el-input v-model="form.postCode" placeholder="请输入岗位编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="显示顺序" prop="postSort">
              <el-input-number v-model="form.postSort"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state" size="mini">
                <el-radio v-for="post in cacheStore.getDict('normal_disable')" :key="post.value"
                          :label="post.value">
                  {{ post.label }}
                </el-radio>
              </el-radio-group>
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
import {useCacheStore} from '@/stores/cache.js'
import {Search, Refresh, Plus} from "@element-plus/icons-vue";
import {getPostList, addPost, deletePost, editPost, getPostDetail} from "@/api/post/post";
import Tag from '@/components/Tag.vue'
import {ElMessage, ElMessageBox} from "element-plus";
import Paging from "@/components/pagination/index.vue";
import {useRouter} from "vue-router";
const router = useRouter()
const cacheStore = useCacheStore()
const queryInstance = ref()
const queryParams = reactive({
  postName: '',
  postCode: '',
  state: ''
})
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1
})
const total = ref()
const isVisited = ref(false);
const loading = ref(true)
const list = ref([])
const title = ref();
const form = ref();
const formInstance = ref();
const rules = reactive({
  postName: [
    {required: true, message: '请输入岗位名称', trigger: 'blur'},
  ],
  postCode: [
    {required: true, message: '请输入岗位编码', trigger: 'blur'},
  ],
  // postSort: [
  //   {required: true, message: '请选择显示顺序', trigger: 'blur'},
  // ]
})
const getList = async () => {
  loading.value = true
  getPostList({
    ...queryParams,
    ...pageInfo
  }).then(res => {
    res.data.rows = res.data.rows.sort((a, b) => {
      return a.postSort - b.postSort
    })
    total.value = res.data.total;
    list.value = res.data.rows
    loading.value = false
  })
}
const handleReset = (instance) => {
  if (!instance) return
  instance.resetFields()
  getList()
}
const restForm = () => {
  form.value = {
    postName: null,
    postCode: null,
    postSort: 0,
    state: '1'
  };
};
//添加功能
const handleAdd = () => {
  restForm();
  getList()
  title.value = "新增岗位";
  isVisited.value = true;
};
//修改功能
const handleEdit = (postId) => {
  restForm();
  //查看详情
  getPostDetail(postId).then(res => {
    if (res.code === 1000) {
      console.log('岗位详情', res.data)
      form.value = res.data
      title.value = "修改岗位";
      isVisited.value = true;
    }
  })
};
//分配用户
const handleAssignedUser = (row) => {
  //路由跳转，携带参数
  router.push('/post-auth/user/' + row.postId+'/'+ row.postName)
}
//删除功能
const handleDelete = (postId) => {
  // ElMessageBox.confirm(`确认删除名称为${row.postName}的数据吗?`, "系统提示", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning"
  // }).then(() => {
    deletePost(postId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        getList();
      } else {
        ElMessage.error(res.msg);
      }
    });
  // });
};

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
//取消操作
const handleCancel = () => {
  restForm();
  isVisited.value = false;
};

const handleSubmit = async (formInstance) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) return;
    if (title.value == "新增岗位") {
      addPost(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      editPost(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  })
}
getList()
</script>

<style lang="scss" scoped>

</style>
