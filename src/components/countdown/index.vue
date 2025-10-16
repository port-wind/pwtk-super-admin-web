<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 定义 props
interface Props {
  targetTimestamp: number // 目标时间戳（毫秒）
  dateFormat: string // 显示格式，例如 "mm:ss"
}
const props = defineProps<Props>()

// 定义事件
const emit = defineEmits<{
  (e: 'on-finish'): void
}>()

// 剩余秒数
const remainingSeconds = ref(0)
// 定时器 ID
let timer: number | null = null

// 计算格式化的时间显示
const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  if (props.dateFormat === 'mm:ss') {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${remainingSeconds.value}` // 默认显示秒数
})

// 更新倒计时
const updateCountdown = () => {
  const currentTime = Date.now()
  const remainingMs = props.targetTimestamp - currentTime // 剩余毫秒
  remainingSeconds.value = Math.max(0, Math.floor(remainingMs / 1000)) // 转换为秒，确保不小于 0

  if (remainingSeconds.value <= 0) {
    stopCountdown()
    emit('on-finish') // 倒计时结束，触发事件
  }
}

// 启动倒计时
const startCountdown = () => {
  stopCountdown() // 先清除已有定时器
  updateCountdown() // 立即更新一次
  timer = window.setInterval(updateCountdown, 1000) // 每秒更新
}

// 停止倒计时
const stopCountdown = () => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

// 组件挂载时启动倒计时
onMounted(() => {
  if (props.targetTimestamp) {
    if (props.targetTimestamp > Date.now()) {
      startCountdown()
    } else {
      remainingSeconds.value = 0
      emit('on-finish') // 如果已经过期，直接触发结束
    }
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  stopCountdown()
})

// 监听 targetTimestamp 变化
watch(
  () => props.targetTimestamp,
  (newVal) => {
    if (newVal > Date.now()) {
      startCountdown()
    } else {
      remainingSeconds.value = 0
      stopCountdown()
      emit('on-finish')
    }
  }
)
</script>

<template>
  <span v-if="remainingSeconds > 0" class="countdown">{{ formattedTime }}</span>
</template>

<style scoped>
.countdown {
  font-family: monospace;
  text-align: center;
  color: #606266; /* 与 Element Plus 默认颜色一致 */
}
</style>
