// import timezone from '@/utils/timezone'
import { format, fromUnixTime, isValid, parse } from 'date-fns'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'

/**
 * 格式化并转换时区的日期时间
 * @param {number} timestamp - 时间戳（毫秒）
 * @param {string} [formatStr='yyyy-MM-dd'] - 日期格式字符串
 * @param {string} [timeZone] - 目标时区，不填则使用本地时区
 * @returns {string} 格式化后的日期字符串
 */
export const unitFormatDate = (
  timestamp: number | string,
  formatStr: string = 'yyyy-MM-dd',
  timeZone?: string
): string | null => {
  if (!timestamp || timestamp === 3600000) {
    return '--'
  }
  if (typeof timestamp === 'string') timestamp = Number(timestamp)

  try {
    // 如果没有指定时区，使用本地时区
    if (!timeZone) {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    // 将时间戳转换为目标时区的 Date 对象
    const zonedDate = utcToZonedTime(fromUnixTime(timestamp / 1000), timeZone)

    // 格式化日期
    return format(zonedDate, formatStr)
  } catch (error) {
    console.error('日期格式化错误:', error)
    return null
  }
}

/**
 * 将时间戳转换为 Date 对象
 * @param {number|string} timestamp - 时间戳（毫秒）
 * @param {string} [timeZone='Asia/Shanghai'] - 目标时区
 * @returns {Date} Date 对象
 */
export const unitToDate = (timestamp: number | string, timeZone?: string): Date => {
  if (!timestamp) {
    throw new Error('时间戳不能为空')
  }
  if (typeof timestamp === 'string') timestamp = Number(timestamp)

  if (!timeZone) {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
  // console.log(timeZone)
  // console.log(utcToZonedTime(fromUnixTime(timestamp / 1000), timeZone), 'utcToZonedTime')
  return utcToZonedTime(fromUnixTime(timestamp / 1000), timeZone)
}

/**
 * 将时间字符串转换为北京时间的时间戳
 * @param {string} dateStr - 日期时间字符串
 * @param {string} [formatStr='yyyy-MM-dd HH:mm:ss'] - 日期时间字符串的格式
 * @returns {number | null} 北京时间的时间戳（毫秒），如果无法转换则返回 null
 */
export const convertToTimestamp = (dateStr: string, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): number | null => {
  // 检查是否为空字符串或 '--'
  if (!dateStr || dateStr.trim() === '--') {
    return null
  }

  try {
    // 将输入的字符串解析为 Date 对象
    const parsedDate = parse(dateStr, formatStr, new Date())

    // 检查解析后的日期是否有效
    if (!isValid(parsedDate)) {
      console.warn('无效的日期字符串:', dateStr)
      return null
    }

    // 时间戳不需要转换时区
    // const beijingDate = utcToZonedTime(parsedDate, 'Asia/Shanghai')

    // 返回北京时间的时间戳（毫秒）
    return parsedDate.getTime()
  } catch (error) {
    console.error('时间戳转换错误:', error)
    return null
  }
}

/**
 * 将时间对象转换为特定时区的时间戳
 * @param {Date} date - 时间对象
 * @param {string} [timeZone='Asia/Shanghai'] - 目标时区
 * @returns {number} 特定时区的时间戳（毫秒）
 */
export const dateToTimestamp = (date: Date, timeZone: string = 'Asia/Shanghai') => {
  if (!(date instanceof Date) || !date) {
    return null
  }
  return date.getTime()
}
/**
 * 处理域名变化
 * @param {string} newVal - 新的域名值
 * @param {any} form - 表单对象
 * @param {string} [name='hostDomain'] - 表单字段名称
 */
export const handleDomainChange = (newVal: string, form: any, name: string = 'hostDomain') => {
  // 使用URL构造函数解析输入
  try {
    const url = new URL(newVal)
    // 提取主机名（域名）
    form[name] = url.hostname
  } catch (error) {
    const domainMatch = newVal.match(/^(https?:\/\/)?(www\.)?([\w.-]+)/i)
    form[name] = domainMatch ? (domainMatch[2] || '') + domainMatch[3] : newVal
  }
}
/**
 * 处理URL变化
 * @param {string} newVal - 新的Url值
 * @param {any} form - 表单对象
 * @param {string} [name='targetUrl'] - 表单字段名称
 */
export const handleUrlChange = (newVal: string, form: any, name: string = 'targetUrl') => {
  let urlString = newVal.trim()

  if (!/^https?:\/\//i.test(urlString)) {
    urlString = `https://${urlString}`
  }

  try {
    const url = new URL(urlString)
    console.log(url)

    form[name] = url.href.replace(/\/$/, '')
  } catch (error) {
    form[name] = newVal
  }
}
/**
 * 处理域名变化
 * @param {string} newVal - 新的域名值
 * @param {any} form - 表单对象
 * @param {string} [name='hostDomain'] - 表单字段名称
 */
export const handleNumberChange = (
  newVal: number,
  form: any,
  name: string = 'hostPort',
  defaultmax = 65535,
  defaultmin = 0
) => {
  let result = Number(newVal)
  console.log(result)
  if (result > defaultmax) {
    result = defaultmax
  } else if (result < 0) {
    result = defaultmin
  }
  form[name] = result
}
/**
 * Limits a string to its last 10 characters. If the string is shorter than the limit,
 * the original string is returned. If the value is not a string, it is returned as is.
 *
 * @param {string} value - The string to be limited.
 * @param {number} limit - The maximum length of the string.
 * @return {string} The limited string or the original string if it is shorter than the limit.
 */
export const limitToLast10Digits = (value: string, limit: number = 10) => {
  if (typeof value === 'string' && value.length > limit) {
    return '...' + value.slice(-limit)
  }
  return value
}

/**
 * Limits a string to show the first 4 digits and the last 6 digits.
 * If the string is longer than 10 characters, it adds an ellipsis in between.
 * If the string is 10 characters or shorter, it returns the original string.
 *
 * @param {string} value - The string to be limited.
 * @return {string} The limited string or the original string if it's 10 characters or shorter.
 */
export const limitToFirstAndLastDigits = (value: string, firstLimit: number = 4, lastLimit: number = 6): string => {
  if (typeof value === 'string' && value.length > firstLimit + lastLimit) {
    return value.slice(0, firstLimit) + '...' + value.slice(-lastLimit)
  }
  return value
}
