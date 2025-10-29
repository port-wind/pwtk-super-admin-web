<template>
  <!-- 注册用户tab页面 -->
  <el-dialog
    draggable
    overflow
    destroy-on-close
    v-model="isVisible"
    @update:model-value="updateVisibility"
    class="tabs-dialog"
    :close-on-click-modal="false"
    @close="closeTabs"
    @open="openReq"
  >
    <el-tabs v-model="activeTab" class="m_tabs" @tab-click="handleClick">
      <el-tab-pane class="m_tabs_pane" label="账户信息" name="tab1" :stretch="true">
        <AccountInfo
          v-if="accountInfo"
          :accountInfo="accountInfo"
          :display-handle-button="modalData.showCommitButton"
          @close-tabs="closeTabs"
        ></AccountInfo>
        <!-- :isAccountInfoDisplay="true" -->
      </el-tab-pane>
      <!-- :displayHandleButton="isAccountInfoDisplay" -->
      <el-tab-pane :lazy="true" label="积分明细" name="points">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <Points :accountInfo="accountInfo"></Points> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="星星明细" name="stars">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <Stars :accountInfo="accountInfo"></Stars> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的勋章" name="achievementShow">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <AchievementShow :accountInfo="accountInfo"></AchievementShow> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的收藏" name="favoriteList">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <FavoriteList
          ref="favoriteListRef"
          :accountInfo="accountInfo"
        ></FavoriteList> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的点赞" name="likeList">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <LikeList
          ref="likeListRef"
          :accountInfo="accountInfo"
        ></LikeList> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的关注" name="followerList">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <followerList :accountInfo="accountInfo"></followerList> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的评论" name="userComment">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <UserComment :accountInfo="accountInfo"></UserComment> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的粉丝" name="myFans">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <Myfans :accountInfo="accountInfo"></Myfans> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的团队" name="myTeams">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <MyTeams
          ref="myTeamsRef"
          :accountInfo="accountInfo"
        ></MyTeams> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的投票" name="userVote">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <UserVote :accountInfo="accountInfo"></UserVote> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="我的访客" name="userVisiter">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <UserVisiter :accountInfo="accountInfo"></UserVisiter> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="匿名访客" name="anonymousVisiter">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <AnonymousVisiter :accountInfo="accountInfo"></AnonymousVisiter> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="浏览记录" name="browsingHistory">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <BrowsingHistory :accountInfo="accountInfo"></BrowsingHistory> -->
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="黑名单" name="blockList">
        <!-- 超管端统一处理,不限显示任何东西 -->
        <el-text size="large">没有数据</el-text>
        <!-- <BlockList
          ref="blockListRef"
          :accountInfo="accountInfo"
        ></BlockList> -->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'
import AccountInfo from './components/accountInfo.vue'
import Myfans from '@/views/User/userList/components/myFans.vue'
import Points from '@/views/User/userList/components/points/index.vue'
// import i18n from '@/i18n'
import Stars from '@/views/User/userList/components/stars/index.vue'
import { reqUserInfo } from '@/api/user/index'
import { GetUserIdResponse } from '@/api/user/type'

const emit = defineEmits(['closeEvent'])
//获取用户信息
const reqUserInfoObject = async (id) => {
  if (id) {
    try {
      let res = await reqUserInfo(id)
      if (res.success) {
        console.log('res.data', res.data)
        accountInfo.value = { ...res.data }
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  }
}

const modalsStore = useModalsStore()

interface AccountInfoProps {
  displayHandleButton?: boolean
}
const props = withDefaults(defineProps<AccountInfoProps>(), {
  displayHandleButton: true
})

// 使用 computed 属性来获取 isVisible 和 modalData 如果页面是queryLink则走不同逻辑。否则通过piana动态修改
// const isVisible = ref(true)
// 使用计算属性来获取 isVisible
/* const isVisible = computed({
  get: () => {
    return modalsStore.userInfoModal.isVisible
  },
  set: (value) => {
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      isVisible: value
    })
  }
}) */
const isVisible = computed({
  get: () => {
    if (isQueryLink.value) {
      return queryPageVisiable.value
    }
    return modalsStore.userInfoModal.isVisible
  },
  set: (value) => {
    if (isQueryLink.value) {
      queryPageVisiable.value = value
      if (!value) {
        // 当关闭对话框时，清除查询参数
        if (route.query && Object.keys(route.query).length > 0) {
          useRouter().push({ path: route.path })
        }
      }
    }
  }
})
// 使用计算属性来获取 activeTab
const activeTab = computed({
  get: () => {
    if (isQueryLink.value) {
      return queryPageActiveTab.value
    }
    return modalsStore.userInfoModal.activeTab
  },
  set: (value) => {
    if (isQueryLink.value) {
      queryPageActiveTab.value = value
    } else {
      modalsStore.setActiveTab('userInfoModal', value)
    }
  }
})
const modalData = computed(() => modalsStore.userInfoModal.modalData || {})

const accountInfo = ref<GetUserIdResponse['data'] | null>(null)
// const userId: Ref<string> = ref('')
const userId: Ref<string> = computed({
  get: () => {
    return modalsStore.userInfoModal.modalData?.userId || ''
  },
  set: (value) => {
    modalsStore.setModalData('userInfoModal', {
      ...modalsStore.userInfoModal.modalData,
      userId: value
    })
  }
})
const route = useRoute()
const isQueryLink = ref<boolean>(false)
const queryPageVisiable = ref<boolean>(false)
const queryPageActiveTab = ref<string>('tab1')
watch(
  () => route.query,
  (query) => {
    // console.log('query', query)
    if (query.userId && query.activeTab) {
      isQueryLink.value = true
      reqUserInfoObject(query.userId).then(() => {
        queryPageVisiable.value = true
        queryPageActiveTab.value = query.activeTab as string
      })
    } else {
      isQueryLink.value = false
    }
    console.log('isQueryLink', 'isvisible', isQueryLink.value, isVisible.value)
  },
  { immediate: true, deep: true }
)

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const closeTabs = () => {
  console.log('closeTabs')
  modalsStore.hideModal('userInfoModal')
  activeTab.value = 'tab1'
  accountInfo.value = null
  queryPageVisiable.value = false
  queryPageActiveTab.value = 'tab1'
  emit('closeEvent')
}

const openReq = async () => {
  userId.value = modalData.value.userId
  await reqUserInfoObject(userId.value)
}
// 添加更新可见性的方法
const updateVisibility = (value: boolean) => {
  if (value) {
    modalsStore.showModal('userInfoModal')
  } else {
    modalsStore.hideModal('userInfoModal')
  }
}
</script>
