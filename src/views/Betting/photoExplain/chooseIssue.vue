<template>
  <div id="system_account" v-show="choosingIssue" style="width: 100%; display: flex; flex-direction: column">
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
        </el-form-item>
      </el-form>
    </section>
    <el-table
      show-overflow-tooltip
      :data="issuetableList"
      v-loading="isLoading"
      stripe
      highlight-current-row
      style="width: 100%; flex: 1"
    >
      <el-table-column label="年份" align="right" width="100">
        <template #="{ row }">
          {{ row.year }}
        </template>
      </el-table-column>
      <el-table-column label="期数" align="right" width="100">
        <template #="{ row }">
          {{ row.issue }}
        </template>
      </el-table-column>

      <el-table-column label="图纸名称" align="left" width="210">
        <template #="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>

      <el-table-column label="报纸名称" align="left" width="210">
        <template #="{ row }">
          {{ row.newspaperName }}
        </template>
      </el-table-column>
      <el-table-column label="系列名称" align="left" width="210">
        <template #="{ row }">
          {{ row.seriesName }}
        </template>
      </el-table-column>

      <el-table-column label="彩种" align="left">
        <template #="{ row }">
          <p>{{ getGameTypeName(row?.gameType?.toString()) }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="left">
        <template #="{ row }">
          <span style="margin-right: 10px">
            {{ row.status === 'y' ? '启用' : '关闭' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="彩色" align="left">
        <template #="{ row }">
          {{ row.isColorful === 'y' ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="left" width="100">
        <template #="{ row }">
          <el-button type="success" size="small" @click="handleChoosingIssue(row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="issueQueryForm.page"
        v-model:page-size="issueQueryForm.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="issueTotal"
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
import { YearTypes } from '@/utils/dataFormat'
import { list, getNewsPaperList, create, update, getDetailById } from '@/api/photoSys/issues'

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
  },
  gameTypeList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = props.gameTypeList.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})
const choosingIssue = ref(true)
const issuetableList = ref<any>([])
const issueQueryForm = reactive({
  page: 1,
  size: 15
})
const issueTotal = ref(0)
const isLoading = ref(false)
const initQueryFormValue = () => ({
  year: '',
  issue: '',
  gameType: '',
  name: '',
  newspaperName: '',
  newspaperCode: '',
  page: 1,
  size: 15
})
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  fetchData()
}
const queryForm = reactive(initQueryFormValue())

const emit = defineEmits(['select-issue'])
const handleNewspaperQuerySelect = (item: any) => {
  const { newspaperCode } = item.valueObj
  queryForm.newspaperCode = newspaperCode
  console.log('newspaperCode', newspaperCode)
}
const handleChoosingIssue = (row: any) => {
  emit('select-issue', row)
}

const handleEListSizeChange = (size: number) => {
  queryForm.size = size
  fetchData()
}

const handleEListCurrentChange = (page: number) => {
  queryForm.page = page
  fetchData()
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

const fetchData = async () => {
  const res = await list({ ...queryForm }) // 获取图解list
  if (res.success) {
    issuetableList.value = res.data.list.map((item: any) => {
      return item
    })
    issueTotal.value = Number(res.data.total) || 0
  } else {
    showErrorMessage(res)
  }
}

const truncateText = (text: string, limit = 10) => {
  if (!text) return ''
  return text.length > limit ? text.slice(0, limit) + '...' : text
}

onMounted(() => {
  fetchData()
})
</script>
