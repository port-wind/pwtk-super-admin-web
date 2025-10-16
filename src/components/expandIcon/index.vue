<template>
  <el-icon class="expand-query-icon" :class="{ rotated: expand }" @click="handleExpand">
    <DArrowRight />
  </el-icon>
</template>

<script setup>
import { DArrowRight } from '@element-plus/icons-vue'
import { ref, nextTick } from 'vue'
const expand = ref(false)
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  resizeRef: Object,
  modelValue: Boolean,
  numVisibleItems: {
    type: Number,
    default: 4
  }
})
const handleExpand = () => {
  expand.value = !expand.value
}
const operateRef = () => {
  if (props.resizeRef) {
    const children = props.resizeRef.querySelectorAll('.el-form-item')
    children.forEach((child, index) => {
      if (index >= props.numVisibleItems && index < children.length - 1) {
        child.style.display = expand.value ? '' : 'none'
      }
    })
  }
}
watch(
  () => expand.value,
  (newVal) => {
    emit('update:modelValue', newVal)
    operateRef()
  },
  { immediate: false }
)
onMounted(() => {
  nextTick(() => {
    operateRef()
  })
})
</script>

<style scoped>
.expand-query-icon {
  transition: transform 0.3s ease;
}

.expand-query-icon.rotated {
  transform: rotate(180deg);
}
.expand-query-icon {
  margin-right: 10px;
  cursor: pointer !important;
  color: #f59c17 !important;
}
.expanded-content {
  margin-top: 10px;
}
</style>
