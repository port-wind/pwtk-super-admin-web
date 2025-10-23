import { ElMessage } from 'element-plus'

const MAX_FILE_SIZE_LIMIT = 1 // GB
const VALID_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv']

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function useFileValidation() {
  const validateVideoFile = (file: File): ValidationResult => {
    // Check file type
    if (!VALID_MIME_TYPES.includes(file.type)) {
      const error = `只支持视频格式文件，当前文件类型: ${file.type}`
      return { isValid: false, error }
    }

    // Check file size
    const maxSizeBytes = MAX_FILE_SIZE_LIMIT * 1024 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const error = `文件大小不可超过${MAX_FILE_SIZE_LIMIT}GB`
      ElMessage.error(error)
      return { isValid: false, error }
    }

    return { isValid: true }
  }

  return {
    validateVideoFile,
    MAX_FILE_SIZE_LIMIT,
    VALID_MIME_TYPES
  }
}
