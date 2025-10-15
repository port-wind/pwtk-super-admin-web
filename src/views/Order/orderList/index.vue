<script setup lang="ts">
import { ref } from 'vue'
import { reqPaymentList, cancelPayment } from '@/api/order/orderList/index'
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()

const tableData = ref([])
const isLoading = ref(false)
const total = ref<number>(0)

const queryRef = ref()
const initQueryForm = () => {
  return {
    payOrderId: '',
    userId: '',
    nickname: '',
    states: '0',
    beginCreateTime: '',
    endCreateTime: '',
    beginOperateTime: '',
    endOperateTime: '',
    manageSiteId: '',
    page: 1,
    size: 15
  }
}

const queryForm = reactive(initQueryForm())

const getstates = async (state) => {
  let states: number[] = []
  switch (state) {
    case '1':
      states = [0, 1]
      break
    case '2':
      states = [2]
      break
    case '3':
      states = [3, 6]
      break
    case '4':
      states = [4]
      break
    default:
      states = []
  }
  return states
}

const fetchData = async () => {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }
  isLoading.value = true
  let params: any = {
    ...queryForm
  }
  params.states = await getstates(params.states)
  try {
    const response = await reqPaymentList(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
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

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

const cancelOrder = async (row) => {
  let params = {
    payOrderId: row.payOrderId,
    userId: row.userId
  }
  try {
    const response = await cancelPayment(params)
    if (response.success) {
      fetchData()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const handTabs = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId,
    showCommitButton: false
  })
  modalsStore.showModal('userInfoModal')
}

//子站点ID 选择
const onSiteSelect = (val) => {
  console.log('val', val)
}

onMounted(() => {
  // console.log('mounted')
  // fetchData()
})

watch(
  () => [queryForm.size, queryForm.page],
  (newVale, oldValue) => {
    if (newVale) {
      fetchData()
    }
  }
)
</script>

<template>
  <section id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form
        ref="formRef"
        :inline="true"
        :model="queryForm"
        class="search_left"
        label-width="70px"
        @keyup.enter="fetchData"
      >
        <el-form-item label="" prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item>
        <el-form-item prop="payOrderId">
          <AutoComplete
            v-model="queryForm.payOrderId"
            :httpFunc="reqPaymentList"
            keyword="payOrderId"
            placeholder="订单号"
            :displayFields="['payOrderId']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="userId">
          <AutoComplete
            v-model="queryForm.userId"
            :httpFunc="reqUserList"
            keyword="userId"
            placeholder="登录账号｜用户ID"
            :displayFields="['loginId', 'userId']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="nickname">
          <AutoComplete
            v-model="queryForm.nickname"
            :httpFunc="reqUserList"
            keyword="nickname"
            placeholder="用户昵称"
            :displayFields="['nickname']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item prop="states">
          <el-select v-model="queryForm.states" placeholder="状态">
            <el-option label="全部" value="0" />
            <el-option label="支付中" value="1" />
            <el-option label="充值成功" value="2" />
            <el-option label="订单关闭" value="3" />
            <el-option label="充值失败" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item prop="createTime">
          <TimeSelect
            start-placeholder="下单开始时间"
            end-placeholder="下单结束时间"
            v-model:startDate="queryForm.beginCreateTime"
            v-model:endDate="queryForm.endCreateTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item prop="operateTime">
          <TimeSelect
            start-placeholder="操作开始时间"
            end-placeholder="操作结束时间"
            v-model:startDate="queryForm.beginOperateTime"
            v-model:endDate="queryForm.endOperateTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <el-table
        v-loading="isLoading"
        :data="tableData"
        stripe
        highlight-current-row
        style="height: 100%; width: 100%"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <el-table-column label="订单号" key="payOrderId" prop="payOrderId" minWidth="190" />
        <el-table-column label="登入账号｜用户昵称" key="userLoginId" prop="userLoginId" minWidth="220">
          <template #="{ row }">
            <p class="like-a overflow-hidden" @click="handTabs(row)">{{ row.userLoginId }} | {{ row.nickname }}</p>
          </template>
        </el-table-column>
        <el-table-column label="充值类型" key="bizType" prop="bizType" minWidth="90">
          <template #="{ row }">
            <span v-if="row.bizType == 's'">积分充值</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="right" key="amount" prop="amount" minWidth="80" />
        <el-table-column label="下单时间" key="createTime" prop="createTime" minWidth="170">
          <template #="{ row }">
            {{ unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" key="state" prop="state" minWidth="100">
          <template #="{ row }">
            <el-tag v-if="row.state == 0 || row.state == 1" type="warning" effect="dark">支付中</el-tag>
            <el-tag v-else-if="row.state == 2" type="success" effect="plain">充值成功</el-tag>
            <el-tag v-else-if="row.state == 3 || row.state == 6" type="info" effect="plain">订单关闭</el-tag>
            <el-tag v-else-if="row.state == 4" type="danger" effect="dark">充值失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" key="operateName" prop="operateName" minWidth="100" />
        <el-table-column label="操作时间" align="left" key="operateTime" prop="operateTime" minWidth="180">
          <template #="{ row }">
            <span v-if="row.operateTime">
              {{ unitFormatDate(row.operateTime, 'yyyy-MM-dd HH:mm:ss') }}
            </span>
            <span v-else-if="row.state == 0 || row.state == 1" class="like-a" @click="cancelOrder(row)">取消订单</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="queryForm.page"
        v-model:page-size="queryForm.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
  </section>
  <UserListComponent></UserListComponent>
</template>
