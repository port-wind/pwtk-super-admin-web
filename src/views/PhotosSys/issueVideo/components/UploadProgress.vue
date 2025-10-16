<template>
  <div class="progress-container">
    <el-progress :percentage="progress" :status="status" class="upload-progress" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  status: '' | 'success' | 'exception'
}

defineProps<Props>()
</script>

<style scoped>
.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.upload-progress {
  margin-left: 10px;
  min-width: 100px;
  flex: 1;
}
</style>
