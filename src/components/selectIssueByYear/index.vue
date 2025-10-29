<template>
  <el-select v-model="state" v-bind="$attrs" filterable placeholder="请选择期数">
    <el-option v-for="item in loadAll" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/service/index'
import { getGameIssuesList } from '@/api/betting'

interface IProps {
  year: number
  gameType: string
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
const innerValue = ref('') // 组件内部的 v-model 绑定

interface IAllData {
  id: string
  value: string
  label: string
}

const fetchData = async ({ year, gameType }: { year: number; gameType: number }) => {
  if (props.year && props.gameType) {
    loading.value = true
    try {
      const res = await getGameIssuesList({
        gameType,
        year
      })
      if (res.success) {
        const data = res?.data?.map((item) => ({
          value: item,
          label: item,
          id: item
        }))
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

// 监听 `gameType` 变化
watch(
  () => [props.year, props.gameType],
  async (newVal) => {
    await fetchData({
      year: Number(newVal[0]),
      gameType: Number(newVal[1])
    })
  }
)

onMounted(() => {
  fetchData({
    year: Number(props.year),
    gameType: Number(props.gameType)
  })
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
