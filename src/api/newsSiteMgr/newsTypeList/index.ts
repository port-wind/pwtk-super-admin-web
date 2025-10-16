import http from '@/utils/http/index'
import type { GetRequest, GetResponse, GetNameRequest, GetNameResponse } from './types'

enum api {
  // 根据新闻请求参数，返回所有appId
  GetAll = '/webgw/article/type/list',
  GetTreeList = '/webgw/article/type/listTree',

  // 返回新闻栏目名称列表，如果选择了新闻名称，则返回对应新闻网站的栏目，
  // 如果新闻名称没有选，则返回所有新闻网站的栏目 根据输入内容进行模糊查询，返回新闻栏目名称列表
  listTypeName = '/webgw/article/type/listTypeName',
  // 返回新闻层级列表，如果选择了新闻名称，则返回对应新闻网站的层级列表，
  // 如果新闻名称没有选，则返回所有新闻网站的层级列表 根据输入内容进行模糊查询，返回新闻层级列表,需要传入想要查询的层级
  listLevel = '/webgw/article/type/listLevel',
  //新闻站点名称
  GetName = 'webgw/article/site/app/listSiteName'
}

export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}

export const reqTreeList = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetTreeList, data)
}
//根据查询条件返回新闻站点名称
export const reqInputHttp = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.GetName, data)
}
export const reqListTypeName = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.listTypeName, data)
}
