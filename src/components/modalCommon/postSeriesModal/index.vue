<template>
  <el-dialog
    draggable
    class="tabs-dialog"
    overflow
    destroy-on-close
    v-model="isVisible"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs v-model="activeTab" style="flex: 1; overflow: hidden">
      <el-tab-pane label="帖子信息" name="first" class="m_tabs_pane" style="overflow: hidden; height: 100%">
        <modal-content :modal-data="modalData" @close="closeTabs" @submit="handleSubmit" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useModalsStore } from '@/stores/modalStore'

const emit = defineEmits(['refreshPage'])
const activeTab = ref('first')
const modalsStore = useModalsStore()
const isVisible = computed(() => modalsStore.postSeriesModal.isVisible)
const modalData = computed(() => modalsStore.postSeriesModal.modalData || {})

//关闭窗口
const closeTabs = () => {
  modalsStore.hideModal('postSeriesModal')
}
const handleSubmit = () => {
  closeTabs()
  emit('refreshPage')
}

onMounted(async () => {})
</script>

<style scoped lang="less">
:deep(.el-tabs__content) {
  height: 100%;
}
</style>
