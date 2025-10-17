<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" :model="queryForm" class="search_left" label-width="90px">
        <el-form-item prop="manageSiteId">
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item>
        <el-form-item prop="announcementTitle">
          <el-input v-model="queryForm.announcementTitle" placeholder="公告标题" />
        </el-form-item>
        <el-form-item label="公告状态：" prop="anStatus">
          <el-select v-model="queryForm.anStatus" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告范围：" prop="announcementScope">
          <el-select v-model="queryForm.announcementScope" placeholder="公告范围">
            <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <TimeSelect
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          v-model:startDate="queryForm.startTime"
          v-model:endDate="queryForm.endTime"
        ></TimeSelect>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="searchButton({ ...queryForm, ...pageObj })" :loading="isLoading">
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
        <el-table-column label="公告标题" key="announcementTitle" prop="announcementTitle" width="200">
          <template #="{ row }">
            <p class="like-a overflow-hidden" type="primary" @click="handleEdit(row)">
              {{ row.announcementTitle }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="公告内容" key="announcementDesc" prop="announcementDesc" width="350" />
        <el-table-column label="加密" key="isSecretDesc" prop="isSecretDesc" width="60">
          <template #="{ row }">
            <el-text v-if="row.isSecretDesc == 'y'" class="mx-1" type="primary">是</el-text>
            <el-text v-else class="mx-1" type="info">否</el-text>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" key="createTime" prop="createTime" width="180">
          <template #="{ row }">
            {{ unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="开始时间" key="startTime" prop="startTime" width="180">
          <template #="{ row }">
            {{ unitFormatDate(row.startTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" key="endTime" prop="endTime" width="180">
          <template #="{ row }">
            {{ unitFormatDate(row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="公告范围" key="announcementScope" prop="announcementScope" width="80">
          <template #="{ row }">
            {{ formatScope(row.announcementScope) }}
          </template>
        </el-table-column>
        <el-table-column label="针对对象" width="80">
          <template #="{ row }">
            <p class="like-a overflow-hidden" v-if="row.anUserId && row.anUserId != ''" @click="showUserInfo(row)">
              用户ID：{{ row.anUserId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.anTeamUserId && row.anTeamUserId != ''"
              @click="showUserInfo(row)"
            >
              用户ID：{{ row.anTeamUserId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.anWebsiteId && row.anWebsiteId != ''"
              @click="showSideInfo(row)"
            >
              站点ID：{{ row.anWebsiteId }}
            </p>
            <p
              class="like-a overflow-hidden"
              v-else-if="row.anDomain && row.anDomain != ''"
              @click="showDomainInfo(row)"
            >
              域名：{{ row.anDomain }}
            </p>
            <p v-else>平台</p>
          </template>
        </el-table-column>
        <el-table-column label="针对端点" key="anTargets" prop="anTargets" width="300">
          <template #="{ row }">
            {{ formatTargets(row.anTargets) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" key="anStatus" prop="anStatus" width="100">
          <template #default="scope">
            <template v-if="scope.row.anStatus == 'n'">
              <div style="display: flex; justify-content: space-between">
                <span style="padding: 4px 0 0 0">关闭</span>
                <el-switch
                  v-model="scope.row.anStatus"
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
                  v-model="scope.row.anStatus"
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
        <el-table-column
          label="延迟关闭秒数"
          align="right"
          key="delayCloseSeconds"
          prop="delayCloseSeconds"
          width="110"
        />
        <!-- <el-table-column fixed="right" :label="t('table.controls')" width="80">
          <template #="{ row }">
            <el-button type="primary" size="small" plain @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column> -->
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
    <!-- 新增公告/编辑公告-->
    <el-dialog v-model="isForm" :close-on-click-modal="false" @close="closeDialog" class="tabs-dialog">
      <el-tabs v-model="activeTab" class="m_tabs">
        <el-tab-pane label="公告" name="first" class="m_tabs_pane">
          <el-scrollbar>
            <el-form :model="addForm" ref="formRef" :rules="rulesAddFrom" class="single-form">
              <el-form-item label="公告ID：" v-if="distinguish" prop="announcementId">
                {{ addForm.announcementId }}
                <copy :content="addForm.announcementId" />
              </el-form-item>
              <el-form-item label="公告标题：" prop="announcementTitle">
                <el-input v-model="addForm.announcementTitle" placeholder="请输入公告标题" autocomplete="off" />
              </el-form-item>
              <el-form-item label="公告内容：" prop="announcementDesc">
                <div class="text-editor">
                  <TextEditor v-if="isForm" placeholder="请输入正文..." v-model="addForm.announcementDesc" />
                </div>
              </el-form-item>
              <el-form-item label="是否加密：" prop="isSecretDesc">
                <el-radio-group v-model="addForm.isSecretDesc">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="公告状态：" prop="anStatus">
                <el-radio-group v-model="addForm.anStatus">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="addForm.createTime" label="创建时间：" prop="">
                {{ unitFormatDate(addForm.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
              <el-form-item label="公告时间：" prop="">
                <TimeSelect v-model:startDate="addForm.startTime" v-model:endDate="addForm.endTime"></TimeSelect>
              </el-form-item>
              <el-form-item label="公告范围：" prop="announcementScope">
                <el-select v-model="addForm.announcementScope" placeholder="请选择公告范围">
                  <el-option v-for="item in optionsScope" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="针对端点：" prop="anTargets">
                <el-select v-model="addForm.anTargets" placeholder="请选择端点" multiple>
                  <el-option v-for="item in optionsTargets" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="延迟秒数：" prop="delayCloseSeconds">
                <el-input v-model="addForm.delayCloseSeconds" placeholder="请输入延迟时间" autocomplete="off" />
              </el-form-item>
              <el-form-item label="对象类型：" prop="">
                <el-radio-group v-model="addForm.announcementUserType" @change="changeUserType">
                  <el-radio value="L">平台</el-radio>
                  <el-radio value="user">用户</el-radio>
                  <el-radio value="team">团队</el-radio>
                  <el-radio value="web">网站</el-radio>
                  <el-radio value="domain">域名</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="addForm.announcementUserType == 'user' || addForm.announcementUserType == 'team'"
                label="用户ID："
                prop="announcementUserValue"
              >
                <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入用户ID'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
                    :value="item.scopesId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-else-if="addForm.announcementUserType == 'web'"
                label="站点ID："
                prop="announcementUserValue"
              >
                <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入站点ID'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
                    :value="item.scopesId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                v-else-if="addForm.announcementUserType == 'domain'"
                label="域名："
                prop="announcementUserValue"
              >
                <el-select
                  v-model="addForm.announcementUserValue"
                  filterable
                  remote
                  reserve-keyword
                  :placeholder="addForm.announcementUserValue ? addForm.announcementUserValue : '请输入域名'"
                  clearable
                  :remote-method="remoTetemplateIdChange"
                >
                  <el-option
                    v-for="(item, index) in remoteTemplateOptions"
                    :key="index"
                    :label="item.scopesName + ' - ' + item.scopesId"
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
    <EditWebsiteTabs v-if="modalsStore.websiteInfoModal.isVisible" ref="editWebsiteTabsRef" />
    <DomainInformationTabs v-if="modalsStore.domainInfoModal.isVisible" ref="domainInfoTabsRef" />
  </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { setPermissionsStore } from '@/stores/index'
import {
  // reqAnnouncementList,
  // reqAnnouncementEdit,
  // reqAnnouncementAdd,
  // reqAnnouncementEditStatus,
  // reqListBlurTemplate
  useMessageNoticeApi
} from '@/api/messageNotice/index'

import { reqHttp as webSiteList } from '@/api/manageSite/manageSiteList/index'

import { optionsTargets, useOptions, optionsScope } from '@/const/options'

import TimeSelect from '@/components/timeSelect2/index.vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'

import EditWebsiteTabs from '@/views/Site/editWebsiteTabs.vue'
import DomainInformationTabs from '@/views/Site/Domain/components/DomainInformationTabs.vue'
import { useModalsStore } from '@/stores/modalStore'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'
import { add } from 'date-fns'
const modalsStore = useModalsStore()

const queryRef = ref()
const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)

//公告范围
const { formatScope: formatScope } = useOptions(optionsScope)
//公告多端
const { formatData: formatTargets } = useOptions(optionsTargets)

//tabs
const activeTab = ref('first')

const editWebsiteTabsRef = ref<InstanceType<typeof EditWebsiteTabs> | null>(null)
const domainInfoTabsRef = ref<InstanceType<typeof DomainInformationTabs> | null>(null)

const rulesAddFrom = ref({
  announcementTitle: [{ required: true, message: '请输公告标题', trigger: 'blur' }],
  delayCloseSeconds: [{ pattern: /^[0-9]*$/, message: '延迟秒数必须为数字', trigger: 'blur' }],
  announcementUserValue: [{ required: true, message: '请输入对象信息', trigger: 'blur' }],
  announcementDesc: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
})

const initQueryForm = () => ({
  manageSiteId: '',
  announcementTitle: '',
  announcementScope: 'g',
  anStatus: 'L',
  startTime: null,
  endTime: null,
  sortOrder: 'DESC',
  sortName: 'create_time'
})

const initForm = () => ({
  manageSiteId: '',
  announcementId: '',
  announcementTitle: '',
  announcementDesc: '',
  isSecretDesc: 'n',
  startTime: null,
  endTime: null,
  createTime: null,
  announcementScope: 'g',
  anTeamUserId: '',
  anUserId: '',
  anWebsiteId: '',
  anDomain: '',
  anTargets: [],
  anStatus: 'y',
  delayCloseSeconds: '',
  announcementUserType: 'L',
  announcementUserValue: ''
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
const addForm: any = ref(initForm())
const queryForm = ref(initQueryForm())
const remoteTemplateOptions: any = ref([])
const websiteOptions: any = ref([])

const manageSiteId = computed(() => {
  return queryForm.value.manageSiteId
})

const { reqAnnouncementList, reqAnnouncementEdit, reqAnnouncementAdd, reqAnnouncementEditStatus, reqListBlurTemplate } =
  useMessageNoticeApi(manageSiteId)

async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  isLoading.value = true
  try {
    let res = await reqAnnouncementList(vals)
    if (res.success) {
      tableList.value = res.data.list
      total.value = parseInt(res.data.total)
    } else {
      showErrorMessage(res)
    }
  } catch (err) {
    showErrorMessage(err)
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
  // 初始化 addForm
  Object.assign(addForm.value, { ...initForm() })
}

// Helper 方法：根据 row 数据确定用户类型
const getUserType = (row) => {
  if (row.anUserId) return 'user'
  if (row.anTeamUserId) return 'team'
  if (row.anWebsiteId) return 'web'
  if (row.anDomain) return 'domain'
  return 'L' // 平台
}

// Helper 方法：根据用户类型获取用户值
const getUserValue = (row) => {
  return row.anUserId || row.anTeamUserId || row.anWebsiteId || row.anDomain || ''
}

const handleEdit = (row) => {
  isForm.value = true
  distinguish.value = true

  // 初始化 addForm
  Object.assign(addForm.value, { ...row })

  // 设置公告用户类型和值
  addForm.value.announcementUserType = getUserType(row)
  addForm.value.announcementUserValue = getUserValue(row)
}

const submitInfo = (formRefval) => {
  if (formRefval.announcementUserType == 'L') {
    formRefval.announcementUserValue = ''
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
      try {
        let res = await reqAnnouncementAdd({ ...addForm.value })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value)
          })
          isForm.value = false
          Object.assign(addForm.value, initForm())
          closeEditTab()
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

const editFormInfo = async (formRefval) => {
  isLoading2.value = true
  await formRefval.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqAnnouncementEdit({ ...addForm.value })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          searchButton({
            ...Object.assign(queryForm.value, initQueryForm()),
            ...Object.assign(pageObj.value)
          })
          isForm.value = false
          Object.assign(addForm.value, initForm())
          closeEditTab()
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
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

const switchChange = (event, row, index) => {
  if (row.anStatus == 'y') {
    tableList.value[index].anStatus = 'n'
  } else {
    tableList.value[index].anStatus = 'y'
  }
  ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
    type: 'warning'
  })
    .then(() => {
      reqAnnouncementEditStatus({
        announcementId: row.announcementId,
        anStatus: row.anStatus == 'n' ? 'y' : 'n'
      }).then((res) => {
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          searchButton({ ...queryForm.value, ...pageObj.value })
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
      let res = await reqListBlurTemplate({
        announcementUserType: addForm.value.announcementUserType,
        announcementUserValue: val
      })
      remoteTemplateOptions.value = res.data
    } catch (err) {}
  } else {
    remoteTemplateOptions.value = []
  }
}

//针对对象窗口
const showUserInfo = (row) => {
  if (row.anUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.anUserId,
      showCommitButton: false
    })
    modalsStore.showModal('userInfoModal')
  } else if (row.anTeamUserId) {
    modalsStore.setActiveTab('userInfoModal', 'tab1')
    modalsStore.setModalData('userInfoModal', {
      userId: row.anTeamUserId,
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
    websiteId: row.anWebsiteId,
    showOtherTabs: true,
    canHandleSubmit: true,
    isVisible: true,
    hasRightToSubmit: false
  })
  modalsStore.showModal('websiteInfoModal')
}

const showDomainInfo = (row) => {
  if (row.anDomain !== '') {
    modalsStore.setActiveTab('domainInfoModal', 'tab1')
    modalsStore.setModalData('domainInfoModal', {
      domain: row.anDomain,
      hasRightToSubmit: false
    })
    modalsStore.showModal('domainInfoModal')
  }
}

const changeUserType = (val) => {
  if (val == 'user' && addForm.value.anUserId && addForm.value.anUserId != '') {
    addForm.value.announcementUserValue = addForm.value.anUserId
  } else if (val == 'team' && addForm.value.anTeamUserId && addForm.value.anTeamUserId != '') {
    addForm.value.announcementUserValue = addForm.value.anTeamUserId
  } else if (val == 'web' && addForm.value.anWebsiteId && addForm.value.anWebsiteId != '') {
    addForm.value.announcementUserValue = addForm.value.anWebsiteId
  } else if (val == 'domain' && addForm.value.anDomain && addForm.value.anDomain != '') {
    addForm.value.announcementUserValue = addForm.value.anDomain
  } else {
    addForm.value.announcementUserValue = ''
  }
}

const closeDialog = () => {
  isForm.value = false
  isEditForm.value = false
  distinguish.value = false
  Object.assign(addForm.value, initForm())
  if (formRef?.value?.clearValidate) {
    formRef?.value?.clearValidate()
  }
  closeEditTab()
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
</script>

<style scoped lang="less">
:deep(.el-input__wrapper) {
  width: 120px;
}

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

.el-button--text {
  margin-right: 15px;
}

.editor-content {
  :deep(.w-e-text-container) {
    height: 150px !important;
  }
}

.text-editor {
  height: 300px;
  width: 100%;
}
</style>
