export interface FileUploadOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number>
  fileFieldName?: string
  showOperation?: boolean
  chunkSize?: number
  concurrency?: number
  tag?: string
  path?: string
}

export interface UploadResponse {
  success: boolean
  data?: any
  error?: Error | string | null
  message?: string
}

export interface VideoInfo {
  duration?: number
  filesize: number
  filename: string
  id?: number
  mimeType: string
  fileUrl?: string
}

export interface ChunkInfo {
  index: number
  blob: Blob
  status: 'pending' | 'uploading' | 'uploaded' | 'error'
  progress: number
}

export interface UploadProgress {
  percent: number
  uploadedChunks: number
  totalChunks: number
}

export interface UploadState {
  isUploading: boolean
  progress: number
  status: '' | 'success' | 'exception'
  sessionId: string | null
  isPaused: boolean
}

export type UploadEmits = {
  'file-selected': [file: File | null]
  'upload-started': [data: { file: File }]
  'upload-progress': [data: UploadProgress]
  'upload-success': [data: UploadResponse]
  'upload-error': [error: Error | string]
  'upload-cancelled': [data: { file: File | null }]
  'invalid-file-type': [data: { file: File; error: Error }]
  'preview-ready': [previewUrl: string]
}
