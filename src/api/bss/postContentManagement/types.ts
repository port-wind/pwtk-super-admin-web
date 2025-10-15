import type { BaseResponse } from '@/api/type'
export interface IReqHttpBBsForumListQueryParams {
  // 必填参数
  page: number // 页码
  size: number // 每页显示条数

  // 可选参数
  sortName?: string // 排序字段
  sortOrder?: SortOrder // 排序方向
  postId?: string // 帖子ID
  forumId?: string // 论坛ID
  postContent?: string // 帖子内容或预览
  isAllPostContent?: 'y' | 'n' // 是否全部帖子内容
  postTime?: string // 发布时间 yyyy-MM-dd HH:mm:ss
  postUserId?: string // 发布用户ID
  postThreadSeq?: string // 帖子序列号
  likeCount?: string // 点赞数量
  favoriteCount?: string // 收藏数量
  threadCount?: string // 回复数量
  readCount?: string // 阅读数量
  isAnonymous?: string // 匿名回复
  isAuthor?: string // 是否作者
  enableAnonymous?: string // 是否可以匿名回复
  viewFlag?: 'a' | 'u' | 'r' | 'f' // 可见标记
  postYear?: string // 发布年份
  postIssue?: string // 发布期数
  hasAttachment?: 'y' | 'n' // 是否有附件
  postStatus?: string // 帖子状态
  regStartTime?: string // 注册开始时间 yyyy-MM-dd HH:mm:ss
  regEndTime?: string // 注册截止时间 yyyy-MM-dd HH:mm:ss
  attachments?: Attachment[] // 附件数组
  mapKey?: string // map key
  selectedUserId?: string // 所选择的用户ID
  postGametypeRef?: string // 彩种
  bbsId?: string // 论坛ID
}

// 附件接口
interface Attachment {
  // 定义附件的具体字段
  [key: string]: any // 根据实际附件结构定义
}

export interface IReqHttpBBsForumListData {
  taskId: number // int64
  total: number // int32
  postId: string // 帖子ID
  title: string // 帖子标题
  forumId: string // 论坛ID
  postRef: string // 主贴ID
  postContent: string // 帖子内容或预览
  isAllPostContent: string // 是否全部帖子内容;y,全部;n,部分
  postTime: string // 发布时间 yyyy-MM-dd HH:mm:ss
  postUserId: string // 发布用户ID
  postThreadSeq: number // 帖子序列号;0,表示主贴
  likeCount: string // 点赞数量
  favoriteCount: string // 收藏数量
  threadCount: string // 回复数量
  readCount: string // 阅读数量
  threadPostId: number // 回复帖子ID
  isAnonymous: string // 匿名回复的
  isAuthor: string // 是否作者
  enableAnonymous: string // 是否可以匿名回复
  viewFlag: string // 可见标记;a,所有可见;u,用户可见;r,关注可见;f,好友可见
  postYear: string // 发布年份
  postIssue: string // 发布期数
  postGameRef: string // 发布关联游戏标记
  postGametypeRef: string // 发布关联游戏类型标记
  hasAttachment: string // 是否有附件;y,有;n,没有
  postStatus: string // 帖子状态
  forumName: string // forumName
  isEdited: string // 是否被编辑过;y,有;n,没有
  lastEditTime: string // 最后编辑时间 yyyy-MM-dd HH:mm:ss
  fromIp: string // 来源IP
  fromClientFlag: string // 来源终端标记
  userMakeSenseCount: number // 用户有心水数
  userMakeNoSenseCount: number // 用户没心水数
  clientMakeSenseCount: number // 匿名有心水数
  clientMakeNoSenseCount: number // 匿名无心水数
  isMakeSense: string // 是否心水
  isHot: string // 是否热门
  isSelected: string // 是否精选
  isTop: string // 是否置顶
  isRecommended: string // 是否推荐
  isBloom: string // 是否爆款
  replies: any[] // 回复数组
  page: number // int32
  size: number // int32
  attachments: any[] // 要存储的附件数组
  url: string // url
  fileType: string // 附件类型;p,图片;f,文件;a,APK;e,EXE;v,视频;s,声频;m,音乐
  childrenSize: number // 回贴的数量
  toUserId: number // 被回复的帖子的postUserId
  toNickname: string // 被回复的帖子的postUserId的nickname
  likeStatus: string // 点赞状态
  favoriteStatus: string // 收藏状态
  dislikeStatus: string // 倒赞状态
  selectedUserId: string // 所选择的用户ID（可空）
  addAttachments: any[] // 附件数组
  predictFlag: string // 竞猜，参赛 y是 n否
  isVote: string // 是否投票 y是 n否
  seriesId: string // 系列ID
  avatar: string // 头像
  nickname: string // 昵称
  vipLevel: number // 会员等级
  commentedPostId: string // 评论帖子ID
  commentedAvatar: string // 评论者头像
  commentedNickname: string // 评论者昵称
  commentedPostUserId: string // 评论者用户ID
  commentedVipLevel: number // 评论者会员等级
  gcFlag: string // 数据来源 ogc官方数据，ugc用户数据，pgc后台数据
}

export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}
export interface ILastIssuePostParams {
  postGametypeRef: string // 彩种
  forumId: string // 论坛ID
  page?: number
  size?: number
}
export type PredictionInfo = {
  gameType: string
  playTypeCode: string
  name: string
  predict: string[]
  valid?: boolean
}

export interface ICreateBbsPostQueryParams {
  // 必填字段
  postGametypeRef: string // 发布关联游戏类型标记
  // 非必填字段
  postId?: string // 帖子ID
  title?: string // 帖子标题
  forumId?: string // 论坛ID
  postContent?: string // 帖子内容或预览
  isAllPostContent?: string // 是否全部帖子内容; y: 全部; n: 部分
  postTime?: string // 发布时间 (格式: yyyy-MM-dd HH:mm:ss)
  postUserId?: string // 发布用户ID
  userId?: string // 发布用户ID backup
  postThreadSeq?: string // 帖子序列号 (0 表示主贴)
  likeCount?: string // 点赞数量
  favoriteCount?: string // 收藏数量
  threadCount?: string // 回复数量
  readCount?: string // 阅读数量
  threadPostId?: string // 回复帖子ID
  isAnonymous?: string // 匿名回复
  isAuthor?: string // 是否作者
  enableAnonymous?: string // 是否可以匿名回复
  viewFlag?: string // 可见标记 (a: 所有可见; u: 用户可见; r: 关注可见; f: 好友可见)
  postYear?: string // 发布年份
  postIssue?: string // 发布期数
  postGameRef?: string // 发布关联游戏标记
  hasAttachment?: string // 是否有附件 (y: 有; n: 没有)
  postStatus?: string // 帖子状态
  isEdited?: string // 是否被编辑过 (y: 是; n: 否)
  lastEditTime?: string // 最后编辑时间 (格式: yyyy-MM-dd HH:mm:ss)
  fromIp?: string // 来源IP
  fromClientFlag?: string // 来源终端标记
  userMakeSenseCount?: number // 用户有心水数 (默认值: 0)
  userMakeNoSenseCount?: number // 用户没心水数 (默认值: 0)
  clientMakeSenseCount?: number // 匿名有心水数 (默认值: 0)
  clientMakeNoSenseCount?: number // 匿名无心水数 (默认值: 0)
  isMakeSense?: string // 是否心水
  isHot?: string // 是否热门
  isSelected?: string // 是否精选
  isTop?: string // 是否置顶
  isRecommended?: string // 是否推荐
  isBloom?: string // 是否爆款
  predictFlag?: string // 竞猜，参赛 (y: 是; n: 否)
  isVote?: string // 是否投票 (y: 是; n: 否)
  attachments?: any[] // 要存储的附件数组
  mapKey?: string // A map key
  predictionMode?: string // 玩法类型
  predictionModeInit?: string // 初始玩法类型
  predictions?: PredictionInfo[] // 预测数组
  forumName?: string // 论坛名称
}
export interface IUpdateBbsPostQueryParams {
  postId?: string // 帖子ID
  title?: string // 帖子标题
  forumId?: string // 论坛ID
  postContent?: string // 帖子内容或预览
  isAllPostContent?: 'y' | 'n' // 是否全部帖子内容; y: 全部; n: 部分
  postTime?: string // 发布时间 (格式: yyyy-MM-dd HH:mm:ss)
  postUserId?: string // 发布用户ID
  userId?: string // 发布用户ID backup
  postThreadSeq?: string // 帖子序列号; 0 表示主贴
  likeCount?: string // 点赞数量
  favoriteCount?: string // 收藏数量
  threadCount?: string // 回复数量
  readCount?: string // 阅读数量
  threadPostId?: string // 回复帖子ID
  isAnonymous?: string // 匿名回复
  isAuthor?: string // 是否作者
  enableAnonymous?: string // 是否可以匿名回复
  viewFlag?: 'a' | 'u' | 'r' | 'f' // 可见标记 (a: 所有可见; u: 用户可见; r: 关注可见; f: 好友可见)
  postYear?: string // 发布年份
  postIssue?: string // 发布期数
  postGameRef?: string // 发布关联游戏标记
  postGametypeRef?: string // 发布关联游戏类型标记
  hasAttachment?: 'y' | 'n' // 是否有附件 (y: 有; n: 没有)
  postStatus?: string // 帖子状态
  isEdited?: 'y' | 'n' // 是否被编辑过 (y: 是; n: 没有)
  lastEditTime?: string // 最后编辑时间 (格式: yyyy-MM-dd HH:mm:ss)
  fromIp?: string // 来源IP
  fromClientFlag?: string // 来源终端标记
  userMakeSenseCount?: number // 用户有心水数 (默认值: 0)
  userMakeNoSenseCount?: number // 用户没心水数 (默认值: 0)
  clientMakeSenseCount?: number // 匿名有心水数 (默认值: 0)
  clientMakeNoSenseCount?: number // 匿名无心水数 (默认值: 0)
  isMakeSense?: string // 是否心水
  isHot?: string // 是否热门
  isSelected?: string // 是否精选
  isTop?: string // 是否置顶
  isRecommended?: string // 是否推荐
  isBloom?: string // 是否爆款
  selectedUserId?: string // 所选择的用户ID (可为空)
  mainPostId?: string // 主贴ID
  predictFlag?: 'y' | 'n' // 竞猜，参赛 (y: 是; n: 否)
  isVote?: 'y' | 'n' // 是否投票 (y: 是; n: 否)
  attachments?: any[] // 要存储的附件数组
  forumName?: string // 论坛名称
  predictionMode?: string // 玩法类型
  predictionModeInit?: string // 初始玩法类型
  predictions?: PredictionInfo[] // 预测数组
  postPrediction?: DetailPredictionData // 预测数组
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  forumPostId: string | number // 帖子ID
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  postId: string // 帖子ID
  forumId?: string // 论坛ID
  postContent?: string // 帖子内容或预览
  postUserId?: string // 发布用户ID
  enableAnonymous?: string // 是否可以匿名回复
  viewFlag?: string // 可见标记;a,所有可见;u,用户可见;r,关注可见;f,好友可见;
  postStatus?: string // 帖子状态
  title?: string
}

export interface GetTreeRequest {
  issueId?: string
  selectedUserId?: string
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称
  sortOrder?: string // 排序顺序
  postContent?: string // 帖子内容
  enableAnonymous?: string // 是否可以匿名回复
  viewFlag?: string // 可见标记;a,所有可见;u,用户可见;r,关注可见;f,好友可见;
  hasAttachment?: string // 是否有附件;y,有;n,没有
  postStatus?: string // 帖子状态
  postId?: string
  postYear?: string
  postIssue?: string
}
export interface GetTreeResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface AddReplyRequest {
  threadPostId: string // 帖子ID
  forumId?: string // 论坛ID
  postContent: string // 帖子内容或预览
}
export interface AddReplyResponse extends BaseResponse {}
export interface ActionRequest {
  postId: string
  selectedUserId: string
  postYear: string
  postIssue: string
  postRef: string
  issueId: string
  ipInfo: string
  likeType: string
  likeFlag: string
}
// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'

export interface IReqCommentsListQueryParams {
  // 必填参数
  page: number // 页码
  size: number // 每页显示条数
  userId: string // 用户ID

  // 可选参数
  sortName?: string // 排序字段名
  sortOrder?: SortOrder // 排序方向
  postId?: string // 主贴ID
  bbsId?: string // bbsId
  mainBoardId?: string // 主板Id
  forumId?: string // 论坛ID
}

export interface IReqCommentsListData {
  postId: string // 帖子ID
  bbsId: string // BBSID
  forumId: string // 论坛Id
  title: string // 帖子标题
  postContent: string // 评论内容
  likeCount: string // 点赞数量
  threadCount: string // 回复数量
  postYear: string // 发布年份
  postIssue: string // 发布期数
  shortIssue: string // 短期数
  postGameRef: string // 发布关联游戏标记
  postGametypeRef: string // 发布关联游戏类型标记
  isHot: string // 是否热门
  isSelected: string // 是否精选
  isTop: string // 是否置顶
  isRecommended: string // 是否推荐
  isBloom: string // 是否爆款
  vipLevel: number // 用户等级
  avatar: string // 头像
  nickname: string // 昵称
  isLike: string // 是否点赞
  isDislike: string // 是否点踩
  postUserId: string // 发布用户ID
  predictFlag: string // 是否参赛贴；y是 n否
  postTime: string // 发布时间 yyyy-MM-dd HH:mm:ss
  imagePath: string // 附件的第一张图
  postRef: string // 主贴ID
  postId1: string // 被评论的ID
  postUserId1: string // 被评论用户ID
  vipLevel1: number // 被回复人等级
  avatar1: string // 被回复人头像
  nickname1: string // 被回复人昵称
  postContent1: string // 被回复人评论内容
  attachments1: any // 被回复人评论的附件
  mainPostTitle: string // 主贴用户ID
  mainPostId: string // 主贴用户ID
  mainPostUserId: string // 主贴用户ID
  mainPostVipLevel: number // 主贴用户等级
  mainPostUserAvatar: string // 主贴用户头像
  mainPostUserNickname: string // 昵称
  mainPostContent: string // 主贴内容
  mainPostTime: string // 主贴发表时间 yyyy-MM-dd HH:mm:ss
  isAuthor: string // 是否作者 （y是，n否）
  attachments: any // 附件
}

export interface IGetBbsForumPostByIdQueryParams {
  postId: number
  forumId: number
}
export interface IGetBbsForumPostByIdData {
  taskId: number // Task ID
  total: number // Total count
  postId: string // 帖子ID
  title: string // 帖子标题
  forumId: string // 论坛ID
  postRef: string // 主贴ID
  postContent: string // 帖子内容或预览
  isAllPostContent: 'y' | 'n' // 是否全部帖子内容; y: 全部; n: 部分
  postTime: string // 发布时间 (yyyy-MM-dd HH:mm:ss)
  postUserId: string // 发布用户ID
  postThreadSeq: number // 帖子序列号; 0 表示主贴
  likeCount: string // 点赞数量
  favoriteCount: string // 收藏数量
  threadCount: string // 回复数量
  readCount: string // 阅读数量
  threadPostId: number // 回复帖子ID
  isAnonymous: 'y' | 'n' // 匿名回复的
  isAuthor: 'y' | 'n' // 是否作者
  enableAnonymous: 'y' | 'n' // 是否可以匿名回复
  viewFlag: 'a' | 'u' | 'r' | 'f' // 可见标记; a: 所有可见; u: 用户可见; r: 关注可见; f: 好友可见
  postYear: string // 发布年份
  postIssue: string // 发布期数
  postGameRef: string // 发布关联游戏标记
  postGametypeRef: string // 发布关联游戏类型标记
  hasAttachment: 'y' | 'n' // 是否有附件; y: 有; n: 没有
  postStatus: string // 帖子状态
  forumName: string // 论坛名称
  isEdited: 'y' | 'n' // 是否被编辑过; y: 有; n: 没有
  lastEditTime: string // 最后编辑时间 (yyyy-MM-dd HH:mm:ss)
  fromIp: string // 来源IP
  fromClientFlag: string // 来源终端标记
  userMakeSenseCount: number // 用户有心水数 (默认值为 0)
  userMakeNoSenseCount: number // 用户没心水数 (默认值为 0)
  clientMakeSenseCount: number // 匿名有心水数 (默认值为 0)
  clientMakeNoSenseCount: number // 匿名无心水数 (默认值为 0)
  isMakeSense: 'y' | 'n' // 是否心水
  isHot: 'y' | 'n' // 是否热门
  isSelected: 'y' | 'n' // 是否精选
  isTop: 'y' | 'n' // 是否置顶
  isRecommended: 'y' | 'n' // 是否推荐
  isBloom: 'y' | 'n' // 是否爆款
  replies?: Array<any> // 回复数组
  page: number // 页码
  size: number // 每页数量
  attachments?: Array<Attachment> // 附件数组
  childrenSize: number // 回贴的数量
  toUserId: number // 被回复的帖子的 postUserId
  toNickname: string // 被回复的帖子的 nickname
  likeStatus: string // 点赞状态
  favoriteStatus: string // 收藏状态
  dislikeStatus: string // 倒赞状态
  selectedUserId?: string // 所选择的用户ID
  addAttachments?: Array<any> // 新增附件数组
  predictFlag: 'y' | 'n' // 竞猜，参赛; y: 是; n: 否
  isVote: 'y' | 'n' // 是否投票; y: 是; n: 否
  seriesId: string // 系列ID
  avatar: string // 用户头像
  nickname: string // 用户昵称
  vipLevel: number // VIP等级 (默认值为 0)
  commentedPostId?: string // 被评论的帖子ID
  commentedAvatar?: string // 被评论的用户头像
  commentedNickname?: string // 被评论的用户昵称
  commentedPostUserId?: string // 被评论的用户ID
  commentedVipLevel?: number // 被评论的用户VIP等级
  gcFlag: 'ogc' | 'ugc' | 'pgc' // 数据来源; ogc: 官方数据; ugc: 用户数据; pgc: 后台数据
  attachmentDTOS?: Array<AttachmentDTO> // 附件 DTO 数组
  postName: string // 帖子名称
  attachmentStatus: string // 附件状态
  isView: string // 是否可见
  prefixPostfixFlag: 'h' | 't' // 前缀后缀标记; h: 在前面; t: 在尾部
}

interface Attachment {
  url: string // 附件 URL
  fileType: 'p' | 'f' | 'a' | 'e' | 'v' | 's' | 'm' // 附件类型
}

interface AttachmentDTO {
  attachmentId: string // 附件ID
  forumPostId: string // forum_post_id
  attachmentType: 'p' | 'f' | 'a' | 'e' | 'v' | 's' | 'm' // 附件类型
  createTime: string // 创建时间 (yyyy-MM-dd HH:mm:ss)
  attachmentStatus: string // 附件状态
  attachmentUrl: string // 附件 URL
}

export interface IPlayRule {
  id: number
  name: string
  code: string
  max: number
  min: number
  source: string
}

export interface IPostPredictionRule {
  id: string
  name: string
  code: string
  playRules: IPlayRule[]
}

export interface DetailPrediction {
  name: string
  predict: string[]
  hitDetail: string
  isHit: string
}
export interface DetailPredictionData {
  name: string
  isHit: string
  point: number
  code: string
  gameTypeName?: string
  predictionDTOList: DetailPrediction[]
}
