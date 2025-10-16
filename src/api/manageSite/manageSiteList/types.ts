export interface SiteInfo {
  manageId: string // 管理 ID
  siteName: string // 站点名称
  siteStatus: 'y' | 'n' // 站点状态，可能的值为 'y' 或 'n'
  oapiUrl: string // OAPI URL
  accessKey: string // 访问密钥
  operStatus: 'y' | 'n' // 操作状态，可能的值为 'y' 或 'n'
  createTime: number // 创建时间（时间戳）
}

export interface IAddHttpQueryParams {
  manageId: string // Unique identifier, max length: 255
  siteName: string // Site name, max length: 128
  siteStatus: 'y' | 'n' | 'o' | 'x' // Site status: y (online), n (invalid), o (offline), x (not online), max length: 1
  oapiUrl: string // Open API URL, must match URL regex pattern, max length: 255
  accessKey: string // Access key, max length: 255
  operStatus: 'y' | 'n' // Operation status: y (operational), n (not operational), max length: 1
}

export interface IEditHttpQueryParams {
  manageId: string // Unique identifier, max length: 255
  siteName: string // Site name, max length: 128
  siteStatus: 'y' | 'n' | 'o' | 'x' // Site status: y (online), n (invalid), o (offline), x (not online), max length: 1
  oapiUrl: string // Open API URL, must match URL regex pattern, max length: 255
  accessKey: string // Access key, max length: 255
  operStatus: 'y' | 'n' // Operation status: y (operational), n (not operational), max length: 1
}
