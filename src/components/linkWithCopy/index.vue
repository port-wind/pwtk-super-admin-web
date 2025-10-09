<template>
  <div class="info-display" @mouseenter="startShowTimer" @mouseleave="startHideTimer">
    <p v-if="config.nameKey">{{ rowData[config.nameKey] }}</p>
    <p v-if="rowData[config.idKey]" class="id-container">
      <span :class="{ 'like-a': !config.notShowLink }" @click="handleAction">
        <template v-if="useSlot">
          <slot>
            {{ displayValue }}
          </slot>
        </template>
        <template v-else>
          {{ displayValue }}
        </template>
      </span>
      <copy v-if="!config.hoverShowCopy" :content="rowData[config.idKey]" class="copy-icon" />
      <copy v-if="config.hoverShowCopy && showCopy" :content="rowData[config.idKey]" class="copy-icon" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useDelayedToggle } from './useDelayedToggle'

interface Config {
  nameKey?: string
  notShowLink?: boolean
  idKey: string
  showName?: boolean
  hoverShowCopy?: boolean
}

const props = defineProps<{
  rowData: Record<string, any>
  config: Config
  limitFunc?: (value: string, limit?: number) => string
  useSlot?: boolean
}>()

const emit = defineEmits<{
  (e: 'action', data: Record<string, any>): void
}>()

const handleAction = () => emit('action', props.rowData)

const displayValue = computed(() => {
  const { rowData, config, limitFunc } = props
  const originalValue = rowData[config.idKey]

  if (limitFunc && typeof originalValue === 'string') {
    return limitFunc(originalValue)
  }
  if (config.showName && config.nameKey) {
    return rowData[config.nameKey]
  }
  return originalValue
})

const { state: showCopy, startShowTimer, startHideTimer } = useDelayedToggle(500, 1200)
</script>

<style scoped>
.info-display {
  position: relative;
  display: inline-block;
}

.copy-icon {
  position: absolute;
  right: -24px;
  top: 50%;
  transform: translateY(-50%);
}

.like-a {
  cursor: pointer;
}
</style>
