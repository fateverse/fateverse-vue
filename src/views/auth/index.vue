<template>
  <div class="my">
    <el-row :gutter="20">
      <el-col :span="10" :xs="24">
        <el-card class="box-card1">
          <!-- 标题 -->
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>
          <div class="userDetail">
            <!-- 头像上传 -->
            <div class="userImg">
              <el-image class="avatar" :src="userParams.avatar" fit="fill"/>
            </div>
            <div class="userInfo_item">
              <el-icon>
                <UserFilled />
              </el-icon>
              用户呢称: <span>{{ userParams.nickName }}</span>
            </div>
            <div class="userInfo_item"><el-icon>
              <Iphone />
            </el-icon>电话号码: <span>{{ userParams.phoneNumber }}</span> </div>
            <div class="userInfo_item"><el-icon>
              <Message />
            </el-icon>用户邮箱:<span>{{ userParams.email }}</span> </div>
            <div class="userInfo_item"><el-icon>
              <HomeFilled />
            </el-icon>所属部门: <span>{{ userParams.city }}</span> </div>
            <div class="userInfo_item"><el-icon>
              <OfficeBuilding />
            </el-icon>所属角色: <span>{{ userParams.createBy }}</span> </div>
            <div class="userInfo_item"><el-icon>
              <Calendar />
            </el-icon>创建日期:<span>{{ userParams.loginDate }}</span> </div>
          </div>
          <div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <el-card class="box-card">
          <!-- 标题 -->
          <template #header>
            <div class="card-header">
              <span>基本资料</span>
            </div>
          </template>

          <el-tabs class="demo-tabs" v-model="activeName">
            <el-tab-pane label="基本资料" name="first" >
              <el-form
                  :model="userParams"
                  label-width="120px"
                  class="demo-ruleForm"
              >
                <el-form-item label="用户昵称" prop="userName" :required="true" style="text-align:left">
                  <el-input  v-model="userParams.nickName"/>
                </el-form-item>
                <el-form-item label="手机号码"  :required="true" style="text-align:left">
                  <el-input v-model="userParams.phoneNumber"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :required="true" style="text-align:left">
                  <el-input v-model="userParams.email"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="userParams.sex">
                    <el-radio label="0">男</el-radio>
                    <el-radio label="1">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submit">保存</el-button>
                  <el-button @click="close">关闭</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form label-width="120px" :model="userPassword">
                <el-form-item label="旧密码" :required="true" style="text-align:left">
                  <el-input placeholder="请输入旧密码" v-model="userPassword.oldPassWord"/>
                </el-form-item>
                <el-form-item label="新密码" :required="true" style="text-align:left">
                  <el-input placeholder="请输入新密码" v-model="userPassword.newPassWord"/>
                </el-form-item>
                <el-form-item label="确认密码" :required="true" style="text-align:left">
                  <el-input placeholder="请确认新密码" v-model="userPassword.querenPassWord"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submit2">保存</el-button>
                  <el-button @click="close">关闭</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import {getUserInfo} from '@/api/login';
import {ref} from "vue";
import {modifyUser} from '@/api/auth/auth'
import { ElMessage } from 'element-plus'
import { useTagsView } from '@/stores/tagsview.js'
var userParams = ref({})
var userPassword=ref({
  oldPassWord:'',
  newPassWord:'',
  querenPassWord:''
})
const activeName = ref('first')
const tagsViewStore = useTagsView()
const getuserinfo=async ()=>{
  await getUserInfo().then(res=>{
    userParams.value=res.data.user
  })
}

// 修改资料
const submit=async ()=>{
  await modifyUser({
    userName:userParams.value.userName,
    nickName:userParams.value.nickName,
    phoneNumber:userParams.value.phoneNumber,
    email:userParams.value.email,
    sex:userParams.value.sex,
    userId:userParams.value.userId
  }).then(res=>{
    console.log(res)
  })
}
// 修改密码
const submit2=async ()=>{
  await getUserInfo().then( res=>{
    if(res.data!=''){
      console.log(res.data.user.password)
      if (userPassword.value.oldPassWord==res.data.user.password && userPassword.value.newPassWord==userPassword.value.querenPassWord){
        modifyUser({
          userName:userParams.value.userName,
          nickName:userParams.value.nickName,
          password:userPassword.value.newPassWord,
          userId:userParams.value.userId
        }).then(res=>{
          ElMessage({
            message: '修改密码成功',
            type: 'success',
          })
        })
      }else if(userPassword.value.oldPassWord!=res.data.user.password && userPassword.value.newPassWord==userPassword.value.querenPassWord){
        ElMessage({
          message: '旧密码错误',
          type: 'error',
        })
      }else if(userPassword.value.oldPassWord==res.data.user.password && userPassword.value.newPassWord!=userPassword.value.querenPassWord){
        ElMessage({
          message: '新密码与确认密码不同',
          type: 'error',
        })
      }
    }else{
      ElMessage({
        message: '请求错误',
        type: 'error',
      })
    }


  })
}
// 关闭
const close = () => {
  tagsViewStore.delVisitedViews({
      path:"/auth",meta:{hidden: false, title: '个人中心', breadcrumb: true}})
}
onMounted(()=>{
  getuserinfo()
})
</script>
<style lang="scss">
body,div {
  margin: 0;
  padding: 0;
}

.my {
  margin: 0 auto;
  margin-top: 20px;
    .userDetail {
      .userImg {
        height: 170px;
        text-align: center;
        border-bottom-style: solid;
        border-color: #daddd2;
        border-width: 1px;
        .avatar {
          width: 150px;
          height: 150px;
          border-radius: 50%;
        }
      }
    }
    .userInfo_item {
      height: 40px;
      border-bottom-style: solid;
      border-color: #daddd2;
      border-width: 1px;
      text-align: left;
      line-height: 40px;
    }

    .userInfo_item > span {
      float: right;
    }
  }

</style>