<template>
  <div>
    <!-- 角色管理 -->
    <el-form :model="queryParams" class="query-form" inline ref="roleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
            v-model="queryParams.roleName"
            placeholder="请输入角色名称"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
            v-model="queryParams.roleKey"
            placeholder="请输入权限字符"
            clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select
            v-model="queryParams.state"
            placeholder="请选择角色状态"
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
      <el-form-item label="登录时间" prop="dateValue">
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
    <div class="table-header-btn">
      <el-button type="primary" @click="handleAdd" :icon="Plus">新增</el-button>
    </div>
    <div class="table">
      <el-table
          :data="list"
          ref="table"
          row-key="roleId"
          :lazy="true"
          v-loading="loading"
          v-tabh
      >
        <el-table-column label="序号" type="index" align="center" width="60"/>
        <!--      <el-table-column prop="roleId" label="角色编号" align="center"/>-->
        <el-table-column prop="roleName" label="角色名称" align="center"/>
        <el-table-column prop="roleKey" label="角色权限" align="center"/>
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
        <el-table-column prop="createTime" label="创建时间" align="center"/>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="mini"  @click="handleEdit(scope.row.roleId)" link>修改
            </el-button>
            <el-button type="primary" size="mini"  @click="handleAssignedUser(scope.row)" link>分配用户
            </el-button>
            <popover-delete :name="scope.row.roleName" :type="'角色'"
                            @delete="handleDel(scope.row.roleId)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
            :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>

    <el-dialog v-model="isVisited" :title="title" width="700px">
      <el-form :model="form" ref="formInstance" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="角色权限" prop="roleKey">
              <el-input v-model="form.roleKey" placeholder="请输入角色权限"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="显示顺序" prop="roleSort">
              <el-input-number v-model="form.roleSort"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数据范围" prop="dataScope">
              <el-radio-group v-model="form.dataScope" size="mini">
                <el-radio
                    v-for="role in [{value:'1',label:'所有数据权限'},{value:'2',label:'自定义数据权限'},{value:'3',label:'本部门数据权限'},{value:'4',label:'本部门及以下数据权限'}]"
                    :key="role.value" :label="role.value">
                  {{ role.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state" size="mini">
                <el-radio v-for="role in cacheStore.getDict('normal_disable')" :key="role.value"
                          :label="role.value">
                  {{ role.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单权限" prop="menuIds">
              <div style="display: flex;flex-direction: column">
                <el-checkbox-group v-model="checkList" @change="changeCheckbox">
                  <el-checkbox label="1">{{ isExpand }}</el-checkbox>
                  <el-checkbox label="2">{{ isAllChose }}</el-checkbox>
                  <el-checkbox label="3">父子联动</el-checkbox>
                </el-checkbox-group>
                <div class="dialog-tree ">
                  <el-tree
                      :data="treeData"
                      :props="treeProps"
                      node-key="menuId"
                      ref="tree"
                      :check-strictly="checkStrictly"
                      show-checkbox
                      @check-change="handleCheckChange"
                  />
                </div>
              </div>
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
import {Plus} from "@element-plus/icons-vue";
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from "element-plus";
import {useCacheStore} from "@/stores/cache.js";
import {getMenuList} from '@/api/system/menuman.js'
import {getRoleList, getRoleDetail, deleteRole, addRole, editRole} from "@/api/role/role";
import {Search, Refresh, EditPen, Delete, User} from '@element-plus/icons-vue'
import Tag from '@/components/Tag.vue'
import Paging from "@/components/pagination/index.vue";

const router = useRouter()
const pageInfo = reactive({
  pageSize: 10,
  pageNum: 1
})
const cacheStore = useCacheStore();
const queryParams = reactive({
  roleName: "",
  roleKey: "",
  state: "",
  startTime: '',
  endTime: ''
});
const treeData = ref([])
const tree = ref()
const isExpand = ref('展开')
const isAllChose = ref('全选')
const table = ref()
const menuIds = ref([])
const checkStrictly = ref(false)
const rules = reactive({
  roleName: [
    {required: true, message: '请输入角色名称', trigger: 'blur'},
  ],
  roleKey: [
    {required: true, message: '请输入角色权限', trigger: 'blur'},
  ],
  roleSort: [
    {required: true, message: '请选择显示顺序', trigger: 'blur'},
  ]
})
const checkList = ref(['3'])
const treeProps = {
  value: "menuId",
  label: 'menuName',
  children: 'children'
}
const dateValue = ref()
const total = ref()
const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '三月前',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const loading = ref(true);
const roleForm = ref();
const list = ref([]);
const isVisited = ref(false);
const title = ref();
const form = ref();
const formInstance = ref();
//重置from表单
const restForm = () => {
  form.value = {
    roleId: '',
    roleName: null,
    roleSort: 0,
    state: '1',
    roleKey: null,
    dataScope: '1',
    menuIds: []
  };
};
const getList = async () => {
  let params = {
    ...queryParams,
    ...pageInfo
  }
  let date = dateValue.value
  if (date !== undefined && date !== null) {
    params.startTime = date[0]
    params.endTime = date[1]
  }
  loading.value = true
  getRoleList(params).then(res => {
    if (res.code === 1000) {
      res.data.rows = res.data.rows.sort((a, b) => {
        return a.roleSort - b.roleSort
      })
      list.value = res.data.rows
      total.value = res.data.total
      loading.value = false
    }
  })
};


//重置功能
const handleReset = () => {
  dateValue.value = []
  roleForm.value.resetFields()
  getList()
}

//添加功能
const handleAdd = () => {
  if( tree.value!==undefined){
    tree.value.setCheckedKeys([])
  }
  // getMenu()
  getMenuList().then(res => {
    treeData.value = res.data
  })
  restForm();
  rules.roleKey[0].required = true
  title.value = "新增角色";
  isVisited.value = true;
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
};

//修改功能
const handleEdit = (roleId) => {
  restForm();
  //查看详情
  getRoleDetail(roleId).then(res => {
    if (res.code === 1000) {
      console.log('角色详情', res.data)
      rules.roleKey[0].required = false
      menuIds.value = res.data.menuIds
      form.value = res.data
      title.value = "修改角色";
      isVisited.value = true;
      nextTick(()=>{
        // 清空校验
        formInstance.value.clearValidate()
      })
    }
  })
  getMenu()
};
//删除功能
const handleDel = (roleId) => {
  // ElMessageBox.confirm(`确认删除角色名称为${row.roleName}的数据吗?`, "系统提示", {
  //   confirmButtonText: "确定",
  //   cancelButtonText: "取消",
  //   type: "warning",
  // }).then(() => {
    deleteRole(roleId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        getList();
      } else {
        ElMessage.error(res.msg);
      }
    });
  // });
};
//分配用户
const handleAssignedUser = (row) => {
  //路由跳转，携带参数
  router.push('/role-auth/user/' + row.roleId+'/'+ row.roleName)
}
//获取菜单名称
const getMenu = async () => {
  let params = {
    ...queryParams
  }
  getMenuList(params).then(res => {
    tree.value.setCheckedKeys(menuIds.value)
    treeData.value = res.data
  })
}
//多选框事件
const changeCheckbox = (checked) => {
  //父子联动
  checkStrictly.value = checked.indexOf("3") === -1;
  let nodes = tree.value.store.nodesMap;
  console.log('checked',checked)
  //展开/折叠
  if (checked.indexOf("1") === 1) {
    for (const node in nodes) {
      nodes[node].expanded = true;
    }
    isExpand.value = '折叠'
  } else {
    for (const node in nodes) {
      nodes[node].expanded = false;
    }
    isExpand.value = '展开'
  }
  //全选/全不选
  if (checked.indexOf("2") === 1) {
    tree.value.setCheckedNodes(treeData.value)
    isAllChose.value = '不全选'
  } else {
    tree.value.setCheckedNodes([])
    isAllChose.value = '全选'
  }
}

//点击新增/修改弹窗上的tree节点的左边选择框
const handleCheckChange = (data) => {
  form.value.menuIds = tree.value.getCheckedKeys()
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
    if (title.value == "新增角色") {
      console.log('新增角色', form.value)
      addRole(form.value).then(res => {
        console.log('res', res)
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      // form.value.menuIds = tree.value.getCheckedKeys()
      console.log('form.value修改', form.value)
      editRole(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          isVisited.value = false;
          getList();
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  })
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
getList();
</script>

<style lang="scss" scoped>
.dialog-tree {
  border: 1px solid #ad8383;
  height: 300px;
  overflow: auto;
}
.dialog-tree::-webkit-scrollbar {
  width: 6px;
}

// 滚动条轨道
.dialog-tree::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

// 小滑块
.dialog-tree::-webkit-scrollbar-thumb {
  background: rgba(80, 81, 82, 0.29);
  border-radius: 10px;
}
.el-input-number {
  width: 100%;
}

.el-tree-select {
  :deep(.el-select) {
    width: 100%;
  }
}
</style>
