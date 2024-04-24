<template>
  <div class="layout">
    <div class="layout-left" style="width: 20%; border: none">
      <el-form :model="queryDept" @submit.prevent>
        <el-form-item prop="dictType">
          <el-input
            v-model="queryDept.deptName"
            placeholder="请输入部门名称"
            :prefix-icon="Search"
            clearable
            @clear="handleSearchDept"
            @input="handleSearchDept"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="scrollbar-user scrollbar-dict">
        <el-tree
          :data="deptList"
          :props="deptProps"
          empty-text=""
          node-key="value"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="handle"
        >
          <template #default="{ node, data }">
            {{ node.label }}
          </template>
        </el-tree>
      </div>
    </div>
    <div class="layout-right">
      <el-form :model="queryParams" class="query-form" inline ref="userForm">
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
        <el-form-item label="状态" prop="state">
          <el-select
            v-model="queryParams.state"
            placeholder="用户状态"
            clearable
            filterable
          >
            <el-option
              v-for="item in cacheStore.getDict('normal_disable')"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          <el-button type="primary" @click="getList" :icon="Search"
            >搜索</el-button
          >
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="table-header-btn">
        <el-button type="primary" @click="handleAdd" :icon="Plus"
          >新增</el-button
        >
      </div>
      <div class="table">
        <el-table
          :data="list"
          row-key="userId"
          :lazy="true"
          v-loading="loading"
          :header-cell-style="{ background: '#f5f5f8' }"
          v-tabh
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="60"
          />
          <!--          <el-table-column prop="userId" label="用户编号" align="center"/>-->
          <el-table-column prop="userName" label="用户名称" align="center" />
          <el-table-column prop="nickName" label="用户昵称" align="center" />
          <el-table-column prop="deptName" label="部门" align="center" />
          <el-table-column prop="phoneNumber" label="手机号码" align="center" />
          <el-table-column prop="state" label="状态" align="center">
            <template #default="scope">
              <tag dict-type="normal_disable" :value="scope.row.state" />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            width="180px"
          />
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row.userId)"
                link
                >编辑
              </el-button>
              <popover-delete
                :name="scope.row.userName"
                :type="'用户'"
                @delete="handleDelete(scope.row.userId)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <paging
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :page-sizes="[10, 20, 30, 40, 50]"
        :total="total"
        @changeSize="handleSizeChange"
        @goPage="handleCurrentChange"
      />
      <el-dialog v-model="isVisited" :title="title" width="700px">
        <el-form
          :model="form"
          ref="formInstance"
          label-width="80px"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="userName">
                <el-input
                  v-model="form.userName"
                  placeholder="请输入用户名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nickName">
                <el-input
                  v-model="form.nickName"
                  placeholder="请输入用户昵称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户性别" prop="sex">
                <el-select
                  v-model="form.sex"
                  placeholder="请选择用户性别"
                  style="width: 250px"
                  filterable
                >
                  <el-option
                    v-for="item in cacheStore.getDict('user_sex')"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户密码" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门" prop="deptId">
                <el-tree-select
                  ref="treeSelect"
                  v-model="form.deptId"
                  :data="deptList"
                  :props="deptProps"
                  value-key="value"
                  check-strictly
                  :render-after-expand="false"
                  @node-click=""
                  style="width: 250px"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phoneNumber">
                <el-input
                  v-model="form.phoneNumber"
                  placeholder="请输入手机号码"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="state">
                <el-radio-group v-model="form.state" size="mini">
                  <el-radio
                    v-for="user in cacheStore.getDict('normal_disable')"
                    :key="user.value"
                    :label="user.value"
                  >
                    {{ user.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位" prop="postIds">
                <el-select
                  v-model="form.postIds"
                  multiple
                  placeholder="请选择岗位"
                  style="width: 250px"
                  filterable
                >
                  <div v-if="title == '新增用户'">
                    <el-option
                      v-for="item in postList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </div>
                  <div v-else>
                    <el-option
                      v-for="item in form.postList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色" prop="roleIds">
                <el-select
                  v-model="form.roleIds"
                  multiple
                  placeholder="请选择角色"
                  style="width: 250px"
                  filterable
                >
                  <div v-if="title == '新增用户'">
                    <el-option
                      v-for="item in roleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </div>
                  <div v-else>
                    <el-option
                      v-for="item in form.roleList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  :rows="3"
                  maxlength="255"
                  show-word-limit
                  placeholder="请输入内容"
                  v-model="form.remark"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <span>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit(formInstance)"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { defineProps } from "vue";
import { getRoleOption } from "@/api/role/role";
import {
  getUserList,
  getUserDetail,
  addUser,
  editUser,
  deleteUser,
} from "@/api/user/user";
import { getDeptList } from "@/api/dept/dept";
import { getSelectOption } from "@/api/post/post";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCacheStore } from "@/stores/cache.js";
import Tag from "@/components/Tag.vue";
import Paging from "@/components/pagination/index.vue";

const cacheStore = useCacheStore();
//查询参数
const queryDept = reactive({
  deptName: "",
});
const queryParams = reactive({
  deptId: "",
  userName: "",
  phoneNumber: "",
  state: "",
  startTime: "",
  endTime: "",
});
const userForm = ref();
const list = ref([]);
const total = ref([]);
//页面信息
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10,
});
const loading = ref(true);
const treeSelect = ref();
const postList = ref([]);
const roleList = ref([]);
const deptList = ref([]);
const deptProps = reactive({
  value: "deptId",
  label: "deptName",
});
const props = defineProps({
  value: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const form = ref({
  // user: [],
  // postIds: "",
  // roleIds: "",
  roleList: [],
  postList: [],
});
const formInstance = ref();
const isVisited = ref(false);
const title = ref("");
const rules = reactive({
  nickName: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  userName: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
});
const dateValue = ref();
const shortcuts = [
  {
    text: "上周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "上月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "三月前",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
//获取部门数据
const getDepartmentList = async () => {
  let params = {
    ...queryDept,
  };
  //获取部门信息
  getDeptList(params).then((res) => {
    if (res.code === 1000) {
      deptList.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//获取用户数据
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo,
  };
  const date = dateValue.value;
  if (date !== undefined && date !== null) {
    params.startTime = date[0];
    params.endTime = date[1];
  }
  loading.value = true;
  getUserList(params).then((res) => {
    if (res.code === 1000) {
      list.value = res.data.rows;
      total.value = res.data.total;
      loading.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
const getRole = () => {
  getRoleOption().then((res) => {
    if (res.code === 1000) {
      roleList.value = res.data;
    }
  });
};
const getPost = async () => {
  getSelectOption().then((res) => {
    if (res.code === 1000) {
      postList.value = res.data;
    }
  });
};
//搜索部门
const handleSearchDept = () => {
  getDepartmentList();
};
//点击部门节点筛选数据
const handle = (node) => {
  queryParams.deptId = node.deptId;
  getList();
};

//用户搜索重置
const handleReset = () => {
  dateValue.value = [];
  userForm.value.resetFields();
  getList();
};
const restForm = () => {
  form.value = {
    roleList: [],
    postList: [],
    userName: null,
    nickName: null,
    deptId: null,
    phoneNumber: null,
    email: null,
    password: null,
    sex: null,
    state: "1",
    postIds: [],
    roleIds: [],
    remark: null,
  };
};
//新增用户
const handleAdd = () => {
  rules.password[0].required = true;
  restForm();
  getRole();
  getPost();
  title.value = "新增用户";
  isVisited.value = true;
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate();
  });
};

//修改用户
const handleEdit = (userId) => {
  restForm();
  getRole();
  getPost();
  //查看详情
  getUserDetail(userId).then((res) => {
    if (res.code === 1000) {
      rules.password[0].required = false;
      form.value = res.data.user;
      form.value.roleIds = res.data.roleIds;
      form.value.postIds = res.data.postIds;
      form.value.roleList = res.data.roleList;
      form.value.postList = res.data.postList;
      title.value = "修改用户";
      isVisited.value = true;
      nextTick(() => {
        // 清空校验
        formInstance.value.clearValidate();
      });
    }
  });
};
//删除功能
const handleDelete = (userId) => {
  // ElMessageBox.confirm(`确认删除用户名称为${row.userName}的数据吗?`, "系统提示", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning"
  // }).then(() => {
  deleteUser(userId).then((res) => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      getList();
    } else {
      ElMessage.error(res.msg);
    }
  });
  // });
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
    if (title.value === "新增用户") {
      addUser(form.value).then((res) => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      editUser(form.value).then((res) => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
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
getDepartmentList();
getList();
</script>
