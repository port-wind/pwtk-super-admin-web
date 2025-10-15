import http from '@/utils/http/index'
const prefix = 'super/'
export const create = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/create', data)
}

export const del = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/del', data)
}

export const update = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/update', data)
}

export const list = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/list', data)
}

export const getDetailById = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/getDetailByNewspaperCode', data)
}

export const updateStatusApi = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/updateStatus', data)
}

export const listBySeriesCode = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/listBySeriesCode', data)
}
export const getSerialAndGroup = (data: { seriesCode?: string; id?: string }) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/getSerialAndGroup', data)
}

export const allListBySeriesCode = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/allListBySeriesCode', data)
}

export const checkNewsCode = (data: any) => {
  return http.post<any>('webqw/' + prefix + 'gameTypeNewspaper/checkNewsCode', data)
}

export const getRecommendTop = (data: any): any => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/getRecommendTop', data)
}

export const editRecommendTop = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/editRecommendTop', data)
}

export const updateRecommend = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/updateRecommend', data)
}
