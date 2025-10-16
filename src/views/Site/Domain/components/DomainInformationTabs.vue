<template>
  <el-dialog class="tabs-dialog" destroy-on-close v-model="editDialogModel" @close="handleDialogClose">
    <el-tabs v-model="tabActiveName" class="demo-tabs m_tabs" @tab-click="handleClickTab">
      <el-tab-pane label="域名信息" lazy name="tab1" class="m_tabs_pane">
        <el-form :rules="rules" :model="editForm" class="domain-info-form dialog-form" ref="editFormRef">
          <el-row :gutter="20" style="justify-content: center">
            <el-col :span="10">
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
              <el-form-item required label="域名:">
                <span>{{ editForm.domain }}</span>
                <copy v-if="editForm.domain" :content="editForm.domain" />
              </el-form-item>
              <el-form-item label="用户ID:">
                <span class="" v-if="!showUserInput">
                  {{ editForm.userName ? editForm.userName : '' }} |
                  {{ editForm.ownerUserId ? editForm.ownerUserId : '' }}
                </span>
                <template v-else>
                  <el-autocomplete
                    style="width: 80%"
                    clearable
                    v-model="editForm.ownerUserId"
                    :fetch-suggestions="querySearchUserLogin"
                    placeholder="用户ID | ID"
                    @select="handleSelectUserId"
                    :trigger-on-focus="false"
                  >
                    <template #default="{ item }">
                      <div class="autocomplete-item">
                        <div>{{ item.loginId }}-{{ item.userId }}</div>
                      </div>
                    </template>
                  </el-autocomplete>
                </template>
              </el-form-item>
              <template v-if="hasWebsiteRef">
                <el-form-item label="绑定站点:">
                  <span class="duan">{{ editForm.websiteInnerName }} | {{ editForm.websiteRef }}</span>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="绑定站点ID:" prop="websiteRef">
                  <el-input
                    class="duan"
                    disabled
                    v-model="editForm.websiteRef"
                    placeholder="请在绑定站点列表中绑定站点！"
                  />
                </el-form-item>
              </template>

              <el-form-item label="域名类型:" prop="domainType">
                <el-select class="duan" placeholder="" v-model="editForm.domainType">
                  <el-option v-for="item in domainType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="域名来源:" prop="domainFrom">
                <el-select placeholder="" class="duan" v-model="editForm.domainFrom">
                  <el-option v-for="item in domainFrom" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="落地页:" prop="landingPage">
                <el-select v-model="editForm.landingPage" class="duan">
                  <el-option v-for="item in landingPage" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="默认推广码:" prop="promotionCode">
                <el-input v-model="editForm.promotionCode" />
              </el-form-item>
              <el-form-item label="关键字:" prop="keyWords">
                <el-input placeholder="关键字" v-model="editForm.keyWords" />
              </el-form-item>
              <el-form-item label="网站描述:" prop="descriptions">
                <el-input
                  type="textarea"
                  v-model="editForm.descriptions"
                  :rows="4"
                  maxlength="225"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="统计代码:" prop="statsCodeJsUrl">
                <el-input
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.statsCodeJsUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>

              <el-form-item label="初始化代码:" prop="statsCodeInit">
                <el-input
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.statsCodeInit"
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
                  v-model="editForm.appDownloadUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
            </el-col>

            <el-col :span="10">
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
              <el-form-item label="状态:" prop="domainStatus">
                <el-radio-group v-model="editForm.domainStatus">
                  <el-radio v-for="item in domainStatusDetail" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="提示APP下载:" prop="isAppDownloadHint">
                <el-radio-group v-model="editForm.isAppDownloadHint">
                  <el-radio v-for="item in forceHttpsStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="配置SSL证书:" prop="isSupportSsl">
                <el-radio-group @change="handleIsSupportSslChange" v-model="editForm.isSupportSsl">
                  <el-radio v-for="item in forceHttpsStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="ssl证书到期日:" prop="sslExpiry">
                <el-date-picker
                  :disabled="editForm.isSupportSsl === 'n'"
                  v-model="editForm.sslExpiry"
                  type="datetime"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DDTHH:mm:ss"
                />
              </el-form-item>
              <el-form-item label="强制https访问:" prop="isForceHttps">
                <el-radio-group :disabled="editForm.isSupportSsl === 'n'" v-model="editForm.isForceHttps">
                  <el-radio v-for="item in forceHttpsStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="语言列表:" prop="langCodes">
                <el-select v-model="editForm.langCodes" multiple placeholder="语言">
                  <el-option v-for="item in canSelectLang" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="地区列表:" prop="areaCodes">
                <el-select v-model="editForm.areaCodes" multiple placeholder="地区">
                  <el-option v-for="item in canSelectArea" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="OPS管理代码:" prop="opsManageCode">
                <el-input placeholder="管理代码" v-model="editForm.opsManageCode" />
              </el-form-item>
              <el-form-item label="CDN地址:" prop="cdnUrl">
                <!-- <el-input
                  placeholder="CDN地址"
                  v-model="editForm.cdnUrl"
                /> -->
                <el-input
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.cdnUrl"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder="CDN地址"
                />
              </el-form-item>
              <el-form-item label="在线客服代码:" prop="onlineServiceCode">
                <el-input
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.onlineServiceCode"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder="在线客服代码"
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  placeholder="备注"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  v-model="editForm.memo"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                />
              </el-form-item>

              <el-form-item label="创建时间:" prop="createTime">
                <span>{{ unitFormatDate(editForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row" v-if="hasRightToSubmit">
          <el-button @click="handleCancel" v-text="'取消'" />
          <el-button type="primary" @click="handleEdit" v-text="'提交'" />
        </div>
      </el-tab-pane>
      <!-- tab2 -->
      <template v-if="hasWebsiteRef">
        <el-tab-pane lazy label="绑定站点" name="tab2">
          <WebsiteBand :domain="domain" @update-active-tab="updateFirstTabAndMoveToFirstTab"></WebsiteBand>
        </el-tab-pane>
        <!-- tab3 -->
        <el-tab-pane lazy label="绑定模板" name="tab3">
          <TemplateBand :domain="domain"></TemplateBand>
        </el-tab-pane>
        <!-- tab4 -->
        <el-tab-pane lazy label="引用草图" name="tab4">
          <SketchBand :domain="domain"></SketchBand>
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane lazy label="站点列表" name="tab2">
          <WebsiteTable
            :domain="domain"
            :dialogHeight="dialogHeight"
            :originOwnerUserId="originOwnerUserId"
            @update-active-tab="updateFirstTabAndMoveToFirstTab"
          ></WebsiteTable>
        </el-tab-pane>
      </template>
    </el-tabs>
  </el-dialog>
  <!-- </el-loading> -->
</template>

<script setup lang="ts">
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const fileList = ref<any[]>([]) // 定义 fileList
const loading = ref(true)
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
interface SearchForm {
  sortName: string
  sortOrder: string
  domain: string
  ownerUserId: string
  websiteRef: string
  langCodes: string[]
  areaCodes: string[]
  websiteInnerName: string
  websiteTitle: string
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
//附件相关
const attachmentData = ref<any[]>([])
const isDisabled = ref(true)
const dialogThirdFormData = ref()
const attachmentFormMode = ref<string>('add')
const attachmentForm = ref()
const postInfo = ref(initPostInfo())
const postId = ref()
// const activeTab = ref<string>('tab1') //tab切换第一条
const emit = defineEmits<{
  closeButton: []
  cancel: [isNeedRefresh: boolean]
  searchButton: []
  requestGrandpa: []
}>()
import { ref } from 'vue'
import { initEditFormModel, type EditRequest } from '@/api/site/domain/types'
import WebsiteBand from './WebsiteBand.vue'
import { unitFormatDate } from '@/utils/dateFormat'
import TemplateBand from './TemplateBand.vue'
import WebsiteTable from './WebsiteTable.vue'
import SketchBand from './SketchBand.vue'
import { Plus } from '@element-plus/icons-vue'
import { editDomain, GetAreaCodes, getDomainDetail, GetLangCodes } from '@/api/site/domain'
import type { ElForm, TabsPaneContext, UploadFile } from 'element-plus'
import { addTypeToObjects } from '@/utils/dataFormat'
import mUpload from '@/components/mUpload/index.vue'
import {
  optionsArea,
  optionsLang,
  domainType,
  landingPage,
  domainFrom,
  supportSslStatus,
  forceHttpsStatus,
  domainStatusDetail
} from '@/const/options'
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
  // Merge custom mappings with default mappings
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
let handleExceed = (val: any) => {
  // console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
let beforeUpload2 = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/domain/icon').uploadData
}
let beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/domain/logo').uploadData
}
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
import { createDomainValidator } from '@/utils/validators'
import { reqUserList } from '@/api/user'
import { FileType } from '@/api/system/upload/types'
import showErrorMessage from '@/utils/showErrorMessage'
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement'
import { useModalsStore } from '@/stores/modalStore'
const domain = computed(() => modalsStore.domainInfoModal.modalData?.domain || '')
const modalsStore = useModalsStore()
const showUserInput = ref<boolean>(true)
const editDialogModel: Ref<boolean> = computed(() => modalsStore.domainInfoModal.isVisible || false)
const editForm = ref<EditRequest>(initEditFormModel())
const dialogHeight = computed(() => {
  return window.innerHeight * 0.8
})
const tabActiveName = ref<string>('tab1')
const hasRightToSubmit = computed(() => modalsStore.domainInfoModal.modalData?.hasRightToSubmit || false)

const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  editForm.value.ownerUserId = item.userId
}
let handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
const fileType = ref()
const handleDialogClose = () => {
  tabActiveName.value = 'tab1'
  modalsStore.setModalData('domainInfoModal', {
    ...modalsStore.domainInfoModal.modalData,
    isVisible: false,
    activeTab: 'tab1'
  })
  modalsStore.hideModal('domainInfoModal')
}
const handleDelete = (file, type = 'logo') => {
  if (type === 'logo') {
    editForm.value.logo = ''
    fileList.value = []
  } else if (type === 'icon') {
    editForm.value.icon = ''
    fileList2.value = []
  }
}
const attachmentCurrentPage = ref(1)
const attachmentPageSize = ref(15)
const attachmentTotal = ref(0)
const isLoading = ref(false)

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
const fileList2 = ref<any[]>([])
const handleChange = (first, second) => {
  // console.log('first', first)
  const { file } = first
  fileList.value = [file]
  // console.log('second', second)
}
const handleChange2 = (first, second) => {
  const { file } = first
  fileList2.value = [file]
}
const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  editForm.value.logo = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
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
  editForm.value.icon = val.response.path
  const raw = val.file.raw
  const result = changeUploadDataWithCustom(raw.type, '')
  // uploadData.value = result.uploadData
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
const initForm = () => ({
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

const searchModel = inject<Ref<SearchForm>>('searchModel')
const allAreaOptions = addTypeToObjects(optionsArea, 'option'),
  allLangOptions = addTypeToObjects(optionsLang, 'option')
const rules = {
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
    { required: true, message: '域名', trigger: 'blur' },
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
      // console.log('response.data', response.data);
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

const handleClickTab = (tab: TabsPaneContext, event: Event) => {}

const handleIsSupportSslChange = (val: string) => {
  if (val === 'n') {
    editForm.value.isForceHttps = 'n'
    editForm.value.sslExpiry = ''
  }
}

const { VITE_CDN_URL } = webConfigApi

const allArea = addTypeToObjects(optionsArea, 'option')
const allLang = addTypeToObjects(optionsLang, 'option')
const canSelectLang = ref<any[]>([])
const canSelectArea = ref<any[]>([])
const hasWebsiteRef = ref<boolean>(false)
let originOwnerUserId = ''
const updateFirstTabAndMoveToFirstTab = (flag: any) => {
  tabActiveName.value = 'tab1'
  hasWebsiteRef.value = flag
  getDomainDetail({ domain: domain.value })
    .then((res: any) => {
      if (res && res.success) {
        originOwnerUserId = res.data.ownerUserId
        const _data = { ...res.data }
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
        if (!_data.websiteRef) _data.websiteRef = ''
        if (_data.websiteRef) {
          hasWebsiteRef.value = true
          GetLangCodes({ websiteId: _data.websiteRef }).then((res: any) => {
            if (res.success) {
              canSelectLang.value = allLang.filter((item) => res.data.sketchLangCodes.includes(item.value))
            } else {
              console.error('获取语言地区失败')
            }
          })
          GetAreaCodes({ websiteId: _data.websiteRef }).then((res0: any) => {
            if (res0.success) {
              canSelectArea.value = allArea.filter((item) => res0.data.sketchAreaCodes.includes(item.value))
            } else {
              console.error('获取语言地区失败')
            }
          })
        } else {
          hasWebsiteRef.value = false
          canSelectLang.value = []
          canSelectArea.value = []
          editForm.value.langCodes = []
          editForm.value.areaCodes = []
        }
        if (_data.ownerUserId) {
          showUserInput.value = false
        } else {
          showUserInput.value = true
        }
        console.log('_data', _data)
        Object.assign(editForm.value, { ...initEditFormModel(), ..._data })
      } else {
        console.error('获取域名详情失败')
      }
    })
    .catch((err) => {
      console.error('err', err)
    })
}
onMounted(() => {
  handleCancel()
  tabActiveName.value = 'tab1'
  modalsStore.showModal('domainInfoModal')
  getDomainDetail({ domain: domain.value })
    .then((res: any) => {
      if (res && res.success) {
        originOwnerUserId = res.data.ownerUserId
        const _data = { ...res.data }
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
        if (!_data.websiteRef) _data.websiteRef = ''
        if (_data.websiteRef) {
          hasWebsiteRef.value = true
          GetLangCodes({ websiteId: _data.websiteRef }).then((res: any) => {
            if (res.success) {
              canSelectLang.value = allLang.filter((item) => res.data.sketchLangCodes.includes(item.value))
            } else {
              console.error('获取语言地区失败')
            }
          })
          GetAreaCodes({ websiteId: _data.websiteRef }).then((res0: any) => {
            console.log('res', res0)
            if (res0.success) {
              canSelectArea.value = allArea.filter((item) => res0.data.sketchAreaCodes.includes(item.value))
            } else {
              console.error('获取语言地区失败')
            }
          })
        } else {
          hasWebsiteRef.value = false
          canSelectLang.value = []
          canSelectArea.value = []
          editForm.value.langCodes = []
          editForm.value.areaCodes = []
        }
        if (_data.ownerUserId) {
          showUserInput.value = false
        } else {
          showUserInput.value = true
        }
        Object.assign(editForm.value, { ...initEditFormModel(), ..._data })
      }
    })
    .catch((err) => {
      console.error('err', err)
    })
})
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}
const editFormRef = ref<InstanceType<typeof ElForm>>()
const handleEdit = (): void => {
  editFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (!editForm.value.sslExpiry) editForm.value.sslExpiry = ''
      if (editForm.value.sslExpiry === '--') {
        editForm.value.sslExpiry = ''
      } else if (editForm.value.sslExpiry.includes(' ')) {
        editForm.value.sslExpiry = editForm.value.sslExpiry.replace(/\s/g, 'T')
      }
      const params = removeProperty(editForm.value, 'hasStatsCode')
      editDomain(params as EditRequest)
        .then((res) => {
          if (res.success) {
            ElMessage.success('编辑成功')
          } else {
            ElMessage.error(res.errMessage)
          }
        })
        .finally(() => {
          if (searchModel) {
            fetchData({ size: 15, page: 1, ...searchModel.value })
          } else {
            fetchData({ size: 15, page: 1 })
          }
          handleCancel()
        })
    } else {
      console.error('表单验证失败')
    }
  })
}
const fetchData = inject('fetchData') as (params: any) => void
const handleCancel = () => {
  tabActiveName.value = 'tab1'
  modalsStore.hideModal('domainInfoModal')
}
</script>
<style scoped lang="less">
domain-info-form {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 20px;
}

.form-actions .el-button + .el-button {
  margin-left: 10px;
}
.duan {
  width: 80%;
}
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
