<template>
  <div class="deferred-video-uploader">
    <!-- Hidden file input -->
    <VideoFileInput ref="fileInputRef" @file-selected="handleFileSelected" />

    <!-- UI elements -->
    <div class="file-selector" v-if="showOperation">
      <template v-if="!hasSelectedFile">
        <el-button type="primary" size="large" @click="openFileSelector">
          <el-icon><Plus /></el-icon>
          {{ buttonText }}
        </el-button>
      </template>

      <template v-else>
        <UploadProgress v-if="isUploading" :progress="progress" :status="uploadStatus" />
        <FileInfo v-else :fileName="fileName" @modify="openFileSelector" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { VideoInfo, FileUploadOptions, UploadEmits } from '@/global_types/video-upload'
import { useGenericVideoUpload } from '@/composables/useGenericVideoUpload'

// Props
interface Props {
  buttonText?: string
  videoInfo?: VideoInfo
  showOperation?: boolean
  uploadOptions?: FileUploadOptions
  userId?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: '选择视频',
  videoInfo: undefined,
  showOperation: false,
  uploadOptions: () => ({}),
  userId: ''
})

// Events - extend the original events with upload method
interface DeferredUploadEmits extends UploadEmits {
  'preview-ready': [previewUrl: string]
}

const emit = defineEmits<DeferredUploadEmits>()

// Refs
const fileInputRef = ref<InstanceType<typeof VideoFileInput> | null>(null)
const internalPreviewUrl = ref<string>('')
const lastUploadResult = ref<any | null>(null)
const pendingPromise = ref<{ resolve: (_value: any) => void; reject: (_error: any) => void } | null>(null)

// Create a wrapper for the emit function that also captures upload results
const emitWrapper = (event: string, ...args: any[]) => {
  const [payload] = args
  if (event === 'upload-success') {
    lastUploadResult.value = payload
    if (pendingPromise.value) {
      pendingPromise.value.resolve(payload)
      pendingPromise.value = null
    }
  }
  if (event === 'upload-error') {
    if (pendingPromise.value) {
      pendingPromise.value.reject(payload)
      pendingPromise.value = null
    }
  }
  ;(emit as any)(event, ...args)
}

// Composables - switch to generic upload
const {
  selectedFile,
  fileName,
  isUploading,
  progress,
  uploadStatus,
  selectFile,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload,
  reset
} = useGenericVideoUpload(props.uploadOptions, emitWrapper, props.videoInfo)

// Derived state to keep compatibility
const hasSelectedFile = computed(() => !!selectedFile.value)
const previewUrl = computed(() => internalPreviewUrl.value)

// Methods
const openFileSelector = (): void => {
  fileInputRef.value?.openSelector()
}

const handleFileSelected = async (file: File): Promise<void> => {
  // Revoke previous blob URL
  if (internalPreviewUrl.value && internalPreviewUrl.value.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(internalPreviewUrl.value)
    } catch {}
  }

  // Create preview URL locally
  internalPreviewUrl.value = URL.createObjectURL(file)

  // Emit preview ready immediately
  if (internalPreviewUrl.value) {
    emit('preview-ready', internalPreviewUrl.value)
  }

  // This will automatically start upload in generic composable
  await selectFile(file)
}

// Public method to return upload result (waits if needed)
const uploadFile = async (): Promise<any> => {
  if (!hasSelectedFile.value) {
    throw new Error('没有选择文件')
  }

  // If already succeeded and we captured result, return it
  if (uploadStatus.value === 'success' && lastUploadResult.value) {
    return lastUploadResult.value
  }

  // If currently uploading or needs retry, wait for completion via emitted events
  return new Promise((resolve, reject) => {
    pendingPromise.value = { resolve, reject }

    // If not uploading, try to restart
    if (!isUploading.value) {
      try {
        retryUpload()
      } catch (e) {
        pendingPromise.value = null
        reject(e)
      }
    }
  })
}

// Expose public methods
defineExpose({
  openFileSelector,
  uploadFile,
  reset,
  cancelUpload,
  retryUpload,
  pauseUpload,
  resumeUpload,
  selectedFile,
  previewUrl,
  hasSelectedFile,
  isUploading, // Expose isUploading directly for reactive access
  // Debug info
  debug: () => ({
    hasSelectedFile: hasSelectedFile.value,
    selectedFile: selectedFile.value,
    isUploading: isUploading.value,
    uploadStatus: uploadStatus.value,
    previewUrl: previewUrl.value
  })
})

// Lifecycle hook
onMounted(() => {
  console.log('DeferredVideoUploader mounted')
})

onBeforeUnmount(() => {
  if (internalPreviewUrl.value && internalPreviewUrl.value.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(internalPreviewUrl.value)
    } catch {}
  }
})
</script>

<style scoped>
.deferred-video-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  border: 1px dashed #d9d9d9;
  flex: 1;
}

.file-selector {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
</style>
