/**
 * 过滤掉空数组、空字符串和 null 值
 * @param data - 要过滤的数组
 * @returns 过滤后的数组
 */
export function filterEmptyValues<T>(data: Array<T | null | string | []>): T[] {
  return data.filter((item) => {
    if (item !== null) {
      if (typeof item === 'string' && item.trim() !== '') {
        return true
      }
      if (Array.isArray(item) && item.length > 0) {
        return true
      }
      return !(typeof item === 'string' || Array.isArray(item)) // 过滤掉空数组和空字符串之外的值
    }
    return false
  }) as T[]
}

/**
 * 过滤掉对象中空数组、空字符串和 null 值的属性
 * @param obj - 要过滤的对象
 * @returns 过滤后的对象
 */
export function filterEmptyProperties<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {}
  Object.keys(obj).forEach((key) => {
    const value = obj[key as keyof T]
    if (value !== null && value !== undefined) {
      if (typeof value === 'string' && value.trim() !== '') {
        result[key as keyof T] = value
      } else if (Array.isArray(value) && value.length > 0) {
        result[key as keyof T] = value
      } else if (typeof value !== 'string' && !Array.isArray(value)) {
        result[key as keyof T] = value
      }
    }
  })
  return result
}

//更新bbsDialogOptions
// 将这个函数移到 script 标签外部,作为一个独立的工具函数
export const updateOptions = (data: any, options: any[]): any[] => {
  return options.map((option) => {
    if (data.hasOwnProperty(option.prop)) {
      return { ...option, value: data[option.prop] }
    }
    return option
  })
}
/**
 * 找出重复数字
 * @param arr
 * @returns
 */
export const findDuplicates = (arr: (number | null)[]) => {
  const map = new Map()
  const duplicates = new Set()

  arr.forEach((item) => {
    if (item === null || item === undefined) {
      return
    }

    if (map.has(item)) {
      duplicates.add(item)
    } else {
      map.set(item, true)
    }
  })

  return Array.from(duplicates)
}

/**
 *
 * @param min
 * @param max
 * @returns
 */
export const isWithinRangeStrict =
  (min: number, max: number, live: boolean = false) =>
  (arr: (number | null)[]) => {
    if (min >= max) {
      throw new Error('min must be less than max')
    }

    // 如果数组为空，返回特定结果
    if (arr.length === 0) {
      return {
        illegal: true,
        illegalValues: []
      }
    }

    const illegalValues: number[] = []

    const allValid = arr.every((num: number | null) => {
      let isValid = true
      // 检查是否合法
      if (live) {
        if (num === null || num === undefined) {
          isValid = true
        } else {
          isValid = typeof num === 'number' && num >= min && num <= max
        }
      } else {
        isValid = num !== null && num !== undefined && typeof num === 'number' && num >= min && num <= max
      }

      // 如果不合法，记录下来
      if (!isValid) {
        illegalValues.push(num)
      }

      return isValid
    })

    return {
      illegal: !allValid, // 如果有不合法的值，illegal为true
      illegalValues: illegalValues // 不合法的值数组
    }
  }
