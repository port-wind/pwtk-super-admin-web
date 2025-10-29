<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs class="m_tabs">
      <el-tab-pane label="设置房主" class="m_tabs_pane">
        <div class="owener-wrap">
          <!-- <OneAutocomplete
            placeholder="发布用户"
            :is-two-list="true"
            value-auto="loginId"
            name-auto="userId"
            name="searchId"
            v-model:remoteName="userId"
          ></OneAutocomplete> -->
          <UniRemoteInput
            v-model="userId"
            :search-obj="{}"
            valueKey="userId"
            labelKey="loginId"
            searchKey="userId"
            placeholder="房主"
            event-focus="focus"
            :fetchOptions="reqUserList"
            :formatLabel="(item) => (item.loginId ? `${item.loginId} - ${item.userId}` : item.userId)"
            @valueChange="handleReplyUserIdChange"
          />
          <div class="owener-item" v-if="Object.keys(userInfo).length">
            <el-row class="owener-item-header">
              <el-col :span="18">用户昵称</el-col>
              <el-col :span="6">操作</el-col>
            </el-row>
            <el-row class="owener-item-body">
              <el-col :span="18" class="owener-item-userInfo">
                <el-image :src="VITE_CDN_URL + userInfo.avatar" class="owener-item-img" />
                <span class="like-a" @click="showUserInfo">
                  {{ userInfo.loginId }}
                </span>
              </el-col>
              <el-col :span="6">
                <span class="like-a" @click="removeOwner">移除</span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="owener-footer">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="close">取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
  <UserListComponent></UserListComponent>
</template>
<script lang="ts" setup>
import { reqUserList } from '@/api/user/index'
import showErrorMessage from '@/utils/showErrorMessage'

const { VITE_CDN_URL } = webConfigApi

import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  userId: {
    type: String,
    default: () => ({})
  }
})

const isVisible = computed(() => props.isVisible)
const userId = ref('')
const userInfo = ref<any>({})

const emit = defineEmits(['callBack', 'refreshPage'])

const close = () => {
  emit('callBack')
}

const confirm = () => {
  emit('callBack', userInfo.value)
}

const getUserInfo = async () => {
  if (!userId.value) return
  try {
    const response = await reqUserList({ page: 1, size: 1, userId: userId.value })
    if (response.success) {
      userInfo.value = response.data.list[0]
      console.log('userInfo', userInfo.value)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

const removeOwner = () => {
  userInfo.value = {}
  userId.value = ''
}

const handleReplyUserIdChange = (data) => {
  if (data) {
    userInfo.value = data
    userId.value = data?.userId
  } else {
    removeOwner()
  }
}

const showUserInfo = () => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: userInfo.value.userId
  })
  modalsStore.showModal('userInfoModal')
}

onMounted(() => {
  userId.value = props.userId.toString()
  getUserInfo()
})
</script>

<style lang="less" scoped>
.owener-wrap {
  padding: 20px 100px;
  .owener-item {
    margin-top: 20px;
    .owener-item-header {
      background-color: #f2f2f2;
      padding: 8px 20px;
    }
    .owener-item-body {
      padding: 20px;
      align-items: center;
      border: 1px solid #d7d7d7;
      border-top: 0;
      .owener-item-userInfo {
        display: flex;
        align-items: center;
        .owener-item-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
    }
  }
}
.owener-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
  margin-bottom: 50px;
}
</style>
