import type { BaseResponse } from '@/api/type'
export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称
  sortOrder?: string // 排序顺序
  appId?: string // appid
  typeOne?: string // 分类1
  typeTwo?: string // 分类2
  typeThree?: string // 分类3
  title?: string // 标题
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}
export interface AddRequest {
  attachmentId?: string // 附件ID
  forumPostId?: string // forum_post_id
  attachmentType?: string // 附件类型;p,图片;f,文件;a,APK;e,EXE;v,视频;s,声频;m,音乐;
  createTime?: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  attachmentStatus?: string // 附件状态
  isView?: string // 是否可见
  prefixPostfixFlag?: string // 前缀后缀标记;h,在前面(head);t,在尾部(tail)
  attachmentUrl?: string // 附件URL
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  attachmentId?: string // 附件ID
  forumPostId?: string // forum_post_id
  attachmentType?: string // 附件类型;p,图片;f,文件;a,APK;e,EXE;v,视频;s,声频;m,音乐;
  createTime?: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  attachmentStatus?: string // 附件状态
  isView?: string // 是否可见
  prefixPostfixFlag?: string // 前缀后缀标记;h,在前面(head);t,在尾部(tail)
  attachmentUrl?: string // 附件URL
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  attachmentId: string
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  attachmentId: number
  bbsId: number // BBS ID
  bbsName: string // bbs名称
  createTime: string // 创建时间，格式: yyyy-MM-dd HH:mm:ss
  bbsIcon?: string // bbs icon图标，optional
}
export interface GetNameRequest {
  siteName: string // 255新闻站点名称
}
export interface GetNameResponse extends BaseResponse {
  data?: {
    appId: string // 新闻站点ID
    siteName: string //新闻站点名称
  }
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'
