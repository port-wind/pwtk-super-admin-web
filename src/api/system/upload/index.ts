import http from '@/utils/http/index'
import type { AddRequest, AddResponse, GetRequest, GetResponse, IFileUploadParams, IUploadRequestConfig } from './types'
import type { IBaseResponse, IResponse } from '@/api/type'

enum api {
  //单个文件上传
  UploadSingle = '/upload/single',
  GetAll = '/webgw/uploadHistory/list',
  AddOne = '/webgw/uploadHistory/add'
}

// 单个文件上传
export const uploadSingle = (
  data: FormData,
  uploadRequestConfig: IUploadRequestConfig
): Promise<IBaseResponse<{ path: string; size: string }>> => {
  return http.post(api.UploadSingle, data, uploadRequestConfig)
}

export const reqHttp = (data: GetRequest) => {
  return http.post<GetResponse>(api.GetAll, data)
}

export const addHttp = (data: AddRequest) => {
  return http.post<AddResponse>(api.AddOne, data)
}
