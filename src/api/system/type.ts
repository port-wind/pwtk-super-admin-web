export interface IOperationLogListQueryParams {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名称 (可选)
  sortOrder?: 'ASC' | 'DESC' // 排序顺序 (可选)
  username?: string // 操作人 (可选)
  path?: string // 接口路径 (可选)
  beginTime?: string // 开始时间 (格式: yyyy-MM-dd HH:mm:ss) (可选)
  endTime?: string // 结束时间 (格式: yyyy-MM-dd HH:mm:ss) (可选)
}

export interface IOperationLogListData {
  id: number // 操作记录唯一标识 (int64)
  accountId: number // 操作人ID (int64)
  accountName: string // 操作人用户名
  path: string // 接口路径
  interfaceDesc: string // 接口描述
  params: string // 参数
  ip: string // 操作IP
  createTime: string // 操作时间 (格式: yyyy-MM-dd HH:mm:ss)
}
