<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="issue">
          <el-input v-model="queryForm.issue" placeholder="期数" />
        </el-form-item>
        <el-form-item label="" prop="loginId">
          <!-- <RemoteInput :onChangeSearch="searchButton"  placeholder="登入帐号/用户ID" name="searchId" v-model:remoteId="queryForm.searchId" style="">
          </RemoteInput> -->
          <UserTwoAutocomplete
            placeholder="登入帐号 | 用户ID"
            @keyup.enter="fetchData()"
            name="searchId"
            v-model:remoteId="queryForm.postUserId"
            v-model:remoteValue="queryForm.remoteValue"
            style=""
          ></UserTwoAutocomplete>
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <UserDeleteAutocomplete
            placeholder="用户昵称"
            @keyup.enter="fetchData()"
            name="nickname"
            v-model:remoteId="queryForm.nickname"
            style=""
          ></UserDeleteAutocomplete>
          <!-- <RemoteInput :onChangeSearch="searchButton" placeholder="用户昵称" name="nickname" v-model:remoteId="queryForm.nickname" style=""></RemoteInput> -->
          <!-- <el-input v-model="queryForm.nickname" maxlength="30" style="width: 240px" placeholder="用户昵称" /> -->
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
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
          ></AutoComplete>
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
          ></AutoComplete>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
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

          <!-- <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            @click="() => handleSpecialClick('newsPaperIssue')"
          >
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button> -->
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
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
      >
        <template #issue="{ scope }">
          {{ scope.row.issue }}
        </template>
        <template #postContent="{ scope }">
          <el-link class="like-a" @click="handleClickDetail(scope.row)">
            {{ extractTextFromHTML(scope.row.postContent) || scope.row.postContent }}
          </el-link>
        </template>

        <template #user="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.nickname) }}{{ scope.row.nickname && scope.row.loginId ? ' | ' : ''
            }}{{ truncateText(scope.row.loginId) }}
          </p>
        </template>
        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleSeriesClickDetail(scope.row.issueDTO)">
            {{ scope.row.issueDTO?.seriesName }}
          </p>
        </template>
        <template #newspaperCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleNewsPaperClickDetail(scope.row.issueDTO)">
            {{ scope.row.issueDTO?.newspaperName }}
          </p>
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row?.issueDTO?.gameType?.toString()) }}</p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #countInfo="{ scope }">
          {{ scope.row.favoriteCount }} | {{ scope.row.likeCount }} | {{ scope.row.readCount }}
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row, updateGraphicSolution, fetchData)"
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>
  <el-dialog v-model="issueDialogVisible" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="article-tabs m_tabs">
      <el-tab-pane
        label="选择期刊"
        name="chooseIssue"
        v-show="isAddMode && activeTab === 'chooseIssue'"
        class="article-content m_tabs_pane"
      >
        <ChooseIssue :gameTypeList="gameTypeList" @select-issue="handleSelectIssue"></ChooseIssue>
      </el-tab-pane>
      <el-tab-pane
        label="新增图解"
        name="addExplain"
        v-if="isAddMode && activeTab === 'addExplain'"
        class="article-content m_tabs_pane"
      >
        <AddExplain :issueInfo="selectedIssueInfo" @returnToChooseIssue="activeTab = 'chooseIssue'"></AddExplain>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <el-dialog v-model="issueEditDialogVisible" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs v-model="activeEditTab" class="article-tabs m_tabs">
      <el-tab-pane label="图解信息" name="edit" v-if="isEditMode" class="article-content m_tabs_pane">
        <EditExplain :explainInfo="explainInfo" @returnTo="returnTo"></EditExplain>
      </el-tab-pane>
      <!-- style="display: flex; justify-content: space-around;" -->
      <el-tab-pane
        label="评论内容"
        name="photoGroup"
        v-if="isEditMode"
        class="m_tabs_pane"
        style="flex-direction: row; justify-content: space-around"
      >
        <CommentExplain :selectedRow="selectedRow"></CommentExplain>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <modalNewsSeries v-if="modalsStore.newsSeriesModal.isVisible" :isOperateShow="false" />
  <photoSeriesModal :isOperateShow="false" />
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import showErrorMessage from '@/utils/showErrorMessage'
import { getNewsPaperList, getExplainDetailByPostId } from '@/api/photoSys/issues'
import { statusChanged } from '@/utils/table'
import { extractTextFromHTML, truncateText, YearTypes } from '@/utils/dataFormat'
import { fetchGameTypes } from '@/utils/table'
import modalNewsSeries from '@/components/modalCommon/newsSeriesModal/index.vue'
import photoSeriesModal from '@/components/modalCommon/photoSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { graphicSolutionGroup, updateGraphicSolution } from '@/api/photoSys/issues'
import router from '@/router'
const modalsStore = useModalsStore()
const { VITE_DEPLOY_CONFIG } = import.meta.env
const explainInfo = ref<any>({})
// Refs
const gameTypeList = ref()
const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const selectedIssueInfo = ref<any>({})
const isLoading = ref(false)

const isShowCheckboxTable = computed(() => {
  return VITE_DEPLOY_CONFIG === 'super'
})
const selectedRow = ref<any>({})

const dialogMode = ref<'edit' | 'add'>()
const isAddMode = computed(() => dialogMode.value === 'add')
const isEditMode = computed(() => dialogMode.value === 'edit')
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})

const issueDialogVisible = ref(false)
const issueEditDialogVisible = ref(false)

const openAddDialog = () => {
  dialogMode.value = 'add'
  activeTab.value = 'chooseIssue'
  issueDialogVisible.value = true
}
// Constants
const activeTab = ref('chooseIssue')
const activeEditTab = ref('edit')

const initQueryFormValue = () => ({
  year: '',
  issue: '',
  gameType: '',
  postContent: '',
  newspaperName: '',
  newspaperCode: '',
  postUserId: '',
  remoteValue: '',
  nickname: ''
})

const queryForm = reactive(initQueryFormValue())
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'postYear',
    label: '年份',
    align: 'right',
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'postIssue',
    label: '期数',
    align: 'right',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'postContent',
    label: '图解内容',
    slot: 'postContent',
    columAttr: { minWidth: 160 }
  },
  {
    prop: 'user',
    label: '发布用户',
    slot: 'user',
    columAttr: { minWidth: 300 }
  },
  {
    prop: 'newspaperCode',
    label: '报纸名称',
    slot: 'newspaperCode',
    columAttr: { minWidth: 150 }
  },
  {
    prop: 'seriesCode',
    label: '系列名称',
    slot: 'seriesCode',
    columAttr: { minWidth: 150 }
  },

  {
    prop: 'gameType',
    label: '彩种',
    slot: 'gameType',
    columAttr: { minWidth: 80 }
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    columAttr: { minWidth: 110 }
  },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    columAttr: { minWidth: 220 }
  },
  {
    prop: 'readCount',
    label: '点赞 | 收藏 | 阅读量',
    slot: 'countInfo',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'commentFlag',
    label: '评论',
    json: {
      sourceName: 'yOrN',
      keyName: 'commentFlag'
    },
    columAttr: { minWidth: 60 }
  }
]

// Methods
const fetchData = async (val?: GetRequest) => {
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    postIssue: queryForm.issue,
    postYear: queryForm.year,
    ...queryForm
  }
  isLoading.value = true
  try {
    const response = await graphicSolutionGroup(params)
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item,
            issueDTO: item.issueDTO ?? {}
          }
        }) || []
      tableData.value =
        (list &&
          list?.map((item: any) => ({
            ...item,
            issue: item.issue?.toString() || '',
            id: item.issueId,
            commentFlag: item.issueDTO?.commentFlag,
            annotateContent: item.issueDTO?.annotateContent
          }))) ||
        []
      total.value = Number(response?.data?.total) || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const handleNewspaperCodeQuerySelect = (item: any) => {
  const { newspaperCode } = item.valueObj
  queryForm.newspaperCode = newspaperCode
  console.log('newspaperCode', newspaperCode)
}
const handleNewspaperNameQuerySelect = (item: any) => {
  const { newspaperName } = item.valueObj
  queryForm.newspaperName = newspaperName
  console.log('newspaperName', newspaperName)
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
const getExplainDetail = async (postId) => {
  try {
    const response = await getExplainDetailByPostId({ postId })
    if (response.success) {
      const { data } = response
      explainInfo.value = data
      return data
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
  }
}
const handleClickDetail = async (row: any) => {
  console.log('row', row)
  selectedRow.value = await getExplainDetail(row.postId)

  issueEditDialogVisible.value = true
  dialogMode.value = 'edit'
  activeEditTab.value = 'edit'
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

const handleSelectIssue = (row: any) => {
  activeTab.value = 'addExplain'
  selectedIssueInfo.value = row
}

const handTabs = (row) => {
  // return
  // router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    // ...modalsStore.userInfoModal.modalData,
    userId: row.postUserId
  })
  modalsStore.showModal('userInfoModal')
}
const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', {
    id: row?.seriesCode
  })
  console.log('系列', row, modalsStore)
}

/**
 * 新闻系列弹窗
 * @param {Object} row - The selected news paper
 */
const handleNewsPaperClickDetail = (row: any = {}) => {
  console.log('newsRow', row)

  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    seriesCode: row.seriesCode,
    newspaperCode: row.newspaperCode,
    newspaperId: row.newspaperId,
    lineFormData: row,
    formMode: 'edit'
  })
  console.log('报纸', row, modalsStore.newsSeriesModal.isVisible)
}
const returnTo = () => {
  issueEditDialogVisible.value = false
  fetchData()
}
// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  await fetchData()
  if (router.currentRoute.value.query.postId) {
    console.log('router.currentRoute.value.query.postId', router.currentRoute.value.query.postId)
    const postId = router.currentRoute.value.query.postId
    await handleClickDetail({ postId })
  }
})
</script>

<style scoped lang="less">
:deep(.el-icon--zoom-in) {
  display: none;
}
.issue-dialog {
  background-color: aqua !important;
}
:deep(.el-dialog__body) {
  height: 500px !important;
  background-color: aqua;
}
.mb-4 {
  margin-bottom: 16px;
}
.article-tabs {
  .article-content {
    :deep(.img-box) {
      width: 350px;
      height: 525px;
    }
  }
}

.article-tabs :deep(.el-tabs__content) {
  flex: 1;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
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
