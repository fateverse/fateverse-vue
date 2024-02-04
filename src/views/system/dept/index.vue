<template>
  <div>
    <el-form :model="queryParams" inline class="query-form" ref="queryInstance">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="部门状态" clearable filterable>
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
      <el-button type="info" @click="handleExpand" :icon="Sort">{{ isExpand ? '全部收起' : '全部展开' }}</el-button>
    </div>
    <el-table
        :data="list"
        ref="tableTree"
        :default-expand-all="isExpand"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="deptId"
        :lazy="true"
        v-loading="loading"
        @expand-change="expandChange"
        v-tabh
    >
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="orderNum" label="排序" width="60px"/>
      <el-table-column prop="state" label="状态">
        <template #default="scope">
          <tag dict-type="normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleAddLine(scope.row.deptId)" link>新增</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row.deptId)" link>修改</el-button>
          <popover-delete v-if="scope.row.parentId!==0" :name="scope.row.deptName" :type="'部门'"
                          @delete="handleDelete(scope.row.deptId)"/>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="isVisited" :title="title" width="700px">
      <el-form :model="form" ref="formInstance" label-width="90px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级部门" prop="parentId">
              <div v-if="form.parentId==0&&title=='修改部门'">
                <el-input v-model="form.deptName" placeholder="请输入部门名称" disabled style="width: 560px"></el-input>
              </div>
              <el-tree-select
                  v-else
                  ref="treeSelect"
                  v-model="form.parentId"
                  placeholder="请选择上级部门"
                  :data="deptList"
                  :props="deptProps"
                  value-key="value"
                  check-strictly
                  :render-after-expand="false"
                  style="width: 560px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" style="width: 230px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state" size="mini">
                <el-radio v-for="dept in cacheStore.getDict('normal_disable')" :key="dept.value"
                          :label="dept.value">
                  {{ dept.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span>
        <el-button @click="handleDataCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formInstance)">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {Search, Refresh, Plus, Sort} from "@element-plus/icons-vue";
import {useCacheStore} from '@/stores/cache.js'
import {getDeptList, getDeptOption,addDept, deleteDept, editDept, getDeptDetail, getDeptExcludeOption} from "@/api/dept/dept";
import {ElMessage, ElMessageBox} from "element-plus";
import Tag from '@/components/Tag.vue'

const cacheStore = useCacheStore()
const queryInstance = ref()
const queryParams = reactive({
  deptName: '',
  state: ''
})
const loading = ref(true)
const list = ref([])
const tableTree = ref()
const isExpand = ref(true)
const isVisited = ref(false);
const title = ref();
const form = ref();
const formInstance = ref();
const rules = reactive({
  parentId: [
    {required: true, message: '请选择上级部门', trigger: 'blur'},
  ],
  deptName: [
    {required: true, message: '请输入部门名称', trigger: 'blur'},
  ],
  orderNum: [
    {required: true, message: '请选择显示顺序', trigger: 'blur'},
  ]
})
const deptList = ref([]);
const deptProps = reactive({
  value: "value",
  label: "label"
});
//获取部门option
const getDepartmentList = async () => {
  //获取部门信息
  getDeptOption().then(res => {
    if (res.code === 1000) {
      deptList.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//获取修改时的option
const getEditOption = (deptId) => {
  getDeptExcludeOption(deptId).then(res => {
    if (res.code === 1000) {
      deptList.value = res.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
}
const getList = async () => {
  loading.value = true
  getDeptList(queryParams).then(res => {
    list.value = res.data
    loading.value = false
  })
}
const getDetail = (deptId) => {
  getDeptDetail(deptId).then(res => {
    if (res.code === 1000) {
      console.log(res.data)
      if (title.value == "行内新增部门") {
        form.value.parentId = res.data.deptId
      } else {
        form.value = res.data;
      }
    } else {
      ElMessage.error(res.msg);
    }
  });
}
const handleReset = (instance) => {
  if (!instance) return
  instance.resetFields()
  getList()
}
const restForm = () => {
  form.value = {
    leaderId: 0,
    parentId: '',
    deptName: null,
    orderNum: 0,
    state: '1',
    leader: null,
    phone: null,
    email: null
  };
};
//添加功能
const handleAdd = () => {
  restForm();
  getDepartmentList()
  title.value = "新增部门";
  isVisited.value = true;
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
};
const handleAddLine = (deptId) => {
  restForm();
  getDepartmentList()
  title.value = "行内新增部门";
  isVisited.value = true;
  getDetail(deptId)
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
}
//编辑部门
const handleEdit = (deptId) => {
  restForm();
  getEditOption(deptId)
  getDetail(deptId)
  title.value = "修改部门";
  isVisited.value = true;
  nextTick(()=>{
    // 清空校验
    formInstance.value.clearValidate()
  })
}

const handleExpand = () => {
  isExpand.value = !isExpand.value
  expandChange(list.value, isExpand)
  getList()
}
//展开收缩封装函数
const expandChange = (data, isExpansion) => {
  for (let i = 0; i < data.length; i++) {
    tableTree.value.toggleRowExpansion(data[i], isExpansion);
    if (data[i].children !== null) {
      expandChange(data[i].children, isExpansion);
    }
  }
}

//删除功能
const handleDelete = (deptId) => {
    deleteDept(deptId).then(res => {
      if (res.code === 1000) {
        ElMessage.success(res.msg);
        getList();
      } else {
        ElMessage.error(res.msg);
      }
    });
};

const handleDataCancel = () => {
  restForm();
  isVisited.value = false;
};

const handleSubmit = async (formInstance) => {
  if (!formInstance) return;
  formInstance.validate(async (valid) => {
    if (!valid) return;
    if (title.value == "新增部门") {
      addDept(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList();
          isVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      editDept(form.value).then(res => {
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
