<template>
  <el-select
    v-model="state"
    class="my-select"
    placeholder="请选草图代码"
    @change="onChange"
    :loading="loading"
    fit-input-width
  >
    <!-- remote
    clearable
    filterable
    :remote-method="querySearch" -->
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label} - ${item.value}`" :value="item.value">
      <template #default>
        <div class="value">{{ truncateText(item.label) }} - {{ item.value }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reqGetALLSketchList } from '@/api/site'
import { truncateText } from '@/utils/dataFormat'

interface IProps {
  modelValue: string
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()

const state = ref(props.modelValue)
const loadAll = ref<IAllData[]>([])
const loading = ref(false)

interface IAllData {
  value: string
  label: string
  all: string
}

const onChange = (value) => {
  emit('update:modelValue', value)
}

const fetchData = async () => {
  try {
    const res = await reqGetALLSketchList()
    if (res.success) {
      loadAll.value =
        res.data?.map((item) => {
          return {
            label: item.sketchName,
            value: item.sketchCode,
            all: item.sketchName + ' ' + item.sketchCode
          }
        }) || []
    }
  } catch (error) {
    ElMessage.error('获取期数时出错')
  } finally {
    loading.value = false
  }
}

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.all.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
      loading.value = false
    }, 200)
  } else {
    fetchData() // 如果搜索框为空，重新加载完整数据
  }
}

onMounted(() => {
  fetchData()
})

watch(
  () => props.modelValue,
  (newVal) => {
    // querySearch(newVal)
    state.value = newVal
  }
)
</script>

<style scoped>
.my-select {
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
