import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import {hasPerm } from '@/directives/permission.js'
import { fixedHeight } from './directives/fixedtableheight';

//导入图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// 引入svg图标注册脚本
import 'vite-plugin-svg-icons/register'

import '@/assets/styles/index.scss'
import '@/assets/styles/sidebar.scss'
import '@/assets/styles/echartsEditor.scss'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus,{locale: zhCn})
app.use(createPinia())
app.use(router)
app.directive('perm',hasPerm)
app.directive('tabh',fixedHeight)

app.mount('#app')
