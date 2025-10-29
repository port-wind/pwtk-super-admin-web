// composables/useSearch.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '@/stores/searchStore'

export function useSearch() {
  const searchStore = useSearchStore()
  const route = useRoute()
  const searchQuery = ref('')

  const handleKeydown = (event: KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement
    const isInputField = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA'
    const isDialogOpen = document.querySelector('.el-dialog__wrapper') !== null

    if (event.key === 'Enter' && !isInputField && !isDialogOpen) {
      searchStore.executeSearch(route.name as string)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    searchQuery,
    setSearchFunction: (fn: () => void) => {
      searchStore.setSearchFunction(fn, route.name as string)
    }
  }
}
