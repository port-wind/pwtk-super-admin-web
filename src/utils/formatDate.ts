// 格式化日期
export const formatDate = (format: string, d: any) => {
  if (d) {
    let date = new Date(d)
    var o = {
      'y+': date.getFullYear(), //年
      'M+': date.getMonth() + 1, //月
      'd+': date.getDate(), //日
      'h+': date.getHours(), //时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds() //秒
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  } else {
    return '--'
  }
}

export const changeColor = (color: string, percentage: number = 1.5) => {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const lightenedR = Math.round(r + (255 - r) * percentage)
  const lightenedG = Math.round(g + (255 - g) * percentage)
  const lightenedB = Math.round(b + (255 - b) * percentage)

  const lightenedHex = `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`
  return lightenedHex
}

export const toHex = (value: number) => {
  const hex = value.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}
