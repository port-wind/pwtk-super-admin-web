<template>
  <el-dialog
    class="tabs-dialog"
    :destroy-on-close="true"
    v-model="editWebsiteModel"
    :close-on-click-modal="false"
    @close="closeEditDialog"
  >
    <el-tabs lazy v-model="activeName" class="demo-tabs edit-website-tabs m_tabs" @tab-change="handleTabChange">
      <el-tab-pane label="站点详细" name="first" class="m_tabs_pane">
        <el-form ref="formRef" :model="editForm" :rules="rules" class="domain-info-form dialog-form">
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
                    </ul>
                  </div>
                </section>
              </el-form-item>
              <el-form-item :required="false" label="站点ID:" prop="websiteId">
                <span>{{ editForm.websiteId }}</span>
                <copy :content="editForm.websiteId" />
              </el-form-item>

              <el-form-item :required="true" label="内部名称:" prop="websiteInnerName">
                <el-input class="duan" clearable placeholder="内部名称" v-model="editForm.websiteInnerName"></el-input>
              </el-form-item>
              <el-form-item label="用户ID:" prop="ownerUserId">
                <el-autocomplete
                  class="duan"
                  style="width: 80%"
                  clearable
                  v-model="editForm.ownerUserId"
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
              <el-form-item label="绑定模板:" prop="websiteTemplateRef">
                <el-autocomplete
                  v-model="editForm.websiteTemplateRef"
                  :fetch-suggestions="querySearchTemplateRef"
                  clearable
                  class="duan"
                  placeholder="绑定模板:"
                  style="width: 80%"
                  @select="handleSelectTemplateRef"
                  :disabled="isTemplateDisabled"
                >
                  <template #default="{ item }">
                    <div class="autocomplete-item">
                      <div>{{ item.value.templateName }} | {{ item.value.templateId }}</div>
                    </div>
                  </template>
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="语言列表:" prop="langCodes">
                <el-select multiple placeholder="语言" :disabled="isLangDisabled" v-model="editForm.langCodes">
                  <el-option v-for="item in langRange" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="地区列表:" prop="areaCodes">
                <el-select multiple placeholder="地区" :disabled="isAreaDisabled" v-model="editForm.areaCodes">
                  <el-option v-for="item in areaRange" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="统计代码URL:" prop="statsCodeJsUrl">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
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
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
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
                  placeholder="下载APP链接"
                  v-model="editForm.appDownloadUrl"
                  show-word-limit
                  resize="vertical"
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
              <el-form-item :required="true" label="标题:" prop="websiteTitle">
                <el-input clearable placeholder="标题" v-model="editForm.websiteTitle"></el-input>
              </el-form-item>

              <el-form-item label="站点描述:" prop="describe">
                <el-input clearable placeholder="站点描述" v-model="editForm.describe"></el-input>
              </el-form-item>
              <el-form-item label="关键字:" prop="keyWords">
                <el-input clearable placeholder="关键字" v-model="editForm.keyWords" />
              </el-form-item>
              <el-form-item label="状态:" prop="websiteStatus">
                <el-radio-group v-model="editForm.websiteStatus">
                  <el-radio v-for="item in websiteStatus" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="CDN地址:" prop="cdnUrl">
                <el-input clearable placeholder="CDN地址" v-model="editForm.cdnUrl"></el-input>
              </el-form-item>

              <el-form-item label="在线客服代码:" prop="onlineServiceCode">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.onlineServiceCode"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input
                  clearable
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  type="textarea"
                  v-model="editForm.memo"
                  :rows="4"
                  maxlength="225"
                  show-word-limit
                  resize="vertical"
                  placeholder=""
                />
              </el-form-item>
              <el-form-item label="创建时间:" prop="createTime">
                <span>{{ unitFormatDate(editForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row" v-if="kengengaaruka">
          <el-button
            v-text="t('取消')"
            @click="
              () => {
                modalsStore.setModalData('websiteInfoModal', {
                  ...modalsStore.websiteInfoModal.modalData,
                  isVisible: false
                })
                modalsStore.hideModal('websiteInfoModal')
              }
            "
          />
          <el-button v-text="t('提交')" type="primary" @click="handleEditWebSubmit" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy label="绑定模板" name="second" class="m_tabs_pane">
        <template v-if="hasTemplateData">
          <m-form
            ref="formTemplateRef"
            :modelForm="templateFormData"
            :options="templateOptions"
            :commonSpan="16"
            :columnOption="templateColumOption"
            label-width="160"
            :rowAttrs="rowAttrs"
            class="dialog-form"
            style="justify-content: center"
          ></m-form>
        </template>
        <template v-else>暂无数据</template>
      </el-tab-pane>
      <el-tab-pane lazy label="引用草图" name="third" class="third-tab">
        <template v-if="hasSketchData">
          <m-form
            ref="formSketchRef"
            :formData="sketchFormData"
            :options="sketchOptions"
            :columnOption="sketchColumOption"
            :commonSpan="16"
            websiteId
            :rowAttrs="rowAttrs"
          ></m-form>
        </template>
        <template v-else>
          <span>暂无数据</span>
        </template>
      </el-tab-pane>

      <el-tab-pane lazy label="已绑定域名" name="fourth" class="m_tabs_pane">
        <DomainTab
          :websiteId="websiteId"
          :domainType="1"
          ref="domainBindTabRef"
          :ownerUserId="editForm.ownerUserId"
        ></DomainTab>
      </el-tab-pane>
      <el-tab-pane lazy label="未绑定域名" name="fifth" class="m_tabs_pane">
        <DomainTab
          :websiteId="websiteId"
          :domainType="2"
          ref="domainUnBindTabRef"
          :ownerUserId="editForm.ownerUserId"
        ></DomainTab>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  checkUserDomain,
  listBlurTemplateWithUserInfo,
  reqClientTemplateInfoByWebsiteId,
  reqClientWebsiteConfig,
  reqGetALLWebsiteList,
  reqLangAndAreaCodesBasedOnSketch,
  reqListBlurTemplateAndSketchCode,
  reqSketchInfoByWebsiteId,
  reqWebsiteCodeEdit
} from '@/api/site'
import { reqUserList } from '@/api/user'
import { checkIsUrlOrNot } from '@/views/Site/templateManagement/index'
import { optionsArea, optionsLang, optionsSketch, textAreaLimit, websiteStatus } from '@/const/options'
const fileList2 = ref<any[]>([])
const fileList = ref<any[]>([])
import { addTypeToObjects } from '@/utils/dataFormat'
import mUpload from '@/components/mUpload/index.vue'
import DomainTab from '@/views/Site/siteManagement/components/domainTab.vue'
import { t } from '@wangeditor/editor'
import { useModalsStore } from '@/stores/modalStore'
import { ElMessage, FormRules, UploadFile } from 'element-plus'
import { ref } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
const modalsStore = useModalsStore()
const websiteId = computed(() => modalsStore.websiteInfoModal.modalData?.websiteId || {})
import { FileType } from '@/api/system/upload/types'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
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
let beforeUpload2 = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/website/icon').uploadData
}

const { VITE_CDN_URL } = webConfigApi

let beforeUpload = (val: any) => {
  // console.log('beforeUpload-val', val)
  // console.log('type', changeUploadDataWithCustom(val.type, ''))
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '', {}, 'wm/website/logo').uploadData
}
const dialogThirdFormData = ref()

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
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const postInfo = ref(initPostInfo())
const postId = ref()
const activeTab = ref('template') //tab切换第一条

let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}
let handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}
const handleChange = (first, second) => {
  console.log('first', first)
  const { file } = first
  fileList.value = [file]
  console.log('second', second)
}
const handleDelete = (file, type = 'logo') => {
  console.log('file', file)
  if (type === 'logo') {
    editForm.value.logo = ''
    fileList.value = []
  } else if (type === 'icon') {
    editForm.value.icon = ''
    fileList2.value = []
  }
}
interface OptionItem {
  prop: string
  value: any
  type: string
  children?: any[]
  label: string
  placeholder?: string
  rules?: Array<{ [key: string]: any }>
  attrs?: { [key: string]: any }
  [key: string]: any
}
interface WebsiteInter {
  areaCodes: string[]
  cdnUrl: string
  createTime: number
  describe: string
  hasStatsCode: string
  keyWords: string
  langCodes: Array<string>
  memo: string
  onlineServiceCode: string
  ownerUserId: string
  statsCodeInit: string
  statsCodeJsUrl: string
  templateName: string
  userName: string
  websiteId: string
  websiteInnerName: string
  websiteStatus: string
  websiteTemplateRef: string
  websiteTitle: string
}
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { IReqGetALLWebsiteListQueryParams, IReqListBlurTemplateAndSketchCodeQueryParams } from '@/api/site/types'

interface Attrs {
  clearable?: boolean
}
interface TextData {
  isCopy: boolean
}
interface Rule {
  required: boolean
  message: string
  trigger: string
  min?: number
  max?: number
}
interface spliceTextData {
  prop: string
  displayType: 'text' | 'truncated' | 'other'
  showCopy?: boolean
}
const handleChange2 = (first, second) => {
  console.log('first', first)
  const { file } = first
  fileList2.value = [file]
  console.log('second', second)
}
interface FormOptions {
  type: 'text' | 'spliceText'
  value: string
  label: string
  prop: string
  placeholder?: string
  textData?: TextData
  spliceTextData?: spliceTextData[]
  rules?: Rule[]
  attrs?: Attrs
}
const defaultPageObj = {
  page: 1,
  size: 100
}
const fileType = ref()
const computedPostId = computed(() => postInfo.value?.postId || '')
let uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})
const isTemplateDisabled = ref<boolean>(true)
const langRange = ref<any>([])
const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  editForm.value.logo = val.response.path
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

onMounted(() => {
  console.log('执行')

  reqClientWebsiteConfig({ websiteId: websiteId.value })
    .then((res: any) => {
      // console.log('res2152', res)
      if (res.success) {
        // editWebsiteModel.value = true
        modalsStore.setModalData('websiteInfoModal', {
          ...modalsStore.websiteInfoModal.modalData,
          isVisible: true
        })
        modalsStore.showModal('websiteInfoModal')
        const { data } = res
        // websiteId.value = data.websiteId
        modalsStore.setModalData('websiteInfoModal', {
          ...modalsStore.websiteInfoModal.modalData,
          websiteId: data.websiteId
        })
        // editForm.value = data
        editForm.value = { ...data }
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
        if (editForm.value.ownerUserId !== '') {
          isTemplateDisabled.value = false
        } else {
          isTemplateDisabled.value = true
        }
        // console.log('data', data, editForm.value.ownerUserId, isTemplateDisabled.value)
        originTemplateRef = data.websiteTemplateRef
        originOwnerUserId = data.ownerUserId
        if (data.ownerUserId) {
          ownerUserIdValid = true
        }
        if (data.websiteTemplateRef) {
          templateRefValid = true
        }
        if (data.websiteTemplateRef == '') {
          // isTemplateDisabled.value = false
          isAreaDisabled.value = true
          isLangDisabled.value = true
          return Promise.reject('No template reference')
        } else {
          // isTemplateDisabled.value = false
          isAreaDisabled.value = false
          isLangDisabled.value = false
          console.log('data.websiteTemplateRef', data.websiteTemplateRef)
          const query: IReqListBlurTemplateAndSketchCodeQueryParams = {
            templateId: data.websiteTemplateRef,
            manageSiteId: manageSite.manageSiteId
          }
          return reqListBlurTemplateAndSketchCode(query)
        }
      } else {
        ElMessage({
          showClose: false,
          message: '获取站点信息失败',
          type: 'error',
          duration: 2000
        })
        return Promise.reject('Failed to get website info')
      }
    })
    .then((res: any) => {
      console.log('res2216', res)
      if (res.success) {
        const { data } = res
        if (data.length) {
          areaRange.value = Array.isArray(data[0].areaCodes)
            ? addTypeToObjects(optionsArea, 'option').filter((areaItem) => data[0].areaCodes.includes(areaItem.value))
            : []
          langRange.value = Array.isArray(data[0].langCodes)
            ? addTypeToObjects(optionsLang, 'option').filter((langItem) => data[0].langCodes.includes(langItem.value))
            : []
        }
        const page = 1,
          size = 1

        const query: IReqGetALLWebsiteListQueryParams = {
          manageSiteId: manageSite.manageSiteId,
          websiteId: websiteId.value,
          page,
          size
        }
        // IReqGetALLWebsiteListQueryParams
        // IReqGetALLWebsiteListData
        return reqGetALLWebsiteList(query)
      } else {
        ElMessage({
          showClose: false,
          message: res.errMessage,
          type: 'error',
          duration: 2000
        })
      }
    })
    .then((res: any) => {
      console.log('then', res)
      if (res.success) {
        const { data } = res
        const { areaCodes, langCodes } = data.list[0]
        editForm.value.areaCodes = areaCodes
        editForm.value.langCodes = langCodes
        console.log('editForm.value', editForm.value)
      }
    })
    .catch((error) => {
      console.error('error', error)
    })
})
const handleSuccessOfAttachment2 = async (val, prefixPostfixFlag) => {
  /* if (attachmentTotal.value >= 9) {
    ElMessage.warning('附件数量已达上限')
    return
  } */
  // console.log('val',val);
  editForm.value.icon = val.response.path
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
      // 保存成功后重新获取数据
      /* fetchAttachmentData().then(res=>{
        console.log('res', res)
        console.log('fileList', fileList.value)
      }) */
      //  uploadSingle.
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const areaRange = ref<any>([])
const querySearchTemplateRef = async (queryString: string, cb: (arg: any) => void) => {
  try {
    // 只有ownerid 才可以查询这个接口
    const response: any = await listBlurTemplateWithUserInfo({
      ownerUserId: editForm.value.ownerUserId,
      templateId: queryString,
      manageSiteId: manageSite.manageSiteId
    })
    if (response.success && response.data) {
      // console.log('response.data', response.data)
      const results = response.data.map((item: any) => ({
        value: item // 这个 value 属性是必须的，用于显示在输入框中
        // 可以添加其他需要的属性
      }))
      backUpWebsiteTemplateRefList = response.data.map((item: any) => item)
      // console.log('backUpWebsiteTemplateRefList', backUpWebsiteTemplateRefList);
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
let originTemplateRef = '',
  originOwnerUserId = ''
// 辅助检索选择下拉框templateRef
const handleSelectTemplateRef = (item: any) => {
  // console.log('item', item);
  editForm.value.websiteTemplateRef = item.value.templateId
  areaRange.value = addTypeToObjects(optionsArea, 'option').filter((areaItem) =>
    item.value.areaCodes.includes(areaItem.value)
  )
  langRange.value = addTypeToObjects(optionsLang, 'option').filter((langItem) =>
    item.value.langCodes.includes(langItem.value)
  )
  isLangDisabled.value = false
  isAreaDisabled.value = false
  nextTick(() => {
    editForm.value.areaCodes = areaRange.value.map((item) => item.value)
    editForm.value.langCodes = langRange.value.map((item) => item.value)
    // console.log('addForm.value.areaCodes', addForm.value);
  })
}
const initFormData = (): WebsiteInter => ({
  areaCodes: [],
  cdnUrl: '',
  createTime: 0,
  describe: '',
  hasStatsCode: 'y',
  keyWords: '',
  langCodes: [],
  memo: '',
  onlineServiceCode: '',
  ownerUserId: '',
  statsCodeInit: '',
  statsCodeJsUrl: '',
  templateName: '',
  userName: '',
  websiteId: '',
  websiteInnerName: '',
  websiteStatus: 'y',
  websiteTemplateRef: '',
  websiteTitle: ''
})
const handleSelectUserId = (item: { loginId: string; userId: string }) => {
  editForm.value.ownerUserId = item.userId
  editForm.value.websiteTemplateRef = ''
  isTemplateDisabled.value = false
}
const isAreaDisabled = ref<boolean>(true)
const isLangDisabled = ref<boolean>(true)
let blurObjArr: any[] = []
// const websiteId = ref<string>('')
const domainUnBindTabRef = ref()
const rules = ref<FormRules>({
  appDownloadUrl: [
    {
      required: false,
      message: '下载链接不能为空',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Function) => {
        // console.log('执行1111',value,value);
        if (!checkIsUrlOrNot(value) && value) {
          // console.log('planA');
          callback(new Error('请输入类似https://www.google.com/的URL！'))
        } else {
          // console.log('planB');
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  websiteInnerName: [{ required: true, message: '请输入内部名称', trigger: 'blur' }],
  websiteTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  statsCodeInit: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        // console.log('执行',value);
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
        // console.log('执行',value);
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback(new Error('不能包含中文字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
const editForm: any = ref(initFormData())
const domainBindTabRef = ref()
const formRef: any = ref()
const templateFormData = ref({})
const sketchFormData = ref({})
const emit = defineEmits(['updateComplete'])
// const editWebsiteModel: Ref<boolean> = ref<boolean>(false)
const editWebsiteModel: Ref<boolean> = computed(() => modalsStore.websiteInfoModal.isVisible)
let backUpOwnerUserIdList: string[] = []
let backUpWebsiteTemplateRefList: any[] = []
let templateRefValid = false
let ownerUserIdValid = false
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}
const handleEditWebSubmit = () => {
  // console.log('执行');
  if (editForm.value.ownerUserId == '') {
    editForm.value.websiteTemplateRef = ''
  }
  if (!formRef.value) return
  formRef.value.validate((valid: any, fields: any) => {
    // 提交时候额外验证条件
    let moreValid = false
    if (editForm.value.ownerUserId === '' && originOwnerUserId === '') {
      ownerUserIdValid = true
    }
    if (editForm.value.websiteTemplateRef === '' && originTemplateRef === '') {
      templateRefValid = true
    }
    if (!ownerUserIdValid) {
      ElMessage.error('该用户ID不存在')
    }
    if (!templateRefValid) {
      ElMessage.error('该绑定模板ID不存在')
    }
    if (templateRefValid && ownerUserIdValid) {
      moreValid = true
    } else {
      moreValid = false
    }
    let userDoNotHasDomain = true
    new Promise((resolve, reject) => {
      if (originOwnerUserId !== editForm.value.ownerUserId) {
        checkUserDomain({
          ownerUserId: originOwnerUserId,
          websiteId: editForm.value.websiteId
        })
          .then((res: any) => {
            // console.log('执行', res,res.errCode,res.success)
            if (res.success && res.data.length) {
              // console.log('执行A')
              userDoNotHasDomain = false
              ElMessage.error('该站点已经绑定其他域名！请先解绑！')
            } else if (!res.success && res.errCode == '30016') {
              userDoNotHasDomain = true
            } else if (!res.success && res.errCode == '30017') {
              // console.log('执行B')
              userDoNotHasDomain = false
              ElMessage.error('该站点已经绑定其他模板！请先解绑！')
            } else if (originOwnerUserId === '') {
              // console.log('执行C')
              userDoNotHasDomain = true
            }
            return resolve(userDoNotHasDomain)
          })
          .catch((error) => {
            console.error('Error fetching domain suggestions:', error)
            ElMessage.error('获取用户id时出错')
            return reject(error)
          })
      } else {
        // console.log('执行D')
        return resolve(true)
      }
    }).then((res) => {
      // return
      if (valid && moreValid && res) {
        // console.log('提交成功!')
        // 执行提交逻辑
        if (!websiteStatus.some((item) => item.value === editForm.value.websiteStatus)) {
          editForm.value.websiteStatus = ''
        }
        const editedForm = removeProperty(editForm.value, 'hasStatsCode')
        reqWebsiteCodeEdit(editedForm)
          .then((res) => {
            console.log('数据提交成功')
            // 例如：关闭对话框、刷新列表等
            if (res.success) {
              ElMessage({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              })
            } else {
              ElMessage({
                showClose: true,
                message: res.errMessage,
                type: 'error'
              })
            }
          })
          .catch((error) => {
            console.error('提交出错:', error)
          })
          .finally(() => {
            // editWebsiteModel.value = false
            modalsStore.setModalData('websiteInfoModal', {
              ...modalsStore.websiteInfoModal.modalData,
              isVisible: false
            })
            modalsStore.hideModal('websiteInfoModal')
            // 更新table
            emit('updateComplete')
          })
      } else {
        console.error('验证失败', fields, valid)
      }
    })

    // return
    // console.log('userDoNotHasDomain',userDoNotHasDomain);
  })
}
// 离开绑定模板input触发 inputを離れると発動する
const handleBlurTemplateRef = (e) => {
  if (backUpWebsiteTemplateRefList.some((item) => item.templateId === e.target.value)) {
    isLangDisabled.value = false
    isAreaDisabled.value = false
    templateRefValid = true
  } else if (e.target.value == '') {
    isLangDisabled.value = true
    isAreaDisabled.value = true
    langRange.value = []
    areaRange.value = []
    editForm.value.langCodes = []
    editForm.value.areaCodes = []
    templateRefValid = true
  } else if (e.target.value === originTemplateRef) {
    isLangDisabled.value = false
    isAreaDisabled.value = false
    templateRefValid = true
  } else {
    isLangDisabled.value = true
    isAreaDisabled.value = true
    langRange.value = []
    areaRange.value = []
    editForm.value.langCodes = []
    editForm.value.areaCodes = []
    templateRefValid = false
    ElMessage.error('该绑定模板ID不存在')
  }
}
// 离开绑定模板input触发 inputを離れると発動する
const handleBlurOwnerUserId = (e) => {
  if (backUpOwnerUserIdList.some((item) => item === e.target.value)) {
    // console.log('执行1')
    ownerUserIdValid = true
  } else if (e.target.value !== '' && !backUpOwnerUserIdList.some((item) => item === e.target.value)) {
    // 选择一个不存在的
    // console.log('执行2')
    ownerUserIdValid = false
    editForm.value.websiteTemplateRef = ''
    isTemplateDisabled.value = true
    langRange.value = []
    areaRange.value = []
    editForm.value.langCodes = []
    editForm.value.areaCodes = []
    isLangDisabled.value = true
    isAreaDisabled.value = true
    ElMessage.error('该用户ID不存在!')
  } else if (e.target.value == '') {
    // console.log('执行3')
    ownerUserIdValid = true
    editForm.value.websiteTemplateRef = ''
    isTemplateDisabled.value = true
    langRange.value = []
    areaRange.value = []
    editForm.value.langCodes = []
    editForm.value.areaCodes = []
    isLangDisabled.value = true
    isAreaDisabled.value = true
  } else {
    // console.log('执行4')
    ownerUserIdValid = false
    editForm.value.websiteTemplateRef = ''
    isTemplateDisabled.value = true
    langRange.value = []
    areaRange.value = []
    editForm.value.langCodes = []
    editForm.value.areaCodes = []
    isLangDisabled.value = true
    isAreaDisabled.value = true
  }
}
const querySearchUserLogin = async (queryString: string, cb: (arg: any) => void) => {
  try {
    const response = await reqUserList({
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
const rowAttrs = {
  gutter: 0,
  justify: 'center'
}
const initOptions = (): OptionItem[] => [
  {
    type: 'text',
    value: '',
    visible: true,
    label: '站点ID:',
    prop: 'websiteId',
    placeholder: '站点',
    textData: {
      isCopy: true
    },
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '内部名称:',
    prop: 'websiteInnerName',
    placeholder: '内部名称',
    rules: [
      {
        required: true,
        message: '内部名称不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
      // disabled:true,
    }
  },
  {
    type: 'input',
    value: '',
    label: '标题:',
    prop: 'websiteTitle',
    placeholder: '标题',
    rules: [
      {
        required: true,
        message: '标题不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  // 站点详细tab1和新增按钮后dialog
  {
    type: 'mAutoComplete',
    value: '',
    label: '绑定模版｜ID:',
    prop: 'websiteTemplateRef',
    attrs: {
      clearable: true,
      onSelect: (value) => {
        Object.assign(
          importantOptions,
          importantOptions.value.map((optionItem) =>
            optionItem.type === 'select'
              ? { ...optionItem, attrs: { ...optionItem.attrs, disabled: false } }
              : optionItem
          )
        )
        const selectedValue = value.key
        const choosedObj = blurObjArr.find((item) => item.templateId === selectedValue)
        const { areaCodes, langCodes } = choosedObj
        const currentFormData = formRef.value.getFormData()
        Object.assign(
          importantOptions,
          importantOptions.value.map((optionItem) =>
            optionItem.prop === 'websiteTemplateRef' ? { ...optionItem, value: value.key } : optionItem
          )
        )

        Object.assign(
          importantOptions,
          importantOptions.value.map((item) => {
            switch (item.prop) {
              case 'areaCodes':
                return {
                  ...item,
                  children: addTypeToObjects(optionsArea, 'option').filter((areaItem) =>
                    areaCodes.includes(areaItem.value)
                  ),
                  value: areaCodes
                }
              case 'langCodes':
                return {
                  ...item,
                  children: addTypeToObjects(optionsLang, 'option').filter((langItem) =>
                    langCodes.includes(langItem.value)
                  ),
                  value: langCodes
                }
              default:
                // 对于其他 prop，从 currentFormData 更新 value
                return {
                  ...item,
                  value: currentFormData[item.prop] || item.value
                }
            }
          })
        )
      },
      onChange(value) {}
    },
    autoData: {
      httpReq: (data) =>
        reqListBlurTemplateAndSketchCode({
          ...data,
          manageSiteId: manageSite.manageSiteId
        }),
      keyword: 'templateId',
      // 可以显示多项，进行拼接
      // displayFields: ['templateId'],
      displayFields: ['templateName', 'templateId'],
      placeholder: '绑定模板ID',
      // 后端返回的res是否是data还是list
      isList: false,
      // 是否分页，默认一页一百条
      isPage: true
    }
  },
  {
    // 新增和tab1时候
    type: 'input',
    value: '',
    label: '关键字:',
    prop: 'keyWords',
    placeholder: '关键字',
    rules: [
      {
        required: false,
        message: '关键字不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'input',
    value: '',
    label: '站点描述:',
    prop: 'describe',
    placeholder: '站点描述',
    rules: [
      {
        required: false,
        message: '站点描述不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  // 站点详细tab1
  {
    prop: 'ownerUserId',
    label: '用户ID:',
    type: 'mAutoComplete',
    autoData: {
      httpReq: (data) =>
        reqUserList({
          ...data,
          manageSiteId: manageSite.manageSiteId
        }),
      keyword: 'searchId',
      inputValue: 'userId',
      displayFields: ['loginId', 'userId'],
      placeholder: '',
      isList: true,
      isPage: true
    },
    value: ''
  },
  // dialog tab1
  {
    type: 'input',
    value: '',
    label: 'CDN地址:',
    prop: 'cdnUrl',
    placeholder: 'CDN地址',
    attrs: {
      clearable: true
    },
    rules: [
      {
        required: false,
        message: '',
        trigger: 'blur'
      }
    ]
  },
  {
    type: 'radio-group',
    value: 'y',
    label: '状态:',
    prop: 'websiteStatus',
    placeholder: '状态',
    rules: [
      {
        required: false,
        message: '状态不能为空',
        trigger: 'change'
      }
    ],
    children: addTypeToObjects(websiteStatus, 'radio')
  },
  {
    type: 'select',
    value: '',
    label: '语言:',
    prop: 'langCodes',
    placeholder: '语言',
    attrs: {
      multiple: true,
      style: {
        width: '100%'
      }
    },
    rules: [],
    children: addTypeToObjects(optionsLang, 'option')
  },
  {
    type: 'select',
    value: [],
    label: '地区:',
    prop: 'areaCodes',
    placeholder: '地区',
    attrs: { multiple: true },
    children: addTypeToObjects(optionsArea, 'option')
  },
  {
    type: 'input',
    value: '',
    label: '初始化代码:',
    prop: 'statsCodeInit',
    placeholder: '初始化代码',
    rules: [
      {
        required: false,
        message: '初始化代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      type: 'textarea',
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit
    }
  },
  {
    type: 'input',
    value: '',
    label: '统计代码URL:',
    prop: 'statsCodeJsUrl',
    placeholder: '统计代码',
    rules: [
      {
        required: false,
        message: '统计代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },

  {
    type: 'input',
    value: '',
    label: '在线客服代码:',
    prop: 'onlineServiceCode',
    placeholder: '在线客服代码',
    rules: [
      {
        required: false,
        message: '在线客服代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },
  {
    type: 'input',
    value: '',
    label: '备注:',
    prop: 'memo',
    placeholder: '备注',
    rules: [
      {
        required: false,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true,
      showWordLimit: true,
      maxlength: textAreaLimit,
      type: 'textarea'
    }
  },
  {
    type: 'dateText',
    value: '',
    label: '创建时间:',
    prop: 'createTime',
    placeholder: '',
    attrs: {
      clearable: false
    }
  }
]
const props = defineProps({
  formInfo: {
    type: Object
  },
  kengengaaruka: {
    type: Boolean,
    default: true
  }
})
const kengengaaruka = computed(() => {
  console.log(
    'modalsStore.websiteInfoModal.modalData?.hasRightToSubmit || false',
    modalsStore.websiteInfoModal.modalData?.hasRightToSubmit || false,
    modalsStore.websiteInfoModal?.modalData?.hasRightToSubmit
  )

  return modalsStore.websiteInfoModal.modalData?.hasRightToSubmit || false
})

const hasTemplateData = ref<boolean>(false)
const hasSketchData = ref<boolean>(false)
const resetForm = () => {
  formRef.value.setFormData(transformValues(importantOptions.value, formRef.value.getFormData()))
  modalsStore.setModalData('websiteInfoModal', {
    ...modalsStore.websiteInfoModal.modalData,
    isVisible: false
  })
  modalsStore.hideModal('websiteInfoModal')
}
const sketchOptionsInit: FormOptions[] = [
  {
    type: 'spliceText',
    value: '',
    label: '草图名称:',
    prop: 'sketchName',
    placeholder: '草图名称 | ID',
    spliceTextData: [
      {
        prop: 'sketchName',
        displayType: 'text',
        showCopy: false
      }
    ]
  },
  {
    type: 'text',
    value: '',
    label: '草图代码:',
    prop: 'sketchCode',
    textData: {
      isCopy: false
    }
  },
  {
    type: 'text',
    value: '',
    label: '草图类型:',
    prop: 'sketchType',
    placeholder: '草图类型',
    rules: [
      {
        required: false,
        message: '草图类型不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '语言:',
    prop: 'langCodes',
    placeholder: '请选择语言',
    rules: [
      {
        required: false,
        message: '语言不能为空',
        trigger: 'change'
      }
    ],
    attrs: {}
  },
  {
    type: 'text',
    value: '',
    label: '地区:',
    prop: 'areaCodes',
    placeholder: '地区',
    rules: [
      {
        required: false,
        message: '地区不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '备注:',
    prop: 'memo',
    placeholder: '备注',
    rules: [
      {
        required: false,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  }
]
function transformValues(options: any[], data: any): any {
  const transformedData: any = {}
  options.forEach((item) => {
    const { type, prop } = item
    if (type === 'text') {
      transformedData[prop] = data[prop]
    } else {
      if (Array.isArray(data[prop])) {
        transformedData[prop] = []
      } else {
        transformedData[prop] = ''
      }
    }
  })

  return transformedData
}
interface optionObjInter {
  data: any
  options: any[]
}
let templateOptions: FormOptions[] = [
  {
    type: 'spliceText',
    value: '',
    label: '模板名称 | ID:',
    prop: 'templateName',
    placeholder: '站点名称 | ID',
    spliceTextData: [
      {
        prop: 'templateName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'templateId',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  {
    type: 'text',
    value: '',
    label: '主题:',
    prop: 'theme',
    placeholder: '主题',
    attrs: {
      clearable: true
    }
  },
  {
    type: 'spliceText',
    value: '',
    label: '模板草图名称 | 代码:',
    prop: 'sketchName',
    placeholder: '站点名称 | ID',
    spliceTextData: [
      {
        prop: 'sketchName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'sketchCode',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  {
    type: 'spliceText',
    value: '',
    label: '系统模板名称 | ID:',
    prop: 'templateName',
    placeholder: '系统模板名称 | ID',
    spliceTextData: [
      {
        prop: 'sysTemplateRefName',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'sysTemplateRef',
        displayType: 'text',
        showCopy: true
      }
    ]
  },
  {
    type: 'text',
    value: '',
    label: 'CDN地址:',
    prop: 'cdnUrl',
    placeholder: 'CDN地址',
    rules: [
      {
        required: false,
        message: 'CDN地址不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '在线客服代码:',
    prop: 'onlineServiceCode',
    placeholder: '在线客服代码',
    rules: [
      {
        required: false,
        message: '在线客服代码不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '统计代码链接:',
    prop: 'statsCodeJsUrl',
    placeholder: '统计代码链接',
    rules: [
      {
        required: false,
        message: '统计代码链接不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  },
  {
    type: 'text',
    value: '',
    label: '备注:',
    prop: 'memo',
    placeholder: '备注',
    rules: [
      {
        required: false,
        message: '备注不能为空',
        trigger: 'blur'
      }
    ],
    attrs: {
      clearable: true
    }
  }
]
const isLoading2 = ref<boolean>(false)
let templateColumOption: any = {
  twoColum: 20,
  threeColum: 30
}
let sketchColumOption: any = {
  twoColum: 20,
  threeColum: 30
}
const sketchOptions = ref(sketchOptionsInit)
const importantOptions = ref(initOptions())

const isEditForm = ref<boolean>(false)
const activeName: Ref<string> = ref<string>('first')

function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0
}
const bindType = ref<string>('1')
const isTabs = ref<boolean>(false)
const distinguish = ref<boolean>(false)
const isMemoTab = ref<boolean>(false)
const searchTemplateFormInfo = async (id) => {
  try {
    let res: any = await reqClientTemplateInfoByWebsiteId({ type: bindType.value, websiteId: id })
    if (res.success && !isEmptyObject(res.data)) {
      hasTemplateData.value = true
      const { data } = res
      nextTick(() => {
        templateFormData.value = data
      })
    } else {
      hasTemplateData.value = false
    }
  } catch (err) {
    console.log(err)
  } finally {
    isLoading2.value = false
  }
}
interface MappingObj {
  langCodes: { value: string; label: string }[]
  areaCodes: { value: string; label: string }[]
}
const updatedSketchOptions = <T extends OptionItem>(
  options: T[],
  originData: { [key: string]: any },
  langAndAreaObj: { [key: string]: any },
  mappingObj: MappingObj
): T[] => {
  return options.map((optionItem) => {
    const { prop } = optionItem
    if (prop in originData) {
      optionItem.value = originData[prop]
    }
    if (prop in langAndAreaObj) {
      optionItem.type = 'text'
      let langAndAreaValue = langAndAreaObj[prop]
      if (Array.isArray(langAndAreaValue)) {
        optionItem.value = langAndAreaValue.join(',')
      } else {
        optionItem.value = langAndAreaValue
      }
    }
    console.log('prop', prop)
    if (optionItem.value && typeof optionItem.value === 'string' && prop in langAndAreaObj) {
      const values = optionItem.value.split(',')
      const mapping = prop === 'langCodes' ? mappingObj.langCodes : mappingObj.areaCodes
      optionItem.value = values
        .map((val) => {
          const mapped = mapping.find((item) => item.value === val.trim())
          return mapped ? mapped.label : val
        })
        .join(',')
    }
    return optionItem
  })
}
const searchSketchFormInfo = (id) => {
  reqSketchInfoByWebsiteId({ type: bindType.value, websiteId: id })
    .then((res: any) => {
      if (res.success) {
        const {
          data: { sketchCode }
        } = res
        if (isEmptyObject(res.data)) {
          hasSketchData.value = false
          return
        } else {
          hasSketchData.value = true
          return reqLangAndAreaCodesBasedOnSketch({ sketchCode }).then((res2) => {
            return Promise.resolve({ originData: res, res: res2 })
          })
        }
      } else {
        hasSketchData.value = false
      }
    })
    .then((resObj: any) => {
      const langAndAreaObj = resObj.res.data,
        sketchMessage = resObj.originData.data
      let _newOptions = updatedSketchOptions(sketchOptions.value, sketchMessage, langAndAreaObj, {
        langCodes: optionsLang,
        areaCodes: optionsArea
      })
      _newOptions = _newOptions.map((option) => {
        if (option.prop === 'sketchType') {
          return {
            ...option,
            value: optionsSketch.find((item) => item.value === option.value)?.label || option.value
          }
        }
        return option
      })
      sketchOptions.value = _newOptions
      distinguish.value = true
    })
    .catch((error) => {
      console.error('error', error)
    })
    .finally(() => {
      isLoading2.value = false
    })
}
const closeEditDialog = () => {
  modalsStore.setModalData('websiteInfoModal', {
    ...modalsStore.websiteInfoModal.modalData,
    isVisible: false
  })
  modalsStore.hideModal('websiteInfoModal')
  isEditForm.value = false
  isTabs.value = false
  distinguish.value = false
  isMemoTab.value = false
  activeName.value = 'first'
}
const handleTabChange = (TabPaneName) => {
  switch (TabPaneName) {
    case 'first':
      break
    case 'second':
      searchTemplateFormInfo(websiteId.value)
      break
    case 'third':
      searchSketchFormInfo(websiteId.value)
      break
    case 'fourth':
      if (domainBindTabRef.value) {
        ;(domainBindTabRef.value as any).dadDoFetch({ websiteRef: websiteId.value })
      }
      break
    case 'fifth':
      if (domainUnBindTabRef.value) {
        ;(domainUnBindTabRef.value as any).dadDoFetch({ websiteRef: '' })
      }
      break
    default:
  }
}
type DefaultObjectType = {
  [key: string]: any
}
function transformObject(obj: DefaultObjectType, keysToTransform: string[]): DefaultObjectType {
  const result: DefaultObjectType = { ...obj }
  for (const key of keysToTransform) {
    if (key in result) {
      if (typeof result[key] === 'string' && result[key].trim() === '') {
        result[key] = []
      }
    }
  }
  return result
}
let selectableTemplateRefList: any[] = []
let hasToCloseDialog: boolean = true
const submitForm = (scope) => {
  hasToCloseDialog = true
  scope.form.validate(async (valid) => {
    if (valid) {
      try {
        const _params = { ...toRaw(scope.model) }
        const params = transformObject(_params, ['areaCodes', 'langCodes'])
        if (selectableTemplateRefList.length) {
          const { websiteTemplateRef } = params
          if (websiteTemplateRef && !selectableTemplateRefList.some((item) => item.templateId === websiteTemplateRef)) {
            hasToCloseDialog = false
            ElMessage({
              message: '该模板不存在！',
              type: 'warning',
              duration: 2000
            })
          }
        }
        if (params.websiteTemplateRef === '') {
          params.areaCodes = []
          params.langCodes = []
        }
        if (hasToCloseDialog) {
          const res: any = await reqWebsiteCodeEdit(params)
          if (res.success) {
            ElMessage({
              showClose: true,
              message: '编辑成功',
              type: 'success'
            })
          } else {
            ElMessage({
              showClose: true,
              message: res.errMessage,
              type: 'error'
            })
          }
        }
      } catch (err) {
        console.log(err)
      } finally {
        if (hasToCloseDialog) {
          modalsStore.setModalData('websiteInfoModal', {
            ...modalsStore.websiteInfoModal.modalData,
            isVisible: false
          })
          modalsStore.hideModal('websiteInfoModal')
          isLoading2.value = false
          emit('updateComplete')
        }
      }
    } else {
      ElMessage.error('内部名称或标题不能为空!')
    }
  })
}

const handleEditWebsite = (param) => {
  const colArea = param.areaCodes
  const colLang = param.langCodes
  if (!param.websiteId) {
    param.websiteId = param.websiteRef
  }
  reqClientWebsiteConfig({ websiteId: param.websiteId })
    .then((res: any) => {
      if (res.success) {
        modalsStore.setModalData('websiteInfoModal', {
          ...modalsStore.websiteInfoModal.modalData,
          isVisible: true
        })
        modalsStore.showModal('websiteInfoModal')
        const { data } = res
        modalsStore.setModalData('websiteInfoModal', {
          ...modalsStore.websiteInfoModal.modalData,
          websiteId: data.websiteId
        })
        editForm.value = { ...data }
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
        if (editForm.value.ownerUserId !== '') {
          isTemplateDisabled.value = false
        } else {
          isTemplateDisabled.value = true
        }
        originTemplateRef = data.websiteTemplateRef
        originOwnerUserId = data.ownerUserId
        if (data.ownerUserId) {
          ownerUserIdValid = true
        }
        if (data.websiteTemplateRef) {
          templateRefValid = true
        }
        if (data.websiteTemplateRef == '') {
          isAreaDisabled.value = true
          isLangDisabled.value = true
          return Promise.reject('No template reference')
        } else {
          isAreaDisabled.value = false
          isLangDisabled.value = false
          const query: IReqListBlurTemplateAndSketchCodeQueryParams = {
            templateId: data.websiteTemplateRef,
            manageSiteId: manageSite.manageSiteId
          }
          return reqListBlurTemplateAndSketchCode(query)
        }
      } else {
        ElMessage({
          showClose: false,
          message: '获取站点信息失败',
          type: 'error',
          duration: 2000
        })
        return Promise.reject('Failed to get website info')
      }
    })
    .then((res: any) => {
      if (res.success) {
        const { data } = res
        areaRange.value = Array.isArray(data[0].areaCodes)
          ? addTypeToObjects(optionsArea, 'option').filter((areaItem) => data[0].areaCodes.includes(areaItem.value))
          : []
        langRange.value = Array.isArray(data[0].langCodes)
          ? addTypeToObjects(optionsLang, 'option').filter((langItem) => data[0].langCodes.includes(langItem.value))
          : []
        editForm.value.areaCodes = colArea
        editForm.value.langCodes = colLang
      } else {
        ElMessage({
          showClose: false,
          message: res.errMessage,
          type: 'error',
          duration: 2000
        })
      }
    })
}

defineExpose({ handleEditWebsite })
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
.duan {
  width: 80%;
}
.babali {
  margin-right: 10px;
  width: 4rem;
  height: 4rem;
  border: 1px solid #ccc;
  // background-color: pink;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  .uploaded-image {
    position: relative;
    /* 使遮罩层相对于这个容器定位 */
    // width: 100%;
    /* 图片宽度100% */
    // height: 100%;
    // object-fit: contain;
    /* 图片高度100% */

    /* 圆角 */
  }

  .overlay {
    cursor: pointer;
    z-index: 100;
    background-color: blue;
    position: absolute;
    /* 绝对定位 */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(128, 128, 128, 0.8);
    /* 灰色遮罩层，50%透明度 */
    opacity: 0;
    /* 初始透明度为0 */
    transition: opacity 0.3s;
    /* 添加过渡效果 */
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
