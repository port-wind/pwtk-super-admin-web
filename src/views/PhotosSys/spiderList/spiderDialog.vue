<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    :model-value="true"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs model-value="mainTab" class="m_tabs">
      <el-tab-pane class="m_tabs_pane" :label="id ? '检视编辑' : '新增'" name="mainTab" :stretch="true">
        <CreateSpider @refresh="emit('refresh')" @close="closeTabs" :id="id" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(['update:modelValue', 'refresh', 'close'])

defineProps<{
  modelValue: boolean
  id: string
}>()

const closeTabs = () => {
  emit('close')
  emit('update:modelValue', false)
}

onMounted(() => {})
</script>
<style scoped lang="less"></style>
