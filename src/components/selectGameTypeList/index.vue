<template>
  <el-select v-model="state" v-bind="$attrs" value-key="id" filterable placeholder="请选择期数">
    <el-option v-for="item in loadAll" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/service/index'
import { gameTypePlatformList } from '@/api/system/gameTypeManagement/index'
interface IProps {
  modelValue: string
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'update:modelValue', value: string): void
}
const state = ref(props.modelValue)
const emit = defineEmits<IEmit>()
const loadAll = ref<IAllData[]>()
const loading = ref(false)

interface IAllData {
  id: string
  value: string
  label: string
}

/**
 * areaCode :  "NMAC"
classifier :  "official"
createTime :  1737687490000
gameType :  "5"
gameTypeCode :  "xa6"
gameTypeLongName :  "新澳门六合彩"
gameTypeName :  "新澳六"
gameTypeShortName :  "新澳彩"
sortNum :  2
status :  "y"
 */
const fetchData = async () => {
  try {
    const res = await gameTypePlatformList({
      page: 1,
      size: 999
    })
    if (res.success) {
      const data = res?.data.list.map((item) => ({
        value: item.gameType,
        label: item.gameTypeName,
        id: item.gameType
      }))
      console.log('🚀 ~ data ~ data:', data)
      loadAll.value = data
    } else {
      loadAll.value = []
    }
  } catch (error) {
    ElMessage.error('获取期数时出错')
  } finally {
    loading.value = false
  }
}

// 同步外部传入的 v-model 数据
watch(
  () => state.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)
// 监听外部传入的 v-model 数据
watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
  }
)

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.my-select {
  width: 100%;
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
