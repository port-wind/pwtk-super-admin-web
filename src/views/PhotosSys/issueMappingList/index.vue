<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item prop="fileId">
          <AutoComplete
            v-model="queryForm.fileId"
            keyword="fileId"
            :httpFunc="reqIssueMappingList"
            :displayFields="['fileId']"
            :trigger-on-focus="true"
            placeholder="文件ID"
            @keyup.enter="fetchData"
            isList
            isPage
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="seriesCode">
          <AutoComplete
            v-model="queryForm.seriesCode"
            isList
            keyword="seriesCode"
            :httpFunc="getGameTypeSeries"
            :displayFields="['seriesCode', 'seriesName']"
            :trigger-on-focus="true"
            placeholder="系列ID"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item prop="newspaperCode">
          <AutoComplete
            v-model="queryForm.newspaperCode"
            keyword="newspaperCode"
            :httpFunc="getGameTypeNewspaper"
            :displayFields="['newspaperCode', 'newspaperName']"
            :trigger-on-focus="true"
            placeholder="报纸ID"
            @keyup.enter="fetchData"
            isList
            isPage
          ></AutoComplete>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            批量新增
          </el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('mapping')">
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- Data Table -->
    <section class="account-table">
      <m-table
        :options="tableOptions"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
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
        <template #fileId="{ scope }">
          <p class="like-a overflow-hidden" @click="handleEdit(scope.row)">
            {{ scope.row.fileId }}
          </p>
        </template>
        <template #newspaperCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleClickDetail(scope.row)">
            {{ scope.row.newspaperName }}
          </p>
        </template>
        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleSeriesClickDetail(scope.row)">
            {{ scope.row.seriesName }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row.gameType?.toString() || '') }}</p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #operation="{ scope }">
          <span style="color: #d9001b; cursor: pointer" @click="handleDelete(scope.row)">删除</span>
        </template>
      </m-table>
    </section>
  </section>
  <modalNewsSeries v-if="modalsStore.newsSeriesModal.isVisible" :isOperateShow="false" />
  <photoSeriesModal :isOperateShow="false" />
  <EditDialog :key="fileId" v-model:isVisible="isDialogVisible" :fileId="fileId" @back="fetchData()"></EditDialog>
  <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { fetchGameTypes } from '@/utils/table'
import showErrorMessage from '@/utils/showErrorMessage'
import count from '@/utils/tableHeight'
import {
  reqIssueMappingList,
  addIssueMapping,
  batchAddIssueMapping,
  editIssueMapping,
  delIssueMapping,
  getGameTypeSeries,
  getGameTypeNewspaper
} from '@/api/photoSys/issueMappingList'
import { unitFormatDate } from '@/utils/dateFormat/index'
import modalNewsSeries from '@/components/modalCommon/newsSeriesModal/index.vue'
import router from '@/router'
import EditDialog from './components/editDialog.vue'
import { useModalsStore } from '@/stores/modalStore'
import i18n from '@/i18n'
import { useDeployConfig } from '@/components/checkboxTable/util'

const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()
const { t } = i18n.global as any
const modalsStore = useModalsStore()

// Constants and refs
const tableRef = ref()
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const isLoading = ref(false)
const gameTypeList = ref()
const isDialogVisible = ref(false)
const fileId = ref('')

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

// Form data
const initQueryForm = () => ({
  fileId: '',
  gameType: '',
  newspaperCode: '',
  seriesCode: '',
  manageSiteId: ''
})
const queryForm = reactive<any>(initQueryForm())

// Table options
const tableOptions = [
  { prop: 'fileId', label: '文件名称', slot: 'fileId', columAttr: { minWidth: 180 } },
  { prop: 'gameType', label: '彩种', slot: 'gameType', columAttr: { minWidth: 60 } },
  { prop: 'seriesCode', label: '系列名称', slot: 'seriesCode', columAttr: { minWidth: 180 } },
  { prop: 'newspaperCode', label: '报纸名称', slot: 'newspaperCode', columAttr: { minWidth: 180 } },
  { prop: 'layoutPosition', label: '版面位置', columAttr: { minWidth: 80 } },
  { prop: 'createTime', label: '创建时间', slot: 'createTime', columAttr: { minWidth: 170 } },
  { prop: 'operation', label: '操作', slot: 'operation', columAttr: { minWidth: 60 } }
]

// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const req = {
      page: currentPage.value,
      size: pageSize.value,
      ...queryForm
    }
    if (queryForm.gameType === 'L') {
      delete req.gameType
    }
    const response: any = await reqIssueMappingList(req)

    if (response.success) {
      tableData.value = response.data.list || []
      total.value = Number(response.data.list ? response.data.total : 0)
    } else {
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

const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

const openAddDialog = () => {
  router.push('/photosSys/batchIssueAdd')
}

const handleClickDetail = async (row: any) => {
  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    seriesCode: row.seriesCode,
    newspaperCode: row.newspaperCode,
    lineFormData: row,
    newspaperId: row.id,
    formMode: 'edit',
    manageSiteId: queryForm.manageSiteId
  })
}

const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', {
    id: row.seriesCode,
    manageSiteId: queryForm.manageSiteId
  })
}

const handleEdit = async (row: any) => {
  fileId.value = row.fileId
  console.log('openDialog clicked', isDialogVisible.value) // 确认触发
  isDialogVisible.value = true
  console.log('hou', isDialogVisible.value) // 确认触发
}

const handleDelete = (row: any) => {
  return ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  }).then(async () => {
    const params = {
      fileId: row.fileId
    }
    const response: any = await delIssueMapping(params)
    if (response.success) {
      fetchData()
    } else {
      showErrorMessage(response)
    }
  })
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  fetchData()
})
</script>

<style scoped lang="less">
// Add any necessary styles here
:deep(.el-tab-pane) {
  height: 65vh;
  overflow-y: auto;
}
</style>
