<template>
  <div>
    <el-form :model="queryParams" label-width="70px" class="query-form" inline ref="queryInstance">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="queryParams.menuName" placeholder="菜单名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" placeholder="菜单状态" clearable filterable>
          <el-option v-for="item in cacheStore.getDict('normal_disable')" :key="item.value" :label="item.label"
                     :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button type="primary" @click="handleReset(queryInstance)">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-header-btn">
      <el-button type="primary" @click="handleAdd" :icon="Plus">新增</el-button>
      <el-button type="info" @click="handleExpand" :icon="Sort">{{ isExpand ? '全部收起' : '全部展开' }}</el-button>
    </div>
    <el-table :data="list" ref="tableTree" :default-expand-all="isExpand"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="menuId" :lazy="true"
              v-loading="loading" v-tabh>
      <el-table-column prop="menuName" label="菜单名称"/>
      <el-table-column prop="icon" label="图标" width="60px">
        <template #default="scope">
          <!--          <el-icon>-->
          <!--            <component :is="scope.row.icon" />-->
          <!--          </el-icon>-->
          <svg-icon :name="scope.row.icon" :class-name="'black-icon'"/>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60px"/>
      <el-table-column prop="perms" label="权限标识"/>
      <el-table-column prop="component" label="组件路径"/>
      <el-table-column prop="state" label="状态" width="80px">
        <template #default="scope">
          <tag dict-type="normal_disable" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="mini" @click="handleAdd(scope.row)" link>新增</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row.menuId)" link>修改</el-button>
          <el-button type="primary" size="mini" @click="handleAssignRoles(scope.row)" link>分配角色</el-button>
          <popover-delete :name="scope.row.menuName" :type="'菜单'" @delete="handleDel(scope.row.menuId)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="isVisited" :title="title" width="700px">
      <el-form :model="form" :rules="formRules" ref="formInstance">
        <el-form-item label="上级菜单">
          <el-tree-select v-model="form.parentId" :data="menuOpt" style="width: 100%;"
                          :filter-node-method="filterNodeMethod" clearable filterable :check-strictly="true"/>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.menuType">
            <el-radio
                v-for="item in cacheStore.getDict('menu_type')"
                :label="item.value" :key="item.value">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标">
          <template #label>
            <div style="display: flex;align-items: center">
              <span style="margin-right: 5px">菜单图标</span>
              <svg-icon v-if="form.icon" :name="form.icon" :class-name="'middle-icon'"/>
            </div>
          </template>
          <icon-select :active-icon="form.icon" @getSelectIcon="getSelectIcon"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName" required>
              <el-input v-model="form.menuName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="显示顺序" prop="orderNum" required>
              <el-input-number v-model="form.orderNum" controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="是否外链">
                <el-radio-group v-model="form.isFrame">
                  <el-radio v-for="item in cacheStore.getDict('is_frame')"
                            :label="item.value"
                            :key="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" v-if="form.menuType === 'B'">
            <el-form-item label="权限字符" prop="perms" required>
              <el-input v-model="form.perms"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" v-if="form.menuType !== 'B'">
            <el-form-item label="路由地址" prop="path" required>
              <el-input v-model="form.path"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.menuType === 'M'">
          <el-col :span="12">
            <el-form-item label="组件路径" prop="component" required>
              <el-input v-model="form.component"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="11" :offset="1">
            <el-form-item label="权限字符" prop="perms" required>
              <el-input v-model="form.perms"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.menuType === 'M'">
          <el-col :span="12">
            <el-form-item label="路由参数">
              <el-input v-model="form.pathParams"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" v-if="form.menuType !== 'B'">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="form.isCache">
                <el-radio v-for="item in cacheStore.getDict('is_cache')"
                          :label="item.value" :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" v-if="form.menuType !== 'B'">
            <el-form-item label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio v-for="item in cacheStore.getDict('show_hide')" :label="item.value"
                          :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" v-if="form.menuType !== 'B'">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.state">
                <el-radio v-for="item in cacheStore.getDict('normal_disable')" :label="item.value"
                          :key="item.value">
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit(formInstance)">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {getMenuList, getMenuInfo, getMenuOpt, addMenu, editMenu, delMenu} from '@/api/system/menuman.js'
import {Plus, Sort} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useCacheStore} from '@/stores/cache.js'
import Tag from '@/components/Tag.vue'
import SvgIcon from '@/components/svgIcon/index.vue'
import IconSelect from '@/components/iconSelect/index.vue'
import PopoverDelete from "@/components/PopoverDelete.vue";

const cacheStore = useCacheStore()
const queryParams = reactive({
  menuName: undefined,
  state: undefined
})
const queryInstance = ref()
const loading = ref(true)
const list = ref([])
const tableTree = ref()
const isExpand = ref(true)
const isVisited = ref(false)
const title = ref('')
const form = ref({
  parentId: '',
  menuType: 'D',
  icon: '',
  menuName: '',
  orderNum: '',
  visible: '0',
  state: '1',
  isCache: '0',
  isFrame: '0', //是否外链
  perms: '',
  pathParams: '',
  path: '',
  component: ''
})
const formRules = ref({
  menuName: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
  orderNum: [{required: true, message: '请输入显示顺序', trigger: 'blur'}],
  component: [{required: true, message: '请输入组件路径', trigger: 'blur'}],
  perms: [{required: true, message: '请输入权限字符', trigger: 'blur'}],
  path: [{required: true, message: '请输入路由地址', trigger: 'blur'}],
})
const formInstance = ref()
const menuOpt = ref([])
const router = useRouter()
const getSelectIcon = (val) => {
  form.value.icon = val
}

const getList = async () => {
  loading.value = true
  getMenuList(queryParams).then(res => {
    list.value = res.data
    loading.value = false
  })
}

const handleReset = (instance) => {
  if (!instance) return
  instance.resetFields()
  getList()
}
const restFrom = () => {
  form.value = {
    parentId: '',
    menuType: 'D',
    icon: '',
    menuName: '',
    orderNum: '',
    visible: '0',
    state: '1',
    isCache: '0',
    isFrame: '0', //是否外链
    perms: '',
    pathParams: '',
    path: '',
    component: ''
  }
}
const handleAdd = async (row) => {
  title.value = '新增菜单'
  restFrom()
  if (row.menuId !== undefined) {
    await getMenuInfo(row.menuId).then(res => {
      form.value.parentId = res.data.parentId
    })
  }
  await getMenuOpt().then(res => {
    menuOpt.value = [{
      value: 0,
      label: "一级目录",
      children: res.data
    }]
  })
  isVisited.value = true
  nextTick(() => {
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
//分配角色
const handleAssignRoles = (row) => {
  router.push('/menu-auth/role/' + row.menuId + '/' + row.menuName)
}
const handleEdit = async (menuId) => {
  title.value = '修改菜单'
  restFrom()
  await getMenuInfo(menuId).then(res => {
      if(res.data.isFrame==false){
        res.data.isFrame='0'
      }else {
        res.data.isFrame='1'
      }
      if(res.data.isCache==false){
        res.data.isCache='0'
      }else {
        res.data.isCache='1'
      }
    console.log('res',res.data)
    form.value = {...res.data}
  })
  await getMenuOpt(menuId).then(res => {
    menuOpt.value = [{
      value: 0,
      label: "一级目录",
      children: res.data
    }]
  })
  isVisited.value = true
  nextTick(() => {
    // 清空校验
    formInstance.value.clearValidate()
  })
}

const handleDel = (menuId) => {
  delMenu(menuId).then(res => {
    if (res.code === 1000) {
      loading.value=false
      ElMessage.success(res.msg)
      getList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleSubmit = async (instance) => {
  if (!instance) return
  instance.validate(async (valid, fields) => {
    if (!valid) return
    form.value.isFrame = form.value.isFrame !== '0';
    form.value.isCache = form.value.isCache !== '0';
    if (title.value === '新增菜单') {
      await addMenu(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    } else {
      await editMenu(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg)
          getList()
          isVisited.value = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const filterNodeMethod = (value, data) => data.label.includes(value)

const handleCancel = () => {
  form.value = {
    parentId: '',
    menuType: 'D',
    icon: '',
    menuName: '',
    orderNum: '',
    visible: '0',
    state: '1',
    isCache: '0',
    isFrame: '0', //是否外链
    perms: '',
    pathParams: '',
    path: '',
    component: ''
  }
  isVisited.value = false
}

getList()
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}

.el-tree-select {
  :deep(.el-select) {
    width: 100%;
  }
}
</style>
