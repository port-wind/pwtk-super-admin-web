<template>
  <div class="lottery-ball-selector">
    <div class="selector-container">
      <div class="selector-header">
        <label>{{ props.viewMode ? '' : '请选择:' }} {{ props.title }}</label>
        <el-button v-if="!props.viewMode" type="primary" @click="handleReset">重置</el-button>
      </div>

      <div class="ball-list">
        <span
          v-for="(ball, index) in balls"
          :key="index"
          class="ball-item"
          :class="{ selected: ball.selected }"
          :style="{ cursor: getCursorStyle() }"
          @click="toggleBallSelection(ball)"
        >
          {{ ball.value }}
        </span>
      </div>
    </div>
    <div v-if="props.viewMode" class="status-indicator">
      <img :src="getStatusImageSrc()" :alt="getStatusAlt()" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

export interface BallOption {
  value: string
  selected: boolean
}

// Props with proper TypeScript typing
const props = withDefaults(
  defineProps<{
    ballList?: BallOption[]
    title: string
    max: number
    min: number
    viewMode?: boolean
    isHit?: string
    editable?: boolean
  }>(),
  {
    ballList: () => [],
    viewMode: false,
    editable: true
  }
)

const emit = defineEmits<{
  (e: 'reset'): void
  (e: 'update:ballList', value: BallOption[]): void
  (e: 'selectionChanged', selectedBalls: BallOption[]): void
}>()

// Computed properties
const balls = computed({
  get: () => props.ballList,
  set: (newValue) => {
    emit('update:ballList', newValue)
  }
})

// Methods
function getCursorStyle(): string {
  if (props.viewMode) return 'default'
  return props.editable ? 'pointer' : 'not-allowed'
}

function getStatusImageSrc(): string {
  switch (props.isHit) {
    case 'i':
      return new URL('@/assets/images/prediction/waiting.png', import.meta.url).href
    case 'y':
      return new URL('@/assets/images/prediction/hitted.png', import.meta.url).href
    case 'n':
      return new URL('@/assets/images/prediction/miss.png', import.meta.url).href
    default:
      return ''
  }
}

function getStatusAlt(): string {
  switch (props.isHit) {
    case 'i':
      return 'waiting'
    case 'y':
      return 'hitted'
    case 'n':
      return 'miss'
    default:
      return ''
  }
}

function toggleBallSelection(ball: BallOption): void {
  if (props.viewMode || !props.editable) {
    return
  }

  // Deselect if already selected
  if (ball.selected) {
    ball.selected = false
    emitSelectionChange()
    return
  }

  const selectedCount = balls.value.filter((b) => b.selected).length

  // Single selection mode
  if (props.max === 1 && selectedCount === 1) {
    resetSelections()
    ball.selected = true
    emitSelectionChange()
    return
  }

  // Check maximum selection limit
  if (selectedCount >= props.max) {
    ElMessage.warning(`最多只能选择 ${props.max} 个 ${props.title}`)
    return
  }

  ball.selected = true
  emitSelectionChange()
}

function resetSelections(): void {
  if (balls.value) {
    balls.value.forEach((ball) => {
      ball.selected = false
    })
  }
  emitSelectionChange()
}

function handleReset(): void {
  resetSelections()
  emit('reset')
}

function emitSelectionChange(): void {
  emit(
    'selectionChanged',
    balls.value.filter((ball) => ball.selected)
  )
}
</script>

<style scoped lang="less">
.lottery-ball-selector {
  display: flex;
  width: 100%;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  min-width: 220px;
  margin: 3px 0;
  background-color: #fafafa;
}

.selector-container {
  display: flex;
  flex: 1;
  flex-direction: column;

  .selector-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    label {
      font-weight: bold;
      display: block;
    }
  }
}

.ball-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.ball-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: #a0a0a0;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #fff;

  &.selected {
    background-color: #28a745;
    color: #fff;
  }
}

.status-indicator {
  display: flex;
  align-items: center;
}
</style>
