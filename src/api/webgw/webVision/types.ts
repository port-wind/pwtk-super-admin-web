import type { BaseResponse } from '@/api/type'

/**
 * 分页相关参数
 */
interface Pagination {
  page: number // 页码
  size: number // 每页显示条数
}

/**
 * 排序相关参数
 */
interface Sorting {
  sortName?: string // 排序字段名，非必填
  sortOrder?: 'ASC' | 'DESC' // 排序顺序，非必填，ASC: 升序, DESC: 降序
}

/**
 * 组件相关参数
 */
interface ComponentInfo {
  componentId?: number // 组件ID，非必填
  websiteId?: string // 模板ID，非必填，最大长度128
  componentType?: string // 组件类型，非必填，最大长度128
  componentName?: string // 组件名称，非必填，最大长度128
}

// 综合所有类型声明
export interface GetRequest extends Pagination, Sorting, ComponentInfo {}

/**
 * 组件数据类型
 */
export interface TableData {
  componentId: string // 组件ID
  websiteId: string // 站点ID
  componentType: string // 组件类型
  componentRef: string // 引用组件ID
  componentName: string // 组件名称
  pageRenderingSeq: number // 页面渲染顺序
  configParamJson: string // 组件参数配置
  memo?: string // 备注，可选
  status: 'y' | 'n' // 状态，'y' 表示有效，'n' 表示无效
  isView: 'y' | 'n' // 是否可见，'y' 表示可见，'n' 表示不可见
}

/**
 * 返回数据类型
 */
export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: Array<TableData> // 当前数据列表
  }
}

export interface AddRequest {
  websiteId?: string // 站点ID
  componentType?: string // 组件类型
  componentRef?: string // 引用组件ID
  componentName?: string // 组件名称
  pageRenderingSeq?: number // 页面渲染顺序
  configParamJson?: string // 组件参数配置
  memo?: string // 备注
  status?: 'y' | 'n' // 状态; 'y' 表示有效, 'n' 表示无效
  isView?: 'y' | 'n' // 是否可见; 'y' 表示可见, 'n' 表示不可见
}
export interface AddResponse extends BaseResponse {}
export interface EditRequest {
  componentId: string // 组件ID
  websiteId?: string // 站点ID
  componentType?: string // 组件类型
  componentRef?: string // 引用组件ID
  componentName?: string // 组件名称
  pageRenderingSeq?: number // 页面渲染顺序
  configParamJson?: string // 组件参数配置
  memo?: string // 备注
  status?: 'y' | 'n' // 状态; 'y' 表示有效, 'n' 表示无效
  isView?: 'y' | 'n' // 是否可见; 'y' 表示可见, 'n' 表示不可见
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  componentId: string // 组件ID
}
export interface DelResponse extends BaseResponse {}
