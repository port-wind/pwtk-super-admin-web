// useParticipationLogic.ts
import { ElMessage } from 'element-plus'
import { getLotteryContentByPredictions } from '@/api/bss/postContentManagement'
import type { PredictionInfo } from '@/api/bss/postContentManagement/types'
import type { BallOption } from '@/views/Bbs/bbsPostContentManagement/new/components/useParticipationLogic'
import service from '@/service'

export function usePostGameUtilLogic() {
  const gameDictionary = ref<Record<string, any>>({})
  // 通过sourceName获取完整预设选项
  function getFullPresetOptions(sourceName: string): BallOption[] {
    if (!gameDictionary.value?.[sourceName]) {
      console.error(`Missing dictionary data for ${sourceName}`)
      return []
    }
    return gameDictionary.value[sourceName].map((str: string) => ({
      value: str,
      selected: false
    }))
  }
  // 通过sourceName获取下个预设选项
  function getNextPresetOptions(
    nextSourceName: string,
    currentSourceName: string,
    currentSelected: BallOption[]
  ): BallOption[] {
    if (!gameDictionary.value?.[nextSourceName] || !gameDictionary.value?.[currentSourceName]) {
      console.error(`Missing dictionary data for ${nextSourceName} or ${currentSourceName}`)
      return []
    }

    // Get selected values from current options
    const selectedValues = currentSelected.map((option) => option.value)

    // Get full list order for reference
    const fullList = gameDictionary.value[nextSourceName]

    // Get filtered values from number info
    const relatedValues = new Set(
      gameDictionary.value.numInfo
        .filter((item: any) => selectedValues.includes(item[currentSourceName]))
        .map((item: any) => item[nextSourceName])
    )

    // Convert to array and sort according to original dictionary order
    return Array.from(relatedValues)
      .sort((a, b) => fullList.indexOf(a) - fullList.indexOf(b))
      .map(
        (value) =>
          ({
            value,
            selected: false
          } as BallOption)
      )
  }
  const loadLotteryContentByPredictions = async (predictions: Array<PredictionInfo>): Promise<string> => {
    if (!predictions || predictions.length === 0) {
      return ''
    }
    try {
      const result = await getLotteryContentByPredictions(predictions)
      if (!result.success) {
        throw new Error()
      }
      return result.data.postContent ?? ''
    } catch (error) {
      ElMessage({
        message: '根据参赛信息获取帖子内容失败',
        type: 'error'
      })
      return ''
    }
  }

  const loadLotteryContentByPredictionsStrategy = async (
    predictions: Array<PredictionInfo>,
    forumId: string,
    content: string
  ): Promise<string> => {
    switch (forumId) {
      case 'userPublic':
        return content
      case 'lottery':
        return loadLotteryContentByPredictions(predictions)
      default:
        return content
    }
  }
  const loadGameDictionary = async () => {
    const res = await service.kv().getAllNumInfo().do()

    if (res.length && res.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      gameDictionary.value = res[0]
    }
  }
  return {
    gameDictionary,
    loadLotteryContentByPredictionsStrategy,
    getFullPresetOptions,
    getNextPresetOptions,
    loadGameDictionary
  }
}
