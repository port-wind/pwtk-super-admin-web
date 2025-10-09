import { ref, onMounted } from 'vue'

/**
 * Simple composable for managing time-based button availability
 * @param storageKey The localStorage key to use for persistence
 * @param delayDuration The delay duration in milliseconds (default: 5 minutes)
 */
export function useDelayLogic(storageKey: string, delayDuration = 300000) {
  const isAvailable = ref(true)
  const availableTimestamp = ref(0)

  /**
   * Called when the countdown finishes
   */
  const onFinish = () => {
    isAvailable.value = true
    availableTimestamp.value = 0
    localStorage.removeItem(storageKey)
  }

  /**
   * Start the delay period (disable the button)
   */
  const startDelay = () => {
    isAvailable.value = false
    availableTimestamp.value = Number(Date.now() + delayDuration)
    localStorage.setItem(storageKey, availableTimestamp.value.toString())
  }

  /**
   * Check if the button should be disabled based on localStorage
   */
  const checkStatus = () => {
    const storedExpire = localStorage.getItem(storageKey)
    if (!storedExpire) {
      isAvailable.value = true
      availableTimestamp.value = 0
      return
    }

    const expireTime = Number(storedExpire)
    const currentTime = Date.now()

    if (Number.isNaN(expireTime)) {
      isAvailable.value = true
      availableTimestamp.value = 0
      localStorage.removeItem(storageKey)
      return
    }

    if (currentTime < expireTime) {
      isAvailable.value = false
      availableTimestamp.value = expireTime
    } else {
      isAvailable.value = true
      availableTimestamp.value = 0
      localStorage.removeItem(storageKey)
    }
  }

  // Check status on component mount
  onMounted(() => {
    checkStatus()
  })

  return {
    isAvailable,
    availableTimestamp,
    onFinish,
    startDelay,
    checkStatus
  }
}
