<template>
  <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden" v-if="waitingHit">
    <el-form
      v-bind="$attrs"
      :model="state"
      label-width="auto"
      ref="formRef"
      v-loading="isLoading"
      style="flex: 1; overflow: hidden auto"
    >
      <el-row :gutter="20">
        <el-col :span="8" :offset="3">
          <el-form-item label="玩法类型:" prop="predictionMode">
            <el-select v-model="state.predictionMode" placeholder="" @change="() => resetRule(0)">
              <el-option
                v-for="(item, index) in predictionModeList"
                :label="item.label"
                :value="item.value"
                :key="index"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" :offset="3">
          <el-form-item label="参考规则:">
            <ReviewLotteryBall
              v-for="(rule, index) in showingRules"
              :key="index"
              :ball-list="rule.presetOptions"
              :review-selected-list="getReviewSelectedListBy(rule, state.reviewSelected!)"
              :title="getPredictionModeByRule(rule.code).name"
              :max="rule.max"
              :min="rule.min"
              :editable="index === showingRules.length - 1"
              @reset="resetRule(index)"
              @selection-changed="onRuleSelectionChanged(rule, $event)"
            />
            <!-- <el-button
              v-if="nextRuleToShow"
              type="primary"
              :icon="CirclePlus"
              color="#09C160"
              style="color: white; margin-top: 10px"
              @click="showNextRule()"
            >
              添加{{ nextRuleToShow?.name }}
            </el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="submit-wrapper">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" color="#FE646F" style="color: white" :disabled="predictionInvalid" @click="gameOn()">
        参赛
      </el-button>
    </div>
  </div>
  <StaticGamePage v-if="!waitingHit" @cancel="cancel" :postPrediction="postPredictionForStatic!" style="flex: 1" />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, reactive } from 'vue'
// import { CirclePlus } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import type { IUpdateBbsPostQueryParams, PredictionInfo } from '@/api/bss/postContentManagement/types'
import type { PostPrediction } from '@/views/Bbs/bbsPostContentManagement/new/components/staticGamePage.vue'
import { type BallOption, type PlayRuleExtended, useLotteryParticipationLogic } from './useLotteryParticipationLogic'

const props = defineProps<{
  queryForm: IUpdateBbsPostQueryParams
}>()
const postPredictionForStatic = computed(
  () =>
    ({
      ...props.queryForm.postPrediction!,
      name: props.queryForm.postPrediction?.name!,
      isHit: props.queryForm.postPrediction?.isHit!,
      gameTypeName: props.queryForm.postPrediction?.gameTypeName!,
      postYear: props.queryForm.postYear!,
      postIssue: props.queryForm.postIssue!
    } as PostPrediction)
)
const waitingHit = computed(() => postPredictionForStatic.value.isHit === 'i')
const state = reactive({
  predictionMode: props.queryForm.predictionMode,
  postGametypeRef: props.queryForm.postGametypeRef,
  forumId: props.queryForm.forumId,
  predictions: cloneDeep(props.queryForm.predictions),
  reviewSelected: cloneDeep(
    props.queryForm.predictions?.map((item) => {
      return {
        code: item.playTypeCode,
        ballList: item.predict.map((ball) => ({
          value: ball,
          selected: true
        }))
      }
    })
  )
})
watch(
  () => [props.queryForm.postGametypeRef, props.queryForm.predictionMode, props.queryForm.predictions],
  () => {
    state.postGametypeRef = props.queryForm.postGametypeRef
    state.predictionMode = props.queryForm.predictionMode
    state.predictions = props.queryForm.predictions
  },
  { deep: true }
)
const emit = defineEmits(['cancel', 'gameOn'])
const predictionInvalid = computed(() => {
  const resultList = state.predictions
  if (!resultList || resultList.length === 0) {
    return true
  }
  return resultList.some((result: PredictionInfo) => !result.valid)
})
// Use the composable to manage game logic
const {
  isLoading,
  predictionModeList,
  showingRules,
  // nextRuleToShow,
  resetRule,
  // showNextRule,
  initialize,
  loadPredictionInfo,
  loadPredictionRules,
  getReviewSelectedListBy,
  getPredictionModeByRule,
  setPredictionsByValue,
  getLotteryPredictionsFrom,
  loadModeInfo
  // setPredictions
} = useLotteryParticipationLogic(state)

// Handle selection changes
function onRuleSelectionChanged(rule: PlayRuleExtended, selectedBalls: BallOption[]): void {
  setPredictionsByValue(getLotteryPredictionsFrom(showingRules.value, rule, selectedBalls))
}
const cancel = () => {
  emit('cancel')
}
const gameOn = () => {
  const baseInfo = state.predictions?.[0]
  const basePredict = baseInfo?.predict
  const gameRule = getPredictionModeByRule(baseInfo?.playTypeCode ?? '')
  console.log(gameRule.playRules)
  const playRules = gameRule.playRules.filter((rule) => rule.code !== baseInfo?.playTypeCode)
  const newPredictions = playRules.map((rule) => {
    return {
      gameType: baseInfo?.gameType,
      playTypeCode: rule.code,
      name: rule.name,
      predict: basePredict?.slice(0, rule.max),
      valid: true
    }
  }) as any[]
  const result = {
    ...state,
    predictions: state.predictions?.concat(newPredictions)
  }
  console.log(result)

  emit('gameOn', result)
}
// Initialize component on mount
onMounted(async () => {
  // 初始化字典
  await initialize()
  // 根据【游戏类型/论坛ID】加载玩法
  await loadPredictionRules()
  // 加载玩法模式
  loadModeInfo()
  // 加载用户参赛的预测信息
  loadPredictionInfo({
    code: props.queryForm.predictionMode!,
    predictionDTOList: props.queryForm.predictions?.slice(0, 1)!
  })
  // 整理并生成可用于提交的预测信息格式
  showingRules.value.forEach((rule) => {
    const reviewSelected = state.reviewSelected!.find((r) => r.code === rule.code)
    if (!reviewSelected) {
      return
    }
    setPredictionsByValue(getLotteryPredictionsFrom(showingRules.value, rule, reviewSelected.ballList))
  })
})
</script>

<style scoped lang="less">
.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 10px 0;
}
/* Any additional styles specific to this component */
</style>
