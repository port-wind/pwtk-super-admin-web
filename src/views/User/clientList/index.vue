<template>
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px" @keyup.enter="fetchData">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="cid" style="width: 200px">
          <el-input v-model="queryForm.cid" maxlength="40" placeholder="客户端ID" />
        </el-form-item>
        <el-form-item label="" prop="loginId" style="width: 200px">
          <UserAutocomplete
            placeholder="登入帐号 | 用户ID"
            name="searchId"
            v-model:remoteId="queryForm.searchId"
            style=""
          ></UserAutocomplete>
        </el-form-item>
        <el-form-item label="" prop="regIp" style="width: 200px">
          <el-input v-model="queryForm.regIP" maxlength="40" placeholder="IP" />
        </el-form-item>
        <el-form-item label="" prop="langCodes">
          <TimeSelect
            start-placeholder="申请开始时间"
            end-placeholder="申请结束时间"
            v-model:startDate="queryForm.regStartTime"
            v-model:endDate="queryForm.regEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="businessType" style="width: 150px">
          <el-select v-model="queryForm.businessType" placeholder="终端类型" style="width: 100%">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.businessType" :key="key" :label="value" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" :loading="isLoading" @click="fetchData">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="account-table">
      <!-- :tableHeight="count(queryRef).toString()" -->
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(queryRef).toString()"
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
        <template #cidDisplay="{ scope }">
          <span class="like-a" type="primary" @click="handTabs(scope.row)">
            {{ transformString(scope.row.cid) }}
            <copy :content="scope.row.cid"></copy>
          </span>
          <!-- <p>{{ scope.row.hostUserId }}</p> -->
          <p>
            {{ _Options.businessType[scope.row.businessType] }} |
            {{ _Options.clientFlag[scope.row.clientFlag] }}
          </p>
          <span v-if="scope.row.lastUserId" class="like-a" type="primary" @click="lastHandTabs(scope.row.lastUserId)">
            {{ scope.row.lastUserId }}
            <copy :content="scope.row.lastUserId"></copy>
          </span>
        </template>
        <template #reg="{ scope }">
          <p>{{ scope.row.regIP }}</p>
          <p>{{ unitFormatDate(scope.row.regTime) }}</p>
        </template>
      </m-table>
    </section>
    <!-- 未注册tab页面 -->
    <el-dialog
      draggable
      overflow
      destroy-on-close
      v-model="isTabs"
      title=""
      width="80%"
      top="5vh"
      :close-on-click-modal="false"
      @close="closeTabs"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane :lazy="true" label="基本信息" name="basicInformation">
          <BasicInformation :accountInfo="accountInfo"></BasicInformation>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="匿名点赞" name="likeAnonymously">
          <LikeAnonymously :accountInfo="accountInfo"></LikeAnonymously>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="匿名收藏" name="collectionAnonymously">
          <CollectionAnonymously :accountInfo="accountInfo"></CollectionAnonymously>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="匿名关注" name="followAnonymously">
          <FollowAnonymously :accountInfo="accountInfo"></FollowAnonymously>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="匿名投票" name="visitAnonymously">
          <VoatAnonymously :accountInfo="accountInfo"></VoatAnonymously>
        </el-tab-pane>
        <el-tab-pane :lazy="true" label="浏览记录" name="browsingHistory">
          <BrowsingHistory v-if="accountInfo" :accountInfo="accountInfo"></BrowsingHistory>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 注册用户tab页面 -->

    <UserListComponent
      :userId="userId"
      v-model:isTabs="isRegisterTabs"
      :isAccountInfoDisplay="false"
    ></UserListComponent>
  </div>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import _Options from '@/const/options.json'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/attachmentManagement/types'
import { reqUserInfo } from '@/api/user/index'
import { IReqClientListData, IReqClientListQueryParams, reqClientList } from '@/api/user/clientList/index'
// import mTable from '@/components/mTable/index.vue'
import TimeSelect from '@/components/timeSelect/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
//未注册用户信息
//基本信息
import BasicInformation from './components/basicInformation.vue'
//匿名点赞
import LikeAnonymously from './components/likeAnonymously.vue'
//匿名收藏
import CollectionAnonymously from './components/collectionAnonymously.vue'
//匿名关注
import FollowAnonymously from './components/followAnonymously.vue'
//匿名投票
import VoatAnonymously from './components/voatAnonymously.vue'
import BrowsingHistory from '@/views/User/userList/components/browseHistory/index.vue'

//浏览记录
import UserAutocomplete from '@/components/userAutocomplete/index.vue'
// 用户列表tab
import UserListComponent from '../userList/userListComponent.vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
const { t } = i18n.global as any

const initQueryForm = (): IReqClientListQueryParams => ({
  manageSiteId: '',
  cid: '',
  regIP: '',
  businessType: 'L',
  regStartTime: '',
  regEndTime: '',
  searchId: '',
  sortOrder: 'DESC',
  sortName: 'reg_time',
  page: 1,
  size: 15
})

// const initPageObj = () => ({
//   page: 1,
//   size: 15
// })

const isTabs = ref(false)
const isRegisterTabs = ref(false)
// const isControl = ref(false)
// const currentPage = ref(1)
// const pageSize = ref(15)
const queryRef = ref()
const total = ref<number>(0)
// const pageObj = ref(initPageObj())
const queryForm = reactive<IReqClientListQueryParams>(initQueryForm())
const tableData = ref<IReqClientListData[]>([])
const activeName = ref('basicInformation')
const activeRegisterName = ref('first')
const accountInfo = ref({})
//loading 按钮
const isLoading = ref(false)
const userId = ref('')

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'cid',
    label: '客户端',
    slot: 'cidDisplay',
    width: 220
  },
  {
    prop: 'ua',
    label: 'UA'
  },
  {
    prop: 'regIP',
    label: 'IP',
    width: 140,
    slot: 'reg'
  },
  {
    prop: 'os',
    label: 'OS'
  }
]

// fetch data
async function fetchData() {
  // if (!queryForm.manageSiteId) {
  //   ElMessage({
  //     message: '请选择一个站点',
  //     type: 'warning'
  //   })
  //   return
  // }
  try {
    isLoading.value = true
    const query: IReqClientListQueryParams = {
      ...queryForm
    }
    let res = await reqClientList(query)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

function transformString(originalStr) {
  // 获取前三位和后四位
  let prefix = originalStr.slice(0, 3)
  let suffix = originalStr.slice(-4)

  // 中间用三个星号替代
  let transformedStr = `${prefix}***${suffix}`

  return transformedStr
}

const handleClick = (tab, event) => {
  // console.log(tab, event)
}
const handTabs = (row) => {
  Object.assign(accountInfo.value, { ...row })
  console.log(row)
  isTabs.value = true
}
const lastHandTabs = (id) => {
  // reqUserInfoObject(id)
  userId.value = id
  console.log('index userId is', userId.value)
  isRegisterTabs.value = true
}
const closeTabs = () => {
  isTabs.value = false
  activeName.value = 'basicInformation'
  accountInfo.value = {}
}
//注册页面他tab
const closeRegisterTabs = () => {}
const closeRegisterEditTab = () => {}

watch(
  () => [queryForm.size, queryForm.page],
  (newValue, oldValue) => {
    fetchData()
  }
)
</script>
