<template>
  <el-tabs class="m_tabs">
    <el-tab-pane :label="label" class="m_tabs_pane">
      <slot></slot>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>
<style scoped>
/* Add any necessary styles */
</style>
