import { reqHttp } from '@/api/manageSite/manageSiteList'
import type { SiteInfo } from '@/api/manageSite/manageSiteList/types'
import { defineStore } from 'pinia'
import { setGlobalVariables } from '@/utils/globalVariables'
interface IState {
  manageSiteList: SiteInfo[]
  isLoading: boolean
  error: string | null
  manageSiteId: string
}

export const useManageSiteStore = defineStore('ManageSiteStore', {
  state: (): IState => ({
    manageSiteList: [],
    isLoading: false,
    error: null,
    manageSiteId: ''
  }),
  actions: {
    async getAllManageSiteInfo() {
      this.isLoading = true
      this.error = null
      try {
        const res = await reqHttp({
          page: 1,
          size: 999,
          sortName: 'create_time',
          sortOrder: 'DESC'
        })
        this.manageSiteList = res.data.list.map((val) => {
          return {
            label: val.siteName,
            value: val.manageId,
            ...val
          }
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    },
    resetState() {
      // 添加重置状态的方法
      this.manageSiteList = []
      this.isLoading = false
      this.error = null
      setGlobalVariables('manageSiteId', '')
    },
    setManageSiteId(id: string) {
      this.manageSiteId = id
      setGlobalVariables('manageSiteId', id)
    }
  }
})
