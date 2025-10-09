import { createRouter, createWebHashHistory } from 'vue-router'
import Cookies from 'js-cookie'
import routes from './routers'
import i18n from '@/i18n'
// import { SSOLogin } from '@/api/super'
import { accountInfo } from '@/api'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
const { t } = i18n.global

// 白名单：不需要权限的公开路由
const publicRoutes = ['/login', '/superAdmin/ssoLogin']

// 检查认证状态
const isAuthenticated = async () => {
  const token = Cookies.get('token')
  if (!token) {
    return false
  }
  try {
    const res = await accountInfo()
    return res.success
  } catch (error) {
    return false // 处理网络错误或服务器返回异常
  }
}

// 清理所有本地数据
const clearLocalData = () => {
  Cookies.remove('token')
  Cookies.remove('cid')
  Cookies.remove('state')
  localStorage.removeItem('imgUrl')
  localStorage.removeItem('last_bbs_post_content')
}

function getHashParams(hash: string) {
  const queryString = hash.split('?')[1] // 提取问号后的查询参数部分 "token=xxx&cid=86"
  if (!queryString) return {}

  const params = new URLSearchParams(queryString) // 使用 URLSearchParams 解析
  return {
    token: params.get('token'), // 获取 token 参数
    cid: params.get('cid') // 获取 cid 参数
  }
}

// 路由拦截
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? t(to.meta.title as string) : t('login.title')
  // SSO 登录逻辑

  // 保存最后访问路径（仅对需要权限的页面）
  if (!publicRoutes.includes(to.path)) {
    if (to.path === '/404') {
      localStorage.setItem('lastVisitedPath', '/home')
    } else {
      localStorage.setItem('lastVisitedPath', to.fullPath)
    }
  }
  const auth = await isAuthenticated()
  console.log('🚀 ~ router.beforeEach ~ auth:', auth)
  // 检查 token 是否有效
  if (auth) {
    // Token 有效
    if (to.path === '/login') {
      // 已登录时访问登录页，跳转到最后访问页面或默认首页
      const lastVisitedPath = localStorage.getItem('lastVisitedPath') || '/home'
      next(lastVisitedPath)
    } else {
      next() // 其他页面放行
    }
  } else {
    // Token 失效
    clearLocalData() // 清空其他参数
    if (!publicRoutes.includes(to.path)) {
      // 非公开页面跳转到登录页
      next(`/login?redirect=${to.fullPath}`)
    } else {
      next() // 公开页面放行
    }
  }
})

export default router
