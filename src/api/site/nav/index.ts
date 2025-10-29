import http from '@/utils/http/index'
import type {
  IFetchDomainListQueryParams,
  IDelNavigationConfigQueryParams,
  IQueryTemplatesQueryParams,
  IQueryUrlsQueryParams,
  IReqNavigationConfigData,
  IAddNavigationConfigData,
  IEditNavigationConfigData,
  IFetchTreeListData,
  IFetchTreeListByPageData,
  IResponseQueryParams,
  IFetchTreeListByPageQueryParams,
  IReqNavigationConfigQueryParams,
  IAddNavigationConfigQueryParams,
  IEditNavigationConfigQueryParams,
  IFetchTreeListQueryParams
} from './types'
import type { IResponse } from '@/api/type'
const prefix = '/super'
enum api {
  GetAll = '/webgw' + prefix + '/navigation/list',
  AddOne = '/webgw' + prefix + '/navigation/create',
  DeleteOne = '/webgw' + prefix + '/navigation/del',
  EditOne = '/webgw' + prefix + '/navigation/update',
  GetOne = '/webgw' + prefix + '/navigation/treeListByDomain',
  GetOneFamily = '/webgw' + prefix + '/navigation/familyByDomain',
  GetlistDomain = '/webgw' + prefix + '/navigation/listDomain',
  GetlistTemplates = '/webgw' + prefix + '/naviTemplate/queryTemplates',
  QueryUrls = '/webgw' + prefix + '/navigation/queryUrls',
  TreeList = '/webgw' + prefix + '/navigation/treeList',
  TreeListByPage = '/webgw' + prefix + '/navigation/treeListByPage',
  getDomainConfigBbsAndNaviga = '/webgw' + prefix + '/domain/getDomainConfigBbsAndNaviga'
}

// 获取所有导航配置
export const reqNavigationConfig = (
  data: IReqNavigationConfigQueryParams
): Promise<IResponse<IReqNavigationConfigData>> => {
  return http.post(api.GetAll, data)
}

// 添加导航配置
export const addNavigationConfig = (
  data: IAddNavigationConfigQueryParams
): Promise<IResponse<IAddNavigationConfigData>> => {
  return http.post(api.AddOne, data)
}

// 编辑导航配置
export const editNavigationConfig = (
  data: IEditNavigationConfigQueryParams
): Promise<IResponse<IEditNavigationConfigData>> => {
  return http.post(api.EditOne, data)
}

// 获取树状list
export const fetchTreeList = (data: IFetchTreeListQueryParams): Promise<IResponse<IFetchTreeListData>> => {
  return http.post(api.TreeList, data)
}
// 获取树状list
export const fetchTreeListByPage = (
  data: IFetchTreeListByPageQueryParams
): Promise<IResponse<IFetchTreeListByPageData>> => {
  return http.post(api.TreeListByPage, data)
}

// 获取单个导航配置
export const reqTreeListByDomain = (data: IFetchDomainListQueryParams) => {
  return http.post(api.GetOneFamily, data)
}
// 获取动态搜索域名
export const fetchDomainList = (data: IFetchDomainListQueryParams) => {
  return http.post(api.GetlistDomain, data)
}
// 获取动态搜索域名
export const queryTemplates = (data: IQueryTemplatesQueryParams) => {
  return http.post(api.GetlistTemplates, data)
}
// 获取动态搜索域名
export const queryDomainConfigBbsAndNaviga = (data: IQueryTemplatesQueryParams) => {
  return http.post(api.getDomainConfigBbsAndNaviga, data)
}
// 获取动态URL
export const queryUrls = (data: IQueryUrlsQueryParams) => {
  return http.post(api.QueryUrls, data)
}
// 删除导航配置
export const delNavigationConfig = (data: IDelNavigationConfigQueryParams) => {
  return http.post(api.DeleteOne, data)
}
