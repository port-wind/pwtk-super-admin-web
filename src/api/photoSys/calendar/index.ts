// /webgw/game/open/date/list

import type { IBaseResponse } from '@/api/type'
import http from '@/utils/http'
import type {
  IGetOpenDateListQueryParams,
  IGetOpenDateListResponse,
  ICreateOpenDateQueryParams,
  IUpdateOpenDateQueryParams,
  IDeleteOpenDateQueryParams,
  IEditOpenDateQueryParams,
  IPushOpenDateQueryParams,
  IPushOpenDateResponse
} from './type'

/**
 * 查询开奖日期列表(yyyy-MM-dd)
 * @param data
 * @returns
 */
export const getOpenDateList = (
  data: IGetOpenDateListQueryParams
): Promise<IBaseResponse<IGetOpenDateListResponse>> => {
  return http.post('/webgw/game/open/date/list', data)
}

/**
 * 新增
 * @param data
 * @returns
 */
export const createOpenDate = (data: ICreateOpenDateQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post('/webgw/game/open/date/create', data)
}

/**
 * 更新
 * @param data
 * @returns
 */
export const updateOpenDate = (data: IUpdateOpenDateQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post('/webgw/game/open/date/update', data)
}

/**
 * 删除
 * @param data
 * @returns
 */
export const deleteOpenDate = (data: IDeleteOpenDateQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post('/webgw/game/open/date/delete', data)
}

/**
 * 增删改开奖日期接口，传list列表(yyyy-MM-dd),哪一年哪一月的数据
 * 批量修改
 * @param data
 * @returns
 */
export const editOpenDate = (data: IEditOpenDateQueryParams): Promise<IBaseResponse<boolean>> => {
  return http.post('/webgw/game/open/date/edit', data)
}

/**
 * 开奖日期信息(批量同步开奖日期到admin信息)
 * 批量修改
 * @param data
 * @returns
 */
export const pushOpenDate = (data: IPushOpenDateQueryParams): Promise<IBaseResponse<IPushOpenDateResponse>> => {
  return http.post('/webgw/game/open/date/push', data)
}
