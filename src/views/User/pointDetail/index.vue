<template>
  <div :key="componentKey" id="system_account" class="main_container">
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm">
        <el-form-item label="" prop="nickname">
          <UserDeleteAutocomplete
            placeholder="用户昵称"
            @keyup.enter="fetchData({ ...queryForm })"
            name="nickname"
            v-model:remoteId="queryForm.nickname"
            style=""
          ></UserDeleteAutocomplete>
        </el-form-item>
        <el-form-item label="积分活动" prop="bizTypeCode">
          <el-select v-model="queryForm.bizTypeCode" placeholder="积分活动">
            <el-option label="全部" value="L" />
            <el-option v-for="item in bizTypeCodeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="积分类型" prop="type">
          <el-select v-model="queryForm.type" placeholder="积分类型">
            <el-option label="全部" value="L" />
            <el-option label="积分增加" value="1" />
            <el-option label="积分减少" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect2>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
      >
        <template #nickname="{ scope }">
          <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'loginId', hoverShowCopy: true }"
            @action="viewUserDetails"
            :use-slot="true"
          >
            {{ scope.row.loginId }}&nbsp; | &nbsp;{{ scope.row.nickname }}
          </linkWithCopy>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 新增 弹出框 -->
  <section>
    <el-dialog v-model="addDialogVisible" draggable overflow destroy-on-close class="tabs-dialog"></el-dialog>
  </section>
  <UserListComponent></UserListComponent>
  <!-- 编辑 -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
// import i18n from '@/i18n'
// const { t } = i18n.global as any
import showErrorMessage from '@/utils/showErrorMessage'
import { reqPointActivityList, reqPointRulesDetail } from '@/api/user/pointRules'
import { TableOptions } from '@/components/mTable/types'
//上传相关
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import { dayjs } from 'element-plus'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const modalsStore = useModalsStore()
const valueBus = useValueBus()
const tableData = ref<any[]>([])

const initQueryForm = () => {
  const now = dayjs()
  const sevenDaysAgo = now.subtract(7, 'day')

  return {
    bizTypeCode: 'L',
    type: 'L',
    userName: '',
    startTime: sevenDaysAgo.valueOf(),
    endTime: now.valueOf(),
    nickname: ''
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const bizTypeCodeList = ref<any[]>([])
//新增弹窗
const addDialogVisible = ref(false)
const componentKey = computed(() => valueBus.pointDetailModal?.componentKey)
watch(
  componentKey,
  (newVal) => {
    console.log('componentKey', newVal)
    nextTick(() => {
      updateFetchData()
    })
  },
  { immediate: true }
)
//loading 按钮
const isLoading = ref(false)

const viewUserDetails = (rowData: any) => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData.userId
  })
  modalsStore.showModal('userInfoModal')
}

const formatNickname = (rowData: any) => {
  return rowData.nickname
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
    } else {
      console.log('表单验证失败')
    }
  })
}
const handleResetRefresh = () => {
  handleReset()
  // @ts-ignore
  queryForm.startTime = ''
  // @ts-ignore
  queryForm.endTime = ''
  fetchData()
}
const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
}

// Define individual stat values and their transitions
const score = ref(0)

const displayScore = useTransition(score, { duration: 1500 })

const totalScore = ref(0)
const displayTotalScore = useTransition(totalScore, { duration: 1500 })

const consumeScore = ref(0)
const displayConsumeScore = useTransition(consumeScore, { duration: 1500 })

const star = ref(0)
const displayStar = useTransition(star, { duration: 1500 })

const totalStar = ref(0)
const displayTotalStar = useTransition(totalStar, { duration: 1500 })

const consumeStar = ref(0)
const displayConsumeStar = useTransition(consumeStar, { duration: 1500 })

const viewScoreDetails = () => {
  console.log('查看积分明细')
}

const viewStarDetails = () => {
  console.log('查看星星明细')
}

// Update the onMounted function

const options = ref<TableOptions[]>([
  {
    label: '登入账号 | 用户昵称',
    prop: 'nickname',
    slot: 'nickname',
    width: '200px'
  },
  {
    label: '积分活动',
    prop: 'bizDesc'
  },
  {
    label: '积分类型',
    prop: 'bizType',
    json: {
      sourceName: 'bizType',
      keyName: 'bizType'
    }
  },
  {
    label: '积分明细',
    prop: 'changeScore',
    align: 'right'
  },
  {
    label: '变动前余额',
    prop: 'beforeScore',
    align: 'right'
  },
  {
    label: '当前余额',
    prop: 'afterScore',
    align: 'right'
  },
  {
    label: '操作人',
    prop: 'operatorDesc'
  },
  {
    label: '操作时间',
    prop: 'createTime',
    dateName: 'createTime'
  }
])
const updateFetchData = async () => {
  if (valueBus.pointDetailModal) {
    console.log('valueBus.userListModal', valueBus.pointDetailModal)
    handleReset()
    const { type } = valueBus.pointDetailModal
    if (type) {
      queryForm.type = type
    }
  }
  fetchData(queryForm)
}
//页面初始化获取数据
const fetchData = async (_queryForm?: any) => {
  let params = {
    ..._queryForm,
    page: currentPage.value,
    size: pageSize.value
  }
  if (params.type === 'L') {
    delete params.type
  }
  isLoading.value = true
  try {
    const response = await reqPointRulesDetail(params)
    if (response.success) {
      tableData.value = response!.data!.list
      total.value = Number(response!.data!.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  try {
    const res: any = await reqPointActivityList()
    const data = res.data
    console.log('data', data)
    bizTypeCodeList.value = data.map((item: any) => ({
      label: item.bizDesc,
      value: item.bizCode
    }))
    console.log('bizTypeCodeList', bizTypeCodeList.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  // await fetchData()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
.gray-box {
  background-color: #f5f7fa;
  border: none;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
}

.el-row {
  margin-bottom: 0;
}

.el-col {
  margin-bottom: 10px;
  padding: 10px;
}

.stat-header {
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}

.stat-content {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blue-text {
  color: #409eff;
}
</style>
