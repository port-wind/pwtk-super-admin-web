// useIssueOptionLogic.ts

import { getAllIssueListForGameRusult } from '@/api/photoSys/gameResult'
import showErrorMessage from '@/utils/showErrorMessage'

const issueOptionsState = reactive({
  data: [] as { value: string; label: string }[],
  loading: false
})
const loadIssueOptions = async (gameType: string, year: string) => {
  if (!gameType || !year) {
    issueOptionsState.data = []
    return
  }
  try {
    issueOptionsState.loading = true
    const response = await getAllIssueListForGameRusult({ gameType, year })
    if (!response?.success) {
      issueOptionsState.data = []
      showErrorMessage(response)
      return
    }

    issueOptionsState.data =
      response?.data?.map((item: string) => ({
        value: item,
        label: item
      })) || []
  } catch (error) {
    console.error('Failed to fetch issue options:', error)
    issueOptionsState.data = []
  } finally {
    issueOptionsState.loading = false
  }
}

export default function useIssueOptionLogic() {
  return {
    issueOptionsState,
    loadIssueOptions
  }
}
