export interface IGetSSOTokenQueryParams {
  manageSiteId: string
  cid?: string
  token?: string
}

export interface IGetSSOTokenData {
  ssoToken: string
  url: string
}

export interface IReqManageSiteListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序顺序：ASC 或 DESC（可选）
  manageId?: string // 管理 ID，最大长度 128（可选）
  siteName?: string
}

export interface IReqManageSiteListData {
  manageId: string // 管理ID
  siteName: string // 管理站名
  siteStatus: 'y' | 'x' | 'n' | 'o' // 站点状态
  oapiUrl: string // oapi地址
  createTime: string // 创建时间，格式为 yyyy-MM-dd HH:mm:ss
  accessKey: string // 访问KEY
  operStatus: 'y' | 'n' // 站点运营状态
}

export interface IReqUserListPushQueryParams {
  userIds: string[] // 空数组,表示同步所有用户
  manageId: string[]
}
