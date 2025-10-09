export interface S3UploadParams {
  fileType: 'img' | 'ico' | 'video' | 'file' // 文件类型
  uploadFrom: string // 客户端保留路径
  uploadTarget: string // 原始文件名 + 文件后缀
  storageType: 's3' | 'r2' | string // 存储类型
  storageStyle: number // 存储路径风格
  env: 'dev' | 'test' | 'uat' | 'prod' // 环境变量
  file: File // 文件对象，不能大于10M
}
export interface IAddHttpQueryParams extends S3UploadParams {
  /** 活动名称 */
  activityName: string // string, 必填，最大长度255
  /** 开始时间 */
  beginTime: string // string, 必填
  /** 结束时间 */
  endTime: string // string, 必填
  /** 针对对象 */
  talents: string[] // array of strings, 可选，最大长度255
  /** url */
  url: string // string, 必填，最大长度255
  /** 状态; 0 禁用, 1 开启 */
  state?: '0' | '1' // string, 可选，最大长度1，正则表达式: [01]
  /** 备注 */
  remark?: string // string, 可选，最大长度255
  /** 路由; 0 内部路由, 1 外部链接 */
  routeType?: '0' | '1' // string, 可选，最大长度1，正则表达式: [01]
  /** 客户端类型; h h5, a android, i ios */
  clientType?: 'h' | 'a' | 'i' // string, 可选，最大长度1
  /** 图片路径 */
  imgPath?: string // string, 可选，最大长度255
}

export interface IEditHttpQueryParmas {
  /** 活动ID */
  activityId: string // string, 必填，最大长度255
  /** 活动名称 */
  activityName: string // string, 必填，最大长度255
  /** 开始时间 */
  beginTime?: string // string, 可选
  /** 结束时间 */
  endTime?: string // string, 可选
  /** 针对对象 */
  talents: string[] // array of strings, 必填，最大长度255
  /** url */
  url: string // string, 必填，最大长度255
  /** 状态; 0 或 1 */
  state?: '0' | '1' // string, 可选，最大长度255，正则表达式: [01]
  /** 备注 */
  remark?: string // string, 可选，最大长度255
  /** 图片路径 */
  imgPath?: string // string, 可选，最大长度255
  /** 管理站点ID; 仅数字 */
  manageSiteId?: string // string, 可选，正则表达式: ^[0-9]*$
}

export interface IReqHttpQueryParams {
  /** 页码 */
  page: number // int32, 必填
  /** 每页显示条数 */
  size: number // int32, 必填
  /** 排序字段名称 */
  sortName?: string // string, 可选
  /** 排序方式 */
  sortOrder?: 'ASC' | 'DESC' // enum, 可选
  /** 活动名称 */
  activityName?: string // string, 可选，最大长度255
  /** 开始时间 */
  beginTime?: string // string, 可选
  /** 结束时间 */
  endTime?: string // string, 可选
  /** 针对对象 */
  talents?: string[] // array of strings, 可选，最大长度255
  /** 对象类型 */
  clientType?: string // string, 可选，最大长度1
  /** 管理站点ID; 仅数字 */
  manageSiteId?: string // string, 可选，正则表达式: ^[0-9]*$
}
