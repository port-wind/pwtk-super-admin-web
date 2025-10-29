<template>
  <el-date-picker
    v-model="dateRange"
    type="datetimerange"
    format="YYYY-MM-DD HH:mm:ss"
    date-format="YYYY/MM/DD "
    time-format="HH:mm:ss"
    unlink-panels
    :start-placeholder="startPlaceholder || '开始时间'"
    :end-placeholder="endPlaceholder || '结束时间'"
    @change="handleDateChange"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { unitToDate } from '@/utils/dateFormat'
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps<{
  //   modelValue: [Date | null, Date | null]
  startPlaceholder?: string
  endPlaceholder?: string
  startValue: number | null
  endValue: number | null
}>()

const emit = defineEmits<{
  (e: 'update:dateRange', value: [Date | null, Date | null]): void
}>()

// const startValue = ref<Date | null>(null)
// const endValue = ref<Date | null>(null)
const startValue = computed(() => {
  return props.startValue ? unitToDate(props.startValue) : null
})

const endValue = computed(() => {
  return props.endValue ? unitToDate(props.endValue) : null
})

const dateRange = ref<[Date | null, Date | null]>([startValue.value || null, endValue.value || null])

// watch(dateRange, (newVal) => {
//   emit('update:modelValue', newVal)
// })

const handleDateChange = (value: [Date | null, Date | null]) => {
  // console.log(value, 'value')
  dateRange.value = value

  //   emit('update:modelValue', newVal)
  //   console.log(value[0]?.getTime() || 0, 'value[0]?.getTime() || 0')
  emit('update:dateRange', value)
  //   emit('update:endValue', value[1]?.getTime() || 0)
}

onMounted(async () => {
  //   startValue.value = props.startValue ? await unitToDate(props.startValue) : null
  //   endValue.value = props.endValue ? await unitToDate(props.endValue) : null
  //   console.log(await unitToDate(props.startValue), 'unitToDate')
})
</script>
