import http from '@/utils/http/index'
import type { GetRequest, GetResponse, GetNameRequest, GetNameResponse } from './types'

enum api {
  //文章信息列表
  GetAll = '/webgw/article/list',
  GetName = 'webgw/article/site/app/listSiteName',
  //创建
  AddOne = '/webgw/bbsForumAttachment/create',
  // 删除
  DeleteOne = '/webgw/bbsForumAttachment/delete',
  //修改
  EditOne = '/webgw/bbsForumAttachment/edit',
  listLevelTypeName = 'webgw/article/site/app/listLevelTypeName',
  listTypeName = 'webgw/article/type/listTypeName',
  listLevelOneTypeName = 'webgw/article/listLevelOneTypeName',
  listLeveTwoTypeName = 'webgw/article/listLeveTwoTypeName',
  listLevelThreeTypeName = 'webgw/article/listLevelThreeTypeName',
  contentPage = 'webgw/article/content/page',
  filesList = 'webgw/article/files/list'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}
//根据查询条件返回新闻站点名称
export const reqInputHttp = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.GetName, data)
}

export const reqlistLevelTypeName = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.listTypeName, data)
}
export const reqListLevelOneTypeName = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.listLevelOneTypeName, data)
}

export const reqListLeveTwoTypeName = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.listLeveTwoTypeName, data)
}

export const reqListLevelThreeTypeName = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.listLevelThreeTypeName, data)
}

export const reqContentPage = (data: any) => {
  return http.post<GetNameResponse>(api.contentPage, data)
}

export const reqFilesList = (data: any) => {
  return http.post<GetNameResponse>(api.filesList, data)
}
