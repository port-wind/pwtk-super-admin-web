import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useFileValidation } from './useFileValidation'
import { uploadSingle } from '@/api/system/upload/index'
import type { FileUploadOptions, VideoInfo, UploadState, UploadProgress } from '@/global_types/video-upload'
import type { FileUploadRequest } from '@/api/system/upload/types'

export function useGenericVideoUpload(
  options: FileUploadOptions = {},
  emit: (..._: any[]) => void,
  videoInfo?: VideoInfo
) {
  // Composables
  const { validateVideoFile } = useFileValidation()

  // State
  const selectedFile = ref<File | null>(null)
  const uploadState = ref<UploadState>({
    isUploading: false,
    progress: 0,
    status: '',
    sessionId: null,
    isPaused: false
  })
  const abortController = ref<AbortController | null>(null)

  // Computed
  const fileName = computed(() => selectedFile.value?.name || videoInfo?.filename || '')
  const isUploading = computed(() => uploadState.value.isUploading)
  const progress = computed(() => uploadState.value.progress)
  const uploadStatus = computed(() => uploadState.value.status)
  const isPaused = computed(() => uploadState.value.isPaused)

  // Methods
  const handleUploadProgress = (progressPercent: number): void => {
    uploadState.value.progress = progressPercent

    const progressData: UploadProgress = {
      percent: progressPercent,
      uploadedChunks: progressPercent >= 100 ? 1 : 0,
      totalChunks: 1
    }

    emit('upload-progress', progressData)
  }
  const cancelUpload = (): void => {
    // Reset upload state
    uploadState.value.isUploading = false
    uploadState.value.progress = 0
    uploadState.value.status = ''
    uploadState.value.isPaused = false

    // Abort current request if any
    if (abortController.value) {
      try {
        abortController.value.abort()
      } catch {}
    }

    // Reset session
    uploadState.value.sessionId = null

    // Reset selected file
    const currentFile = selectedFile.value
    selectedFile.value = null

    // Notify that upload was cancelled
    emit('upload-cancelled', { file: currentFile })
    emit('file-selected', null)
  }

  const startUpload = async (file: File): Promise<void> => {
    try {
      // Reset state
      uploadState.value = {
        isUploading: true,
        progress: 0,
        status: '',
        sessionId: null,
        isPaused: false
      }

      emit('upload-started', { file })
      // Build single-upload payload aligned with /upload/single
      // eslint-disable-next-line no-undef
      const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

      const uploadFrom = (options.params as any)?.uploadFrom || options.path || 'lottery/video'
      const storageStyle = Number((options.params as any)?.storageStyle ?? 6)

      const formData: FileUploadRequest = {
        fileType: 'video',
        uploadFrom,
        storageStyle,
        uploadTarget: file.name,
        storageType: VITE_STORY_TYPE,
        env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
        file
      }

      abortController.value = new AbortController()

      const requestOptions: Record<string, any> = {
        baseurl: VITE_PROXY_UPLOAD,
        contenttype: 'multipart/form-data',
        headers: {
          clientType: 'Web',
          ...(options.headers || {})
        },
        signal: abortController.value.signal,
        onUploadProgress: (evt: any) => {
          if (evt && evt.total) {
            const percent = Math.round((evt.loaded / evt.total) * 100)
            handleUploadProgress(percent)
          }
        }
      }

      const response = await uploadSingle(formData as any, requestOptions)

      uploadState.value.isUploading = false
      uploadState.value.progress = 100
      uploadState.value.status = 'success'

      emit('upload-success', response)
    } catch (error) {
      uploadState.value.isUploading = false
      uploadState.value.status = 'exception'
      ElMessage.error('上传失败')
      emit('upload-error', error as any)
    }
  }

  const selectFile = async (file: File): Promise<void> => {
    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.isValid) {
      const error = new Error(validation.error)
      emit('invalid-file-type', { file, error })
      return
    }

    // Cancel any ongoing upload
    if (uploadState.value.isUploading) {
      cancelUpload()
    }

    selectedFile.value = file
    emit('file-selected', file)

    // Start upload process
    await startUpload(file)
  }

  const retryUpload = (): void => {
    if (selectedFile.value && !uploadState.value.isUploading) {
      startUpload(selectedFile.value)
    }
  }

  const pauseUpload = (): void => {
    if (!uploadState.value.isUploading || uploadState.value.isPaused) return

    uploadState.value.isPaused = true
    if (abortController.value) {
      try {
        abortController.value.abort()
      } catch {}
    }
  }

  const resumeUpload = (): void => {
    if (!uploadState.value.isPaused || !selectedFile.value) return
    uploadState.value.isPaused = false
    // For single request uploads, resume == restart
    startUpload(selectedFile.value)
  }

  const reset = (): void => {
    cancelUpload()
    selectedFile.value = null
    uploadState.value = {
      isUploading: false,
      progress: 0,
      status: '',
      sessionId: null,
      isPaused: false
    }
  }

  return {
    // State
    selectedFile,
    fileName,
    isUploading,
    progress,
    uploadStatus,
    isPaused,

    // Methods
    selectFile,
    cancelUpload,
    retryUpload,
    pauseUpload,
    resumeUpload,
    reset
  }
}
