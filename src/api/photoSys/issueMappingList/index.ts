import http from '@/utils/http/index'
import type { Ref } from 'vue'
const prefix = 'super/'
//列表查询
export const reqIssueMappingList = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/list`, data)
}

//新增
export const addIssueMapping = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/create`, data)
}

//批量新增
export const batchAddIssueMapping = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/batchCreate`, data)
}

//编辑
export const editIssueMapping = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/update`, data)
}

//删除
export const delIssueMapping = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/del`, data)
}

//单个查询
export const getIssueMapping = (data: any) => {
  return http.post(`webgw/${prefix}issueMapping/detail`, data)
}

//图库图纸查询
export const getGameTypeSeries = (data: any) => {
  return http.post('webgw/tk/gameTypeSeries/list', data)
}

//图纸报纸查询
export const getGameTypeNewspaper = (data: any) => {
  return http.post('webgw/gameTypeNewspaper/list', data)
}

export function useIssueMappingApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    reqIssueMappingList: (params?: any) => reqIssueMappingList(injectSiteId(params)),
    addIssueMapping: (params?: any) => addIssueMapping(injectSiteId(params)),
    batchAddIssueMapping: (params?: any) => batchAddIssueMapping(injectSiteId(params)),
    editIssueMapping: (params?: any) => editIssueMapping(injectSiteId(params)),
    delIssueMapping: (params?: any) => delIssueMapping(injectSiteId(params)),
    getGameTypeSeries: (params?: any) => getGameTypeSeries(injectSiteId(params)),
    getGameTypeNewspaper: (params?: any) => getGameTypeNewspaper(injectSiteId(params)),
    getIssueMapping: (params?: any) => getIssueMapping(injectSiteId(params))
  }
}
