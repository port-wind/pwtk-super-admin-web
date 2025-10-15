import http from '@/utils/http/index'
//推广码查询
export const reqPromotionCode = (data: any) => {
  return http.post('/account/search', data)
}
