<template>
  <section id="system_account" class="main_container">
    <section ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left" label-width="70px">
        <!-- <el-form-item prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="forumId">
          <AutoComplete
            v-model="queryForm.forumId"
            :httpFunc="reqHttp"
            keyword="forumId"
            :displayFields="['forumId']"
            :trigger-on-focus="true"
            placeholder="论坛ID"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumName">
          <AutoComplete
            v-model="queryForm.forumName"
            max-length="32"
            :httpFunc="reqHttp"
            keyword="forumName"
            :displayFields="['forumName']"
            :trigger-on-focus="true"
            placeholder="论坛名称"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="forumCategory">
          <el-input v-model="queryForm.forumCategory" placeholder="类别" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.regStartTime"
            v-model:endDate="queryForm.regEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="论坛状态" prop="forumStatus">
          <el-select v-model="queryForm.forumStatus" placeholder="请选择状态">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <!-- <ExpandableSection
          v-model="isExpanded"
          :resizeRef="tableRef"
        ></ExpandableSection> -->

        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1, size: pageSize })" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleAddButton">
            <el-icon>
              <Plus />
            </el-icon>
            新增
          </el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('bbsForum')">
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
            v-if="scope.row.forumIcon"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.forumIcon"
          ></el-image>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #forumInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleTableEdit(scope)">
            {{ scope.row.forumName }}
          </p>
        </template>
                <template #sortNum="{ scope }">
          <p>
            {{ scope.row.sortNum }}
          </p>
        </template>
        <template #mainboardInfo="{ scope }">
          <p class="like-a overflow-hidden" @click="handleMainboardTableEdit(scope)">
            {{ scope.row.mainboardName }}
          </p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #isSwitch="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.forumStatus === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.forumStatus"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row)"
          ></el-switch>
        </template>
        <template #time="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
    <!-- 新增 弹出框 -->
    <section>
      <el-dialog
        v-model="addDialogVisible"
        draggable
        overflow
        destroy-on-close
        @close="closeDialog"
        class="tabs-dialog"
      >
        <mTabPane label="论坛">
          <m-form
            ref="addForm"
            :file-list="fileList"
            :modelForm="initAddForm"
            :options="addBbsForumOptions"
            :rules="rulesAdd"
            :uploadData="uploadData"
            :commonSpan="10"
            @on-success="handleSuccess"
            @on-exceed="handleExceed"
            @on-remove="handleRemove"
            :rowAttrs="rowAttrs"
          >
            <template #mainboardId="scope">
              <UniRemoteInput
                v-model="scope.form.mainboardId"
                :search-obj="{}"
                valueKey="mainboardId"
                labelKey="mainbordName"
                searchKey="mainboardId"
                placeholder=""
                event-focus="focus"
                :fetchOptions="reqMainboardHttp"
                :formatLabel="
                  (item) => (item.mainbordName ? `${item.mainbordName} - ${item.mainboardId}` : item.mainboardId)
                "
              />
            </template>
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
        </mTabPane>
      </el-dialog>
    </section>
    <modalMainboardSeries @refreshPage="fetchData" />
    <modalForumSeries @refreshPage="fetchData" />
    <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import i18n from '@/i18n'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useForumApi } from '@/api/bss/forumManagement/index'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/forumManagement/types'
import { options, addBbsForumOptions } from '@/views/Bbs/bbsForum/data'

import type { UploadUserFile } from 'element-plus'

import AutoComplete from '@/components/AutoComplete/index.vue'

import { unitFormatDate } from '@/utils/dateFormat/index'

import showErrorMessage from '@/utils/showErrorMessage'

import type { FileUploadRequest } from '@/api/system/upload/types'
import { useMainboardApi } from '@/api/bss/mainboardManagement/index'

const { t } = i18n.global as any

//上传相关
const { VITE_CDN_URL } = webConfigApi
//弹窗
import modalMainboardSeries from '@/components/modalCommon/mainboardSeriesModal/index.vue'
import modalForumSeries from '@/components/modalCommon/forumSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { useDeployConfig } from '@/components/checkboxTable/util'

const modalsStore = useModalsStore()
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

const tableRef = ref()
const queryRef = ref()

const uploadData = {
  fileType: 'img',
  uploadFrom: 'bbs/forum/icon',
  storageStyle: 6
} as FileUploadRequest

const tableData = ref<TableData[]>([])

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

// const isExpanded = ref(false);

//新增弹窗
const addDialogVisible = ref(false)

//编辑弹窗
const editDialogVisible = ref(false)
const forumId = ref()
const mainboardId = ref()
const mainboardDialogVisible = ref(false)

const addForm = ref()
const editForm = ref()

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

const initForm = {
  manageSiteId: '',
  forumId: '',
  forumName: '',
  forumCategory: '',
  regStartTime: null,
  regEndTime: null,
  forumStatus: 'L',
  sortName: 'sort_num',
  sortOrder: 'ASC'
}

const initAddForm = {
  forumId: '', // 论坛ID
  mainboardId: '', // 主板ID
  forumName: '', // 论坛名称
  sortNum: '', // 排序编号
  forumCategory: '', // 论坛类别
  forumIcon: '', // 论坛icon
  forumStatus: 'y', // 论坛状态
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isBloom: 'n'
}

const queryForm = ref(initForm)

//add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref()

//loading 按钮
const isLoading = ref(false)

const manageSiteId = computed(() => {
  return queryForm.value.manageSiteId
})

const { reqHttp, addHttp, editHttp } = useForumApi(manageSiteId)
const reqMainboardHttp = useMainboardApi(manageSiteId).reqHttp

//新增的时候的
const rulesAdd = ref({
  mainboardId: [
    { required: true, message: '主板ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '主板ID不符合标准', trigger: 'blur' }
  ],
  forumId: [
    { required: true, message: '论坛ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '论坛ID不符合标准', trigger: 'blur' }
  ],
  forumName: [{ required: true, message: '论坛名称不能为空', trigger: 'blur' }],
    sortNum: [
    { required: true, message: '排序编号不能为空', trigger: 'blur' },
    { pattern: /^[0-9]*$/, message: '排序编号必须为数字', trigger: 'blur' }
  ]
})

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      if (imgUrl.value) {
        params.forumIcon = imgUrl.value
      } else if (!fileList.value.length) {
        params.forumIcon = null
      }
      if (formMode.value === 'edit') {
        params.createTime = lineFormData.value.createTime
      }
      // return
      try {
        const response =
          formMode.value === 'add' ? await addHttp(params as AddRequest) : await editHttp(params as EditRequest)

        if (response.success) {
          if (formMode.value === 'add') {
            currentPage.value = 1
          }
          fetchData() // 保存成功后重新获取数据
          addDialogVisible.value = false
          editDialogVisible.value = false
          fileList.value = []
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
  return new Promise((resolve, reject) => {
    // if (row.forumStatus === 'n') {
    //   updateStatus(row).then(resolve).catch(reject);
    // } else {
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
    // }
  })
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  const params = row
  params.forumStatus = row.forumStatus === 'y' ? 'n' : 'y'
  try {
    const response = await editHttp(params)
    if (response.success) {
      fetchData()
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      return Promise.resolve()
    } else {
      showErrorMessage(response)
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

//弹窗编辑按钮点击

const handleTableEdit = async (scope: any) => {
  formMode.value = 'edit'
  forumId.value = scope.row.forumId
  modalsStore.showModal('forumSeriesModal')
  modalsStore.setModalData('forumSeriesModal', {
    forumId: forumId.value,
    manageSiteId: manageSiteId.value,
    isOperateShow: true
  })
  editDialogVisible.value = true
}

//弹窗添加按钮点击
const handleAddButton = () => {
  formMode.value = 'add'
  addDialogVisible.value = true
}

//页面初始化获取数据
const fetchData = async (_queryForm?: GetRequest) => {
  if (_queryForm?.page) {
    currentPage.value = _queryForm.page
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  params = queryForm ? { ...params, ...queryForm.value } : params
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
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
  queryForm.value.regEndTime = null
  queryForm.value.regStartTime = null
  currentPage.value = 1
  fetchData()
}

const closeDialog = () => {
  if (formMode.value === 'add') {
    addForm.value.resetFields()
  } else if (formMode.value === 'edit') {
    editForm.value.resetFields()
  }
  addDialogVisible.value = false
  editDialogVisible.value = false
  mainboardDialogVisible.value = false
  fileList.value = []
}

//上传
let handleSuccess = (val: any) => {
  console.log('success')
  console.log(val)
  imgUrl.value = val.response?.path
}

let handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
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

//主板展示窗口
const handleMainboardTableEdit = async (scope: any) => {
  mainboardId.value = scope.row.mainboardId
  modalsStore.showModal('mainboardSeriesModal')
  modalsStore.setModalData('mainboardSeriesModal', {
    mainboardId: mainboardId.value,
    manageSiteId: manageSiteId.value
  })
  mainboardDialogVisible.value = true
}

const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

onMounted(fetchData)
</script>

<style scoped lang="less">
::v-deep .outsideForm {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
