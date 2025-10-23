import http from '@/utils/http/index'

export const listRulesConfig = (data: any): Promise<any> => {
  return http.post('webgw/expert/listRule', data)
}

export const uploadRule = (data: any): Promise<any> => {
  return http.post('/webgw/expert/uploadRule', data)
}

export const getExpertList = (data: any): Promise<any> => {
  return http.post('webgw/expert/list', data)
}

export const updateStatus = (data: any): Promise<any> => {
  return http.post('webgw/expert/updateStatus', data)
}
