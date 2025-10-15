<template>
  <section id="system_account" class="main_container">
    <section ref="tableRef">
      <el-form ref="queryRef" :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="activityName">
          <AutoComplete
            v-model="queryForm.activityName"
            :httpFunc="reqHttp"
            keyword="activityName"
            placeholder="活动名称"
            :displayFields="['activityName']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.beginTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item prop="talents">
          <el-select v-model="queryForm.talents" placeholder="对象" multiple>
            <el-option v-for="(value, key) in talentMap" :label="value" :value="key" />
          </el-select>
        </el-form-item>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openAddDialog">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <section class="main_flex_table">
      <m-table
        class="m_table_image"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #imageInfo="{ scope }">
          <el-image
            v-if="scope.row.imgPath"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.imgPath"
          ></el-image>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #activityName="{ scope }">
          <p class="like-a overflow-hidden" type="primary" @click="openEditDialog(scope.row)">
            {{ scope.row.activityName }}
          </p>
        </template>
        <template #beginTime="{ scope }">
          {{ unitFormatDate(scope.row.beginTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #talents="{ scope }">
          {{ getTalents(scope.row) }}
        </template>
        <template #state="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.state === '1' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.state"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="() => statusChanged(scope.row)"
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>

  <el-dialog v-model="isFormDialog" class="tabs-dialog" draggable overflow destroy-on-close @close="closeDialog">
    <mTabPane class="article-content" label="活动详细">
      <el-form :model="editForm" ref="formRef" :rules="formRules" style="display: flex" class="dialog-form">
        <div style="flex: 0.5">
          <el-form-item label="活动名称：" prop="activityName">
            <el-input v-model="editForm.activityName" maxlength="20" />
          </el-form-item>
          <el-form-item label="活动时间：" prop="beginTime">
            <TimeSelect
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-model:startDate="editForm.beginTime"
              v-model:endDate="editForm.endTime"
              :minDate="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
            ></TimeSelect>
          </el-form-item>
          <el-form-item label="针对对象：" prop="talents">
            <el-select v-model="editForm.talents" multiple placeholder="">
              <el-option v-for="(value, key) in talentMap" :label="value" :value="key" />
            </el-select>
          </el-form-item>
          <el-form-item label="URL：" prop="url">
            <el-input v-model="editForm.url" />
          </el-form-item>
          <el-form-item label="状态：" prop="state">
            <el-radio-group v-model="editForm.state">
              <el-radio value="1">启用</el-radio>
              <el-radio value="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formMode == 'edit'" label="创建时间：" prop="createTime">
            {{ unitFormatDate(editForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" v-model="editForm.remark" show-word-limit maxlength="64" :rows="3" />
          </el-form-item>
        </div>

        <div style="flex: 0.5" class="image-upload-wrapper">
          <el-form-item label="" :class="{ 'hide-add': fileList.length >= 1 }" class="image-container">
            <el-upload
              :multiple="true"
              listType="picture-card"
              :limit="1"
              :fileList="fileList"
              :on-remove="onRemove"
              :on-success="onSuccess"
              :on-error="onError"
              :on-progress="onProgress"
              :on-change="onChange"
              :before-upload="beforeUpload"
              :before-remove="beforeRemove"
              :http-request="handelCustomRequest"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>

      <div class="button-row">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit">提交</el-button>
      </div>
    </mTabPane>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import i18n from '@/i18n'
const { t } = i18n.global as any
import { reqHttp, editHttp, addHttp, IReqHttpData } from '@/api/user/activityCenter'
import TimeSelect from '@/components/timeSelect2/index.vue'
import { createUrlValidator } from '@/utils/validators'
import { TableOptions } from '@/components/mTable/types'
import showErrorMessage from '@/utils/showErrorMessage'
import { sessionCache } from '@/hooks/useSession'
import { UploadUserFile } from 'element-plus'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { uploadSingle } from '@/api/system/upload'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { IAddHttpQueryParams } from '@/api/user/activityCenter/types'
import { IUploadRequestConfig, UploadFrom } from '@/api/system/upload/types'
import { FileType } from '@/constants/enums'
import Cookies from 'js-cookie'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'

const { VITE_PROXY_UPLOAD, VITE_CDN_URL, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

// Refs
const tableRef = ref()
const tableData = ref<IReqHttpData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const isLoading = ref(false)
const formRef = ref()
const isFormDialog = ref(false)
const formMode = ref()
const fileList = ref<UploadUserFile[]>([])
const talentMap = {
  1: '高手',
  2: '专家'
}

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'url',
    label: '图标',
    slot: 'imageInfo',
    width: 56,
    columAttr: {
      align: 'center'
    }
  },
  {
    prop: 'activityName',
    label: '活动名称',
    slot: 'activityName'
  },
  {
    prop: 'beginTime',
    label: '开始时间',
    slot: 'beginTime',
    width: 180
  },
  {
    prop: 'endTime',
    label: '结束时间',
    slot: 'endTime',
    width: 180
  },
  {
    prop: 'talents',
    label: '针对对象',
    slot: 'talents'
  },
  {
    prop: 'state',
    label: '状态',
    slot: 'state',
    width: 100
  },
  {
    prop: 'remark',
    label: '备注',
    width: 170
  }
]

const formRules = reactive({
  activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  beginTime: [{ required: true, message: '请选择活动时间', trigger: 'blur' }],
  talents: [{ required: true, message: '请选择针对对象', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入url', trigger: 'blur' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ]
})

const initQueryFormValue = () => ({
  activityName: '',
  beginTime: null,
  endTime: null,
  talents: [],
  manageSiteId: ''
})
const queryForm = reactive(initQueryFormValue())
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

const initEditForm = () => ({
  activityId: '',
  activityName: '',
  beginTime: null,
  endTime: null,
  talents: [],
  url: '',
  state: '1',
  createTime: '',
  remark: '',
  imgPath: ''
})
const editForm = reactive(initEditForm())

const openAddDialog = () => {
  fileList.value = []
  Object.assign(editForm, initEditForm())
  formMode.value = 'add'
  isFormDialog.value = true
}
const openEditDialog = (row) => {
  fileList.value = []
  if (row.imgPath) {
    const parts = row.imgPath?.split('/')
    const lastPart = parts[parts.length - 1]
    fileList.value.push({ name: lastPart, url: VITE_CDN_URL + row.imgPath })
  }
  Object.assign(editForm, row)
  formMode.value = 'edit'
  isFormDialog.value = true
}

const closeDialog = () => {
  formRef.value.resetFields()
  isFormDialog.value = false
}

// Methods
const fetchData = async (val?) => {
  isLoading.value = true
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    ...queryForm
  }
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response!.data!.list
      total.value = response!.data!.total
      if (total.value < (currentPage.value - 1) * pageSize.value) {
        currentPage.value = 1
        fetchData()
      }
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const statusChanged = (row) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    })
      .then(() => {
        updateStatus(row).then(resolve).catch(reject)
      })
      .catch(() => {
        reject(new Error('用户取消操作'))
      })
  })
}

const updateStatus = async (row) => {
  const params = row
  params.state = row.state === '1' ? '0' : '1'

  try {
    const response = await editHttp(params)
    if (response.success) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      return Promise.resolve()
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
      return Promise.reject(new Error(response.errMessage))
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '保存数据时出错',
      type: 'error'
    })

    return Promise.reject(error)
  }
}

const handleSubmit = async () => {
  let isValid = false
  if (fileList.value.length == 0) {
    ElMessage({
      message: '活动主题图片为必入项目',
      type: 'error',
      plain: true
    })
    return
  }
  await formRef.value.validate((valid, fields) => {
    isValid = valid
  })
  if (!isValid) {
    return
  }
  if (fileList.value.length === 0) {
    editForm.imgPath = ''
  }
  let params = editForm
  try {
    const response = formMode.value === 'add' ? await addHttp(params) : await editHttp(params)
    if (response.success) {
      fileList.value = []
      if (formMode.value === 'add') {
        currentPage.value = 1
      }
      fetchData() // 保存成功后重新获取数据
      isFormDialog.value = false
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  } finally {
  }
}

//上传部分 功能
let fileData = ref()
const handleBeforeUpload = (file: File) => {
  fileData.value = file
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  return true
}

const onPreview = (file) => {
  console.log('Preview file:', file)
  // Implement preview logic here, e.g., open a modal with the image
}

const onRemove = (file, fileList) => {
  console.log('Removed file:', file)
  console.log('Current fileList:', fileList)
}

const onSuccess = (response, uploadFile, fileList) => {
  console.log('Upload success:', response)
}

const onError = (error, file, fileList) => {
  console.error('Upload error:', error)
  ElMessage.error('File upload failed')
}

const onProgress = (event, file, fileList) => {
  console.log('Upload progress:', event.percent)
}

const onChange = (file, fList) => {
  console.log('File changed:', file)
  console.log('Current fileList:', fList)
  fileList.value = fList
}

const beforeUpload = (file) => {
  return handleBeforeUpload(file)
}

const beforeRemove = (file, fileList) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm('确认删除该图片?')
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

const handelCustomRequest = async (options: any) => {
  const param = {
    fileType: FileType.IMG,
    uploadFrom: UploadFrom.USER_ACTIVITY_CENTER,
    storageStyle: 6
  }
  // 如果你能确保 fileType 一定有值，可以使用类型断言
  const formData: any = {
    file: options.file,
    storageType: VITE_STORY_TYPE,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
    ...param
  }
  const obj: IUploadRequestConfig = {
    baseurl: VITE_PROXY_UPLOAD,
    contenttype: 'multipart/form-data'
  }
  await uploadSingle(formData, obj)
    .then((response) => {
      const { path } = response.data!
      editForm.imgPath = path
      uploadLog(response)
      onSuccess(response.data, options.file, options.fileList)
    })
    .catch((error) => {
      console.log(error)
    })
}

const uploadLog = async (param) => {
  if (!param && fileData.value.length <= 0) {
    console.log()
    return
  }
  const uploadUser = sessionCache.getCache('userID')
  const formData: IAddHttpQueryParams = {
    storageStyle: 6,
    talents: [],
    fileType: 'img',
    uploadFrom: param.data.path,
    uploadTarget: fileData.value.name,
    storageType: VITE_STORY_TYPE,
    uploadUser,
    biz: 'upload',
    fileSize: fileData.value.size,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod'
  }
  await addHttp(formData)
    .then((response) => {
      ElMessage.success('上传成功')
    })
    .catch((error) => {
      showErrorMessage(error)
    })
}

const getTalents = (row) => {
  return row.talents.map((talent) => talentMap[talent]).join('、')
}

// Lifecycle hooks
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    object-fit: contain;
  }

  :deep(.el-form-item__content) {
    justify-content: center;
  }
}

:deep(.el-icon--zoom-in) {
  display: none;
}

:deep(.el-dialog__body) {
  height: 500px !important;
  background-color: aqua;
}

:deep(.hide-add) {
  .el-upload--picture-card {
    display: none;
  }
}

.article-content {
  :deep(.el-upload--picture-card) {
    width: 350px;
    height: 525px;
  }

  :deep(.el-upload-list__item) {
    width: 350px;
    height: 525px;
  }
}
</style>
