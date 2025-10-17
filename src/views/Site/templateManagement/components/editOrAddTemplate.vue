<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="isVisible"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @open="openReq"
    @close="handleClose"
  >
    <el-tabs class="demo-tabs m_tabs" v-model="activeTab" @tab-click="handleTabClick">
      <TemplateInfo
        ref="templateInfoRef"
        v-if="modalsStore.templateInfoModal.isVisible"
        @request-grandpa="onRequestGrandpa"
      ></TemplateInfo>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useModalsStore } from '@/stores/modalStore'
import { defineEmits } from 'vue'
import TemplateInfo from './templateInfo.vue'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const templateInfoRef = ref<any>(null)
const emit = defineEmits()
const handleClose = () => {
  emit('close-tabs')
}
const handleTabClick = (tab: any) => {
  if (tab.props.label === '引用草图') {
    if (templateInfoRef.value) {
      templateInfoRef.value.$refs.sketchRef.reqSketchInfo()
    }
  }
}

const onRequestGrandpa = () => {
  emit('call-grandpa')
}
const props = defineProps<{
  templateInfo: any
}>()
const templateId = ref<string>('')
const modalsStore = useModalsStore()
const isVisible = computed(() => {
  return modalsStore.templateInfoModal.isVisible
})
const activeTab = computed(() => {
  return modalsStore.templateInfoModal.activeTab
})
const modalData = computed(() => modalsStore.templateInfoModal.modalData || {})
const openReq = async () => {
  templateId.value = modalData.value.templateId
}
</script>
