import http from '@/utils/http/index'

//用户支付订单列表
export const reqPaymentList = (data: any) => {
  return http.post('/webgw/payment/list', data)
}

//人工到账确认
export const confirmPayment = (data: any) => {
  return http.post('/webgw/payment/confirm', data)
}

//管理端取消未支付的订单
export const cancelPayment = (data: any) => {
  return http.post('/webgw/payment/cancel', data)
}
