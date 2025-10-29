import http from '@/utils/http/index'
import type {
  AddRequest,
  AddResponse,
  DelRequest,
  DelResponse,
  EditRequest,
  EditResponse,
  GetRequest,
  GetResponse
} from './types'
import type { Ref } from 'vue'
const perfix = '/super'
enum api {
  GetAll = 'webgw' + perfix + '/bbsForumAttachment/list ',
  //创建
  AddOne = 'webgw' + perfix + '/bbsForumAttachment/create',
  // 删除
  DeleteOne = 'webgw' + perfix + '/bbsForumAttachment/delete',
  //修改
  EditOne = 'webgw' + perfix + '/bbsForumAttachment/edit'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
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

export function useAttachmentApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    delHttp: (params?: any) => delHttp(injectSiteId(params)),
    addHttp: (params?: any) => addHttp(injectSiteId(params)),
    editHttp: (params?: any) => editHttp(injectSiteId(params)),
    reqHttp: (params?: any) => reqHttp(injectSiteId(params))
  }
}
