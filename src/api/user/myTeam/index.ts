import http from '@/utils/http/index'
const prefix = '/super'

export const directSubUsers = (data: any) => {
  return http.post<any>('webgw' + prefix + '/user/directSubUsers', data)
}
