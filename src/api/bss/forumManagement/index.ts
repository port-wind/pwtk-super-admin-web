import http from '@/utils/http/index'
import type {
  AddRequest,
  AddResponse,
  DelRequest,
  DelResponse,
  EditRequest,
  EditResponse,
  GetRequest,
  GetResponse,
  IGetBBsForumIdByIdData,
  IGetBBsForumIdByIdQueryParams
} from './types'
import type { Ref } from 'vue'
import type { IResponse } from '@/api/type'
const perfix = '/super'
enum api {
  GetAll = '/webgw' + perfix + '/bbsForum/list',
  //创建
  AddOne = '/webgw' + perfix + '/bbsForum/create',
  // 删除
  DeleteOne = '/webgw' + perfix + '/bbsForum/delete',
  //修改
  EditOne = '/webgw' + perfix + '/bbsForum/edit',

  SearchList = '/webgw' + perfix + '/bbsForum/listForPost'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const getBBsForumIdById = (data: IGetBBsForumIdByIdQueryParams): Promise<IResponse<IGetBBsForumIdByIdData>> => {
  return http.post(api.GetAll, data)
}
// 模糊搜索
export const getBBsForumIdBySearchValue = (data: any): Promise<any> => {
  return http.post(api.SearchList, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addHttp = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delHttp = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editHttp = (data: EditRequest) => {
  return http.post<EditResponse>(api.EditOne, data)
}

//精准查询
export const queryHttp = (data: any) => {
  return http.post('webgw' + perfix + '/bbsForum/getByForumIdAndMainboardId', data)
}

export function useForumApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    delHttp: (params?: any) => delHttp(injectSiteId(params)),
    addHttp: (params?: any) => addHttp(injectSiteId(params)),
    editHttp: (params?: any) => editHttp(injectSiteId(params)),
    reqHttp: (params?: any) => getBBsForumIdById(injectSiteId(params)),
    queryHttp: (params?: any) => queryHttp(injectSiteId(params))
  }
}
