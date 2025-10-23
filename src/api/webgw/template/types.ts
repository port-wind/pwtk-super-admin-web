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
  componentId?: number // 组件ID
  templateId?: string // 模板ID, 最大长度: 128
  componentType?: string // 组件类型, 最大长度: 128
  componentName?: string // 组件名称, 最大长度: 128
  configParamJsonOff?: string // 组件参数配置开关, 1:显示 默认 2:不显示, 最大长度: 1
}

// 综合所有类型声明
export interface GetRequest extends Pagination, Sorting, ComponentInfo {}

/**
 * 组件数据类型
 */
export interface TableData {
  componentId: number // 组件ID
  templateId: string // 模板ID
  componentType: string // 组件类型
  componentName: string // 组件名称
  pageRenderingSeq: string // 页面渲染顺序
  configParamJson: string // 组件参数配置
  status: string // 状态; y: 有效; n: 无效;
  isView: string // 是否可见; y: 可见; n: 不可见;
  componentSort: number // 组件排序
  memo: string // 备注
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
  templateId: string // 模板ID (必填)
  componentType: string // 组件类型 (必填)
  componentName: string // 组件名称 (必填)
  pageRenderingSeq?: string // 页面渲染顺序 (必填) - Validate[regexp: ^[0-9]*$; ]
  configParamJson?: string // 组件参数配置 (可选)
  status?: string // 状态 (可选); y: 有效; n: 无效;
  isView?: string // 是否可见 (可选); y: 可见; n: 不可见;
  componentSort?: string // 组件排序 (可选) - Validate[regexp: ^[0-9]*$; ]
  memo?: string // 备注 (可选)
}
export interface AddResponse extends BaseResponse {
  data: string // 组件ID
}
export interface EditRequest {
  componentId: number // 组件ID (必填)
  templateId?: string // 模版ID (可选)
  componentType?: string // 组件类型 (可选)
  componentName?: string // 组件名称 (可选)
  pageRenderingSeq?: string // 页面渲染顺序 (可选) - Validate[regexp: ^[0-9]*$; ]
  configParamJson?: string // 组件参数配置 (可选)
  status?: string // 状态 (可选); y: 有效; n: 无效;
  isView?: string // 是否可见 (可选); y: 可见; n: 不可见;
  componentSort?: number // 组件排序 (可选)
  memo?: string // 备注 (可选)
}
export interface EditResponse extends BaseResponse {}

export interface DelRequest {
  componentId: string[] // 组件ID
}
export interface DelResponse extends BaseResponse {
  data?: {
    componentId: number // 组件ID
    templateId: string // 模版ID
    componentType: string // 组件类型
    componentName: string // 组件名称
    pageRenderingSeq: string // 页面渲染顺序
    configParamJson: string // 组件参数配置
    status: string // 状态; y: 有效; n: 无效;
    isView: string // 是否可见; y: 可见; n: 不可见;
    componentSort: number // 组件排序
    memo: string // 备注
  }
}

export interface GetByIdRequest {
  templateId: string // 组件ID
}
export interface GetByIdResponse extends BaseResponse {
  data?: {
    componentId: number // 组件ID
    templateId: string // 模版ID
    componentType: string // 组件类型
    componentName: string // 组件名称
    pageRenderingSeq: string // 页面渲染顺序
    configParamJson: string // 组件参数配置
    status: string // 状态; y: 有效; n: 无效;
    isView: string // 是否可见; y: 可见; n: 不可见;
    componentSort: number // 组件排序
    memo: string // 备注
  }
}

export interface updateRendSeqRequest {
  templateId: string // 组件ID,
  list: {
    componentId: string // 组件ID (必填)
    templateId?: string // 模版ID (可选)
    componentType: string // 组件类型 (可选)
    componentName: string // 组件名称 (可选)
    pageRenderingSeq: string // 页面渲染顺序 (可选) - Validate[regexp: ^[0-9]*$; ]
    configParamJson?: string // 组件参数配置 (可选)
    status?: string // 状态 (可选); y: 有效; n: 无效;
    isView?: string // 是否可见 (可选); y: 可见; n: 不可见;
    componentSort?: number // 组件排序 (可选)
    memo?: string // 备注 (可选)
  }[]
}

export interface updateRendSeqResponse extends BaseResponse {
  data?: {
    componentId: number // 组件ID
    templateId: string // 模版ID
    componentType: string // 组件类型
    componentName: string // 组件名称
    pageRenderingSeq: string // 页面渲染顺序
    configParamJson: string // 组件参数配置
    status: string // 状态; y: 有效; n: 无效;
    isView: string // 是否可见; y: 可见; n: 不可见;
    componentSort: number // 组件排序
    memo: string // 备注
  }
}
