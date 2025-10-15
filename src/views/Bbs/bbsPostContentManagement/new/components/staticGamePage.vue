<template>
  <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden">
    <el-form
      v-bind="$attrs"
      label-width="auto"
      ref="formRef"
      v-loading="isLoading"
      style="flex: 1; overflow: hidden auto"
    >
      <el-row>
        <el-col :span="18" :offset="3">
          <el-form-item label="玩法类型:" prop="predictionMode">
            <div class="game-header">
              <span>{{ postPrediction?.name }}</span>
              <span v-if="isHit" class="lottery-result">
                <span class="result-label">开奖结果:</span>
                <template v-for="(ball, index) in numInfo" :key="index">
                  <span v-if="index === 6" class="separator">+</span>
                  <lotto-ball :number="ball.num" :color="ball.color" :zodiacSigns="ball.shengxiao" />
                </template>
              </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="18" :offset="3">
          <el-form-item label="参考规则:">
            <LotteryBall
              v-for="(rule, index) in formattedPredictions"
              :key="index"
              :ball-list="rule.predict"
              :title="rule.name"
              :max="rule.max"
              :min="rule.min"
              :view-mode="true"
              :is-hit="rule.isHit"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="submit-wrapper">
      <el-button @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getHittedHistory } from '@/api/bss/postContentManagement'
import showErrorMessage from '@/utils/showErrorMessage'

// Type definitions
interface PredictionDTO {
  name: string
  predict: string[]
  isHit: 'i' | 'y' | 'n'
  hitDetail: string
}

interface FormattedPrediction {
  name: string
  max: number
  min: number
  isHit: 'i' | 'y' | 'n'
  predict: Array<{ value: string; selected: boolean }>
}

export interface PostPrediction {
  name: string
  isHit: string
  gameTypeName: string
  postYear: string
  postIssue: string
  predictionDTOList: PredictionDTO[]
}

// Props
const props = defineProps<{
  postPrediction: PostPrediction
}>()
const emit = defineEmits(['cancel'])
// State
const isLoading = ref(false)
const numInfo = ref<any[]>([])

// Computed properties
const isHit = computed(() => props.postPrediction?.isHit && props.postPrediction?.isHit !== 'i')

const formattedPredictions = computed<FormattedPrediction[]>(() => {
  if (!props.postPrediction?.predictionDTOList) {
    return []
  }

  return props.postPrediction.predictionDTOList.map((dto: PredictionDTO) => {
    const hitDetail: boolean[] = dto.hitDetail.split('').map((num) => num === '1')

    return {
      name: dto.name,
      max: 0, // Default values since they're not used in view mode
      min: 0,
      isHit: dto.isHit,
      predict: dto.predict.map((str, index) => ({
        value: str,
        selected: hitDetail[index]
      }))
    }
  })
})
const cancel = () => {
  emit('cancel')
}
// Methods
async function loadHistory(): Promise<void> {
  try {
    isLoading.value = true
    const res = await getHittedHistory({
      gameTypeName: props.postPrediction.gameTypeName,
      year: props.postPrediction.postYear,
      issue: props.postPrediction.postIssue
    })

    if (res.success && res?.data?.list?.length) {
      numInfo.value = res.data.list[0].numInfo
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    ElMessage.error('获取开奖结果失败')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
// Lifecycle hooks
onMounted(async () => {
  console.log('isHit.value:', JSON.stringify(isHit.value))
  if (isHit.value) {
    await loadHistory()
  }
})
</script>

<style scoped lang="less">
.game-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .lottery-result {
    display: flex;
    align-items: center;

    .result-label {
      font-size: 13px;
      margin-right: 5px;
    }

    .separator {
      margin: 2px;
      margin-right: 4px;
    }
  }
}
.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 10px 0;
}
</style>
