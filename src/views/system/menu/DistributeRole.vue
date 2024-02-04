<template>
  <el-form :model="queryParams" class="query-form" inline ref="roleForm">
    <el-form-item label="当前菜单" prop="userName">
      <el-tag >{{menuName}}</el-tag>
    </el-form-item>
    <el-form-item label="角色名称" prop="roleName">
      <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="角色标识符" prop="roleKey">
      <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入角色标识符"
          clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchRole" :icon="Search">搜索</el-button>
      <el-button @click="handleReset" :icon="Refresh">重置</el-button>
    </el-form-item>
  </el-form>
  <div class="table-header-btn">
    <el-button type="primary" @click="handleAdd" :icon="Plus">添加角色</el-button>
    <el-button type="primary" @click="handleBack" :icon="RefreshLeft" plain>返回</el-button>
    <el-button type="danger" @click="handleCancelAll" :icon="CircleClose" plain>全部取消</el-button>
    <el-button type="danger" @click="handleMoreCancelAuthorization(cancelRoleIds,roleNames)" :icon="CircleClose" plain :disabled="moreCancelDisabled">批量取消</el-button>
    <el-button type="danger" @click="handleDeleteMenu" :icon="Delete" plain v-if="showDeleteCurrent">删除当前菜单</el-button>
  </div>
  <div class="table">
    <el-table
        :data="list"
        row-key="roleId"
        :lazy="true"
        ref="table"
        v-loading="loading"
        @select="handleSelect"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column label="序号" type="index" align="center" width="60"/>
      <el-table-column prop="roleName" label="角色名称" align="center"/>
      <el-table-column prop="roleKey" label="角色标识符" align="center"/>
      <el-table-column prop="dataScope" label="数据范围" align="center">
        <template #default="scope">
          <el-text v-if="scope.row.dataScope == '1'">所有数据权限</el-text>
          <el-text v-if="scope.row.dataScope == '2'">自定义数据权限</el-text>
          <el-text v-if="scope.row.dataScope == '3'">本部门数据权限</el-text>
          <el-text v-if="scope.row.dataScope == '4'">本部门及以下数据权限</el-text>
        </template>
      </el-table-column>

      <el-table-column prop="roleSort" label="显示顺序" align="center" width="100px"/>
      <el-table-column prop="state" label="状态" align="center">
        <template #default="scope">
          <tag dict-type="normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" width="180px"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <popover-delete :name="scope.row.roleName" :type="'角色'" :btn-text="'取消授权'"
                          @delete="handleCancelAuthorization([scope.row.roleId])"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
          :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
  <el-dialog v-model="isVisited" :title="title" width="830px">
    <el-form :model="query" class="query-form" inline ref="formInstance">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
            v-model="query.roleName"
            placeholder="请输入角色名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="角色标识符" prop="roleKey">
        <el-input
            v-model="query.roleKey"
            placeholder="请输入角色标识符"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getExcludeRole" :icon="Search">搜索</el-button>
        <el-button @click="handleDialogReset" :icon="Refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <el-table
          :data="roleList"
          row-key="roleId"
          :lazy="true"
          v-loading="dialogLoading"
          @select="handleDialogSelect"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <el-table-column prop="roleName" label="角色名称" align="center"/>
        <el-table-column prop="roleKey" label="角色标识符" align="center"/>
        <el-table-column prop="dataScope" label="数据范围" align="center">
          <template #default="scope">
            <el-text v-if="scope.row.dataScope == '1'">所有数据权限</el-text>
            <el-text v-if="scope.row.dataScope == '2'">自定义数据权限</el-text>
            <el-text v-if="scope.row.dataScope == '3'">本部门数据权限</el-text>
            <el-text v-if="scope.row.dataScope == '4'">本部门及以下数据权限</el-text>
          </template>
        </el-table-column>
        <el-table-column prop="roleSort" label="显示顺序" align="center" width="100px"/>
        <el-table-column prop="state" label="状态" align="center">
          <template #default="scope">
            <tag dict-type="normal_disable" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="180px"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini"
                       @click="handleSubmit(scope.row.roleId)"  link>添加
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
        <el-button type="primary" @click="handleSubmit(roleIds)" :disabled="dialogDisabled">批量添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {Plus, Search, Refresh, RefreshLeft,CircleClose,Delete} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {getRoleInfoByMenuId,getRoleExcludeMenuId,unbindAllRole,cancelAuthorization,bindRoleAndMenu} from "@/api/role/role"
import {useRouter} from "vue-router";
import Tag from '@/components/Tag.vue'
import Paging from "@/components/pagination/index.vue";
import {delMenu} from "@/api/system/menuman";
import {useTagsView} from '@/stores/tagsview.js'
const router = useRouter();
const tagsViewStore = useTagsView()
const menuId = reactive(router.currentRoute.value.params.menuId)
const menuName = reactive(router.currentRoute.value.params.menuName)
const roleForm = ref();
const table = ref();
const title = ref('添加角色');
const list = ref([]);
const roleList = ref([]);
const total = ref([]);
const dialogTotal = ref([]);
const moreCancelDisabled = ref(true);
const dialogDisabled = ref(true);
const loading = ref(true);
const dialogLoading = ref(true);
const showDeleteCurrent = ref(false);
const roleNames = ref([]);
const cancelRoleIds = ref([]);
const roleIds = ref([]);
const queryParams = reactive({
  roleName: "",
  roleKey: ""
});
const query = reactive({
  roleName: "",
  roleKey: ""
});
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
});
const formInstance = ref();
const isVisited = ref(false);
const form = ref();
//角色搜索重置
const handleReset = () => {
  roleForm.value.resetFields();
  searchRole();
};
const handleDialogReset = () => {
  formInstance.value.resetFields();
  getExcludeRole();
};
//根据菜单id获取角色信息
const searchRole = async () => {
  let params = {
    menuId: menuId,
    ...queryParams,
    ...pageInfo
  };
  loading.value = true
  getRoleInfoByMenuId(params).then(res => {
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
//获取添加弹窗的角色
const getExcludeRole = async () => {
  let params = {
    menuId: menuId,
    ...query,
    ...pageInfo
  };
  dialogLoading.value = true;
  getRoleExcludeMenuId(params).then(res => {
    if (res.code === 1000) {
      roleList.value = res.data.rows;
      dialogTotal.value = res.data.total;
      dialogLoading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//添加角色
const handleAdd = () => {
  getExcludeRole()
  isVisited.value = true
  dialogDisabled.value = true
}
//全部取消授权
const handleCancelAll = () => {
  ElMessageBox.confirm(`确认全部取消授权吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    unbindAllRole(menuId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        searchRole()
      } else {
        ElMessage.error(res.msg);
      }
    });
  })
}
//取消授权
const handleCancelAuthorization = (roleId) => {
    cancelAuthorization(menuId, roleId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        moreCancelDisabled.value=true
        searchRole()
      } else {
        ElMessage.error(res.msg);
      }
    });
}
//批量取消授权
const handleMoreCancelAuthorization = (cancelUserIds, userName) => {
  ElMessageBox.confirm(`确认取消授权名称为"${userName}"的角色吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    handleCancelAuthorization(cancelUserIds)
  })
}
const handleBack=()=>{
  tagsViewStore.delVisitedViews(router.currentRoute.value.path)
  router.push('/system/menu')
}
//删除当前菜单
const handleDeleteMenu=()=>{
  ElMessageBox.confirm(`确认删除名称为"${menuName}"的菜单吗?`, "系统提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    delMenu(menuId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg)
        tagsViewStore.delVisitedViews(router.currentRoute.value.path)
        router.push('/system/menu')
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

const handleSelect =  (selection) => {
  if (selection.length !== 0) {
    moreCancelDisabled.value = false;
    cancelRoleIds.value=selection.map(item=>item.roleId)
    roleNames.value=selection.map(item=>item.roleName).join()
  } else {
    moreCancelDisabled.value = true;
  }
}
const handleDialogSelect =  (selection) => {
  if (selection.length !== 0) {
    dialogDisabled.value = false;
    roleIds.value=selection.map(item=>item.roleId)
  } else {
    dialogDisabled.value = true;
  }
}
//添加角色
const handleSubmit = (roleId) => {
  bindRoleAndMenu(menuId,roleId).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      searchRole()
      isVisited.value = false
    } else {
      ElMessage.error(res.msg);
    }
  });
}
//切换每页显示条数
const handleSizeChange = (val) => {
  pageInfo.pageSize = val;
  searchRole();
};
const handleSizeChangeDialog = (val) => {
  pageInfo.pageSize = val;
  getExcludeRole();
};

//点击页码进行分页功能
const handleCurrentChange = (val) => {
  pageInfo.pageNum = val;
  searchRole();
};
const handleCurrentChangeDialog = (val) => {
  pageInfo.pageNum = val;
  getExcludeRole();
};

searchRole()
</script>
