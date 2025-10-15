<template>
  <el-select
    v-model="innerValue"
    v-bind="$attrs"
    class="my-select"
    filterable
    remote
    placeholder="请选择期数"
    clearable
    :remote-method="querySearch"
    :loading="loading"
  >
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.value}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.value }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/service/index'

interface IProps {
  gameType: string
  placeholder: string
  /**
   * 默认选择第几期
   */
  default: number
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const innerValue = ref('') // 组件内部的 v-model 绑定

interface IAllData {
  value: string
  issue: string
  issueShort: string
  year: string
  label: string
}

const gameKey = { '2032': 'a6', '1': 'hk6', '3995': 'sg6', '84': 'tw6', '5': 'xa6', '6': 'kl8' }
// 合并issue 期数是多少
const mergeIssueLength = 20

function mergeIssues(data) {
  if (data.length < 2) {
    return data[0]?.issues.map((issue) => ({ ...issue, year: data[0]?.year })) || []
  }

  const firstGroup = data[0]
  const secondGroup = data[1]

  let mergedIssues = firstGroup.issues.map((issue) => ({ ...issue, year: firstGroup.year }))

  if (mergedIssues.length < mergeIssueLength) {
    const neededCount = mergeIssueLength - mergedIssues.length
    const additionalIssues = secondGroup.issues
      .slice(0, neededCount)
      .map((issue) => ({ ...issue, year: secondGroup.year }))
    mergedIssues = [...mergedIssues, ...additionalIssues]
  }
  return mergedIssues
}

function convertNumberToString(value: any) {
  return typeof value === 'number' ? value.toString() : value
}

const fetchData = async () => {
  if (props.gameType) {
    loading.value = true
    try {
      const res = await service.kv().getRecentYearsIssueList(gameKey[props.gameType]).do()
      const result = mergeIssues(res[0])
      if (result) {
        const data = result.flatMap((item) => ({
          ...item,
          issue: convertNumberToString(item.issue),
          value: convertNumberToString(item.issue),
          label: item.issue,
          year: convertNumberToString(item.year)
        }))
        loadAll.value = data
        if (data.length && props.default) {
          innerValue.value = data[props.default - 1].value // 默认选择第一个
          emit('update:modelValue', data[props.default - 1].value) // 同步到外部 v-model
        }
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

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData() // 如果搜索框为空，重新加载完整数据
  }
}

// 同步外部传入的 v-model 数据
watch(
  () => innerValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

// 监听 `gameType` 变化
watch(
  () => props.gameType,
  async (newVal) => {
    if (newVal) {
      await fetchData()
    }
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
