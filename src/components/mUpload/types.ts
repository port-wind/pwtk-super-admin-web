// import type { FileType, EStorageType, Env } from '@/api/system/upload/types'
export interface UploadOption {
  // 传入的参数定义
  fileType: FileType
  uploadUrl?: string
  uploadFrom?: string
  storageType?: EStorageType
  storageStyle?: number
  env?: Environment
}
