import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
const prefix = '/super'
export interface IReqClientListQueryParams {
  manageSiteId: string
  page: number // 页码 (int32)
  size: number // 每页显示条数 (int32)
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  cid?: string // 客户端 ID (最大长度: 128)
  searchId?: string // 检索 ID (内容为用户 ID 或登录 ID，最大长度: 20)
  businessType?: 'S_WEB' | 'C_APP' | 'C_WEB' | 'C_H5' | 'L' // 客户端类型 (可选)
  regIP?: string // 注册 IP (可选)
  regStartTime?: string // 注册开始时间 (格式: yyyy-MM-dd HH:mm:ss, 可选)
  regEndTime?: string // 注册结束时间 (格式: yyyy-MM-dd HH:mm:ss, 可选)
}
export interface IReqClientListData {
  cid: string // 客户 ID
  ua: string // 用户代理
  regIP: string // 注册 IP
  regTime: number // 注册时间 (时间戳)
  businessType: string // 业务类型
  clientFlag: 'h' | 'w' // 客户端标志 ('h' 表示 H5, 'w' 表示 Web)
  os: string // 操作系统
  lastUserId: string // 最后用户 ID
  lastUserLoginId: string // 最后用户登录 ID
}
//获取客户端列表
export const reqClientList = (data: IReqClientListQueryParams): Promise<IResponse<IReqClientListData>> => {
  return http.post('/webgw/userDevice/list', data)
}

//获取匿名期数
export const reqListDeviceVoteIssue = () => {
  return http.get('/webgw' + prefix + '/vote/listDeviceVoteIssue')
}
