<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        class="custom-el-form no-rule"
        :model="queryForm"
        label-width="100px"
        @keyup.enter="fetchData()"
      >
        <el-form-item label="" prop="searchId">
          <AutoChoseLoginId v-model="queryForm.searchId" />
        </el-form-item>
        <el-form-item label="" prop="nickname">
          <AutoChoseNickname v-model="queryForm.nickname" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="" prop="parentId">
          <SelectUserIdAndNickname
            v-model="queryForm.parentSearchId!"
            id="userId"
            :group="['nickname', 'loginId']"
            placeholder="上级昵称｜帐号"
            style="width: 160px"
          />

          <!-- <UserTwoAutocomplete
            placeholder="上级代理"
            name="parentSearchId"
            v-model:remoteId="queryForm.parentSearchId"
            v-model:remoteValue="queryForm.parentValue"
          ></UserTwoAutocomplete> -->
        </el-form-item>
        <el-form-item label="" prop="mobileCountryCode">
          <SelectPhoneCode isClearable v-model="queryForm.mobileCountryCode" style="width: 100px"></SelectPhoneCode>
        </el-form-item>
        <el-form-item label="" prop="mobileShortcut">
          <el-input
            v-model="queryForm.mobileShortcut"
            maxlength="30"
            placeholder="手机号(前两位+后两位)"
            style="width: 170px"
          />
        </el-form-item>
        <!-- <el-form-item label="" prop="parentNickname">
          <UserAutocomplete
            placeholder="上级代理昵称"
            name="parentNickname"
            v-model:remoteValue="queryForm.parentNickname"
          ></UserAutocomplete>
        </el-form-item> -->
        <el-form-item label="" prop="userLevel">
          <el-select v-model="queryForm.userLevel" filterable placeholder="层级" style="width: 120px">
            <el-option v-for="item in optionUserLevel" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="userStatus">
          <el-select v-model="queryForm.userStatus" placeholder="用户状态" style="width: 120px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in optionsUserStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="userType">
          <el-select v-model="queryForm.userType" placeholder="用户类型" style="width: 120px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in optionsUserType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="accountType">
          <el-select v-model="queryForm.accountType" placeholder="运营状态" style="width: 120px">
            <el-option label="全部" value="L" />
            <el-option v-for="item in optionsAccountType" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="innerDistribution">
          <el-input v-model="queryForm.innerDistribution" maxlength="30" placeholder="内部关联账户" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="注册开始时间"
            end-placeholder="注册结束时间"
            v-model:startDate="queryForm.regStartTime"
            v-model:endDate="queryForm.regEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="登录开始时间"
            end-placeholder="登录结束时间"
            v-model:startDate="queryForm.loginStartTime"
            v-model:endDate="queryForm.loginEndTime"
          ></TimeSelect>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="5"></ExpandableSection>
        <el-form-item>
          <el-button type="primary" @click="fetchData">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" plain @click="resetButton">
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="addButton">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
          <el-button type="success" plain @click="openSyncUserDailog" :loading="isLoadingSync">
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <el-table
        v-loading="isLoading"
        :data="tableList"
        stripe
        ref="userTableRef"
        highlight-current-row
        style="height: 100%; width: 100%"
        :show-overflow-tooltip="{ disabled: true }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="登入帐号 | 用户昵称" align="left" key="planTitle" prop="planTitle" minWidth="220">
          <template #="{ row }">
            <p class="like-a overflow-hidden" @click="handTabs(row)" type="primary">
              {{ row.loginId }} | {{ row.nickname }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="手机短号" minWidth="120" align="left">
          <template #="{ row }">
            <p v-if="row.mobileShortcut">
              {{
                row.mobileCountryCode +
                ' ' +
                row.mobileShortcut.substring(0, 2) +
                '***' +
                row.mobileShortcut.substring(2)
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="上级代理" align="left" key="parentId" prop="parentId" minWidth="220">
          <template #="{ row }">
            <template v-if="row.parentId != 0">
              <p class="like-a overflow-hidden" @click="handParentTabs(row)" type="primary">
                {{ row.parentLoginId }}｜
                {{ row.parentNickname }}
              </p>
            </template>
            <template v-else></template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="积分" align="center" key="startTime" prop="startTime" /> -->
        <el-table-column label="层级" minWidth="60" align="right" key="userLevel" prop="userLevel" />
        <!-- <el-table-column label="运营状态" align="center" key="mtUserId" prop="mtUserId" /> -->
        <el-table-column label="运营状态" align="left" key="accountType" prop="accountType" minWidth="80">
          <template #="{ row }">
            <p>{{ formatAccountType(row.accountType) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" align="left" minWidth="80" key="userType" prop="userType">
          <template #="{ row }">
            <p>{{ formatUserType(row.userType) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="用户状态" align="left" key="userStatus" prop="userStatus" minWidth="85">
          <template #="{ row }">
            <el-dropdown trigger="click" size="small" style="cursor: pointer" @command="stateChange">
              <span class="el-dropdown-link">
                <el-tag v-if="row.userStatus == 'y'" class="mx-1" type="primary">启用</el-tag>
                <el-tag v-else-if="row.userStatus == 'n'" class="mx-1" type="warning">停用</el-tag>
                <el-tag v-else-if="row.userStatus == 't'" class="mx-1" type="warning">停权</el-tag>
                <el-tag v-else-if="row.userStatus == 'f'" class="mx-1" type="warning">冻结</el-tag>
                <el-tag v-else-if="row.userStatus == 'u'" class="mx-1" type="primary">未启用</el-tag>
                <el-tag v-else-if="row.userStatus == 'z'" class="mx-1" type="primary">保留</el-tag>
                <el-tag v-else-if="row.userStatus == 'v'" class="mx-1" type="primary">浏览</el-tag>
                <el-tag v-else-if="row.userStatus == 'x'" class="mx-1" type="info">关停</el-tag>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'y' }">
                    <el-tag type="primary">启用</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'u' }">
                    <el-tag type="primary">未启用</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'z' }">
                    <el-tag type="primary">保留</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'v' }">
                    <el-tag type="primary">浏览</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'n' }">
                    <el-tag type="warning">停用</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 't' }">
                    <el-tag type="warning">停权</el-tag>
                  </el-dropdown-item>
                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'f' }">
                    <el-tag type="warning">冻结</el-tag>
                  </el-dropdown-item>

                  <el-dropdown-item class="mx-1" :command="{ userId: row.userId, userStatus: 'x' }">
                    <el-tag type="info">关停</el-tag>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="上次登录时间" align="left" key="lastLoginTime" prop="lastLoginTime" minWidth="120">
          <template #="{ row }">
            {{ unitFormatDate(row.lastLoginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最后登陆IP" align="left" key="lastLoginIP" prop="lastLoginIP" minWidth="210">
          <template #="{ row }">
            {{ row.lastLoginIP }}
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
  <!-- 用户列表新增弹窗 -->
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="isForm"
    :close-on-click-modal="false"
    @close="closeDialog"
    class="tabs-dialog"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="用户" name="user_tab" class="m_tabs_pane">
        <el-form :model="addForm" ref="formRef" :rules="rulesUser" class="dialog-form">
          <el-row class="form-row mt-3 mr-3">
            <el-col :span="10">
              <el-form-item label="账户名称:" prop="loginId">
                <el-input
                  v-model.trim="addForm.loginId"
                  style="width: 15rem"
                  placeholder="请输入账户名称"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="账户昵称:" prop="nickname">
                <el-input
                  v-model.trim="addForm.nickname"
                  style="width: 15rem"
                  placeholder="请输入账户昵称"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="手机号码:" prop="mobile">
                <el-row style="width: 100%">
                  <el-col :span="8" style="padding: 0 0px 0 0">
                    <!-- <selectCode
                      placeholderString="手机区号"
                      v-model="addForm.mobileCountryCode"
                    ></selectCode> -->
                    <SelectPhoneCode isClearable v-model="addForm.mobileCountryCode"></SelectPhoneCode>
                  </el-col>
                  <el-col :span="16">
                    <el-input
                      v-model.trim="addForm.mobile"
                      style="width: 100%"
                      placeholder="请输入手机号码"
                      autocomplete="off"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="用户状态:" prop="userStatus">
                <!-- <el-select v-model="addForm.userStatus" placeholder="请选择用户状态">
                <el-option v-for="item in optionsUserStatus" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select> -->
                <el-radio-group v-model="addForm.userStatus">
                  <el-radio
                    v-for="item in optionsUserStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户类型:" prop="userType">
                <el-radio-group v-model="addForm.userType">
                  <el-radio
                    v-for="item in optionsUserType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="用户上级:" prop="parentId">
                <SelectUserIdAndNickname
                  v-model="addForm.parentId"
                  id="userId"
                  :group="['nickname', 'loginId']"
                  placeholder="用户昵称｜帐号"
                />
                <!-- <RemoteInput
                  placeholder="请输入用户上级"
                  style="width: 15rem"
                  :isAddForm="true"
                  name="searchId"
                  v-model:remoteId="addForm.parentId"
                ></RemoteInput> -->
              </el-form-item>
              <el-form-item label="关联账户:" prop="innerDistribution">
                <el-input
                  v-model="addForm.innerDistribution"
                  maxlength="30"
                  style="width: 15rem"
                  autocomplete="off"
                  placeholder="请输入关联账户"
                />
              </el-form-item>
              <el-form-item label="运营状态:" prop="accountType">
                <el-radio-group v-model="addForm.accountType">
                  <el-radio
                    v-for="item in optionsAccountType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="邮箱:" prop="email">
                <el-input
                  v-model.trim="addForm.email"
                  style="width: 100%"
                  placeholder="请输入邮箱"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="addForm.gender">
                  <el-radio value="m">男</el-radio>
                  <el-radio value="f">女</el-radio>
                  <el-radio value="x">未知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="button-row">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="isLoading2" @click="addFormInfo(formRef)">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>

  <!-- 注册用户tab页面 -->
  <UserListComponent
    :userId="userId"
    v-model:isTabs="isTabs"
    :searchFunk="closeEditTab"
    @closeEvent="closeEditTab"
    :isAccountInfoDisplay="isAccountInfoDisplay"
  ></UserListComponent>
  <SyncUserDailog v-if="isOpenDailog" ref="syncUserDailogRef" />
</template>

<script setup lang="ts">
import i18n from '@/i18n'
import { useRoute } from 'vue-router'
const { t } = i18n.global as any
import { ref, nextTick } from 'vue'
// api
import { reqUserList, reqUserCreate, reqUpdateUser } from '@/api/user/index'
import { reqUserListPush } from '@/api/super/index'
import type { IReqUserCreateQueryParams, IReqUserListData, IReqUserListQueryParams } from '@/api/user/type'

import TimeSelect from '@/components/timeSelect/index.vue'
import ManageSiteSelect from '@/components/manageSiteSelect/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'

import RemoteInput from '@/components/remoteInput/index.vue'
// import MAutocomplete from '@/components/mAutocomplete/index.vue'
import UserAutocomplete from '@/components/userAutocomplete/index.vue'
import UserDeleteAutocomplete from '@/components/userDeleteAutocomplete/index.vue'
import UserTwoAutocomplete from '@/components/userTwoAutocomplete/index.vue'
// 用户列表tab
import UserListComponent from '../userList/userListComponent.vue'
//黑名单
import ExpandableSection from '@/components/expandIcon/index.vue'

import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()
import { useOptions, optionsUserStatus, optionsUserType, optionsAccountType } from '@/const/options'
import { unitFormatDate } from '@/utils/dateFormat/index'
import SyncUserDailog, { IExpose } from '@/views/User/userList/components/syncUserDailog.vue'
import { TableInstance } from 'element-plus'

// 获取路由对象
const useRoutes = useRoute()
const userDialog = ref(false)
const activeTab = ref('user_tab') //tab切换第一条

//用户类型
const { formatValue: formatUserType } = useOptions(optionsUserType)
//团队状态
//账号类型
const { formatValue: formatAccountType } = useOptions(optionsAccountType)
function generateOptions() {
  const options: any = []
  for (let i = 1; i <= 30; i++) {
    options.push({ value: i, label: i })
  }
  return options
}
const optionUserLevel = generateOptions()
const isAccountInfoDisplay = ref(true)

const initQueryForm = (): IReqUserListQueryParams & ITempValue => ({
  remoteValue: '',
  manageSiteId: '',
  page: 1,
  size: 15,
  loginId: '',
  nickname: '',
  parentSearchId: '',
  regStartTime: '',
  regEndTime: '',
  userStatus: 'L',
  userType: 'L',
  parentId: '',
  searchId: '',
  accountType: 'L',
  loginStartTime: '',
  loginEndTime: '',
  parentNickname: '',
  innerDistribution: '',
  userLevel: undefined,
  mobileCountryCode: '',
  mobileShortcut: '',
  userId: '',
  sortOrder: 'DESC',
  sortName: 'reg_time',
  parentValue: ''
})

const initForm = (): IReqUserCreateQueryParams => ({
  manageSiteId: '',
  loginId: '',
  nickname: '',
  userStatus: 'y',
  userType: 'u',
  parentId: undefined,
  userMemo: '',
  mobileCountryCode: '',
  mobile: '',
  email: '',
  gender: 'm',
  innerDistribution: '',
  accountType: 'f'
})

// const isUserForm = ref(false)
const rulesUser = ref({
  loginId: [
    { required: true, message: '请输入账户名称', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (/[^\x00-\x7F]/.test(value)) {
          callback(new Error('账户名称只能包含英文字母、数字和符号'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
  // mobileCountryCode:[{ required: true, message: '请选择手机区号', trigger: 'blur' }],
  mobile: [{ min: 4, message: '请输入4位以上的手机号', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
})

interface ITempValue {
  remoteValue: string
  parentValue: string
}

const initPageObj = () => ({
  page: 1,
  size: 15
})
//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
// const distinguish = ref(false)
//分页数据
const pageObj = ref(initPageObj())
// const optionType = ref('1')
// const remoteOptions = ref([])
const isForm = ref(false)
const isTabs = ref(false)
const isExpanded = ref(false)
const formRef = ref()
const queryRef = ref()

// const drawer2 = ref(false)
const activeName = ref('first')
// const isEditForm = ref(false)
const isLoading = ref(false)
const isLoading2 = ref(false)
const isLoadingSync = ref(false)
// const isLoading3 = ref(false)
const total = ref(0)
const tableList = ref<IReqUserListData[]>([])
const queryForm = reactive<IReqUserListQueryParams & ITempValue>(initQueryForm())
const addForm = ref<IReqUserCreateQueryParams>(initForm())
const editForm = ref<IReqUserCreateQueryParams>(initForm())
// const accountInfo = ref({})

// const favoriteListRef = ref()
// const likeListRef = ref()
// const followerListRef = ref()
// const blockListRef = ref()
const userId = ref('')
//搜索
async function fetchData() {
  isLoading.value = true
  try {
    let res = await reqUserList(queryForm)
    tableList.value = res.data.list
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
// const selectable = (row: User) => {
//   return true
// }

const userTableRef = ref<TableInstance>()

/**
 * 用户同步, 打开用户同步dailog
 */
const isOpenDailog = ref(false)
const syncUserDailogRef = ref<IExpose>()
const openSyncUserDailog = () => {
  isOpenDailog.value = true
  nextTick(() => {
    syncUserDailogRef.value?.openDialog(multipleSelection.value)
  })
}
/**
 * 用户同步,选择指定的用户, 或者不选择任何一个,如果一个都不选择.即同步所有用户
 */
const multipleSelection = ref<IReqUserListData[]>([])
const handleSelectionChange = (val: IReqUserListData[]) => {
  multipleSelection.value = val
}

const resetButton = () => {
  Object.assign(queryForm, initQueryForm())
  fetchData()
}

const addButton = () => {
  isForm.value = true
}

const route = useRoute()
const router = useRouter()
const handTabs = (row) => {
  // return
  userId.value = row.userId
  router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    ...modalsStore.userInfoModal.modalData,
    userId: userId.value,
    showCommitButton: true
  })
  modalsStore.showModal('userInfoModal')
}
// 点击
const handParentTabs = (row) => {
  userId.value = row.parentId
  router.push({ path: route.path, query: {} })
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: userId.value
  })
  modalsStore.showModal('userInfoModal')
}

const addFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      // console.log(addForm.value.parentId)
      if (!addForm.value.parentId) {
      } else {
        if (editForm?.value?.parentId?.includes('-')) {
          let temp = editForm.value.parentId.split('-')
          editForm.value.parentId = temp[1]
        } else {
        }
      }

      try {
        const query: IReqUserCreateQueryParams = { ...addForm.value }
        let res = await reqUserCreate(query)
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          fetchData()
          isForm.value = false
          Object.assign(addForm.value, initForm())
        } else {
          showErrorMessage(res)
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading2.value = false
      }
    } else {
      isLoading2.value = false
    }
  })
}

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

onMounted(async () => {
  fetchData()
})

watch(
  () => [queryForm.page, queryForm.size],
  (newValue, oldValue) => {
    fetchData()
  }
)

const closeDialog = () => {
  isForm.value = false
  Object.assign(addForm.value, initForm())
  formRef.value.clearValidate()
}

const closeEditTab = () => {
  closeTabs()
  fetchData()
}

const closeTabs = () => {
  isTabs.value = false
  activeName.value = 'first'
  // accountInfo.value = {}
}

const stateChange = (row) => {
  let { userId, userStatus } = row

  // addForm.value.templateStatus = row.websiteStatus;
  // if (userStatus == 'n' || userStatus == 'x') {
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  }).then(() => {
    editStateInfo({ userId, userStatus })
  })
  // } else {
  //   editStateInfo({ userId, userStatus });
  // }
}

const editStateInfo = async (data) => {
  try {
    let res = await reqUpdateUser({ ...data })
    if (res.success) {
      ElMessage({
        showClose: true,
        message: t('table.controls') + t('errorCode.0'),
        type: 'success'
      })
      fetchData()
      // isEditForm.value = false;
      // Object.assign(addForm.value, initForm());
    } else {
      showErrorMessage(res)
    }
  } catch (err) {
    console.log(err)
  } finally {
  }
}
</script>

<style scoped lang="less">
.account-table {
  .account-role {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.checked {
  .el-checkbox {
    width: 100px;
  }
}

.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
