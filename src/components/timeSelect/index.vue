<template>
  <!-- <el-form-item :label="props.name"  prop="TimeArr" style="width:410px"> -->
  <!-- :disabled-date="disableDateFn" -->
  <el-date-picker
    v-model="TimeArr"
    type="datetimerange"
    :shortcuts="shortcuts"
    range-separator="-"
    unlink-panels
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    format="YYYY-MM-DD HH:mm:ss"
    @change="handleCycleTime"
    value-format="YYYY-MM-DD HH:mm:ss"
  />
  <!-- </el-form-item> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'

const props = defineProps({
  name: {
    type: String
  },
  startPlaceholder: {
    type: String,
    default: '开始时间'
  },
  endPlaceholder: {
    type: String,
    default: '结束时间'
  }
})
//
const startDate: any = defineModel('startDate')
//
const endDate: any = defineModel('endDate')

const TimeArr: any = ref([null, null])

const shortcuts: any = [
  {
    text: '近一个星期',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    }
  },
  {
    text: '近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    }
  },
  {
    text: '近3个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    }
  }
]

// 单个 ref
watch(startDate, (newX) => {
  // console.log(`x is ${newX}`)
  if (!newX) {
    TimeArr.value = [null, null]
  } else {
    TimeArr.value = [
      unitFormatDate(startDate.value, 'yyyy-MM-dd HH:mm:ss'),
      unitFormatDate(endDate.value, 'yyyy-MM-dd HH:mm:ss')
    ]
  }
})
function handleCycleTime(date) {
  if (!date) {
    TimeArr.value = [null, null]
    startDate.value = null
    endDate.value = null
  } else {
    const processDate = (date) => (typeof date === 'string' ? new Date(date).getTime() : date.getTime())
    startDate.value = processDate(TimeArr.value[0])
    endDate.value = processDate(TimeArr.value[1])
  }
}
// function disableDateFn(time) {
//   if (time.getTime() > Date.now() - 8.64e6) {
//     return true
//   } else {
//     return false
//   }
// }
</script>
<style lang="less" scoped></style>
