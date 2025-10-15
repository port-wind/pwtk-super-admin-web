<template>
  <el-select
    v-model="state"
    v-bind="$attrs"
    class="my-select"
    filterable
    remote
    :placeholder="placeholder"
    clearable
    @change="onChange"
    :remote-method="querySearch"
    :loading="loading"
  >
    <el-option v-for="item in loadAll" :key="item.value" :label="`${item.label}`" :value="item.value">
      <template #default>
        <div class="value">{{ truncateText(item.label) }}</div>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { reqUserList } from '@/api/user'
import { truncateText } from '@/utils/dataFormat'
import { IReqUserListQueryParams } from '@/api/user/type'

interface IProps {
  modelValue: string
  placeholder?: string
}
const props = defineProps<IProps>()
const emit = defineEmits(['update:modelValue'])

const loadAll = ref<IAllData[]>([])
const loading = ref(false)
const state = ref(props.modelValue) // 组件内部的 v-model 绑定
const placeholder = ref(props.placeholder ?? '用户昵称')
interface IAllData {
  value: string
  label: string
  all: string
}

const onChange = (value) => {
  emit('update:modelValue', value)
}

const fetchData = async (querySearch?: string): Promise<IAllData[]> => {
  loading.value = true
  try {
    const query: IReqUserListQueryParams = {
      searchId: querySearch,
      page: 1,
      size: 200
    }
    const res = await reqUserList(query)
    if (res.success) {
      loadAll.value = res.data.list.map((item) => {
        return {
          value: item.userId,
          label: item.nickname,
          all: item.nickname + ' ' + item.userId
        }
      })
      loading.value = false
      return Promise.resolve(loadAll.value)
    } else {
      loadAll.value = []
      return Promise.resolve([])
    }
  } catch (error) {
    ElMessage.error('获取用户ID时出错')
    return Promise.reject('获取用户ID时出错')
  } finally {
    loading.value = false
  }
}

const querySearch = (queryString: string) => {
  if (queryString.trim()) {
    loading.value = true
    fetchData(queryString).then((res) => {
      loadAll.value = res.filter((item) => {
        return item.all.toLowerCase().includes(queryString.toLowerCase())
      })
      loading.value = false
    })
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
    fetchData(newVal)
  }
)

onMounted(() => {
  fetchData(props.modelValue)
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
