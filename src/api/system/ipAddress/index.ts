import http from '@/utils/http/index'

//查询 ipPrecise为true是精准查询，不传是模糊查询
export const reqHttp = (data: any) => {
  return http.post('/webgw/ip/list', data)
}
