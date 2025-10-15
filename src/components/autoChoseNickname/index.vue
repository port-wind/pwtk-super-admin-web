<template>
  <el-autocomplete
    v-model="state"
    v-bind="$attrs"
    ref="refdom"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="请输入..."
    clearable
    @clear="onClear"
    @input="inputChange"
    @select="handleSelect"
    @change="onChange"
  >
    <template #loading>
      <svg class="circular" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" />
      </svg>
    </template>
    <template #default="{ item }">
      <div class="value">{{ item.value }}</div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { reqUserList } from '@/api/user/index'
import type { IReqUserListData, IReqUserListQueryParams } from '@/api/user/type'

interface IProps {
  modelValue: string | undefined
  isSubOnly?: boolean
}
const props = defineProps<IProps>()
// const isSearchTextProvided = props.searchText !== undefined
// const searchText = defineModel('searchText')

interface IEmit {
  (e: 'onSelect', value: IAllData | null): void
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<IEmit>()
const refdom = ref()
const currentSelect = ref<IAllData | null>()
const loadAll = ref<IAllData[]>([])
const state = ref<string>('')

interface IAllData {
  value: string
  other: Partial<IReqUserListData>
}

const defaultSuggest = (): Promise<IAllData[]> => {
  return reqUserList({
    page: 1,
    size: 100,
    isSubOnly: props.isSubOnly
  }).then((response) => {
    let results: IAllData[] = []
    if (response.success && response.data) {
      results = response.data.list.map(({ nickname, ...rest }) => ({
        value: nickname || '--未指定--',
        other: {
          ...rest
        }
      }))
      return results
    }
    return results
  })
}

const onChange = (value: string | number) => {
  if (value === '' || (currentSelect?.value?.value && value !== currentSelect.value.value)) {
    currentSelect.value = null
    state.value = ''
    emit('onSelect', null)
  }
}

const onBlur = () => {
  // if (isSearchTextProvided) {
  //   return
  // }
  if (!currentSelect?.value) {
    state.value = ''
    emit('onSelect', null)
  }
}

const querySearch = async (queryString: string, cb: (arg: any) => void) => {
  if (!queryString && loadAll.value.length !== 0) {
    cb(loadAll.value)
    return
  }
  try {
    const query: IReqUserListQueryParams = {
      page: 1,
      size: 100,
      nickname: queryString,
      isSubOnly: props.isSubOnly
    }
    const response = await reqUserList(query)
    if (response.success && response.data) {
      const results = response.data.list.map(({ nickname, ...rest }) => ({
        value: nickname,
        other: {
          ...rest
        }
      }))
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    ElMessage.error('获取userId时出错')
    cb([])
  }
}

const handleSelect = (item: IAllData) => {
  emit('onSelect', item)
  currentSelect.value = item
}

const onClear = (evt) => {
  refdom.value.focus()
  emit('onSelect', null)
  currentSelect.value = null
}

const fetchData = async () => {
  const result = await defaultSuggest()
  loadAll.value = result
}
const inputChange = (val) => {
  state.value = val
  emit('update:modelValue', val)
}

onMounted(() => {
  fetchData()
})

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (!newVal) {
      state.value = ''
      currentSelect.value = null
    } else {
      state.value = newVal
    }
  }
)
</script>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 7px;
}
.my-autocomplete li .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete li .addr {
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete li .highlighted .addr {
  color: #ddd;
}

.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}
.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}

@keyframes loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>
