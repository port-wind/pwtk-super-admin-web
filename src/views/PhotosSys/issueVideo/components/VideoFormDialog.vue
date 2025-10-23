<template>
  <el-dialog
    draggable
    overflow
    destroy-on-close
    :model-value="true"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
  >
    <el-tabs model-value="mainTab" class="m_tabs">
      <el-tab-pane class="m_tabs_pane" :label="videoData ? '编辑视频' : '创建视频'" name="mainTab" :stretch="true">
        <div class="video-form" v-loading="isLoading">
          <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
            <el-row>
              <el-col :span="8">
                <!-- Video Upload -->
                <div class="input-with-button" v-if="form.wayToUpload === 'byLocal'">
                  <!-- Show video preview when available but not when uploading -->
                  <nativeVideoViewer
                    :video-source="videoPreviewUrl || form.videoPath"
                    v-if="(videoPreviewUrl || form.videoPath) && !isUploading"
                  />

                  <!-- Show DeferredVideoUploader when no file selected OR when uploading -->
                  <GenericVideoUploader
                    ref="videoUploaderRef"
                    :uploadOptions="{
                      fileFieldName: 'video',
                      params: { uploaderId: '82', storageStyle: 1 },
                      path: 'game/picture'
                    }"
                    :showOperation="true"
                    :video-info="form.videoInfo"
                    :style="{
                      display: (!videoPreviewUrl && !form.videoPath) || isUploading ? 'flex' : 'none'
                    }"
                    @file-selected="handleFileSelected"
                    @preview-ready="handlePreviewReady"
                    @upload-success="handleUploadSuccess"
                    @upload-error="handleUploadError"
                  />
                </div>
                <div class="input-with-button" v-else>
                  <nativeVideoViewer :video-source="videoPreviewUrl || form.videoPath" />
                </div>
                <div
                  v-if="(videoPreviewUrl || form.videoPath) && !isUploading && form.wayToUpload === 'byLocal'"
                  style="text-align: center; margin-top: 10px"
                >
                  <el-button type="danger" @click="resetVideo">重新上传</el-button>
                </div>
              </el-col>
              <el-col :span="16">
                <!-- Video Author -->
                <el-row>
                  <el-col :span="18">
                    <el-form-item label="视频名称:" prop="videoTitle">
                      <el-input v-model="form.videoTitle" placeholder="请输入视频名称" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item label="彩种:" prop="gameType">
                      <GameTypeList
                        v-model="form.gameType"
                        :withDefault="true"
                        @onSelect="($event) => handleGameTypeChange($event?.gameType)"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="18">
                    <el-form-item label="年份:" prop="year">
                      <el-select v-model="form.year" placeholder="年份" @change="handleYearChange">
                        <el-option
                          v-for="item in yearOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item label="期数:" prop="issue">
                      <el-select
                        v-model="form.issue"
                        placeholder="请选择期数"
                        filterable
                        :disabled="!form.gameType || !form.year"
                      >
                        <el-option
                          v-for="item in issueOptionsState.data"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                      <!-- <p v-else>{{ form.issue }}</p> -->
                    </el-form-item>
                  </el-col>
                  <!-- 视频上传方式 -->
                  <el-col :span="18">
                    <el-form-item label="上传方式:" prop="wayToUpload">
                      <el-radio-group v-model="form.wayToUpload" @change="handleWayToUploadChange">
                        <el-radio value="byLocal">本地</el-radio>
                        <el-radio value="byUrl">链接</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="15" v-if="form.wayToUpload === 'byUrl'">
                    <el-form-item label="上传地址:" prop="uploadUrl">
                      <el-input v-model="form.uploadUrl" placeholder="请输入上传地址" />
                      <!-- <p v-else>{{ form.issue }}</p> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" v-if="form.wayToUpload === 'byUrl'"></el-col>
                  <el-col :span="2" v-if="form.wayToUpload === 'byUrl'">
                    <el-button type="primary" @click="handleUploadUrl">上传</el-button>
                  </el-col>
                  <!-- <el-col :span="14" v-if="form.wayToUpload === 'byLocal'">
                    <el-form-item label="视频图示:" prop="videoPicture">
                      <FileImageUpload
                        v-model="form.videoPicture"
                        type="info"
                        :upload-from="EUploadFrom.GAME_PICTURE"
                        :storageStyle="1"
                      />
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </el-col>
            </el-row>
          </el-form>
          <section class="button-row">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</el-button>
          </section>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type { VideoInfo } from '@/global_types/video-upload.ts'
import { useIssueOptions } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueOpLogic.ts'
import { YearTypes } from '@/utils/dataFormat'
import { uploadUrlToGetPath, createIssueVideo, getIssueVideoDetail } from '@/api/photoSys/issueVideo/index'

const props = defineProps<{
  videoData: any
}>()
const emit = defineEmits(['close', 'refresh'])
const { issueOptionsState, loadIssueOptions } = useIssueOptions()
const yearOptions = ref<any[]>(YearTypes)
// eslint-disable-next-line no-undef
const { VITE_CDN_URL } = webConfigApi
const formRef = ref<FormInstance>()
const videoUploaderRef = ref<InstanceType<typeof DeferredVideoUploader> | null>(null)
const isLoading = ref(false)
const isSubmitting = ref(false)

// Video preview state
const videoPreviewUrl = ref<string>('')
const selectedVideoFile = ref<File | null>(null)

// Track if upload is in progress to show uploader during upload
const isUploading = computed(() => {
  return videoUploaderRef.value?.isUploading || false
})

// Form data structure
interface VideoForm {
  id?: string
  description: string
  tags: string[]
  videoPath: string
  videoInfo?: VideoInfo
  ifActive?: string
  gameType?: string
  year?: string
  issue?: string
  videoTitle: string
  uploadUrl: string
  wayToUpload: 'byLocal' | 'byUrl'
  videoPicture: string
}

const form = reactive<VideoForm>({
  id: '',
  videoTitle: '',
  description: '',
  tags: [],
  videoPath: '',
  ifActive: 'n',
  gameType: '',
  year: '2023',
  issue: '',
  uploadUrl: '',
  wayToUpload: 'byLocal',
  videoPicture: ''
})
const formRules = reactive({
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  videoTitle: [{ required: true, message: '请输入视频标题', trigger: 'change' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }],
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: true, message: '请选择期数', trigger: 'change' }],
  description: [{ required: true, message: '请输入视频简介', trigger: 'change' }]
})

// Close modal
const closeTabs = () => {
  emit('close')
}
const handleUploadUrl = async () => {
  try {
    isLoading.value = true
    const res = await uploadUrlToGetPath({
      videoUrl: form.uploadUrl,
      uploadType: 'v'
    })
    if (res.success && res.data) {
      form.videoPath = VITE_CDN_URL + res.data.videoPath
    }
  } catch (error) {
    console.error('Upload URL error:', error)
    ElMessage.error('上传地址获取失败')
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  // Clean up blob URL if exists
  if (videoPreviewUrl.value && videoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }
  emit('close')
}

// Reset video selection
const resetVideo = () => {
  // Clean up blob URL if exists
  if (videoPreviewUrl.value && videoPreviewUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoPreviewUrl.value)
  }

  videoPreviewUrl.value = ''
  selectedVideoFile.value = null
  form.videoPath = ''

  // Reset the uploader component
  if (videoUploaderRef.value) {
    videoUploaderRef.value.reset()
  }
}

const handleWayToUploadChange = () => {
  console.log('form.wayToUpload', form.wayToUpload)
  console.log('form.videoPath', form.videoPath)
  console.log('form.uploadUrl', form.uploadUrl)

  if (form.videoPath || form.uploadUrl) {
    ElMessageBox.confirm('确定要切换上传方式吗？已上传的视频和截图将丢失', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        form.videoPath = ''
        form.uploadUrl = ''
        form.videoPicture = ''
        videoUploaderRef.value?.reset()
      })
      .catch(() => {
        form.wayToUpload = form.wayToUpload === 'byUrl' ? 'byLocal' : 'byUrl'
      })
  }
}

// Submit form with upload
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    // Check if we have a selected file that needs uploading
    if (!form.videoPath) {
      ElMessage.error('请选择视频')
      return
    }
    if (form.videoPath) {
      form.videoPath = form.videoPath.replace(VITE_CDN_URL, '')
    }

    isSubmitting.value = true

    try {
      const videoData: any = {
        ...form
      }
      console.log('Creating video with data:', videoData)
      const result = await createIssueVideo(videoData)

      if (result.success && result.data) {
        ElMessage.success('视频创建成功')
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.errMessage || '视频创建失败')
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      ElMessage.error(error.message || '提交失败')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
    isSubmitting.value = false
  }
}

// Handle file selection for preview
const handleFileSelected = (file: File | null) => {
  console.log('File selected:', file)
  selectedVideoFile.value = file

  if (!file) {
    videoPreviewUrl.value = ''
    form.videoPath = ''
  }
}

// Handle preview URL creation
const handlePreviewReady = (previewUrl: string) => {
  console.log('Preview ready:', previewUrl)
  videoPreviewUrl.value = previewUrl
}

// Handle upload success (for backward compatibility)
const handleUploadSuccess = (response: any) => {
  console.log('Upload success:', response)
  if (response.data && response.data.path) {
    form.videoPath = response.data.path
  }
}

// Handle upload error
const handleUploadError = (error: any) => {
  console.error('Upload error:', error)
  ElMessage.error(`上传失败: ${error.message || error}`)
}
const handleGameTypeChange = async (gt: string | undefined) => {
  console.log('handleGameTypeChange', gt)
  form.issue = ''
  await loadIssueOptions({ gameType: gt!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const handleYearChange = async () => {
  console.log('handleYearChange', form.year)
  await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
  form.issue = issueOptionsState.data[0]?.value || ''
}
const loadIssueVideo = async (id: string) => {
  try {
    const res = await getIssueVideoDetail({ id })
    if (res.success && res.data) {
      form.id = res.data.id.toString()
      form.videoTitle = res.data.videoTitle
      form.gameType = res.data.gameType.toString()
      form.year = res.data.year.toString()
      form.issue = res.data.issue.toString()
      form.videoPath = VITE_CDN_URL + res.data.videoPath
      form.wayToUpload = 'byLocal'
    }
  } catch (error) {
    console.error('Load issue video error:', error)
  }
}
// Initialize component
onMounted(async () => {
  console.log('Initializing component...')
  if (props.videoData && props.videoData.id) {
    loadIssueVideo(props.videoData.id)
    await nextTick()
    await loadIssueOptions({ gameType: form.gameType!, year: form.year! })
    return
  }
  // Load initial data
  form.year = yearOptions.value[0].value
  await nextTick()
  await handleYearChange()
  // Debug: Check if videoUploaderRef is available
  console.log('videoUploaderRef after mount:', videoUploaderRef.value)
})
</script>

<style scoped lang="scss">
.video-form {
  padding: 10px 10px 0 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .input-with-button {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-height: 500px;

    .el-input {
      flex: 1;
    }
    .video-player {
      flex: 1;
    }
  }
}

.button-row {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
