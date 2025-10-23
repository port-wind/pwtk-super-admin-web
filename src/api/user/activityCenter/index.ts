import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IAddHttpQueryParams, IEditHttpQueryParmas, IReqHttpQueryParams } from './types'
const prefix = '/super'

export interface IReqHttpData {
  /** 任务ID */
  taskId: number

  /** 活动ID */
  activityId: string

  /** 活动名称 */
  activityName: string

  /** 开始时间 */
  beginTime: string

  /** 结束时间 */
  endTime: string

  /** 达人列表 */
  talents: Array<{ id: string; name: string }>

  /** URL地址 */
  url: string

  /** 路由类型 */
  routeType: string

  /** 客户端类型 */
  clientType: string

  /** 状态 */
  state: string

  /** 备注 */
  remark: string

  /** 创建时间 (格式: yyyy-MM-dd HH:mm:ss) */
  createTime: string

  /** 图片路径 */
  imgPath: string

  /** 管理站点ID */
  manageSiteId: string
}

//获取活动中心
export const reqHttp = (data: IReqHttpQueryParams): Promise<IResponse<IReqHttpData>> => {
  return http.post('/webgw' + prefix + '/activity/getUserActivity', data)
}
//编辑活动中心
export const editHttp = (data: IEditHttpQueryParmas): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/activity/editUserActivity', data)
}

//添加活动中心
export const addHttp = (data: IAddHttpQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/activity/addUserActivity', data)
}
