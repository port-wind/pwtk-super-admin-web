import http from '@/utils/http/index'
import type { Ref } from 'vue'
const prefix = 'super/'
// Query game type series list
export const list = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/list', data)
}

// Create new game type series
export const create = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/create', data)
}

// Edit game type series
export const edit = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/edit', data)
}

// Delete game type series
export const del = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/delete', data)
}

// Check if the site name exists
export const existSiteName = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/existSiteName', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/list', data)
}
export const existSiteId = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/existSiteId', data)
}

//模糊查询id信息
export const getListBlurSiteId = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/listBlurSiteId', data)
}

//模糊查询名称信息
export const getListBlurSiteName = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/listBlurSiteName', data)
}

export function useWebApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    list: (params?: any) => list(injectSiteId(params)),
    create: (params?: any) => create(injectSiteId(params)),
    edit: (params?: any) => edit(injectSiteId(params)),
    del: (params?: any) => del(injectSiteId(params)),
    existSiteName: (params?: any) => existSiteName(injectSiteId(params)),
    getNewsPaperList: (params?: any) => getNewsPaperList(injectSiteId(params)),
    existSiteId: (params?: any) => existSiteId(injectSiteId(params)),
    getListBlurSiteId: (params?: any) => getListBlurSiteId(injectSiteId(params)),
    getListBlurSiteName: (params?: any) => getListBlurSiteName(injectSiteId(params))
  }
}
