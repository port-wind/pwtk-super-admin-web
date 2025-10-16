import { createI18n } from 'vue-i18n'
import EN from '../locales/en.json'
import CN from '../locales/zh-cn.json'
import TW from '../locales/zh-tw.json'

const messages = {
  en: {
    ...EN
  },
  'zh-cn': {
    ...CN
  },
  'zh-tw': {
    ...TW
  }
}

// const getCurrentLanguage = () => {
//   // 默认语言
//   let langCode = 'zh-cn'

//   // 仅在浏览器环境中执行
//   if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
//     const UAlang = navigator.language // zh-CN
//     if (localStorage) {
//       langCode =
//         localStorage.getItem('language') === null
//           ? UAlang.indexOf('CN') !== -1
//             ? 'zh-cn'
//             : 'en'
//           : (localStorage.getItem('language') as string) ?? 'zh-cn'
//       localStorage.setItem('language', langCode)
//     }
//   } else {
//     // Node.js 环境下的回退逻辑
//     langCode = localStorage.getItem('language') ?? 'zh-cn'
//   }

//   return langCode
// }

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  messages,
  locale: 'zh-cn',
  fallbackLocale: 'en'
  // locale: getCurrentLanguage() //去getCurrentLanguage函数找有没有设置的语言,默认选择zh
})

export default i18n
