import http from '@/utils/http/index'
import type { Ref } from 'vue'
const prefix = 'super/'
// Query game type series list
export const listGameTypeSeries = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/list', data)
}

// Create new game type series
export const createGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/create', data)
}

// Edit game type series
export const editGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/edit', data)
}

// Delete game type series
export const deleteGameTypeSeries = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/delete', data)
}

// Keeping the existing functions that are still needed
export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/list', data)
}
export const getGameTypeSeriesDetail = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/detail', data)
}

//查询目前最大的排序号
export const getMaxSortNo = (data?: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/getMaxSortNo', data)
}

//判断排序号是否存在
export const checkSortNoExist = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypeSeries/isSortNoExist', data)
}

export function useSeriesApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    getGameTypeSeries: (params?: any) => listGameTypeSeries(injectSiteId(params)),
    getGameTypeNewspaper: (params?: any) => getNewsPaperList(injectSiteId(params))
  }
}
