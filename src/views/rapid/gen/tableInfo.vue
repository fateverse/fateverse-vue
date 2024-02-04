<template>
  <el-form ref="tableForm" :model="info" :rules="rules" label-width="130px">
    <el-row>
      <el-col :span="11">
        <el-form-item prop="tplCategory" label="生成模板">
          <!--          <el-select v-model="info.tplCategory" @change="tplSelectChange" filterable>-->
          <el-select v-model="info.tplCategory" filterable>
            <el-option label="单表（增删改查）" value="crud"/>
            <el-option label="树表（增删改查）" value="tree"/>
            <el-option label="多表关联（增删改查）" value="rel"/>
            <el-option label="主子表（增删改查）" value="sub"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item prop="packageName" label="生成包路径">
          <el-tooltip content="生成在哪个java包下，例如 cn.odliken.system" placement="top">
          </el-tooltip>
          <el-input v-model="info.packageName"/>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="tplCategory" label="后端模板">
          <el-select v-model="info.backTemplate" filterable>
            <el-option label="Mybatis" value="0"/>
            <el-option label="Mybatis-Plus" value="1"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item prop="tplCategory" label="前端模板">
          <el-select v-model="info.frontTemplate" filterable>
            <el-option label="Vue" value="0"/>
            <el-option label="React" value="1"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="moduleName" label="生成模块名">
          <el-tooltip content="可理解为子系统名，例如 system" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input v-model="info.moduleName"/>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item prop="businessName" label="生成业务名">
          <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input v-model="info.businessName"/>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="functionName" label="生成功能名">
          <el-tooltip content="用作类描述，例如 用户" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input v-model="info.functionName"/>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item prop="parentMenuId" label="上级菜单">
          <el-tree-select v-model="info.parentMenuId" :data="menus" style="width: 100%;"
                          :filter-node-method="filterNodeMethod"
                          filterable
                          :check-strictly="true"/>
        </el-form-item>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="serviceName" label="服务名称">
          <el-tooltip content="用作类描述，例如 用户" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input v-model="info.serviceName"/>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2">
        <el-form-item prop="optionInfoEnable" label="option接口生成">
          <el-radio-group v-model="optionInfo.enabled">
            <el-radio :label="true" border>启用option接口</el-radio>
            <el-radio :label="false" border>关闭option接口</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="11" v-if="optionInfo.enabled">
        <el-form-item prop="optionInfoValueField" label="值映射">
          <el-select v-model="optionInfo.valueField">
            <el-option
                v-for="column in columns"
                :key="column.id"
                :label="column.javaField"
                :value="column.javaField">
              <span style="float: left">{{ column.javaField }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ column.columnComment }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="11" :offset="2" v-if="optionInfo.enabled">
        <el-form-item prop="optionInfoLabelFiled" label="标签映射">
          <el-select v-model="optionInfo.labelFiled">
            <el-option
                v-for="column in columns"
                :key="column.id"
                :label="column.javaField"
                :value="column.javaField">
              <span style="float: left">{{ column.javaField }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ column.columnComment }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import {defineExpose, defineProps} from "vue";
import {getMenuOpt} from '@/api/system/menuman.js'


const props = defineProps({
  info: {
    type: Object,
    default: {}
  },
  optionInfo: {
    type: Object,
    default: {
      enabled: 0
    }
  },
  tables: {
    type: Array,
    default: []
  },
  dictOptions: {
    type: Array,
    default: []
  },
  columns: {
    type: Array,
    default: []
  }
})
const menus = ref([])
const tableForm = ref()
const rules = ref({
  tplCategory: [
    {required: true, message: "请选择生成模板", trigger: "blur"}
  ],
  packageName: [
    {required: true, message: "请输入生成包路径", trigger: "blur"}
  ],
  moduleName: [
    {required: true, message: "请输入生成模块名", trigger: "blur"}
  ],
  businessName: [
    {required: true, message: "请输入生成业务名", trigger: "blur"}
  ],
  functionName: [
    {required: false, message: "请输入生成功能名", trigger: "blur"}
  ],
  backTemplate: [
    {required: true, message: "请选择后端模板", trigger: "blur"}
  ],
  frontTemplate: [
    {required: true, message: "请选择前端模板", trigger: "blur"}
  ],
  serviceName: [
    {required: true, message: "请选输入服务名称", trigger: "blur"}
  ],
  optionInfoEnable: [
    {required: true, message: "请选择前端模板", trigger: "blur"}
  ],
  optionInfoValueField: [
    {required: true, message: "请选择值映射字段", trigger: "blur"}
  ],
  optionInfoLabelFiled: [
    {required: true, message: "请选择前端模板标签映射字段", trigger: "blur"}
  ],
})

const handleSearch = async () => {
  getMenuOpt().then(res => {
    if (res.code === 1000) {
      menus.value = [{
        value: 0,
        label: "一级目录",
        children: res.data
      }]
    }
  })
}

const filterNodeMethod = (value, data) => data.label.includes(value)


defineExpose({
  tableForm
})


handleSearch()
</script>

<style scoped>

</style>
