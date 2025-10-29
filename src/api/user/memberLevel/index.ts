import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IReqMevvberLevel, IUploadMemberLevelQueryParams } from './types'
const prefix = '/super'

// 获取会员等级列表
export const reqMemberLevel = (): Promise<IBaseResponse<IReqMevvberLevel[]>> => {
  return http.get('/webgw' + prefix + '/vipconfig/list')
}

// 上传会员等级
export const uploadMemberLevel = (data: IUploadMemberLevelQueryParams[]): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/vipconfig/upload', data)
}
