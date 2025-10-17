import http from '@/utils/http/index'
import type {
  GetRequest,
  GetResponse,
  EditRequest,
  EditResponse,
  DelRequest,
  DelResponse,
  AddRequest,
  AddResponse,
  GetByIdRequest,
  GetByIdResponse,
  updateRendSeqRequest,
  updateRendSeqResponse
} from './types'

enum api {
  GetAll = 'webgw/websiteComponent/getWebsiteComponent',
  AddOne = 'webgw/websiteComponent/addWebsiteComponent',
  EditOne = 'webgw/websiteComponent/editWebsiteComponent',
  DeleteOne = 'webgw/websiteComponent/delWebsiteComponent',
  getById = 'webgw/websiteComponent/findWebsiteComponent',
  updateRendSeq = 'webgw/websiteComponent/updatePageRenderingSeq'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqSitCom = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data, { isAdd: true })
}

// 添加域名 / webgw / domain / addDomainCon
export const addSitCom = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delSitCom = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editSitCom = (data: EditRequest) => {
  return http.post<EditResponse>(api.EditOne, data)
}
//获取组件ID和name
export const regSitById = (data: GetByIdRequest) => {
  return http.post<GetByIdResponse>(api.getById, data, { isAdd: true })
}

export const updateSitRendSeq = (data: updateRendSeqRequest) => {
  return http.post<updateRendSeqResponse>(api.updateRendSeq, data)
}
