<template>
  <section id="system_account">
    <!-- Search Form -->
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="newspaperName">
          <AutoComplete
            v-model="queryForm.newspaperName"
            max-length="255"
            isList
            keyword="newspaperName"
            :httpFunc="list"
            :displayFields="['newspaperName']"
            :searchObj="{ manageSiteId: queryForm.manageSiteId }"
            :trigger-on-focus="true"
            clearable
            placeholder="报纸名称"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="newspaperCode">
          <AutoComplete
            v-model="queryForm.newspaperCode"
            max-length="255"
            isList
            keyword="newspaperCode"
            :httpFunc="list"
            :displayFields="['newspaperCode']"
            :searchObj="{ manageSiteId: queryForm.manageSiteId }"
            :trigger-on-focus="true"
            placeholder="报纸ID"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="seriesCode">
          <AutoComplete
            v-model="queryForm.seriesCode"
            max-length="255"
            isList
            keyword="seriesCode"
            :httpFunc="listGameTypeSeries"
            :searchObj="{ manageSiteId: queryForm.manageSiteId }"
            :displayFields="['seriesCode', 'seriesName']"
            :trigger-on-focus="true"
            placeholder="系列ID"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="recommendTop">
          <el-select v-model="queryForm.recommendTop" placeholder="推荐">
            <el-option label="全部" value="L" />
            <el-option label="是" value="y" />
            <el-option label="否" value="n" />
          </el-select>
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
            新增
          </el-button>
          <el-button type="danger" @click="openRecommendList">推荐排序</el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('newsPaper')">
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
      >
        <template #newspaperCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleClickDetail(scope.row)">
            {{ scope.row.newspaperName }}
          </p>
        </template>
        <template #layoutRef="{ scope }">
          {{ getLayoutTable(scope) }}
        </template>
        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleSeriesClickDetail(scope.row)">
            {{ scope.row.seriesName }}
          </p>
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #gameType="{ scope }">
          <p>{{ getGameTypeName(scope.row.gameType?.toString() || '') }}</p>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="
              () => statusChanged({ ...scope.row, manageSiteId: queryForm.manageSiteId }, updateStatusApi, fetchData)
            "
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>
  <modalNewsSeries v-if="modalsStore.newsSeriesModal.isVisible" @refreshPage="refetchData" />
  <photoSeriesModal :isOperateShow="false" @alreadySubmit="handleSeriesSave" />
  <el-dialog v-model="showRecommend" class="tabs-dialog" draggable overflow destroy-on-close>
    <el-tabs class="article-tabs m_tabs">
      <el-tab-pane label="推荐排序" class="article-content m_tabs_pane">
        <RecommendSortedList @cancel="showRecommend = false" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { fetchGameTypes, statusChanged } from '@/utils/table'
import showErrorMessage from '@/utils/showErrorMessage'
import count from '@/utils/tableHeight'
import { list, updateStatusApi } from '@/api/photoSys/news'
import { listGameTypeSeries } from '@/api/photoSys/series' // Add this line

import { formateStrNum } from '@/utils/dataFormat'
import modalSeriesSeries from '@/components/modalCommon/photoSeriesModal/index.vue'
import modalNewsSeries from '@/components/modalCommon/newsSeriesModal/index.vue'
import { useModalsStore } from '@/stores/modalStore'
import { initNewspaperEditForm } from '@/views/PhotosSys/newspaper/data'
import { useDeployConfig } from '@/components/checkboxTable/util'
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()
// Constants and refs
const tableRef = ref()
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const isLoading = ref(false)
const gameTypeList = ref()
const layoutCodeList = ref()
const showRecommend = ref(false)

const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})
// Form data
const initQueryForm = () => ({
  seriesId: '',
  seriesName: '',
  gameType: '',
  newspaperName: '',
  newspaperCode: '',
  seriesCode: '',
  manageSiteId: '',
  recommendTop: ''
})
const queryForm = reactive(initQueryForm())

const formMode = ref<string>('add')
const lineFormData = ref(initNewspaperEditForm())

//新增的时候的
const rulesAdd = ref({
  seriesCode: [{ required: true, message: '请输入系列ID', trigger: 'blur' }],
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  newspaperCode: [
    { required: true, message: '请输入报纸ID', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]+$/,
      message: '报纸ID只能包含小写英文字母和数字',
      trigger: 'blur'
    }
  ],
  newspaperName: [{ required: true, message: '请输入报纸名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})
//编辑的时候的
const rulesEdit = ref({
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})

const formRules = ref(formMode.value === 'add' ? rulesAdd : rulesEdit)

// Table options
const tableOptions = [
  { prop: 'newspaperCode', label: '报纸名称', slot: 'newspaperCode', columAttr: { minWidth: 120 } },
  { prop: 'seriesCode', label: '系列名称', slot: 'seriesCode', columAttr: { minWidth: 120 } },
  { prop: 'gameType', label: '彩种', slot: 'gameType', columAttr: { minWidth: 70 } },
  {
    prop: 'layoutRef',
    label: '关联版面',
    slot: 'layoutRef',
    showOmission: true,
    columAttr: { minWidth: 200 }
  },
  { prop: 'memo', label: '关键字', showOmission: true, columAttr: { minWidth: 150 } },

  { prop: 'status', label: '状态', slot: 'status', columAttr: { minWidth: 110 } },
  {
    prop: 'isColorful',
    label: '彩色',
    json: { sourceName: 'yOrN', keyName: 'isColorful' },
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    columAttr: { minWidth: 220 }
  },
  {
    prop: 'commentFlag',
    label: '评论',
    json: { sourceName: 'yOrN', keyName: 'commentFlag' },
    columAttr: { minWidth: 60 }
  },
  {
    prop: 'voteFlag',
    label: '投票',
    json: { sourceName: 'yOrN', keyName: 'voteFlag' },
    columAttr: { minWidth: 60 }
  },
  { prop: 'newspaperDesc', label: '描述', showOmission: true, columAttr: { minWidth: 150 } }
]
const refetchData = () => {
  const modalData = modalsStore.newsSeriesModal.modalData
  if (modalData?.formMode === 'add') {
    currentPage.value = 1
    pageSize.value = 15
  }
  fetchData()
  modalsStore.hideModal('newsSeriesModal')
  modalsStore.resetModal('newsSeriesModal')
}
const handleSeriesSave = (isNeedResetPage: boolean) => {
  if (isNeedResetPage) {
    currentPage.value = 1
    pageSize.value = 15
  }
  fetchData()
}
// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    // Extract recommendTop from queryForm first
    const { recommendTop, ...restQueryForm } = queryForm

    const req = {
      page: currentPage.value,
      size: pageSize.value,
      recommendTop: recommendTop === 'L' ? '' : recommendTop,
      ...restQueryForm
    }

    const response = await list(req)

    if (response.success) {
      tableData.value = (response.data.list || []).map((item) => {
        return getLayoutRefs(item)
      })
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
const getLayoutRefs = (item, layoutCodes = ['A', 'B', 'C', 'D']) => {
  const layoutRefs = layoutCodes.reduce((acc, code) => {
    acc[`layout${code}Ref`] =
      item.newsLayoutRelations.find((relation) => relation.layoutCode === code)?.newspaperCode || ''
    return acc
  }, {})

  return {
    ...item,
    ...layoutRefs
  }
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
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
  // if (!queryForm.manageSiteId) {
  //   ElMessage.warning('请先选择站点')
  //   return
  // }
  modalsStore.showModal('newsSeriesModal')
  modalsStore.setActiveTab('newsSeriesModal', 'basic')
  modalsStore.setModalData('newsSeriesModal', {
    formMode: 'add',
    lineFormData: initNewspaperEditForm(),
    manageSiteId: queryForm.manageSiteId
  })
}
const openRecommendList = () => {
  showRecommend.value = true
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

//table版面的展示
const getLayoutTable = (scope: any) => {
  const labels: string[] = []
  if (
    scope.row.layoutARef == '' &&
    scope.row.layoutBRef == '' &&
    scope.row.layoutCRef == '' &&
    scope.row.layoutDRef == ''
  ) {
    return
  } else {
    if (scope.row.layoutCode === 'A') {
      labels.push('当前')
    } else if (scope.row.layoutARef && scope.row.layoutARef !== '') {
      labels.push(scope.row.newsLayoutRelations.find((obj) => obj.layoutCode === 'A').newspaperName)
    } else {
      labels.push(' ')
    }
    if (scope.row.layoutCode === 'B') {
      labels.push('当前')
    } else if (scope.row.layoutBRef && scope.row.layoutBRef !== '') {
      labels.push(scope.row.newsLayoutRelations.find((obj) => obj.layoutCode === 'B').newspaperName)
    } else {
      labels.push(' ')
    }
    if (scope.row.layoutCode === 'C') {
      labels.push('当前')
    } else if (scope.row.layoutCRef && scope.row.layoutCRef !== '') {
      labels.push(scope.row.newsLayoutRelations.find((obj) => obj.layoutCode === 'C').newspaperName)
    } else {
      labels.push(' ')
    }
    if (scope.row.layoutCode === 'D') {
      labels.push('当前')
    } else if (scope.row.layoutDRef && scope.row.layoutDRef !== '') {
      labels.push(scope.row.newsLayoutRelations.find((obj) => obj.layoutCode === 'D').newspaperName)
    } else {
      labels.push(' ')
    }

    return labels.join('｜')
  }
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

const modalsStore = useModalsStore()
const handleSeriesClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', {
    id: row.seriesCode,
    manageSiteId: queryForm.manageSiteId
  })
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading, queryForm.manageSiteId)
  layoutCodeList.value = ['A', 'B', 'C', 'D'].map((code) => ({ label: code, value: code }))
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
