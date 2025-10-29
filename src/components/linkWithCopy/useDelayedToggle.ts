import { ref } from 'vue'

export function useDelayedToggle(showDelay: number, hideDelay: number) {
  const state = ref(false)
  let showTimer: ReturnType<typeof setTimeout> | null = null
  let hideTimer: ReturnType<typeof setTimeout> | null = null

  const clearTimers = () => {
    if (showTimer) clearTimeout(showTimer)
    if (hideTimer) clearTimeout(hideTimer)
  }

  const startShowTimer = () => {
    clearTimers()
    showTimer = setTimeout(() => {
      state.value = true
    }, showDelay)
  }

  const startHideTimer = () => {
    clearTimers()
    hideTimer = setTimeout(() => {
      state.value = false
    }, hideDelay)
  }

  return { state, startShowTimer, startHideTimer }
}
