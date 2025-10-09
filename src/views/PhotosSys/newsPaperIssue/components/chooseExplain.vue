<template>
  <div v-show="choosingExplain" style="width: 100%; display: flex; flex-direction: column; height: 100%">
    <el-table
      show-overflow-tooltip
      :data="explaintableList"
      v-loading="isLoading"
      stripe
      highlight-current-row
      style="width: 100%; flex: 1"
    >
      <el-table-column label="图解内容" align="left" width="210">
        <template #default="{ row }">
          {{ extractTextFromHTML(row.postContent) }}
          <el-icon v-if="row.postUserId" @click="jumpExplainView({ id: row.postId })">
            <Position />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="发布用户" align="left">
        <template #default="{ row }">
          {{ truncateText(row.loginId) }} | {{ truncateText(row.nickname) }}
          <el-icon v-if="row.postUserId" @click="jumpView({ id: row.postUserId, tab: 'tab1' })">
            <Position />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="标签" align="left">
        <template #default="{ row }">
          {{ getTagLabels(row) }}
        </template>
      </el-table-column>
      <el-table-column label="点赞 | 收藏 | 阅读量" width="220">
        <template #default="{ row }">{{ row.favoriteCount }} | {{ row.likeCount }} | {{ row.readCount }}</template>
      </el-table-column>
      <el-table-column label="状态" align="left">
        <template #default="{ row }">
          <span style="margin-right: 10px">
            {{ row.status === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(row, handleUpdateGraphicSolution, fetchGraphicSolutionList)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="explainQueryForm.page"
        v-model:page-size="explainQueryForm.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="explainTotal"
        @size-change="handleEListSizeChange"
        @current-change="handleEListCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { graphicSolutionGroup, updateGraphicSolution } from '@/api/photoSys/issues'
import showErrorMessage from '@/utils/showErrorMessage'
import { ref, onMounted } from 'vue'
import { PropType } from 'vue'
import { statusChanged } from '@/utils/table'
import { extractTextFromHTML } from '@/utils/dataFormat'
import router from '@/router'

interface SelectedRow {
  postYear: string
  postIssue: string
  issueId: string
  gameType: string
}
const props = defineProps({
  selectedRow: {
    type: Object as PropType<SelectedRow>,
    default: () => ({})
  }
})
const choosingExplain = ref(true)
const explaintableList = ref<any>([])
const explainQueryForm = reactive({
  page: 1,
  size: 15
})
const explainTotal = ref(0)
const isLoading = ref(false)
const queryForm = ref({
  page: 1,
  size: 15
})

const emit = defineEmits(['select-explain'])

const handleChoosingExplain = (row: any) => {
  emit('select-explain', row)
}

const handleEListSizeChange = (size: number) => {
  queryForm.value.size = size
  fetchGraphicSolutionList({ ...explainQueryForm })
}

const handleEListCurrentChange = (page: number) => {
  queryForm.value.page = page
  fetchGraphicSolutionList({ ...explainQueryForm })
}
const handleUpdateGraphicSolution = async (row: any) => {
  const params = {
    postId: row.postId,
    status: row.status
  }
  return await updateGraphicSolution(params)
}
const fetchGraphicSolutionList = async (params?: {
  issueId?: string | number
  page?: number
  size?: number
  gameType?: any
}) => {
  const req = {
    page: explainQueryForm.page,
    size: explainQueryForm.size,
    ...props.selectedRow
  }
  const res = await graphicSolutionGroup({ ...req }) // 获取图解list
  if (res.success) {
    explaintableList.value = res.data.list.map((item: any) => {
      return item
    })
    explainTotal.value = Number(res.data.total) || 0
  } else {
    showErrorMessage(res)
  }
}
const getTagLabels = (row: any) => {
  const labels: string[] = []
  if (row.isRecommended === 'y') labels.push('推荐')
  if (row.isHot === 'y') labels.push('热门')
  if (row.isSelected === 'y') labels.push('精选')
  if (row.isTop === 'y') labels.push('置顶')
  if (row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

const truncateText = (text: string, limit = 10) => {
  if (!text) return ''
  return text.length > limit ? text.slice(0, limit) + '...' : text
}
const jumpView = ({ id, tab }) => {
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
const jumpExplainView = ({ id }) => {
  const routeData = router.resolve({
    path: '/betting/photoExplain',
    query: { postId: id }
  })
  window.open(routeData.href, '_blank')
}

onMounted(() => {
  fetchGraphicSolutionList({ ...explainQueryForm })
})
</script>
