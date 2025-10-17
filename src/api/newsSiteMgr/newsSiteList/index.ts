import http from '@/utils/http/index'
import type { GetRequest, GetResponse, GetNameRequest, GetNameResponse } from './types'

enum api {
  GetAll = 'webgw/article/site/app/list',
  GetName = 'webgw/article/site/app/listSiteName'
  //创建
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}

//根据查询条件返回新闻站点名称
export const reqInputHttp = (data: GetNameRequest) => {
  return http.post<GetNameResponse>(api.GetName, data)
}
