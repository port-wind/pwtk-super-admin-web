import { ref, onUnmounted, readonly } from 'vue'
import { downloadIssuesByUrl } from '@/api/photoSys/spider'

export interface SpiderParams {
  issue: string
  baseUrl: string
  gameType: string
}

export interface SpiderStatus {
  downloadCode: number
  // Add other status properties as needed
}

export interface SpiderResponse {
  success: boolean
  data?: {
    downloadCode: number
    [key: string]: any
  }
  message?: string
}

export const useSpiderLogic = () => {
  // Polling state
  const isPolling = ref(false)
  const pollingTimer = ref<any | null>(null)
  const maxPollingAttempts = ref(60)
  const currentPollingAttempts = ref(0)
  const pollingInterval = ref(15 * 1000)

  // Loading state
  const isSpiderLoading = ref(false)

  /**
   * Stop the polling process and cleanup
   */
  const stopPolling = () => {
    if (pollingTimer.value) {
      clearTimeout(pollingTimer.value)
      pollingTimer.value = null
    }
    isPolling.value = false
    isSpiderLoading.value = false
    currentPollingAttempts.value = 0
  }

  /**
   * Schedule the next polling attempt
   */
  const scheduleNextPoll = (delay: number, params?: SpiderParams, onComplete?: () => void, onNoData?: () => void) => {
    if (!isPolling.value) return

    pollingTimer.value = setTimeout(() => {
      // eslint-disable-next-line no-use-before-define
      pollStatus(params, onComplete, onNoData)
    }, delay)
  }

  /**
   * Check spider status (single step)
   */
  const checkSpiderStatus = async (params: SpiderParams): Promise<SpiderResponse | null> => {
    try {
      const response = await downloadIssuesByUrl({
        ...params,
        queryStatus: 1
      })
      return response
    } catch (error) {
      console.error('Spider status check error:', error)
      return null
    }
  }

  /**
   * Handle different download codes from spider status
   */
  const handleDownloadCode = (
    downloadCode: number,
    onComplete: () => void,
    onNoData: () => void,
    params: SpiderParams
  ) => {
    switch (downloadCode) {
      case 1: // downloading - continue polling
        console.log(`Still downloading... attempt ${currentPollingAttempts.value}`)
        scheduleNextPoll(pollingInterval.value, params, onComplete, onNoData)
        break

      case 2: // finished - stop polling and call completion callback
        console.log('Download finished!')
        stopPolling()
        onComplete()
        break

      case 3: // noData - stop polling and call no data callback
        console.log('Download finished but no data found')
        stopPolling()
        onNoData()
        break

      case 5: // already have datas but not finished
        console.log('Download finished but no data found')
        stopPolling()
        onComplete()
        break
      case 6: // there should be only one spider running
        console.log('There should be only one spider running')
        ElMessage.warning('当前已在运行该期号爬取')
        stopPolling()
        onComplete()
        break

      default:
        console.warn(`Unknown download code: ${downloadCode}`)
        scheduleNextPoll(pollingInterval.value, params, onComplete, onNoData)
        break
    }
  }

  /**
   * Poll spider status continuously
   */
  const pollStatus = async (params?: SpiderParams, onComplete?: () => void, onNoData?: () => void) => {
    if (!isPolling.value || !params) return

    // Safety check for max attempts
    if (currentPollingAttempts.value >= maxPollingAttempts.value) {
      stopPolling()
      console.warn('Max polling attempts reached')
      return
    }

    currentPollingAttempts.value += 1

    try {
      const result = await checkSpiderStatus(params)

      if (!result || !result.success) {
        // Continue polling on error but with longer interval
        scheduleNextPoll(pollingInterval.value, params, onComplete, onNoData)
        return
      }

      const downloadCode = result.data?.downloadCode
      if (downloadCode !== undefined) {
        handleDownloadCode(downloadCode, onComplete || (() => {}), onNoData || (() => {}), params)
      } else {
        scheduleNextPoll(pollingInterval.value, params, onComplete, onNoData)
      }
    } catch (error) {
      console.error('Polling error:', error)
      // Continue polling even on error with longer interval
      scheduleNextPoll(pollingInterval.value * 2, params, onComplete, onNoData)
    }
  }

  /**
   * Start the status polling process
   */
  const startStatusPolling = (params: SpiderParams, onComplete: () => void, onNoData?: () => void) => {
    if (isPolling.value) return

    isPolling.value = true
    currentPollingAttempts.value = 0
    pollStatus(params, onComplete, onNoData)
  }

  /**
   * Run the spider process
   */
  const runSpider = async (params: SpiderParams, onComplete: () => void, onNoData?: () => void): Promise<boolean> => {
    if (isSpiderLoading.value) {
      console.warn('Spider is already running')
      return false
    }

    try {
      isSpiderLoading.value = true

      const response = await downloadIssuesByUrl(params)

      if (response.success) {
        if (response.data.downloadCode === 6) {
          ElMessage.warning(response.data.message || '当前已在运行该期号爬取')
          return true
        }
        ElMessage.warning('爬取开始, 时间较长, 请耐心等待')
        // Start polling after successful spider run
        startStatusPolling(params, onComplete, onNoData)
        return true
      }
      console.error('Spider run failed:', response.message)
      return false
    } catch (error) {
      console.error('Spider run error:', error)
      return false
    } finally {
      // Keep loading state true if polling starts, otherwise set to false
      if (!isPolling.value) {
        isSpiderLoading.value = false
      }
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPolling()
  })

  return {
    // State
    isPolling: readonly(isPolling),
    isSpiderLoading: readonly(isSpiderLoading),
    currentPollingAttempts: readonly(currentPollingAttempts),

    // Methods
    runSpider,
    stopPolling,
    checkSpiderStatus,

    // Configuration
    pollingInterval,
    maxPollingAttempts
  }
}
