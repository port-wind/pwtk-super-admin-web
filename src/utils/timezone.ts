import { utcToZonedTime } from 'date-fns-tz'

const timezone = (timestamp: number, targetTimezone?: string): Date => {
  // 如果没有指定目标时区，使用系统本地时区
  if (!targetTimezone) {
    targetTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  // 直接将时间戳转换为目标时区的 Date 对象
  const zonedDate = utcToZonedTime(timestamp, targetTimezone)

  return zonedDate
}

export default timezone
