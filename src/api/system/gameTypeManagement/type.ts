export interface IGameInfo {
  areaCode: string
  createTime: string
  gameType: number
  gameTypeCode: string
  gameTypeLongName: string
  gameTypeName: string
  gameTypeShortName: string
  isAutoConfirm: string
  openTime: string
  sortNum: number
  status: string
}

export interface IGameTypePlatformListQueryParams {
  /** 页码 */
  page: number

  /** 每页显示条数 */
  size: number

  /** 排序字段名（可选） */
  sortName?: string

  /** 排序方式（可选，ASC 或 DESC） */
  sortOrder?: 'ASC' | 'DESC'

  /** 彩种简称（长度最长32位，可选） */
  gameTypeShortName?: string

  /** 彩种名称（长度最长64位，可选） */
  gameTypeName?: string

  /** 状态（可选） */
  status?: string
}
