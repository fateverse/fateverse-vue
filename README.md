# 缘境/FateVerse

缘境后台管理系统是一套基于角色的权限管理系统, 方便用户更好的管理各项数据; 对于开发者而言, 它是一套快速开发框架

技术栈[vue@3](https://cn.vuejs.org/);[vue-router@4](https://router.vuejs.org/zh/);
[pinia@2](https://pinia.vuejs.org/zh/);[element-plus](https://element-plus.org/zh-CN/);[vite@4](https://cn.vitejs.dev/)


## 相关地址 
- 演示地址:
    1. vue版本 [http://vue.fateverse.cn/](http://vue.fateverse.cn/)
- 项目地址:
    - 前端gitee地址: [https://gitee.com/fateverse/fateverse-vue](https://gitee.com/fateverse/fateverse-vue)
    - 后端gitee地址: [https://gitee.com/fateverse/fateverse](https://gitee.com/fateverse/fateverse)
    - 前端github地址: [https://github.com/fateverse/fateverse-vue](https://github.com/fateverse/fateverse-vue)
    - 后端github地址: [https://github.com/fateverse/fateverse](https://github.com/fateverse/fateverse)


## 工程目录
```sh
public               #静态资源
src                  
|--api               #接口统一管理
|--assets            #图片,字体等静态资源
|--components        #公共组件
|--directives        #自定义指令
|--layout            #系统布局
|--router            #路由组件
|--stores            #pinia状态仓库
|--utils             #工具类文件
|--view              #页面级组件
|--App.vue           #App组件
|--main.js           #系统主入口
|--.env.development  #开发环境环境变量
|--.env.production   #生产环境环境变量
```

## 安装

```sh
npm install
```

## 本地运行

```sh
npm run dev
```

## 本地打包

```sh
npm run build
```