import type { BaseResponse } from '@/api/type'
export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称
  sortOrder?: string // 排序顺序
  forumName?: string // 论坛名称
  forumCategory?: string // 论坛类别
  createTime?: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  forumStatus?: string // 论坛状态
  forumId?: string // 论坛ID
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}
export interface AddRequest {
  forumId: string // 论坛ID
  mainboardId: string // 主板ID
  forumName?: string // 论坛名称
  forumCategory?: string // 论坛类别
  forumIcon?: string // 论坛icon
  forumStatus?: string // 论坛状态
  createTime?: string
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  forumId: string // 论坛ID
  mainboardId: string // 主板ID
  forumName?: string // 论坛名称
  forumCategory?: string // 论坛类别
  forumIcon?: string // 论坛icon
  forumStatus?: string // 论坛状态
  createTime?: string
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  attachmentId: string
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  forumId: string // 论坛ID
  mainboardId: string // 主板ID
  forumName: string // 论坛名称
  forumCategory: string // 论坛类别
  forumIcon: string // 论坛icon
  forumStatus: string // 论坛状态
  createTime?: string
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'

export interface IGetBBsForumIdByIdQueryParams {
  // 必填字段
  page: number // 页码
  size: number // 每页显示条数

  // 非必填字段
  sortName?: string // 排序字段名
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 ('ASC' 或 'DESC')
  forumId?: string // 论坛ID
  forumName?: string // 论坛名称
  forumCategory?: string // 论坛类别
  createTime?: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  forumStatus?: string // 论坛状态 (bbsForum 状态)
  regStartTime?: string // 注册查询开始时间 (格式: yyyy-MM-dd HH:mm:ss)
  regEndTime?: string // 注册查询截止时间 (格式: yyyy-MM-dd HH:mm:ss)
  mainboardId?: string // 主板ID
}
export interface IGetBBsForumIdByIdData {
  forumId: string // BbsForum ID
  mainboardId: string // 主板ID
  forumName: string // 论坛名称
  forumCategory: string // 论坛类别
  createTime: string // 创建时间 (格式: yyyy-MM-dd HH:mm:ss)
  forumIcon?: string // 论坛 icon 图标
  forumStatus?: string // Forum 状态
  mainboardName?: string // 主板名称
  isRecommended?: string // 是否推荐
  isHot?: string // 是否热门
  isTop?: string // 是否置顶
  isBloom?: string // 是否爆款
  isSelected?: string // 是否精选
  gcFlag?: 'ogc' | 'ugc' | 'pgc' // 数据来源 (ogc: 官方数据, ugc: 用户数据, pgc: 后台数据)
}
