import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IAddHttpQueryParams, IEditHttpQueryParams, SiteInfo } from './types'
const prefix = '/super'

//获取管理站点
export const reqHttp = (data: any): Promise<IResponse<SiteInfo>> => {
  return http.post('/webgw' + prefix + '/manageSite/list', data)
}

//添加管理站点 旧的方法
// export const addHttp = (data: any) => {
//   return http.post('/webgw' + prefix + '/websiteManage/addWebsiteManage', data)
// }

//添加管理站点
export const addHttp = (data: IAddHttpQueryParams): Promise<IResponse<never>> => {
  return http.post('/webgw' + prefix + '/manageSite/create', data)
}

// //修改管理站点
// export const editHttp = (data: any) => {
//   return http.post('/webgw' + prefix + '/websiteManage/editWebsiteManage', data)
// }

export const editHttp = (data: IEditHttpQueryParams): Promise<IResponse<never>> => {
  return http.post('/webgw' + prefix + '/manageSite/edit', data)
}

//删除管理站点
export const delHttp = (data: any) => {
  return http.post('/webgw' + prefix + '/websiteManage/delWebsiteManage', data)
}
