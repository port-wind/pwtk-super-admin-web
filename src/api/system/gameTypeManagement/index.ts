import type { IResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { IGameInfo, IGameTypePlatformListQueryParams } from './type'

export const gameTypePlatformList = (data: IGameTypePlatformListQueryParams): Promise<IResponse<IGameInfo>> => {
  return http.post('/webgw/super/tk/gameTypePlatform/list', data)
}
export const gameTypePlatformCreate = (data: any) => {
  return http.post('/webgw/super/tk/gameTypePlatform/create', data)
}
export const gameTypePlatformUpdate = (data: any) => {
  return http.post('/webgw/super/tk/gameTypePlatform/update', data)
}
export const gameTypePlatformListAll = (data: any) => {
  return http.post('/webgw/super/tk/gameTypePlatform/listAll', data)
}
