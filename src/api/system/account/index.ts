import http from '@/utils/http/index'
import type {
  IReqSystemUserAccountListQueryParams,
  IReqSystemUserAccountListData,
  IReqSystemUserCreateQueryParams,
  IReqSystemUserEditQueryParams,
  IReqGoogleQueryParams,
  IReqGoogleData,
  IReqForbiddenQueryParams
} from './types'
import type { IBaseResponse, IResponse } from '@/api/type'

//账号列表接口回调
export const reqSystemUserAccountList = (
  data: IReqSystemUserAccountListQueryParams
): Promise<IResponse<IReqSystemUserAccountListData>> => {
  return http.post('/account/list', data)
}

//创建接口回调
export const reqSystemUserCreate = (data: IReqSystemUserCreateQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/account/create', data)
}

//编辑用户接口回调
export const reqSystemUserEdit = (data: IReqSystemUserEditQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/account/edit', data)
}

//获取谷歌密钥
export const reqGoogle = (data: IReqGoogleQueryParams): Promise<IBaseResponse<IReqGoogleData>> => {
  return http.post('/account/googleSecret', data)
}

//禁用 启用 接口
export const reqForbidden = (data: IReqForbiddenQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/account/forbidden', data)
}
