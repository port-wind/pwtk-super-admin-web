import http from '@/utils/http/index'
import type {
  GetRequest,
  GetResponse,
  EditRequest,
  EditResponse,
  DelRequest,
  DelResponse,
  AddRequest,
  AddResponse
} from './types'

enum api {
  GetAll = 'webgw/sysComponent/getSysComponent ',
  AddOne = 'webgw/sysComponent/addSysComponent',
  EditOne = 'webgw/sysComponent/editSysComponent',
  DeleteOne = '/webgw/sysComponent/delSysComponent',
  getIdOrName = 'webgw/sysComponent/getComponentIdAndName '
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
export const regIdOrName = (data: EditRequest) => {
  return http.post<EditResponse>(api.getIdOrName, data)
}
