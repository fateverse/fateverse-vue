<template>
  <div class="app-main-container">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" type="transition" appear mode="out-in">
        <div>
          <component
            :is="Component"
            :key="route.fullPath"
          ></component>
        </div>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
</script>

<style lang="scss">
.app-main-container {
  height:calc(100vh - 130px);
  padding:0 15px;
  max-height: calc(100vh - 96px);
  overflow: auto;
  background-color: #fff;
}
.app-main-container::-webkit-scrollbar {
  width:6px;
  height: 6px;
}

// 滚动条轨道
.app-main-container::-webkit-scrollbar-track {
  background: rgb(239, 239, 239);
  border-radius: 2px;
}

// 小滑块
.app-main-container::-webkit-scrollbar-thumb {
  background: rgba(80, 81, 82, 0.29);
  border-radius: 10px;
}
/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
