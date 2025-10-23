<template>
  <el-dialog v-model="batchVisible" class="tabs-dialog" draggable overflow destroy-on-close :before-close="cansel">
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="批量上传" name="basic" class="m_tabs_pane" style="position: relative">
        <div class="percentage-modal" v-if="uploading">
          <el-progress type="circle" :percentage="uploadPercentage" />
        </div>
        <el-form :model="editForm" ref="editFormRef" :rules="issueFormRules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="彩种:" prop="gameType">
                <el-select
                  v-model="editForm.gameType"
                  placeholder="彩种"
                  v-on:change="handleGameTypeChange()"
                  :disabled="isLocked"
                >
                  <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="年份:" prop="year">
                <el-select v-model="editForm.year" placeholder="年份" :disabled="isLocked" @change="handleYearChange">
                  <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="期数:" prop="issue">
                <el-select
                  v-model="editForm.issue"
                  placeholder="请选择期数"
                  filterable
                  :loading="issueOptionsState.loading"
                  :disabled="isLocked || !editForm.gameType || !editForm.year"
                >
                  <el-option
                    v-for="item in issueOptionsState.data"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="彩色:">
                <el-radio-group v-model="editForm.isColorful">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="文件夹:">
                <el-row style="width: 100%">
                  <el-col :span="20">
                    <input
                      type="file"
                      @change="handleFileChange"
                      :webkitdirectory="isDirectory"
                      :directory="isDirectory"
                      :multiple="isDirectory"
                      style="display: none"
                      ref="folderInput"
                      @click=";($event.target as HTMLInputElement).value = ''"
                    />
                    <span v-if="selectedFolderName">{{ selectedFolderName }}</span>
                    <el-button v-else type="primary" @click="triggerFolderInput">选择</el-button>
                  </el-col>
                  <el-col :span="4" v-if="selectedFolderName">
                    <el-link type="primary" @click="triggerFolderInput">修改</el-link>
                    <!-- <el-link
                      type="primary"
                      @click="triggerUpload"
                    >
                      上传
                    </el-link> -->
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="推荐:">
                <el-radio-group v-model="editForm.isRecommended">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="热门:">
                <el-radio-group v-model="editForm.isHot">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="置顶:">
                <el-radio-group v-model="editForm.isTop">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="精选:">
                <el-radio-group v-model="editForm.isSelected">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="爆款:">
                <el-radio-group v-model="editForm.isBloom">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="评论:">
                <el-radio-group v-model="editForm.commentFlag">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="投票:">
                <el-radio-group v-model="editForm.voteFlag">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div style="display: flex; justify-content: space-between">
          <span style="flex: 1">
            <span v-if="fullCount > 0 && currentStage !== 'init'">
              共{{ fullCount }}个文件，已{{ currentStageText }} {{ successCount }} / {{ fullCount }} ,
              {{ currentStageText }}失败{{ failureCount }}个文件
            </span>
          </span>
          <span>
            <el-button @click="cansel">取消</el-button>
            <span v-if="selectedFolderName" style="margin-left: 10px">
              <el-button
                type="success"
                plain
                v-if="currentStage === 'init' || currentStage === 'validate'"
                :loading="isLoading"
                @click="triggerValidate"
              >
                校验
              </el-button>
              <el-button
                v-else-if="(currentStage === 'validated' && isSuccess) || currentStage === 'commit'"
                type="primary"
                :loading="isLoading"
                @click="handleSave"
              >
                提交
              </el-button>
            </span>
          </span>
        </div>
        <el-table
          ref="tableRef"
          :data="paginatedData"
          :loading="isLoading"
          stripe
          highlight-current-row
          style="flex: 1"
          @sort-change="sortResult"
        >
          <el-table-column label="序号" prop="seq" width="100" />
          <el-table-column label="文件名称" prop="fileName" />
          <el-table-column label="结果" :sortable="'custom'">
            <template #default="{ row }">
              <span :class="row.success ? 'success-text' : 'failure-text'" v-if="currentStage !== 'init'">
                {{ row.success ? '成功' : '失败' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="原因" prop="reason">
            <template #default="{ row }">
              <span :class="row.success ? 'success-text' : 'failure-text'">
                {{ row.success ? '' : row.reason }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <span v-if="!row.success && currentStage !== 'init'">
                <el-link
                  type="primary"
                  style="margin-right: 10px; text-decoration: underline"
                  @click="editSingleFile(row)"
                >
                  修改
                </el-link>
                <el-link type="primary" style="text-decoration: underline" @click="handleDelete(row)">删除</el-link>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" style="margin-bottom: 30px">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="total"
            layout="prev, pager, next, jumper, ->, sizes, total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { batchSave, batchVerify, getIssueListByParams } from '@/api/photoSys/issues'
import { addHttp, uploadSingle } from '@/api/system/upload'
import type { FileUploadRequestWithIssueNumber } from '@/api/system/upload/types'
import { sessionCache } from '@/hooks/useSession'
import { IndexedDBMap } from '@/stores/indexDB'
import { useModalsStore } from '@/stores/modalStore'
import { YearTypes } from '@/utils/dataFormat'
import showErrorMessage from '@/utils/showErrorMessage'
import { fetchGameTypes } from '@/utils/table'
import { type RxState, useIssueForm } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import type { IssueFormData } from '../IssueTypes/index'
enum EStorageType {
  S3 = 's3',
  R2 = 'r2'
}
interface IUploadRequestConfig {
  baseurl: string // 基础 URL
  contenttype: 'multipart/form-data' // 内容类型
}
const { VITE_PROXY_UPLOAD, VITE_NODE_ENV, VITE_STORY_TYPE } = webConfigApi

interface IssueFile {
  fileName: string
  uploaded: boolean
  success: boolean
  reason: string
  file: FileWithBinary
  targetId?: string
}
const props = defineProps({
  rxState: {
    type: Object as () => RxState<IssueFormData>,
    required: true
  }
})
const { loadIssueOptions, issueOptionsState } = useIssueForm(props.rxState)
const emit = defineEmits(['refresh'])
const isDirectory = ref(true)
const gameTypeList = ref()
const loadedMap = ref(new Map())
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
const currentStage = ref<'init' | 'validate' | 'validated' | 'commit'>('init')
const currentStageText = computed(() => {
  switch (currentStage.value) {
    case 'init':
      return '加载'
    case 'validate':
    case 'validated':
      return '校验'
    case 'commit':
      return '提交'
  }
})
const isLocked = ref(false)
const modalsStore = useModalsStore()
const fullTableList = ref<any[]>([])
const fullCount = computed(() => fullTableList.value.length)
const uploadedCount = computed(() => fullTableList.value.filter((row) => row.uploaded).length)
const successCount = computed(() => fullTableList.value.filter((row) => row.success).length)
const failureCount = computed(() => fullTableList.value.filter((row) => !row.success).length)
const isSuccess = computed(() => fullTableList.value.every((row) => row.success))
const batchVisible = computed(() => modalsStore.batchAddIssueModal.isVisible)
const manageSiteId = computed(() => modalsStore.batchAddIssueModal.modalData?.manageSiteId)
const editFormRef = ref()
const tableRef = ref()
const activeTab = ref('basic')
const initEditForm = () => {
  const temp = {
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
    fileName: '',
    readCount: 0,
    manageSiteId: manageSiteId.value
  }
  if (gameTypeList.value?.length > 0) {
    temp.gameType = gameTypeList.value[0]?.value || ''
  }
  return temp
}
const isLoading = ref(false)
const uploading = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const total = computed(() => fullTableList.value.length)
const uploadPercentage = computed(() => {
  const all = fullTableList.value.length
  if (all === 0) {
    return 0
  }
  const percent = fullTableList.value.filter((row) => row.uploaded).length / all
  return Math.round(percent * 100)
})
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullTableList.value.slice(start, end)
})
const editForm = reactive(initEditForm())
const selectedFolderName = ref<string>('')
const folderInput = ref<HTMLInputElement | null>(null)
const triggerFolderInput = async () => {
  isDirectory.value = true
  await nextTick()
  folderInput.value?.click()
  // currentStage.value = 'init'
}
const editSingleFile = async (selectedRow: any) => {
  isDirectory.value = false
  fullTableList.value.forEach((row) => {
    row.selected = row.seq === selectedRow.seq
  })
  await nextTick()
  folderInput.value?.click()
}
const sortResult: (data: { column: any; prop: string; order: any }) => void = (data) => {
  console.log(data)
  fullTableList.value = fullTableList.value
    .sort((a, b) => {
      if (data.order === 'descending') {
        return (a.success ? 1 : 0) - (b.success ? 1 : 0)
      } else if (data.order === 'ascending') {
        return (b.success ? 1 : 0) - (a.success ? 1 : 0)
      } else {
        return a.seq - b.seq
      }
    })
    .map((row, index) => ({
      ...row,
      order: data.order,
      seq: data.order ? row.seq : index + 1
    }))
}
const handleDelete = (selectedRow: any) => {
  fullTableList.value = fullTableList.value
    .filter((row) => row.seq !== selectedRow.seq)
    .map((row, index) => ({
      ...row,
      seq: row.order ? row.seq : index + 1
    }))
}
interface FileWithBinary extends File {
  binaryData?: ArrayBuffer
}
const resetPagination = () => {
  currentPage.value = 1
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  resetPagination()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const extractFolderName = (file: File): string => {
  const folderPath = file.webkitRelativePath.split('/')
  return folderPath.length > 0 ? folderPath[0] : ''
}

const isImageFile = (file: File): boolean => {
  return allowedImageTypes.includes(file.type)
}

const readFileAsBinary = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

const processFile: (file: FileWithBinary) => Promise<IssueFile | null> = async (file) => {
  if (!isImageFile(file)) {
    console.log(`Skipping non-image file: ${file.name}`)
    return null
  }

  try {
    file.binaryData = await readFileAsBinary(file)
    console.log(`Binary data for ${file.name} is ready`)
    return {
      fileName: file.name,
      uploaded: false,
      success: false,
      reason: '',
      file: file
    }
  } catch (error) {
    console.error(`Error reading file ${file.name}:`, error)
    return null
  }
}

const handleFileChange = async (event: Event) => {
  console.log('handleFileChange')
  tableRef.value.clearSort()
  const input = event.target as HTMLInputElement
  let inputFiles = input.files
  if (!isDirectory.value) {
    console.log(inputFiles)

    const files = Array.from(inputFiles as FileList) as FileWithBinary[]
    if (files.length === 0) {
      return
    }
    const fileName = files[0].name
    if (fullTableList.value.some((row) => row.fileName === fileName)) {
      ElMessage.warning('同名文件已存在')
      return
    }
    // const validationMap = await toValidFiles(
    //   files.filter((file) => isImageFile(file)).map((file) => file.name)
    // )
    // console.log(validationMap)
    const processedFiles: (IssueFile | null)[] = await Promise.all(files.map(processFile))
    const tableList = processedFiles
      .filter((file): file is IssueFile => file !== null)
      .map((file: IssueFile, index: number) => ({
        seq: index + 1,
        ...file
      }))
    fullTableList.value = fullTableList.value.map((row) => {
      if (row.selected) {
        const newRow = tableList.length > 0 ? tableList[0] : row
        return {
          ...row,
          ...newRow
        }
      }
      return row
    })
    if (currentStage.value !== 'init') {
      let validationMap = new Map()
      try {
        validationMap = await toValidFiles(
          fullTableList.value
            .filter((row) => isImageFile(row.file))
            .filter((row) => row.selected)
            .map((row) => row.fileName)
        )
        fullTableList.value = fullTableList.value.map((row) => {
          if (row.selected) {
            return {
              ...row,
              ...validationMap.get(row.fileName)
            }
          }
          return row
        })
        console.log(validationMap)
      } catch (error) {
        showErrorMessage(error)
      }
    }

    await nextTick()
    fullTableList.value = fullTableList.value.map((row) => {
      if (row.selected) {
        return {
          ...row,
          selected: false
        }
      }
      return row
    })

    input.value = ''
    return
  }

  if (input.files && input.files.length > 0) {
    fullTableList.value = []
    currentStage.value = 'init'
    const files = Array.from(input.files) as FileWithBinary[]
    selectedFolderName.value = extractFolderName(files[0])
    // const validationMap = await toValidFiles(
    //   files.filter((file) => isImageFile(file)).map((file) => file.name)
    // )

    // Process files and filter out nulls
    const processedFiles: (IssueFile | null)[] = await Promise.all(files.map(processFile))
    // const validFiles = await toValidFiles(processedFiles)
    fullTableList.value = processedFiles
      .filter((file): file is IssueFile => file !== null)
      .map((file: IssueFile, index: number) => ({
        seq: index + 1,
        ...file
        // ...validationMap.get(file.fileName)
      }))
    input.value = ''
  }
}
const toValidFiles = async (fileNames: string[]) => {
  const response: any = await batchVerify(
    {
      fileIdList: fileNames,
      gameType: editForm.gameType,
      year: editForm.year,
      issue: editForm.issue
    },
    manageSiteId.value
  )
  const validationMap = new Map((response.data as IssueFile[]).map((info) => [info.targetId, info]))

  return validationMap
}
const toCommitFiles = async () => {
  // const issueList = fullTableList.value.filter((row) => !loadedMap.value.has(row.fileName))
  const response: any = await batchSave({
    ...editForm,
    issueList: fullTableList.value.filter((row) => row.success)
  })
  if (response.success) {
    const commitedMap = new Map((response.data as IssueFile[]).map((info) => [info.targetId, info]))
    return commitedMap
  } else {
    return null
  }
}
const validateIssue = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入期数'))
  } else {
    const issueStr = value.toString()
    if (!/^\d{2,10}$/.test(issueStr)) {
      callback(new Error('期数必须为2-10位数字'))
    } else {
      callback()
    }
  }
}
const issueFormRules = reactive({
  year: [{ required: true, message: '请选择年份', trigger: 'blur' }],
  issue: [
    { required: true, message: '请选择期数', trigger: 'change' }
    // { type: 'number', message: '期数必须为数字', trigger: 'blur' },
    // { validator: validateIssue, trigger: 'blur' }
  ]
})
const destory = () => {
  modalsStore.hideModal('batchAddIssueModal')
  Object.assign(editForm, initEditForm())
  if (editFormRef.value) {
    editFormRef.value.clearValidate()
  }
}
const cansel = (done: () => void) => {
  console.log('before')

  if (fullCount.value === 0) {
    destory()
    done()
    return
  }
  ElMessageBox.confirm(`尚有未提交的文件，是否确认取消？`, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    showCancelButton: true
  }).then(
    () => {
      destory()
      done()
    },
    () => {
      console.log('cancel')
    }
  )
}
const handleFileUpload = async (row: any): Promise<void> => {
  const file = row.file
  try {
    if (VITE_NODE_ENV === 'development' && row.fileName === '01.jpg') {
      throw new Error('当前为开发环境，无法上传文件')
    }
    const formData: FileUploadRequestWithIssueNumber = {
      uploadTarget: file.name,
      file,
      storageType: VITE_STORY_TYPE as EStorageType,
      env: (VITE_NODE_ENV === 'development' ? 'dev' : 'prod') as Environment,
      fileType: 'img' as FileType,
      uploadFrom: 'newspaper/issue',
      storageStyle: 7,
      issueNumber: editForm.issue,
      manageSiteId: manageSiteId.value
    }

    const config: IUploadRequestConfig = {
      baseurl: VITE_PROXY_UPLOAD,
      contenttype: 'multipart/form-data'
    }
    let response: any

    console.log('upload src/views/PhotosSys/newsPaperIssue/batchAddIssues/index.vue')
    // @ts-ignore
    response = await uploadSingle(formData, config)
    await logFileUpload(response, file)
    // if (!row.uploaded) {
    //   console.log('uploadSingle', response)
    //   console.log(row)
    // } else {
    //   const imgPath = loadedMap.value.get(row.fileName)
    //   response = {
    //     data: {
    //       path: imgPath
    //     }
    //   }
    //   console.log('File already uploaded:', row.fileName)
    // }

    const imgPath = response.data.path
    row.imgPath = imgPath
  } catch (error) {
    console.error('File upload failed:', error)
    throw error
  }
}
const logFileUpload = async (uploadResponse: any, file: File): Promise<void> => {
  if (!uploadResponse?.data?.path) {
    throw new Error('Invalid upload response')
  }

  try {
    await addHttp({
      storageStyle: 6,
      fileType: 'img' as FileType,
      uploadFrom: uploadResponse.data.path,
      uploadTarget: file.name,
      storageType: VITE_STORY_TYPE as EStorageType,
      uploadUser: sessionCache.getCache('userID'),
      biz: 'upload',
      fileSize: file.size?.toString() ?? 0,
      env: (VITE_NODE_ENV === 'development' ? 'dev' : 'prod') as Environment,
      // @ts-ignore
      manageSiteId: manageSiteId.value
    })

    // ElMessage.success('上传成功')
  } catch (error) {
    console.error('Upload logging failed:', error)
    showErrorMessage(error)
  }
}
const triggerValidate = async () => {
  const valid = await editFormRef.value.validate()
  if (!valid) {
    return
  }
  if (!isLocked.value) {
    try {
      await ElMessageBox.confirm(`是否确认使用当前彩种，年份和期刊进行校验？（确认后将不可变更彩种，年份和期数）`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: true
      })
      // User confirmed, proceed with validation
      isLocked.value = true
    } catch (err) {
      // User cancelled or dialog was closed
      return
    }
  }
  currentStage.value = 'validate'
  tableRef.value.clearSort()
  let validationMap = new Map()
  try {
    validationMap = await toValidFiles(
      fullTableList.value.filter((row) => isImageFile(row.file)).map((row) => row.fileName)
    )
    console.log(validationMap)
  } catch (error) {
    showErrorMessage(error)
  }

  await nextTick()
  fullTableList.value = fullTableList.value.map((row, index) => ({
    seq: index + 1,
    ...row,
    ...validationMap?.get(row.fileName)
  }))
  if (fullTableList.value.every((row) => row.success)) {
    currentStage.value = 'validated'
    ElMessage.success('校验成功')
  }
}
const triggerUpload = async () => {
  uploading.value = true
  tableRef.value.clearSort()
  await nextTick()
  fullTableList.value = fullTableList.value.map((row, index) => ({
    ...row,
    seq: index + 1
  }))
  try {
    // Validate form before upload
    // await editFormRef.value.validate()

    await uploadTableListFile()
  } catch (error) {
    showErrorMessage(error)
  } finally {
    uploading.value = false
  }
}
const uploadTableListFile = async () => {
  // fullTableList.value = fullTableList.value.map((row) => {
  //   return {
  //     ...row,
  //     uploaded: false,
  //     success: false
  //   }
  // })
  for (const row of fullTableList.value) {
    if (row.uploaded) continue // Skip already uploaded files

    try {
      await handleFileUpload(row)
      row.uploaded = true
      row.success = true
      row.reason = ''
    } catch (error) {
      row.success = false
      row.reason = '上传失败'
      console.error(`Failed to upload ${row.fileName}:`, error)
    }
  }
}
const handleSave = async () => {
  if (!isSuccess.value) {
    ElMessage.warning('请先处理失败文件')
    return
  }
  if (fullCount.value === 0) {
    ElMessage.warning('请先添加文件')
    return
  }
  const valid = await editFormRef.value.validate()
  if (!valid) {
    return
  }
  await triggerUpload()
  await nextTick()

  tableRef.value.clearSort()
  currentStage.value = 'commit'
  const commitedMap = await toCommitFiles()
  console.log(commitedMap)
  if (!commitedMap) {
    ElMessage.error('提交失败')
    return
  }
  const listForCache = fullTableList.value
    .filter((file): file is IssueFile => file !== null)
    .filter((row) => commitedMap.has(row.fileName))
    .map((file: IssueFile, index: number) => ({
      ...file,
      ...commitedMap.get(file.fileName)
    }))
    .filter((row) => row.success)

  fullTableList.value = fullTableList.value
    .filter((file): file is IssueFile => file !== null)
    .map((file: IssueFile, index: number) => ({
      seq: index + 1,
      ...file,
      ...commitedMap.get(file.fileName)
    }))
    .filter((row) => !row.success)
    .map((row, index) => ({
      ...row,
      seq: index + 1
    }))
  console.log(listForCache)
  const successfulItems = new Map(
    // @ts-ignore
    listForCache.filter((item) => item.success).map((item) => [item.fileName, item.imgPath])
  )
  if (successfulItems.size > 0) {
    await IndexedDBMap.save(successfulItems)
    await nextTick()
    loadedMap.value = await IndexedDBMap.load<number>()
  }
  if (fullCount.value === 0) {
    ElMessage.success('提交成功')
    cansel(() => {
      emit('refresh')
    })
  }
}
const handleGameTypeChange = async () => {
  await loadIssueOptions(issueQueryParams.value.gameType, issueQueryParams.value.year)
  editForm.issue = issueOptionsState.data[0]?.value || ''
}
const handleYearChange = async () => {
  await loadIssueOptions(issueQueryParams.value.gameType, issueQueryParams.value.year)
  editForm.issue = issueOptionsState.data[0]?.value || ''
}
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  Object.assign(editForm, initEditForm())
  // Save and load using the IndexedDBMap with generic support
  // await IndexedDBMap.save(myMap) // Save the map

  loadedMap.value = await IndexedDBMap.load<number>() // Specify the type as number
  console.log('Loaded Map from IndexedDB:', loadedMap.value) // Output the loaded map
  await handleYearChange()
})

const issueQueryParams = computed(() => ({
  gameType: editForm.gameType,
  year: editForm.year
}))

watch(
  issueQueryParams,
  async (newParams) => {
    await loadIssueOptions(newParams.gameType, newParams.year)
  },
  { immediate: true } // Fetch on component mount
)
</script>
<style lang="less">
.percentage-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: rgba(200, 201, 204, 0.4);
  height: 100%;
  width: 100%;
  z-index: 9999;
}
</style>
