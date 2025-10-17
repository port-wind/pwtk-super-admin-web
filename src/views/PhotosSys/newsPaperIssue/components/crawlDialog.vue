<template>
  <el-dialog
    :model-value="crawlVisible"
    @update:modelValue="(value) => $emit('update:crawlVisible', value)"
    class="tabs-dialog"
    style="height: 200px; width: 500px"
    @close="() => $emit('update:crawlVisible', false)"
    width="500"
  >
    <section style="display: flex; flex-direction: column; height: 100%">
      <div style="display: flex; align-items: center">
        <el-icon style="font-size: 25px; color: #fdc855"><Warning /></el-icon>
        <span>请选择想爬取的彩种及期数…</span>
      </div>
      <div style="flex: 1; padding: 10px">
        <el-form v-bind="$attrs" :model="queryForm" label-width="auto" ref="formRef">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="彩种:" prop="postGametypeRef">
                <GameTypeList
                  v-model="queryForm.gameType!"
                  withDefault
                  @defaultLoaded="
                    () => {
                      Object.assign(queryForm, { gameType: queryForm.gameType })
                      loadIssueValue({ gameType: queryForm.gameType, year: yearNow })
                    }
                  "
                  @onSelect="val => gameTypeChange(val!)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布期数:" prop="postIssue">
                <SelectIssueByYear v-model="queryForm.issue" :year="yearNow" :gameType="queryForm.gameType!" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="button-row">
        <el-button type="primary" :loading="isLoadingCrawl" @click="commit">提交</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script lang="ts" setup>
import { crawlIssues, getIssueListByParams } from '@/api/photoSys/issues'
import { EDownloadStatus } from '@/api/photoSys/issues/type'
import showErrorMessage from '@/utils/showErrorMessage'

defineProps({
  crawlVisible: {
    type: Boolean,
    default: false
  }
})
const yearNow = ref(new Date().getFullYear().toString())
const emit = defineEmits(['update:crawlVisible', 'commit'])
const queryForm = reactive({
  gameType: '',
  issue: ''
})
const isLoadingCrawl = ref(false)
const loadIssueOptions = async (gameType: string, year: string) => {
  let GameIssueList = []
  if (!gameType || !year) {
    GameIssueList = []
    return
  }
  try {
    const response = await getIssueListByParams({ gameType, year })

    if (!response?.success) {
      GameIssueList = []
      showErrorMessage(response)
      return
    }

    GameIssueList =
      response?.data?.map((item: string) => ({
        value: item,
        label: item
      })) || []
  } catch (error) {
    console.error('Failed to fetch issue options:', error)
    GameIssueList = []
  }
  return GameIssueList
}
async function loadIssueValue(params: { gameType: string; year: string }, withValue = true) {
  const gameIssueList = (await loadIssueOptions(params.gameType, params.year)) as Array<{
    value: string
    label: string
  }>
  if (!gameIssueList?.length) return
  if (!withValue) return
  queryForm.issue = gameIssueList[0]?.value || ''
}
const gameTypeChange = async (val: any) => {
  console.log(val)
  await loadIssueValue({ gameType: val?.gameType, year: yearNow.value })
}
const commit = async () => {
  const errorHandle = (error: any) => {
    console.error('Error during crawling:', error)
    ElMessage({
      type: 'error',
      message: '爬取失败，请稍后重试'
    })
  }
  isLoadingCrawl.value = true
  const query = {
    gameType: queryForm.gameType,
    issue: queryForm.issue
  }
  try {
    const res = await crawlIssues(query)
    if (res.success) {
      const result = res.data
      if (result && result.downloadStatus) {
        // 开始下载
        if (result.downloadStatus === EDownloadStatus.STARTED) {
          ElMessage({
            type: 'warning',
            message: result.message
          })
          emit('update:crawlVisible', false)
          emit('commit')
          // 任务下载中
        } else if (result && result.downloadStatus === EDownloadStatus.DOWNLOADING) {
          ElMessage({
            type: 'warning',
            message: result.message
          })
          // 最后一个任务下载中，请等待
        } else if (result && result.downloadStatus === EDownloadStatus.LAST_TASK_DOWNLOADING_PLEASE_WAIT) {
          ElMessage({
            type: 'warning',
            message: result.message
          })
          // 下载完成
        } else if (result && result.downloadStatus === EDownloadStatus.FINISHED) {
          ElMessage({
            type: 'success',
            message: result.message
          })
          // 完全没有数据
        } else if (result && result.downloadStatus === EDownloadStatus.NO_DATA) {
          ElMessage({
            type: 'error',
            message: result.message
          })
          // 下载中，有一些数据
        } else if (result && result.downloadStatus === EDownloadStatus.DOWNLOADING_HAVE_A_FEW_DATA) {
          ElMessage({
            type: 'warning',
            message: result.message
          })
          // 下载中，还没有数据
        } else if (result && result.downloadStatus === EDownloadStatus.DOWNLOADING_NOT_YET_HAVE_DATA) {
          ElMessage({
            type: 'warning',
            message: result.message
          })
        } else {
          errorHandle(null)
        }
      }
    } else {
      errorHandle(null)
    }
  } catch (error) {
    console.error('Error during crawling:', error)
    errorHandle(error)
  } finally {
    isLoadingCrawl.value = false
  }
}
</script>
<style lang="less" scoped></style>
