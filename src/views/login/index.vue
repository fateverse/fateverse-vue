<template>
  <div class="login-box">
    <el-form
    :model="loginForm"
    ref="formInstance"
    :rules="rules"
    label-width="65px"
    >
      <h3>FateVerse</h3>
      <el-form-item prop="username" label="账号">
        <el-input v-model="loginForm.username" :prefix-icon="User" ></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="loginForm.password" type="password" :prefix-icon="Lock" ></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码" >
        <div class="code">
          <el-input v-model="loginForm.code" :prefix-icon="key" @keyup.enter.native="handleLogin(formInstance)"></el-input>
          <img :src="codeImg" alt="" @click="getCode">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin(formInstance)"  type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getCodeImg } from '../../api/login';
import { useAuthStore } from '@/stores/userstore'
import { ElLoading } from 'element-plus'
import { User,Lock, Key } from '@element-plus/icons-vue'
const router = useRouter()
const authStore = useAuthStore()
const loginForm = reactive({
  username: 'admin',
  password: '123456',
  code: '',
  uuid: ''
})
const codeImg = ref('')
const formInstance = ref()
const rules =  reactive({
  username: [
    { required: true, message: '请输入账户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ]
})

//获取二维码
const getCode = () => {
  getCodeImg().then(res=>{
    loginForm.uuid = res.data.uuid
    codeImg.value = 'data:image/gif;base64,' + res.data.img
  })
}

const handleLogin = (instance) => {
  if(!instance) return
  instance.validate( async (valid, fields)=>{
    if (!valid) return
    // 发送请求
    await authStore.userLogin(loginForm).then(res=>{
      if (res) {
        ElLoading.service({
          lock: true,
          text: '登录中...',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        router.push('/')
      } else {
        getCode()
      }
    })
  })
}

getCode()

onBeforeUnmount(() => {
  ElLoading.service({
    lock: true,
    text: '登录中...',
    background: 'rgba(0, 0, 0, 0.7)',
  }).close()
})
</script>

<style lang="scss" scoped>
.login-box {
  height: 100%;
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  display: flex;
  justify-content: center;
  align-items: center;

  .el-form {
    padding: 12px 15px;
    border-radius: 12px;
    width: 25%;
    background-color: #fff;

    h3 {
      width: 100%;
      text-align: center;
      margin-bottom: 15px;
    }

    .el-button {
      width: 100%;
    }
  }
}
.code {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .el-input {
    // width: ;
    flex: 2;
  }
  img {
    height: 32px;
    flex: 1;
  }
}
</style>
