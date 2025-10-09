import http from '@/utils/http/index'
import type { Ref } from 'vue'
const prefix = 'super/'
// Query game type series list
export const list = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/list ', data)
}

// Create new game type series
export const create = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/create', data)
}

// Edit game type series
export const edit = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/edit', data)
}

// Delete game type series
export const del = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/delete', data)
}

// Check if the site name exists
export const existSiteName = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/existSiteName', data)
}

//模糊查询网站id列表
export const getSiteIdList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/listBlurSiteId', data)
}

//模糊查询网站名称列表
export const getSiteNameList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/listBlurSiteName', data)
}

//检查网站ID是否已存在 新增时siteId检查用，修改时site id 不能修改，修改时不调用此接口
export const existSiteId = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/existSiteId', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/list', data)
}

//模糊查询id信息
export const getListBlurSiteId = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/listBlurSiteId', data)
}

//模糊查询名称信息
export const getListBlurSiteName = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/website/guarantee/listBlurSiteName', data)
}

export function useGuaranteeApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    list: (params?: any) => list(injectSiteId(params)),
    create: (params?: any) => create(injectSiteId(params)),
    edit: (params?: any) => edit(injectSiteId(params)),
    del: (params?: any) => del(injectSiteId(params)),
    existSiteId: (params?: any) => existSiteId(injectSiteId(params)),
    existSiteName: (params?: any) => existSiteName(injectSiteId(params)),
    getListBlurSiteId: (params?: any) => getListBlurSiteId(injectSiteId(params)),
    getListBlurSiteName: (params?: any) => getListBlurSiteName(injectSiteId(params))
  }
}
