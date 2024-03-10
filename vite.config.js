import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Inspect from 'vite-plugin-inspect'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      //自动导入vue相关函数
      imports: ['vue','vue-router'],

      resolvers: [
        ElementPlusResolver(),
        //自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
    }),
    Components({
      dirs: ['src/components', 'src/fvcomponents'],
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        //自动导入组件
        ElementPlusResolver()
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(__dirname, 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: 'esbuild',
    terserOptions: {
      compress: {
        drop_console: false, // 生产环境移除log
        drop_debugger: false // 生产环境禁用debugger
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8888,
    strictPort: false,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/notice-ws': {
        target: 'ws://localhost:8000/notice-ws',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
