import type { BaseResponse } from '@/api/type'

export interface GetUserIdRequest {
  manageSiteId: string // 用户ID
}
export interface GetUserIdResponse extends BaseResponse {
  data?: {
    cid?: number // 用户ID
    userId: number // 用户ID
    loginId: string // 登录账号
    nickname: string // 昵称
    regTime: string // 注册时间，格式: yyyy-MM-dd HH:mm:ss
    userLevel: number // 用户层级
    userStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
    userType: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
    isAgent: string // 是否代理
    parentId: number // 上级用户ID
    parentLoginId: string // 上级用户登录名
    parentNickname: string // 上级用户昵称
    isFrontUser: string // 是否可以前端登录
    teamStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 团队状态
    regIP: string // 注册IP
    innerDistribution: string // 关联的内部账号
    innerTags: string // 内部TAG
    userMemo: string // 用户备注
    upperMemo: string // 上级备注
    kolMemo: string // 一级用户备注
    sysMemo: string // 系统备注
    mobileCountryCode: string // 手机号地区代码
    mobile: string // 注册手机号
    mobileShortcut: string // 手机短号
    email: string // 注册邮箱
    regChannel: 'w' | 'h' | 'a' | 'i' | 'o' // 注册来源
    regFrom: string // 注册信息
    regPromotionCode: string // 注册推广码
    gender: 'm' | 'f' | 'x' // 性别
    lang: string // 使用语言
    lastLoginTime: string // 最后登录时间，格式: yyyy-MM-dd HH:mm:ss
    lastLoginIP: string // 最后登录IP
    isAuthentication: string // 是否真人认证
    isMobileAuthentication: string // 是否手机认证
    isKyc: string // 是否已经KYC
    isBot: string // 是否是机器人
    accountType: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型(运营状态)
    idcCode: string // idc业务线代码
    isBackendUser: string // 是否后台用户
    avatar: string // 头像
    kolUserId: number // kol用户ID
    userPath: number[] // 用户到最上级用户组成的用户ID路径
    directSubCnt: number // 直属下级人数
    totalTeamCnt: number // 团队总人数
  }
}
export interface IReqListUserFavoriteQueryParams {
  userId: string
  userIdPrecise: boolean
  targetId: string
  favoriteFlag: string
  sortName: string
  sortOrder: string
  page: number
  size: number
}
export interface IReqListUserFavoriteData {
  /**
   * 收藏ID
   */
  favoriteId: number
  /**
   * 收藏用户ID
   */
  hostUserId: number
  /**
   * 收藏用户昵称
   */
  hostUserNickname: string
  /**
   * 收藏客户端ID
   */
  hostCid: string
  /**
   * 收藏对象REF
   */
  targetRef: string
  /**
   * 收藏对象ID
   */
  targetId: string
  /**
   * 收藏对象名称
   */
  targetName: string
  /**
   * 收藏类型
   * b：bbs |  f：论坛 |  m：主板 |  p：帖子 |  t：图库 |  c：论坛评论 |  u：图库评论
   */
  favoriteFlag: string
  /**
   * 收藏时间
   */
  createTime: string
}
export interface IReqUserListFilterQueryParams {
  manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  filterType: 'w' | 't' | 'd' | 'p' // 过滤类型
  sortName?: string // 排序字段（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方式（可选）
  userId?: string // 用户ID（可选）
  loginId?: string // 登录账号（可选）
  searchId?: string // 检索ID（可选）
  nickname?: string // 昵称（可选）
  parentId?: string // 上级代理ID（可选）
  parentSearchId?: string // 上级用户检索ID（可选）
  parentNickname?: string // 上级代理昵称（可选）
  userLevel?: number // 当前层级（可选）
  accountType?: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' | 'L' // 账号类型（可选）
  userStatus?: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' | 'L' // 用户状态（可选）
  mobileCountryCode?: string // 国际区号（可选）
  innerDistribution?: string // 关联的内部账号（可选）
  innerTags?: string // 内部TAG（可选）
  regStartTime?: string // 注册开始时间（可选）
  regEndTime?: string // 注册结束时间（可选）
  loginStartTime?: string // 登录开始时间（可选）
  loginEndTime?: string // 登录结束时间（可选）
  userType?: 'u' | 'a' | 's' | 'b' | 'o' | 'L' // 用户类型（可选）
  mobileShortcut?: string // 手机短号（可选）
}

/**
 *  定义用户信息接口
 */
export interface IReqUserListFilterData {
  userId: string // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  regTime: string // 注册时间
  userLevel: number // 用户级别
  userStatus: string // 用户状态
  userType: string // 用户类型
  isAgent: string // 是否代理
  parentId: string // 上级ID
  parentLoginId: string // 上级登录ID
  parentNickname: string // 上级昵称
  isFrontUser: string // 是否前端用户
  teamStatus: string // 团队状态
  regIP: string // 注册IP
  innerDistribution: string // 内部分配
  innerTags: string // 内部标签
  userMemo: string // 用户备注
  upperMemo: string // 上级备注
  kolMemo: string // KOL备注
  sysMemo: string // 系统备注
  mobileCountryCode: string // 国际区号
  mobile: string // 手机号
  mobileShortcut: string // 手机短号
  email: string // 邮箱
  regChannel: string // 注册渠道
  regFrom: string // 注册来源
  regPromotionCode: string // 注册推广码
  gender: string // 性别
  lang: string // 语言
  lastLoginTime: string // 最后登录时间
  lastLoginIP: string // 最后登录IP
  isAuthentication: string // 是否认证
  isMobileAuthentication: string // 是否手机认证
  isKyc: string // 是否KYC认证
  isBot: string // 是否机器人
  accountType: string // 账号类型
  idcCode: string // IDC代码
  isBackendUser: string // 是否后台用户
  avatar: string // 头像
  kolUserId: string // KOL用户ID
  userPath: string[] // 用户路径
  vipLevel: number // VIP级别
  talent: number // 人才
  directSubCnt: string // 直接下级数量
  totalTeamCnt: string // 总团队数量
  tags: string[] // 标签
  fansCount: number // 粉丝数量
  followCount: number // 关注数量
  friendCount: number // 朋友数量
  likeCount: number // 点赞数量
  collectCount: number // 收藏数量
  viewCount: number // 浏览数量
  acquireLikeCount: number // 获取点赞数量
  acquireFavoriteCount: number // 获取收藏数量
  publishCount: number // 发布数量
  score: number // 分数
  stars: number // 星级
  myPromotionCode: string // 我的推广码
}

export interface IReqUserListQueryParams {
  // manageSiteId: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段（可选）
  sortOrder?: 'ASC' | 'DESC' // 排序方式（可选）
  userId?: string // 用户ID（可选），最大长度20
  loginId?: string // 登录账号（可选），最大长度64
  searchId?: string // 检索ID（可选），内容为用户ID或登录ID，最大长度20
  nickname?: string // 昵称（可选），最大长度64
  parentId?: string // 上级代理ID（可选），最大长度20
  parentSearchId?: string // 上级用户检索ID（可选），最大长度20
  parentNickname?: string // 上级代理昵称（可选），最大长度64
  userLevel?: number // 当前层级（可选）
  accountType?: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' | 'L' // 账号类型（可选）
  userStatus?: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' | 'L' // 用户状态（可选）
  mobileCountryCode?: string // 国际区号（可选），最大长度5
  innerDistribution?: string // 关联的内部账号（可选），最大长度200
  innerTags?: string // 内部TAG（可选），最大长度200
  regStartTime?: string // 注册开始时间（可选），格式：yyyy-MM-dd HH:mm:ss
  regEndTime?: string // 注册结束时间（可选），格式：yyyy-MM-dd HH:mm:ss
  loginStartTime?: string // 登录开始时间（可选），格式：yyyy-MM-dd HH:mm:ss
  loginEndTime?: string // 登录结束时间（可选），格式：yyyy-MM-dd HH:mm:ss
  userType?: 'u' | 'a' | 's' | 'b' | 'o' | 'L' // 用户类型（可选）
  mobileShortcut?: string // 手机短号（可选），最大长度4
}

export interface IReqUserListData {
  userId: string // 用户 ID (int64)
  loginId: string // 登录账号
  nickname: string // 昵称
  regTime: string // 注册时间 (格式: yyyy-MM-dd HH:mm:ss)
  userLevel: number // 用户层级 (int32)
  userStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
  userType: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
  isAgent: 'y' | 'n' // 是否代理
  parentId: number // 上级用户 ID (int64)
  parentLoginId: string // 上级用户登录名
  parentNickname: string // 上级用户昵称
  isFrontUser: 'y' | 'n' // 是否可以前端登录
  teamStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 团队状态
  regIP: string // 注册 IP
  innerDistribution: string // 关联的内部账号
  innerTags: string // 内部 TAG
  userMemo: string // 用户备注
  upperMemo: string // 上级备注
  kolMemo: string // 一级用户备注
  sysMemo: string // 系统备注
  mobileCountryCode: string // 手机号地区代码
  mobile: string // 注册手机号
  mobileShortcut: string // 手机短号
  email: string // 注册邮箱
  regChannel: 'w' | 'h' | 'a' | 'i' | 'o' // 注册来源
  regFrom: string // 注册信息
  regPromotionCode: string // 注册推广码
  gender: 'm' | 'f' | 'x' // 性别
  lang: string // 使用语言
  lastLoginTime: string // 最后登录时间 (格式: yyyy-MM-dd HH:mm:ss)
  lastLoginIP: string // 最后登录 IP
  isAuthentication: 'y' | 'n' // 是否真人认证
  isMobileAuthentication: 'y' | 'n' // 是否手机认证
  isKyc: 'y' | 'n' // 是否已经 KYC
  isBot: 'y' | 'n' // 是否是机器人
  accountType: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型
  idcCode: string // IDC 业务线代码
  isBackendUser: 'y' | 'n' // 是否后台用户
  avatar: string // 头像
  kolUserId: number // KOL 用户 ID (int64)
  userPath: number[] // 用户到最上级用户组成的用户 ID 路径
  directSubCnt: number // 直属下级人数 (int64)
  totalTeamCnt: number // 团队总人数 (int64)
}

export interface IReqUserQueryQueryParams {
  manageSiteId: string
  page: number // 页码 (int32)
  size: number // 每页显示条数 (int32)
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  userId?: string // 用户 ID (最大长度: 20)
  loginId?: string // 登录账号 (最大长度: 64)
  searchId?: string // 检索 ID (内容为用户 ID 或登录 ID，最大长度: 20)
  nickname?: string // 昵称 (最大长度: 64)
  parentId?: string // 上级代理 ID (最大长度: 20)
  parentSearchId?: string // 上级用户检索 ID (内容为上级用户 ID 或上级用户登录 ID，最大长度: 20)
  parentNickname?: string // 上级代理昵称 (最大长度: 64)
  userLevel?: number // 当前层级 (int32)
  accountType?: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' | 'L' // 账号类型
  userStatus?: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' | 'L' // 用户状态
  mobileCountryCode?: string // 国际区号 (最大长度: 5)
  innerDistribution?: string // 关联的内部账号 (最大长度: 200)
  innerTags?: string // 内部 TAG (最大长度: 200)
  regStartTime?: string // 注册开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  regEndTime?: string // 注册结束时间 (格式: yyyy-MM-dd HH:mm:ss)
  loginStartTime?: string // 登录开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  loginEndTime?: string // 登录结束时间 (格式: yyyy-MM-dd HH:mm:ss)
  userType?: 'u' | 'a' | 's' | 'b' | 'o' | 'L' // 用户类型
  mobileShortcut?: string // 手机短号（手机号前2位 + 后2位，最大长度: 4）
}
export interface IReqUserQueryData {
  userId: number // 用户 ID (int64)
  loginId: string // 登录账号
  nickname: string // 昵称
  regTime: string // 注册时间 (格式: yyyy-MM-dd HH:mm:ss)
  userLevel: number // 用户层级 (int32)
  userStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
  userType: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
  isAgent: 'y' | 'n' // 是否代理
  parentId: number // 上级用户 ID (int64)
  parentLoginId: string // 上级用户登录名
  parentNickname: string // 上级用户昵称
  isFrontUser: 'y' | 'n' // 是否可以前端登录
  teamStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 团队状态
  regIP: string // 注册 IP
  innerDistribution: string // 关联的内部账号
  innerTags: string // 内部 TAG
  userMemo: string // 用户备注
  upperMemo: string // 上级备注
  kolMemo: string // 一级用户备注
  sysMemo: string // 系统备注
  mobileCountryCode: string // 手机号地区代码
  mobile: string // 注册手机号
  mobileShortcut: string // 手机短号
  email: string // 注册邮箱
  regChannel: 'w' | 'h' | 'a' | 'i' | 'o' // 注册来源
  regFrom: string // 注册信息
  regPromotionCode: string // 注册推广码
  gender: 'm' | 'f' | 'x' // 性别
  lang: string // 使用语言
  lastLoginTime: string // 最后登录时间 (格式: yyyy-MM-dd HH:mm:ss)
  lastLoginIP: string // 最后登录 IP
  isAuthentication: 'y' | 'n' // 是否真人认证
  isMobileAuthentication: 'y' | 'n' // 是否手机认证
  isKyc: 'y' | 'n' // 是否已经 KYC
  isBot: 'y' | 'n' // 是否是机器人
  accountType: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型
  idcCode: string // IDC 业务线代码
  isBackendUser: 'y' | 'n' // 是否后台用户
  avatar: string // 头像
  kolUserId: number // KOL 用户 ID (int64)
  userPath: number[] // 用户到最上级用户组成的用户 ID 路径
  directSubCnt: number // 直属下级人数 (int64)
  totalTeamCnt: number // 团队总人数 (int64)
}

export interface IReqUserEditQueryParams {
  manageSiteId: string
  userId: number // 用户 ID (int64)
  loginId?: string // 登录 ID (最大长度: 64)
  nickname?: string // 昵称 (最大长度: 64)
  userStatus?: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
  userType?: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
  isAgent?: 'y' | 'n' // 是否代理
  parentId?: number // 上级用户 ID (int64)
  isFrontUser?: 'y' | 'n' // 是否可以前端登录
  teamStatus?: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 团队状态
  regIP?: string // 注册 IP (最大长度: 200)
  innerDistribution?: string // 关联的内部账号 (最大长度: 200)
  innerTags?: string // 内部 TAG (最大长度: 200)
  userMemo?: string // 用户备注 (最大长度: 200)
  upperMemo?: string // 上级备注 (最大长度: 200)
  kolMemo?: string // 一级用户备注 (最大长度: 200)
  sysMemo?: string // 系统备注 (最大长度: 200)
  mobileCountryCode?: string // 手机号地区代码 (最大长度: 5)
  mobile?: string // 注册手机号 (最大长度: 16)
  email?: string // 注册邮箱 (最大长度: 100)
  regFrom?: string // 注册信息 (最大长度: 200)
  regPromotionCode?: string // 注册推广码 (最大长度: 32)
  gender?: 'm' | 'f' | 'x' // 性别
  lang?: string // 使用语言 (最大长度: 8)
  isAuthentication?: 'y' | 'n' // 是否真人认证
  isMobileAuthentication?: 'y' | 'n' // 是否手机认证
  isKyc?: 'y' | 'n' // 是否已经 KYC
  isBot?: 'y' | 'n' // 是否是机器人
  accountType?: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型
  idcCode?: string // IDC 业务线代码 (最大长度: 8)
  isBackendUser?: 'y' | 'n' // 是否后台用户
  avatar?: string // 头像 (最大长度: 200)
}

export interface IReqUserCreateQueryParams {
  manageSiteId: string
  userStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
  userType: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
  loginId: string // 登录 ID (最大长度: 64)
  nickname?: string // 昵称 (最大长度: 64, 可选)
  accountType: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型
  parentId?: number // 上级用户 ID (int64, 可选)
  innerDistribution?: string // 关联的内部账号 (最大长度: 200, 可选)
  userMemo?: string // 用户备注 (最大长度: 200, 可选)
  mobileCountryCode?: string // 手机号地区代码 (最大长度: 5, 可选)
  mobile?: string // 注册手机号 (最大长度: 16, 可选)
  email?: string // 注册邮箱 (最大长度: 100, 可选)
  gender?: 'm' | 'f' | 'x' // 性别 (可选)
  regChannel?: 'w' | 'h' | 'a' | 'i' | 'o' // 注册来源 (可选)
}
export interface IReqUserCreateData {}
export interface IReqUpdateUserQueryParams {
  manageSiteId: string
}
export interface IReqUpdateUserData {}
export interface IReqBlocklistQueryParams {
  manageSiteId: string
}
export interface IReqBlocklistData {}
export interface IReqRelationshipQueryParams {
  manageSiteId: string
}
export interface IReqRelationshipData {}
export interface IReqFavoriteQueryParams {
  manageSiteId: string
}
export interface IReqFavoriteData {}
export interface IReqLikeQueryParams {
  manageSiteId: string
}
export interface IReqLikeData {}
export interface IReqUserVisitQueryParams {
  manageSiteId: string
}
export interface IReqUserVisitData {}
export interface IReqDeviceVisitQueryParams {
  manageSiteId: string
}
export interface IReqDeviceVisitData {}
export interface IReqListUserLikeQueryParams {
  manageSiteId: string
}
export interface IReqListUserLikeData {}
export interface IReqListDeviceLikeQueryParams {
  manageSiteId: string
}
export interface IReqListDeviceLikeData {}
export interface IReqListDeviceFavoriteQueryParams {
  manageSiteId: string
}
export interface IReqListDeviceFavoriteData {}
export interface IReqListUserVoteQueryParams {
  manageSiteId: string
}
export interface IReqListUserVoteData {}
export interface IReqListDeviceVoteQueryParams {
  manageSiteId: string
}
export interface IReqListDeviceVoteData {}
export interface IReqListUserViewHistoryQueryParams {
  manageSiteId: string
}
export interface IReqListUserViewHistoryData {}
export interface IReqListDeviceViewHistoryQueryParams {
  manageSiteId: string
}
export interface IReqListDeviceViewHistoryData {}
export interface IReqListUserRelationshipQueryParams {
  manageSiteId: string
}
export interface IReqListUserRelationshipData {}
export interface IReqListDeviceRelationshipQueryParams {
  manageSiteId: string
}
export interface IReqListDeviceRelationshipData {}
export interface IReqGameListQueryParams {
  manageSiteId: string
}
export interface IReqGameListData {}
export interface IReqWebsiteManageListQueryParams {
  manageSiteId: string
}
export interface IReqWebsiteManageListData {}
export interface IReqBbsForumPostListQueryParams {
  manageSiteId: string
}
export interface IReqBbsForumPostListData {}

export interface IReqListPostIssueQueryParams {
  manageSiteId: string
}
export interface IReqListPostIssueData {}
export interface IReqBbsForumListPostIssueQueryParams {
  manageSiteId: string
}
export interface IReqBbsForumListPostIssueData {}
export interface IReqShowEmailQueryParams {
  manageSiteId: string
}
export interface IReqShowEmailData {}
export interface IReqUserAchievementQueryParams {
  manageSiteId: string
  targetUserId: number
}
export interface IReqUserAchievementData {}
export interface ISetUserAchievementQueryParams {
  manageSiteId: string
}
export interface ISetUserAchievementData {}
export interface ISetTransferScoreQueryParams {
  userId: string // 用户ID
  score: number // 分数
  bak?: string // 备注
  manageSiteId: string
}
export interface ISetTransferScoreData {}

export interface IReqIsExitQueryParams {
  userId: number
  manageSiteId: string
}

export interface IAccountInfoQueryParams {
  cid?: number // 用户ID
  userId: number // 用户ID
  loginId: string // 登录账号
  nickname: string // 昵称
  regTime: string // 注册时间，格式: yyyy-MM-dd HH:mm:ss
  userLevel: number // 用户层级
  userStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 用户状态
  userType: 'u' | 'a' | 's' | 'b' | 'o' // 用户类型
  isAgent: string // 是否代理
  parentId: number // 上级用户ID
  parentLoginId: string // 上级用户登录名
  parentNickname: string // 上级用户昵称
  isFrontUser: string // 是否可以前端登录
  teamStatus: 'y' | 'n' | 't' | 'f' | 'u' | 'z' | 'v' | 'x' // 团队状态
  regIP: string // 注册IP
  innerDistribution: string // 关联的内部账号
  innerTags: string // 内部TAG
  userMemo: string // 用户备注
  upperMemo: string // 上级备注
  kolMemo: string // 一级用户备注
  sysMemo: string // 系统备注
  mobileCountryCode: string // 手机号地区代码
  mobile: string // 注册手机号
  mobileShortcut: string // 手机短号
  email: string // 注册邮箱
  regChannel: 'w' | 'h' | 'a' | 'i' | 'o' // 注册来源
  regFrom: string // 注册信息
  regPromotionCode: string // 注册推广码
  gender: 'm' | 'f' | 'x' // 性别
  lang: string // 使用语言
  lastLoginTime: string // 最后登录时间，格式: yyyy-MM-dd HH:mm:ss
  lastLoginIP: string // 最后登录IP
  isAuthentication: string // 是否真人认证
  isMobileAuthentication: string // 是否手机认证
  isKyc: string // 是否已经KYC
  isBot: string // 是否是机器人
  accountType: 'f' | 'u' | 't' | 'd' | 'p' | 'n' | 's' | 'z' // 账号类型(运营状态)
  idcCode: string // idc业务线代码
  isBackendUser: string // 是否后台用户
  avatar: string // 头像
  kolUserId: number // kol用户ID
  userPath: number[] // 用户到最上级用户组成的用户ID路径
  directSubCnt: number // 直属下级人数
  totalTeamCnt: number // 团队总人数
}

export interface IReqGetRuleListQueryParams {
  page: number
  size: number
  sortName?: string
  sortOrder?: 'ASC' | 'DESC'
}
export interface IReqGetRuleListData {
  /** Rule ID (used for modifying a rule) */
  ruleId: number
  /** Business name */
  bizName: string
  /** Text description of the business */
  bizDesc: string
  /** Enable or disable the rule */
  enable: boolean
  /** Whether the enable/disable option is editable */
  enableItemEditable: boolean
  /** Numerical value */
  value: number
  currentValue: number
  currentEnableItemEditable: boolean
}
export interface RewardSettingItem {
  ruleId?: number // Rule ID, optional
  enable?: boolean // Enable/disable flag, optional
  value?: number // Value, optional
}
export interface IReqRuleChangeQueryParams {
  items: RewardSettingItem[] // List of reward setting items, required (max: 100)
}

export interface IReqSixKingListData {
  sortNo: number // 序号
  userId: number // 用户ID
  loginId: string // 登入账号
  nickname: string // 用户昵称
  avatar: string // 用户头像
  gameType: number // 彩种
  gameTypeShortName: string // 彩种简称
  winRate: string // 胜率
  total: number // 总共发布了多少次心水
  winTotal: number // 本期赢得了几次
  failTotal: number // 本期输了几次
  longestWinStreak: number // 史上最大连胜
}

export interface IReqSixKingListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  gameType: number | undefined // 游戏类型
  playTypeCode: string | undefined // 玩法code (Validate[max: 16;])
  startIssue: number | undefined // 开始期数
  endIssue: number | undefined // 结束期数
  current: 'y' | 'n' // 是否仅显示当前期发布心水的用户 (y: 是, n: 不是)
  sortName?: string // 排序字段名称 (可选) sortNo
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (升序或降序，可选)
  userId?: string // 用户ID (可选)
  nickname?: string // 昵称 (可选)
}

// webgw/predict/saleList

export interface IReqPlatformSwitchInfoQueryParams {
  gameType: string
}

export interface IReqPlatformSwitchInfoData {
  sixKingCount: number
  winnStreakRankingCount: number
  pastChampionsCount: number
  expertStatisticsCount: number
}

export interface IReqWinningStreakListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  loginOrUserId?: string // 登录Id或用户Id
  nickname?: string // 昵称
  playTypeCode: string // 玩法code
  isAll: boolean // false仅显示当前期发布心水的用户，true返回所有
  gameType: number | undefined // 彩种
  sortName?: 'update_time' | 'recent_continue_win_count' | 'predict_read_number' // 排序字段
  sortOrder?: 'ASC' | 'DESC' // 排序方式
}
export interface IReqWinningStreakListData {
  winStreakId: number // 主键ID
  nickname: string // 用户昵称
  avatar: string // 用户头像
  playTypeCode: string // 玩法code
  playTypeName: string // 玩法名称
  gameType: number // 彩种
  predictTitle: string // 心水标题
  saleCount: number // 购买次数（查看次数）
  point: number // 查看所需积分
  isCurrent: boolean // 是否已开奖（已结算/当前期）
  userId: number // 用户ID
  hasPay: 'y' | 'n' // 是否已经支付 ('y' 是, 'n' 否)
  isSelf: 'y' | 'n' // 是否本人 ('y' 是, 'n' 否)
  recentContinueWinCount: number // 最近连胜次数
  longestContinueWinCount: number // 最大连胜次数
  predictId: number // 该用户该类型推荐的预测ID
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  updateTime: string // 更新时间 (格式: yyyy-MM-dd HH:mm:ss)
  bizFlag: 'b' | 't' | 'p' | 'r' // 业务类型 ('b' bbs, 't' 图库, 'p' 竞选, 'r' 心水)
}

export interface IReqUserCreate {
  loginId: string // 64 登录ID Validate[max: 64; ]
  nickname?: string // 64 昵称 Validate[max: 64; ]
  userStatus: string // 用户状态： y：启用 n：停用 t：停权 f：冻结 u：未启用 z：保留 v：浏览 x：关停
  userType: string // 用户类型： u：用户 a：代理 s：子账号 b：后台 o：开放平台
  parentId?: number // 上级用户ID 0
  innerDistribution?: string // 关联的内部账号 Validate[max: 200; ]
  userMemo?: string // 用户备注 Validate[max: 200; ]
  mobileCountryCode?: string // 手机号地区代码 Validate[max: 5; ]
  mobile?: string // 注册手机号 Validate[max: 16; ]
  email?: string // 注册邮箱 Validate[max: 100; ]
  gender?: string // 性别： m：男 f：女 x：未知
  accountType: string // 账号类型(运营状态)： f：未上线 u：UAT t：测试 d：演示 p：已上线 n：已下线 s：停用 z：归档
  regChannel?: string // 注册来源 w：pc web h：H5 a：android i：iPhone o：openAPIreg 复制
}

export interface IReqNewspaperIssuePostListQueryParams {
  /** 页码 */
  page: number // int32
  /** 每页显示条数 */
  size: number // int32
  /** 排序字段名称 */
  sortName?: string // string, 可选
  /** 排序方式 */
  sortOrder?: 'ASC' | 'DESC' // enum, 可选
  /** 评论ID */
  postId?: number // int64
  /** 期号 */
  issueId?: number // int64
  /** 评论内容或预览(长度最长512位) */
  postContent?: string // string, 可选，最大长度512
  /** 是否全部评论内容; y,全部; n,部分; (长度最长1位) */
  isAllPostContent?: string // string, 可选，最大长度1
  /** 发布时间 */
  postTime?: string // yyyy-MM-dd HH:mm:ss
  /** 发布用户ID */
  postUserId?: number // int64
  /** 帖子序列号; 0,表示主贴; */
  postThreadSeq?: number // int32
  /** 点赞数量 */
  likeCount?: number // int32
  /** 收藏数量 */
  favoriteCount?: number // int32
  /** 回复数量 */
  threadCount?: number // int32
  /** 阅读数量 */
  readCount?: number // int32
  /** 回复评论ID */
  threadPostId?: number // int64
  /** 匿名回复的; (长度最长1位) */
  isAnonymous?: string // string, 可选，最大长度1
  /** 是否作者 */
  isAuthor?: string // string, 可选
  /** 是否可以匿名回复; (长度最长1位) */
  enableAnonymous?: string // string, 可选，最大长度1
  /** 可见标记; a,所有可见; u,用户可见; r,关注可见; f,好友可见; (长度最长1位) */
  viewFlag?: string // string, 可选，最大长度1
  /** 发布年份(长度最长4位) */
  postYear?: string // string, 可选，最大长度4
  /** 发布期数(长度最长32位) */
  postIssue?: string // string, 可选，最大长度32
  /** 发布关联游戏标记(长度最长32位) */
  postGameRef?: string // string, 可选，最大长度32
  /** 发布关联游戏类型标记 */
  postGametypeRef?: number // int32
  /** 是否有附件; y,有; n,没有; (长度最长1位) */
  hasAttachment?: string // string, 可选，最大长度1
  /** 是否被编辑过; y,有; n,没有; (长度最长1位) */
  isEdited?: string // string, 可选，最大长度1
  /** 最后编辑时间 */
  lastEditTime?: string // yyyy-MM-dd HH:mm:ss
  /** 来源IP(长度最长64位) */
  fromIp?: string // string, 可选，最大长度64
  /** 来源终端标记(长度最长1位) */
  fromClientFlag?: string // string, 可选，最大长度1
  /** 用户有心水数 */
  userMakeSenseCount?: number // int32
  /** 用户没心水数 */
  userMakeNoSenseCount?: number // int32
  /** 匿名有心水数 */
  clientMakeSenseCount?: number // int32
  /** 匿名没心水数 */
  clientMakeNoSenseCount?: number // int32
  /** 是否心水; (长度最长1位) */
  isMakeSense?: string // string, 可选，最大长度1
  /** 是否热门; (长度最长1位) */
  isHot?: string // string, 可选，最大长度1
  /** 是否精选; (长度最长1位) */
  isSelected?: string // string, 可选，最大长度1
  /** 是否置顶; (长度最长1位) */
  isTop?: string // string, 可选，最大长度1
  /** 是否推荐; (长度最长1位) */
  isRecommended?: string // string, 可选，最大长度1
  /** 是否爆款; (长度最长1位) */
  isBloom?: string // string, 可选，最大长度1
  /** 所选择的用户ID（可空） */
  selectedUserId?: string // string, 可选
}
export interface IReqNewspaperIssuePostListData {
  /** 评论ID */
  postId: number // int64
  /** 论坛ID（如果适用） */
  forumId?: string // string, 可选
  /** 评论内容或预览(长度最长512位) */
  postContent?: string // string, 可选，最大长度512
  /** 是否全部评论内容; y,全部; n,部分; (长度最长1位) */
  isAllPostContent?: string // string, 可选，最大长度1
  /** 发布时间 */
  postTime?: string // yyyy-MM-dd HH:mm:ss
  /** 发布用户ID */
  postUserId: number // int64
  /** 帖子序列号; 0,表示主贴; */
  postThreadSeq: number // int32
  /** 点赞数量 */
  likeCount: number // int32
  /** 收藏数量 */
  favoriteCount: number // int32
  /** 回复数量 */
  threadCount: number // int32
  /** 阅读数量 */
  readCount: number // int32
  /** 回复评论ID */
  threadPostId: number // int64
  /** 一级评论Id到该post_id的全路径 */
  postIdPath?: string // string, 可选
  /** 匿名回复的; (长度最长1位) */
  isAnonymous?: string // string, 可选，最大长度1
  /** 是否作者 */
  isAuthor?: string // string, 可选
  /** 是否可以匿名回复; (长度最长1位) */
  enableAnonymous?: string // string, 可选，最大长度1
  /** 可见标记; a,所有可见; u,用户可见; r,关注可见; f,好友可见; (长度最长1位) */
  viewFlag?: string // string, 可选，最大长度1
  /** 发布年份(长度最长4位) */
  postYear?: string // string, 可选，最大长度4
  /** 发布期数(长度最长32位) */
  postIssue?: string // string, 可选，最大长度32
  /** 期刊ID */
  issueId: number // int64
  /** 发布关联游戏标记(长度最长32位) */
  postGameRef?: string // string, 可选，最大长度32
  /** 发布关联游戏类型标记 */
  postGametypeRef: number // int32
  /** 是否有附件; y,有; n,没有; (长度最长1位) */
  hasAttachment?: string // string, 可选，最大长度1
  /** 是否被编辑过; y,有; n,没有; (长度最长1位) */
  isEdited?: string // string, 可选，最大长度1
  /** 最后编辑时间 */
  lastEditTime?: string // yyyy-MM-dd HH:mm:ss
  /** 来源IP(长度最长64位) */
  fromIp?: string // string, 可选，最大长度64
  /** 来源终端标记(长度最长1位) */
  fromClientFlag?: string // string, 可选，最大长度1
  /** 用户有心水数 */
  userMakeSenseCount: number // int32
  /** 用户没心水数 */
  userMakeNoSenseCount: number // int32
  /** 匿名有心水数 */
  clientMakeSenseCount: number // int32
  /** 匿名没心水数 */
  clientMakeNoSenseCount: number // int32
  /** 是否心水; (长度最长1位) */
  isMakeSense?: string // string, 可选，最大长度1
  /** 是否热门; (长度最长1位) */
  isHot?: string // string, 可选，最大长度1
  /** 是否精选; (长度最长1位) */
  isSelected?: string // string, 可选，最大长度1
  /** 是否置顶; (长度最长1位) */
  isTop?: string // string, 可选，最大长度1
  /** 是否推荐; (长度最长1位) */
  isRecommended?: string // string, 可选，最大长度1
  /** 是否爆款; (长度最长1位) */
  isBloom?: string // string, 可选，最大长度1
  /** 评论类型; p,默认评论; a,图解评论 */
  postType?: string // string, 可选
  /** forumName */
  forumName?: string // string, 可选
  /** 评论回复列表 */
  replies?: Comment[] // array of Comment, 可选
  /** 要存储的附件数组 */
  attachments?: object[] // array of objects, 可选
  /** A map key. */
  mapKey?: string // string, 可选
  /** 回贴的数量 */
  childrenSize: number // int32
  /** 被回复的评论的postUserId */
  toUserId: number // int64
  /** 被回复的评论的postUserId的nickname */
  toNickname?: string // string, 可选
  /** 点赞状态 */
  likeStatus?: string // string, 可选
  /** 收藏状态 */
  favoriteStatus?: string // string, 可选
  /** 倒赞状态 */
  dislikeStatus?: string // string, 可选
  /** 所选择的用户ID（可空） */
  selectedUserId?: string // string, 可选
  /** 头像 */
  avatar?: string // string, 可选
  /** 昵称 */
  nickname?: string // string, 可选
  /** vip等级 */
  vipLevel: number // int32
  /** 页码 */
  page: number // int32
  /** 每页显示条数 */
  size: number // int32
  /** newspaperName */
  newspaperName?: string // string, 可选
  /** cid */
  cid?: string // string, 可选
}

export interface IFavoriteBodyParameter {
  /** 页码 */
  page: number

  /** 每页显示条数 */
  size: number

  /** 排序字段名称 */
  sortName?: string

  /** 排序方向 */
  sortOrder?: 'DESC' | 'ASC'

  /** 用户ID，最大长度20 */
  userId?: string

  /** 是否精确匹配用户ID */
  userIdPrecise?: boolean

  /** 客户端ID，最大长度128 */
  cid?: string

  /** 是否精确匹配客户端ID */
  cidPrecise?: boolean

  /** 对象REF，最大长度64 */
  targetRef?: string

  /** 是否精确匹配对象REF */
  targetRefPrecise?: boolean

  /** 对象ID，最大长度64 */
  targetId?: string

  /** 是否精确匹配对象ID */
  targetIdPrecise?: boolean

  /** 收藏类型 */
  favoriteFlag?: FavoriteFlag
}
/**
 * 收藏类型枚举
 * 收藏类型
 * b：bbs f：论坛 m：主板 p：帖子 t：图库
 */
export enum FavoriteFlag {
  BBS = 'b',
  FORUM = 'f',
  MAINBOARD = 'm',
  POST = 'p',
  GALLERY = 't'
}

/**
 */
export enum CommentsFlag {
  MYFORUM = 'myForum', //发现
  GUESS = 'guess', //幽默猜测
  USERPUBLIC = 'userPublic', //高手论坛
  CORPUS = 'corpus', //资料大全
  other = 'other' //TODO: 不确定
}

export interface IFavoriteData {
  /**
   * 收藏ID
   */
  favoriteId: number
  /**
   * 收藏用户ID
   */
  hostUserId: number
  /**
   * 收藏用户昵称
   */
  hostUserNickname: string
  /**
   * 收藏客户端ID
   */
  hostCid: string
  /**
   * 收藏对象REF
   */
  targetRef: string
  /**
   * 收藏对象ID
   */
  targetId: string
  /**
   * 收藏对象名称
   */
  targetName: string
  /**
   * 收藏类型
   * b：bbs |  f：论坛 |  m：主板 |  p：帖子 |  t：图库 |  c：论坛评论 |  u：图库评论
   */
  favoriteFlag: string
  /**
   * 收藏时间
   */
  createTime: string
}

export interface IReqExpertStatisticsQueryParams {
  gameType: number | undefined
  playTypeCode: string
  issue: number | undefined
}
interface DataItem {
  value: string // x-axis field name
  userCount: string // y-axis, number of people
  isHit: 'y' | 'n' // Whether hit: 'y' or 'n'
}
export interface IReqExpertStatisticsData {
  period: number // Period number
  periodName: string // Period name
  totalUserCount: number // Total number of people
  list: DataItem[] // Data list
}

export interface IReqHistoricalChampionQueryParams {
  gameType: number | undefined // Game type (required)
  issue: number | undefined // Period number (required)
  // playTypeCode: string // Play type code (optional, max length: 16)
  userId?: string // User ID (required)
  nickname?: string // Nickname (required)
}

export interface IReqHistoricalChampionData {
  sortNo: number // Serial number
  userId: number // User ID
  loginId: string // Login account
  nickname: string // User nickname
  avatar: string // User avatar
  gameType: number // Game type
  gameTypeShortName: string // Short name for game type
  playTypeCode: string // Play type code
  playTypeName: string // Primary play type name
  winRate: string // Winning rate
  total: number // Total number of times recommended
  winTotal: number // Wins this period
  failTotal: number // Losses this period
  longestWinStreak: number // Longest win streak in history
}

export interface IReqSixKingGalleryQueryParams {
  page: number // Required, int32, page number (default 0)
  size: number // Required, int32, number of items per page (default 0)
  sortName?: string // Optional, string, sort field name
  sortOrder?: 'ASC' | 'DESC' // Optional, enum type with values "ASC" or "DESC"
  userId: number // Required, int64, user ID (default 0)
  issueId: string
}

export interface IReqSixKingGalleryData {
  postId: number // int64, Comment ID
  postContent?: string // Comment content (max length 512)
  isAllPostContent?: 'y' | 'n' // Full content flag
  postTime: string // Post time (format: yyyy-MM-dd HH:mm:ss)
  postUserId: number // int64, Post user ID
  postThreadSeq: number // int32, Thread sequence
  likeCount: number // int32, Like count
  favoriteCount: number // int32, Favorite count
  likeStatus?: 'y' | 'n' // Like status (y/n)
  favoriteStatus?: 'y' | 'n' // Favorite status (y/n)
  threadCount: number // int32, Reply count
  readCount: number // int32, Read count
  threadPostId?: number // int64, Reply comment ID
  postIdPath?: string // Comment ID path
  isAnonymous?: 'y' | 'n' // Anonymous flag
  enableAnonymous?: 'y' | 'n' // Allow anonymous flag
  viewFlag?: 'a' | 'u' | 'r' | 'f' // View flag (a/u/r/f)
  postYear?: number // int32, Post year (max length 4)
  postIssue?: number // int32, Post issue (max length 32)
  issueId?: number // int64, Issue ID
  postGameRef?: string // Game reference (max length 32)
  postGametypeRef?: number // int32, Game type reference
  hasAttachment?: 'y' | 'n' // Has attachment (y/n)
  isEdited?: 'y' | 'n' // Edited status (y/n)
  lastEditTime?: string // Last edit time (format: yyyy-MM-dd HH:mm:ss)
  fromIp?: string // IP address (max length 64)
  fromClientFlag?: string // Client flag (max length 1)
  userMakeSenseCount?: number // User votes for helpful
  userMakeNoSenseCount?: number // User votes against helpful
  clientMakeSenseCount?: number // Anonymous helpful votes
  clientMakeNoSenseCount?: number // Anonymous unhelpful votes
  isMakeSense?: 'y' | 'n' // Make sense flag
  isHot?: 'y' | 'n' // Hot post flag
  isSelected?: 'y' | 'n' // Selected post flag
  isTop?: 'y' | 'n' // Top post flag
  isRecommended?: 'y' | 'n' // Recommended post flag
  isBloom?: 'y' | 'n' // Bloom flag
  isAuthor?: 'y' | 'n' // Author flag
  postType?: 'p' | 'a' // Comment type (p: default, a: explanation)
  status?: string // Status (y: enabled, n: deleted)
  attachments?: Attachment[] // Array of attachments
  avatar?: string // Avatar URL
  nickname?: string // Nickname
  issueDTO?: IssueDTO // Issue details
  likeTime?: string // Like time (format: yyyy-MM-dd HH:mm:ss)
  favoriteTime?: string // Favorite time (format: yyyy-MM-dd HH:mm:ss)
  createTime?: string // Creation time (format: yyyy-MM-dd HH:mm:ss)
  updateTime?: string // Update time (format: yyyy-MM-dd HH:mm:ss)
  predictFlag?: 'y' | 'n' // Prediction flag
  gcFlag?: 'ogc' | 'ugc' | 'pgc' // Post category (official/user-generated/admin)
  score?: number // double, score for sorting
  replyCount?: number // int64, number of replies
  replyPost?: IReqSixKingGalleryData // The post being replied to (self-reference)
  issueIds?: number[] // Issue ID array
  userIds?: number[] // User ID array
  loginId?: string // Login account (for precise query)
}

interface Attachment {
  attachmentId: number // int64, Primary Key
  attachmentType: 'p' | 'f' | 'a' | 'e' | 'v' | 's' | 'm' // Attachment types
  url: string // Attachment URL (max length 512)
  createTime: string // Creation time (format: yyyy-MM-dd HH:mm:ss, max length 30)
  attachmentStatus?: string // Attachment status (max length 1)
  isView?: 'y' | 'n' // Visibility (y/n)
  prefixPostfixFlag?: 'h' | 't' // Prefix/postfix flag
  attachmentUrl?: string // Optional URL (max length 512)
}

interface IssueDTO {
  issueId: number // int64, Table ID
  issue: number // int32, Issue number
  year: number // int32, Year
  name: string // Issue name
  likeCount: number // int32, Likes count
  favoriteCount: number // int32, Favorites count
  threadCount: number // int32, Comments count
  readCount: number // int32, Views count
  seriesCode?: string // Series code
  seriesName?: string // Series name
  newspaperCode?: string // Newspaper code
  newspaperName?: string // Newspaper name
  gameType: number // int32, Game type
  imgPath?: string // URI for image
  isColorful?: 'y' | 'n' // y: color, n: B/W
  isTop?: 'y' | 'n' // Top post flag
  isSelected?: 'y' | 'n' // Selected post flag
  isHot?: 'y' | 'n' // Hot post flag
  isBloom?: 'y' | 'n' // Bloom post flag
  isRecommended?: 'y' | 'n' // Recommended post flag
  commentFlag?: 'y' | 'n' // Allow comments flag
  voteFlag?: 'y' | 'n' // Allow voting flag
}

export interface ICreatePredictRQueryParams {
  bizFlag: 'b' | 't' | 'p' | 'r' // 业务类型 (bbs: 'b', 图库: 't', 竞选: 'p', 心水: 'r')
  bizId?: number // 业务ID，若无则不传
  postUserId: string | undefined // 发布用户ID（专家才能发布心水，talent=2）
  gameType: number | undefined // 游戏类型
  playTypeCode: string // 玩法 code (最大长度 16)
  predictScore?: number // 预测积分，若无则默认 0
  playTypeCheckNumberCode?: string // 正特码类型 (最大长度 4)
  predictTitle: string // 预测标题 (最大长度 64)
  predict: any[] // 预测结果数组 (具体类型需根据业务定义)
  fromIp: string // IP 地址
}
export interface ICreatePredictRData {
  bizFlag: string // 业务类型，如 'b' (bbs), 't' (图库), 'p' (竞选), 'r' (心水)
  bizId: number // 业务ID, 若无则为 0
  postUserId: number // 发布用户ID，专家才能发布心水（talent=2）
  gameType: number // 游戏类型
  playTypeCode: string // 玩法 code
  predictScore: number // 预测积分
  playTypeCheckNumberCode: string // 正特码类型
  predictTitle: string // 预测标题
  predict: number[] // 预测结果，数组格式
  fromIp: string // IP 地址
}

export interface IGetIpTopListData {
  ip: string // ip
  country: string // 国家
  city: string // 城市
  region: string // 地区
  latitude: string // 高度
  longitude: string // 纬度
  lastUpdateTime: string // 最后更新时间
}

export interface ISelectDomainAndIdNameQueryParams {
  websiteId?: string
  ownerUserId?: string
  websiteTemplateRef?: string
  domain?: string
}

export interface IReqUserListByUserIdAndNameData {
  userId: number
  loginId: string
  nickname: string
  regTime: string
  userLevel: number
  userStatus: string
  userType: string
  isAgent: string
  parentId: number
  parentLoginId: string
  parentNickname: string
  isFrontUser: string
  teamStatus: string
  regIP: string
  innerDistribution: string
  innerTags: string
  userMemo: string
  upperMemo: string
  kolMemo: string
  sysMemo: string
  mobileCountryCode: string
  mobile: string
  mobileShortcut: string
  email: string
  regChannel: string
  regFrom: string
  regPromotionCode: string
  gender: string
  lang: string
  lastLoginTime: string
  lastLoginIP: string
  isAuthentication: string
  isMobileAuthentication: string
  isKyc: string
  isBot: string
  accountType: string
  idcCode: string
  isBackendUser: string
  avatar: string
  kolUserId: number
  userPath: number[]
  vipLevel: number
  talent: number
  directSubCnt: number
  totalTeamCnt: number
  tags: ITags[]
  fansCount: number
  followCount: number
  friendCount: number
  likeCount: number
  collectCount: number
  viewCount: number
  acquireLikeCount: number
  acquireFavoriteCount: number
  publishCount: number
  score: number
  stars: number
  myPromotionCodeList: string[]
  lastLoginIPInfo: ILastLoginIPInfo
  lastUpdateTime: string
}

export interface ILastLoginIPInfo {
  ip: string
  country: string
  city: string
  region: string
  latitude: string
  longitude: string
}

export interface ITags {
  tagId: number
  tagName: string
  state: string
  flag: string
  createTime: string
}

export interface IReqUserListByUserIdAndNameQueryParams {
  page: number
  size: number
  sortName?: string
  sortOrder?: 'ASC' | 'DESC'
  inputText: string
}
