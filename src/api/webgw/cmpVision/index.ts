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
  GetAll = 'webgw/templateComponent/getTemplateComponent',
  AddOne = 'webgw/templateComponent/addTemplateComponent',
  EditOne = 'webgw/templateComponent/editTemplateComponent',
  DeleteOne = 'webgw/templateComponent/delTemplateComponent',
  getById = 'webgw/templateComponent/getComponentList',
  updateRendSeq = 'webgw/templateComponent/updatePageRenderingSeq'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqSysCom = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addSysCom = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delSysCom = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editSysCom = (data: EditRequest) => {
  return http.post<EditResponse>(api.EditOne, data)
}
//获取组件ID和name
export const regById = (data: GetByIdRequest) => {
  return http.post<GetByIdResponse>(api.getById, data)
}

export const updateRendSeq = (data: updateRendSeqRequest) => {
  return http.post<updateRendSeqResponse>(api.updateRendSeq, data)
}
