import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IGetAllCustomerTagsData } from './types'
const prefix = '/super'

// 获取用户标签列表
export const reqCustomerTags = (params: any) => {
  return http.post('/webgw' + prefix + '/userTag/list', { ...params })
}

// 上传用户标签
export const uploadCustomerTags = (data: any) => {
  return http.post('/webgw' + prefix + '/userTag/upload', data)
}

interface IUpdateCustomerTagsQueryParams {}

// 更新用户标签
export const updateCustomerTags = (data: IUpdateCustomerTagsQueryParams): Promise<IResponse<any>> => {
  // 后台需要以数组形式接受参数
  return http.post('/webgw' + prefix + '/userTag/update', [data])
}

// 获取所有用户标签
export const getAllCustomerTags = (): Promise<IResponse<IGetAllCustomerTagsData>> => {
  return http.get('/webgw' + prefix + '/userTag/getAllGroupByType')
}

interface IUploadCustomerTagsRelationQueryParams {
  userId: number // 用户 ID (int64)
  userTagList?: number[] // 用户标签列表 (可选，数组类型)
}
// 上传用户标签关系
export const uploadCustomerTagsRelation = (data: IUploadCustomerTagsRelationQueryParams): Promise<IResponse<any>> => {
  return http.post('/webgw' + prefix + '/userTag/uploadTagRelation', data)
}
