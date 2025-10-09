// console.log('故障');
export default function isValidURL(errorMessage: string) {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback() // 如果没有值，直接调用 callback
      return
    }
    // 正则表达式用于验证 URL
    const urlPattern = /^(https?:\/\/|@)(www\.)?([a-zA-Z0-9-_]+\.[a-zA-Z]{2,11})(\/[^\s]*)?$/

    // 允许 localhost 和 IP 地址
    const localhostPattern = /^(http:\/\/localhost(:\d+)?(\/.*)?)$/
    const ipPattern = /^(http:\/\/[0-9]{1,3}(\.[0-9]{1,3}){3}(:\d+)?(\/.*)?)$/

    if (!urlPattern.test(value) && !localhostPattern.test(value) && !ipPattern.test(value)) {
      callback(new Error(errorMessage)) // 如果不匹配，返回错误信息
    } else {
      callback() // 验证通过
    }
  }
}
export function checkIsUrlOrNot(value: string): boolean {
  try {
    const url = new URL(value)

    // 检查是否是合法的 URL
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false
    }

    // 额外检查是否符合指定的 Apple App Store URL 模式
    const appleAppStorePattern = /^https:\/\/apps\.apple\.com\/app\/id\d+$/
    if (appleAppStorePattern.test(value)) {
      return true
    }

    // 如果没有匹配到 Apple App Store 特定的格式，则返回一般 URL 检查结果
    return true
  } catch (e) {
    return false
  }
}
