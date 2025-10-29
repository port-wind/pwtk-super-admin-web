import http from '@/utils/http/index'

//获取所有task
export const reqHttp = (data: any) => {
  return http.post('/webgw/kvPushTask/getkvPushTask', data)
}
