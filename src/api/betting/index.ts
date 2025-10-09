import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type {
  IListPayTypeCodeBodyParameter,
  IListTypeCode,
  IPredictTypeListBodyParameter,
  IGameTypePlayDetails,
  IPredictTypeEditStatusBodyParameter,
  IPredictListBodyParameter,
  IPredictionResult,
  IGameTypePlayDetailsData
} from '@/api/betting/types'

/**
 * 查询游戏类型,之后返回一级的玩法
 * @param data
 * @returns
 */
export const listPlayTypeCode = (data: IListPayTypeCodeBodyParameter): Promise<IResponse<IListTypeCode>> => {
  return http.post('webgw/super/predict/type/listPlayTypeCode', data)
}
/**
 * 查询游戏类型的列表
 * @param data
 * @returns
 */
export const predictTypeList = (data: IPredictTypeListBodyParameter): Promise<IResponse<IGameTypePlayDetails>> => {
  return http.post('webgw/super/predict/type/list', data)
}

/**
 * 修改游戏类型状态
 * @param data
 * @returns
 */
export const predictTypeEditStatus = (data: IPredictTypeEditStatusBodyParameter): Promise<IBaseResponse<never>> => {
  return http.post('webgw/super/predict/type/editStatus', data)
}

/**
 * 查询所选期刊竞猜小组的参与记录(期刊的参与记录)
 * 列表, 传参 如果data
 * @param data
 * @returns
 */
export const predictList = (data: IPredictListBodyParameter): Promise<IResponse<IPredictionResult>> => {
  return http.post('webgw/super/predict/list', data)
}

export interface IGetGameDetailByPlayTypeCode {
  playTypeCode: string
  bizFlag: 't' | 'p'
}

/**
 * Retrieves the game status details based on the provided {playTypeCode} and business flag
 * @param data - An object containing the play type code and business flag.
 * @returns A promise that resolves to a response containing the game type play details data.
 */
export const getGameDetailByPlayTypeCode = (
  data: IGetGameDetailByPlayTypeCode
): Promise<IBaseResponse<IGameTypePlayDetailsData>> => {
  return http.post('webgw/super/predict/type/listPlayTypeCodeDetail', data)
}

export interface IGetGameIssuesListQueryParams {
  year: number
  gameType: number
}
// gameTypePlatform/issueList
export const getGameIssuesList = (data: IGetGameIssuesListQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('webgw/super/tk/gameTypePlatform/issueList', data)
}
