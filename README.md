# admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build:test/build:pro
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## 打包
pnpm run build:test/build:pro

## 代码格式化 (提交之前)
pnpm run format

## 按钮颜色定义
新增/启用 type="success"
禁用/删除 type="danger"
查询/详情/编辑 type="primary"
重置/取消 type="info"

## 命名规则和文件夹存放
全驼峰命名
api ---------- 对应页面文件夹
   -- home
      -- index.ts 存放全局公用接口
      -- type.ts
assets ------- 存放静态文件
commponents -- 存放公共组件
   -- common全局定义
   -- 单个组件文件夹
layout ------- 布局
locales ------ 国际化配置文件
i18n    ------ 国际化i18n调用
router ------- 路由
stores ------- 持久化
styles ------- 公共样式
utils -------- 请求相关
views -------- 页面
   -- 模块对应文件夹(首字母大写) --       -- Home
      -- 本模块组件文件夹 --------           -- echarts
         -- 组件页面-------------               -- index.vue
      -- 本模块页面 --------------           -- index.vue
types -------- 组件自动按需导入

## 路由规则
后台接口传递动态路由：
1、管理后台->资源管理->添加资源/编辑
2、router/index.ts
   {
      path: '/home',
      name: 'home',
      component: () => import('@/views/Home/echarts/index.vue')
   }

## 所有类型下拉框(select 封装，自动导入)
使用 ----- 系统管理->数据字典->添加字典/编辑
请求接口 -- /super-admin/dict/getDictByType
组件 ----- src/components/common/selectType.vue
传入数组typeArrayList(优先级)/接口请求typeString
<select-type :typeArrayList="userStateArray" :typeString="'userState'" :placeholderString="'账户状态'" @value="userState" :isMultiple="true" ref="operateStateRef"></select-type>

## 区号选择下拉框
组件 ----- src/components/common/selectCode.vue
<select-code :toValue="Phonevalue" @getValue="phoneCode" ref="phoneValueRef"></select-code>

## 加载中
v-loading="isLoading"

## 请求数据回调规范
// 数据列表
const data = ref([])
// 分页总数
const total = ref(0)
// 加载中
const isLoading = ref(false)
const getData = (val) => {
  isLoading.value = true
  const params = {}
  API({ id: val ? val : id, ...params}).then((res) => {
    if (res.success && res.data) {
      if (res.data.list) {
        data.value = res.data.list.map()
      } else {
        data.value = []
      }
      total.value = res.data.total ? res.data.total : 0
    }
    isLoading.value = false
  })
}

## 添加权限判断 per.includes('account:edit')


## 2024-11月修改

### 项目启动变更
* 启动使用 npm run dev
* 也可以用 npm run test 

* 两个区别是,分别访问公司本地服务器,或者远端域名服务器.

* 部署命令只使用 npm run build, 默认就是production , 移除掉build:prod, 还保留 build:test

外部配置变量都放在webConfigApi.js里
apiPath 和 .env.* 里面的VITE_PROXY_DOMAIN  是等价,都是指向API服务器

webConfigApi.js 变更后需要更改一下版本号,当时时间戳即可,在index.html

```

   <script src="/webConfigApi.js?t=202411302200"></script>

```