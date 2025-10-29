<template>
  <div class="file-info">
    <span class="file-name">{{ fileName }}</span>
    <el-link type="primary" class="modify-link" @click="$emit('modify')">修改</el-link>
  </div>
</template>

<script setup lang="ts">
interface Props {
  fileName: string
}

defineProps<Props>()

// Events
defineEmits<{
  modify: []
}>()
</script>

<style scoped>
.file-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.file-name {
  word-break: break-all;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modify-link {
  margin-left: 10px;
}
</style>
