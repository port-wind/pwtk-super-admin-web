import './assets/css/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// import en from 'element-plus/dist/locale/en.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import http from './utils/http'
import { setGlobalVariables } from './utils/globalVariables'
import copy from '@/components/common/copy.vue'
import NaviNestedTable from '@/views/Site/Navi/naviNestedTable.vue'
import ManageSiteSelect from '@/components/manageSiteSelect/index.vue'
import mTable from '@/components/mTable/index.vue'
import mDialog from '@/components/mDialogForm/index.vue'
import mSearch from '@/components/mSearchForm/index.vue'
import mForm from '@/components/mForm/index.vue'
import mModalForm from '@/components/modalForm/index.vue'
import mComment from '@/components/mComment/index.vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import mTabPane from '@/components/mTabPane/index.vue'
import './assets/css/global.less'

const app = createApp(App)
// 挂载全局参数
app.config.globalProperties.$i18n = i18n.global
app.config.globalProperties.$http = http

// 拷贝组件
app.component('copy', copy)
app.component('NaviNestedTable', NaviNestedTable)
app.component('manage-site-select', ManageSiteSelect)
app.component('AutoComplete', AutoComplete)
app.component('m-dialog', mDialog)
app.component('m-search', mSearch)

app.component('m-table', mTable)
app.component('m-form', mForm)
app.component('m-modal-form', mModalForm)
app.component('m-comment', mComment)
app.component('m-tab-pane', mTabPane)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(createPinia())
app.use(i18n)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
