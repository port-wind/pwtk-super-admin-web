import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import { ref } from 'vue'
import { reqLogin } from '@/api/login'
import { useManageSiteStore } from './manageSiteStore'
import { getmenulist } from '@/api/index'
import { useMenuListStore } from './menulist'

interface IMenu {
  name: string
  index: string
  path: { path: string }
  children?: IMenu[]
}

const menuliststore = useMenuListStore()
const menulist = ref<IMenu[]>([])
const manageSiteStore = useManageSiteStore()
// 获取菜单列表
const fetchMenuList = async () => {
  try {
    const res = await getmenulist()
    if (res.success) {
      menulist.value = res?.data!.map((item: any) => {
        const menu: IMenu = {
          name: item.name,
          index: item.component,
          path: { path: item.path }
        }
        if (item.children && item.children.length > 0) {
          menu.children = item.children.map((i: any) => {
            const m = {
              name: i.name,
              index: i.component,
              path: { path: i.path }
            }
            return m
          })
        }
        return menu
      })
      menuliststore.setmenu(menulist.value)
    }
  } catch (error) {}
}

export const useUserInfoStore = defineStore('userInfo', {
  actions: {
    async login(reqData: any, router: any, route: any) {
      const res = await reqLogin(reqData)

      if (res.data && res.data.token) {
        Cookies.set('cid', reqData.cid, { expires: new Date(res.data.expireTime) })
        Cookies.set('token', res.data.token, {
          expires: new Date(res.data.expireTime)
        })
        Cookies.set('manageSiteId', res.data.manageSiteId!, {
          expires: new Date(res.data.expireTime)
        })
        console.log(res.data)

        manageSiteStore.setManageSiteId(res.data.manageSiteId!)
      }
      // 获取目录权限
      await fetchMenuList()

      if (res.success) {
        const redirect = route.query.redirect || localStorage.getItem('lastVisitedPath') || '/home'
        router.push(redirect)
      } else {
        ElMessage({
          type: 'error',
          message: res.errMessage
        })
      }
    }
  }
})
