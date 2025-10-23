import type { BaseResponse } from '@/api/type'
export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称，optional
  sortOrder?: string // 排序顺序，optional
  bbsName?: string
  bbsId?: string
  createTime?: string
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface AddRequest {
  bbsId: string
  bbsName?: string
  createTime?: string
  bbsIcon?: string
  bbsStatus?: string
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  bbsId: string
  bbsName?: string
  createTime?: string
  bbsIcon?: string
  bbsStatus?: string
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  bbsId: string | number // 帖子ID
}
export interface DelResponse extends BaseResponse {}

export interface TableData {
  bbsId: string
  bbsName?: string
  createTime?: string
  bbsIcon?: string
  bbsStatus?: string
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'
