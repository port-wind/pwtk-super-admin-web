<template>
  <section id="system_account">
    <!-- Search Form -->
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <!-- 期数  -->
        <el-form-item label="" prop="issue">
          <el-input
            v-model="queryForm.issue"
            placeholder="期数"
            @keyup.enter="
              () => {
                queryForm.page = 1
                fetchData()
              }
            "
          />
        </el-form-item>
        <!-- 年份  -->
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份">
            <el-option label="全部" value="L" />
            <el-option v-for="item in YearTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <!-- 彩票 -->
        <el-form-item label="" prop="type">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option
              v-for="(item, index) in bettingStore.gameType"
              :key="item.gameType"
              :label="item.gameTypeName"
              :value="item.gameType"
            />
          </el-select>
        </el-form-item>
        <!-- 投票类型 -->
        <el-form-item label="" prop="type">
          <el-select v-model="queryForm.playTypeCode" placeholder="投票类型">
            <el-option label="全部" value="L" />
            <el-option
              v-for="item in bettingStore.gameListTypeCode"
              :key="item.playTypeCode"
              :label="item.predictionTypeName"
              :value="item.playTypeCode"
            />
          </el-select>
        </el-form-item>

        <!-- 登入帐号 | 用户昵称 -->
        <el-form-item label="" prop="loginId">
          <AutoChoseLoginId v-model="queryForm.loginId" />
          <!-- <el-input
            v-model="queryForm.loginId"
            placeholder="登入帐号 | 用户ID"
            @keyup.enter="
              () => {
                queryForm.page = 1
                fetchData()
              }
            "
          /> -->
          <!-- <UserTwoAutocomplete
            placeholder="登入帐号 | 用户ID"
            @keyup.enter="fetchData()"
            name="loginId"
            v-model:remoteId="queryForm.loginId"
            v-model:remoteValue="remoteValue"
          ></UserTwoAutocomplete> -->
        </el-form-item>
        <!-- 用户昵称 -->
        <el-form-item label="" prop="nickname">
          <el-input
            v-model="queryForm.nickname"
            placeholder="用户昵称"
            @keyup.enter="
              () => {
                queryForm.page = 1
                fetchData()
              }
            "
          />
          <!-- <UserDeleteAutocomplete
            placeholder="用户昵称"
            @keyup.enter="fetchData()"
            name="nickname"
            v-model:remoteId="queryForm.nickname"
          ></UserDeleteAutocomplete> -->
          <!-- <RemoteInput :onChangeSearch="searchButton" placeholder="用户昵称" name="nickname" v-model:remoteId="queryForm.nickname" style=""></RemoteInput> -->
          <!-- <el-input v-model="queryForm.nickname" maxlength="30" style="width: 240px" placeholder="用户昵称" /> -->
        </el-form-item>
        <!-- 竞猜结果 -->
        <el-form-item label="竞猜结果" prop="type">
          <el-select v-model="queryForm.isHit" placeholder="竞猜结果">
            <el-option label="全部" value="L" />
            <el-option label="已中奖" class="custom_y" value="y"></el-option>
            <el-option label="未中奖" class="custom_n" value="n" />
            <el-option label="未开奖" class="custom_i" value="i" />
          </el-select>
        </el-form-item>
        <!-- action button 查询 重置 修改规则配置 -->
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openDialog">
            <el-icon><Plus /></el-icon>
            修改规则配置
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
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #gameType="{ scope }">
          {{ getGameTypeName(scope) }}
        </template>
        <template #loginId="{ scope }">
          <el-link class="like-a" type="primary" @click="showUserInfoDialog(scope.row)">
            {{ getUserId_Nickname(scope) }}
          </el-link>
        </template>
        <template #predict="{ scope }">
          <div>
            <ul class="predict_list">
              <li v-for="item in scope.row.predict" :class="item === '01' || item === '02' ? 'non_style' : ''">
                {{ getPredict(item) }}
              </li>
            </ul>
          </div>
        </template>
        <template #isHit="{ scope }">
          <div :class="'custom_' + scope.row.isHit">
            {{ getIsHit(scope) }}
          </div>
        </template>
      </m-table>
    </section>

    <!-- dialog  -->
    <el-dialog
      draggable
      overflow
      destroy-on-close
      v-model="isVisible"
      append-to-body
      :close-on-click-modal="false"
      @close="closeDialog"
      class="tabs-dialog"
    >
      <el-tabs class="m_tabs" v-model="activeName">
        <el-tab-pane label="竞猜规则配置" name="betting" class="m_tabs_pane">
          <BettingInfo />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </section>
  <UserListComponent></UserListComponent>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { YearTypes } from '@/utils/dataFormat'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import count from '@/utils/tableHeight'
import BettingInfo from '@/views/Betting/bettingList/components/bettingInfo.vue'
import { predictList } from '@/api/betting'
import { IPredictionResult, IPredictListBodyParameter } from '@/api/betting/types'
import { useBettingStore } from '@/stores/bettingStore'
import { useModalsStore } from '@/stores/modalStore'
// Constants and refs
const tableRef = ref()
const tableData = ref<IPredictionResult[]>([])
const total = ref(0)
const isLoading = ref(false)
const isVisible = ref<boolean>(false)
const bettingStore = useBettingStore()
const modalsStore = useModalsStore()
const activeName = ref('betting')

// Form data
const initQueryForm = (): IPredictListBodyParameter => ({
  bizFlag: 't', // 默认
  page: 1, // 默认
  size: 15, // 默认
  issue: undefined, // 期数 手输入
  year: undefined, // 年份
  gameType: undefined, // 'L'  // 彩种
  playTypeCode: undefined, // 'L', // 投票类型
  // predict: '',
  loginId: '', // loginId , userId
  // userId: '', // loginId , userId
  nickname: '', // 昵称
  isHit: undefined // 'L' // 竞猜结果
})

const queryForm = reactive<IPredictListBodyParameter>(initQueryForm())
const remoteValue = ref<string>('')
const formMode = ref<string>('add')

//新增的时候的
const rulesAdd = ref({
  seriesCode: [
    { required: true, message: '请输入系列ID', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]*$/, message: '系列ID不符合标准', trigger: 'blur' }
  ],
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
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
  { prop: 'issue', label: '期数', align: 'right', columAttr: { width: 110 } },
  { prop: 'year', label: '年份', align: 'right', columAttr: { width: 70 } },
  { prop: 'gameType', label: '彩种', align: 'right', slot: 'gameType', columAttr: { width: 70 } },
  { prop: 'predictionTypeName', label: '投票类型', align: 'right', columAttr: { width: 100 } },
  { prop: 'predict', label: '推荐内容', align: 'left', slot: 'predict', columAttr: {} },
  { prop: 'loginId', label: '登入帐号 | 用户昵称', slot: 'loginId', align: 'right', columAttr: {} },
  {
    prop: 'createTime',
    label: '参与时间',
    dateName: 'createTime',
    align: 'right',
    columAttr: { width: 125 }
  },
  { prop: 'isHit', label: '结果', align: 'right', slot: 'isHit', columAttr: { width: 70 } }
]

/**
 * 数据查询和重置
 * @param reset 是否是重置查询
 */
const fetchData = async (reset?: boolean) => {
  isLoading.value = true
  try {
    // queryForm 数据处理
    let { bizFlag, gameType, isHit, issue, loginId, nickname, page, playTypeCode, size, year } = queryForm

    if (isHit === 'L') {
      isHit = undefined
    }

    //@ts-ignore
    if (year === 'L') {
      year = undefined
    }

    if (nickname === '') {
      nickname = undefined
    }

    if (loginId === '') {
      loginId = undefined
    }

    if (playTypeCode === 'L') {
      playTypeCode = undefined
    }
    //@ts-ignore
    if (gameType === 'L') {
      gameType = undefined
    }

    // 重置查询
    if (reset) {
      page = 1
      size = 15
      loginId = undefined
      nickname = undefined
    }

    const res1 = await predictList({
      year,
      issue,
      page,
      size,
      bizFlag,
      isHit,
      playTypeCode,
      gameType,
      searchId: loginId,
      nickname
    })
    tableData.value = res1.data.list
    total.value = Number(res1.data.list ? res1.data.total : 0)
    if (res1.success) {
      tableData.value = res1.data.list || []
      total.value = Number(res1.data.list ? res1.data.total : 0)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }

  // // 修改游戏类型状态
  // const res2 = await predictTypeEditStatus({ bizFlag: 'b', playTypeCode: 'ss', status: 'y' })

  // const res3 = await predictList({ bizFlag: 'p', size: 10, page: 1 })

  // isLoading.value = true
  // try {
  //   const req: IGameTypeSeriesListParameter = {
  //     page: currentPage.value,
  //     size: pageSize.value,
  //     sortName: 'sort_no',
  //     sortOrder: 'DESC',
  //     ...queryForm
  //   }

  //   const response = await listGameTypeSeries(req)

  //   if (response.success) {
  //     tableData.value = response.data.list || []
  //     total.value = Number(response.data.list ? response.data.total : 0)
  //   } else {
  //     showErrorMessage(response)
  //   }
  // } catch (error) {
  //   console.error('Error fetching data:', error)
  // } finally {
  //   isLoading.value = false
  // }
}

/**
 * 换页
 * @param
 */
const handleSizeChange = (val: number) => {
  queryForm.size = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

const getPredict = (item) => {
  switch (item) {
    case '01':
      item = '正一'
      return item
    case '02':
      item = '正二'
      return item
    default:
      return item
  }
}

const getIsHit = (scope) => {
  let result = '没有结果'
  switch (scope.row.isHit) {
    case 'y':
      result = '已中奖'
      break
    case 'n':
      result = '已中奖'
      break
    case 'i':
      result = '未开奖'
      break
    default:
      break
  }
  return result
}
const getUserId_Nickname = (scope) => {
  return scope.row.loginId + ' | ' + scope.row.nickname
}

const getGameTypeName = (scope) => {
  const foundItem = bettingStore.gameType.find((item) => {
    return item.gameType === scope.row.gameType.toString()
  })
  return foundItem ? foundItem.gameTypeName : '未知类型' // 或者返回 ''
}

const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  queryForm.size = 15
  queryForm.page = 1
  fetchData(true)
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

const showUserInfoDialog = (row) => {
  if (row.userId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      showCommitButton: false,
      userId: row.userId
    })
    modalsStore.showModal('userInfoModal')
  } else {
    ElMessage({
      message: `未找到用户ID`,
      type: 'error'
    })
  }
}

/**
 * 关闭 修改规则配置
 */
const closeDialog = (): void => {
  isVisible.value = false
}

/**
 * 打开 修改规则配置
 */
const openDialog = () => {
  isVisible.value = true
}

// 加载基础数据
const fetchCommonData = async () => {
  // 加载 彩种类型
  await bettingStore.getGameType()
  // 加载 投票类型
  await bettingStore.getListPlayTypeCode()
}

onMounted(async () => {
  fetchCommonData()
  // 列表数据
  fetchData()
})
</script>

<style lang="less" scoped>
.predict_list {
  // justify-content: right;
  padding-left: 0;
  display: flex;
  list-style: none;
  column-gap: 10px;
  > li {
    min-width: 26px;
    width: 26px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    background-color: rgb(99, 161, 3);
    color: white;
    border-radius: 100%;
    &.non_style {
      min-width: initial;
      width: initial;
      height: initial;
      text-align: initial;
      line-height: initial;
      background-color: initial;
      color: initial;
      border-radius: initial;
    }
  }
}
.custom_y {
  color: rgb(99, 161, 3);
}
.custom_n {
  color: rgb(217, 0, 27);
}
.custom_i {
  color: rgb(234, 179, 98);
}
</style>
