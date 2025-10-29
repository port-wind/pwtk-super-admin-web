import { reactive } from 'vue'
import { getIssueListByParams } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'

export interface IssueOption {
  value: string
  label: string
  info?: any
}
export interface IssueParams {
  gameType: string
  year?: string
  newspaperCode?: string
  page?: number
  size?: number
}
export interface IssueOptionsState {
  data: IssueOption[]
  loading: boolean
  error: any
}

export function useIssueOptions() {
  const issueOptionsState = reactive<IssueOptionsState>({
    data: [],
    loading: false,
    error: undefined
  })

  /**
   * Load issue options based on provided parameters
   * @param params Object containing filter parameters
   * @param params.gameType Game type filter
   * @param params.year Year filter
   */
  const loadIssueOptions = async (params: IssueParams) => {
    // Reset if any required params are missing
    if (!params.gameType) {
      issueOptionsState.data = []
      return
    }

    try {
      issueOptionsState.loading = true
      issueOptionsState.error = undefined

      const response = await getIssueListByParams(params)

      if (!response?.success) {
        issueOptionsState.data = []
        issueOptionsState.error = response?.errMessage
        showErrorMessage(response)
        return
      }

      // Map the response data to option format
      issueOptionsState.data =
        response?.data?.map((item: string) => ({
          value: item,
          label: item,
          info: item
        })) || []
    } catch (error) {
      console.error('Failed to fetch issue options:', error)
      ElMessage.error('获取期刊信息失败')
      issueOptionsState.error = error
      issueOptionsState.data = []
    } finally {
      issueOptionsState.loading = false
    }
  }

  return {
    issueOptionsState,
    loadIssueOptions
  }
}
