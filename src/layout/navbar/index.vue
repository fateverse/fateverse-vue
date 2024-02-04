<template>
  <div class="navbar">
    <Hamburger></Hamburger>
    <Breadcrumb></Breadcrumb>
    <div class="right-bar">
      <div>
        <bell-socket/>
      </div>
      <div>
        <img :src="authStore.userinfo.avatar" alt="" @click.stop="handleVisitedP">
        <div v-if="visitedP">
          <ul>
            <li @click="handleToAuth">个人中心</li>
            <li @click="handleLogout">退出登录</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import Breadcrumb from './Breadcrumb.vue';
import Hamburger from './Hamburger.vue';
import {useAuthStore} from '@/stores/userstore.js'
import BellSocket from "./BellSocket.vue";

const authStore = useAuthStore()
const visitedP = ref(false)
const router = useRouter()
onMounted(() => {
  document.addEventListener('click', nullBlockClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', nullBlockClick)
})
const nullBlockClick = () => {
  visitedP.value = false
}
const handleVisitedP = () => {
  visitedP.value = !visitedP.value
}

const handleToAuth = () => {
  visitedP.value = !visitedP.value
  router.push('/auth')
}
const handleLogout = () => {
  visitedP.value = !visitedP.value
  authStore.userLogout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 65px;
  padding: 0 15px 0 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  .right-bar {
    margin-left: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    > div {
      width: 40px;
      position: relative;
    }

    > div:last-child {
      margin-left: 10px;

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid #418DFF;
      }

      > div {
        position: absolute;
        width: 80px;
        right: 0;
        z-index: 300;
        bottom: -70px;
        padding: 10px 5px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 2px 2px 2px 1px rgb(171, 167, 167);

        li {
          text-align: center;
          font-size: 14px;
          line-height: 1.5;
          cursor: pointer;

          &:hover {
            color: #79bbff;
          }
        }
      }
    }
  }
}
</style>
