// composables/useIssueForm.ts
import { reactive, ref, computed, type Reactive, type Ref } from 'vue'
import { create, update, getDetailById, getIssueListByParams } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import { YearTypes } from '@/utils/dataFormat'
import { ElMessage, type FormInstance } from 'element-plus'
import type { IssueFormData, NewspaperOption, IssueOptionState } from '../IssueTypes/index'
import { useImageUpload, type EnhancedUploadFile } from './useImageUpload'
export type RxState<T> = Reactive<{
  formState: Reactive<T>
  formRef: FormInstance | null
  fileList: EnhancedUploadFile[]
  isLoading: boolean
  dialogMode: DialogMode
}>
export type DialogMode = '' | 'add' | 'edit'
export const initEditForm = (): IssueFormData => ({
  issue: '',
  year: YearTypes[0].value.toString(),
  seriesCode: '',
  newspaperCode: '',
  gameType: '',
  imgPath: '',
  isColorful: 'y',
  isTop: 'n',
  isSelected: 'n',
  isHot: 'n',
  isBloom: 'n',
  isRecommended: 'n',
  commentFlag: 'y',
  voteFlag: 'y',
  isAllAnnotateContent: 'y',
  annotateContent: '',
  status: 'y',
  createTime: 0,
  seriesName: '',
  newspaperName: '',
  name: '',
  readCount: 0
})
export function useIssueForm(rxState: RxState<IssueFormData>) {
  const form = computed(() => rxState.formState)
  const formRef = computed(() => rxState.formRef)

  const newspaperOptions = ref<NewspaperOption[]>([])
  const { handelCustomRequest, setFileListFromPath } = useImageUpload(rxState)
  const isEditMode = computed(() => rxState.dialogMode === 'edit')
  const isAddMode = computed(() => rxState.dialogMode === 'add')

  const isNewspaperCodeDisabled = computed(() => !form.value.seriesCode)

  const placeholderText = computed(() => {
    if (form.value.seriesCode) {
      const options = newspaperOptions.value
      if (options.length > 0) {
        return '报纸ID'
      }
      return '暂无可选择报纸'
    }
    return '请先选择图纸系列'
  })

  const issueOptionsState = reactive<IssueOptionState>({
    data: [],
    loading: false,
    error: undefined
  })
  const initFormState = (): void => {
    Object.assign(rxState.formState, initEditForm())
  }
  const resetForm = () => {
    Object.assign(rxState.formState, initEditForm())
    rxState.fileList = []
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  }

  const loadIssueDetail = async (issueId: string) => {
    try {
      rxState.isLoading = true
      const response = await getDetailById({ issueId })
      if (response.success) {
        rxState.formState = {
          ...response.data,
          gameType: response.data.gameType?.toString() || '',
          year: response.data.year?.toString() || ''
        }
        return true
      } else {
        showErrorMessage(response)
        return false
      }
    } catch (error) {
      console.error('Error fetching issue details:', error)
      return false
    } finally {
      rxState.isLoading = false
    }
  }

  const saveIssue = async () => {
    try {
      rxState.isLoading = true
      let res

      if (isEditMode.value) {
        res = await update(form.value)
      } else {
        res = await create(form.value)
      }

      if (res.success) {
        ElMessage.success('保存成功')
        return true
      } else {
        showErrorMessage(res)
        return false
      }
    } catch (error) {
      console.error('Error saving issue:', error)
      ElMessage.error('保存失败')
      return false
    } finally {
      rxState.isLoading = false
    }
  }

  const loadIssueOptions = async (gameType: string, year: string) => {
    if (!gameType || !year) {
      issueOptionsState.data = []
      return
    }
    rxState.isLoading = true
    try {
      issueOptionsState.loading = true
      issueOptionsState.error = undefined
      const response = await getIssueListByParams({ gameType, year })

      if (!response?.success) {
        issueOptionsState.data = []
        issueOptionsState.error = response?.errMessage
        showErrorMessage(response)
        return
      }

      issueOptionsState.data =
        response?.data?.map((item: string) => ({
          value: item,
          label: item
        })) || []
    } catch (error) {
      console.error('Failed to fetch issue options:', error)
      issueOptionsState.error = error
      issueOptionsState.data = []
    } finally {
      issueOptionsState.loading = false
      rxState.isLoading = false
    }
  }

  const setupForEdit = async (issueId: string) => {
    rxState.dialogMode = 'edit'
    rxState.fileList = []
    const success = await loadIssueDetail(issueId)
    if (success) {
      setFileListFromPath(form.value.imgPath)
    }
  }
  const validateForm = async () => {
    console.log(
      'validate',
      formRef.value?.validate((valid: any, fields: any) => {
        result = { valid, fields: null }
      })
    )

    if (!formRef.value) return { valid: false, fields: null }
    let result = { valid: false, fields: null }
    await formRef.value.validate((valid: any, fields: any) => {
      result = { valid, fields: null }
    })
    return result
  }
  const handleSave = async () => {
    const { valid } = await validateForm()

    if (!valid) return
    const fileListTemp = rxState.fileList
    if (fileListTemp.length === 0) {
      form.value.imgPath = ''
    }

    if (isAddMode.value && fileListTemp.length > 0 && fileListTemp[0].issueNumber !== Number(form.value.issue)) {
      const fileObj = fileListTemp[0]
      try {
        await handelCustomRequest({ file: fileObj.raw, fileList: fileListTemp })
      } catch {
        ElMessage.error('提交失败, 请重新上传图片')
        rxState.fileList = []
        return
      }
    }

    return await saveIssue()
  }
  const injectFormRef = (formRef: FormInstance) => {
    rxState.formRef = formRef
  }
  return {
    form,
    isLoading: computed(() => rxState.isLoading),
    isEditMode,
    isAddMode,
    isNewspaperCodeDisabled,
    placeholderText,
    issueOptionsState,
    initFormState,
    validateForm,
    resetForm,
    loadIssueDetail,
    saveIssue,
    loadIssueOptions,
    injectFormRef,
    setupForEdit,
    handleSave,
    setNewspaperOptions: (options: NewspaperOption[]) => {
      newspaperOptions.value = options
    }
  }
}
