import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import path from 'path'
import { loadEnv, ConfigEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite' // 自动导入
import Components from 'unplugin-vue-components/vite' // 组件注册
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // elementPlus
import Icons from 'unplugin-icons/vite' // icon相关
import IconsResolver from 'unplugin-icons/resolver' // icon相关
import vueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
export default ({ mode }: ConfigEnv) => {
  const { VITE_PROXY_DOMAIN } = loadEnv(mode, process.cwd())
  // ✅ 读取 package.json
  const packageJson = JSON.parse(readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'))
  const buildTimestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)
  console.info('\n🚀 启动配置信息:')
  console.info('  Mode:', mode)
  console.info('  环境文件:', `.env.${mode}`)
  console.info('  版本号:', packageJson.version) // ← 显示版本号
  console.info('  当前时间:', new Date().toLocaleString('zh-CN'))
  console.info('─────────────────────────────────\n')

  return {
    base: './', //打包路径
    plugins: [
      process.env.NODE_ENV === 'development' && vueDevTools(),
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            buildTime: buildTimestamp,
            version: packageJson.version
          }
        }
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: fileURLToPath(new URL('./types/auto-imports.d.ts', import.meta.url)),
        resolvers: [
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({
            prefix: 'Icon'
          })
        ]
      }),
      Components({
        dirs: ['src/views', 'src/layout', 'src/components'],
        dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url)),
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ['ep'] // 重点
          })
        ]
      }),
      Icons({
        autoInstall: true
      })
    ],
    resolve: {
      alias: {
        extends: ['.js', '.jsx', '.tsx', '.json', '.vue'],
        '@': path.resolve(__dirname, './src'),
        '@config': fileURLToPath(new URL('./', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    // 启动服务配置
    server: {
      host: '0.0.0.0',
      port: 8000,
      open: false,
      https: false,
      proxy: {
        '*': {
          target: mode === 'development' ? 'http://192.168.0.198:8887' : 'https://dev-super-admin-api.pwtk.cc',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    },
    // 生产环境打包配置
    build: {
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          manualChunks(id: string | string[]) {
            if (id.includes('node_modules')) {
              const arr = id.toString().split('node_modules/')
              return arr[arr.length - 1].split('/')[0].toString()
            }
          }
        }
      }
    }
  }
}
