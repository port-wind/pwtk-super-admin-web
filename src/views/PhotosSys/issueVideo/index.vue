<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <section ref="queryRef" class="video-search-area">
      <el-form :inline="true" class="search_left" :model="queryForm" @keyup.enter="fetchData">
        <el-form-item prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item prop="gameType">
          <game-type-list-with-all
            v-model="queryForm.gameType"
            show-total
            :with-default="false"
            placeholder="彩种"
            clearable
          />
        </el-form-item>

        <el-form-item prop="issue">
          <el-input v-model.number="queryForm.issue" placeholder="期数" clearable @keyup.enter="fetchData" />
        </el-form-item>

        <el-form-item prop="videoTitle">
          <el-input v-model.trim="queryForm.videoTitle" placeholder="视频名称" clearable @keyup.enter="fetchData" />
        </el-form-item>

        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <!-- Data Table -->
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        class="table"
        :total="total"
        pagination
        stripe
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #videoPicture="{ scope }">
          <el-image
            style="width: 100px; height: 60px; object-fit: contain"
            :src="getLocalCoverByGameTypeId(scope.row.gameType)"
            :preview-src-list="[getLocalCoverByGameTypeId(scope.row.gameType)]"
            preview-teleported
            fit="contain"
          />
        </template>

        <template #videoTitle="{ scope }">
          <SimplePopover :model-value="scope.row.videoTitle || '-'"></SimplePopover>
        </template>

        <template #gameType="{ scope }">
          <span>{{ getGameTypeName(scope.row.gameType) }}</span>
        </template>

        <template #uploadVideoTime="{ scope }">
          <span>{{ unitFormatDate(scope.row.uploadVideoTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
        </template>

        <template #updateVideoTime="{ scope }">
          <span>{{ unitFormatDate(scope.row.updateVideoTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
        </template>

        <template #operations="{ scope }">
          <el-link type="primary" @click="handleEdit(scope.row)" style="margin-right: 10px">编辑</el-link>
        </template>
      </m-table>
    </section>

    <!-- Add/Edit Dialog -->
    <video-form-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :video-data="currentVideo"
      :mode="dialogMode"
      @refresh="returnFromDetails"
      @close="handleClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import SimplePopover from '@/components/simplePopover/index.vue'
import { useBettingStore } from '@/stores/bettingStore'
import GameTypeList from '@/components/gameTypeList/index.vue'
import MTable from '@/components/mTable/index.vue'
import VideoFormDialog from './components/VideoFormDialog.vue'
import type { IIssueVideo, IIssueVideoListParams } from '@/api/photoSys/issueVideo/type.ts'
import { YearTypes } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat'
import { getIssueVideoList } from '@/api/photoSys/issueVideo/index'

const bettingStore = useBettingStore()
const queryRef = ref()

// Initialize query form
const initQueryForm = () => ({
  year: 'L',
  gameType: 0,
  issue: undefined,
  videoTitle: ''
})

const queryForm = reactive<Partial<IIssueVideoListParams>>(initQueryForm())

// Table data
const tableData = ref<IIssueVideo[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(15)
const isLoading = ref(false)

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const currentVideo = ref<IIssueVideo | null>(null)
// Get game type name from store
const getGameTypeName = (gameType: string) => {
  const game = bettingStore.gameType.find((item) => item.gameType.toString() === gameType.toString())
  return game?.gameTypeName || gameType
}

// (Remote media URL util was removed as we now use local covers by game type)

// Local cover assets by gameType code (a6/hk6)
const BG_A6 = new URL('./asset/bg-a6.jpg', import.meta.url).href
const BG_HK6 = new URL('./asset/bg-hk6.jpg', import.meta.url).href

const defaultCoverByCode: Record<string, string> = {
  a6: BG_A6,
  hk6: BG_HK6
}

// Resolve gameTypeCode (a6/hk6/...) by gameType id
const getGameTypeCodeById = (gameTypeId: string) => {
  const game = bettingStore.gameType.find((item) => item.gameType.toString() === gameTypeId.toString())
  return game?.gameTypeCode || ''
}

// Get local cover image for a row by gameType id
const getLocalCoverByGameTypeId = (gameTypeId: string) => {
  const code = getGameTypeCodeById(gameTypeId)
  return defaultCoverByCode[code] || BG_A6
}

// Table configuration
const options: any[] = [
  { label: '视频标题', prop: 'videoPicture', slot: 'videoPicture', minWidth: 120 },
  { label: '年份', prop: 'year', minWidth: 80 },
  { label: '期数', prop: 'issue', minWidth: 100 },
  { label: '视频名称', prop: 'videoTitle', slot: 'videoTitle', minWidth: 180 },
  { label: '彩种', prop: 'gameType', slot: 'gameType', minWidth: 100 },
  { label: '发布时间', prop: 'uploadVideoTime', minWidth: 160, slot: 'uploadVideoTime' },
  { label: '更新时间', prop: 'updateVideoTime', minWidth: 160, slot: 'updateVideoTime' },
  { label: '操作', prop: 'operations', slot: 'operations', fixed: 'right', minWidth: 100 }
]

// Fetch data
const fetchData = async (_queryForm = queryForm) => {
  isLoading.value = true
  try {
    const params: IIssueVideoListParams = {
      ..._queryForm,
      page: currentPage.value,
      size: pageSize.value
    }

    // Only add optional params if they have values
    if (!params.year || params.year === 'L') delete (params as any).year
    if (!params.gameType) delete (params as any).gameType
    if (!params.issue) delete (params as any).issue
    if (!params.videoTitle) delete (params as any).videoTitle

    const res = await getIssueVideoList(params)
    if (res.success && res.data) {
      tableData.value = (res.data.list as unknown as IIssueVideo[]) || []
      total.value = Number(res.data.total) || 0
    } else {
      ElMessage.error(res.errMessage || '获取视频列表失败')
    }
  } catch (error) {
    console.error('Error fetching video list:', error)
    ElMessage.error('获取视频列表失败')
  } finally {
    isLoading.value = false
  }
}

// Handle reset
const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  fetchData()
}

const handleClose = () => {
  dialogVisible.value = false
  currentVideo.value = null
}

// Return from details
const returnFromDetails = () => {
  fetchData()
}

// Handle add
const handleAdd = () => {
  dialogMode.value = 'add'
  currentVideo.value = null
  dialogVisible.value = true
}

// Handle edit
const handleEdit = (row: IIssueVideo) => {
  dialogMode.value = 'edit'
  currentVideo.value = row
  dialogVisible.value = true
}

// Handle pagination
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

// Initialize
onMounted(async () => {
  // Load game types if not already loaded
  if (bettingStore.gameType.length === 0) {
    await bettingStore.getGameType()
  }
  fetchData()
})
</script>

<style lang="scss" scoped>
#issue-video-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;

  .video-search-area {
    margin-bottom: 20px;
  }

  .main_flex_table {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;

    .table {
      flex: 1;
    }
  }
}
</style>
