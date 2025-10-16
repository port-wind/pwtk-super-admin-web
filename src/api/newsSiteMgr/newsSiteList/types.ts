import type { BaseResponse } from '@/api/type'
export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称
  sortOrder?: SortOrder // 排序顺序
  appId?: string // 新闻站点ID
  siteName?: string // 新闻站点名称
}
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface TableData {
  appId: string //新闻站点ID
  siteName: string // 新闻站点名称
  articleCount: number //文章数量
  websiteUrl: string // 官网地址
  queryDataUrl?: string // 爬取数据地址
  createTime?: string // 创建时间
}

// 定义 SortOrder 类型
type SortOrder = 'ASC' | 'DESC'

//新闻站点名称
export interface GetNameRequest {
  siteName: string // 255新闻站点名称
}
export interface GetNameResponse extends BaseResponse {
  data?: {
    appId: string // 新闻站点ID
    siteName: string //新闻站点名称
  }
}
