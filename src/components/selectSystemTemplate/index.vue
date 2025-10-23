<template>
  <el-select
    v-model="state"
    class="my-select"
    placeholder="请选择系统模版"
    fit-input-width
    clearable
    @change="onChange"
  >
    <!-- :loading="loading" -->
    <!-- remote -->
    <!-- filterable -->
    <!-- :remote-method="querySearch" -->
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.value}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.value }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getSysTemplateRef } from '@/api/site'

interface IProps {
  modelValue: string
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref(props.modelValue)
interface IAllData {
  value: string
  label: string
}

const onChange = (value) => {
  emit('update:modelValue', value)
}

const fetchData = async () => {
  try {
    const res = await getSysTemplateRef()
    if (res.success) {
      loadAll.value =
        res.data?.map((v) => {
          return {
            value: v,
            label: v,
            all: v
          }
        }) || []
    }
  } catch {}
}

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    setTimeout(() => {
      const results = loadAll.value.filter((item) => item.value.toLowerCase().includes(queryString.toLowerCase()))
      loadAll.value = results.length ? results : []
    }, 200)
  } else {
    fetchData() // 如果搜索框为空，重新加载完整数据
  }
}

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
}
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
