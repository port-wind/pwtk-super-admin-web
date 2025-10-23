<template>
  <UserListComponent></UserListComponent>
  <DomainInformationTabs v-if="modalsStore.domainInfoModal.isVisible" ref="domainInfoTabsRef" />
  <el-table
    ref="elTableRef"
    :data="internalData"
    :show-overflow-tooltip="{ disabled: true }"
    style="width: 100%; height: 100%"
    stripe
    v-loading="isLoading"
    highlight-current-row
    :height="count(tableRef)"
  >
    <el-table-column fixed label="域名" key="domain" width="190" prop="domain">
      <template #default="{ row }">
        <a href="javascript:void(0)" class="domain-link" @click="handleClickOneDomain(row.domain)">
          {{ row.domain }}
        </a>
      </template>
    </el-table-column>
    <el-table-column label="来源" key="domainFrom" prop="domainFrom" width="80">
      <template #="{ row }">{{ domainSource[row.domainFrom] }}</template>
    </el-table-column>
    <el-table-column label="类型" key="domainType" prop="domainType" width="100">
      <template #="{ row }">{{ domainType[row.domainType] }}</template>
    </el-table-column>

    <!-- 状态 -->
    <el-table-column label="状态" key="domainStatus" prop="domainStatus" width="100">
      <template #default="{ row, $index }">
        <div style="display: flex; justify-content: space-between">
          <span style="padding: 4px 0 0 0">{{ row.domainStatus === 'y' ? '启用' : '关闭' }}</span>
          <el-switch
            v-model="row.domainStatus"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(row)"
          ></el-switch>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="落地页" key="landingPage" prop="landingPage" width="100">
      <template #="{ row }">{{ landingPage[row.landingPage] }}</template>
    </el-table-column>

    <!-- 绑定站点 -->
    <el-table-column label="绑定站点" key="websiteRef" width="120">
      <template #default="{ row }">
        <span class="like-a" @click="handleClickWebsite(row)" v-text="row.websiteInnerName" />
      </template>
    </el-table-column>
    <!-- 所属用户 -->
    <el-table-column label="所属用户" key="ownerUserId" prop="ownerUserId" width="120">
      <template #="{ row }">
        <!-- userName即loginId -->
        <p class="like-a" @click="showUserInfoDialog(row)">
          {{ row.userName }}
        </p>
      </template>
    </el-table-column>
    <!-- 标题 -->
    <el-table-column label="标题" key="websiteTitle" prop="websiteTitle" width="150" />
    <!-- 关键字 -->
    <el-table-column label="关键字" key="keyWords" prop="keyWords" width="120" />
    <!-- 描述 -->
    <el-table-column label="描述" key="descriptions" prop="descriptions" width="150" />
    <!-- 默认推广码 -->
    <el-table-column label="默认推广码" key="promotionCode" prop="promotionCode" width="120" />
    <!-- 是否强制https -->
    <el-table-column width="100" label="强制https" key="isForceHttps" prop="isForceHttps">
      <template #="{ row }">
        <span>{{ row.isForceHttps === 'y' ? '是' : '否' }}</span>
        <!-- <el-dropdown trigger="click" size="small" @command="stateChange">
          <span class="el-dropdown-link">
            <el-tag v-if="row.isForceHttps == 'y'" class="mx-1" type="primary">
              是
            </el-tag>
            <el-tag v-else class="mx-1" type="info">
              否
            </el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item class="mx-1" :command="{ row, isForceHttps: 'y' }">
                <el-tag type="primary">启用</el-tag>
              </el-dropdown-item>
              <el-dropdown-item class="mx-1" :command="{ row, isForceHttps: 'n' }">
                <el-tag type="info">关闭</el-tag>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </template>
    </el-table-column>
    <el-table-column width="100" label="配置ssl证书" key="isSupportSsl" prop="isSupportSsl">
      <template #="{ row }">
        <span>{{ row.isSupportSsl === 'y' ? '是' : '否' }}</span>
      </template>
    </el-table-column>
    <!-- 到期时间 -->
    <el-table-column width="120" label="ssl证书到期日" key="sslExpiry" prop="sslExpiry">
      <template #="{ row }">
        <!-- <span>{{ trimDateTime(row.sslExpiry) }}</span> -->
        <span>{{ formatDate(row.sslExpiry) }}</span>
        <!-- <span>{{ unitFormatDate(row.sslExpiry, 'yyyy-MM-dd') }}</span> -->
      </template>
    </el-table-column>
    <el-table-column width="120" label="提示APP下载" key="isAppDownloadHint" prop="isAppDownloadHint">
      <template #="{ row }">
        <span>{{ row.isAppDownloadHint === 'y' ? '是' : '否' }}</span>
      </template>
    </el-table-column>
    <el-table-column label="ops管理代码" key="opsManageCode" prop="opsManageCode" width="120" />
    <el-table-column label="在线客服代码" key="onlineServiceCode" prop="onlineServiceCode" width="150" />
    <el-table-column label="统计代码" key="hasStatsCode" prop="hasStatsCode" width="80">
      <template #="{ row }">
        <el-text v-if="row.hasStatsCode === 'y'" class="mx-1" type="primary">
          <!--  <el-text
              v-if="1"
              class="mx-1"
              type="primary"
            > -->
          <el-link @click="handTabs(row)" type="primary">查看</el-link>
        </el-text>
        <el-text v-else class="mx-1" type="info"></el-text>
      </template>
    </el-table-column>
    <el-table-column label="cdn地址" key="cdnUrl" prop="cdnUrl" width="150" />
    <el-table-column label="语言" key="langCodes" prop="langCodes" width="120">
      <template #="{ row }">{{ formatLanguageData(row.langCodes) }}</template>
    </el-table-column>
    <!-- 地区 -->
    <el-table-column label="地区" key="areaCodes" prop="areaCodes" width="120">
      <template #="{ row }">{{ formatAreaData(row.areaCodes) }}</template>
    </el-table-column>

    <!-- 备注 -->
    <el-table-column label="备注" align="left" key="memo" prop="memo" width="150" />

    <!-- 创建时间 -->
    <el-table-column label="创建时间" key="createTime" prop="createTime" width="120">
      <template #="{ row }">
        {{ unitFormatDate(row.createTime) }}
      </template>
    </el-table-column>
  </el-table>

  <!-- 删除确认弹窗 -->

  <!-- tab页面 -->
  <el-dialog
    destroy-on-close
    v-model="isTabs"
    websiteTitle="统计代码"
    :close-on-click-modal="false"
    class="tabs-dialog"
  >
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="统计代码" name="first" class="m_tabs_pane">
        <el-scrollbar>
          <p>
            <!-- {{ stateInfo }} -->
            初始化代码: {{ stateInfo.statsCodeInit }}
            <copy :content="stateInfo.statsCodeInit" v-if="stateInfo.statsCodeInit"></copy>
          </p>
          <p>
            统计代码URL: {{ stateInfo.statsCodeJsUrl }}
            <copy :content="stateInfo.statsCodeJsUrl" v-if="stateInfo.statsCodeJsUrl"></copy>
          </p>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  {{ modalsStore.editWebsiteTabsModal?.isVisible }}
  <EditWebsiteTabs ref="editWebsiteTabsRef" :kengengaaruka="false" v-if="modalsStore.websiteInfoModal.isVisible" />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, inject } from 'vue'
import i18n from '@/i18n'
const { t } = i18n.global as any
// import { initEditFormModel, type EditRequest, type TableData, } from '@/api/site/domain/types';
import { editDomain } from '@/api/site/domain'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useOptions, optionsLang, optionsArea } from '@/const/options'
import { domainType, domainSource, landingPage } from '@/const/options.json'
import NoData from '@/views/Site/siteManagement/components/noData.vue'
import AccountInfo from '@/views/User/userList/components/accountInfo.vue'
import FavoriteList from '@/views/User/userList/components/favoriteList.vue'
import LikeList from '@/views/User/userList/components/likeList.vue'
import FollowerList from '@/views/User/userList/components/followerList.vue'
import MyTeams from '@/views/User/userList/components/myTeams.vue'
import UserVote from '@/views/User/userList/components/userVote.vue'
import UserVisiter from '@/views/User/userList/components/userVisiter.vue'
import AnonymousVisiter from '@/views/User/userList/components/anonymousVisiter.vue'
import BlockList from '@/views/User/userList/components/blockList.vue'
import Myfans from '@/views/User/userList/components/myFans.vue'
import UserListComponent from '@/views/User/userList/userListComponent.vue'
import DomainInformationTabs from '@/views/Site/Domain/components/DomainInformationTabs.vue'
import type { ElTable } from 'element-plus'
// 计算表格高度
import count from '@/utils/tableHeight'
import EditWebsiteTabs from '@/views/Site/editWebsiteTabs.vue'
import { useModalsStore } from '@/stores/modalStore'
// import DomainDialogTab from './DomainDialogTab.vue'
//tabs
function trimDateTime(dateTimeString: string): string {
  return dateTimeString.replace(/\s.*$/, '')
}
function formatDate(dateString: string | undefined): string {
  if (!dateString) {
    return '' // 如果 dateString 是 undefined，返回空字符串
  }
  return dateString.split(' ')[0] // 只返回日期部分
}
const activeTab = ref('first')
const domainInfoTabsRef = ref<InstanceType<typeof DomainInformationTabs> | null>(null)
const domain = ref<string>('')
const editWebsiteTabsRef = ref<InstanceType<typeof EditWebsiteTabs> | null>(null)
const elTableRef = ref<InstanceType<typeof ElTable> | null>(null)
const activeName = ref<
  'first' | 'second' | 'third' | 'fourth' | 'fifth' | 'sixth' | 'seventh' | 'eighth' | 'ninth' | 'tenth'
>('first')
// 使用 inject 获取父组件提供的 ref
// const tableRef = inject('tableRef') as Ref<InstanceType<typeof ElTable> | null>
const tableRef = inject<Ref<HTMLElement | null>>('tableRef')
// const domainDialogTabRef = inject('domainDialogTabRef') as Ref<InstanceType<typeof DomainDialogTab> | null>

// const bindedTabActiveName = ref('first');
// const unBindedTabActiveName = ref('first');
const ownerUserForm = ref(false)
// const domainDetailData = ref<EditRequest>(initEditFormModel())
const initAccountInfo = () => ({})
const accountInfo = ref<any>(initAccountInfo())
const closeUserDialog = () => {
  Object.assign(accountInfo.value, initAccountInfo())
  ownerUserForm.value = false
}
const props = defineProps({
  tableData: {
    type: Array as () => any[],
    required: true
  },
  tableHeight: {
    type: String
  },
  isLoading: {
    type: Boolean,
    required: true
  },
  websiteId: Number,
  fetchData: {
    type: Function,
    required: true
  }
})

const modalsStore = useModalsStore()
const handleClickWebsite = (row) => {
  modalsStore.setActiveTab('websiteInfoModal', 'tab1')
  modalsStore.setModalData('websiteInfoModal', {
    websiteId: row.websiteRef,
    showOtherTabs: true,
    websiteInnerName: row.websiteInnerName,
    canHandleSubmit: true,
    isVisible: true,
    hasRightToSubmit: false
  })
  // console.log('modalsStore.websiteInfoModal.modalData',modalsStore.websiteInfoModal.modalData,modalsStore.websiteInfoModal.modalData?.isVisible);

  modalsStore.showModal('websiteInfoModal')
}
// 点击查看，跳转查看信息dialog
const showUserInfoDialog = (row) => {
  // console.log('click');
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    ...modalsStore.userInfoModal.modalData,
    showCommitButton: false,
    userId: row.ownerUserId
  })
  modalsStore.showModal('userInfoModal')
  /* reqUserQuery({ ...initPageObj(), userId: row.ownerUserId })
    .then((res) => {
      console.log('rs', res)
      ownerUserForm.value = true
      if (res && res.data.list.length) {
        Object.assign(accountInfo.value, { ...res.data.list[0] })
      } else if (res && Array.isArray(res.data.list)) {
        Object.assign(accountInfo.value, initAccountInfo())
      }
      ownerUserForm.value = true
    })
    .catch((err) => {
      console.log('err', err)
    }) */
}

const stateChange = async (row) => {
  const { isForceHttps } = row
  const {
    row: { domain }
  } = row
  // return console.log('row', row,domain,isForceHttps);
  try {
    const response = await editDomain({ domain, isForceHttps })
    if (response.success) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      /* row.domainStatus = newStatus;
      return Promise.resolve(); */
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
      return Promise.reject(new Error(response.errMessage))
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '保存数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  } finally {
    if (props.fetchData) {
      props.fetchData({ ...currentSearchForm.value, isForceHttps })
    } else {
      console.error('fetchData 方法未定义')
    }
  }
}

const { formatData: formatLanguageData } = useOptions(optionsLang)
const { formatData: formatAreaData } = useOptions(optionsArea)
/* const editDialogForBoundSites = ref<boolean>(false);
const editDialogForUnBoundSites = ref<boolean>(false); */
const handleClickOneDomain = (domainValue) => {
  domain.value = domainValue
  if (domain.value !== '') {
    modalsStore.setActiveTab('domainInfoModal', 'tab1')
    modalsStore.setModalData('domainInfoModal', {
      ...modalsStore.domainInfoModal.modalData,
      domain: domain.value,
      hasRightToSubmit: true
    })
    modalsStore.showModal('domainInfoModal')
  }
}

const isTabs = ref(false)
const internalData = ref([...props.tableData])
// console.log('internalData', internalData.value)
interface SearchForm {
  sortName: string
  sortOrder: string
  domain: string
  ownerUserId: string
  websiteRef: string
  langCodes: string[]
  areaCodes: string[]
  websiteInnerName: string
  websiteTitle: string
}
watch(
  () => props.tableData,
  (newValue) => {
    // console.log('newValue', newValue);
    if (newValue) {
      internalData.value = [...newValue]
    }
  },
  { deep: true }
)

const emit = defineEmits(['edit', 'delete', 'domainStatus', 'update:isLoading'])

const initStateInfo = () => ({
  websiteStatus: '',
  statsCodeInit: '',
  statsCodeJsUrl: ''
})
const stateInfo = ref(initStateInfo())
const handTabs = (row) => {
  isTabs.value = true
  const { createTime, userName, ...rest } = row
  Object.assign(stateInfo.value, { ...rest })
}
const searchForm = inject('searchForm') as {
  model: { value: SearchForm }
  update: (newFormModel: Partial<SearchForm>) => void
}
function removeProperty<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const { [key]: _, ...rest } = obj
  return rest
}

function editDomainStatusAndUpdateTable(domain, domainStatus, row): Promise<any> {
  console.log('doa', domain, domainStatus, row)

  let _domainStatus = domainStatus
  if (domainStatus === 'n') {
    // 启用域名
    _domainStatus = 'y'
  } else if (domainStatus === 'y') {
    // 关闭域名
    _domainStatus = 'n'
  }
  let sslExpiry = ''
  if (row.sslExpiry) {
    sslExpiry = row.sslExpiry.replace(' ', 'T')
  }
  const params = {
    ...row,
    domain,
    domainStatus: _domainStatus,
    sslExpiry
  }
  const _params = removeProperty(params, 'hasStatsCode')
  //  return  console.log('_params', _params);
  return new Promise((resolve, reject) => {
    emit('update:isLoading', true)
    editDomain(_params as any)
      .then((res) => {
        // console.log('res684', res)
        if (res.success) {
          ElMessage({
            message: '修改成功',
            type: 'success'
          })
          resolve(res)
        } else {
          ElMessage({
            message: '修改失败',
            type: 'error'
          })
          reject(res)
        }
      })
      .catch((err) => {
        console.error('err', err)
        reject(err)
      })
      .finally(() => {
        // 刷新Table
        props.fetchData({ ...currentSearchForm.value })
        emit('update:isLoading', false)
      })
  })
}
// 父コンポーネントからの検索入力の変数を受けとてからすぐにバックにリクエストすべきだ。
// 创建一个计算属性来访问最新的搜索表单数据
const currentSearchForm = computed(() => searchForm.model.value)
/**
 * 状态变化处理函数，返回一个Promise以满足before-change的要求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const statusChanged = (row) => {
  return new Promise((resolve, reject) => {
    if (row.domainStatus === 'n') {
      // 启用
      ElMessageBox.confirm(t('确定需要启用此域名吗'))
        .then(() => {
          console.log('执行A')
          editDomainStatusAndUpdateTable(row.domain, row.domainStatus, row).then(resolve).catch(reject)
        })
        .catch(() => {
          console.log('执行B')
          reject(new Error('用户取消操作'))
        })
    } else {
      /* , t('pop.warn'), {
        confirmButtonText: t('button.determine'),
        cancelButtonClass: t('button.cancel'),
        type: 'warning'
      }) */
      // 关闭域名
      ElMessageBox.confirm(t('确定需要关闭此域名吗'))
        .then(() => {
          console.log('执行C')
          editDomainStatusAndUpdateTable(row.domain, row.domainStatus, row).then(resolve).catch(reject)
        })
        .catch(() => {
          console.log('执行D')
          reject(new Error('用户取消操作'))
        })
    }
  })
}

/**
 * 更新状态函数，执行异步请求
 * @param {Object} row - 当前行数据
 * @returns {Promise}
 */
const updateStatus = async (row) => {
  // switch按钮切换状态
  const newStatus = row.domainStatus === 'y' ? 'n' : 'y'
  try {
    const response = await editDomain({ domain: row.domain, domainStatus: newStatus })
    if (response.success) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      row.domainStatus = newStatus
      return Promise.resolve()
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
      return Promise.reject(new Error(response.errMessage))
    }
  } catch (error) {
    console.error('Error saving data:', error)
    ElMessage({
      showClose: true,
      message: '保存数据时出错',
      type: 'error'
    })
    return Promise.reject(error)
  }
}
onMounted(() => {})
</script>
<style scoped lang="less">
.domain-link {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-table .cell.el-tooltip {
  min-width: 50px;
  white-space: nowrap;
  background-color: pink;
}
</style>
