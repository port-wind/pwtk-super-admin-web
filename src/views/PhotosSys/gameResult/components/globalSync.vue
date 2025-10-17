<script setup lang="ts">
import { getMissingData, pushByIssue } from '@/api/photoSys/gameResult'
import { dayjs } from 'element-plus'
import { unitFormatDate } from '@/utils/dateFormat'
import lottoBall from '../components/lottoBall.vue'

interface Props {
  gameUrl: string
}

type NumInfo = {
  fiveElements: string
  shengxiao: string
  size: string
  color: string
  num: number
  index: number
  oddEven: string
}

type HisotryFromOfficialItem = {
  issue: string
  num1: number
  num2: number
  num3: number
  num4: number
  num5: number
  num6: number
  numInfo: NumInfo[]
  openTime: number
  result: string
  teNum: number
}

const isLoading = ref(false)

const historyListFromOfficial = ref<HisotryFromOfficialItem[]>([])

const selectedRows = ref<HisotryFromOfficialItem[]>([])

const props = defineProps<Props>()

const show = defineModel('show', { type: Boolean })

const activeTab = ref('gameSync')

const year = ref<string>()

const issue = ref<string>()

const pageSize = ref(15)

const currentPage = ref(1)

const total = ref<number>(0)

function beforeOpen() {
  console.log('beforeOpen')
}

function onSizeChange(size: number) {
  console.log('onSizeChange', size)
  currentPage.value = 1
  pageSize.value = size
  onSearch()
}

function onCurrentChange(current: number) {
  console.log('onCurrentChange', current)
  currentPage.value = current
  onSearch()
}

async function onSearch() {
  try {
    isLoading.value = true

    const issueNumber = Number(issue.value)

    if (isNaN(issueNumber)) {
      ElMessage.error('请输入正确的期数')
      return
    }

    if (!year.value) {
      ElMessage.error('请选择年份')
      return
    }

    const response = await getMissingData(props.gameUrl, issueNumber, dayjs(year.value).year())

    if (!response.success) {
      ElMessage.error(response.errMessage)
      return
    }
    if (!response.data.data) {
      ElMessage.info('暂无数据')
      return
    }
    historyListFromOfficial.value = []
    historyListFromOfficial.value.push(response.data.data)
    total.value = historyListFromOfficial.value.length
    currentPage.value++
  } catch (error) {
    console.error(error)
    ElMessage.error('查询失败')
  } finally {
    isLoading.value = false
  }
}

function handleSelectionChange(newSelection: HisotryFromOfficialItem[]) {
  selectedRows.value = newSelection
}

function onCancel() {
  show.value = false
}

async function onSync() {
  try {
    isLoading.value = true
    const issue = Number(selectedRows.value.map((item) => item.issue)[0])
    const year = selectedRows.value.map((item) => dayjs(item.openTime).year())[0]
    if (!issue || isNaN(issue)) {
      ElMessage.error('期数错误')
      return
    }

    if (!year) {
      ElMessage.error('年份错误')
      return
    }

    const response = await pushByIssue(props.gameUrl, issue, year)

    if (!response.success) {
      ElMessage.error(response.errMessage)
      return
    }
    ElMessage.success('同步成功')
    historyListFromOfficial.value = []
  } catch (error) {
    console.error(error)
    ElMessage.error('同步失败')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  watch(
    () => show.value,
    (newValue) => {
      console.log(newValue)
      if (newValue === true) {
        historyListFromOfficial.value = []
        issue.value = undefined
        year.value = undefined
      }
    }
  )
})
</script>

<template>
  <el-dialog
    draggable
    overflow
    detroy-on-close
    class="tabs-dialog"
    v-model="show"
    :close-on-click-modal="false"
    @open="beforeOpen"
  >
    <el-tabs class="m_tabs" v-model="activeTab" v-loading="isLoading">
      <el-tab-pane label="开奖结果" name="gameSync" class="m_tabs_pane">
        <div>
          日期范围：
          <el-date-picker v-model="year" type="year" placeholder="请选择年份" />
          &nbsp; 期数:
          <el-input v-model="issue" style="width: 240px" placeholder="请输入期数" />
          &nbsp;
          <el-button type="primary" @click="onSearch">
            <template #icon>
              <el-icon style="margin: 0 5px 0 0">
                <Search />
              </el-icon>
            </template>
            查询
          </el-button>
        </div>
        <div v-if="historyListFromOfficial?.length">
          <div class="cc-table-header-bar">
            <div class="cc-title">缺失期数列表</div>
            <div class="cc-table-header-bar-actions">
              <el-button type="default" @click="onCancel">
                <template #icon>
                  <el-icon style="margin: 0 5px 0 0">
                    <CloseBold />
                  </el-icon>
                </template>
                取消
              </el-button>
              <el-button type="primary" :disabled="selectedRows.length === 0" @click="onSync">
                <template #icon>
                  <el-icon style="margin: 0 5px 0 0">
                    <Search />
                  </el-icon>
                </template>
                同步
              </el-button>
            </div>
          </div>

          <el-divider />
          <el-scrollbar class="cc-scrollbar">
            <el-table
              :data="historyListFromOfficial"
              height="calc(100vh - 380px)"
              @selection-change="handleSelectionChange"
              stripe
            >
              <el-table-column type="selection" width="55" />
              <el-table-column prop="issue" label="期数" width="100" align="center"></el-table-column>

              <el-table-column prop="openTime" label="开奖时间" width="200" align="center">
                <template #default="{ row }">
                  {{ unitFormatDate(row.openTime, 'yyyy-MM-dd HH:mm:ss') }}
                </template>
              </el-table-column>
              <el-table-column prop="result" label="开奖结果" min-width="300" align="center">
                <template #default="{ row }">
                  <lotto-ball
                    v-for="i in 6"
                    :number="row.numInfo[i - 1].num"
                    :color="row.numInfo[i - 1].color"
                    :zodiacSigns="row.numInfo[i - 1].shengxiao"
                  />
                  <span style="margin: 2px; margin-right: 4px">+</span>
                  <lotto-ball
                    :number="row.numInfo[6].num"
                    :color="row.numInfo[6].color"
                    :zodiacSigns="row.numInfo[6].shengxiao"
                  />
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="cc-pagination"
              :current-page="currentPage - 1"
              :page-size="pageSize"
              :page-sizes="[15, 30, 50, 100]"
              layout="prev, pager, next, jumper, ->, sizes, total"
              :total="total"
              @size-change="onSizeChange"
              @current-change="onCurrentChange"
            />
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style scoped>
.input-number {
  width: 100%;
}

.cc-scrollbar {
  padding: 0 10px;
  margin-top: 20px;
}

.cc-submit {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.cc-form {
  width: 80%;
  max-width: 750px;
  margin: 0 auto;
}

.cc-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.cc-table-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.cc-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
}

.cc-table-header-bar-actions {
  display: flex;
}

.cc-pagination {
  margin-top: 10px;
}
</style>
