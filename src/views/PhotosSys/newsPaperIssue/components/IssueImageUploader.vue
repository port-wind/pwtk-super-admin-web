<template>
  <div :class="['image-container-issue', { 'hide-add': fileList.length >= 1 }]" @click="handleUploadClick">
    <el-upload
      :multiple="true"
      :disabled="!formState.issue"
      listType="picture-card"
      :limit="1"
      :fileList="fileList"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :on-error="onError"
      :on-progress="onProgress"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="customUploadRequest"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, UploadUserFile } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { RxState } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'

import { useImageUpload } from '@/views/PhotosSys/newsPaperIssue/composables/useImageUpload'
import { Awaitable } from '@vueuse/core'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'
import type { IssueFormData } from '../IssueTypes/index'

const props = defineProps({
  rxState: {
    type: Object as () => RxState<IssueFormData>,
    required: true
  }
})
const { fileList, handelCustomRequest } = useImageUpload(props.rxState)
const formState = computed(() => props.rxState.formState)
const issue = computed(() => formState.value.issue)
const handleUploadClick = () => {
  if (!issue.value) {
    ElMessage.error('请先选择期数')
  }
}

const beforeUpload = (file: File) => {
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  return true
}

const onProgress = (event: any) => {
  console.log('Upload progress:', event.percent)
}

const onRemove = () => {
  formState.value.imgPath = ''
  props.rxState.fileList = []
}
const onSuccess = (response: any, file: any, fileList: any[]) => {
  console.log('Upload success:', response)
}

const onError = (error: any) => {
  console.error('Upload error:', error)
  ElMessage.error('文件上传失败')
}

const onChange = (file: any, fileList: any[]) => {
  const updatedFileList = fileList.map((item) => ({
    ...item,
    issueNumber: Number(issue.value)
  }))
  props.rxState.fileList = updatedFileList
}

const beforeRemove: (uploadFile: any, uploadFiles: any) => Awaitable<boolean> = (_, __) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('确认删除该图片?')
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

const customUploadRequest = async (options: any) => {
  await handelCustomRequest(options)
}
</script>

<style scoped lang="less">
.image-container-issue {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  overflow: hidden;

  img {
    object-fit: contain;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }

  &.hide-add {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }

  :deep(.el-upload--picture-card) {
    width: 350px;
    height: 525px;
  }

  :deep(.el-upload-list__item) {
    width: 350px;
    height: 525px;
  }
}
</style>
