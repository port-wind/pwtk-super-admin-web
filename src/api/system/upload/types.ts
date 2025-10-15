import type { BaseResponse } from '@/api/type'
// export type Env = 'dev' | 'test' | 'uat' | 'prod'
export type FileType = 'img' | 'ico' | 'video' | 'file'
export interface fileUploadOption {
  fileType: FileType
  uploadFrom: string
  storageStyle: number
  manageSiteId?: string
}

export interface FileUploadRequest extends fileUploadOption {
  uploadTarget: string // 原始文件名+件后缀: 666.png
  storageType: EStorageType // 存储类型: s3, r2
  env: Environment // 环境变量: dev, test, uat, prod
  file: File // 文件，不能大于10M
}

export interface FileUploadRequestWithIssueNumber extends FileUploadRequest {
  issueNumber: string
}

export interface FileUploadResponse extends BaseResponse {
  data: string //文件uri， 例如: /{env}media/{uploadFrom}/{uploadType}/24/12/{uploadTarget}
}

type SortOrder = 'ASC' | 'DESC'

export interface GetRequest {
  page: number // 页码
  size: number // 每页显示条数
  sortName?: string // 排序字段名
  sortOrder?: SortOrder // 排序顺序
  fileNameOrId?: string // 文件名称或ID
  uploadUser?: string // 上传用户ID
  uploadStartTime?: string // 上传开始时间
  uploadEndTime?: string // 上传结束时间
}

export interface GetResponse extends BaseResponse {
  data?: {
    total: number // 总条数
    list: TableData[]
  }
}

export interface TableData {
  uploadId: string // 上传ID
  fileType: string // 文件类型
  fileFrom: string // 文件来源
  fileTarget: string // 文件目标
  fileName: string // 文件名
  storageType: string // 存储类型
  storageStyle: string // 存储风格
  env: Environment // 环境
  recordTime: string // 记录时间，格式: yyyy-MM-dd HH:mm:ss
  uploadUser: number // 上传用户
  biz: string // 业务
}

export interface AddRequest {
  fileType: FileType
  uploadFrom: string // 客户端保留路径: sketch_code/site_template/site_id
  uploadTarget: string // 原始文件名+文件后缀: 666.png
  storageType: EStorageType // 存储类型: s3, r2
  storageStyle: number
  uploadUser: string //用户ID
  biz: 'upload'
  env: Environment // 环境变量: dev, test, uat, prod
  fileSize: string // 大小
}

export interface AddResponse extends BaseResponse {}

export interface IUploadRequestConfig {
  baseurl: string // 基础 URL
  contenttype: 'multipart/form-data' // 内容类型
}

// 上传路径枚举
export enum UploadFrom {
  BBS_ICON = 'bbs/icon',
  BBS_MAINBOARD_ICON = 'bbs/mainboard/icon',
  BBS_FORUM_ICON = 'bbs/forum/icon',
  BBS_FORUM_ATTACHMENT = 'bbs/forum/attachment',
  USER_PROFILE_HEADER = 'user/profile/header',
  USER_ACTIVITY_CENTER = 'user/activityCenter',
  NEWSPAPER_ISSUE = 'newspaper/issue',
  TK_WEBSITE_ICON = 'tk/website/icon',
  TK_GUARANTEE_ICON = 'tk/guarantee/icon',
  WM_WEBSITE_ICON = 'wm/website/icon',
  WM_WEBSITE_LOGO = 'wm/website/logo',
  WM_DOMAIN_ICON = 'wm/domain/icon',
  WM_DOMAIN_LOGO = 'wm/domain/logo',
  WM_TEMPLATE_ICON = 'wm/template/icon',
  WM_TEMPLATE_LOGO = 'wm/template/logo',
  CHAT_MESSAGE_IMG = 'chat/message/img',
  CHAT_BG_IMG = 'chat/bg/img',
  SKETCH_CODE_SITE_TEMPLATE = 'sketch_code/site_template/site_id'
}

// 文件上传接口
export interface IFileUploadParams {
  // 文件类型
  fileType: FileType

  // 上传路径
  uploadFrom: UploadFrom

  // 目标文件名（包含后缀）
  uploadTarget: string

  // 存储类型
  storageType: EStorageType

  // 存储路径风格
  storageStyle: number

  // 环境变量
  env: Environment

  // 文件对象
  file: File
}

// 可选：文件大小限制常量
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024 // 10MB in bytes
