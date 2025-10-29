<template>
  <!-- :disabled-date="disableDateFn" -->
  <!-- :shortcuts="shortcuts" -->
  <!-- <el-form-item :label="props.name"  prop="TimeArr" style="width:410px"> -->
  <el-date-picker
    v-model="TimeArr"
    type="datetimerange"
    range-separator="-"
    unlink-panels
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    format="YYYY-MM-DD HH:mm:ss"
    @change="handleCycleTime"
    value-format="YYYY-MM-DD HH:mm:ss"
    :disabled-date="disableDateFn"
  />
  <!-- </el-form-item> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'

// 接收父组件传递的 minDate 作为 props
const props = defineProps({
  name: String,
  minDate: {
    type: [String, Date], // 允许传入字符串或日期类型
    default: null // 默认不限制时间
  }
})
//
const startDate: any = defineModel('startDate', { default: null })
//
const endDate: any = defineModel('endDate', { default: null })

// 控制最小时间，null 表示不限制
const minDate: any = ref(null)

const TimeArr: any = ref([
  unitFormatDate(startDate.value, 'yyyy-MM-dd HH:mm:ss'),
  unitFormatDate(endDate.value, 'yyyy-MM-dd HH:mm:ss')
])

const shortcuts: any = [
  {
    text: '上个星期',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    }
  },
  {
    text: '上个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    }
  },
  {
    text: '最近3个月',
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
  console.log(`x is ${newX}`)
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
    // startDate.value = unitFormatDate(TimeArr.value[0]);
    // endDate.value = unitFormatDate(TimeArr.value[1]);
    const processDate = (date) => (typeof date === 'string' ? new Date(date).getTime() : date.getTime())
    startDate.value = processDate(TimeArr.value[0])
    endDate.value = processDate(TimeArr.value[1])
  }
}
// function disableDateFn(time){
//   if(time.getTime() > Date.now() - 8.64e6){
//     return true
//   }else{
//     return false
//   }
// }

// 设置 disabled-date 函数，当有最小时间时应用限制
// 设置 disabled-date 函数，根据传入的 minDate 限制最小时间
function disableDateFn(time) {
  if (props.minDate) {
    return time.getTime() < new Date(props.minDate).getTime()
  }
  return false // 不限制时间
}
</script>
<style lang="less" scoped></style>
