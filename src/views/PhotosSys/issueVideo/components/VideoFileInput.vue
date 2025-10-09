<template>
  <input
    type="file"
    accept="video/*"
    @change="handleFileChange"
    style="display: none"
    ref="inputRef"
    @click="clearInput"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Events
const emit = defineEmits<{
  'file-selected': [file: File]
}>()

// Refs
const inputRef = ref<HTMLInputElement | null>(null)

// Methods
const openSelector = (): void => {
  inputRef.value?.click()
}

const clearInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  target.value = ''
}

const handleFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement
  const { files } = input

  if (!files || files.length === 0) return

  const file = files[0]
  emit('file-selected', file)
}

// Expose methods
defineExpose({
  openSelector
})
</script>
