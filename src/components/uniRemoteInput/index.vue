<template>
  <el-select
    :key="count"
    v-model="modelValue"
    filterable
    remote
    reserve-keyword
    :placeholder="placeholder"
    clearable
    :remote-method="remoteSearch"
    :loading="isLoading"
    @[eventFocus]="onfocus"
    @clear="handleClear"
    @change="onChange"
    @click="handleClick"
    :no-data-text="noDataText"
    v-bind="$attrs"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="getOptionLabel(item)"
      :value="item[valueKey]"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
  placeholder: { type: String, default: '' },
  valueKey: { type: String, required: true },
  labelKey: { type: String, required: true },
  searchKey: { type: String, required: true },
  fetchOptions: { type: Function, required: true },
  formatLabel: { type: Function, default: null },
  isPage: { type: Object, default: () => ({ page: 1, size: 100 }) },
  eventFocus: { type: String, default: '' },
  searchObj: { type: Object, default: () => ({}) },
  limitTrigger: { type: Object, default: () => ({ trigger: false, limit: 4 }) }
})
const emit = defineEmits(['optionChange', 'valueChange'])
const pageData = props.isPage ?? {}
const modelValue = defineModel('modelValue')
const options = ref<any[]>([])
const isLoading = ref(false)
const noDataText = ref()
const count = ref(0)
watch(
  () => modelValue.value,
  (newValue) => {
    if (!newValue) {
      modelValue.value = ''
    } else {
      onSearch('')
    }
  }
)

function onChange(val) {
  emit(
    'valueChange',
    options.value.find((item) => item[props.valueKey] === val)
  )
}
const handleClick = async () => {
  options.value = []
  isLoading.value = true
  await onSearch('')
}
async function remoteSearch(query) {
  const { trigger, limit } = props.limitTrigger
  if (trigger && query?.length < limit) {
    options.value = []
    noDataText.value = `请至少输入${limit}个字符`
    return
  }
  noDataText.value = '无数据'
  if (query) {
    isLoading.value = true
    await onSearch(query)
  } else {
    options.value = []
  }
}
async function onfocus(query) {
  options.value = []
  isLoading.value = true
  console.log('onfocus', query)
  await onSearch('')
}
async function handleClear() {
  console.log('handleClear')
}

function getOptionLabel(item) {
  if (props.formatLabel) {
    return props.formatLabel(item)
  }
  return item[props.labelKey]
}
async function onSearch(str: string) {
  try {
    const res = await props.fetchOptions({
      [props.searchKey]: str,
      ...pageData,
      ...props.searchObj
    })
    options.value = res?.data?.list || []
    emit('optionChange', options.value)
  } catch (err) {
    console.error('Failed to fetch options:', err)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  await loadInitialOption()
  if (modelValue.value) {
    // onSearch(modelValue.value as string)
  }
})

async function loadInitialOption() {
  isLoading.value = true
  try {
    const res = await props.fetchOptions({
      [props.valueKey]: modelValue.value,
      ...pageData,
      ...props.searchObj
    })
    if (res?.data?.list && res.data.list.length > 0) {
      nextTick(() => {
        options.value = res.data.list
        emit('optionChange', options.value)
      })
    }
  } catch (err) {
    console.error('Failed to fetch initial option:', err)
  } finally {
    isLoading.value = false
  }
}
</script>
