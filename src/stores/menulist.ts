// 菜单列表
import { getmenulist, type IMenu } from '@/api'
import { defineStore, type _GettersTree } from 'pinia'

export interface IMenuOption {
  name: string
  index: string
  path: { path: string }
  children?: IMenuOption[]
}

interface IState {
  menulist: IMenuOption[]
  rawData: IMenu[]
  roleIds: string[]
  isLoading: boolean
  error: string | null
  // labelOption: IMenuOption[]
}
interface IAction {
  getSiteMenu: () => void
  setmenu: (list: any) => void
}

export const useMenuListStore = defineStore<'menulist', IState, _GettersTree<IState>, IAction>('menulist', {
  state: (): IState => ({
    menulist: [],
    rawData: [],
    roleIds: [],
    isLoading: false,
    error: null
    // labelOption: []
  }),
  getters: {
    labelOption: (state: IState) => {
      const { rawData } = state

      return rawData.map((item) => {
        const menu: IMenuOption = {
          name: item.name,
          index: item.component,
          path: { path: item.path }
        }
        if (item.children && item.children.length > 0) {
          menu.children = item.children.map((i) => {
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
    }
  },
  actions: {
    async getSiteMenu() {
      this.isLoading = true
      this.error = null
      try {
        const res = await getmenulist()
        if (res.data) {
          this.rawData = res.data
        }

        // set menulist
        // this.menulist = res?.data!.map((item) => {
        //   const menu: IMenu = {
        //     name: item.name,
        //     index: item.component,
        //     path: { path: item.path },
        //     children: []
        //   }
        //   if (item.children && item.children.length > 0) {
        //     menu.children = item.children.map((i: any) => {
        //       const m = {
        //         name: i.name,
        //         index: i.component,
        //         path: { path: i.path },
        //         children: []
        //       }
        //       return m
        //     })
        //   }
        //   return menu
        // })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
      return Promise.resolve(true)
    },
    setmenu(list: any) {
      this.menulist = list
    }
  }
})
