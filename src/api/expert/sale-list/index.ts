import http from '@/utils/http/index'
import type { IGetSaleListQueryParams, IListPlayTypeData, IGetSaleListData } from './type'
import type { IBaseResponse, IResponse } from '@/api/type'

// export const getSaleList = (
//   data: IGetSaleListQueryParams
// ): Promise<IResponse<IGetSaleListData>> => {
//   return http.post('webgw/predict/saleList', data)
// }

// 玩法列表
// export const listPlayType = (): Promise<IBaseResponse<{ list: IListPlayTypeData[] }>> => {
//   //@ts-ignore
//   return http.post('/webgw/super/predict/type/listPlayType')
// }
