<!-- 模版管理弹窗 -->
<template>
  <el-tab-pane label="模版信息" name="tab1" class="m_tabs_pane" :lazy="true">
    <el-form :model="addForm" ref="formRef" :rules="rules" class="dialog-form">
      <el-row justify="center" class="form-row">
        <el-col :span="8">
          <el-form-item label="logo:" prop="logo">
            <section class="UploadSection">
              <mUpload
                :show-file-list="false"
                list-type="picture-card"
                :useDefault="true"
                :uploadOption="uploadDataHead"
                mute
                :file-list="fileList"
                :before-upload="beforeUpload"
                @on-success="(val) => handleSuccessOfAttachment(val, 't')"
                @on-change="handleChange"
                @on-remove="handleRemove"
                @on-exceed="handleExceed"
              >
                <template #uploadArea>
                  <el-icon>
                    <Plus />
                  </el-icon>
                </template>
                <template #file="{ file }">
                  <EnhancedFileUpload :key="file.uid" :file="file" @remove="handleRemove" />
                </template>
              </mUpload>
              <el-dialog class="dialog-image" v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
              <div class="uploadedFile" v-if="fileList.length === 1">
                <ul class="babaul">
                  <li v-for="file in fileList" :key="file.uid" class="babali">
                    <img :src="file.url" alt="" class="uploaded-image" />
                    <div class="overlay">
                      <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
                        <zoom-in />
                      </el-icon>
                      <el-icon class="large-icon" @click="handleDelete(file, 'logo')">
                        <Delete />
                      </el-icon>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </el-form-item>
          <el-form-item label="模版ID:" prop="templateId">
            <el-input
              v-if="!distinguish"
              v-model.trim="addForm.templateId"
              :disabled="distinguish"
              placeholder="8位长度代码"
              maxlength="8"
              autocomplete="off"
            />
            <p v-else>
              <span>
                {{ addForm.templateId }}
              </span>
              <copy :content="addForm.templateId"></copy>
            </p>
          </el-form-item>
          <el-form-item label="模版名称:" prop="templateName">
            <el-input v-model.trim="addForm.templateName" placeholder="模版名称" maxlength="20" autocomplete="off" />
          </el-form-item>
          <el-form-item label="引用的草图代码:" prop="sketchCode">
            <el-select v-model="addForm.sketchCode" placeholder="请选择模版草图代码">
              <el-option
                v-for="(item, index) in optionsAllSketch"
                :key="index"
                :label="item.sketchName + ' - ' + item.sketchCode"
                :value="item.sketchCode"
              />
            </el-select>
          </el-form-item>
          <template v-if="distinguish">
            <el-form-item label="引用的系统模版:" prop="sysTemplateRef">
              <el-select
                v-model="addForm.sysTemplateRef"
                :disabled="addForm.isSysTemplate == 'y' ? true : false"
                placeholder="请选择系统模版"
                clearable
              >
                <el-option
                  v-for="(item, index) in optionsAllSysTemplateList"
                  :key="index"
                  :label="item.templateName + ' - ' + item.templateId"
                  :value="item.templateId"
                  :value-on-clear="() => ''"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="引用的系统模版:" prop="sysTemplateRef">
              <el-select v-model="addForm.sysTemplateRef" placeholder="请选择系统模版" clearable>
                <el-option
                  v-for="(item, index) in optionsAllSysTemplateList"
                  :key="index"
                  :label="item.templateName + ' - ' + item.templateId"
                  :value="item.templateId"
                  :value-on-clear="() => ''"
                />
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="用户ID:" prop="ownerUserId">
            <el-autocomplete
              clearable
              v-model="addForm.ownerUserId"
              :fetch-suggestions="querySearchUserLogin"
              placeholder="所属用户 | ID"
              @select="handleSelectUserId"
              @blur="handleBlurOwnerUserId"
              :trigger-on-focus="false"
            >
              <template #default="{ item }">
                <div class="autocomplete-item">
                  <div>{{ item.loginId }}-{{ item.userId }}</div>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="icon:" prop="icon">
            <section class="UploadSection">
              <mUpload
                :show-file-list="false"
                list-type="picture-card"
                :useDefault="true"
                :uploadOption="uploadDataHead"
                mute
                :file-list="fileList2"
                :before-upload="beforeUpload2"
                @on-success="(val) => handleSuccessOfAttachment2(val, 't')"
                @on-change="handleChange2"
                @on-remove="handleRemove"
                @on-exceed="handleExceed"
              >
                <template #uploadArea>
                  <el-icon>
                    <Plus />
                  </el-icon>
                </template>
                <template #file="{ file }">
                  <EnhancedFileUpload :key="file.uid" :file="file" @remove="handleRemove" />
                </template>
              </mUpload>
              <div class="uploadedFile" v-if="fileList2.length === 1">
                <ul class="babaul">
                  <li v-for="file in fileList2" :key="file.uid" class="babali">
                    <img :src="file.url" alt="" class="uploaded-image" />
                    <div class="overlay">
                      <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
                        <zoom-in />
                      </el-icon>
                      <el-icon class="large-icon" @click="handleDelete(file, 'icon')">
                        <Delete />
                      </el-icon>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </el-form-item>
          <el-form-item label="主题:" prop="theme">
            <el-input v-model.trim="addForm.theme" maxlength="8" placeholder="主题" autocomplete="off" />
          </el-form-item>
          <el-form-item label="支持的登录方式:" prop="loginStyle">
            <el-select v-model="addForm.loginStyle" multiple placeholder="请选择支持的登录方式">
              <el-option
                v-for="item in optionsSupportLogin"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="第三方登录方式:" prop="thirdLoginStyle">
            <el-select v-model="addForm.thirdLoginStyle" multiple placeholder="请选择第三方登录方式">
              <el-option
                v-for="item in optionsSupportLogin"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态:" prop="templateStatus">
            <el-radio-group v-model="addForm.templateStatus" placeholder="请选择模版状态">
              <el-radio value="y">启用</el-radio>
              <el-radio value="m">维护</el-radio>
              <el-radio value="n">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="distinguish" label="创建时间:" prop="createTime">
            {{ unitFormatDate(addForm?.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="form-col-single">
        <el-form-item label="初始化代码:" prop="statsCodeInit">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="初始化代码"
            :rows="2"
            v-model="addForm.statsCodeInit"
            maxlength="512"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="统计代码链接:" prop="statsCodeJsUrl">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="代码链接"
            :rows="2"
            v-model="addForm.statsCodeJsUrl"
            maxlength="512"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="CDN地址:" prop="cdnUrl">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="CDN地址"
            :rows="2"
            v-model="addForm.cdnUrl"
            maxlength="255"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="客服代码:" prop="onlineServiceCode">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="客服代码"
            :rows="2"
            v-model="addForm.onlineServiceCode"
            maxlength="512"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="下载APP链接:" prop="appDownloadUrl">
          <el-input
            clearable
            :autosize="{ minRows: 1, maxRows: 6 }"
            type="textarea"
            v-model="addForm.appDownloadUrl"
            :rows="4"
            maxlength="225"
            show-word-limit
            resize="vertical"
            placeholder=""
          />
        </el-form-item>
        <el-form-item label="备注:" prop="memo">
          <el-input
            type="textarea"
            show-word-limit
            placeholder="备注"
            maxlength="255"
            :rows="2"
            v-model="addForm.memo"
            autocomplete="off"
          />
        </el-form-item>
      </div>
    </el-form>

    <div class="button-row" v-if="canHandleSubmit">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" :loading="isLoading2" @click="submitInfo(formRef)">提交</el-button>
    </div>
  </el-tab-pane>
  <TemplatePath :template-id="templateId" v-if="distinguish" :template-name="templateName" />
  <SketchRef v-if="distinguish" :sketch-code="addForm.sketchCode" ref="sketchRef" />
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { unitFormatDate } from '@/utils/dateFormat/index'
import TemplatePath from '@/views/Site/templateManagement/components/templatePath.vue'
const sketchRef = ref(null)
import SketchRef from '@/views/Site/templateManagement/components/sketchRef.vue'
import {
  reqTemplateCreate,
  reqTemplateInfoByTemplateId,
  reqTemplateEdit,
  reqGetALLSketchList,
  reqIsTemplateIdExit,
  reqIsTemplateNameExit,
  reqSysTemplateList,
  getRefWebsiteConfig
} from '@/api/site/index'

import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import { optionsSupportLogin } from '@/const/options'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqUserList } from '@/api/user/index'
import EnhancedFileUpload from '@/views/Bbs/bbsPostContentManagement/enhancedFileUpload.vue'
import mUpload from '@/components/mUpload/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { FileType } from '@/api/system/upload/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const fileList = ref<any[]>([]) // 定义 fileList
const initPostInfo = () => ({
  manageSiteId: '',
  postId: '',
  forumId: '',
  postContent: '',
  postTime: null,
  postUserId: '',
  enableAnonymous: 'y',
  postGameRef: '',
  postGametypeRef: '',
  postStatus: 'y',
  hasAttachment: 'n',
  viewFlag: 'a',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isBloom: 'n',
  title: ''
})
//附件相关
const attachmentData = ref<any[]>([])
const isDisabled = ref(true)
const dialogThirdFormData = ref()
const attachmentFormMode = ref<string>('add')
const attachmentForm = ref()
const postInfo = ref(initPostInfo())
const postId = ref()
const activeTab = ref('template') //tab切换第一条
const emit = defineEmits<{
  closeButton: []
  cancel: [isNeedRefresh: boolean]
  searchButton: []
  requestGrandpa: []
}>()

let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
const fileList2 = ref<any[]>([])
//附件页码
const attachmentCurrentPage = ref(1)
const isWebDisabled = ref<boolean>(true)
const attachmentPageSize = ref(15)
const attachmentTotal = ref(0)
const isLoading = ref(false)
const modalsStore = useModalsStore()
const templateId = computed(() => modalsStore.templateInfoModal.modalData?.templateId || {})
const sketchCode = computed(() => modalsStore.templateInfoModal.modalData?.sketchCode || '')
const templateName = computed(() => modalsStore.templateInfoModal.modalData?.templateName || '')
const canHandleSubmit = computed(() => {
  return modalsStore.templateInfoModal.modalData?.canHandleSubmit || false
})
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  addForm.value.ownerUserId = item.userId
  isWebDisabled.value = false
}
let handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
//上传相关
const fileType = ref()
const computedPostId = computed(() => postInfo.value?.postId || '')
let uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
const props = defineProps({
  formInfo: {
    type: Object
  }
})
//附件初始化获取数据
const fetchAttachmentData = async () => {
  let params = {
    page: attachmentCurrentPage.value,
    size: attachmentPageSize.value,
    forumPostId: postInfo.value.postId
  }
  isLoading.value = true
  try {
    const response: any = await reqAttachmentHttp(params)
    if (response.success) {
      attachmentData.value = response.data.list
      attachmentTotal.value = Number(response.data.total)
    } else {
      attachmentData.value = []
      attachmentTotal.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const handleChange = (first, second) => {
  const { file } = first
  fileList.value = [file]
}
let ownerUserIdValid: boolean = true
const handleBlurOwnerUserId = (event: any) => {
  if (backUpOwnerUserIdList.some((item) => item === addForm.value.ownerUserId)) {
    ownerUserIdValid = true
  } else if (
    event.target.value !== '' &&
    !backUpOwnerUserIdList.some((item) => item === event.target.value) &&
    addForm.value.ownerUserId != originalOwnerUserId
  ) {
    ownerUserIdValid = false
    ElMessage.error('该用户ID不存在!')
  } else if (event.target.value == '') {
    ownerUserIdValid = true
  } else if (addForm.value.ownerUserId == '' || addForm.value.ownerUserId == originalOwnerUserId) {
    ownerUserIdValid = true
  } else {
    ownerUserIdValid = false
  }
}
const handleChange2 = (first, second) => {
  const { file } = first
  fileList2.value = [file]
}
interface MimeTypeMapping {
  [mimeType: string]: {
    uploadType: string
    fileType: string
  }
}
interface UploadData {
  fileType: string
  uploadFrom: string
  storageStyle: number
}
interface UploadResult {
  uploadData: UploadData
  fileType: string
}
const defaultMimeTypeMappings: MimeTypeMapping = {
  'image/jpeg': { uploadType: 'img', fileType: 'p' },
  'image/png': { uploadType: 'img', fileType: 'p' },
  'image/gif': { uploadType: 'img', fileType: 'p' },
  'image/svg+xml': { uploadType: 'img', fileType: 'p' },
  'text/plain': { uploadType: 'ico', fileType: 'f' },
  'application/pdf': { uploadType: 'ico', fileType: 'f' },
  'application/msword': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.ms-excel': { uploadType: 'ico', fileType: 'f' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    uploadType: 'ico',
    fileType: 'f'
  },
  'application/vnd.android.package-archive': { uploadType: 'file', fileType: 'a' },
  'application/octet-stream': { uploadType: 'file', fileType: 'e' },
  'video/mp4': { uploadType: 'video', fileType: 'v' },
  'video/webm': { uploadType: 'video', fileType: 'v' },
  'video/ogg': { uploadType: 'video', fileType: 'v' },
  'audio/mpeg': { uploadType: 'video', fileType: 's' },
  'audio/wav': { uploadType: 'video', fileType: 's' },
  'audio/ogg': { uploadType: 'video', fileType: 's' }
}
const changeUploadDataWithCustom = (
  mimeType: string,
  attachmentId: string,
  customMimeTypeMappings: Partial<MimeTypeMapping> = {},
  basePath: string = 'wm/template/logo'
): UploadResult => {
  const mergedMappings: MimeTypeMapping = {
    ...defaultMimeTypeMappings,
    ...(customMimeTypeMappings as MimeTypeMapping)
  }
  const mapping = mergedMappings[mimeType]
  if (mapping) {
    return {
      uploadData: {
        fileType: mapping.uploadType,
        // uploadFrom: `${basePath}/${attachmentId}`,
        uploadFrom: `${basePath}`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }
  const generalType = mimeType.split('/')[0]
  const generalMapping = Object.entries(mergedMappings).find(([key]) => key.startsWith(`${generalType}/`))

  if (generalMapping) {
    const [, mapping] = generalMapping
    return {
      uploadData: {
        fileType: mapping.uploadType,
        uploadFrom: `${basePath}/${attachmentId}`,
        storageStyle: 6
      },
      fileType: mapping.fileType
    }
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`)
}
const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  addForm.value.logo = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '', {}, 'wm/template/logo')
  console.log('result', result)

  uploadData.value = result.uploadData
  fileType.value = result.fileType
  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addAttachmentHttp(params)
    if (response.success) {
      ElMessage.success('上传成功')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const handleSuccessOfAttachment2 = async (val, prefixPostfixFlag) => {
  addForm.value.icon = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '', {}, 'wm/template/icon')
  uploadData.value = result.uploadData
  fileType.value = result.fileType
  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: postInfo.value.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addAttachmentHttp(params)
    if (response.success) {
      ElMessage.success('上传成功')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const initForm = (): ITemplateCreateQueryParams => ({
  manageSiteId: '',
  icon: '',
  logo: '',
  templateId: '',
  templateName: '',
  sketchCode: '',
  sysTemplateRef: '',
  isSysTemplate: 'n',
  ownerUesrName: '',
  ownerUserId: '',
  onlineServiceCode: '',
  theme: '',
  loginStyle: [],
  thirdLoginStyle: [],
  memo: '',
  templateStatus: 'y',
  statsCodeJsUrl: '',
  statsCodeInit: '',
  cdnUrl: ''
})

const distinguish = computed(() => {
  return modalsStore.templateInfoModal?.modalData?.showOtherTabs || false
})
const isLoading2 = ref(false)
const formRef: any = ref()
const addForm = ref<ITemplateCreateQueryParams>(initForm())
const optionsAllSketch: any = ref([])
const optionsAllSysTemplateList: any = ref([])

Object.assign(addForm.value, props.formInfo)
const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = /^[A-Za-z0-9-_]+$/
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}
let beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/template/logo').uploadData
}
let beforeUpload2 = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/template/icon').uploadData
}
const checkIsTemplateId = async (rule: any, value: any, callback: any) => {
  if (distinguish.value) {
    callback()
  } else {
    let templateId = addForm.value.templateId
    const query: IIsTemplateIdExitQueryParams = {
      templateId: templateId,
      manageSiteId: manageSite.manageSiteId
    }
    let res: any = await reqIsTemplateIdExit(query)
    if (res.data) {
      callback(new Error('模版ID已经存在'))
    } else {
      callback()
    }
  }
}

const checkIsTemplateName = async (rule: any, value: any, callback: any) => {
  let templateId = ''
  let templateName = ''
  if (distinguish.value) {
    templateId = addForm.value.templateId
    templateName = addForm.value.templateName
  } else {
    templateId = ''
    templateName = addForm.value.templateName
  }
  const query: IIsTemplateNameExitQueryParams = {
    templateId: templateId,
    templateName: templateName,
    manageSiteId: manageSite.manageSiteId
  }
  let res: any = await reqIsTemplateNameExit(query)

  if (res.data.length != 0) {
    callback(new Error('模版名称已经存在'))
  } else {
    callback()
  }
}

const rulesAddFrom = ref({
  appDownloadUrl: [
    {
      required: false,
      message: '下载链接不能为空',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!checkIsUrlOrNot(value) && value) {
          callback(new Error('请输入类似https://www.google.com/的URL！'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  templateId: [
    { required: true, message: '草图编码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur', message: '英文,数字,符号-,符号_组成的值' },
    { validator: checkIsTemplateId, trigger: 'blur' }
  ],
  ownerUserId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
  sketchCode: [{ required: true, message: '请选择草图代码', trigger: 'blur' }],
  templateName: [
    { required: true, message: '模版名称不能为空', trigger: 'blur' },
    { validator: checkIsTemplateName, trigger: 'blur' }
  ],
  statsCodeInit: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符', trigger: 'blur' }],
  statsCodeJsUrl: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符', trigger: 'blur' }]
})
const rulesEditFrom = ref({
  templateId: [
    { required: true, message: '草图编码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur', message: '英文,数字,符号-,符号_组成的值' },
    { validator: checkIsTemplateId, trigger: 'blur' }
  ],
  sketchCode: [{ required: true, message: '请选择草图代码', trigger: 'blur' }],
  templateName: [
    { required: true, message: '模版名称不能为空', trigger: 'blur' },
    { validator: checkIsTemplateName, trigger: 'blur' }
  ],
  statsCodeInit: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符', trigger: 'blur' }],
  statsCodeJsUrl: [{ pattern: /^[^\p{Script=Han}]+$/u, message: '不能包含中文字符!', trigger: 'blur' }],
  appDownloadUrl: [
    {
      required: false,
      message: '下载链接不能为空',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!checkIsUrlOrNot(value) && value) {
          callback(new Error('请输入类似https://www.google.com/的URL！'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const rules: any = ref(rulesAddFrom.value)
const submitInfo = async (formRefval) => {
  rules.value = distinguish.value ? rulesEditFrom.value : rulesAddFrom.value
  formRefval.validate(async (valid, fields) => {
    if (valid) {
      if (!ownerUserIdValid) {
        return ElMessage.error('该用户ID不存在!')
      }
      console.log('valid', valid)
      if (distinguish.value) {
        new Promise((resolve, reject) => {
          if (originalOwnerUserId !== addForm.value.ownerUserId) {
            getRefWebsiteConfig({
              ownerUserId: addForm.value.ownerUserId,
              websiteTemplateRef: addForm.value.templateId
            }).then((res: any) => {
              if (!res.success) {
                ElMessage.error(res.errMessage)
                reject()
              } else {
                if (res.data.length) {
                  resolve({ nagare: false, hasChangeAccount: true })
                  ElMessage.error('当前模板已绑定其他站点！')
                } else {
                  resolve({ nagare: true, hasChangeAccount: true })
                }
              }
            })
          } else {
            resolve({ nagare: true, hasChangeAccount: false })
          }
        })
          .then((res: any) => {
            if (res.nagare) {
              return editFormInfo(res.hasChangeAccount)
            } else {
              return Promise.reject()
            }
          })
          .then((res: any) => {
            modalsStore.setModalData('templateInfoModal', {
              ...modalsStore.templateInfoModal.modalData,
              isVisible: false
            })
            modalsStore.hideModal('templateInfoModal')
          })
          .catch((error) => {
            console.error('Error:', error)
          })
          .finally(() => {})
      } else {
        await addFormInfo(formRefval)
      }
    } else {
      console.log('error', fields)
    }
  })
}

const addFormInfo = async (formRefval) => {
  isLoading2.value = true
  formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        const queryForm: ITemplateCreateQueryParams = {
          ...addForm.value,
          manageSiteId: manageSite.manageSiteId
        }

        let res: any = await reqTemplateCreate(filteredQuery<ITemplateCreateQueryParams>(queryForm))
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand()
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.error(err)
      } finally {
        emit('requestGrandpa')
        isLoading2.value = false
        closeDialog(true)
        modalsStore.setModalData('templateInfoModal', {
          ...modalsStore.templateInfoModal.modalData,
          isVisible: false
        })
        modalsStore.hideModal('templateInfoModal')
      }
    } else {
      isLoading2.value = false
    }
  })
}

const { VITE_CDN_URL } = webConfigApi

import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import { UploadFile } from 'element-plus'
import { filteredQuery } from '@/utils/dataFormat'
import {
  IIsTemplateIdExitQueryParams,
  IIsTemplateNameExitQueryParams,
  ITemplateCreateQueryParams
} from '@/api/site/types'
const editFormInfo = async (hasChangeAccount = true) => {
  isLoading2.value = true
  const { ownerUserName, sysTemplateRefName, sketchName, loginId, ...typeForm } = addForm.value
  let res: any = await reqTemplateEdit({ ...typeForm })
  if (res.success) {
    ElMessage({
      showClose: true,
      message: t('table.controls') + t('errorCode.0'),
      type: 'success'
    })
    closeHand()
  } else {
    if (!hasChangeAccount && res.errCode === '50007') {
      ElMessage({
        showClose: true,
        message: '修改成功',
        type: 'success'
      })
    } else if (hasChangeAccount && res.errCode === '50007') {
      ElMessage.error('当前模板已绑定其他站点！')
    } else {
      ElMessage.error(res.errMessage)
    }
  }
  emit('requestGrandpa')
}
let backUpOwnerUserIdList: string[] = []
const defaultPageObj = { size: 100, page: 1 }
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response: any = await reqUserList({
      searchId: queryString,
      ...defaultPageObj,
      manageSiteId: manageSite.manageSiteId
    })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId,
        loginId: item.loginId,
        userId: item.userId
      }))
      backUpOwnerUserIdList = response.data.list.map((item: any) => item.userId)
      cb(results)
    } else {
      cb([])
    }
  } catch (error) {
    console.error('Error fetching domain suggestions:', error)
    ElMessage.error('获取用户id时出错')
    cb([])
  }
}
const closeDialog = (isNeedRefresh: boolean = false) => {
  Object.assign(addForm.value, initForm())
  formRef.value.clearValidate()
  modalsStore.setModalData('templateInfoModal', {
    ...modalsStore.templateInfoModal.modalData,
    isVisible: false
  })
  modalsStore.hideModal('templateInfoModal')
  emit('cancel', isNeedRefresh)
}

const getAllSketchList = async () => {
  let res: any = await reqGetALLSketchList({
    manageSiteId: manageSite.manageSiteId
  })
  optionsAllSketch.value = res.data
}
const closeHand = () => {
  emit('closeButton')
}
onMounted(() => {
  getAllSketchList()
})
function isValidURL(errorMessage: string) {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }

    const urlPattern = /^(https?:\/\/|@)(www\.)?([a-zA-Z0-9-_]+\.[a-zA-Z]{2,11})(\/[^\s]*)?$/
    const localhostPattern = /^(http:\/\/localhost(:\d+)?(\/.*)?)$/
    const ipPattern = /^(http:\/\/[0-9]{1,3}(\.[0-9]{1,3}){3}(:\d+)?(\/.*)?)$/
    if (!urlPattern.test(value) && !localhostPattern.test(value) && !ipPattern.test(value)) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}
onMounted(() => {
  if (!modalsStore.templateInfoModal.modalData?.isSysTemplateRef) {
    reqTemplateInfoByTemplateId({
      templateId: modalsStore.templateInfoModal?.modalData?.templateId
    })
      .then((res: any) => {
        originalOwnerUserId = res.data.ownerUserId
        if (res.success) {
          addForm.value = { ...initForm(), ...res.data }
          if (res.data.sketchCode) {
            modalsStore.setModalData('templateInfoModal', {
              canHandleSubmit: modalsStore.templateInfoModal.modalData?.canHandleSubmit,
              sketchCode: res.data.sketchCode,
              sketchName: res.data.sketchName,
              templateName: res.data.templateName,
              isSketchPathVisible: true,
              ...modalsStore.templateInfoModal.modalData
            })
          }
          if (res.data.logo) {
            fileList.value = [{ url: VITE_CDN_URL + res.data.logo }]
          } else {
            fileList.value = []
          }
          if (res.data.icon) {
            fileList2.value = [{ url: VITE_CDN_URL + res.data.icon }]
          } else {
            fileList2.value = []
          }
        } else {
          console.log('reserror', res)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  } else {
    reqSysTemplateList()
      .then((res: any) => {
        originalOwnerUserId = res.data[0].ownerUserId
        if (res.success) {
          addForm.value = { ...initForm(), ...res.data[0] }
          if (res.data[0].sketchCode) {
            modalsStore.setModalData('templateInfoModal', {
              canHandleSubmit: modalsStore.templateInfoModal.modalData?.canHandleSubmit,
              sketchCode: res.data[0].sketchCode,
              sketchName: res.data[0].sketchName,
              templateName: res.data[0].templateName,
              ...modalsStore.templateInfoModal.modalData
            })
          }
          if (res.data[0].logo) {
            fileList.value = [{ url: VITE_CDN_URL + res.data[0].logo }]
          } else {
            fileList.value = []
          }
          if (res.data[0].icon) {
            fileList2.value = [{ url: VITE_CDN_URL + res.data[0].icon }]
          } else {
            fileList2.value = []
          }
        } else {
          console.log('reserror', res)
        }
      })
      .catch((err) => {
        console.error('err', err)
      })
  }
})

let originalOwnerUserId = ''
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleDelete = (file, type = 'logo') => {
  console.log('file', file)
  if (type === 'logo') {
    addForm.value.logo = ''
    fileList.value = []
  } else if (type === 'icon') {
    addForm.value.icon = ''
    fileList2.value = []
  }
}
</script>
<style lang="less" scoped>
.uploadedFile {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 0px;
  overflow: hidden;

  ul {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  li {
    list-style: none;
  }
}

.large-icon {
  font-size: 24px;
  color: white;
}

.UploadSection {
  display: flex;
  align-items: flex-start;
  flex-direction: row-reverse;
  > div {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .uploaded-image {
    cursor: pointer;
  }
}

.babali:hover .overlay {
  opacity: 1;
}

.babali {
  margin-right: 10px;
  width: 4rem;
  height: 4rem;
  border: 1px solid #ccc;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  .uploaded-image {
    position: relative;
  }

  .overlay {
    cursor: pointer;
    z-index: 100;
    background-color: blue;
    position: absolute;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.8);

    opacity: 0;

    transition: opacity 0.3s;
  }
}

.dialog-image {
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.babaul {
  padding-left: 0px;
}
</style>
