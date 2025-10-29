<template>
  <section id="system_account" class="main_container">
    <section ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <!-- <el-form-item prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item prop="mainboardId">
          <AutoComplete
            v-model="queryForm.mainboardId"
            :httpFunc="reqHttp"
            keyword="mainboardId"
            placeholder="主板ID"
            :displayFields="['mainboardId']"
            :trigger-on-focus="true"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="mainboardName">
          <AutoComplete
            v-model="queryForm.mainbordName"
            :httpFunc="reqHttp"
            keyword="mainbordName"
            placeholder="主板名称"
            :displayFields="['mainbordName']"
            :trigger-on-focus="true"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="bbsId">
          <AutoComplete
            v-model="queryForm.bbsId"
            :httpFunc="reqBbsHttp"
            keyword="bbsId"
            placeholder="BBS ID"
            :displayFields="['bbsId']"
            :trigger-on-focus="true"
            isPage
            isList
          ></AutoComplete>
        </el-form-item>

        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.regStartTime"
            v-model:endDate="queryForm.regEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="主板状态" prop="mainboardStatus">
          <el-select v-model="queryForm.mainboardStatus" placeholder="请选择状态">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="tableRef" :numVisibleItems="4"></ExpandableSection>
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
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('bbsMainboard')">
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
            v-if="scope.row.mainboardIcon"
            style="width: 48px; height: 48px"
            :src="VITE_CDN_URL + scope.row.mainboardIcon"
          ></el-image>
          <el-image v-else>
            <template #error>
              <div class="no_image-default">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
        <template #mainboardInfo="{ scope }">
          <p class="like-a overflow-hidden" type="primary" @click="handleTableEdit(scope)">
            {{ scope.row.mainbordName }}
          </p>
        </template>
        <template #bbsInfo="{ scope }">
          <p class="like-a overflow-hidden" type="primary" @click="handleBbsTableEdit(scope)">
            {{ scope.row.bbsName }}
          </p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #isSwitch="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.mainboardStatus === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.mainboardStatus"
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
        <mTabPane label="主板">
          <m-form
            ref="addForm"
            :file-list="fileList"
            :modelForm="initAddForm"
            :options="addDialogOptions"
            :rules="rulesAdd"
            :uploadData="uploadData"
            :commonSpan="10"
            @on-success="handleSuccess"
            @on-exceed="handleExceed"
            @on-remove="handleRemove"
            :rowAttrs="rowAttrs"
          >
            <!-- @value-change="(item) => onSeriesCodeChange(item)" -->

            <template #bbsId="scope">
              <UniRemoteInput
                v-model="scope.form.bbsId"
                :search-obj="{}"
                valueKey="bbsId"
                labelKey="bbsName"
                searchKey="bbsId"
                placeholder="BBS ID"
                event-focus="focus"
                :fetchOptions="reqBbsHttp"
                :formatLabel="(item) => (item.bbsName ? `${item.bbsName} - ${item.bbsId}` : item.bbsId)"
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
    <modalBbsSeries @refreshPage="fetchData" />
    <modalMainboardSeries @refreshPage="fetchData" />
    <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/i18n'
// import count from '@/utils/tableHeight'
// import { cloneDeep } from 'lodash-es';

import { Picture as IconPicture } from '@element-plus/icons-vue'
import { useMainboardApi } from '@/api/bss/mainboardManagement/index'
import { useBbsApi } from '@/api/bss/infoManagement/index'

import type { TableData, GetRequest, AddRequest, EditRequest } from '@/api/bss/mainboardManagement/types'
import { options, addDialogOptions } from '@/views/Bbs/bbsMainboard/data'
import AutoComplete from '@/components/AutoComplete/index.vue'

import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'

//上传相关
import type { UploadUserFile } from 'element-plus'

//弹窗
import { useModalsStore } from '@/stores/modalStore'
import modalBbsSeries from '@/components/modalCommon/bbsSeriesModal/index.vue'
import modalMainboardSeries from '@/components/modalCommon/mainboardSeriesModal/index.vue'
import { useDeployConfig } from '@/components/checkboxTable/util'

import ExpandableSection from '@/components/expandIcon/index.vue'
const isExpanded = ref(false)
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

const { VITE_CDN_URL } = webConfigApi

const { t } = i18n.global as any

const tableRef = ref()
const queryRef = ref()

const uploadData = {
  fileType: 'img',
  uploadFrom: 'bbs/mainboard/icon',
  storageStyle: 6
}

const tableData = ref<TableData[]>([])

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//const isExpanded = ref(false);

//新增弹窗
const addDialogVisible = ref(false)
//编辑弹窗
const editDialogVisible = ref(false)
const mainboardId = ref('')

//loading 按钮
const isLoading = ref(false)

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

//bbs窗口
const bbsDialogVisible = ref(false)
const bbsId: any = ref('')

const addForm = ref()
const editForm = ref()

const initForm = () => ({
  manageSiteId: '',
  mainboardId: '',
  mainbordName: '',
  bbsId: '',
  regStartTime: null,
  regEndTime: null,
  mainboardStatus: 'L',
  sortName: 'create_time',
  sortOrder: 'DESC'
})

const queryForm = reactive(initForm())

const initAddForm = {
  mainboardId: '',
  mainbordName: '',
  bbsId: '',
  mainboardStatus: 'y',
  mainboardIcon: ''
}

// add 新增 edit 编辑
const formMode = ref<string>('add')
const lineFormData = ref()

const manageSiteId = computed(() => {
  return queryForm.manageSiteId
})

const { reqHttp, addHttp, editHttp } = useMainboardApi(manageSiteId)
const reqBbsHttp = useBbsApi(manageSiteId).reqHttp

//新增的时候的
const rulesAdd = ref({
  mainboardId: [
    { required: true, message: '主板ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '主板ID不符合标准', trigger: 'blur' }
  ],
  bbsId: [
    { required: true, message: '论坛ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '论坛ID不符合标准', trigger: 'blur' }
  ],
  mainbordName: [{ required: true, message: '主板名称不能为空', trigger: 'blur' }]
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
        params.mainboardIcon = imgUrl.value
      } else if (!fileList.value.length) {
        params.mainboardIcon = null
      }
      if (formMode.value === 'edit') {
        params.createTime = lineFormData.value.createTime
      }
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
  return new Promise((resolve, reject) => {
    // if (row.mainboardStatus === 'n') {
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
  params.mainboardStatus = row.mainboardStatus === 'y' ? 'n' : 'y'

  try {
    const response = await editHttp(params)
    if (response.success) {
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
const modalsStore = useModalsStore()
const handleTableEdit = async (scope: any) => {
  formMode.value = 'edit'
  mainboardId.value = scope.row.mainboardId
  modalsStore.showModal('mainboardSeriesModal')
  modalsStore.setModalData('mainboardSeriesModal', {
    mainboardId: mainboardId.value,
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
  // console.log(1, queryForm.value, params)
  params = queryForm ? { ...params, ...queryForm } : params
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
  Object.assign(queryForm, initForm())
  queryForm.regEndTime = null
  queryForm.regStartTime = null
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
  bbsDialogVisible.value = false
  fileList.value = []
  imgUrl.value = ''
}

//上传
let handleExceed = (val: any) => {
  // console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
}

let handleSuccess = (val: any) => {
  // console.log('success')
  // console.log(val)
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

//bbs展示窗口
const handleBbsTableEdit = async (scope: any) => {
  bbsId.value = scope.row.bbsId
  modalsStore.showModal('bbsSeriesModal')
  modalsStore.setModalData('bbsSeriesModal', {
    bbsId: bbsId.value,
    manageSiteId: manageSiteId.value
  })
  bbsDialogVisible.value = true
}

const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

onMounted(fetchData)
</script>

<style scoped lang="less"></style>
