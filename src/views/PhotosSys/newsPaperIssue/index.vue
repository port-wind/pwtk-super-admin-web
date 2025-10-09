<template>
  <section id="system_account">
    <!-- Search Form -->
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="issue">
          <el-input v-model.trim="queryForm.issue" placeholder="期数" />
        </el-form-item>

        <el-form-item label="" prop="name">
          <el-input v-model.trim="queryForm.name" placeholder="图纸名称" />
        </el-form-item>

        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeListShow" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="newspaperName">
          <AutoComplete
            v-model="queryForm.newspaperName"
            max-length="255"
            isList
            keyword="newspaperName"
            :httpFunc="getNewsPaperList"
            :displayFields="['newspaperName']"
            :trigger-on-focus="true"
            placeholder="报纸名称"
            @select="handleNewspaperNameQuerySelect"
            @keyup.enter="fetchData"
          />
        </el-form-item>

        <el-form-item label="" prop="newspaperCode">
          <AutoComplete
            v-model="queryForm.newspaperCode"
            max-length="255"
            isList
            keyword="newspaperCode"
            :httpFunc="getNewsPaperList"
            :displayFields="['newspaperCode']"
            :trigger-on-focus="true"
            placeholder="报纸ID"
            @select="handleNewspaperCodeQuerySelect"
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="tableRef" :numVisibleItems="5"></ExpandableSection>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData()" :loading="tableState.isLoading">
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

          <el-dropdown>
            <el-button class="ml-12px" type="success" :icon="Setting" plain>功能</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Plus" @click="openAddDialog">新增</el-dropdown-item>
                <el-dropdown-item :icon="Plus" @click="batchAdd">批量创建</el-dropdown-item>
                <el-dropdown-item
                  v-if="isShowCheckboxTable"
                  :icon="Connection"
                  :disabled="!isAvailableSync"
                  @click="() => handleSpecialClick('newsPaperIssue')"
                >
                  <span v-show="isAvailableSync">同步</span>
                  <Countdown
                    v-show="!isAvailableSync"
                    :targetTimestamp="availableTime"
                    date-format="mm:ss"
                    @on-finish="onFinish"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="MagicStick"
                  @click="beforeCrawl()"
                  :disabled="!isAvailableCrawl || isLoadingCrawl"
                >
                  <span v-show="isAvailableCrawl && !isLoadingCrawl">爬取预览</span>
                  <span v-show="isLoadingCrawl">处理中...</span>
                  <Countdown
                    v-show="!isAvailableCrawl && !isLoadingCrawl"
                    :targetTimestamp="availableCrawlTime"
                    date-format="mm:ss"
                    @on-finish="onCrawlFinish"
                  />
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="MagicStick"
                  @click="oldbeforeCrawl()"
                  :disabled="!isAvailableCrawl || isLoadingCrawl"
                >
                  <span v-show="isAvailableCrawl && !isLoadingCrawl">一键爬取</span>
                  <span v-show="isLoadingCrawl">处理中...</span>
                  <Countdown
                    v-show="!isAvailableCrawl && !isLoadingCrawl"
                    :targetTimestamp="availableCrawlTime"
                    date-format="mm:ss"
                    @on-finish="onCrawlFinish"
                  />
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </section>

    <!-- Table -->
    <section class="account-table">
      <m-table
        :options="tableOptions"
        :data="tableState.tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="tableState.isLoading"
        isEditRow
        pagination
        stripe
        :total="tableState.total"
        :currentPage="tableState.currentPage"
        :pageSize="tableState.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #issue="{ scope }">
          {{ scope.row.issue }}
        </template>

        <template #name="{ scope }">
          <el-link class="like-a" @click="handleClickDetail(scope.row)">
            {{ truncateText(scope.row.name) || scope.row.name }}
          </el-link>
        </template>

        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleSeriesClickDetail(scope.row)">
            {{ scope.row.seriesName }}
          </p>
        </template>

        <template #newspaperCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleNewsPaperClickDetail(scope.row)">
            {{ scope.row.newspaperName }}
          </p>
        </template>

        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.gameType?.toString()) }}</p>
        </template>

        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
       <template #imgPath="{ scope }">
          <div v-if="scope.row.imgPath" class="image-container">
            <el-image
              :src="VITE_CDN_URL + scope.row.imgPath"
              :preview-src-list="[VITE_CDN_URL + scope.row.imgPath]"
              :initial-index="0"
              fit="cover"
              class="thumbnail-image"
              :preview-teleported="true"
            >
              <template #error>
                <div class="image-error">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div v-else class="no-image">
            <el-icon><Picture /></el-icon>
          </div>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row, update, fetchData)"
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>

  <!-- Issue Dialog -->
  <el-dialog v-model="issueDialogVisible" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane label="期刊信息" name="content" class="article-content m_tabs_pane">
        <IssueForm :rxState="rxState" :isEditMode="isEditMode">
          <template #imageUploader>
            <IssueImageUploader :rxState="rxState" />
          </template>
        </IssueForm>

        <div class="button-row">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="handleSaveFunc">提交</el-button>
        </div>
      </el-tab-pane>

      <el-tab-pane label="评论内容" name="comments" v-if="false" class="m_tabs_pane">
        <CommentTab
          :rxState="rxState"
          :issueId="selectedRow?.issueId || ''"
          :year="selectedRow?.year?.toString() || ''"
          :issue="selectedRow?.issue || ''"
        />
      </el-tab-pane>

      <el-tab-pane label="图解小组" name="photoGroup" v-if="false" class="m_tabs_pane">
        <ChooseExplain
          :selected-row="{
            postYear: selectedRow?.year || '',
            postIssue: selectedRow?.issue || '',
            issueId: selectedRow?.issueId || '',
            gameType: selectedRow?.gameType || ''
          }"
        />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- Related Modals -->
  <modalNewsSeries v-if="modalsStore.newsSeriesModal.isVisible" :isOperateShow="false" @refreshPage="refetchData" />

  <photoSeriesModal :isOperateShow="false" @alreadySubmit="handleSeriesSave" />

  <batchAddIssues v-if="modalsStore.batchAddIssueModal.isVisible" @refresh="refetchData" :rxState="rxState" />

  <checkbox-table v-if="modalsStore.checkboxTable.isVisible" @after-confirm="onAfterConfirm" />
  <crawl-dialog
    v-if="crawlVisible"
    :crawlVisible="crawlVisible"
    @update:crawlVisible="crawlVisible = $event"
    @commit="commitCrawl"
  />
  <spider-check
    v-if="spiderCheckVisible"
    :model-value="spiderCheckVisible"
    @close="spiderCheckVisible = false"
    @commit="commitCrawl"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Refresh, Plus, Connection, MagicStick, Setting, Picture } from '@element-plus/icons-vue'
import AutoComplete from '@/components/AutoComplete/index.vue'
import modalNewsSeries from '@/components/modalCommon/newsSeriesModal/index.vue'
import photoSeriesModal from '@/components/modalCommon/photoSeriesModal/index.vue'
import batchAddIssues from '@/views/PhotosSys/newsPaperIssue/batchAddIssues/index.vue'
import count from '@/utils/tableHeight'
import { YearTypes, truncateText } from '@/utils/dataFormat'
import { statusChanged } from '@/utils/table'
import { getNewsPaperList, update } from '@/api/photoSys/issues'
import { handleSpecialClick } from '@/components/checkboxTable/util'
import { useModalsStore } from '@/stores/modalStore'
import { useBettingStore } from '@/stores/bettingStore'
import ChooseExplain from './components/chooseExplain.vue'
// Import custom components
import IssueForm from './components/IssueForm.vue'
import IssueImageUploader from './components/IssueImageUploader.vue'
import CommentTab from './components/CommentTab.vue'

// Import composables
import { useIssueTable } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueTable'
import { initEditForm, useIssueForm, type RxState } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import type { EnhancedUploadFile } from '@/views/PhotosSys/newsPaperIssue/composables/useImageUpload'
import ExpandableSection from '@/components/expandIcon/index.vue'
import type { IssueFormData } from './IssueTypes'
import { useDelayLogic } from '@/views/PhotosSys/newsPaperIssue/useDelayLogic'

// Component setup
const route = useRoute()
const modalsStore = useModalsStore()
const bettingStore = useBettingStore()
const isExpanded = ref(false)
const tableRef = ref()
const gameTypeList = ref<any[]>([])
const gameTypeListShow = computed(() =>
  gameTypeList.value.map((item) => ({ label: item.gameTypeName, value: item.gameType }))
)
const { VITE_DEPLOY_CONFIG } = import.meta.env
const { VITE_PROXY_UPLOAD, VITE_SERVER_CALLBACK, VITE_CDN_URL, VITE_STORY_TYPE } = webConfigApi
const rxState: RxState<IssueFormData> = reactive({
  formState: initEditForm(),
  formRef: null,
  fileList: [] as EnhancedUploadFile[],
  isLoading: false,
  dialogMode: ''
})
const crawlVisible = ref(false)
const spiderCheckVisible = ref(false)
const isLoadingCrawl = ref(false)

const {
  isAvailable: isAvailableSync,
  availableTimestamp: availableTime,
  onFinish,
  startDelay: disableSync
} = useDelayLogic('sync_btn_expired', 1000 * 60 * 5) // 5 minutes

// Use our composable for crawl button
const {
  isAvailable: isAvailableCrawl,
  availableTimestamp: availableCrawlTime,
  onFinish: onCrawlFinish,
  startDelay: disableCrawl
} = useDelayLogic('crawl_btn_expired', 1000 * 60 * 10) // 10 minutes

const {
  tableState,
  queryForm,
  tableOptions,
  fetchData,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  getTagLabels
} = useIssueTable()

const { isLoading, isEditMode, resetForm, setupForEdit, handleSave } = useIssueForm(rxState)

// Local state
const selectedRow = ref<any>({})
const activeTab = ref('content')
const issueDialogVisible = ref(false)

// Computed properties
const isShowCheckboxTable = computed(() => VITE_DEPLOY_CONFIG === 'super')

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.gameType === gameType)
  return gameTypeObj ? gameTypeObj.gameTypeName : ''
})

// Methods for handling search form
const handleNewspaperNameQuerySelect = (item: any) => {
  const { newspaperName } = item.valueObj
  queryForm.newspaperName = newspaperName
}

const handleNewspaperCodeQuerySelect = (item: any) => {
  const { newspaperCode } = item.valueObj
  queryForm.newspaperCode = newspaperCode
}

// Dialog management
const openAddDialog = async () => {
  resetForm()
  rxState.dialogMode = 'add'
  issueDialogVisible.value = true
}

const batchAdd = async () => {
  modalsStore.showModal('batchAddIssueModal')
}

const handleClickDetail = async (row: any) => {
  selectedRow.value = row

  await setupForEdit(row.id)
  issueDialogVisible.value = true
  activeTab.value = 'content'
}

const cancel = () => {
  issueDialogVisible.value = false
}

// Save issue
const handleSaveFunc = async () => {
  const success = await handleSave()
  if (success) {
    issueDialogVisible.value = false
    tableState.currentPage = 1
    fetchData()
  }
}

// Modal handlers
const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', { id: row.seriesCode })
}

const handleNewsPaperClickDetail = (row: any) => {
  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    seriesCode: row.seriesCode,
    newspaperCode: row.newspaperCode,
    newspaperId: row.newspaperId,
    lineFormData: row,
    formMode: 'edit'
  })
}

const handleSeriesSave = (isNeedResetPage: boolean) => {
  if (isNeedResetPage) {
    tableState.currentPage = 1
    tableState.pageSize = 15
  }
  fetchData()
}

const refetchData = () => {
  const { modalData } = modalsStore.newsSeriesModal
  if (modalData?.formMode === 'add') {
    tableState.currentPage = 1
    tableState.pageSize = 15
  }
  fetchData()
  modalsStore.hideModal('newsSeriesModal')
  modalsStore.resetModal('newsSeriesModal')
  modalsStore.hideModal('photoSeriesModal')
  modalsStore.resetModal('photoSeriesModal')
}

// 加载基础数据
const fetchCommonData = async () => {
  // 加载 彩种类型
  await bettingStore.getGameType()
}

// Updated onAfterConfirm function
const onAfterConfirm = (_?: string) => {
  disableSync() // This now handles setting localStorage and updating the ref
}

const beforeCrawl = () => {
  // crawlVisible.value = true
  spiderCheckVisible.value = true
  // getCrawlingContent()
}
const oldbeforeCrawl = () => {
  crawlVisible.value = true
  // getCrawlingContent()
}
const commitCrawl = () => {
  disableCrawl()
  fetchData()
}
// Your lifecycle hooks
onMounted(async () => {
  await fetchCommonData()
  queryForm.newspaperCode = route.query?.newspaperCode as string
  gameTypeList.value = bettingStore.getAllGetGameType()
  await fetchData()

  // Status checking is already handled in the composable
})
</script>

<style scoped lang="less">
.tabs-dialog {
  .button-row {
    margin-top: 10px;
    display: flex;
    justify-content: end;
    gap: 12px;
  }
}

.like-a {
  cursor: pointer;
  color: blue;

  &:hover {
    text-decoration: underline;
  }
}

.overflow-hidden {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 图片相关样式 */
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
}

.thumbnail-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.thumbnail-image:hover {
  transform: scale(1.05);
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}

.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 4px;
  color: #999;
}
</style>
