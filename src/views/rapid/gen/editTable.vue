<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <basic-info-form :info="info" ref="infoRef"/>
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="column">
        <el-table ref="columnRef" :data="columns" row-key="columnId" :max-height="tableHeight">
          <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag"/>
          <el-table-column
              label="字段列名"
              prop="columnName"
              min-width="10%"
              :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
              label="物理类型"
              prop="columnType"
              min-width="10%"
              :show-overflow-tooltip="true"
          />
          <el-table-column label="Java类型" min-width="11%">
            <template #default="scope">
              <el-select v-model="scope.row.javaType"  filterable>
                <el-option label="Long" value="Long"/>
                <el-option label="String" value="String"/>
                <el-option label="Integer" value="Integer"/>
                <el-option label="Double" value="Double"/>
                <el-option label="BigDecimal" value="BigDecimal"/>
                <el-option label="Date" value="Date"/>
                <el-option label="Boolean" value="Boolean"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="java属性" min-width="10%">
            <template #default="scope">
              <el-input v-model="scope.row.javaField"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="插入" min-width="5%">
            <template #default="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isInsert"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template #default="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isEdit"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template #default="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isList"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template #default="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isQuery"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template #default="scope">
              <el-select v-model="scope.row.queryType"  filterable>
                <el-option label="=" value="EQ"/>
                <el-option label="!=" value="NE"/>
                <el-option label=">" value="GT"/>
                <el-option label=">=" value="GE"/>
                <el-option label="<" value="LT"/>
                <el-option label="<=" value="LE"/>
                <el-option label="LIKE" value="LIKE"/>
                <el-option label="BETWEEN" value="BETWEEN"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否正则" min-width="10%">
            <template #default="scope">
              <el-select v-model="scope.row.isRegular" filterable>
                <el-option v-for="item in regularOptions"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"/>
                <span></span>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" min-width="5%">
            <template #default="scope">
              <el-checkbox true-label="1" false-label="0" v-model="scope.row.isRequired"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.htmlType" filterable>
                <el-option label="文本框" value="input"/>
                <el-option label="文本域" value="textarea"/>
                <el-option label="下拉框" value="select"/>
                <el-option label="单选框" value="radio"/>
                <el-option label="复选框" value="checkbox"/>
                <el-option label="日期控件" value="datetime"/>
                <el-option label="图片上传" value="imageUpload"/>
                <el-option label="文件上传" value="fileUpload"/>
                <el-option label="富文本控件" value="editor"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template #default="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择" >
                <el-option
                    v-for="dict in dictOption"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value">
                  <span style="float: left">{{ dict.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.label }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="table">
        <table-info :table="tables" :info="info" :columns="columns" :option-info="optionInfo" :dict-options="dictOption" ref="tableRef"/>
      </el-tab-pane>
      <el-form label-width="100px">
        <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="close()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-tabs>
  </el-card>
</template>

<script setup>
import {getTableDetail, editCodeGen} from "@/api/rapid/code-gen";
import {getRegularOpt} from "@/api/rapid/regular";
import {getDictOption} from "@/api/system/dict-type";
import BasicInfoForm from "./basicInfoForm.vue"
import TableInfo from './tableInfo.vue'
import {ElMessage} from "element-plus";

const router = useRouter()
const params = reactive(router.currentRoute.value.params)

const activeName = ref("column")
const columns = ref([])
const info = ref([])
const regularOptions = ref([])
const tables = ref([])
const dictOption = ref([])
const optionInfo = ref()
const tableHeight = ref(document.documentElement.scrollHeight - 245 + 'px')

const getRegularOption = async () => {
  getRegularOpt().then(res => {
    if (res.code === 1000) {
      let def = [{
        value: 0,
        label: "无"
      }]
      def.push(...res.data)
      regularOptions.value = def
    }
  })
}

const getInfo = async () => {
  getDictOption().then(res => {
    if (res.code === 1000) {
      dictOption.value = res.data
      getDetail()
    }
  })
}

const submitForm = async () => {
  const infoData = {...info.value}
  infoData.optionInfo = {...optionInfo.value}
  const obj = {
    ...infoData,
    columns: [...columns.value]
  }
  await editCodeGen(obj).then(res => {
    if (res.code === 1000) {
      ElMessage.success(res.msg)
      return
    }
    ElMessage.error(res.msg)
  })
}
const getDetail = async () => {
  getTableDetail(params.tableId).then(res => {
    if (res.code === 1000) {
      columns.value = res.data.columns
      info.value = res.data.info
      tables.value = res.data.tables
      optionInfo.value = res.data.optionInfo
    }else {
      ElMessage.error(res.msg)
    }
  })
}


const close = async () => {
  router.push({
    path: '/rapid/gen',
  })
}

const getFormPromise = async (form) => {
  return new Promise(resolve => {
    form.validate(res => {
      resolve(res);
    });
  });
}

getRegularOption()

getInfo()


</script>

<style scoped>

</style>
