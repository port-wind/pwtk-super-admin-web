<template>
  <el-select
    v-model="state"
    v-bind="$attrs"
    filterable
    remote
    placeholder="请搜索站点ID"
    clearable
    @change="onChange"
    :remote-method="querySearch"
    :loading="loading"
  >
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="value">{{ item.label }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { IReqSetWebSiteListIdQueryParams, reqSetWebSiteListId } from '@/api/site'

interface IProps {
  modelValue: string
  ownerUserId: string
}

const props = defineProps<IProps>()

interface IEmit {
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref('') // 组件内部的 v-model 绑定

interface IAllData {
  value: string
  label: string
  all: string
}
const onChange = (value) => {
  emit('update:modelValue', value)
}

const fetchData = async (querySearch?: string) => {
  try {
    const query: IReqSetWebSiteListIdQueryParams = {
      ownerUserId: props.ownerUserId,
      websiteId: querySearch
    }
    const res = await reqSetWebSiteListId(query)
    if (res.success) {
      loadAll.value =
        res.data?.map((item) => {
          return {
            label: item.websiteInnerName + ' - ' + item.websiteId,
            value: item.websiteId,
            all: item.websiteInnerName + ' - ' + item.websiteId
          }
        }) || []
    }
    // const result = mergeIssues(res[0])
    // if (result) {
    //   const data = result.flatMap((item) => ({
    //     ...item,
    //     issue: convertNumberToString(item.issue),
    //     value: convertNumberToString(item.issue),
    //     label: item.issue,
    //     year: convertNumberToString(item.year)
    //   }))
    //   loadAll.value = data
    //   if (data.length && props.default) {
    //     innerValue.value = data[props.default - 1].value // 默认选择第一个
    //     emit('update:modelValue', data[props.default - 1].value) // 同步到外部 v-model
    //   }
    // } else {
    //   loadAll.value = []
    // }
  } catch (error) {
    ElMessage.error('获取站点id时出错')
  } finally {
    loading.value = false
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
  () => state.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    state.value = newVal
    if (newVal) {
      fetchData(newVal)
    }
  }
)

onMounted(() => {
  fetchData(props.modelValue)
})
</script>

<style scoped>
.value {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
