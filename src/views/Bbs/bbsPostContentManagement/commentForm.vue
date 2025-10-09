<template>
  <m-form
    ref="form"
    :fileList="fileList"
    :options="options"
    :commonSpan="22"
    :uploadData="uploadData"
    @on-remove="handleRemove"
    @before-upload="beforeUpload"
    @on-success="handleSuccess"
    style="height: auto; overflow: hidden"
    :rowAttrs="rowAttrs"
  >
    <template #uploadArea>
      <el-icon><Plus /></el-icon>
    </template>
    <template #file="{ file }">
      <EnhancedFileUpload :key="file.uid" :file="file" @remove="handleRemove" />
    </template>
    <template #action="scope">
      <section class="button-row" style="width: 100%; text-align: right">
        <el-button size="small" @click="$emit('cancel', scope)">取消</el-button>
        <el-button type="primary" size="small" @click="$emit('submit', scope)">提交</el-button>
      </section>
    </template>
  </m-form>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import EnhancedFileUpload from './enhancedFileUpload.vue'
import { FormOptions } from '@/components/mForm/types'
import { changeUploadData } from '@/utils/dataFormat'

const props = defineProps({
  fileList: { type: Array, required: true },
  options: { type: Array as () => FormOptions[], required: true },
  uploadData: { type: Object, required: true },
  replyRules: { type: Object }
})
const rowAttrs = {
  gutter: 0
}
const emit = defineEmits(['remove', 'beforeUpload', 'success', 'cancel', 'submit'])

const handleRemove = (val: any) => {
  emit('remove', val)
}

const beforeUpload = (val: any) => {
  emit('beforeUpload', val)
}

const handleSuccess = (val: any) => {
  emit('success', val)
}
</script>
