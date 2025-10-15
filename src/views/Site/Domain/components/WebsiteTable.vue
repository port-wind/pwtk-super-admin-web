<template>
  <!-- 搜索表单 域名管理=>站点列表 -->
  <div class="full-height-flex-column" ref="queryRef">
    <!-- <div class="dadClass" ref="queryRef"> -->
    <el-form :inline="true" :model="searchFormModel" class="demo-form-inline">
      <el-form-item label="" prop="websiteId">
        <el-autocomplete
          clearable
          style="width: 10rem"
          v-model="searchFormModel.websiteId"
          :fetch-suggestions="querySearchWebsiteId"
          placeholder="站点ID"
          :trigger-on-focus="false"
        >
          <template #default="{ item }">
            <div class="autocomplete-item">{{ item.value }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <!--  <el-form-item
        label=""
        prop="ownerUserId"
      >
        <el-autocomplete
          clearable
          style="width: 10rem"
          v-model="searchFormModel.ownerUserId"
          :fetch-suggestions="querySearchOwnerUserId"
          placeholder="所属用户"
          :trigger-on-focus="false"
        >
          <template #default="{ item }">
            <div class="autocomplete-item">{{ item.label }} | {{ item.prop }}</div>
          </template>
        </el-autocomplete>
      </el-form-item> -->
      <el-form-item label="" prop="templateId">
        <el-autocomplete
          clearable
          style="width: 10rem"
          v-model="searchFormModel.websiteTemplateRef"
          :fetch-suggestions="querySearchTemplateRef"
          placeholder="模板ID"
          :trigger-on-focus="false"
        >
          <template #default="{ item }">
            <div class="autocomplete-item">{{ item.label }} - {{ item.value }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>

      <el-form-item class="search-btn">
        <el-button type="primary" @click="handleSearch">
          <el-icon style="margin: 0 5px 0 0">
            <Search />
          </el-icon>
          查询
        </el-button>
        <el-button
          @click="resetSearchForm"
          :style="{
            color: 'var(--el-color-primary)',
            borderColor: 'var(--el-color-primary)',
            backgroundColor: '#e9f3ff'
          }"
        >
          <el-icon style="margin: 0 5px 0 0">
            <Refresh />
          </el-icon>
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="flexible-content-container-inside">
      <el-table :data="tableList" v-loading="isLoading" stripe highlight-current-row :show-overflow-tooltip="true">
        <!-- <el-table-column fixed type="index" width="50" /> -->
        <el-table-column fixed label="站点名称" key="websiteId" prop="websiteId" align="left" width="280">
          <template #="{ row }">
            <span class="" type="primary">
              <!-- @click="handleEditOneWebsite(row)" -->
              {{ row.websiteInnerName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="所属用户" key="" prop="" align="left" width="180">
          <template #="{ row }">
            <!-- <span @click="showUserInfoDialog(row)" type="primary"> -->
            <span type="primary">
              <!-- {{ row }} -->
              {{ row.userName }}
              <el-icon v-if="row.userName" @click="jumpView({ id: row.ownerUserId, tab: 'tab1' })">
                <Position />
              </el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="绑定模板名称" key="" prop="" align="left" width="230">
          <template #="{ row }">
            <span class="">
              {{ row.templateName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" key="websiteStatus" prop="websiteStatus" align="left">
          <template #="{ row }">
            <!-- <span>{{ row.websiteStatus === 'y' ? '启用' : '关闭' }}</span> -->
            <span>{{ websiteStatus.find((item) => item.value === row.websiteStatus)?.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" width="120" key="websiteTitle" prop="websiteTitle" align="left"></el-table-column>
        <el-table-column label="操作" key="isSysTemplate" prop="isSysTemplate" align="left">
          <template #="{ row }">
            <el-button
              :style="{ color: 'black' }"
              v-text="'绑定'"
              type="success"
              @click="handleBindWebsite(row.websiteId)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 15, 30, 50, 100]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <!-- 点击所属用户，查看用户信息dialog -->
  <!-- <UserListForJumpComponent></UserListForJumpComponent> -->
  <!-- <el-dialog
    class="tabs-dialog"
    v-model="ownerUserForm"
    title=""
    :close-on-click-modal="false"
    @close="closeUserDialog"
    draggable
    overflow
    destroy-on-close
  >
    <template v-if="Object.keys(accountInfo).length">
      <el-tabs
        v-model="activeName"
        class="m_tab"
      >
        <el-tab-pane
          label="账户信息"
          name="first"
          class="m_tabs_pane"
        >
          <AccountInfo
            :accountInfo="accountInfo"
            :displayHandleButton="false"
          ></AccountInfo>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="积分明细"
          name="points"
        >
          <Points :accountInfo="accountInfo"></Points>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="星星明细"
          name="stars"
        >
          <Stars :accountInfo="accountInfo"></Stars>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的收藏"
          name="favoriteList"
        >
          <FavoriteList
            ref="favoriteListRef"
            :accountInfo="accountInfo"
          ></FavoriteList>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的点赞"
          name="likeList"
        >
          <LikeList
            ref="likeListRef"
            :accountInfo="accountInfo"
          ></LikeList>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的关注"
          name="followerList"
        >
          <followerList
            ref="followerListRef"
            :accountInfo="accountInfo"
          ></followerList>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的评论"
          name="userComment"
        >
          <UserComment :accountInfo="accountInfo"></UserComment>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的粉丝"
          name="myFans"
        >
          <Myfans :accountInfo="accountInfo"></Myfans>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的团队"
          name="myTeams"
        >
          <MyTeams
            ref="myTeamsRef"
            :accountInfo="accountInfo"
          ></MyTeams>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的投票"
          name="userVote"
        >
          <UserVote :accountInfo="accountInfo"></UserVote>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="我的访客"
          name="userVisiter"
        >
          <UserVisiter :accountInfo="accountInfo"></UserVisiter>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="匿名访客"
          name="anonymousVisiter"
        >
          <AnonymousVisiter :accountInfo="accountInfo"></AnonymousVisiter>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="浏览记录"
          name="browsingHistory"
        >
          <BrowsingHistory :accountInfo="accountInfo"></BrowsingHistory>
        </el-tab-pane>
        <el-tab-pane
          :lazy="true"
          label="黑名单"
          name="blockList"
        >
          <BlockList
            ref="blockListRef"
            :accountInfo="accountInfo"
          ></BlockList>
        </el-tab-pane>
      </el-tabs>
    </template>
    <NoData v-else />
  </el-dialog> -->
</template>
<script setup lang="ts">
// 定义 props
interface Props {
  domain: string
  dialogHeight: number
  originOwnerUserId: string
}
interface Website {
  websiteName: string
  websiteId: string
  ownerUserId: string
  userName: string
  websiteTemplateRef: string
  templateRefName: string
  websiteStatus: 'active' | 'inactive' | 'pending' // 假设这些是可能的状态
  title: string
}
// import UserListForJumpComponent from '@/views/User/userList/userListComponentForJump.vue'
import NoData from '@/views/Site/siteManagement/components/noData.vue'
import AccountInfo from '@/views/User/userList/components/accountInfo.vue'
import FavoriteList from '@/views/User/userList/components/favoriteList.vue'
import LikeList from '@/views/User/userList/components/likeList.vue'
import FollowerList from '@/views/User/userList/components/followerList.vue'
import MyTeams from '@/views/User/userList/components/myTeams.vue'
import Myfans from '@/views/User/userList/components/myFans.vue'
import UserVote from '@/views/User/userList/components/userVote.vue'
import UserVisiter from '@/views/User/userList/components/userVisiter.vue'
import AnonymousVisiter from '@/views/User/userList/components/anonymousVisiter.vue'
import BlockList from '@/views/User/userList/components/blockList.vue'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { ref, defineEmits, defineProps } from 'vue'
import {
  getTemplateIdList,
  getWebSiteInfo,
  reqListBlurTemplateAndSketchCode,
  reqSetWebSiteListId,
  setBingWebSite,
  setWebSiteListId
} from '@/api/site'
import { reqUserList, reqUserQuery } from '@/api/user'
import showErrorMessage from '@/utils/showErrorMessage'
import { websiteStatus } from '@/const/options'
const manageSite = useManageSiteStore()
const activeName = ref('first')
const props = defineProps<{ domain: string; dialogHeight: number; originOwnerUserId: string }>()
const emit = defineEmits<{
  (e: 'updateActiveTab', tab: string): void
}>()
// 模糊查询使用
const initBigPageObj = () => ({ page: 1, size: 100 })
const ownerUserForm = ref<boolean>(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
let haveToResetCurrentPage = false
const tableList = ref<Website[]>([])
const isLoading = ref<boolean>(false)
const queryRef = ref()
const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}
const initAccountInfo = () => ({})
const accountInfo = ref<any>(initAccountInfo())
const closeUserDialog = () => {
  Object.assign(accountInfo.value, initAccountInfo())
  ownerUserForm.value = false
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
// 定义接口
interface SearchFormModel {
  websiteId: string
  ownerUserId: string
  websiteTemplateRef: string
}
// 初始化方法
function initSearchFormModel(): SearchFormModel {
  return {
    websiteId: '',
    ownerUserId: '',
    websiteTemplateRef: ''
  }
}
// 搜索表单数据
const searchFormModel = ref<SearchFormModel>(initSearchFormModel())
// 保存上一次搜索的表单状态
const lastSearchState = ref<SearchFormModel>({
  websiteId: '',
  ownerUserId: '',
  websiteTemplateRef: ''
})
const initPageObj = () => ({
  page: 1,
  size: 15
})
// 点击查看，跳转查看信息dialog
const showUserInfoDialog = (row) => {
  // console.log('row', row)
  activeName.value = 'first'
  reqUserQuery({ ...initPageObj(), userId: row.ownerUserId })
    .then((res) => {
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
    })
}
// 获取路由对象
const router = useRouter()
const userId: Ref<string> = ref('')
import { useModalsStore } from '@/stores/modalStore'
import { IReqListBlurTemplateAndSketchCodeQueryParams } from '@/api/site/types'
const modalsStore = useModalsStore()
const jumpView = ({ id, tab }) => {
  userId.value = id
  /* modalsStore.showModal('userInfoForJumpModal')
  modalsStore.setActiveTab('userInfoForJumpModal', tab)
  modalsStore.setModalData('userInfoForJumpModal', {
    ...modalsStore.userInfoForJumpModal.modalData,
    userId: userId.value,
    showCommitButton: false
  }) */
  const routeData = router.resolve({
    path: '/user/userList',
    query: { userId: id, activeTab: tab }
  })
  window.open(routeData.href, '_blank')
}
// 搜索方法
const handleSearch = () => {
  // return console.log('ssear');
  // 检查当前搜索条件是否与上次搜索条件一致
  const haveToResetCurrentPage = Object.keys(searchFormModel.value).some(
    (key) => searchFormModel.value[key as keyof SearchFormModel] !== lastSearchState.value[key as keyof SearchFormModel]
  )
  if (haveToResetCurrentPage) {
    currentPage.value = 1
  }
  // 更新上一次搜索状态
  lastSearchState.value = { ...searchFormModel.value }
  // 执行搜索逻辑
  const sendParams = {
    ...searchFormModel.value,
    page: currentPage.value,
    size: pageSize.value,
    // ownerUserId: props.ownerUserId
    ownerUserId: props.originOwnerUserId
  }
  getWebSiteInfo(sendParams).then((res) => {
    if (res.success) {
      const { list } = res.data
      tableList.value = list
      total.value = Number(res.data.total)
      // 接口完成放开注释 インタフェースを完了したら、注釈を取り除きます。
    } else if (sendParams.ownerUserId == '') {
      total.value = 0
      tableList.value = []
    } else {
      console.error('res.errMessage', res.errMessage)
      /*  ElMessage({
        showClose: true,
        message: res.errMessage,
        type: 'error'
      }) */
    }
  })
}
// 如果需要重置表单
function resetSearchForm() {
  searchFormModel.value = initSearchFormModel()
  // 重置时也要更新上一次搜索状态
  lastSearchState.value = { ...searchFormModel.value }
  haveToResetCurrentPage = true
  currentPage.value = 1
  handleSearch()
}
const fetchData = inject('fetchData') as (params: any) => void
const searchModel = inject<Ref<any>>('searchModel')
const handleBindWebsite = (websiteId: string) => {
  // 完了したら、タブ１へ移動致します。
  setBingWebSite({ domain: props.domain, websiteId })
    .then((res) => {
      // console.log('res', res)
      if (res.success) {
        ElMessage({
          message: '绑定完成',
          type: 'success',
          duration: 2000 // 显示时间，单位为毫秒
        })
        // emit('updateActiveTab', props.domain)
        emit('updateActiveTab', props.domain)
      } else {
        ElMessage({
          message: '绑定失败',
          type: 'error',
          duration: 2000 // 显示时间，单位为毫秒
        })
      }
    })
    .catch((err) => {
      console.error('err', err)
    })
    .finally(() => {
      // 修改结束，更新Table
      if (searchModel) {
        fetchData({ size: 15, page: 1, ...searchModel.value })
      } else {
        fetchData({ size: 15, page: 1 })
      }
    })
}

const querySearchOwnerUserId = async (queryString: string, cb: (arg: any) => void) => {
  reqUserList({ searchId: queryString, ...initBigPageObj() })
    .then((res) => {
      // console.log('res', res)
      if (res.success) {
        const results = res.data.list.map((item: any) => ({
          value: item.userId, // 这个 value 属性是必须的，用于显示在输入框中
          // 可以添加其他需要的属性
          label: item.loginId,
          prop: item.userId
        }))
        cb(results)
      } else {
        cb([])
      }
    })
    .catch((error) => {
      console.error('Error fetching domain suggestions:', error)
      ElMessage.error('获取用户id时出错')
      cb([])
    })
}
const querySearchWebsiteId = async (queryString: string, cb: (arg: any) => void) => {
  setWebSiteListId({
    websiteId: queryString,
    ownerUserId: props.originOwnerUserId,
    ...initBigPageObj()
  })
    .then((res) => {
      // console.log('res', res)
      if (res.success) {
        const results = res.data.map((item: any) => ({
          value: item, // 这个 value 属性是必须的，用于显示在输入框中
          // 可以添加其他需要的属性
          label: item,
          prop: item
        }))
        cb(results)
      } else {
        cb([])
      }
    })
    .catch((error) => {
      console.error('Error fetching domain suggestions:', error)
      ElMessage.error('获取站点id时出错')
      cb([])
    })
}

const querySearchTemplateRef = async (queryString: string, cb: (arg: any) => void) => {
  const query: IReqListBlurTemplateAndSketchCodeQueryParams = {
    manageSiteId: manageSite.manageSiteId,
    templateId: queryString,
    // ownerUserId: props.originOwnerUserId,
    ...initBigPageObj()
  }
  reqListBlurTemplateAndSketchCode(query)
    // getTemplateIdList({ templateId: queryString, ownerUserId: props.originOwnerUserId })
    .then((res) => {
      if (res.success) {
        const results = res?.data?.map((item: any) => ({
          value: item.templateId, // 这个 value 属性是必须的，用于显示在输入框中
          // 可以添加其他需要的属性
          label: item.templateName
        }))
        cb(results)
      } else {
        cb([])
      }
    })
    .catch((error) => {
      console.error('Error fetching domain suggestions:', error)
      ElMessage.error('获取用户id时出错')
      cb([])
    })
}
onMounted(() => {
  // console.log('props.dialogHeight',props.dialogHeight);
  // リストをリクエストします
  pageSize.value = 5
  currentPage.value = 1
  handleSearch()
  console.log('props.originOwnerUserId', props.originOwnerUserId)

  getWebSiteInfo({
    page: currentPage.value,
    size: pageSize.value,
    ownerUserId: props.originOwnerUserId
  }).then((res) => {
    // console.log('res', res)
    if (res.success) {
      const { list } = res.data
      tableList.value = list
      total.value = Number(res.data.total)
      // 接口完成放开注释 インタフェースを完了したら、注釈を取り除きます。
    }
  })
})
</script>
<style lang="less" scoped>
.search-btn {
  display: inline-flex;
  margin-right: 32px;
  vertical-align: middle;
}
.el-form--inline .el-form-item {
  // display: inline-flex;
  margin-right: 10px;
  // vertical-align: middle;
}
</style>
