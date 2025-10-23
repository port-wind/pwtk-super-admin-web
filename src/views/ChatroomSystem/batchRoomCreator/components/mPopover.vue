<template>
  <el-popover :width="width" :show-after="showAfter" ref="popoverRef">
    <template #reference>
      <el-icon :style="iconStyle" @click="handleEdit">
        <Edit />
      </el-icon>
    </template>
    <slot></slot>
    <div class="popover-footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import { Edit } from '@element-plus/icons-vue'
const popoverRef = ref<any>(null)
const props = defineProps({
  width: {
    type: Number,
    default: 500
  },
  showAfter: {
    type: Number,
    default: 800
  },
  iconStyle: {
    type: String,
    default: 'margin-left: 10px; cursor: pointer'
  }
})

const emit = defineEmits(['update:visible', 'edit', 'confirm'])
const confirm = () => {
  emit('confirm')
}
const handleEdit = () => {
  emit('edit')
}
const cancel = (event: Event) => {
  emit('update:visible', false)
}
</script>

<style scoped lang="less">
.popover-footer {
  text-align: right;
}
</style>
