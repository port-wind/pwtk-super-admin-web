<script setup lang="ts">
import { h } from 'vue'
import {
  type ListParams,
  type ReviewItem,
  getAReview,
  getHKReview,
  getSGReview,
  getTWReview,
  getXAReview,
  getKL8Review,
  pushAData,
  pushHKData,
  pushSGData,
  pushTWData,
  pushXAData,
  pushKL8Data,
  callGameResultServiceToConfirmForDouble,
  callGameResultServiceToConfirmForFirst,
  type PushReviewParams,
  type InsertOrUpdateFirstCheckParams,
  type InsertOrUpdateDoubleCheckParams
} from '@/api/photoSys/gameResult'
import mSearch from '@/components/mSearchForm/index.vue'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import type { TableOptions } from '@/components/mTable/types'
import { unitFormatDate } from '@/utils/dateFormat'

import updateFirstReview, { type FirstCheckShowData } from './components/updateFirstReview.vue'

import updateDoubleReview, { type DoubleCheckShowData } from './components/updateDoubleReview.vue'
import editHistoryReview from './components/editHistoryReview.vue'
import LottoBall from './components/lottoBall.vue'
import { gameTypeMapToCode } from '@/stores/bettingStore'
import useIssueOptionLogic from './useIssueOptionLogic'
import useYearOptionLogic from './useYearOptionLogic'
import { gameTypePlatformList } from '@/api/system/gameTypeManagement'
import type { IGameInfo } from '@/api/system/gameTypeManagement/type'

interface ReviewGeneralType {
  year: number
  issue: number
  num1: number | null
  num2: number | null
  num3: number | null
  num4: number | null
  num5: number | null
  num6: number | null
  numTe: number | null
  // 是否通过 API 进行核对
  isAPI: boolean
  // 操作员ID
  OpID: string
  Oper: string
  checkTime: string
  lastUpdateTime: string
  updateCount: number
  memo: string
  // 两次结果对比结论
  compareResult: 'y' | 'n' | ''
  // 是否自动确认
  isAutoConfirm: 'y' | 'n' | 's'
  numInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'G' | 'B'
    num: number
    index: number
    shengxiao: string
  }[]
  firstCheckGameDataFrom: string
  existDoubleCheck: string
  existFirstCheck: string
  doubleCheckGameDataFrom: string
}

const checkStatus = ref('first')
type Tab = 'a' | 'hk' | 'sg' | 'tw' | 'xa' | 'kl8'
const { issueOptionsState, loadIssueOptions } = useIssueOptionLogic()
const { yearOptionsState, loadYearOptionsByGameType } = useYearOptionLogic()

const categoryList = [
  { label: '澳六', value: 'a', code: 2032 },
  { label: '台六', value: 'tw', code: 84 },
  { label: '港六', value: 'hk', code: 1 },
  { label: '新六', value: 'sg', code: 3995 },
  { label: '新澳六', value: 'xa', code: 5 },
  { label: '快乐8', value: 'kl8', code: 6 }
]

const gameTypeCode = computed(() => {
  switch (activeTab.value) {
    case 'a':
      return 'a6'
    case 'hk':
      return 'hk6'
    case 'sg':
      return 'sg6'
    case 'tw':
      return 'tw6'
    case 'xa':
      return 'xa6'
    case 'kl8':
      return 'kl8'
    default:
      return 'a6' // default fallback
  }
})

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

const searchBtnOptions = computed<SearchBtnOptions>(() => ({
  isSearch: true,
  isReset: true,
  isAdd: true,
  isEdit: checkStatus.value === 'last' ? true : false
}))

const activeTab = ref<Tab>('a')
const isLoading = ref(false)
const isError = ref(false)
const total = ref<number>(0)
const pageSize = ref(15)
const currentPage = ref(1)
const gameType = computed(() => {
  return gameTypeMapToCode(activeTab.value)
})

const params = ref<ListParams>({
  page: 1,
  size: 15,
  issue: '',
  year: ''
})

const tableOptions = computed<TableOptions[]>(() => {
  const firstOptions = [
    {
      prop: 'year',
      label: '年份',
      width: 70,
      align: 'left'
    },
    {
      prop: 'issue',
      label: '期数',
      width: 100,
      slot: 'issue',
      align: 'left'
    },
    {
      prop: 'result',
      label: '开奖号码',
      width: 400,
      slot: 'result',
      align: 'left'
    },
    {
      prop: 'isAPI',
      label: checkStatus.value === 'first' ? 'API首核' : 'API复核',
      width: 80,
      slot: 'isAPI',
      align: 'left'
    },
    {
      prop: 'Oper',
      label: '操作员',
      width: 100,
      align: 'left'
    },
    {
      prop: 'checkTime',
      label: checkStatus.value === 'first' ? '首核时间' : '复核时间',
      width: 170,
      slot: 'checkTime',
      align: 'left'
    },
    {
      prop: 'lastUpdateTime',
      label: '最后更新时间',
      width: 170,
      slot: 'lastUpdateTime',
      align: 'left'
    },
    {
      prop: 'updateCount',
      label: '更新次数',
      width: 80,
      align: 'right'
    },
    {
      prop: 'memo',
      label: '备注',
      width: 150,
      slot: 'memo',
      align: 'left'
    },
    {
      prop: 'compareResult',
      label: '对比结果',
      width: 80,
      slot: 'compareResult',
      align: 'left'
    },
    {
      prop: 'isAutoConfirm',
      label: '确认方式',
      width: 80,
      slot: 'isAutoConfirm',
      align: 'left'
    },
    {
      prop: 'existDoubleCheck',
      label: '复核数据',
      width: 100,
      slot: 'existDoubleCheck',
      align: 'center'
    },
    {
      prop: 'firstCheckGameDataFrom',
      label: '数据来源',
      width: 100,
      showOmission: true
    },
    {
      prop: 'operation-first',
      label: '操作',
      width: 80,
      slot: 'operation-first',
      align: 'left'
    }
  ]
  const doubleOptions = [
    {
      prop: 'year',
      label: '年份',
      width: 70,
      align: 'left'
    },
    {
      prop: 'issue',
      label: '期数',
      width: 100,
      slot: 'issue',
      align: 'left'
    },
    {
      prop: 'result',
      label: '开奖号码',
      width: 400,
      slot: 'result',
      align: 'left'
    },
    {
      prop: 'isAPI',
      label: checkStatus.value === 'first' ? 'API首核' : 'API复核',
      width: 80,
      slot: 'isAPI',
      align: 'left'
    },
    {
      prop: 'Oper',
      label: '操作员',
      width: 100,
      align: 'left'
    },
    {
      prop: 'checkTime',
      label: checkStatus.value === 'first' ? '首核时间' : '复核时间',
      width: 170,
      slot: 'checkTime',
      align: 'left'
    },
    {
      prop: 'lastUpdateTime',
      label: '最后更新时间',
      width: 170,
      slot: 'lastUpdateTime',
      align: 'left'
    },
    {
      prop: 'updateCount',
      label: '更新次数',
      width: 80,
      align: 'right'
    },
    {
      prop: 'memo',
      label: '备注',
      width: 150,
      slot: 'memo',
      align: 'left'
    },
    {
      prop: 'compareResult',
      label: '对比结果',
      width: 80,
      slot: 'compareResult',
      align: 'left'
    },
    {
      prop: 'isAutoConfirm',
      label: '确认方式',
      width: 80,
      slot: 'isAutoConfirm',
      align: 'left'
    },
    {
      prop: 'existFirstCheck',
      label: '首核数据',
      width: 100,
      slot: 'existFirstCheck',
      align: 'center'
    },
    {
      prop: 'doubleCheckGameDataFrom',
      label: '数据来源',
      width: 100,
      showOmission: true
    },
    {
      prop: 'operation',
      label: '操作',
      width: 140,
      slot: 'operation',
      align: 'left'
    }
  ]
  if (checkStatus.value === 'first') {
    return firstOptions as TableOptions[]
  }
  return doubleOptions as TableOptions[]
})

const reviewList = ref<ReviewItem[]>([])

const insertOrUpdateFirstCheckDialogVisible = ref(false)

const insertOrUpdateDoubleCheckDialogVisible = ref(false)

const insertOrUpdateFirstCheckParams = ref<(InsertOrUpdateFirstCheckParams & FirstCheckShowData) | null>(null)

const insertOrUpdateDoubleCheckParams = ref<(InsertOrUpdateDoubleCheckParams & DoubleCheckShowData) | null>(null)

const paramsIssue = ref<string>('')
const paramsYear = ref<string>('')

const firstCheckReviewList = computed<ReviewGeneralType[]>(() =>
  reviewList.value.map((item) => {
    return {
      year: item.year,
      issue: item.issue,
      num1: item.firstCheckNum1 === '' ? null : item.firstCheckNum1,
      num2: item.firstCheckNum2 === '' ? null : item.firstCheckNum2,
      num3: item.firstCheckNum3 === '' ? null : item.firstCheckNum3,
      num4: item.firstCheckNum4 === '' ? null : item.firstCheckNum4,
      num5: item.firstCheckNum5 === '' ? null : item.firstCheckNum5,
      num6: item.firstCheckNum6 === '' ? null : item.firstCheckNum6,
      numTe: item.firstCheckNumTe === '' ? null : item.firstCheckNumTe,
      isAPI: item.firstCheckIsApi === 'y',
      OpID: item.firstCheckOpid,
      Oper: item.firstCheckOper,
      checkTime: item.firstCheckTime,
      lastUpdateTime: item.firstCheckLastUpdateTime,
      updateCount: item.firstCheckUpdateCount,
      memo: item.firstCheckMemo,
      compareResult: item.compareResult,
      isAutoConfirm: item.isAutoConfirm,
      numInfo: item.firstCheckNumsInfo,
      // 首核数据来源
      firstCheckGameDataFrom: item.firstCheckGameDataFrom,
      // 复核数据来源
      doubleCheckGameDataFrom: item.doubleCheckGameDataFrom,
      // 首核数据是否存在
      existFirstCheck: item.existFirstCheck,
      // 复核数据是否存在
      existDoubleCheck: item.existDoubleCheck
    }
  })
)

const doubleCheckReviewList = computed<ReviewGeneralType[]>(() =>
  reviewList.value.map((item) => {
    return {
      year: item.year,
      issue: item.issue,
      num1: item.doubleCheckNum1 === '' ? null : item.doubleCheckNum1,
      num2: item.doubleCheckNum2 === '' ? null : item.doubleCheckNum2,
      num3: item.doubleCheckNum3 === '' ? null : item.doubleCheckNum3,
      num4: item.doubleCheckNum4 === '' ? null : item.doubleCheckNum4,
      num5: item.doubleCheckNum5 === '' ? null : item.doubleCheckNum5,
      num6: item.doubleCheckNum6 === '' ? null : item.doubleCheckNum6,
      numTe: item.doubleCheckNumTe === '' ? null : item.doubleCheckNumTe,
      isAPI: item.doubleCheckIsApi === 'y',
      OpID: item.doubleCheckOpid,
      Oper: item.doubleCheckOper,
      checkTime: item.doubleCheckTime,
      lastUpdateTime: item.doubleCheckLastUpdateTime,
      updateCount: item.doubleCheckUpdateCount,
      memo: item.doubleCheckMemo,
      compareResult: item.compareResult,
      isAutoConfirm: item.isAutoConfirm,
      numInfo: item.doubleCheckNumsInfo,
      firstCheckGameDataFrom: item.firstCheckGameDataFrom,
      existDoubleCheck: item.existDoubleCheck,
      existFirstCheck: item.existFirstCheck,
      doubleCheckGameDataFrom: item.doubleCheckGameDataFrom
    }
  })
)

// 计算后的ReviewList
const computedReviewList = computed(() =>
  checkStatus.value === 'first' ? firstCheckReviewList.value : doubleCheckReviewList.value
)

async function initData(_tab: Tab) {
  let method
  switch (_tab) {
    case 'a':
      method = getAReview
      break
    case 'hk':
      method = getHKReview
      break
    case 'sg':
      method = getSGReview
      break
    case 'tw':
      method = getTWReview
      break
    case 'xa':
      method = getXAReview
      break
    case 'kl8':
      method = getKL8Review
      break
    default:
    // throw new Error('未找到彩种')
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
    total.value = Number(res.data.total)
    reviewList.value = res.data.list
  } catch (e: any) {
    console.error(e)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

function newCheck() {
  if (checkStatus.value === 'first') {
    insertOrUpdateFirstCheckParams.value = null
    nextTick(() => {
      insertOrUpdateFirstCheckDialogVisible.value = true
    })
  } else {
    insertOrUpdateDoubleCheckParams.value = null
    nextTick(() => {
      insertOrUpdateDoubleCheckDialogVisible.value = true
    })
  }
}

// editHistoryData
const editHistoryReviewDialog = ref(false)
const editHistoryReviewRef = ref<InstanceType<typeof editHistoryReview>>()

function editHistoryData() {
  editHistoryReviewDialog.value = true
  nextTick(() => {
    editHistoryReviewRef.value?.openDialog(activeTab.value, checkStatus.value)
  })
}

function onCloseEditHistoryReview() {
  editHistoryReviewDialog.value = false
}

function editCheck(data: ReviewGeneralType) {
  if (data.compareResult === 'y') {
    return
  }
  if (checkStatus.value === 'first') {
    insertOrUpdateFirstCheckParams.value = {
      year: data.year,
      issue: data.issue,
      firstCheckNum1: data.num1,
      firstCheckNum2: data.num2,
      firstCheckNum3: data.num3,
      firstCheckNum4: data.num4,
      firstCheckNum5: data.num5,
      firstCheckNum6: data.num6,
      firstCheckNumTe: data.numTe,
      firstCheckMemo: data.memo,
      firstCheckOper: data.OpID,
      firstCheckTime: data.checkTime,
      firstCheckUpdateCount: data.updateCount,
      firstCheckLastUpdateTime: data.lastUpdateTime
    }
    nextTick(() => {
      insertOrUpdateFirstCheckDialogVisible.value = true
    })
  } else {
    insertOrUpdateDoubleCheckParams.value = {
      year: data.year,
      issue: data.issue,
      doubleCheckNum1: data.num1,
      doubleCheckNum2: data.num2,
      doubleCheckNum3: data.num3,
      doubleCheckNum4: data.num4,
      doubleCheckNum5: data.num5,
      doubleCheckNum6: data.num6,
      doubleCheckNumTe: data.numTe,
      doubleCheckMemo: data.memo,
      doubleCheckOper: data.OpID,
      doubleCheckTime: data.checkTime,
      doubleCheckUpdateCount: data.updateCount,
      doubleCheckLastUpdateTime: data.lastUpdateTime
    }
    nextTick(() => {
      insertOrUpdateDoubleCheckDialogVisible.value = true
    })
  }
}

async function pushReview(row) {
  // Check if updateHistoryData is true and show confirmation
  if (row.updateHistoryData === true) {
    try {
      await ElMessageBox.confirm(
        h('div', [
          h(
            'p',
            { style: 'margin: 0; color: #e6a23c; font-weight: bold;' },
            '！！一旦修改，将改变开奖历史中的內容！！'
          ),
          h('p', { style: 'margin: 10px 0 0 0;' }, '您确定要修改开奖结果吗？')
        ]),
        '确认修改',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }
      )
    } catch {
      return
    }
  }

  let method
  switch (activeTab.value) {
    case 'a':
      method = pushAData
      break
    case 'hk':
      method = pushHKData
      break
    case 'sg':
      method = pushSGData
      break
    case 'tw':
      method = pushTWData
      break
    case 'xa':
      method = pushXAData
      break
    case 'kl8':
      method = pushKL8Data
      break
    default:
  }

  try {
    const res = await method({
      year: row.year,
      issue: row.issue
    } as PushReviewParams)
    if (res.success) {
      ElMessage.success('推送成功')
      initData(activeTab.value)
    } else {
      ElMessage.error(res.errMessage)
    }
  } catch (e: any) {
    console.error(e)
    ElMessage.error('推送失败')
  }
}

async function onFirstCheck(row: ReviewGeneralType) {
  try {
    isLoading.value = true
    const response = await callGameResultServiceToConfirmForFirst(
      row.issue,
      row.year,
      gameType.value,
      gameTypeCode.value
    )
    if (!response.success) {
      ElMessage.error(response.errMessage)
    } else {
      ElMessage.success('首核成功')
      initData(activeTab.value)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('首核失败')
  } finally {
    isLoading.value = false
  }
}

const gameTypeList = ref<IGameInfo[]>([])

async function fetchGameTypeList() {
  const res = await gameTypePlatformList({ page: 1, size: 999 })
  console.log('🚀 ~ 9a9a9a9a9a9 fetchGameTypeList ~ res:', res)
  if (res.success) {
    gameTypeList.value = res.data?.list || []
  }
}

// 判断某个标签是否被禁用
const isTabDisabled = (tabValue: Tab) => {
  const category = categoryList.find((item) => item.value === tabValue)
  if (!category) return false

  const gameInfo = gameTypeList.value.find((item) => Number(item.gameType) === category.code)

  console.log('🚀 ~ 检查标签状态:', tabValue, '游戏信息:', gameInfo)

  // 如果找不到游戏信息或状态不是 'y'，则禁用
  return !gameInfo || gameInfo.status !== 'y'
}

async function onDoubleCheck(row: ReviewGeneralType) {
  try {
    isLoading.value = true
    const response = await callGameResultServiceToConfirmForDouble(
      row.issue,
      row.year,
      gameType.value,
      gameTypeCode.value
    )
    if (!response.success) {
      ElMessage.error(response.errMessage)
    } else {
      ElMessage.success('复核成功')
      initData(activeTab.value)
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('复核失败')
  } finally {
    isLoading.value = false
  }
}
const resetIssue = async (tab: Tab) => {
  paramsIssue.value = ''
  params.value.issue = ''
  const gameTypeMapped = gameTypeMapToCode(tab)
  await loadIssueOptions(String(gameTypeMapped), paramsYear.value?.toString() || '')
}
const yearChange = async () => {
  console.log('yearChange', paramsYear.value)
  await resetIssue(activeTab.value)
  // paramsIssue.value = issueOptionsState.data[0]?.value || ''
}
const beforeLeave = async (tab: Tab) => {
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
  await initData(tab)
}

onMounted(async () => {
  await fetchGameTypeList()
  await loadYearOptionsByGameType(String(gameType.value))
  await initData(activeTab.value)
})
</script>

<template>
  <div>
    <div class="select-mode">
      <el-tabs v-model="checkStatus">
        <el-tab-pane name="first" label="首核" />
        <el-tab-pane name="last" label="复核" />
      </el-tabs>
    </div>
    <div class="wrapper">
      <el-tabs
        class="tabs-container"
        tab-position="left"
        v-model="activeTab"
        v-loading="isLoading"
        :before-leave="beforeLeave"
      >
        <el-tab-pane
          v-for="tab of categoryList"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
          :disabled="isTabDisabled(tab.value)"
        />
      </el-tabs>
      <div class="content">
        <el-result v-if="isError" icon="error" title="页面加载失败" sub-title="网络错误，请检查网络连接">
          <template #extra>
            <el-button type="primary" @click="initData">重试</el-button>
          </template>
        </el-result>
        <div v-else>
          <m-search
            class="cc-search"
            :isLoading="isLoading"
            :formOptions="searchBarOptions"
            :buttonOptions="searchBtnOptions"
            @query="
              () => {
                params.issue = paramsIssue
                params.year = paramsYear
                initData(activeTab)
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
                initData(activeTab)
              }
            "
            @addNew="newCheck"
            @edit="editHistoryData"
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
              <el-select v-model="paramsYear" placeholder="年份" style="width: 100px" @change="yearChange">
                <el-option
                  v-for="(item, index) in yearOptionsState.data"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                />
              </el-select>
            </template>
          </m-search>
          <m-table
            :options="tableOptions"
            :data="computedReviewList"
            tableHeight="calc(100vh - 310px)"
            :total="total"
            :pageSize="pageSize"
            :currentPage="currentPage"
            @size-change="
            (val:number) => {
              params.size = val
              pageSize = val
              params.page = 1
              currentPage = 1
              initData(activeTab)
            }
          "
            @current-change="
            (val:number) => {
              params.page = val
              currentPage = val
              initData(activeTab)
            }
          "
            stripe
            pagination
          >
            <template #issue="{ scope }">
              <span
                :class="{
                  'link-style': scope.row.compareResult !== 'y'
                }"
                @click="() => editCheck(scope.row)"
              >
                {{ scope.row.issue }}
              </span>
            </template>

            <template #result="{ scope }">
              <div style="display: inline-flex; align-items: center">
                <LottoBall
                  v-for="i in 6"
                  :key="i"
                  :color="scope.row.numInfo?.[i - 1]?.color"
                  :number="scope.row?.numInfo?.[i - 1]?.num"
                  :zodiacSigns="scope.row.numInfo?.[i - 1]?.shengxiao"
                />
                <span style="margin: 0 2px" v-if="scope.row.numInfo.length === 7">+</span>
                <LottoBall
                  :color="scope.row.numInfo?.[6]?.color"
                  :number="scope.row?.numInfo?.[6]?.num"
                  :zodiacSigns="scope.row.numInfo?.[6]?.shengxiao"
                />
              </div>
            </template>

            <template #isAPI="{ scope }">
              {{ scope.row.isAPI ? '是' : '否' }}
            </template>

            <template #checkTime="{ scope }">
              {{ unitFormatDate(scope.row.checkTime, 'yyyy-MM-dd HH:mm:ss') }}
            </template>

            <template #lastUpdateTime="{ scope }">
              {{ unitFormatDate(scope.row.lastUpdateTime, 'yyyy-MM-dd HH:mm:ss') }}
            </template>

            <template #memo="{ scope }">
              <el-text line-clamp="1">{{ scope.row.memo }}</el-text>
            </template>

            <template #compareResult="{ scope }">
              <span :style="{ color: scope.row.compareResult === 'n' ? 'red' : '' }">
                {{ scope.row.compareResult === 'y' ? '一致' : scope.row.compareResult === 'n' ? '不一致' : '未对比' }}
              </span>
            </template>

            <template #isAutoConfirm="{ scope }">
              {{ scope.row.isAutoConfirm === 'y' ? '自动' : scope.row.isAutoConfirm === 'n' ? '手动' : '单边' }}
            </template>

            <template #existFirstCheck="{ scope }">
              {{ scope.row.existFirstCheck === 'y' ? '有' : scope.row.existFirstCheck === 'n' ? '无' : '空' }}
            </template>

            <template #existDoubleCheck="{ scope }">
              {{ scope.row.existDoubleCheck === 'y' ? '有' : scope.row.existDoubleCheck === 'n' ? '无' : '空' }}
            </template>

            <template #operation="{ scope }">
              <el-button size="small" type="primary" @click="onDoubleCheck(scope.row)">复核</el-button>
              <el-button
                size="small"
                type="success"
                :disabled="
                  !(scope.row.updateHistoryData || (scope.row.isAutoConfirm === 'n' && scope.row.compareResult === 'y'))
                "
                @click="() => pushReview(scope.row)"
              >
                推送
              </el-button>
            </template>

            <template #operation-first="{ scope }">
              <el-button size="small" type="primary" :disabled="!scope.row.isAPI" @click="onFirstCheck(scope.row)">
                首核
              </el-button>
            </template>
          </m-table>
        </div>
      </div>
    </div>

    <updateFirstReview
      v-model:show="insertOrUpdateFirstCheckDialogVisible"
      :review-data="insertOrUpdateFirstCheckParams"
      :tab="activeTab"
      :game-type="gameType"
      @update="
        (resetPage) => {
          if (resetPage) {
            params.page = 1
            currentPage = 1
          }
          initData(activeTab)
        }
      "
      :year-options="yearOptionsState.data || []"
    />

    <updateDoubleReview
      v-model:show="insertOrUpdateDoubleCheckDialogVisible"
      :review-data="insertOrUpdateDoubleCheckParams"
      :tab="activeTab"
      :game-type="gameType"
      @update="
        (resetPage) => {
          if (resetPage) {
            params.page = 1
            currentPage = 1
          }
          initData(activeTab)
        }
      "
      :year-options="yearOptionsState.data || []"
    />

    <editHistoryReview ref="editHistoryReviewRef" v-if="editHistoryReviewDialog" @close="onCloseEditHistoryReview" />
  </div>
</template>

<style scoped>
.select-mode {
  width: 120px;
  height: 60px;
}

.wrapper {
  display: flex;
}

.tabs-container {
  width: fit-content;
  height: 100%;
}

.content {
  flex: 1;
  width: 0px;
}

.select-mode :deep(.el-tabs__item) {
  padding: 0;
  width: 60px;
  color: gray;
  font-size: 13px;
  font-weight: none;
}

.select-mode :deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: bold;
}

.link-style {
  text-decoration: underline;
  cursor: pointer;
  color: blue;
}

.cc-search :deep(.el-form-item) {
  margin-right: 10px;
}

/* 禁用标签的样式 */
.tabs-container :deep(.el-tabs__item.is-disabled) {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  opacity: 0.5;
}

.tabs-container :deep(.el-tabs__item.is-disabled):hover {
  color: #c0c4cc !important;
}
</style>
