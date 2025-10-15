<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" :model="queryForm" class="search_left" label-width="90px">
        <el-form-item prop="manageId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item>
        <el-form-item label="" prop="planTitle">
          <el-input v-model="queryForm.planTitle" placeholder="维护标题" />
        </el-form-item>
        <el-form-item label="维护状态：" prop="planStatus">
          <el-select v-model="queryForm.planStatus" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="有效" value="y" />
            <el-option label="失效" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="维护范围：" prop="maintainScope">
          <el-select v-model="queryForm.maintainScope" placeholder="维护范围">
            <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <TimeSelect
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          v-model:startDate="queryForm.startTime"
          v-model:endDate="queryForm.endTime"
        ></TimeSelect>
        <el-form-item>
          <el-button type="primary" @click="searchButton({ ...queryForm, ...pageObj })" :loading="isLoading">
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
        </el-form-item>
      </el-form>
    </section>

    <div class="main_flex_table">
      <el-table
        v-loading="isLoading"
        :data="tableList"
        stripe
        highlight-current-row
        style="height: 100%"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <el-table-column label="维护标题" align="left" key="" prop="" width="200">
          <template #="{ row }">
            <p class="like-a overflow-hidden" type="primary" @click="handleEdit(row)">
              {{ row.planTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="维护描述" align="left" key="planDesc" prop="planDesc" min-width="350" />
        <el-table-column label="创建时间" align="left" width="180" key="createTime" prop="createTime">
          <template #="{ row }">
            {{ unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" align="left" width="180" key="startTime" prop="startTime">
          <template #="{ row }">
            {{ unitFormatDate(row.startTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="left" width="180" key="endTime" prop="endTime">
          <template #="{ row }">
            {{ unitFormatDate(row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="维护范围" align="left" key="maintainScope" prop="maintaintScope" width="80">
          <template #="{ row }">
            {{ formatScope(row.maintainScope) }}
          </template>
        </el-table-column>
        <el-table-column label="针对对象" align="left" width="80">
          <template #="{ row }">
            <p class="like-a overflow-hidden" v-if="row.mtUserId && row.mtUserId != ''" @click="showUserInfo(row)">
              用户ID：{{ row.mtUserId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.mtTeamUserId && row.mtTeamUserId != ''"
              @click="showUserInfo(row)"
            >
              用户ID：{{ row.mtTeamUserId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.mtWebsiteId && row.mtWebsiteId != ''"
              @click="showSideInfo(row)"
            >
              站点ID：{{ row.mtWebsiteId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.mtDomain && row.mtDomain != ''"
              @click="showDomainInfo(row)"
            >
              域名：{{ row.mtDomain }}
            </p>
            <p v-else>平台</p>
          </template>
        </el-table-column>
        <el-table-column label="针对端点" align="left" key="mtTargets" prop="mtTargets" width="300">
          <template #="{ row }">
            {{ formatTargets(row.mtTargets) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="left" key="planStatus" prop="planStatus" width="100">
          <template #default="scope">
            <template v-if="scope.row.planStatus == 'n'">
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">关闭</span>
                <el-switch
                  v-model="scope.row.planStatus"
                  active-value="y"
                  inactive-value="n"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
            <template v-else>
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">启用</span>
                <el-switch
                  v-model="scope.row.planStatus"
                  :active-value="'y'"
                  :inactive-value="'n'"
                  @click="switchChange($event, scope.row, scope.$index)"
                  class="ml-2"
                />
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="创建人" key="createUserName" prop="createUserName" width="80" />
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="pageObj.page"
        v-model:page-size="pageObj.size"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增/编辑 -->
    <el-dialog v-model="isForm" v-if="isForm" :close-on-click-modal="false" @close="closeDialog" class="tabs-dialog">
      <el-tabs v-model="activeTab" class="m_tabs">
        <el-tab-pane label="维护" name="first" class="m_tabs_pane">
          <el-scrollbar>
            <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
              <el-form-item label="维护ID：" v-if="distinguish" prop="planId">
                {{ addForm.planId }}
                <copy :content="addForm.planId" />
              </el-form-item>
              <el-form-item label="计划标题：" prop="planTitle">
                <el-input v-model="addForm.planTitle" autocomplete="off" />
              </el-form-item>
              <el-form-item label="计划状态：" prop="planStatus">
                <el-select v-model="addForm.planStatus" placeholder="Please select a zone">
                  <el-option label="有效" value="y" />
                  <el-option label="失效" value="n" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="addForm.createTime" label="创建时间：" prop="">
                {{ unitFormatDate(addForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
              <el-form-item label="维护时间：" prop="">
                <el-date-picker
                  v-model="addForm.partTime"
                  type="datetimerange"
                  format="YYYY-MM-DD HH:mm:ss"
                  date-format="YYYY/MM/DD "
                  unlink-panels
                  time-format="HH:mm:ss"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
              <el-form-item label="维护范围：" prop="maintainScope">
                <el-select v-model="addForm.maintainScope" placeholder="请选择维护范围">
                  <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="针对端点：" prop="mtTargets">
                <el-select v-model="addForm.mtTargets" placeholder="请选择端点" multiple>
                  <el-option v-for="item in optionsTargets" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="维护描述：" prop="planDesc">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="请输入上级备注"
                  maxlength="200"
                  :rows="2"
                  v-model="addForm.planDesc"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="对象类型：" prop="">
                <el-radio-group v-model="addForm.maintainplanUserType" @change="changeUserType">
                  <el-radio value="L">平台</el-radio>
                  <el-radio value="user">用户</el-radio>
                  <el-radio value="team">团队</el-radio>
                  <el-radio value="web">网站</el-radio>
                  <el-radio value="domain">域名</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="['user', 'team', 'web', 'domain'].includes(addForm.maintainplanUserType)"
                :label="getLabelAndPlaceholderByType(addForm.maintainplanUserType).label"
                prop="maintainplanUserValue"
              >
                <el-select
                  v-model="addForm.maintainplanUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="getLabelAndPlaceholderByType(addForm.maintainplanUserType).placeholder"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="`${item.scopesName} - ${item.scopesId}`"
                    :value="item.scopesId"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-scrollbar>
          <div class="button-row">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="isLoading2" @click="submitInfo(formRef)">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 针对对象信息 -->
    <UserListComponent></UserListComponent>
    <EditWebsiteTabs v-if="modalsStore.websiteInfoModal.isVisible" />
    <DomainInformationTabs v-if="modalsStore.domainInfoModal.isVisible" ref="domainInfoTabsRef" />
  </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import {
  // reqMaintainList,
  // reqMaintainEdit,
  // reqMaintainAdd,
  // reqPlanEditStatus,
  // reqListScopeValues
  useMessageNoticeApi
} from '@/api/messageNotice/index'
// 计算表格高度

import TimeSelect from '@/components/timeSelect2/index.vue'
import { optionsScope, useOptions, optionsTargets } from '@/const/options'
import { unitFormatDate, unitToDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
const queryRef = ref()
const remoteTemplateOptions: any = ref([])
import EditWebsiteTabs from '@/views/Site/editWebsiteTabs.vue'
import DomainInformationTabs from '@/views/Site/Domain/components/DomainInformationTabs.vue'
import { reqHttp as webSiteList } from '@/api/manageSite/manageSiteList/index'
import { useModalsStore } from '@/stores/modalStore'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
const modalsStore = useModalsStore()

//公告范围
const { formatScope: formatScope } = useOptions(optionsScope)
//公告多端
const { formatData: formatTargets } = useOptions(optionsTargets)

const editWebsiteTabsRef = ref<InstanceType<typeof EditWebsiteTabs> | null>(null)
const domainInfoTabsRef = ref<InstanceType<typeof DomainInformationTabs> | null>(null)

//tabs
const activeTab = ref('first')

const rulesAddFrom = ref({
  planTitle: [{ required: true, message: '请输入计划标题', trigger: 'blur' }],
  delayCloseSeconds: [{ pattern: /^[0-9]*$/, message: '延迟秒数必须为数字', trigger: 'blur' }],
  maintainplanUserValue: [{ required: true, message: '请输入对象信息', trigger: 'blur' }]
})

const initQueryForm = () => ({
  manageSiteId: '',
  planTitle: '',
  maintainScope: 'g',
  planStatus: 'L',
  manageId: '',
  startTime: null,
  endTime: null,
  sortOrder: 'DESC',
  sortName: 'create_time',
  partTime: []
})

const getLabelAndPlaceholderByType = (type) => {
  const mappings = {
    user: { label: '用户ID：', placeholder: '请输入用户ID' },
    team: { label: '团队ID：', placeholder: '请输入团队ID' },
    web: { label: '网站ID：', placeholder: '请输入网站ID' },
    domain: { label: '域名：', placeholder: '请输入域名' }
  }
  return mappings[type] || { label: '', placeholder: '请选择' }
}

const initForm = () => ({
  manageSiteId: '',
  planId: '',
  maintainScope: 'g',
  planStatus: 'y',
  startTime: null,
  endTime: null,
  createTime: null,
  planTitle: '',
  planDesc: '',
  mtTeamUserId: '',
  mtUserId: '',
  mtWebsiteId: '',
  mtDomain: '',
  mtTargets: [],
  maintainplanUserType: 'L',
  maintainplanUserValue: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
const distinguish = ref(false)
//分页数据
const pageObj = ref(initPageObj())
const isForm = ref(false)
const isEditForm = ref(false)
const isLoading = ref(false)
const isLoading2 = ref(false)
const formRef: any = ref()
const total = ref(0)
const tableList: any = ref([])
const queryForm = ref(initQueryForm())
const addForm: any = ref(initForm())
const editForm = ref(initForm())
const websiteOptions: any = ref([])

const manageSiteId = computed(() => {
  return queryForm.value.manageSiteId
})

const { reqMaintainList, reqMaintainEdit, reqMaintainAdd, reqPlanEditStatus, reqListScopeValues } =
  useMessageNoticeApi(manageSiteId)

//搜索
async function searchButton(vals = { ...queryForm.value, ...pageObj.value }) {
  isLoading.value = true
  try {
    let res = await reqMaintainList(vals)
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

const resetButton = () => {
  Object.assign(queryForm.value, initQueryForm())
  searchButton({
    ...Object.assign(queryForm.value, initQueryForm()),
    ...Object.assign(pageObj.value, initPageObj())
  })
}

const addButton = () => {
  isForm.value = true
  distinguish.value = false
  addForm.value.partTime = []
}

const handleEdit = (row) => {
  if (row.startTime && row.endTime) {
    addForm.value.partTime = [unitToDate(row.startTime), unitToDate(row.endTime)]
  } else {
    addForm.value.partTime = []
  }
  isForm.value = true
  distinguish.value = true

  Object.assign(addForm.value, { ...row })

  const userTypeMap = {
    user: addForm.value.mtUserId,
    team: addForm.value.mtTeamUserId,
    website: addForm.value.mtWebsiteId,
    domain: addForm.value.mtDomain
  }

  for (const [type, value] of Object.entries(userTypeMap)) {
    if (addForm.value.maintainplanUserType && value) {
      addForm.value.maintainplanUserType = type
      addForm.value.maintainplanUserValue = value
      return
    }
  }
  addForm.value.maintainplanUserType = 'L'
}

const submitInfo = (formRefval) => {
  if (formRefval.maintainplanUserType == 'L') {
    formRefval.maintainplanUserType = ''
  }
  if (distinguish.value) {
    editFormInfo(formRefval)
  } else {
    addFormInfo(formRefval)
  }
}

const addFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      const { partTime, ...params } = addForm.value
      // console.log(partTime, 'partTime')
      if (partTime.length > 0) {
        params.startTime = partTime[0].getTime()
        params.endTime = partTime[1].getTime()
      }

      try {
        let res = await reqMaintainAdd({ ...params })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value)
            //...Object.assign(pageObj.value, initPageObj())
          })
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
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}

const editFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      const { partTime, ...params } = addForm.value
      //console.log(partTime, params.startTime, params.endTime)
      if (partTime) {
        params.startTime = partTime[0].getTime()
        params.endTime = partTime[1].getTime()
      } else {
        params.startTime = null
        params.endTime = null
      }
      try {
        let res = await reqMaintainEdit({ ...params })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value)
            //...Object.assign(pageObj.value, initPageObj())
          })
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
      console.log('error submit!', fields)
      isLoading2.value = false
    }
  })
}

const handleSizeChange = (val) => {
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

const switchChange = (event, row, index) => {
  if (row.planStatus == 'y') {
    tableList.value[index].planStatus = 'n'
  } else {
    tableList.value[index].planStatus = 'y'
  }
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      reqPlanEditStatus({ planId: row.planId, planStatus: row.planStatus == 'n' ? 'y' : 'n' }).then((res) => {
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          searchButton()
        } else {
          showErrorMessage(res)
        }
      })
    })
    .catch(() => {})
}

async function remoTetemplateIdChange(val) {
  if (val) {
    try {
      let res = await reqListScopeValues({
        maintainplanUserType: addForm.value.maintainplanUserType,
        maintainplanUserValue: val
      })
      remoteTemplateOptions.value = res.data
    } catch (err) {}
  } else {
    remoteTemplateOptions.value = []
  }
}

//针对对象窗口
const showUserInfo = (row) => {
  if (row.mtUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.mtUserId,
      showCommitButton: false
    })
    modalsStore.showModal('userInfoModal')
  } else if (row.mtTeamUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.mtTeamUserId,
      showCommitButton: false
    })
    modalsStore.showModal('userInfoModal')
  } else {
    return
  }
}

const showSideInfo = (row) => {
  modalsStore.setActiveTab('websiteInfoModal', 'tab1')
  modalsStore.setModalData('websiteInfoModal', {
    websiteId: row.mtWebsiteId,
    showOtherTabs: true,
    canHandleSubmit: true,
    isVisible: true,
    hasRightToSubmit: false
  })
  modalsStore.showModal('websiteInfoModal')
}

const showDomainInfo = (row) => {
  if (row.mtDomain !== '') {
    modalsStore.setActiveTab('domainInfoModal', 'tab1')
    modalsStore.setModalData('domainInfoModal', {
      domain: row.mtDomain,
      hasRightToSubmit: false
    })
    modalsStore.showModal('domainInfoModal')
  }
}

const changeUserType = (val) => {
  const typeToValueMap = {
    user: 'mtUserId',
    team: 'mtTeamUserId',
    website: 'mtWebsiteId',
    domain: 'mtDomain'
  }

  const selectedValue = typeToValueMap[val]
  if (selectedValue && addForm.value[selectedValue]) {
    addForm.value.maintainplanUserValue = addForm.value[selectedValue]
  } else {
    addForm.value.maintainplanUserValue = ''
  }
}

onMounted(async () => {
  try {
    let res = await webSiteList({
      page: 1,
      size: 999,
      sortName: 'create_time',
      sortOrder: 'DESC'
    })
    if (res.success) {
      websiteOptions.value = res.data.list
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
    showErrorMessage(error)
  }
  searchButton()
})

const closeDialog = () => {
  isForm.value = false
  isEditForm.value = false
  distinguish.value = false
  Object.assign(editForm.value, initForm())
  Object.assign(addForm.value, initForm())
  formRef.value.clearValidate()
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

.phone {
  display: flex;

  p {
    font-size: 22px;
  }

  .one {
    margin: 0 10px;

    .onee {
      width: 80px;
    }
  }

  .two {
    .twoo {
      width: 180px;
    }
  }
}

.secret-key {
  display: flex;

  .one {
    .onee {
      width: 200px;
      margin-right: 20px;
    }
  }
}
</style>
