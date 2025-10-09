// 定义查询参数的接口
export interface ISketchListQueryParams {
  manageSiteId: string // 站点 ID
  sketchCode: string // 草图代码
  sketchType: string // 草图类型
  sketchName: string // 草图名称
  langCodes: string[] // 语言代码数组
  areaCodes: string[] // 地区代码数组
  sortOrder: 'ASC' | 'DESC' // 排序顺序
  sortName: string // 排序字段名称
  page: number // 当前页码
  size: number // 每页大小
}
// 定义单个草图的类型
export interface ISketchData {
  sketchCode: string // 草图代码
  sketchName: string // 草图名称
  /**
   *  'nav'   |  'tk'   |  'bbs'   |  'news'   |  'soft-download'   |  'apk-download'   |  'ipa-download'   |  'spa'   |  'movies' // 必填，最大长度 32
   */
  sketchType: string // 草图类型
  langCodes: string[] // 语言代码数组
  memo: string // 备注
  areaCodes: string[] // 地区代码数组
  // createTime: number // 创建时间（时间戳）
  sketchStatus: 'y' | 'n' // 草图状态，'y' 表示启用，'n' 表示禁用
}

export interface ITemplateListQueryParams {
  /**  站点网站ID   */
  manageSiteId?: string
  /**  系统模板标识   */
  isSysTemplate: null | boolean // 假设可以是 null 或 boolean
  /**  拥有者名称   */
  ownerName: string
  /**  拥有者用户ID   */
  ownerUserId: string
  /**  草图代码   */
  sketchCode: string
  /**  排序字段名称   */
  sortName: string
  /**  排序顺序   * 可选值为 "ASC" 或 "DESC" */
  sortOrder: 'ASC' | 'DESC'
  /**  模板ID   */
  templateId: string
  /**  模板名称   */
  templateName: string
  /**  当前页码   */
  page: number
  /**  每页大小   */
  size: number
}

export interface ITemplateListData {
  /**
   * 模版ID
   */
  templateId: string

  /**
   * 模版名称
   */
  templateName: string

  /**
   * 模版草图代码
   */
  sketchCode: string

  /**
   * 草图名称
   */
  sketchName: string

  /**
   * 创建时间
   */
  createTime: Date // 使用 Date 类型来表示 LocalDateTime

  /**
   * 引用的系统模版ID
   */
  sysTemplateRef: string

  /**
   * 引用的系统模版ID名称
   */
  sysTemplateRefName: string

  /**
   * 是否系统模版
   */
  isSysTemplate: string

  /**
   * 用户ID
   */
  ownerUserId: number // 使用 number 类型来表示 Long

  /**
   * loginId
   */
  loginId: string

  /**
   * 在线客服代码
   */
  onlineServiceCode: string

  /**
   * 主题
   */
  theme: string

  /**
   * 登录方式
   */
  loginStyle: string[]

  /**
   * 支持的第三方登录方式
   */
  thirdLoginStyle: string[]

  /**
   * 备注
   */
  memo: string

  /**
   * 模版状态 (y, 启用; n, 关闭; m, 维护)
   */
  templateStatus: string

  /**
   * cdn地址
   */
  cdnUrl: string

  /**
   * 是否有统计代码
   */
  hasStatsCode: string

  /**
   * 统计代码JS URL
   */
  statsCodeJsUrl: string

  /**
   * 统计代码初始化代码
   */
  statsCodeInit: string
}

export interface ISketchCodeQueryParams {
  manageSiteId: string
  sketchCode: string
}

export interface ISketchEditQueryParams {
  manageSiteId: string
}

/**
 * 创建 草图信息接口
 */
export interface ISketchCreateQueryParams {
  manageSiteId: string
  /**
   * 草图编码
   * 验证规则: 正则表达式 ^[A-Za-z0-9-_]+$; 最大长度: 8
   */
  sketchCode: string // 必填，最大长度 8，符合正则表达式

  /**
   * 草图名称
   * 验证规则: 最大长度: 32
   */
  sketchName: string // 必填，最大长度 32

  /**
   * 草图类型
   * 验证规则: 最大长度: 32
   * 'nav' | 'tk' | 'bbs' | 'news' | 'soft-download' | 'apk-download' | 'ipa-download' | 'spa' | 'movies'
   */
  sketchType: 'nav' | 'tk' | 'bbs' | 'news' | 'soft-download' | 'apk-download' | 'ipa-download' | 'spa' | 'movies' // 必填，最大长度 32

  /**
   * 适用的语言列表
   * 验证规则: 最大长度: 255
   */
  langCodes?: string[] // 可选，最大长度 255

  /**
   * 备注
   * 验证规则: 最大长度: 255
   */
  memo?: string // 可选，最大长度 255

  /**
   * 适用的地区列表
   * 验证规则: 最大长度: 255
   */
  areaCodes?: string[] // 可选，最大长度 255

  /**
   * 草图状态
   * 验证规则: 最大长度: 1
   */
  sketchStatus: string // 必填，最大长度 1
}
export interface ISketchCodeDeleteQueryParams {
  manageSiteId: string
  /**
   * 是
   * 草图编码
   * Validate[max: 8; ]
   */
  sketchCode: string
  /**
   * 草图状态
   * Validate[max: 1; ]
   */
  sketchStatus: string
}
export interface IExistSketchNameQueryParams {
  manageSiteId: string
  sketchCode?: string
  sketchName: string
}
export interface IPromotionCodeSearchQueryParams {
  manageSiteId: string
}
export interface IPromotionCodeDeleteQueryParams {
  manageSiteId: string
}
export interface IPromotionCodeAddQueryParams {
  manageSiteId: string
}
export interface IPromotionCodeEditQueryParams {
  manageSiteId: string
}
export interface IBingWebSiteQueryParams {
  manageSiteId: string
}

export interface IUnBingWebsiteDomainQueryParams {
  manageSiteId: string
}
export interface IDomainConfigBbsAndNavigaQueryParams {
  manageSiteId: string
}
export interface ITemplateDeleteQueryParams {
  manageSiteId: string
}
export interface ITemplateCreateQueryParams {
  manageSiteId: string
  templateId: string // 模版ID，长度最长8位
  templateName: string // 模版名称，长度最长128位
  sketchCode: string // 模版草图代码，长度最长8位
  sysTemplateRef?: string // 引用的系统模版ID，长度最长8位（可选）
  isSysTemplate?: string // 是否系统模版，长度最长1位（可选）
  ownerUserId?: number // 用户ID，长度最长32位（可选）
  onlineServiceCode?: string // 在线客服代码，长度最长512位（可选）
  theme?: string // 主题，长度最长8位（可选）
  loginStyle?: string[] // 登录方式，长度最长128位（可选）
  thirdLoginStyle?: string[] // 支持的第三方登录方式，长度最长255位（可选）
  memo?: string // 备注，长度最长255位（可选）
  templateStatus?: string // 模版状态，长度最长1位（可选）
  cdnUrl?: string // CDN地址，长度最长255位（可选）
  statsCodeJsUrl?: string // 统计代码JS URL，长度最长512位（可选）
  statsCodeInit?: string // 统计代码初始化代码（可选）
}
export interface ITemplateEditQueryParams {
  manageSiteId: string
}
export interface IRefWebsiteConfigQueryParams {
  manageSiteId: string
}
export interface IIsTemplateIdExitQueryParams {
  manageSiteId: string
  templateId: string
}
export interface IIsTemplateNameExitQueryParams {
  manageSiteId: string
  templateId: string
  templateName: string
}
export interface IListBlurTemplateQueryParams {
  manageSiteId: string
}

export interface IReqSketchEditData {}
export interface IReqSketchCreateData {}
export interface IReqSketchCodeDeleteData {
  /**
   * 是
   * 草图编码
   * Validate[max: 8; ]
   */
  sketchCode: string
  /**
   * 草图状态
   * Validate[max: 1; ]
   */
  sketchStatus: string
}
export interface IReqExistSketchCodeData {}
export interface IReqGetALLSketchListParameter {
  manageSiteId: string
}
export interface IReqGetALLSketchListData {}
export interface IReqPromotionCodeSearchData {}
export interface IReqPromotionCodeDeleteData {}
export interface IReqPromotionCodeAddData {}
export interface IReqPromotionCodeEditData {}
export interface IITemplateListData {}
export interface IReqDomainData {}
export interface ISetBingWebSiteData {}

export interface IReqUnBingWebsiteDomainData {}
export interface IReqDomainConfigBbsAndNavigaData {}
export interface IReqTemplateDeleteData {}
export interface IReqTemplateEditData {}
export interface IGetRefWebsiteConfigData {}
export interface IReqGetAllTemplateIdParameter {
  manageSiteId: string
}
export interface IReqGetAllTemplateIdData {}
export interface IReqIsTemplateIdExitData {}
export interface IReqIsTemplateNameExitData {}
export interface IReqSysTemplateListParameter {
  manageSiteId: string
}
export interface IReqSysTemplateListData {}
export interface IReqListBlurTemplateData {}
export interface IReqListBlurTemplateAndSketchCodeQueryParams {
  manageSiteId: string
  templateId: string
}
export interface IListBlurTemplateAndSketchCodeData {
  templateId: string // 模板ID
  templateName: string // 模板名称
  sketchCode: string // 模板草图代码
  langCodes: number[] // 适用的语言代码列表
  areaCodes: number[] // 适用的地区代码列表
}
export interface IReqListBlurTemplateAndSketchCodeData {
  websiteId: string // 网站ID
  websiteInnerName: string // 网站内部名称
  websiteTitle: string // 网站标题
  createTime: number // 创建时间（时间戳）
  ownerUserId: string // 所有者用户ID
  userName: string // 用户名
  keyWords: string // 关键字
  onlineServiceCode: string // 在线服务代码
  hasStatsCode: string // 是否有统计代码
  langCodes: string[] // 适用的语言列表
  areaCodes: string[] // 适用的地区列表
  memo: string // 备注
  websiteTemplateRef: string // 网站模板引用
  websiteStatus: string // 网站状态
  cdnUrl: string // CDN地址
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化
  describe: string // 描述
  templateName: string // 模板名称
}
export interface IGetTemplateIdListData {}
export interface IListBlurTemplateWithUserInfoQueryParams {
  manageSiteId: string
  ownerUserId: number
  templateId: string
}
export interface IListBlurTemplateWithUserInfoData {
  templateId: string
  templateName: string
  sketchCode: string
  langCodes: number[]
  areaCodes: number[]
}
export interface IReqListTemplateQueryParams {
  websiteTemplateRef: string
  manageSiteId: string
}
export interface IReqListTemplateData {}
export interface IReqListBlurTemplateWithoutStatusData {
  templateId: 'string'
  templateName: 'string'
}

export interface IReqGetALLWebsiteListQueryParams {
  manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方式（可选）
  websiteId?: string // 网站ID（可选），最大长度64，符合正则表达式 ^[A-Za-z0-9 ]*$
  websiteInnerName?: string // 网站内部名称（可选），最大长度128
  websiteTitle?: string // 网站标题（可选），最大长度128
  ownerUserId?: string // 所有者用户ID（可选）
  websiteTemplateRef?: string // 网站模板引用（可选），最大长度128
  langCodes?: string[] // 适用的语言列表（可选），最大长度255
  areaCodes?: string[] // 适用的地区列表（可选），最大长度255
}

export interface IReqGetALLWebsiteListData {
  websiteId: number // 站点ID，类型为 int64
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间，格式为 yyyy-MM-dd HH:mm:ss
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  keyWords?: string // 关键字（可选）
  onlineServiceCode?: string // 在线客服代码（可选）
  hasStatsCode: string // 统计代码
  langCodes?: string[] // 支持的语言列表（可选）
  areaCodes?: string[] // 可访问地区列表（可选）
  memo?: string // 备注（可选）
  websiteTemplateRef?: string // 引用模版ID（可选）
  websiteStatus: 'y' | 'm' | 'c' // 站点状态；y: 启用, m: 维护, c: 关闭
  cdnUrl?: string // CDN地址（可选）
  statsCodeJsUrl?: string // 统计代码JS URL（可选）
  statsCodeInit?: string // 统计代码初始化代码（可选）
  describe?: string // 站点描述（可选）
  templateName?: string // 模板ID（可选）
}
export interface IReqSetWebSiteListIdData {}
export interface ISetWebSiteListIdData {}
export interface IGetWebSiteInfoData {}
export interface IReqWebsiteCodeDeleteData {}
export interface IReqWebsiteCodeAddQueryParams {
  manageSiteId: string
  websiteInnerName: string // 站点内部名称，最大长度128
  websiteTitle: string // 站点标题，最大长度128
  ownerUserId?: string // 所属用户ID（可选），仅数字
  keyWords?: string // 关键字（可选）
  onlineServiceCode?: string // 在线客服代码（可选）
  hasStatsCode?: string
  langCodes?: string[] // 适用的语言列表（可选）
  areaCodes?: string[] // 适用的地区列表（可选）
  memo?: string // 备注（可选）
  websiteTemplateRef?: string // 引用模版ID（可选）
  /**
   * 站点状态;y,启用;m,维护;c,关闭;
   */
  websiteStatus?: 'y' | 'm' | 'c' // 站点状态（可选），y: 启用, m: 维护, c: 关闭
  cdnUrl?: string // CDN地址（可选）
  describe?: string // 站点描述（可选）
  statsCodeJsUrl?: string // 统计代码JS URL（可选），最大长度512
  statsCodeInit?: string // 统计代码初始化代码（可选），最大长度512
}
export interface ICheckUserDomainData {}
export interface IReqWebsiteCodeEditData {}
export interface IReqClientTemplateInfoByWebsiteIdData {}
export interface IReqSketchInfoByWebsiteIdData {}
export interface IReqClientWebsiteConfigData {}
export interface IReqTemplateInfoByTemplateIdData {}
export interface IConstData {}
export interface IReqLangAndAreaCodesBasedOnSketchData {}
export interface IReqSearchSketchCodeData {}

/**
 * 草图信息接口
 */
export interface IReqSketchInfoBySketchCodeData {
  /**
   * 草图编码
   */
  sketchCode: string // 必填，草图编码

  /**
   * 草图名称
   */
  sketchName: string // 必填，草图名称

  /**
   * 草图类型
   */
  sketchType: string // 必填，草图类型

  /**
   * 适用的语言列表
   */
  langCodes?: string[] // 可选，适用的语言列表

  /**
   * 备注
   */
  memo?: string // 可选，备注

  /**
   * 适用的地区列表
   */
  areaCodes?: string[] // 可选，适用的地区列表

  /**
   * 创建时间
   * 格式: yyyy-MM-dd HH:mm:ss
   */
  createTime: string // 必填，创建时间

  /**
   * 草图状态
   * 可选值: y (启用), n (关闭)
   */
  sketchStatus: string // 必填，草图状态
}
export interface IUnBingWebsiteData {}

export interface IBingWebsiteDomainQueryParams {
  manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方式（可选）
  domain?: string // 域名（可选）
  domainStatus?: 'y' | 'c' | 'n' // 域名状态（可选）：y - 启用, c - 关闭, n - 维护
  isForceHttps?: 'y' | 'n' // 是否强制 HTTPS 访问（可选）：y - 强制访问, n - 不强制访问
  promotionCode?: string // 推广码（可选）
  domainType?: 't' | 'n' // 域名类型（可选）：t - 管理端, n - 客户端
  createTime?: string // 域名创建时间，格式为 yyyy-MM-dd HH:mm:ss（可选）
  websiteRef: string // 绑定的站点ID
  ownerUserId?: string // 所属用户（可选）
}
export interface IReqBingWebsiteDomainData {
  domain: string // 域名
  ownerUserId: string // 所属用户ID
  userName: string // 所属用户Name
  websiteRef: string // 绑定的站点ID
  onlineServiceCode: string // 在线客服代码
  keyWords: string // 关键字
  isSupportSsl: string // 是否配置SSL证书
  cdnUrl: string // CDN地址
  domainStatus: string // 域名状态
  domainType: string // 域名类型
  domainFrom: string // 域名来源
  hasStatsCode: string // 统计代码
  areaCodes: string[] // 可以访问地区列表
  langCodes: string[] // 可以支持语言列表
  landingPage: string // 落地页
  isForceHttps: string // 是否强制HTTPS访问
  sslExpiry: string // SSL证书到期日期，格式为 yyyy-MM-dd HH:mm:ss
  isAppDownloadHint: string // 是否提示app下载
  opsManageCode: string // OPS管理代码
  memo: string // 备注
  descriptions: string // 网站描述
  promotionCode: string // 默认推广码
  createTime: string // 创建时间，格式为 yyyy-MM-dd HH:mm:ss
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
}
export interface IListTemplateBySketchCodeWithPageData {
  templateId: string // 模版ID
  templateName: string // 模版名称
  sketchCode: string // 模版草图代码
  sketchName: string // 草图名称
  createTime: string // 创建时间，格式为 yyyy-MM-dd HH:mm:ss
  sysTemplateRef: string // 引用的系统模版ID
  sysTemplateRefName: string // 引用的系统模版ID名称
  isSysTemplate: string // 是否系统模版
  ownerUserId: number // 用户ID
  loginId: string // loginId
  onlineServiceCode: string // 在线客服代码
  theme: string // 主题
  loginStyle: string[] // 登录方式
  thirdLoginStyle: string[] // 支持的第三方登录方式
  memo: string // 备注
  templateStatus: 'y' | 'n' | 'm' // 模版状态
  cdnUrl: string // cdn地址
  hasStatsCode: string // 是否有统计代码
  statsCodeJsUrl: string // 统计代码JS URL
  statsCodeInit: string // 统计代码初始化代码
}
export interface IGetBingTemplateWebsiteQueryParams {
  manageSiteId: string
  page: number // 页码 (int32)
  size: number // 每页显示条数 (int32)
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  websiteTemplateRef: string // 模版 ID (长度最长 8 位)
}
export interface IGetBingTemplateWebsiteData {
  websiteId: number // 站点 ID (int64)
  websiteInnerName: string // 站点内部名称
  websiteTitle: string // 站点标题
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  ownerUserId: string // 所属用户 ID
  userName: string // 所属用户 Name
  keyWords: string // 关键字
  onlineServiceCode: string // 在线客服代码
  hasStatsCode: string // 统计代码
  langCodes: string[] // 支持的语言列表
  areaCodes: string[] // 可访问地区列表
  memo?: string // 备注 (可选)
  websiteTemplateRef: string // 引用模版 ID
  websiteStatus: 'y' | 'm' | 'c' // 站点状态 ('y': 启用, 'm': 维护, 'c': 关闭)
  cdnUrl: string // CDN 地址
  statsCodeJsUrl: string // 统计代码 JS URL
  statsCodeInit: string // 统计代码初始化代码
  describe: string // 站点描述
  templateName: string // 模板 ID
}

export interface IlistTemplateBySketchCodeWithPageQueryParams {
  manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段（可选）
  sortOrder?: 'DESC' | 'ASC' // 排序方式（可选）
  sketchCode: string // 草图编码
}

export interface IReqListBlurTemplateWithoutStatusQueryParams {
  templateId: string
}

export interface IReqSearchSketchCodeQueryParams {
  sketchCode: string
  manageSiteId: string
}

export interface ISketchInfoQueryParams {
  sketchCode: string
  manageSitId: string
}
