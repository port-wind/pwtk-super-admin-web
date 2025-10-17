<template>
  <section id="system_account" class="main_container">
    <section ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item prop="siteName">
          <AutoComplete
            v-model="queryForm.siteName"
            :httpFunc="getListBlurSiteName"
            keyword="siteName"
            placeholder="站点名称"
            :displayFields="['siteName']"
            :trigger-on-focus="true"
            :isPage="false"
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="siteId">
          <AutoComplete
            v-model="queryForm.siteId"
            :httpFunc="getListBlurSiteId"
            keyword="siteId"
            placeholder="站点ID"
            :displayFields="['siteId']"
            :trigger-on-focus="true"
            :isPage="false"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="focusGameType">
          <el-select v-model="queryForm.focusGameType" placeholder="彩种" multiple>
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleAddButton">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('website')">
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
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
      >
        <template #imageInfo="{ scope }">
          <el-image
            v-if="scope.row.siteLogo"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.siteLogo"
          ></el-image>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #siteInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleTableEdit(scope)">
            {{ scope.row.siteName }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <!-- <p>{{ gameTypeList?.find((item) => item.value === scope.row.focusGameType)?.label }}</p> -->
          <p class="overflow-hidden">
            {{
              scope.row.focusGameType
                .map((type) => gameTypeList?.find((item) => item.value === type)?.label)
                .filter(Boolean)
                .join(', ')
            }}
          </p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #isSwitch="{ scope }">
          <el-tag class="mx-1" type="danger" style="cursor: pointer" @click="statusChanged(scope.row)">删除</el-tag>
        </template>
      </m-table>
    </section>
    <!-- 网站大全弹出框 -->
    <section class="dialogAdd">
      <el-dialog v-model="addDialogVisible" draggable overflow destroy-on-close class="tabs-dialog">
        <el-tabs class="m_tabs" v-model="activeTab">
          <el-tab-pane label="网站" name="web_tab" class="m_tabs_pane">
            <m-form
              class="dialog-form"
              ref="dialogFormRef"
              :file-list="fileList"
              :modelForm="lineFormData"
              :options="formMode === 'add' ? addDialogOptions : editDialogOptions"
              :rules="rulesAdd"
              :uploadData="uploadData"
              :rowAttrs="rowAttrs"
              :commonSpan="10"
              label-width="100px"
              @on-success="handleSuccess"
              @on-exceed="handleExceed"
              @on-remove="handleRemove"
            >
              <template #uploadArea>
                <el-icon>
                  <Plus />
                </el-icon>
              </template>
              <template #action="scope">
                <section class="button-row">
                  <el-button @click="closeDialog">取消</el-button>
                  <el-button type="primary" @click="handleSubmit(scope)">提交</el-button>
                </section>
              </template>
            </m-form>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </section>
    <checkbox-table v-if="modalsStore.checkboxTable.isVisible" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/i18n'
import { cloneDeep } from 'lodash-es'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useWebApi } from '@/api/photoSys/web/index'
import type { TableData, GetRequest, AddRequest, EditRequest } from '@/api/bss/mainboardManagement/types'
import { TableOptions } from '@/components/mTable/types'

import mTable from '@/components/mTable/index.vue'

import AutoComplete from '@/components/AutoComplete/index.vue'

import showErrorMessage from '@/utils/showErrorMessage'
import { handleSpecialClick } from '@/components/checkboxTable/util'
//上传相关
import type { UploadUserFile } from 'element-plus'
import { createUrlValidator } from '@/utils/validators'
import { dialogOptions } from './data'
import { useModalsStore } from '@/stores/modalStore'
import { getGameTypePlatformList } from '@/api/global'

const { VITE_CDN_URL } = webConfigApi

const { t } = i18n.global as any
const isShowCheckboxTable = true
const tableRef = ref()
const queryRef = ref()

const rowAttrs = {
  gutter: 0,
  justify: 'center'
}
const uploadData = {
  fileType: 'img',
  uploadFrom: 'tk/website/icon',
  storageStyle: 6
}
const modalsStore = useModalsStore()
const tableData = ref<TableData[]>([])

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

const activeTab = ref('web_tab') //tab切换第一条

//新增弹窗
const addDialogVisible = ref(false)
//编辑弹窗

//loading 按钮
const isLoading = ref(false)

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

const dialogFormRef = ref()

const initForm = () => ({
  siteName: '',
  siteId: '',
  focusGameType: [],
  manageSiteId: ''
})

const queryForm = reactive(initForm())
const gameTypeList = ref<any[]>()
const manageSiteId = computed(() => queryForm.manageSiteId)
const {
  list,
  create,
  edit,
  del,
  existSiteName,
  getNewsPaperList,
  existSiteId,
  getListBlurSiteId,
  getListBlurSiteName
} = useWebApi(manageSiteId)
const initEditForm = () => {
  return {
    siteId: '',
    siteLogo: '',
    siteName: '',
    isRecommended: 'n',
    isHot: 'n',
    isSelected: 'n',
    isTop: 'n',
    isBloom: 'n',
    focusGameType: [],
    siteUrl1: '',
    siteUrl2: '',
    siteUrl3: '',
    siteUrl4: '',
    siteUrl5: '',
    siteDesc: '',
    memo: '',
    createTime: '',
    sortNum: 0
  }
}

// add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref(initEditForm())
const forGameTypeList = computed(() => {
  return gameTypeList.value?.map((item: any) => {
    return {
      ...item,
      type: 'option'
    }
  })
})
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'siteLogo',
    label: '图标',
    slot: 'imageInfo',
    width: 56,
    columAttr: {
      align: 'center'
    }
  },
  {
    prop: 'siteName',
    label: '站点名称',
    slot: 'siteInfo',
    minWidth: 120
  },
  {
    prop: 'sortNum',
    label: '排序编号',
    align: 'right',
    minWidth: 80
  },
  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    minWidth: 200
  },
  {
    prop: 'siteDesc',
    label: '站点描述',
    showOmission: true,
    minWidth: 200
  },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    minWidth: 220
  },
  {
    prop: 'memo',
    label: '备注',
    minWidth: 200,
    showOmission: true
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    minWidth: 100
  },
  {
    prop: 'isSwitch',
    label: '操作',
    slot: 'isSwitch',
    minWidth: 80
  }
]

const gameTypeOptions = {
  prop: 'focusGameType',
  label: '彩种:',
  type: 'select',
  attrs: {
    multiple: true,
    style: {
      width: '100%'
    }
  },
  children: forGameTypeList
}

const gameTypeOptions1 = {
  prop: 'focusGameType',
  label: '彩种:',
  type: 'select',
  attrs: {
    multiple: true,
    style: {
      width: '100%'
    }
  },
  children: forGameTypeList,
  columnSpan: 5
}
const initAddDialogOptions = () => {
  return [
    dialogOptions.siteLogo,
    dialogOptions.siteIdInput,
    gameTypeOptions1,
    dialogOptions.isRecommended,
    dialogOptions.siteNameInput,
    dialogOptions.sortNum,
    dialogOptions.isHot,
    dialogOptions.siteUrl1,
    dialogOptions.isTop,
    dialogOptions.siteUrl2,
    dialogOptions.isSelected,
    dialogOptions.siteUrl3,
    dialogOptions.isBloom,
    dialogOptions.siteUrl4,
    dialogOptions.siteDesc,
    dialogOptions.siteUrl5,
    dialogOptions.memo
  ]
}

const initEditDialogOptions = () => {
  return [
    dialogOptions.siteLogo,
    dialogOptions.siteIdText,
    dialogOptions.isRecommended,
    dialogOptions.siteNameInput,
    dialogOptions.sortNum,
    dialogOptions.isHot,
    gameTypeOptions,
    dialogOptions.isTop,
    dialogOptions.siteUrl1,
    dialogOptions.isSelected,
    dialogOptions.siteUrl2,
    dialogOptions.isBloom,
    dialogOptions.siteUrl3,
    dialogOptions.createTime,
    dialogOptions.siteUrl4,
    dialogOptions.siteDesc,
    dialogOptions.siteUrl5,
    dialogOptions.memo
  ]
}
//新增时候需要的数据
const addDialogOptions = reactive(initAddDialogOptions())
const editDialogOptions = reactive(initEditDialogOptions())

//新增的时候的
const rulesAdd = ref({
  siteName: [{ required: true, message: '站点名称不能为空', trigger: 'blur' }],
  siteId: [
    { required: true, message: '站点ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]*$/, message: '站点ID不符合标准', trigger: 'blur' }
  ],
  focusGameType: [{ required: true, message: '彩种不能为空', trigger: 'blur' }],
  siteUrl1: [
    { required: true, message: 'URL1不能为空', trigger: 'blur' },
    { validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }
  ],
  siteUrl2: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl3: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl4: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  siteUrl5: [{ validator: createUrlValidator('URL格式不正确'), trigger: 'blur' }],
  sortNum: [{ pattern: /^[0-9]\d*$/, message: '排序编号应为整数', trigger: 'blur' }]
})

//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
const checkSiteIdExists = async (siteId: string): Promise<boolean> => {
  try {
    const existOrNot = await existSiteId({ siteId })
    if (existOrNot.success) {
      if (existOrNot.data) {
        ElMessage.error('站点ID已存在')
        return true
      }
      return false
    } else {
      showErrorMessage(existOrNot)
      return true // Assume it exists if there's an error, to prevent proceeding
    }
  } catch (error) {
    console.error('Error checking site ID:', error)
    ElMessage.error('检查站点ID时发生错误')
    return true // Assume it exists if there's an error, to prevent proceeding
  }
}
const checkSiteNameExists = async (siteName: string, siteId?: string): Promise<boolean> => {
  let params: { siteName: string; siteId?: string | undefined }
  if (formMode.value === 'add') {
    params = { siteName }
  } else if (formMode.value === 'edit') {
    params = { siteName, siteId }
  } else {
    return false
  }
  try {
    const existOrNot = await existSiteName({ ...params })
    if (existOrNot.success) {
      if (existOrNot.data) {
        ElMessage.error('站点名称已存在')
        return true
      }
      return false
    } else {
      showErrorMessage(existOrNot)
      return true // Assume it exists if there's an error, to prevent proceeding
    }
  } catch (error) {
    console.error('Error checking site ID:', error)
    ElMessage.error('检查站点名称时发生错误')
    return true // Assume it exists if there's an error, to prevent proceeding
  }
}
const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model

      let params = row
      if (imgUrl.value) {
        params.siteLogo = imgUrl.value
      } else if (!fileList.value.length) {
        params.siteLogo = null
      }
      if (formMode.value === 'edit') {
        params.createTime = lineFormData.value.createTime
      }
      if (params.sortNum == '' || !params.sortNum) {
        params.sortNum = '0'
      }
      try {
        if (formMode.value === 'add') {
          const siteIdExists = await checkSiteIdExists(row.siteId)
          const siteNameExists = await checkSiteNameExists(row.siteName)
          if (siteIdExists || siteNameExists) {
            return // Exit if the site ID already exists
          }
        }
        if (formMode.value === 'edit') {
          const siteNameExists = await checkSiteNameExists(row.siteName, row.siteId)
          if (siteNameExists) {
            return // Exit if the site ID already exists
          }
        }

        const response =
          formMode.value === 'add' ? await create(params as AddRequest) : await edit(params as EditRequest)

        if (response.success) {
          ElMessage.success(formMode.value === 'add' ? '添加成功' : '更新成功')
          if (formMode.value === 'add') {
            currentPage.value = 1
            pageSize.value = 15
          }
          fetchData() // 保存成功后重新获取数据
          addDialogVisible.value = false
          fileList.value = []
          imgUrl.value = ''
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

/**
 * 状态变化处理函数，返回一个Promise以满足before-change的要求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const statusChanged = (row) => {
  return ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      updateStatus(row)
    })
    .catch(() => {})
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  const { siteId } = row

  try {
    const response = await del({ siteId })
    if (response.success) {
      ElMessage({
        message: '删除成功',
        type: 'success'
      })
      fetchData()
      return Promise.resolve()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '操作数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
}

//弹窗编辑按钮点击
const handleTableEdit = async (scope: any) => {
  formMode.value = 'edit'
  addDialogVisible.value = true
  fileList.value = []
  lineFormData.value = initEditForm()
  await nextTick()
  lineFormData.value = cloneDeep(scope.row)
  if (lineFormData.value.siteLogo) {
    const parts = lineFormData.value.siteLogo.split('/')
    const lastPart = parts[parts.length - 1]
    fileList.value.length < 1 &&
      fileList.value.push({ name: lastPart, url: VITE_CDN_URL + lineFormData.value.siteLogo })
  }
}

//弹窗添加按钮点击
const handleAddButton = () => {
  // if (!queryForm.manageSiteId) {
  //   ElMessage.warning('请先选择站点')
  //   return
  // }
  fileList.value = []
  formMode.value = 'add'
  addDialogVisible.value = true
  lineFormData.value = initEditForm()
  nextTick(() => {
    dialogFormRef.value.resetFields()
  })
}

//页面初始化获取数据
const fetchData = async (_queryForm?: GetRequest) => {
  let params = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'sort_num',
    sortOrder: 'ASC'
  }
  params = queryForm ? { ...params, ...queryForm } : params
  isLoading.value = true
  try {
    const response = await list(params)
    if (response.success) {
      tableData.value = response.data.list || []
      total.value = Number(response.data.list ? response.data.total : 0)
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

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initForm())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

const closeDialog = () => {
  addDialogVisible.value = false
  addDialogVisible.value = false
  fileList.value = []
  imgUrl.value = ''
}

//上传
let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
}

let handleSuccess = (val: any) => {
  console.log('success')
  console.log(val)
  imgUrl.value = val.response?.path
}

const handleRemove = (val: any) => {
  fileList.value = []
  imgUrl.value = ''
}

//table标签的展示
const getTagLabels = (scope: any) => {
  const labels: string[] = []
  if (scope.row.isRecommended === 'y') labels.push('推荐')
  if (scope.row.isHot === 'y') labels.push('热门')
  if (scope.row.isSelected === 'y') labels.push('精选')
  if (scope.row.isTop === 'y') labels.push('置顶')
  if (scope.row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

onMounted(async () => {
  try {
    const response = await getGameTypePlatformList({ page: 1, size: 999 })
    if (response.success) {
      gameTypeList.value =
        response.data?.list?.map((item) => ({
          label: item.gameTypeName,
          value: item.gameType
        })) || []
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching game types:', error)
  }
  fetchData()
})
onBeforeMount(async () => {})
</script>

<style scoped lang="less">
// .dialogAdd {
//   :deep(.el-row) {
//     height: 72vh;
//     overflow: auto;
//   }
// }
</style>
