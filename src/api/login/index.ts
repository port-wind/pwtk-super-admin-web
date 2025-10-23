import http from '@/utils/http/index'
import type { ILogin, loginData } from './types'
import type { IBaseResponse } from '../type'

enum api {
  LOGIN = '/login',
  LOGOUT = '/logout'
}

//登录接口回调
export const reqLogin = (data: loginData): Promise<IBaseResponse<ILogin>> => {
  return http.post(api.LOGIN, data, true)
}
//退出登录回调
export const reqLogout = (): Promise<IBaseResponse<never>> => {
  return http.get(api.LOGOUT)
}
// 获取验证码
export const getCaptcha = (data: any) => {
  return http.post('/base-function/captcha/get', data)
}
