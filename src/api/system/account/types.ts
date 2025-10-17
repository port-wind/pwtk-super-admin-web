export interface IReqSystemUserAccountListQueryParams {
  page: number // Page number, required, default 0
  size: number // Items per page, required, default 0
  sortName?: string // Field name to sort by, optional
  sortOrder?: 'ASC' | 'DESC' // Sort direction, optional, defaults to ASC
  username?: string // Optional username filter
  state?: number // Optional state filter 1 开启 0 关闭
}

export interface IReqSystemUserAccountListData {
  id: number // int64 - Unique identifier
  username: string // Username
  state: number // int32 - User status (0: disabled, 1: normal)
  createTime: string // Creation time in format 'yyyy-MM-dd HH:mm:ss'
  cc: string // Country code (international phone code)
  phone: string // Phone number
  originPhone: string // Original phone number
  googleSecret: string // Google authentication secret
  roleIds: number[] // Array of role IDs
  creditLimit: number // int64 - Credit limit
  creditLimitOneTime: number // int64 - Maximum one-time transfer limit
  maxCreditLimit: number // int64 - Maximum credit limit
  modifyTime: string // Modification time in format 'yyyy-MM-dd HH:mm:ss'
}

export interface IReqSystemUserCreateQueryParams {
  username: string // Required - Username
  password: string // Required - Password
  passwordRety?: string // 不要提交
  cc?: string // Optional - Country code (international phone code)
  phone?: string // Optional - Phone number
  roleIds?: number[] // Optional - Array of role IDs (role collection)
}

export interface IReqSystemUserEditQueryParams {
  id: number // Required - int64 - User ID, default 0
  roleIds?: number[] // Optional - Array of role IDs (role collection)
  cc?: string // Optional - Country code (international phone code)
  phone?: string // Optional - Phone number
  googleSecret?: string // Optional - Google authentication secret key
  password?: string // Optional - Password
  passwordRety?: string
}

export interface IReqGoogleQueryParams {
  accountId: string
  cc: string
  phone: string
}
export interface IReqGoogleData {
  googleSecret: string
  qrCode: string
}

export interface IReqForbiddenQueryParams {
  id: string
  state: number
}
