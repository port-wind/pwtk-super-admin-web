// stores/useSearchStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('searchStore', () => {
  // 搜索查询
  const searchQuery = ref<string>('')

  // 搜索函数
  const searchFunction = ref<(() => void) | null>(null)

  // 当前路由名称
  const currentRouteName = ref<string>('')

  // 设置搜索查询
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  // 设置搜索函数和当前路由名称
  const setSearchFunction = (fn: () => void, routeName: string) => {
    searchFunction.value = fn
    currentRouteName.value = routeName
  }

  // 执行搜索函数
  const executeSearch = (routeName: string) => {
    if (searchFunction.value && currentRouteName.value === routeName) {
      searchFunction.value()
    }
  }

  return {
    searchQuery,
    searchFunction,
    currentRouteName,
    setSearchQuery,
    setSearchFunction,
    executeSearch
  }
})
