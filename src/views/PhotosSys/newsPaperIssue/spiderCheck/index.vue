<template>
  <el-dialog
    :model-value="true"
    class="tabs-dialog"
    destroy-on-close
    draggable
    @close="closeTabs"
    :close-on-click-modal="false"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="爬取" name="spider" class="m_tabs_pane">
        <section ref="queryRef">
          <el-form :inline="true" class="custom-el-form no-rule" :model="queryForm" label-width="70px" ref="formRef">
            <el-form-item label="彩种:" prop="gameType">
              <GameTypeList
                v-model="queryForm.gameType"
                :withDefault="true"
                @onSelect="handleGameTypeChange"
                @defaultLoaded="initIssueSelect"
                style="width: 100px"
                :disabled="showCommit || isSpiderLoading"
              />
            </el-form-item>

            <el-form-item label="年份:" prop="year">
              <el-select
                v-model="queryForm.year"
                placeholder="年份"
                @change="handleYearChange"
                :disabled="showCommit || isSpiderLoading"
                style="width: 100px"
              >
                <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item label="期数:" prop="issue">
              <el-select
                v-model="queryForm.issue"
                placeholder="请选择期数"
                filterable
                :disabled="!queryForm.gameType || !queryForm.year || showCommit || isSpiderLoading"
                style="width: 150px"
              >
                <el-option
                  v-for="item in issueOptionsState.data"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <!-- <p v-else>{{ form.issue }}</p> -->
            </el-form-item>
            <el-form-item label="爬取目标:" prop="baseUrl" label-width="100px">
              <el-select
                v-model="queryForm.baseUrl"
                placeholder="请选择URL"
                :disabled="showCommit || isSpiderLoading"
                style="width: 150px"
              >
                <el-option v-for="url in issueBaseUrlList" :key="url" :label="url" :value="url" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="!showCommit"
                type="primary"
                @click="spiderRun()"
                :loading="isSpiderLoading || issueOptionsState.loading"
              >
                爬取
              </el-button>
              <el-button
                type="primary"
                @click="fetchSpiderCheckData()"
                :loading="isLoading || issueOptionsState.loading"
              >
                刷新
              </el-button>
              <el-button
                v-if="showCommit"
                type="success"
                @click="commit('1')"
                :loading="isLoading || issueOptionsState.loading"
              >
                提交
              </el-button>
              <el-button
                v-if="showCommit"
                type="danger"
                @click="commit('0')"
                :loading="isLoading || issueOptionsState.loading"
              >
                放弃
              </el-button>
              <!-- <el-button
                type="primary"
                :icon="Search"
                @click="spiderStep()"
                :loading="isLoading || issueOptionsState.loading"
              >
                test2
              </el-button> -->
            </el-form-item>
          </el-form>
        </section>
        <section style="display: flex; flex-direction: column; flex: 1; overflow: hidden">
          <div class="main_flex_table">
            <el-table
              ref="tableRef"
              :data="paginatedData"
              stripe
              highlight-current-row
              v-loading="isLoading || isSpiderLoading"
            >
              <el-table-column label="期刊" prop="imgPath" min-width="120">
                <template #default="{ row }">
                  <el-image
                    v-if="row.imgPath"
                    style="width: 100px; height: 60px; object-fit: contain"
                    :src="`${VITE_CDN_URL}${row.imgPath}`"
                    :preview-src-list="[`${VITE_CDN_URL}${row.imgPath}`]"
                    preview-teleported
                    fit="contain"
                  />
                  <p v-else style="color: #999">图片下载中...</p>
                </template>
              </el-table-column>
              <el-table-column label="年份" prop="year" align="right" width="80">
                <template #default="{ row }">
                  <p style="text-align: right">{{ row.year }}</p>
                </template>
              </el-table-column>
              <el-table-column label="期数" prop="issue" min-width="120" align="right">
                <template #default="{ row }">
                  <p style="text-align: right">{{ row.issue }}</p>
                </template>
              </el-table-column>
              <el-table-column label="图纸名称" prop="name" min-width="180">
                <template #default="{ row }">
                  <p>{{ truncateText(row.name, 10) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="报纸名称" prop="newspaperName" min-width="180">
                <template #default="{ row }">
                  <p>{{ truncateText(row.newspaperName, 10) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="系列名称" prop="seriesName" min-width="180">
                <template #default="{ row }">
                  <p>{{ truncateText(row.seriesName, 10) }}</p>
                </template>
              </el-table-column>
              <el-table-column label="彩种" prop="gameType">
                <template #default="{ row }">
                  <p>{{ getGameTypeName(row.gameType) }}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="pagination" style="margin-bottom: 10px">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[15, 30, 50, 100]"
              :total="total"
              layout="prev, pager, next, jumper, ->, sizes, total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :disabled="isLoading || isSpiderLoading"
            />
          </div>
        </section>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue'
import { commitSpiderCheck, getPureIssueBaseUrlList, getSpiderCheckList } from '@/api/photoSys/spider'
import { truncateText, YearTypes } from '@/utils/dataFormat'
import useIssueOptionLogic from '../../gameResult/useIssueOptionLogic'
import { useBettingStore } from '@/stores/bettingStore'
import { useSpiderLogic } from '@/views/PhotosSys/newsPaperIssue/composables/useSpiderLogic'

const { VITE_CDN_URL } = window.webConfigApi

defineProps<{
  modelValue: boolean
}>()

const { issueOptionsState, loadIssueOptions } = useIssueOptionLogic()
const yearOptions = YearTypes

const isLoading = ref(false)
const activeTab = ref('spider')
const emits = defineEmits(['close', 'update:modelValue', 'showVideoDetails', 'commit'])
const issueBaseUrlList = ref<any[]>([])

// Use spider logic composable
const { runSpider, isSpiderLoading, checkSpiderStatus } = useSpiderLogic()

const bettingStore = useBettingStore()
const getGameTypeName = (gameType: string) => {
  return (
    bettingStore.getAllGetGameType().find((item) => item.gameType.toString() === gameType.toString())?.gameTypeName ||
    ''
  )
}

const initQueryForm = () => {
  return {
    gameType: '',
    year: yearOptions[0].value?.toString() || '',
    issue: '',
    baseUrl: issueBaseUrlList.value[0] || ''
  }
}
const queryForm = reactive<any>(initQueryForm())
const paginatedData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const showCommit = computed(() => {
  return paginatedData.value.length > 0
})

const fetchSpiderCheckData = async () => {
  isLoading.value = true
  try {
    const checkData = await checkSpiderStatus(queryForm)
    if (checkData && checkData.data?.downloadCode === 2) {
      ElMessage.success('当前爬取已完成，可进行提交操作')
    }
    const query: any = { ...queryForm, page: currentPage.value, size: pageSize.value }
    const res = await getSpiderCheckList(query)
    if (res.success && res.data) {
      paginatedData.value = res.data.list.map((item) => ({
        ...item
      }))
      total.value = Number(res.data.total)
    } else {
      ElMessage({
        message: '获取审核数据失败',
        type: 'error'
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const spiderRun = async () => {
  const spiderParams = {
    issue: queryForm.issue,
    baseUrl: queryForm.baseUrl,
    gameType: queryForm.gameType,
    year: queryForm.year
  }

  const success = await runSpider(
    spiderParams,
    // On completion callback
    () => {
      fetchSpiderCheckData()
    },
    // On no data callback (optional)
    () => {
      console.log('Spider completed but no data found')
    }
  )

  if (!success) {
    ElMessage.error('爬取启动失败')
  }
}
const closeTabs = () => {
  emits('close')
  emits('update:modelValue', false)
}
const commit = async (c: '0' | '1') => {
  try {
    isLoading.value = true
    const res = await commitSpiderCheck({
      issue: queryForm.issue,
      baseUrl: queryForm.baseUrl,
      gameType: queryForm.gameType,
      year: queryForm.year,
      commit: c
    })
    if (res.success) {
      if (c === '1') {
        if (res.data.commitCode === 0) {
          ElMessage.success('操作成功')
          emits('commit')
          closeTabs()
        } else {
          ElMessage.error(res.data.message || '操作失败')
        }
      } else {
        ElMessage.success('操作成功')
        closeTabs()
      }
    } else {
      throw new Error(res.message)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('操作失败')
  } finally {
    isLoading.value = false
  }
}
defineExpose({
  async refresh() {
    await fetchSpiderCheckData()
  }
})

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchSpiderCheckData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchSpiderCheckData()
}

const handleGameTypeChange = async (_: string) => {
  queryForm.issue = ''
  issueOptionsState.data = []
  await loadIssueOptions(queryForm.gameType, queryForm.year)
  queryForm.issue = issueOptionsState.data[0]?.value || ''
}

const initIssueSelect = async (_: string) => {
  queryForm.issue = ''
  issueOptionsState.data = []
  await loadIssueOptions(queryForm.gameType, queryForm.year)
  queryForm.issue = issueOptionsState.data[0]?.value || ''
}

const handleYearChange = async (_: string) => {
  queryForm.issue = ''
  issueOptionsState.data = []
  await loadIssueOptions(queryForm.gameType, queryForm.year)
  queryForm.issue = issueOptionsState.data[0]?.value || ''
}

const getIssueBaseUrlList = async () => {
  isLoading.value = true
  try {
    const res = await getPureIssueBaseUrlList({ page: 1, size: 1000 })
    if (res.success && res.data) {
      issueBaseUrlList.value = res.data.list
      queryForm.baseUrl = issueBaseUrlList.value[0] || ''
    } else {
      ElMessage.error('获取URL列表失败')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  //   await fetchSpiderCheckData()
  await getIssueBaseUrlList()
})
</script>

<style lang="less">
.main_flex_table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
  row-gap: 10px;
  .el-table {
    flex: 1;
  }
}
</style>
