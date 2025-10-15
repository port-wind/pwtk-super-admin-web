<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs class="m_tabs">
      <el-tab-pane label="批量添加成员" class="m_tabs_pane"></el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const emit = defineEmits(['callBack', 'refreshPage'])
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

const isVisible = computed(() => props.isVisible)

const close = () => {
  emit('callBack')
}
</script>
