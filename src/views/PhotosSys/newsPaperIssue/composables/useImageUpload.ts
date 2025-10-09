// composables/useImageUpload.ts
import { computed, ref } from 'vue'
import { uploadSingle, addHttp } from '@/api/system/upload'
import { getIssueMapping } from '@/api/photoSys/issueMappingList'
import { ElMessage, ElMessageBox, type UploadUserFile } from 'element-plus'
import { sessionCache } from '@/hooks/useSession'
import type { IssueFormData } from '../IssueTypes/index'
import type { RxState } from './useIssueForm'
export type EnhancedUploadFile = UploadUserFile & { issueNumber?: number }
export function useImageUpload(rxState: RxState<IssueFormData>) {
  const fileList = computed(() => rxState.fileList)
  const fileData = ref<File>()
  const isLoading = ref(false)
  const formState = computed(() => rxState.formState)
  // Assuming these are globally available in your app
  const { VITE_CDN_URL, VITE_STORY_TYPE, VITE_NODE_ENV, VITE_PROXY_UPLOAD } = window.webConfigApi

  const showReferenceConfirmDialog = async () => {
    return await ElMessageBox.confirm('是否引用已存在于映射表的资料？', '提示', {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning'
    }).then(
      () => true,
      () => false
    )
  }

  const uploadLog = async (param: any) => {
    if (!param || !fileData.value) {
      return
    }

    const uploadUser = sessionCache.getCache('userID')
    const formData: any = {
      storageStyle: 6,
      fileType: 'img',
      uploadFrom: param.data.path,
      uploadTarget: fileData.value.name,
      storageType: VITE_STORY_TYPE,
      uploadUser,
      biz: 'upload',
      fileSize: fileData.value.size,
      env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod'
    }

    try {
      const response = await addHttp(formData)
      if (response.success) {
        return true
      } else {
        ElMessage.error('上传失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('上传失败')
    }
    return false
  }
  async function loadExistMapping() {
    if (!fileData.value) {
      return
    }

    const res = (await getIssueMapping({ fileId: fileData.value.name })) as any

    if (!res.success || res?.data === '' || !res.data.gameType) {
      return
    }

    if (res.data.gameType?.toString() !== formState.value.gameType?.toString()) {
      return
    }

    if (await showReferenceConfirmDialog()) {
      formState.value.seriesCode = res.data.seriesCode
      formState.value.newspaperCode = res.data.newspaperCode
    }
  }
  const handelCustomRequest = async (options: any, useExistingMapping: boolean = false) => {
    fileData.value = options.file

    const param = {
      fileType: 'img',
      uploadFrom: 'newspaper/issue',
      storageStyle: 7
    }

    const formData: any = {
      uploadTarget: options.file.name,
      file: options.file,
      storageType: VITE_STORY_TYPE,
      env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
      issueNumber: formState.value.issue,
      ...param
    }

    const obj = {
      baseurl: VITE_PROXY_UPLOAD,
      contenttype: 'multipart/form-data'
    }

    isLoading.value = true

    try {
      const response = await uploadSingle(formData, obj)
      const { path } = response.data as any
      formState.value.imgPath = path
      const uploadedFlag = await uploadLog(response)
      if (uploadedFlag) {
        ElMessage.success('上传成功')
        if (useExistingMapping) {
          await loadExistMapping()
        }
      }

      return true
    } catch (error) {
      console.error('Upload error:', error)
      ElMessage.error('文件上传失败')
      return false
    } finally {
      isLoading.value = false
    }
  }

  const setFileListFromPath = (imgPath: string) => {
    if (imgPath) {
      const parts = imgPath.split('/')
      const lastPart = parts[parts.length - 1]
      rxState.fileList = [{ name: lastPart, url: VITE_CDN_URL + imgPath }]
    } else {
      rxState.fileList = []
    }
  }

  return {
    fileList,
    isLoading,
    handelCustomRequest,
    setFileListFromPath
  }
}
