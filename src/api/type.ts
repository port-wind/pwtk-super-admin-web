import type { ResponseType } from 'axios'

export interface BaseResponse {
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
}

export interface IBaseResponse<T> {
  data?: T
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
}

interface IData<T> {
  total: string
  list: T[]
}
export interface IResponse<T> {
  total: string
  list: any
  success: boolean // 请求是否成功
  errCode?: string // 错误码，optional
  errMessage?: string // 错误信息，optional
  data: IData<T>
}

export interface AxiosInstanceOptions {
  baseurl?: string
  contenttype?: string
  responseType?: ResponseType
  timeout?: number
  isAdd?: boolean
}

export interface IGetMobileListQueryParams {
  page: number // 页码, 默认 0
  size: number // 每页显示条数, 默认 0
  sortName?: string // 排序字段名称
  sortOrder?: 'ASC' | 'DESC' // 排序方向
  mobileCountryCode?: string // 国际区号 (最多 5 位)
  mobile?: string // 检索手机号 (最多 16 位)
}
export interface IGetMobileListData {
  id: number // 唯一标识符 (int64)
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  cid?: string // 客户 ID
  countryCode?: string // 国家代码
  mobile?: string // 手机号
  authCode?: string // 验证码
}

export interface IAccountInfoData {
  id: string
  username: string
  state: number
  createTime: number
  cc: string
  phone: string
  googleSecret: string
  roleIds: string[]
}
