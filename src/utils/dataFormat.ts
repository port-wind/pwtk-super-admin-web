import optionJson from '@/const/options.json'

export interface FormOptions {
  value: string
  label: string
  type: string
}
export interface UploadData {
  fileType: string
  uploadFrom: string
  storageStyle: number
}

export interface UploadResult {
  uploadData: UploadData
  fileType: string
}

export interface MimeTypeMapping {
  [mimeType: string]: {
    uploadType: string
    fileType: string
  }
}

export const defaultMimeTypeMappings: MimeTypeMapping = {
  'image/jpeg': { uploadType: 'img', fileType: 'p' },
  'image/png': { uploadType: 'img', fileType: 'p' },
  'image/gif': { uploadType: 'img', fileType: 'p' },
  'image/svg+xml': { uploadType: 'img', fileType: 'p' },
  'text/plain': { uploadType: 'ico', fileType: 'f' },
  'application/pdf': { uploadType: 'ico', fileType: 'f' },
  'application/msword': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.ms-excel': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.android.package-archive': { uploadType: 'file', fileType: 'a' },
  'application/octet-stream': { uploadType: 'file', fileType: 'e' },
  'video/mp4': { uploadType: 'video', fileType: 'v' },
  'video/webm': { uploadType: 'video', fileType: 'v' },
  'video/ogg': { uploadType: 'video', fileType: 'v' },
  'audio/mpeg': { uploadType: 'video', fileType: 's' },
  'audio/wav': { uploadType: 'video', fileType: 's' },
  'audio/ogg': { uploadType: 'video', fileType: 's' }
}
export const changeUploadDataWithCustom = (
  mimeType: string,
  attachmentId: string,
  customMimeTypeMappings: Partial<MimeTypeMapping> = {},
  basePath: string = 'bbs/forum/attachment'
): UploadResult => {
  // Merge custom mappings with default mappings
  const mergedMappings: MimeTypeMapping = {
    ...defaultMimeTypeMappings,
    ...(customMimeTypeMappings as MimeTypeMapping)
  }

  const mapping = mergedMappings[mimeType]

  if (mapping) {
    return {
      uploadData: {
        fileType: mapping.uploadType,
        uploadFrom: `${basePath}${attachmentId ? '/' + attachmentId : ''}`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }

  // Fallback to general type matching if specific MIME type is not found
  const generalType = mimeType.split('/')[0]
  const generalMapping = Object.entries(mergedMappings).find(([key]) => key.startsWith(`${generalType}/`))

  if (generalMapping) {
    const [, mapping] = generalMapping
    return {
      uploadData: {
        fileType: mapping.uploadType,
        uploadFrom: `${basePath}${attachmentId ? '/' + attachmentId : ''}`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`)
}
export const addTypeToObjects = (arr: Omit<FormOptions, 'type'>[], value: string): FormOptions[] => {
  return arr.map(
    (obj) =>
      ({
        ...obj,
        type: value
      } as FormOptions)
  )
}

export const changeJsonToArr = (jsonName: string, typeName: string) => {
  const jsonData = optionJson[jsonName as keyof typeof optionJson]
  return Object.entries(jsonData).map(([value, label]) => {
    return { label, value, type: typeName }
  })
}

//用于将文件大小转换成MB的形式显示
export const showFileSize = (_size: string | number) => {
  let size = _size
  if (typeof size === 'string') {
    size = Number(size)
  }
  return (size / 1024 / 1024).toFixed(3) + 'MB'
}

//将6位以上的值 以*显示，总长度限制在10位
export const formateStrNum = (input: string | number, limit = 6, firstLength = 3, lastLength = 4): string => {
  const str: string = input?.toString() || ''

  if (str.length <= limit) {
    return str
  }

  const firstText: string = str.slice(0, firstLength)
  const lastText: string = str.slice(-lastLength)
  const middleLength: number = Math.min(str.length - limit, 3) // 限制中间部分最多4位
  const middle: string = '*'.repeat(middleLength)

  return firstText + middle + lastText
}

/**
 * 将字符串处理为保留前十位和后十位，中间部分显示为三个星号 '***'。
 * 如果字符串长度小于或等于20，则返回原始字符串。
 *
 * @param {string} str - 需要处理的字符串。
 * @returns {string} - 处理后的字符串，格式为 "前十位***后十位"。
 *
 * @example
 * const originalString = "abcdefghijklmnopqrstuvwxyz0123456789";
 * const maskedString = maskString(originalString);
 * console.log(maskedString); // 输出: abcdefghij***0123456789
 */
export function handleStr10And10(str: any) {
  if (str.length <= 20) {
    return str // 如果字符串长度小于或等于20，则不做任何处理
  }

  const start = str.slice(0, 10) // 取前十位
  const end = str.slice(-10) // 取后十位
  return `${start}***${end}` // 中间替换为三个星号
}

/**
 * 将字符串处理为保留前面和后面固定长度的字符串，中间部分显示为可配置的穿参。
 * 如果字符串长度小于或等于maxLength，则返回原始字符串。
 *
 * @param {string} str - 需要处理的字符串。
 * @param {number} [firstLength=4] - 保留的前面字符串的长度。
 * @param {number} [lastLength=4] - 保留的后面字符串的长度。
 * @param {number} [maxLength=8] - 如果字符串长度小于或等于maxLength，则不做任何处理。
 * @param {string} [mask='***'] - 用于替换的字符串。
 * @returns {string} - 处理后的字符串，格式为 "前面***后面"。
 *
 * @example
 * const originalString = "abcdefghijklmnopqrstuvwxyz0123456789";
 * const maskedString = handleStrMask(originalString);
 * console.log(maskedString); // 输出: abcd***0123
 */
export function handleStrMask(
  str: string,
  firstLength: number = 4,
  lastLength: number = 4,
  maxLength: number = 8,
  mask: string = '***'
) {
  if (str.length <= maxLength) {
    return str // 如果字符串长度小于或等于20，则不做任何处理
  }

  const start = str.slice(0, firstLength) // 取前几位
  const end = str.slice(-lastLength) // 取后几位
  return `${start}${mask}${end}` // 中间替换为可配置的穿参
}

// src/utils/urlUtils.ts

export function createWholeUrl(url: string | null | undefined, frontPath?: string): string {
  if (!url) {
    return ''
  }

  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // If frontPath is provided
  if (frontPath) {
    // Remove trailing slash from frontPath if it exists
    const cleanFrontPath = frontPath.endsWith('/') ? frontPath.slice(0, -1) : frontPath

    // If url starts with a slash, remove it
    const cleanUrl = url.startsWith('/') ? url.slice(1) : url

    return `${cleanFrontPath}/${cleanUrl}`
  }

  // If no frontPath, just add the protocol
  const protocol = 'https://'
  return `${protocol}${url.startsWith('/') ? url.slice(1) : url}`
}

/**
 * 将 HTML 实体解码为原始字符串。
 * 该函数对于将 HTML 编码的字符串转换回其原始形式非常有用。
 * 它会创建一个临时的 textarea 元素，将 HTML 编码的字符串赋值给该元素的 innerHTML，
 * 然后从 textarea 元素的 value 属性中获取解码后的值。
 *
 * @param {string} str - 需要解码的 HTML 编码字符串。
 * @returns {string} - 解码后的字符串。
 */
export const decodeHtmlEntities = (str: string) => {
  // 创建一个临时的 textarea 元素
  const txt = document.createElement('textarea')

  // 将 HTML 编码的字符串赋值给 textarea 元素的 innerHTML
  txt.innerHTML = str

  // 获取并返回解码后的值
  return txt.value
}

export const changeUploadData = (mimeType: string, uploadPath: string) => {
  console.log(mimeType)

  let fileType, uploadType

  switch (mimeType) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
    case 'image/svg+xml':
      fileType = 'p'
      uploadType = 'img'
      break

    case 'text/plain':
    case 'application/pdf':
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      fileType = 'f'
      uploadType = 'ico'
      break

    case 'application/vnd.android.package-archive':
      fileType = 'a'
      uploadType = 'file'
      break

    case 'application/octet-stream':
      fileType = 'e'
      uploadType = 'file'
      break

    case 'video/mp4':
    case 'video/webm':
    case 'video/ogg':
      fileType = 'v'
      uploadType = 'video'
      break

    case 'audio/mpeg':
    case 'audio/wav':
    case 'audio/ogg':
      fileType = 's'
      uploadType = 'video' // Note: This is set to 'video' as in the original code
      break

    default:
      fileType = ''
      uploadType = ''
      break
  }

  return {
    uploadData: {
      fileType: uploadType,
      uploadFrom: uploadPath,
      storageStyle: 6 // This value is kept as it might be a constant for your system
    },
    fileType: fileType
  }
}
const currentYear = new Date().getFullYear()

export const YearTypes = Array.from({ length: 5 }, (_, index) => ({
  label: String(currentYear - index),
  value: currentYear - index,
  type: 'option'
}))

// 手动实现将对象转换为查询字符串的函数
export const qs = (obj: Record<string, any>): string => {
  return Object.entries(obj)
    .map(([key, value]) => {
      // 对键和值进行编码
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&')
}

export const truncateText = (text: string, limit = 10) => {
  if (!text) return ''
  return text.length > limit ? text.slice(0, limit) + '...' : text
}

export const extractTextFromHTML = (text: string, limit = 10) => {
  if (!text) return ''
  try {
    // Create a new DOMParser and parse the HTML string
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    // Get the text content from the parsed HTML
    const plainText = doc.body.textContent || text
    return plainText.length > limit ? plainText.slice(0, limit) + '...' : plainText
  } catch (error) {
    // If parsing fails, return the original text
    return text.length > limit ? text.slice(0, limit) + '...' : text
  }
}

export const cleanObject = (obj: any) => {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      // 检查 key 是否为空或仅包含空格
      if (key.trim() === '') {
        continue
      }
      // 检查 value 是否为无效值
      if (
        value === null || // null
        value === undefined || // undefined
        (Array.isArray(value) && value.length === 0) || // 空数组
        (typeof value === 'string' && value.trim() === '') || // 空字符串
        (typeof value === 'object' && Object.keys(value).length === 0) // 空对象
      ) {
        continue
      }
      // 保留有效的键值对
      result[key] = value
    }
  }
  return result
}
export const getManageSiteId = (path: string) => {
  const regex = /[?&]manageSiteId=([^&]*)/
  const match = path.match(regex)
  return match ? match[1] : null
}
