<template>
  <div id="system_account" v-show="choosingIssue" style="width: 100%; display: flex; flex-direction: column">
    <el-table
      show-overflow-tooltip
      :data="tableData"
      v-loading="isLoading"
      stripe
      highlight-current-row
      style="width: 100%; flex: 1"
    >
      <el-table-column label="帖子标题">
        <template #default="{ row }">
          {{ truncateText(row.title) }}
        </template>
      </el-table-column>
      <el-table-column label="论坛">
        <template #default="{ row }">
          {{ truncateText(row.forumName) }}
        </template>
      </el-table-column>

      <el-table-column label="彩种" align="left" width="120">
        <template #default="{ row }">
          <p>{{ getGameTypeName(row?.postGametypeRef?.toString()) }}</p>
        </template>
      </el-table-column>

      <el-table-column label="发布年份" align="left" width="150">
        <template #default="{ row }">
          {{ row.postYear }}
        </template>
      </el-table-column>
      <el-table-column label="发布期数" align="left" width="150">
        <template #default="{ row }">
          {{ row.postIssue }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" width="100">
        <template #default="{ row }">
          <el-button type="success" size="small" @click="handleChoosingIssue(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      v-model:current-page="issueQueryForm.page"
      v-model:page-size="issueQueryForm.size"
      :page-sizes="[5, 15, 30, 50, 100]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="issueTotal"
      @size-change="handleEListSizeChange"
      @current-change="handleEListCurrentChange"
    /> -->
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { truncateText } from '@/utils/dataFormat'

const props = defineProps({
  postList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const bettingStore = useBettingStore()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = bettingStore.getAllGetGameType().find((item) => item.gameType === gameType)
  return gameTypeObj ? gameTypeObj.gameTypeName : ''
})
const choosingIssue = ref(true)
const tableData = ref<any>([])

const isLoading = ref(false)

const emit = defineEmits(['select-post'])
const handleChoosingIssue = (row: any) => {
  emit('select-post', row)
}

const fetchData = async () => {
  tableData.value = props.postList
}

onMounted(() => {
  fetchData()
})
</script>
