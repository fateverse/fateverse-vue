<template>
  <div>
    <div class="layout">
      <div class="layout-left">
        <div class="query-btn">
          <el-button type="primary" v-perm="['dict:type:add']" @click="handleAddType" :icon="Plus" plain>新增</el-button>
          <!--        <el-button type="warning" v-perm="['dict:type:export']" @click="handleExport" :icon="Download" plain>导出-->
          <!--        </el-button>-->
          <el-button type="primary" :icon="Edit" v-perm="['dict:type:edit']"
                     @click.stop="handleEditType" plain>修改
          </el-button>
          <el-button type="danger" :icon="Delete" v-perm="['dict:type:del']"
                     @click.stop="handleDeleteType" :disabled="disabledDelete" plain>删除
          </el-button>
        </div>
        <el-form :model="queryType">
          <el-form-item prop="dictType">
            <el-input v-model="queryType.dictType" placeholder="请输入字典类型" :suffix-icon="Search"
                      clearable @clear="getTreeList" @input="getTreeList"></el-input>
          </el-form-item>
        </el-form>
        <div class="scrollbar-dict">
          <el-tree :data="treeData" ref="tree" :props="defaultProps" highlight-current @current-change="currentChange"
                   @node-click="handleNodeClick">
            <template #default="{ node, data }">
              <div class="dict-tree">
                <div>{{ data.dictName }}</div>
                <!--              <div  style="display: none" :id="'option_'+data.dictId">-->
                <!--                <el-button type="primary" size="small" :icon="Edit" v-perm="['dict:type:edit']"-->
                <!--                           @click.stop="handleEditType(data.dictId)"/>-->
                <!--                <el-button type="primary" size="small" :icon="Delete" v-perm="['dict:type:del']"-->
                <!--                           @click.stop="handleDeleteType(data)" :disabled="disabledDelete"/>-->
                <!--              </div> -->
                <!--              :id="'type_'+data.dictId"-->
                <div class="left-type">{{ data.dictType }}</div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="layout-right" style="margin-top: 15px;">
        <div class="query-btn">
          <el-button type="primary" v-perm="['dict:data:add']" @click="handleAddData" :icon="Plus" plain>新增</el-button>
        </div>
        <el-form :model="queryData">
          <el-form-item prop="dictLabel">
            <el-input v-model="queryData.dictLabel" placeholder="请输入字典标签" :suffix-icon="Search"
                      clearable @clear="getList(queryData.dictLabel,typeData)"
                      @input="getList(queryData.dictLabel,typeData)" :disabled="isSearchData"></el-input>
          </el-form-item>
        </el-form>

        <div class="table">
          <el-table
              :data="list"
              row-key="dictId"
              ref="singleTable"
              v-loading="loading"
              :header-cell-style="{'background':'#f5f7fa'}"
              v-tabh
          >
            <!--            <el-table-column prop="dictType" label="字典类型" align="center"/>-->
            <el-table-column prop="dictLabel" label="字典标签" align="center"/>
            <el-table-column prop="" label="示例" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.isType" :type="scope.row.listClass" :effect="scope.row.theme">
                  {{ scope.row.dictLabel }}
                </el-tag>
                <el-tag v-else :color="scope.row.listClass" :effect="scope.row.theme">{{ scope.row.dictLabel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dictValue" label="字典键值" align="center"/>
            <el-table-column prop="dictSort" label="排序" align="center" width="60px"/>
            <el-table-column prop="state" label="状态" align="center">
              <template #default="scope">
                <tag dict-type="normal_disable" v-if="loadTag" :value="scope.row.state"/>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" width="180px"/>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="primary" size="mini" v-perm="['dict:data:edit']"
                           @click="handleEditData(scope.row.dictCode)" link>编辑
                </el-button>
                <popover-delete :name="scope.row.dictLabel" :type="'字典数据'" :perm="['dict:data:del']"
                                @delete="handleDeleteData(scope.row.dictCode)"/>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <paging :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :page-sizes="[10, 20, 30, 40,50]"
                :total="total" @changeSize="handleSizeChange" @goPage="handleCurrentChange"/>
      </div>
    </div>
    <!--新增/修改字典类型弹窗-->
    <el-dialog v-model="isTypeVisited" :title="typeTitle" width="700px">
      <el-form :model="form" ref="formInstance" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="字典名称" prop="dictName">
              <el-input v-model="form.dictName" placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="字典类型" prop="dictType">
              <el-input v-model="form.dictType" placeholder="请输入字典类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="form.state" size="mini">
                <el-radio v-for="dict in cacheStore.getDict('normal_disable')" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleDictTypeSubmit(formInstance)">确定</el-button>
      </span>
      </template>
    </el-dialog>

    <!--新增/修改字典数据弹窗-->
    <el-dialog v-model="isDataVisited" :title="dataTitle" width="700px">
      <el-form :model="dataForm" ref="instance" :rules="dataRules" label-width="100px">
        <el-row>
          <!--          <el-col :span="24">-->
          <!--            <el-form-item label="字典类型" prop="dictType">-->
          <!--              <el-input v-model="dataForm.dictType" placeholder="请输入字典类型" disabled></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="24">
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input v-model="dataForm.dictLabel" placeholder="请输入字典标签"></el-input>
            </el-form-item>
            <el-form-item label="字典键值" prop="dictValue">
              <el-input v-model="dataForm.dictValue" placeholder="请输入字典键值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="dictSort">
              <el-input-number v-model="dataForm.dictSort"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="dataForm.state" size="mini">
                <el-radio v-for="dict in cacheStore.getDict('normal_disable')" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="是否默认" prop="isDefault">-->
          <!--              <el-radio-group v-model="dataForm.isDefault" size="mini">-->
          <!--                <el-radio v-for="dict in [{value:0,label:'是'},{value:1,label:'否'}]" :key="dict.value" :label="dict.value">-->
          <!--                  {{ dict.label }}-->
          <!--                </el-radio>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="标签类型" prop="isType">
              <el-switch v-model="dataForm.isType" active-text="是" inactive-text="否"
                         @change="switchIsType($event,dataForm)"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签主题" prop="theme">
              <el-select v-model="dataForm.theme" placeholder="请选择显示样式">
                <el-option
                    v-for="item in tagThemeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签样式" prop="listClass">
              <el-select v-model="dataForm.listClass" placeholder="请选择显示样式" v-if="dataForm.isType">
                <el-option
                    v-for="item in tagTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <el-color-picker v-model="dataForm.listClass" v-else/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="示例">
              <el-tag v-if="dataForm.isType" :type="dataForm.listClass" :effect="dataForm.theme">
                {{ dataForm.dictLabel }}
              </el-tag>
              <el-tag v-else :color="dataForm.listClass" :effect="dataForm.theme">{{ dataForm.dictLabel }}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <span>
        <el-button @click="handleDataCancel">取消</el-button>
        <el-button type="primary" @click="handleDictDataSubmit(instance)">确定</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {getDictTypeList, getDictTypeDetails, addDictType, editDictType, delDictType} from "@/api/system/dict-type";
import {getDictDataList, addDictData, delDictData, editDictData, getDictDataDetails} from "@/api/system/dict-data";
import {Search, Refresh, Delete, Plus, Edit, Download} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useCacheStore} from "@/stores/cache.js";
import Paging from "@/components/pagination/index.vue";
import {downLoadExcel} from "@/utils/downloadZip";
import Tag from "@/components/Tag.vue";

const cacheStore = useCacheStore();
cacheStore.setCacheKey(["normal_disable"]);
//查询参数
const queryType = reactive({
  dictType: ""
});
//查询参数
const queryData = reactive({
  dictLabel: ""
});
//页面信息
const pageInfo = reactive({
  pageNum: 1,
  pageSize: 10
});
const loadTag = ref(true);
const tree = ref();
const isSearchData = ref(true);
const treeData = ref([]);
const defaultProps = {
  label: "dictName"
};
const disabled = ref(true);
const disabledDelete = ref(false);
const list = ref([]);
const loading = ref(false);
const total = ref();
const typeTitle = ref("");
const dataTitle = ref("");
const isTypeVisited = ref(false);
const isDataVisited = ref(false);
const singleTable = ref();
const form = ref();
const typeData = ref();
const dataForm = ref();
const instance = ref();
const formInstance = ref();
const formRules = ref({});
const dataRules = ref({});
const tagTypeList = ref([
  {
    value: 'primary',
    label: 'primary'
  },
  {
    value: 'success',
    label: 'success'
  },
  {
    value: 'info',
    label: 'info'
  },
  {
    value: 'warning',
    label: 'warning'
  },
  {
    value: 'danger',
    label: 'danger'
  },
]);
const tagThemeList = ref([
  {
    value: 'dark',
    label: 'dark'
  },
  {
    value: 'light',
    label: 'light'
  },
  {
    value: 'plain',
    label: 'plain'
  }
]);
const router = useRouter();

const switchIsType = (val, dataForm) => {
  if (val) {
    dataForm.listClass = 'primary'
  } else {
    dataForm.listClass = '#ecf5ff'
  }
}
//获取字典类型
const getTreeList = async () => {
  let params = {
    ...queryType,
    pageNum: 1,
    pageSize: 50
  };
  getDictTypeList(params).then(res => {
    if (res.code === 1000) {
      treeData.value = res.data.rows;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//获取字典数据
const getList = async (dictLabel, dictType) => {
  if (typeData.value !== undefined) {
    isSearchData.value = false
    let params = {
      dictLabel: dictLabel,
      dictType: dictType,
      ...pageInfo
    };
    loading.value = true;
    getDictDataList(params).then(res => {
      if (res.code === 1000) {
        loadTag.value = false
        list.value = res.data.rows;
        total.value = res.data.total;
        loading.value = false;
        nextTick(() => {
          loadTag.value = true
        })
      } else {
        ElMessage.error(res.msg);
      }
    });
  } else {
    isSearchData.value = true
  }
};
//点击字典类型,右侧表格出现字典数据
const handleNodeClick = (node) => {
  typeData.value = node.dictType;
  if (node.dictType) {
    getList('', node.dictType);
  }
};

const currentChange = (Node) => {
  localStorage.setItem("dictStore", JSON.stringify(Node));
};


//重置from表单
const restForm = () => {
  form.value = {
    dictName: null,
    dictType: null,
    state: "1"
  };
};
//重置dataFrom表单
const restDataForm = () => {
  dataForm.value = {
    dictType: typeData.value,
    dictLabel: null,
    dictValue: null,
    dictSort: 0,
    state: "1",
    // isDefault:0,
    isType: true,
    theme: 'dark',
    listClass: 'primary',
  };
};
//添加字典类型
const handleAddType = () => {
  restForm();
  typeTitle.value = "新增字典类型表";
  isTypeVisited.value = true;
};
//修改字典类型
const handleEditType = () => {
  if (tree.value.currentNode == null) {
    ElMessageBox.alert("请先在下方选择一个字典类型进行修改数据", "系统提示", {
      confirmButtonText: "确定",
      type: "warning"
    });
  } else {
    restForm();
    const dictId = JSON.parse(localStorage.getItem("dictStore")).dictId;
    //查看详情
    getDictTypeDetails(dictId).then(res => {
      if (res.code === 1000) {
        form.value = res.data;
        typeTitle.value = "编辑字典类型表";
        isTypeVisited.value = true;
      } else {
        ElMessage.error(res.msg);
      }
    });
  }
};
//删除字典类型
const handleDeleteType = () => {
  if (tree.value.currentNode == null) {
    ElMessageBox.alert("请先在下方选择一个字典类型进行删除数据", "系统提示", {
      confirmButtonText: "确定",
      type: "warning"
    });
  } else {
    const dictId = JSON.parse(localStorage.getItem("dictStore")).dictId;
    const dictName = JSON.parse(localStorage.getItem("dictStore")).dictName;
    ElMessageBox.confirm(`确认删除字典名称为${dictName}的字典类型表吗?`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      delDictType(dictId).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getTreeList();
        } else {
          ElMessage.error(res.msg);
        }
      });
    });
  }
};

//添加字典数据
const handleAddData = () => {
  if (tree.value.currentNode == null) {
    ElMessageBox.alert("请先在左边选择一个字典类型进行新增数据", "系统提示", {
      confirmButtonText: "确定",
      type: "warning"
    });
  } else {
    restDataForm();
    dataTitle.value = "新增字典数据表";
    isDataVisited.value = true;
  }
};
//修改字典数据
const handleEditData = async (dictCode) => {
  restDataForm();
  //查看详情
  getDictDataDetails(dictCode).then(res => {
    if (res.code === 1000) {
      dataForm.value = res.data
      dataTitle.value = "编辑字典数据表";
      isDataVisited.value = true;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
//删除字典数据
const handleDeleteData = async (row) => {
  delDictData(row).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg);
      getList('', typeData.value);
    } else {
      ElMessage.error(res.msg);
    }
  });
};

//取消字典类型操作弹窗
const handleCancel = () => {
  restForm();
  isTypeVisited.value = false;
};
//取消字典数据操作弹窗
const handleDataCancel = () => {
  restDataForm();
  isDataVisited.value = false;
};
//提交
const handleDictTypeSubmit = async (instance) => {
  if (!instance) return;
  instance.validate(async (valid) => {
    if (!valid) return;
    if (typeTitle.value === "新增字典类型表") {
      addDictType(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getTreeList();
          isTypeVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else if (typeTitle.value === "编辑字典类型表") {
      // cacheStore.removeDict(form.value.dictType)
      editDictType(form.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getTreeList();
          isTypeVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  })
}
//提交
const handleDictDataSubmit = async (instance) => {
  if (!instance) return;
  instance.validate(async (valid) => {
    if (!valid) return;
    if (dataTitle.value === "新增字典数据表") {
      addDictData(dataForm.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList('', typeData.value);
          isDataVisited.value = false;
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else if (dataTitle.value === "编辑字典数据表") {
      editDictData(dataForm.value).then(res => {
        if (res.code === 1000) {
          ElMessage.success(res.msg);
          getList('', typeData.value);
          isDataVisited.value = false;
          // router.go(0);
        } else {
          ElMessage.error(res.msg);
        }
      });
    }
  });

};

//导出excel
const handleExport = () => {
  downLoadExcel("/admin/dict/type/export", {...queryType});
};

//切换每页显示条数
const handleSizeChange = (val) => {
  pageInfo.pageSize = val;
  getList('', typeData.value);
};

//点击页码进行分页功能
const handleCurrentChange = (val) => {
  pageInfo.pageNum = val;
  getList('', typeData.value);
};
getTreeList();
</script>
<style scoped lang="scss">
:deep(.el-tag) {
  border-color: transparent !important;
}
</style>

