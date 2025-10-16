import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ref, computed } from 'vue'
// 导入 Element Plus 中英文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import zhTw from 'element-plus/es/locale/lang/zh-tw'

// setup
export const useAppStore = defineStore('app', () => {
  const language = useStorage('language', 'zh-cn')

  /**
   * 根据语言标识读取对应的语言包
   */
  const locale = computed(() => {
    if (language?.value == 'zh-cn') {
      return zhCn
    } else if (language?.value == 'zh-tw') {
      return zhTw
    } else {
      return en
    }
  })

  /**
   * 切换语言
   */
  function changeLanguage(val: string) {
    language.value = val
  }

  return {
    language,
    locale,
    changeLanguage
  }
})
