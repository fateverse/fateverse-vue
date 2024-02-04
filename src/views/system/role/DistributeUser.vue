<template>
  <el-form :model="queryParams" class="query-form" inline ref="userForm">
    <el-form-item label="当前角色" prop="userName">
      <el-tag >{{roleName}}</el-tag>
    </el-form-item>
    <el-form-item label="用户名称" prop="userName">
      <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户名称"
          clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="手机号码" prop="phoneNumber">
      <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入手机号码"
          clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchUser" :icon="Search">搜索</el-button>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="table-header-btn">
    <el-button type="primary" @click="handleAdd" :icon="Plus">添加用户</el-button>
    <el-button type="primary" @click="handleBack" :icon="RefreshLeft" plain>返回</el-button>
    <el-button type="danger" @click="handleCancelAll" :icon="CircleClose" plain>全部取消</el-button>
    <el-button type="danger" @click="handleMoreCancelAuthorization(cancelUserIds,userNames)" :icon="CircleClose" plain
               :disabled="moreCancelDisabled">批量取消
    </el-button>
    <el-button type="danger" @click="handleDeleteRole" :icon="Delete" plain v-if="showDeleteCurrent">删除当前角色</el-button>
  </div>
  <div class="table">
    <el-table
        :data="list"
        row-key="userId"
        :lazy="true"
        ref="table"
        v-loading="loading"
        @select="handleSelect"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="userName" label="用户名称" align="center"/>
      <el-table-column prop="nickName" label="用户昵称" align="center"/>
      <el-table-column prop="email" label="邮箱" align="center"/>
      <el-table-column prop="phoneNumber" label="手机号码" align="center"/>
      <el-table-column prop="state" label="状态" align="center">
        <template #default="scope">
          <tag dict-type="normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="180px"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <popover-delete :name="scope.row.userName" :type="'用户'" :btn-text="'取消授权'"
                          @delete="handleCancelAuthorization([scope.row.userId])"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
          :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
  <el-dialog v-model="isVisited" :title="title" width="830px">
    <el-form :model="query" class="query-form" inline ref="formInstance">
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="query.userName"
            placeholder="请输入用户名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input
            v-model="query.phoneNumber"
            placeholder="请输入手机号码"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getExcludeUser" :icon="Search">搜索</el-button>
        <el-button @click="handleDialogReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
          :data="userList"
          row-key="userId"
          :lazy="true"
          ref="dialogTable"
          v-loading="dialogLoading"
          @select="handleDialogSelect"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="userName" label="用户名称" align="center"/>
        <el-table-column prop="nickName" label="用户昵称" align="center"/>
        <el-table-column prop="email" label="邮箱" align="center"/>
        <el-table-column prop="phoneNumber" label="手机号码" align="center"/>
        <el-table-column prop="state" label="状态" align="center">
          <template #default="scope">
            <tag dict-type="normal_disable" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="180px"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini"
                       @click="handleSubmit(scope.row.userId)" link>添加
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="dialogTotal" @changeSize="handleSizeChangeDialog" @goPage="handleCurrentChangeDialog"/>

    <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit(userIds)" :disabled="dialogDisabled">批量添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {Plus, Search, Refresh, RefreshLeft, CircleClose, Delete} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {getUserByRoleId, cancelAuthorization, getUserExcludeRoleId, unbindAllUser, roleBindUser} from "@/api/user/user";
import {useRouter} from "vue-router";
import Tag from '@/components/Tag.vue'
import Paging from "@/components/pagination/index.vue";
import {useTagsView} from '@/stores/tagsview.js'
import {deleteRole} from "@/api/role/role";

const tagsViewStore = useTagsView()
const router = useRouter();
const roleId = reactive(router.currentRoute.value.params.roleId)
const roleName = reactive(router.currentRoute.value.params.roleName)
const userForm = ref();
const table = ref();
const title = ref('添加用户');
const dialogTable = ref();
const list = ref([]);
const userList = ref([]);
const total = ref([]);
const dialogTotal = ref([]);
const userIds = ref([]);
const userNames = ref([]);
const cancelUserIds = ref([]);
const moreCancelDisabled = ref(true);
const dialogDisabled = ref(true);
const loading = ref(true);
const dialogLoading = ref(true);
const showDeleteCurrent = ref(false);
const queryParams = reactive({
  userName: "",
  phoneNumber: ""
});
const query = reactive({
  userName: "",
  phoneNumber: ""
});
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
});
const formInstance = ref();
const isVisited = ref(false);
const form = ref();

//用户搜索重置
const handleReset = () => {
  userForm.value.resetFields();
  searchUser();
};
const handleDialogReset = () => {
  formInstance.value.resetFields();
  getExcludeUser();
};
//根据角色id获取用户信息
const searchUser = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  };
  loading.value = true
  getUserByRoleId(roleId, params).then(res => {
    if (res.code === 1000) {
      showDeleteCurrent.value = res.data.rows.length === 0;
      list.value = res.data.rows;
      total.value = res.data.total;
      loading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//获取添加弹窗的用户
const getExcludeUser = async () => {
  let params = {
    // roleId: roleId,
    ...query,
    ...pageInfo
  };
  dialogLoading.value = true;
  getUserExcludeRoleId(roleId, params).then(res => {
    if (res.code === 1000) {
      userList.value = res.data.rows;
      dialogTotal.value = res.data.total;
      dialogLoading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//添加用户
const handleAdd = () => {
  getExcludeUser()
  isVisited.value = true
  dialogDisabled.value = true
}
const handleBack = () => {
  tagsViewStore.delVisitedViews(router.currentRoute.value.path)
  router.push('/system/role')
}
//全部取消授权
const handleCancelAll = () => {
  ElMessageBox.confirm(`确认全部取消授权吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    unbindAllUser(roleId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        searchUser()
      } else {
        ElMessage.error(res.msg);
      }
    });
  })
}
const handleSelect = (selection) => {
  if (selection.length !== 0) {
    moreCancelDisabled.value = false;
    cancelUserIds.value = selection.map(item => item.userId)
    userNames.value = selection.map(item => item.userName).join()
  } else {
    moreCancelDisabled.value = true;
  }
}
//单个取消授权
const handleCancelAuthorization = (userIds) => {
  cancelAuthorization({
    id: roleId,
    ids: userIds,
  }).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      moreCancelDisabled.value = true
      searchUser()
    } else {
      ElMessage.error(res.msg);
    }
  });
}
//批量取消授权
const handleMoreCancelAuthorization = (cancelUserIds, userName) => {
  ElMessageBox.confirm(`确认取消授权名称为"${userName}"的用户吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    handleCancelAuthorization(cancelUserIds)
  })
}
const handleDeleteRole = () => {
  ElMessageBox.confirm(`确认删除名称为"${roleName}"的角色吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRole(roleId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg)
        tagsViewStore.delVisitedViews(router.currentRoute.value.path)
        router.push('/system/role')
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
}
//取消
const handleCancel = () => {
  isVisited.value = false;
};

const handleDialogSelect = (selection) => {
  if (selection.length !== 0) {
    dialogDisabled.value = false;
    userIds.value = selection.map(item => item.userId)
  } else {
    dialogDisabled.value = true;
  }
}
const handleSubmit = (userIds) => {
  roleBindUser({
    id: roleId,
    ids: userIds,
  }).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      searchUser()
      isVisited.value = false
    } else {
      ElMessage.error(res.msg);
    }
  });
}
//切换每页显示条数
const handleSizeChange = (val) => {
  pageInfo.pageSize = val;
  searchUser();
};
const handleSizeChangeDialog = (val) => {
  pageInfo.pageSize = val;
  getExcludeUser();
};

//点击页码进行分页功能
const handleCurrentChange = (val) => {
  pageInfo.pageNum = val;
  searchUser();
};
const handleCurrentChangeDialog = (val) => {
  pageInfo.pageNum = val;
  getExcludeUser();
};

searchUser()
</script>
