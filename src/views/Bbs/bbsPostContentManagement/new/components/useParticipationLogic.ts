// useParticipationLogic.ts
import { ref, computed, type Reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { getPostPredictionRules } from '@/api/bss/postContentManagement'
import showErrorMessage from '@/utils/showErrorMessage'
import type {
  IPlayRule,
  IPostPredictionRule,
  ICreateBbsPostQueryParams,
  IUpdateBbsPostQueryParams,
  PredictionInfo
} from '@/api/bss/postContentManagement/types'
import { usePostGameUtilLogic } from './usePostGameUtilLogic'

export interface BallOption {
  value: string
  selected: boolean
}

export type PlayRuleExtended = IPlayRule & {
  show: boolean
  presetOptions: BallOption[]
}

interface PostPredictionRuleExtended extends IPostPredictionRule {
  playRules: Array<PlayRuleExtended>
}

export function useParticipationLogic(state: Reactive<ICreateBbsPostQueryParams | IUpdateBbsPostQueryParams>) {
  const isLoading = ref(false)
  const postPredictionRules = ref<PostPredictionRuleExtended[]>([])
  const { loadGameDictionary, getFullPresetOptions, getNextPresetOptions } = usePostGameUtilLogic()
  // Computed properties
  const predictionModeList = computed(() =>
    postPredictionRules.value.map((item) => ({
      label: item.name,
      value: item.code
    }))
  )
  // 从playRules中筛选出playMode对应的规则
  const rulesOfPrediction = computed(() => {
    const chosenModeInfo = postPredictionRules.value.find((item) => item.code === state.predictionMode)
    return chosenModeInfo?.playRules ?? []
  })

  // 显示的规则
  const showingRules = computed(() => {
    return rulesOfPrediction.value.filter((rule) => rule.show)
  })

  // 下一个需要显示的规则
  const nextRuleToShow = computed(() => {
    if (!rulesOfPrediction.value?.length) {
      return null
    }
    return rulesOfPrediction.value[showingRules.value.length] || null
  })
  // 加载预测信息
  async function loadPredictionInfo(info?: { code: string; predictionDTOList: PredictionInfo[] }): Promise<void> {
    if (!info || !info.code || !info.predictionDTOList || !info.predictionDTOList.length) {
      return
    }
    postPredictionRules.value.forEach((rule) => {
      if (rule.code === info.code) {
        info.predictionDTOList.forEach((detailDto, index) => {
          rule.playRules[index].show = true
          const { presetOptions } = rule.playRules[index]
          const { source } = rule.playRules[index]
          if (presetOptions.length === 0) {
            const lastSource = rule.playRules[index - 1].source
            const lastPresetOptions = rule.playRules[index - 1].presetOptions
            const lastSourceOptions = getNextPresetOptions(
              source,
              lastSource,
              lastPresetOptions.filter((option) => option.selected)
            )

            rule.playRules[index].presetOptions = lastSourceOptions
          }
          rule.playRules[index].presetOptions.forEach((option) => {
            option.selected = detailDto.predict.includes(option.value)
          })
        })
      }
    })
    // setCache(postPredictionRules.value)
  }

  async function loadPredictionRules(): Promise<void> {
    try {
      isLoading.value = true
      const res = await getPostPredictionRules({ gameType: state.postGametypeRef!, forumId: state.forumId! })

      if (!res.success) {
        showErrorMessage(res)
        return
      }
      const loadPresetOptionsStrategy = {
        lottery: (rule: PlayRuleExtended, _: number) => getFullPresetOptions(rule.source),
        userPublic: (rule: PlayRuleExtended, index: number) => (index === 0 ? getFullPresetOptions(rule.source) : [])
      }

      const rules = ((res.data as PostPredictionRuleExtended[]) ?? []).map((item) => {
        return {
          ...item,
          playRules: item.playRules.map((rule, index) => {
            return {
              ...rule,
              show: index === 0,
              presetOptions: loadPresetOptionsStrategy[state.forumId as 'lottery' | 'userPublic'](rule, index)
            }
          })
        }
      })

      postPredictionRules.value = rules
    } catch (error) {
      ElMessage.error('获取玩法规则失败')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }
  function loadNextRule(nextRuleIndex: number, currentRule: PlayRuleExtended): void {
    const nextRule = rulesOfPrediction.value[nextRuleIndex]
    if (nextRule) {
      switch (state.forumId) {
        case 'lottery':
          nextRule.presetOptions = getFullPresetOptions(nextRule.source)

          break
        case 'userPublic':
          nextRule.presetOptions = getNextPresetOptions(
            nextRule.source,
            currentRule.source,
            currentRule.presetOptions.filter((o) => o.selected)
          )
          break
        default:
          break
      }

      nextRule.show = true
    }
  }
  function showNextRule(): void {
    const currentIndex = showingRules.value.length - 1
    const currentRule = rulesOfPrediction.value[currentIndex]

    // Validate minimum selections
    const selectedCount = currentRule.presetOptions.filter((o) => o.selected).length
    if (currentRule.min && selectedCount < currentRule.min) {
      ElMessage.warning(`请最少选择${currentRule.min}个${currentRule.name}`)
      return
    }
    loadNextRule(currentIndex + 1, currentRule)
  }
  // Helper function to reset options
  function resetOptions(rule: PlayRuleExtended): void {
    rule.presetOptions = rule.presetOptions.map((option) => ({
      ...option,
      selected: false
    }))
  }
  // Helper function to clear a rule
  function clearRule(rule: PlayRuleExtended): void {
    rule.show = false
    rule.presetOptions = []
  }

  function resetRule(index: number): void {
    rulesOfPrediction.value.forEach((rule, i) => {
      // Reset all options if index is 0
      if (index === 0) {
        resetOptions(rule)
      }

      // Reset and clear rules after the given index
      if (i > index) {
        resetOptions(rule)
        clearRule(rule)
      }
    })
  }

  function setPredictions(rules: Array<PlayRuleExtended>) {
    state.predictions = rules.map((rule) => {
      const predict = rule.presetOptions.filter((o) => o.selected).map((o) => o.value)
      return {
        gameType: state.postGametypeRef!,
        playTypeCode: rule.code,
        name: rule.name,
        predict,
        valid: predict.length >= rule.min && predict.length <= rule.max
      }
    })
  }
  function loadModeInfo() {
    let mode
    console.log(state.predictionMode)

    if (state.predictionMode) {
      mode = state.predictionMode
    } else if (postPredictionRules.value.length > 0) {
      mode = postPredictionRules.value[0].code
    } else {
      mode = ''
    }
    state.predictionMode = mode
    state.predictionModeInit = mode
  }
  async function initialize(): Promise<void> {
    try {
      isLoading.value = true
      await loadGameDictionary()
    } catch (error) {
      ElMessage.error('获取玩法规则失败')
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    predictionModeList,
    rulesOfPrediction,
    showingRules,
    nextRuleToShow,
    loadPredictionRules,
    loadPredictionInfo,
    loadModeInfo,
    showNextRule,
    resetRule,
    initialize,
    setPredictions
  }
}
