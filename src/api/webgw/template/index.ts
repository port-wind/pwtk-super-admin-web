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
export const reqTemCom = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data, { isAdd: true })
}

// 添加域名  /webgw/domain/addDomainCon
export const addTemCom = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data, { isAdd: true })
}

// 删除域名  /webgw/domain/delDomainConfig
export const delTemCom = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data, { isAdd: true })
}

// 编辑域名  /editDomainConfig
export const editTemCom = (data: EditRequest) => {
  return http.post<EditResponse>(api.EditOne, data, { isAdd: true })
}
//获取组件ID和name
export const regTemById = (data: GetByIdRequest) => {
  return http.post<GetByIdResponse>(api.getById, data, { isAdd: true })
}

/**
 * 更新模板渲染顺序
 * @param data
 * @property {string} templateId 模板ID
 * @returns {Promise<AxiosResponse<updateRendSeqResponse>>}
 */
export const updateTemRendSeq = (data: updateRendSeqRequest) => {
  return http.post<updateRendSeqResponse>(api.updateRendSeq, data, { isAdd: true })
}
