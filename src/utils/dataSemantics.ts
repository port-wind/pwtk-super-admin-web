import timezone from '@/utils/timezone'
import { differenceInDays, format, differenceInHours, differenceInMonths } from 'date-fns'

export const dataSemantics = (rightDate: number) => {
  let semantics = ''
  //服务器东八区时间戳转化为本地电脑时区时间戳
  let rightDataLocal = timezone(rightDate)
  let diffHours = Math.abs(differenceInHours(Date.now(), rightDataLocal))
  let diffMonths = Math.abs(differenceInMonths(Date.now(), rightDataLocal))
  if (diffHours <= 3) {
    semantics = '小于3小时'
  }
  if (diffHours <= 12) {
    semantics = '小于12小时'
  }
  if (diffHours <= 24) {
    semantics = '小于1天'
  }
  if (diffHours > 24 && diffHours < 48) {
    semantics = '大于1天'
  }
  if (diffHours >= 48 && diffHours < 72) {
    semantics = '大于2天'
  }

  if (diffHours >= 72 && diffHours < 168) {
    semantics = '大于3天'
  }
  if (diffHours >= 168 && diffHours < 360) {
    semantics = '大于7天'
  }
  if (diffHours >= 360 && diffHours < 720) {
    semantics = '大于15天'
  }
  if (diffHours >= 720) {
    if (diffMonths < 2) {
      semantics = '大于1个月'
    }
    if (diffMonths < 3) {
      semantics = '大于2个月'
    }
    if (diffMonths >= 3 && diffMonths < 6) {
      semantics = '大于3个月'
    }
    if (diffMonths >= 6 && diffMonths < 12) {
      semantics = '大于6个月'
    }
    if (diffMonths >= 12) {
      semantics = '大于1年'
    }
    if (diffMonths >= 24) {
      semantics = '大于2年'
    }
    if (diffMonths >= 36) {
      semantics = '大于3年'
    }
  }

  return semantics
}
