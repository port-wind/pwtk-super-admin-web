<script setup lang="ts">
import {
  type ListParams,
  type HistoryItem,
  getAHistory,
  getHKHistory,
  getSGHistory,
  getTWHistory,
  getXAHistory,
  getKL8History
} from '@/api/photoSys/gameResult'

import mSearch from '@/components/mSearchForm/index.vue'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import type { TableOptions } from '@/components/mTable/types'
import { unitFormatDate } from '@/utils/dateFormat'
import lottoBall from './components/lottoBall.vue'
import globalSync from './components/globalSync.vue'
import { gameTypeMapToCode } from '@/stores/bettingStore'
import useIssueOptionLogic from '@/views/PhotosSys/gameResult/useIssueOptionLogic'
import useYearOptionLogic from '@/views/PhotosSys/gameResult/useYearOptionLogic'
import type { Tab } from './data'

const isLoading = ref(false)
const isError = ref(false)
const showSync = ref(false)
const { issueOptionsState, loadIssueOptions } = useIssueOptionLogic()
const { yearOptionsState, loadYearOptionsByGameType } = useYearOptionLogic()
const total = ref<number>(0)
const pageSize = ref(15)
const currentPage = ref(1)

const tabList = [
  { label: '澳六', value: 'a' },
  { label: '台六', value: 'tw' },
  { label: '港六', value: 'hk' },
  { label: '新六', value: 'sg' },
  { label: '新澳六', value: 'xa' },
  { label: '快乐8', value: 'kl8' }
]

const paramsIssue = ref<string>('')
const paramsYear = ref<string>('')

const searchBarOptions: SearchOption[] = [
  {
    prop: 'year',
    type: 'select',
    slot: 'year'
  },
  {
    prop: 'issue',
    type: 'select',
    slot: 'issue'
  }
]

const tableOptions: TableOptions[] = [
  {
    prop: 'issue',
    label: '期数',
    width: 100,
    align: 'center'
  },
  {
    prop: 'openTime',
    label: '开奖时间',
    width: 200,
    slot: 'openTime',
    align: 'center'
  },
  {
    prop: 'result',
    label: '开奖号码',
    width: 400,
    slot: 'result',
    align: 'center'
  },
  // 色波
  {
    prop: 'color',
    label: '色波',
    width: 70,
    slot: 'color',
    align: 'center'
  },
  // 五行
  {
    prop: 'fiveElements',
    label: '五行',
    width: 70,
    slot: 'fiveElements',
    align: 'center'
  },
  // oddEven & totalOddEven 合成一列
  {
    prop: 'oddEven',
    label: '单双 | 合单双',
    width: 120,
    slot: 'oddEven',
    align: 'center'
  },
  // 大小 & 合大小
  {
    prop: 'size',
    label: '大小 | 合大小',
    width: 120,
    slot: 'size',
    align: 'center'
  },
  // 头数 & 尾数 & 尾数量
  {
    prop: 'tePrefix',
    label: '头数 | 尾数 | 尾数量',
    width: 150,
    slot: 'headNum',
    align: 'center'
  },
  // 家禽野兽标记;p,家禽(poultry);b,野兽(beast)
  {
    prop: 'animalFlag',
    label: '家禽野兽',
    width: 100,
    slot: 'animalFlag',
    align: 'center'
  },
  // animalCount
  {
    prop: 'animalCount',
    label: '生肖数',
    width: 70,
    align: 'center'
  },
  // 总合，总大小，总单双
  // totalNum， totalNumSize， totalNumOddEven
  {
    prop: 'totalNum',
    label: '总合 | 总大小 | 总单双',
    width: 180,
    slot: 'totalNum',
    align: 'center'
  },
  // status
  {
    prop: 'status',
    label: '状态',
    width: 100,
    slot: 'status',
    align: 'center'
  },
  // 记录时间
  {
    prop: 'recordTime',
    label: '记录时间',
    width: 200,
    slot: 'recordTime',
    align: 'center'
  }
]

const searchBtnOptions: SearchBtnOptions = { isSearch: true, isReset: true, isAdd: false, isEdit: false }

const activeTab = ref<Tab>('a')

const activeGameUrl = computed(() => {
  switch (activeTab.value) {
    case 'a':
      return 'aSix'
    case 'hk':
      return 'hkSix'
    case 'sg':
      return 'sgSix'
    case 'tw':
      return 'twSix'
    case 'xa':
      return 'xaSix'
    case 'kl8':
      return 'kl8'
    default:
      return 'aSix' // default fallback instead of undefined
  }
})

const history = ref<HistoryItem[]>([])
const params = ref<ListParams>({
  page: 1,
  size: 15,
  year: '',
  issue: ''
})

async function initHistory(_tab: Tab) {
  let method

  switch (_tab) {
    case 'a':
      method = getAHistory
      break
    case 'hk':
      method = getHKHistory
      break
    case 'sg':
      method = getSGHistory
      break
    case 'tw':
      method = getTWHistory
      break
    case 'xa':
      method = getXAHistory
      break
    case 'kl8':
      method = getKL8History
      break
    default:
      throw Error('彩种代码未找到')
  }

  try {
    isLoading.value = true
    isError.value = false
    const res = await method(params.value)
    if (!res.success) {
      isError.value = true
      total.value = 0
      return
    }

    total.value = Number(res.data.total ?? '0')
    history.value = (res.data.list as any) === '' ? [] : res.data.list
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

// Add a wrapper function for retry button
const handleRetry = () => {
  initHistory(activeTab.value)
}

const resetIssue = async (tab: Tab) => {
  paramsIssue.value = ''
  params.value.issue = ''
  const gameType = gameTypeMapToCode(tab)
  await loadIssueOptions(String(gameType), paramsYear.value?.toString() || '')
}
const yearChange = async () => {
  console.log('yearChange', paramsYear.value)
  await resetIssue(activeTab.value)
  // paramsIssue.value = issueOptionsState.data[0]?.value || ''
}

const beforeLeave = async (newTab: string | number) => {
  const tab = String(newTab) as Tab
  try {
    isLoading.value = true
    await resetIssue(tab)
    await loadYearOptionsByGameType(gameTypeMapToCode(tab.toString()).toString())
    // eslint-disable-next-line no-use-before-define
    params.value.year = ''
    // eslint-disable-next-line no-use-before-define
    paramsYear.value = ''
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
  await initHistory(tab)
}
function onClickGlobalSync() {
  showSync.value = true
}

onMounted(async () => {
  await loadYearOptionsByGameType(gameTypeMapToCode(activeTab.value.toString()).toString())
  await initHistory(activeTab.value)
})
</script>

<template>
  <div>
    <div class="placeholder" />
    <el-result v-if="isError" icon="error" title="页面加载失败" sub-title="网络错误，请检查网络连接">
      <template #extra>
        <el-button type="primary" @click="handleRetry">重试</el-button>
      </template>
    </el-result>
    <div v-else>
      <el-tabs tab-position="left" v-model="activeTab" v-loading="isLoading" :before-leave="beforeLeave">
        <el-tab-pane v-for="tab of tabList" :key="tab.value" :label="tab.label" :name="tab.value">
          <div class="search-bar">
            <m-search
              class="cc-search"
              :isLoading="isLoading"
              :formOptions="searchBarOptions"
              :buttonOptions="searchBtnOptions"
              style="margin-right: -10px"
              @query="
                (e) => {
                  if (!e) return
                  params.issue = paramsIssue
                  params.year = paramsYear
                  initHistory(activeTab)
                }
              "
              @reset="
                () => {
                  params = {
                    page: 1,
                    size: 15,
                    year: '',
                    issue: ''
                  }
                  paramsIssue = ''
                  paramsYear = ''
                  initHistory(activeTab)
                }
              "
            >
              <template #issue>
                <el-select
                  v-model="paramsIssue"
                  placeholder="期数"
                  style="width: 150px"
                  :disabled="!paramsYear"
                  :loading="issueOptionsState.loading"
                >
                  <el-option
                    v-for="(item, index) in issueOptionsState.data"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  />
                </el-select>
              </template>

              <template #year>
                <el-select v-model="paramsYear" placeholder="年份" style="width: 120px" @change="yearChange">
                  <el-option
                    v-for="(item, index) in yearOptionsState.data"
                    :label="item.label"
                    :value="item.value"
                    :key="index"
                  />
                </el-select>
              </template>
            </m-search>
            <el-button type="success" plain @click="onClickGlobalSync">
              <template #icon>
                <el-icon><MagicStick /></el-icon>
              </template>
              全站同步
            </el-button>
          </div>

          <m-table
            :options="tableOptions"
            :data="history"
            tableHeight="calc(100vh - 310px)"
            :total="total"
            :currentPage="currentPage"
            :pageSize="pageSize"
            @size-change="
            (val:number) => {
              params.size = val
              pageSize = val
              params.page = 1
              currentPage = 1
              initHistory(activeTab)
            }
          "
            @current-change="
            (val:number) => {
              params.page = val
              currentPage = val
              initHistory(activeTab)
            }
          "
            stripe
            pagination
          >
            <template #openTime="{ scope }">
              {{ unitFormatDate(scope.row.openTime, 'yyyy-MM-dd HH:mm:ss') }}
            </template>

            <template #result="{ scope }">
              <div style="display: inline-flex; align-items: center">
                <lottoBall
                  v-for="i in 6"
                  :key="i"
                  :number="scope.row.numInfo[i - 1].num"
                  :color="scope.row.numInfo[i - 1].color"
                  :zodiacSigns="scope.row.numInfo[i - 1].shengxiao"
                />
                <span style="margin: 0 2px">+</span>
                <lottoBall
                  :number="scope.row.numInfo[6].num"
                  :color="scope.row.numInfo[6].color"
                  :zodiacSigns="scope.row.numInfo[6].shengxiao"
                />
              </div>
            </template>

            <template #color="{ scope }">
              {{ scope.row.color === 'R' ? '红波' : scope.row.color === 'B' ? '蓝波' : '绿波' }}
            </template>

            <template #fiveElements="{ scope }">
              {{
                scope.row.fiveElements === 'j'
                  ? '金'
                  : scope.row.fiveElements === 'm'
                  ? '木'
                  : scope.row.fiveElements === 's'
                  ? '水'
                  : scope.row.fiveElements === 'h'
                  ? '火'
                  : '土'
              }}
            </template>

            <template #oddEven="{ scope }">
              {{ scope.row.oddEven === 'o' ? '单' : '双' }} |
              {{ scope.row.totalOddEven === 'o' ? '单' : '双' }}
            </template>

            <template #size="{ scope }">
              {{ scope.row.size === 's' ? '小' : '大' }} |
              {{ scope.row.totalSize === 's' ? '小' : scope.row.totalSize === 'b' ? '大' : '和' }}
            </template>

            <template #headNum="{ scope }">
              {{ scope.row.tePrefix }} | {{ scope.row.teSuffix }} |
              {{ scope.row.suffixCount }}
            </template>

            <template #animalFlag="{ scope }">
              {{ scope.row.animalFlag === 'p' ? '家禽' : '野兽' }}
            </template>

            <template #totalNum="{ scope }">
              {{ scope.row.totalNum }} |
              {{ scope.row.totalNumSize === 's' ? '小' : scope.row.totalNumSize === 'b' ? '大' : '和' }}
              |
              {{ scope.row.totalNumOddEven === 'o' ? '单' : '双' }}
            </template>
            <template #status="{ scope }">
              {{ scope.row.status === 'y' ? '启用' : '删除' }}
            </template>
            <template #recordTime="{ scope }">
              {{ unitFormatDate(scope.row.recordTime, 'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </m-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <globalSync v-model:show="showSync" :game-url="activeGameUrl" />
  </div>
</template>

<style scoped>
.placeholder {
  height: 60px;
  width: 100%;
}

.search-bar {
  display: flex;
  padding: 2px;
  gap: 20px;
}

.cc-search :deep(.el-form-item) {
  margin-right: 10px;
}
</style>
