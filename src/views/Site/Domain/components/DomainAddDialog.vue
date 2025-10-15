<template>
  <!-- 域名新增　父コンポーネントが/Users/whc/pwtk-admin-web/src/views/Site/Domain/index.vueです-->
  <el-dialog v-model="isVisible" title="" :close-on-click-modal="false" @close="handleCancel" class="tabs-dialog">
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane class="m_tabs_pane" label="域名" name="domain">
        <el-form :model="addForm" :rules="rulesAddFrom" ref="formRef" class="dialog-form">
          <el-row :gutter="20" class="row-center">
            <!-- 左列 -->
            <el-col :span="12" class="long-col">
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
                      <h1>11</h1>
                      <EnhancedFileUpload :key="file.uid" :file="file" @remove="handleRemove" />
                    </template>
                  </mUpload>
                  <el-dialog class="dialog-image" v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" />
                  </el-dialog>
                  <div class="uploadedFile" v-if="fileList.length === 1">
                    <!-- 仅当 fileList 长度为 1 时展示 -->
                    <!-- <h3>已上传文件:</h3> -->
                    <ul class="babaul">
                      <li v-for="file in fileList" :key="file.uid" class="babali">
                        <img :src="file.url" alt="" class="uploaded-image" />
                        <!-- {{ file.name }} - {{ file.status }} -->
                        <div class="overlay">
                          <el-icon class="large-icon" @click="handlePictureCardPreview(file)">
                            <zoom-in />
                          </el-icon>
                          <el-icon class="large-icon" @click="handleDelete(file, 'logo')">
                            <Delete />
                          </el-icon>
                        </div>
                      </li>

                      <!-- 灰色遮罩层 -->
                    </ul>
                  </div>
                </section>
              </el-form-item>
              <el-form-item label="域名:" prop="domain">
                <el-input style="width: 80%" v-model="addForm.domain" autocomplete="off" />
              </el-form-item>
              <el-form-item label="用户ID:" prop="ownerUserId">
                <el-autocomplete
                  style="width: 80%"
                  clearable
                  v-model="addForm.ownerUserId"
                  :fetch-suggestions="querySearchUserLogin"
                  placeholder="所属用户 | ID"
                  @select="handleSelectUserId"
                  @blur="handleBlurOwnerUserId"
                  @input="handleInputOwnerUserId"
                  :trigger-on-focus="false"
                >
                  <template #default="{ item }">
                    <div class="autocomplete-item">
                      <div>{{ item.loginId }}-{{ item.userId }}</div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="绑定站点ID:" prop="websiteRef">
                <el-autocomplete
                  style="width: 80%"
                  clearable
                  :disabled="isWebDisabled"
                  v-model="addForm.websiteRef"
                  :fetch-suggestions="querySearchWebsiteRef"
                  placeholder="绑定站点ID"
                  @select="handleSelectWebsiteRef"
                  @blur="handleBlurWebsiteRef"
                  :trigger-on-focus="false"
                >
                  <template #default="{ item }">
                    <div class="autocomplete-item">
                      <div>{{ item.value }}</div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="域名类型:" prop="domainType" required>
                <el-select style="width: 80%" v-model="addForm.domainType" placeholder="域名类型">
                  <el-option v-for="item in domainType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="域名来源:" prop="domainFrom">
                <el-select style="width: 80%" v-model="addForm.domainFrom" placeholder="域名来源">
                  <el-option v-for="item in domainFrom" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="落地页:" prop="landingPage">
                <el-select style="width: 80%" v-model="addForm.landingPage" placeholder="落地页">
                  <el-option v-for="item in landingPage" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="默认推广码:" prop="promotionCode">
                <el-input v-model="addForm.promotionCode" autocomplete="off" />
              </el-form-item>
              <el-form-item label="关键字:" prop="keyWords">
                <el-input v-model="addForm.keyWords" autocomplete="off" />
              </el-form-item>
              <el-form-item label="网站描述:" prop="descriptions">
                <el-input
                  :maxlength="textAreaLimit"
                  show-word-limit
                  type="textarea"
                  v-model="addForm.descriptions"
                  :rows="4"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                />
              </el-form-item>
              <el-form-item label="统计代码:" prop="statsCodeJsUrl">
                <el-input
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="addForm.statsCodeJsUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="初始化代码:" prop="statsCodeInit">
                <el-input
                  :autosize="{ minRows: 1, maxRows: 6 }"
                  type="textarea"
                  v-model="addForm.statsCodeInit"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
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
            </el-col>
            <!-- 右列 -->
            <el-col :span="12" class="long-col">
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
                    <!-- 仅当 fileList 长度为 1 时展示 -->
                    <!-- <h3>已上传文件:</h3> -->
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
              <el-form-item label="状态:" prop="domainStatus">
                <el-radio-group v-model="addForm.domainStatus">
                  <el-radio label="y">启用</el-radio>
                  <el-radio label="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="提示APP下载:" prop="isAppDownloadHint">
                <el-radio-group v-model="addForm.isAppDownloadHint">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="配置SSL证书:" prop="isSupportSsl">
                <div style="width: 80%" class="duan">
                  <el-radio-group @change="handleChangeIsSupportSsl" v-model="addForm.isSupportSsl">
                    <el-radio label="y">是</el-radio>
                    <el-radio label="n">否</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item label="SSL证书到期日期:" prop="sslExpiry">
                <el-date-picker
                  style="width: 80%"
                  :disabled="addForm.isSupportSsl === 'n'"
                  v-model="addForm.sslExpiry"
                  type="datetime"
                  format="YYYY-MM-DDTHH:mm:ss"
                  value-format="YYYY-MM-DDTHH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="强制HTTPS访问:" prop="isForceHttps">
                <el-radio-group style="width: 80%" :disabled="disableSsl" v-model="addForm.isForceHttps">
                  <el-radio label="y">是</el-radio>
                  <el-radio label="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="语言列表:" prop="langCodes">
                <el-select :disabled="disableLangAreaChange" v-model="addForm.langCodes" multiple placeholder="语言">
                  <el-option v-for="item in canSelectLang" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="地区列表:" prop="areaCodes">
                <el-select v-model="addForm.areaCodes" :disabled="disableLangAreaChange" multiple placeholder="地区">
                  <el-option v-for="item in canSelectArea" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="OPS管理代码:" prop="opsManageCode">
                <el-input v-model="addForm.opsManageCode" autocomplete="off" />
              </el-form-item>
              <el-form-item label="CDN地址:" prop="cdnUrl">
                <el-input
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="addForm.cdnUrl"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="在线客服代码:" prop="onlineServiceCode">
                <el-input
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="addForm.onlineServiceCode"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  :maxlength="textAreaLimit"
                  show-word-limit
                  type="textarea"
                  v-model="addForm.memo"
                  :rows="4"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-footer dialog-footer-submit button-row">
          <el-button @click="handleCancel" v-text="'取消'" />
          <el-button
            type="primary"
            :disabled="isDisabled"
            :loading="isLoading"
            @click="handleSubmitNewDomain"
            v-text="'提交'"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="ts">
import { domainType, domainFrom, textAreaLimit } from '@/const/options'
import { defineProps, defineEmits, ref } from 'vue'
import { optionsLang, optionsArea, landingPage } from '@/const/options'
import type { IAddDomainQueryParams } from '@/api/site/domain/types'
import { ElForm, ElMessage, UploadFile } from 'element-plus'
import { createDomainValidator } from '@/utils/validators'
import { reqUserList } from '@/api/user'
import { reqSetWebSiteListId } from '@/api/site'
import { addTypeToObjects } from '@/utils/dataFormat'
import { GetAreaCodes, GetLangCodes } from '@/api/site/domain'
import showErrorMessage from '@/utils/showErrorMessage'
const initPostInfo = () => ({
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
import { FileType, fileUploadOption } from '@/api/system/upload/types'
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
let uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
//上传相关
const fileType = ref()
import mUpload from '@/components/mUpload/index.vue'
import isValidURL, { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const handleSuccessOfAttachment2 = async (val, prefixPostfixFlag) => {
  addForm.value.icon = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
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
const handleChange = (first, second) => {
  const { file } = first
  fileList.value = [file]
}
const fileList = ref<any[]>([])
const fileList2 = ref<any[]>([])
const disableLangAreaChange = ref<boolean>(true)
const isWebDisabled = ref<boolean>(true)
const attachmentData = ref<any[]>([])
const dialogThirdFormData = ref()
const attachmentFormMode = ref<string>('add')
const attachmentForm = ref()
const postInfo = ref(initPostInfo())
const postId = ref()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  loadingBtn: {
    type: Boolean,
    required: true
  }
})
const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  addForm.value.logo = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
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
const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
//附件页码
const attachmentCurrentPage = ref(1)
const attachmentPageSize = ref(15)
const attachmentTotal = ref(0)
let handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
const handleChange2 = (first, second) => {
  const { file } = first
  fileList2.value = [file]
}
let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
const rulesAddFrom = {
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
  domain: [
    { required: true, message: '域名不能为空', trigger: 'blur' },
    { validator: createDomainValidator('域名格式不正确'), trigger: 'blur' }
  ],
  statsCodeInit: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('不能包含中文字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  statsCodeJsUrl: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('不能包含中文字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
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
  basePath: string = 'wm/website/logo'
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
        uploadFrom: basePath + '',
        // uploadFrom: `test`,
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
let beforeUpload2 = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/domain/icon').uploadData
}
let beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/domain/logo').uploadData
}
const handleBlurWebsiteRef = (e) => {
  if (backUpWebsiteRefList.some((item) => item === e.target.value)) {
    isWebDisabled.value = false
    disableLangAreaChange.value = false
    websiteRefValid = true
  } else if (e.target.value == '') {
    disableLangAreaChange.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
    websiteRefValid = true
  } else {
    disableLangAreaChange.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
    websiteRefValid = false
    ElMessage.error('该绑定站点ID不存在')
  }
}
const initFormData = (): IAddDomainQueryParams => ({
  appDownloadUrl: '',
  domain: '',
  ownerUserId: '',
  websiteRef: '',
  onlineServiceCode: '',
  keyWords: '',
  isSupportSsl: 'n',
  cdnUrl: '',
  domainStatus: 'y',
  domainType: 'f',
  domainFrom: '',
  langCodes: [],
  areaCodes: [],
  landingPage: 'p',
  isForceHttps: 'n',
  sslExpiry: '',
  isAppDownloadHint: 'n',
  opsManageCode: '',
  memo: '',
  descriptions: '',
  promotionCode: '',
  statsCodeInit: '',
  statsCodeJsUrl: ''
})
let websiteRefValid: boolean = true
let ownerUserIdValid: boolean = true
const disableSsl = ref<boolean>(true)
const handleChangeIsSupportSsl = (val: string) => {
  console.log('val', val)
  if (val === 'y') {
    disableSsl.value = false
  } else {
    disableSsl.value = true
    addForm.value.isForceHttps = 'n'
    addForm.value.sslExpiry = ''
  }
}
const isLoading = ref(props.loadingBtn)
const isVisible = ref(props.visible)
const addForm = ref<IAddDomainQueryParams>(initFormData())
const isDisabled = ref(false)
const defaultPageObj = { size: 100, page: 1 }
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  addForm.value.ownerUserId = item.userId
  addForm.value.websiteRef = ''
  disableLangAreaChange.value = true
  isWebDisabled.value = false
  canSelectLang.value = []
  canSelectArea.value = []
  addForm.value.langCodes = []
  addForm.value.areaCodes = []
}
const handleInputOwnerUserId = (value: string) => {
  if (value == '') {
    addForm.value.websiteRef = ''
    disableLangAreaChange.value = true
    isWebDisabled.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
  }
}
const handleBlurOwnerUserId = (event: any) => {
  if (backUpOwnerUserIdList.some((item) => item === addForm.value.ownerUserId)) {
    ownerUserIdValid = true
  } else if (event.target.value !== '' && !backUpOwnerUserIdList.some((item) => item === event.target.value)) {
    ownerUserIdValid = false
    addForm.value.websiteRef = ''
    isWebDisabled.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
    disableLangAreaChange.value = true
    ElMessage.error('该用户ID不存在!')
  } /* else if (event.target.value == '') {
    ownerUserIdValid = true
    addForm.value.websiteRef = ''
    isWebDisabled.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
    disableLangAreaChange.value = true
  }  */ else {
    ownerUserIdValid = false
    addForm.value.websiteRef = ''
    isWebDisabled.value = true
    canSelectLang.value = []
    canSelectArea.value = []
    addForm.value.langCodes = []
    addForm.value.areaCodes = []
    disableLangAreaChange.value = true
  }
}
const handleSelectWebsiteRef = (item: any) => {
  addForm.value.websiteRef = item.value
  Promise.all([
    GetLangCodes({ websiteId: addForm.value.websiteRef }),
    GetAreaCodes({ websiteId: addForm.value.websiteRef })
  ])
    .then(([langRes, areaRes]) => {
      if (langRes.success) {
        canSelectLang.value = allLang.filter((item) => langRes.data.sketchLangCodes.includes(item.value))
        nextTick(() => {
          addForm.value.langCodes = langRes.data.websiteLangCodes
        })
      } else {
        console.error('获取语言地区失败')
      }

      // 处理地区代码的响应
      if (areaRes.success) {
        canSelectArea.value = allArea.filter((item) => areaRes.data.sketchAreaCodes.includes(item.value))
        nextTick(() => {
          addForm.value.areaCodes = areaRes.data.websiteAreaCodes
        })
      } else {
        console.error('获取语言地区失败')
      }
      console.log('item', item.value, addForm.value.websiteRef)

      // return reqListBlurTemplateAndSketchCode({ templateId: data.websiteTemplateRef })
    })
    .catch((error) => {
      console.error('请求失败！！！！:', error)
    })
}
const canSelectLang = ref<any>([])
const canSelectArea = ref<any>([])
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response: any = await reqUserList({
      searchId: queryString,
      ...defaultPageObj,
      manageSiteId: manageSite.manageSiteId
    })
    if (response.success && response.data) {
      const results = response.data.list.map((item: any) => ({
        value: item.userId, // 这个 value 属性是必须的，用于显示在输入框中
        loginId: item.loginId,
        userId: item.userId
        // 可以添加其他需要的属性
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
const allArea = addTypeToObjects(optionsArea, 'option')
const allLang = addTypeToObjects(optionsLang, 'option')
const querySearchWebsiteRef = async (queryString: string, cb: (arg: any) => void) => {
  // console.log('queryString', queryString);
  // test
  /* const fakeArea = ['cn', 'us', 'jp'],
    fakeLang = ['zh', 'en', 'ja']
  canSelectArea.value = allArea.filter((item) => fakeArea.includes(item.value))
  canSelectLang.value = allLang.filter((item) => fakeLang.includes(item.value))
  console.log('canSelectArea', canSelectArea.value)
  console.log('canSelectLang', canSelectLang.value) */
  // console.log('queryString', queryString);
  disableLangAreaChange.value = false
  // test
  try {
    const response = await reqSetWebSiteListId({
      websiteId: queryString,
      ownerUserId: addForm.value.ownerUserId,
      ...defaultPageObj
    })
    if (response.success && response.data) {
      // console.log('response.data', response.data)
      const results = response.data.map((item: any) => ({
        value: item // 这个 value 属性是必须的，用于显示在输入框中
        // 可以添加其他需要的属性
      }))
      backUpWebsiteRefList = response.data.map((item: any) => item)
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
const activeTab: string = 'domain'
const emit = defineEmits(['update:visible', 'save', 'closeButton', 'cancel', 'searchButton', 'requestGrandpa'])
const formRef = ref<InstanceType<typeof ElForm>>()

const handleCancel = () => {
  emit('update:visible', false)
}
let backUpOwnerUserIdList: string[] = []
let backUpWebsiteRefList: string[] = []
// 点击提交按钮 サブミットボタンをクリックしたら
const handleSubmitNewDomain = () => {
  formRef.value?.validate((valid) => {
    if (valid && websiteRefValid && ownerUserIdValid) {
      if (addForm.value.sslExpiry === '--') {
        addForm.value.sslExpiry = ''
      }
      emit('save', addForm)
    }
  })
}
</script>
<style lang="less" scoped>
.uploadedFile {
  // background-color: pink;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 0px;
  // margin-right: 5px;
  // background-color: pink;
  // width: 100px;
  // height: 100px;
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
  /* 设置图标的大小 */
  /* 你可以根据需要调整大小 */
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
.row-center {
  justify-content: center;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding: 0px 50px;
}
</style>
