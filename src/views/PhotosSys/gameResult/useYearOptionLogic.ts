// useYearOptionLogic.ts

import { ElMessage } from 'element-plus'
import { getYearOptionsByGameType } from '@/api/photoSys/gameResult'

const yearOptionsState = reactive({
  data: [] as { label: string; value: string }[],
  loading: false
})

const loadYearOptionsByGameType = async (gameType: string) => {
  if (!gameType) {
    yearOptionsState.data = []
    return
  }

  try {
    yearOptionsState.loading = true
    const res = await getYearOptionsByGameType(gameType)

    if (res.success) {
      yearOptionsState.data = res.data.map((item: string) => ({
        label: item,
        value: item
      }))
    } else {
      ElMessage.error('获取年份信息失败')
      yearOptionsState.data = []
    }
  } catch (error) {
    console.error('Failed to fetch year options:', error)
    ElMessage.error('获取年份信息失败')
    yearOptionsState.data = []
  } finally {
    yearOptionsState.loading = false
  }
}

const resetYearState = () => {
  yearOptionsState.data = []
}

export default function useYearOptionLogic() {
  return {
    yearOptionsState,
    loadYearOptionsByGameType,
    resetYearState
  }
}
