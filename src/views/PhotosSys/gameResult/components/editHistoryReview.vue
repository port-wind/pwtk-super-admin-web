<script setup lang="ts">
import type { Tab } from '../data'
import ResultTab from '../ResultTab/index.vue'

interface Props {}
const props = defineProps<Props>()
const emit = defineEmits(['close'])

const tabList = [
  { label: '澳六', value: 'a' },
  { label: '台六', value: 'tw' },
  { label: '港六', value: 'hk' },
  { label: '新六', value: 'sg' },
  { label: '新澳六', value: 'xa' },
  { label: '快乐8', value: 'kl8' }
] as const

type TabItem = (typeof tabList)[number]

const activeTab = ref<TabItem | null>(null)
const checkStatus = ref<string>('first')
const visible = ref(false)

const onClosed = () => {
  emit('close')
  visible.value = false
}

const openDialog = (tab: Tab, _checkStatus: string) => {
  visible.value = true
  activeTab.value = tabList.find((item) => item.value === tab) || null
  checkStatus.value = _checkStatus
}

export interface IExpose {
  openDialog: (tab: Tab, checkStatus: string) => void
}

defineExpose<IExpose>({
  openDialog
})
</script>

<template>
  <el-dialog v-model="visible" width="80%" :title="`修改开奖结果 - ${activeTab?.label || ''}`" @closed="onClosed">
    <ResultTab v-if="activeTab" :tab="activeTab?.value" :checkStatus="checkStatus" />
  </el-dialog>
</template>

<style scoped>
.input-number {
  width: 100%;
}

.cc-scrollbar {
  padding: 0 10px;
  margin-top: 20px;
}

.cc-submit {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.cc-form {
  width: 80%;
  margin: 0 auto;
}

.cc-form :deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
