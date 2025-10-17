import type { BaseResponse } from '@/api/type'

export interface IReqDomainQueryParams {
  manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称
  sortOrder?: SortOrder // 排序顺序
  domain?: string // 域名，Validate[max: 255]
  ownerUserId?: string // 所属用户ID，Validate[max: 20]
  websiteRef?: string // 绑定的站点ID，Validate[max: 32]
  langCodes?: string[] // 适用的语言列表，Validate[max: 255]
  areaCodes?: string[] // 适用的地区列表，Validate[max: 255]
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface IAddDomainQueryParams {
  manageSiteId: string
  appDownloadUrl: string
  statsCodeJsUrl: string
  statsCodeInit: string
  domain: string // 域名，Validate[max: 255]
  ownerUserId: string // 所属用户ID
  websiteRef?: string // 绑定的站点ID，Validate[max: 32]
  onlineServiceCode?: string // 在线客服代码，Validate[max: 255]
  keyWords?: string // 关键字，Validate[max: 255]
  isSupportSsl: string // 是否配置ssl证书，Validate[max: 1]
  cdnUrl?: string // cdn地址，Validate[max: 255]
  domainStatus?: string // 域名状态，Validate[max: 1]
  domainType?: string // 域名类型
  domainFrom?: string // 域名来源
  hasStatsCode?: string // 统计代码，Validate[max: 1]
  langCodes?: string[] // 适用的语言列表
  areaCodes?: string[] // 适用的地区列表
  landingPage?: string // 落地页
  isForceHttps?: string // 是否强制https访问
  sslExpiry?: string | null // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint?: string // 是否提示app下载
  opsManageCode?: string // ops管理代码
  memo?: string // 备注
  descriptions?: string // 网站描述
  promotionCode?: string // 默认推广码
  icon?: string // Icon图片URL
  logo?: string // Logo图片URL
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  appDownloadUrl: string
  userName?: string
  icon: any
  logo: any
  websiteInnerName: string
  createTime: string | number
  statsCodeJsUrl: string
  statsCodeInit: string
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置ssl证书
  cdnUrl: string // cdn地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  langCodes: string[] // 适用的语言列表
  areaCodes: string[] // 适用的地区列表
  landingPage: string // 落地页
  isForceHttps: string // 是否强制https访问
  sslExpiry: string // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // ops管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
}
export const initEditFormModel = (): EditRequest => ({
  appDownloadUrl: '',
  statsCodeInit: '',
  statsCodeJsUrl: '',
  domain: '', // 域名
  ownerUserId: '', // 所属用户ID
  websiteRef: '', // 绑定的站点ID
  onlineServiceCode: '', // 在线客服代码
  keyWords: '', // 关键字
  isSupportSsl: 'n', // 是否配置ssl证书
  cdnUrl: '', // cdn地址
  domainStatus: 'n', // 域名状态
  domainType: '', // 域名类型
  domainFrom: '', // 域名来源
  hasStatsCode: 'n', // 统计代码
  langCodes: [], // 适用的语言列表
  areaCodes: [], // 适用的地区列表
  landingPage: 'p', // 落地页
  isForceHttps: '', // 是否强制https访问
  sslExpiry: '', // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: 'n', // 是否提示app下载
  opsManageCode: '', // ops管理代码
  memo: '', // 备注
  descriptions: '', // 网站描述
  promotionCode: '', // 默认推广码
  icon: null, // Icon图片URL
  logo: null, // Logo图片URL
  websiteInnerName: '', // 网站内部名称
  createTime: '' // 创建时间
})
export interface EditResponse extends BaseResponse {}

export interface IDelDomainQueryParams {
  manageSiteId: string
  domain: string
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置ssl证书
  cdnUrl: string // cdn地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  areaCodes: string[] // 可以访问地区列表
  langCodes: string[] // 可以支持语言列表
  landingPage: string[] // 落地页
  isForceHttps: string // 是否强制https访问
  sslExpiry: string // ssl证书到期日期，格式: yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // ops管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
  createTime: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码 初始化代码
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'

// 定义请求参数接口
export interface IReqDomainData {
  /** 适用的地区列表，类型为数组，初始值为空数组 */
  areaCodes: string[] // array

  /** 域名，类型为字符串，初始值为空字符串 */
  domain: string // string

  /** 适用的语言列表，类型为数组，初始值为空数组 */
  langCodes: string[] // array

  /** 所属用户ID，类型为字符串，初始值为空字符串 */
  ownerUserId: string // string

  /** 页码，类型为整数，初始值为1 */
  page: number // int32

  /** 每页显示条数，类型为整数，初始值为15 */
  size: number // int32

  /** 排序字段名称，类型为字符串，初始值为"create_time" */
  sortName: string // string

  /** 排序顺序，类型为字符串，初始值为"DESC" */
  sortOrder: 'ASC' | 'DESC' // enum

  /** 站点内部名称，类型为字符串，初始值为空字符串 */
  websiteInnerName: string // string

  /** 绑定的站点ID，类型为字符串，初始值为空字符串 */
  websiteRef: string // string

  /** 站点标题，类型为字符串，初始值为空字符串 */
  websiteTitle: string // string
}

export interface IGetDomainDetailQueryParams {
  manageSiteId: string
}
export interface IGetDomainDetailData {}
export interface IGetLangCodesData {}
export interface IGetLangCodesQueryParams {
  manageSiteId: string
}
export interface IGetAreaCodesData {}
export interface IGetAreaCodesQueryParams {
  manageSiteId: string
}
export interface IGetWebsiteRefMsgByDomainData {}
export interface IGetWebsiteRefMsgByDomainQueryParams {
  manageSiteId: string
}
export interface IGetTemplateRefMsgByDomainData {}
export interface IGetTemplateRefMsgByDomainQueryParams {
  manageSiteId: string
}
export interface IGetSketchRefMsgByDomainData {}
export interface IGetSketchRefMsgByDomainQueryParams {
  manageSiteId: string
}
export interface ISetWebSiteListIdData {}
export interface ISetWebSiteListIdQueryParams {
  manageSiteId: string
}

export interface IAddDomainData {}
export interface IDelDomainData {}
export interface IEditDomainData {}
export interface IReqAllUserIDData {}

export interface IEditDomainQueryParams {
  manageSiteId: string
}
export interface IReqAllUserIDQueryParams {
  manageSiteId: string
}
