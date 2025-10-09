import http from '@/utils/http/index'
import type { Ref } from 'vue'

//消息维护计划管理获取列表
export const reqMaintainList = (data: any) => {
  return http.post('/webgw/maintain/list', data)
}
// 消息维护计划管理编辑
export const reqMaintainEdit = (data: any) => {
  return http.post('/webgw/maintain/edit', data)
}
// 消息维护计划管理删除
export const reqMaintainDelete = (data: any) => {
  return http.post('/webgw/maintain/delete', data)
}
// 消息维护计划管理新增
export const reqMaintainAdd = (data: any) => {
  return http.post('/webgw/maintain/add', data)
}
// 消息维护计划管理状态变更
export const reqPlanEditStatus = (data: any) => {
  return http.post('/webgw/maintain/editStatus', data)
}
// 消息维护计划模糊查询获取所有的模版ID
export const reqListScopeValues = (data: any) => {
  return http.post('/webgw/maintain/scopeValues', data)
}

//公告列表获取
export const reqAnnouncementList = (data: any) => {
  return http.post('/webgw/announcement/list', data)
}
// 公告管理编辑
export const reqAnnouncementEdit = (data: any) => {
  return http.post('/webgw/announcement/edit', data)
}
// 公告管理删除
export const reqAnnouncementDelete = (data: any) => {
  return http.post('/webgw/announcement/delete', data)
}
// 公告管理新增
export const reqAnnouncementAdd = (data: any) => {
  return http.post('/webgw/announcement/create', data)
}
// 公告管理状态变更
export const reqAnnouncementEditStatus = (data: any) => {
  return http.post('/webgw/announcement/editStatus', data)
}
// 公告模糊查询获取所有的模版ID
export const reqListBlurTemplate = (data: any) => {
  return http.post('/webgw/announcement/scopeValues', data)
}

// Add the wrapper function
export function useMessageNoticeApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => {
    console.log(manageSiteId.value, 'manageSiteId')

    return {
      ...params,
      manageSiteId: manageSiteId.value
    }
  }

  return {
    reqMaintainList: (params?: any) => reqMaintainList(injectSiteId(params)),
    reqMaintainEdit: (params?: any) => reqMaintainEdit(injectSiteId(params)),
    reqMaintainDelete: (params?: any) => reqMaintainDelete(injectSiteId(params)),
    reqMaintainAdd: (params?: any) => reqMaintainAdd(injectSiteId(params)),
    reqPlanEditStatus: (params?: any) => reqPlanEditStatus(injectSiteId(params)),
    reqListScopeValues: (params?: any) => reqListScopeValues(injectSiteId(params)),
    reqAnnouncementList: (params?: any) => reqAnnouncementList(injectSiteId(params)),
    reqAnnouncementEdit: (params?: any) => reqAnnouncementEdit(injectSiteId(params)),
    reqAnnouncementDelete: (params?: any) => reqAnnouncementDelete(injectSiteId(params)),
    reqAnnouncementAdd: (params?: any) => reqAnnouncementAdd(injectSiteId(params)),
    reqAnnouncementEditStatus: (params?: any) => reqAnnouncementEditStatus(injectSiteId(params)),
    reqListBlurTemplate: (params?: any) => reqListBlurTemplate(injectSiteId(params))
  }
}
