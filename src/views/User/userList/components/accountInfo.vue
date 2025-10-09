<template>
  <!-- 用户信息编辑 -->
  <el-scrollbar>
    <el-form :model="editForm" ref="editFormRef" :rules="rulesUser" class="dialog-form">
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10" style="padding: 0 0 5px 55px">
          <div style="display: flex">
            <div class="box_avatar" style="width: 80px">
              <div class="img_avatar">
                <el-avatar v-if="avatarUrl" :size="65" :src="avatarUrl" />
                <el-avatar v-else :size="65" :icon="UserFilled" />

                <!-- <img :src="avatarUrl ? avatarUrl : ''" /> -->
              </div>
              <m-avatar
                type="image"
                ref="cropperRef"
                :btnDisabled="displayHandleButton"
                @get-response="handleUploadResponse"
                :allowTypeList="['png', 'jpg', 'jpeg']"
                :limitSize="1"
                :fixedNumber="[1, 1]"
                :previewWidth="200"
              />
            </div>
            <div>
              <el-form-item
                label="账户名称:"
                prop="loginId"
                label-width="80"
                label-position="left"
                style="margin: 3px 0 0 0"
              >
                {{ editForm.loginId }}
                <copy :content="editForm.loginId"></copy>
                <el-dropdown
                  style="margin: 0 0px 0 5px; cursor: pointer"
                  trigger="click"
                  size="small"
                  @command="stateChange"
                >
                  <span class="el-dropdown-link">
                    <el-tag v-if="editForm.gender == 'm'" class="mx-1" type="primary">男</el-tag>
                    <el-tag v-else-if="editForm.gender == 'f'" class="mx-1" type="info">女</el-tag>
                    <el-tag v-else-if="editForm.gender == 'x'" class="mx-1" type="warning">未知</el-tag>
                  </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'm' }">
                        <el-tag type="primary">男</el-tag>
                      </el-dropdown-item>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'f' }">
                        <el-tag type="info">女</el-tag>
                      </el-dropdown-item>
                      <el-dropdown-item class="mx-1" :command="{ gender: 'x' }">
                        <el-tag type="warning">未知</el-tag>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-form-item>
              <el-form-item label="ID:" prop="userId" label-width="80" style="margin: 0 0 0 0">
                {{ editForm.userId }}
                <copy :content="editForm.userId"></copy>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="会员等级:" prop="vipLevel" label-width="80" style="margin: 0 0 0 0">
                    {{ editForm.vipLevel === 0 ? '未设置' : 'VIP ' + (editForm.vipLevel ?? 0) }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" label-width="80" style="margin: 0 0 0 0; cursor: pointer">
                    <el-dropdown
                      style="margin: 0 0px 0 5px; cursor: pointer"
                      trigger="click"
                      size="small"
                      @command="talentChange"
                    >
                      <span class="el-dropdown-link">
                        <el-tag v-if="editForm.talent == '0'" class="mx-1" type="info">一般</el-tag>
                        <el-tag v-else-if="editForm.talent == '1'" class="mx-1" type="primary">高手</el-tag>
                        <el-tag v-else-if="editForm.talent == '2'" class="mx-1" type="warning">专家</el-tag>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item class="mx-1" :command="{ talent: '0' }">
                            <el-tag type="info">一般</el-tag>
                          </el-dropdown-item>
                          <el-dropdown-item class="mx-1" :command="{ talent: '1' }">
                            <el-tag type="primary">高手</el-tag>
                          </el-dropdown-item>
                          <el-dropdown-item class="mx-1" :command="{ talent: '2' }">
                            <el-tag type="warning">专家</el-tag>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="积分:"
                    prop="points"
                    label-width="80"
                    style="margin: 0 0 0 0; position: relative"
                  >
                    <!-- <span style="color: #02a7f0">
                      <span
                        @click="turnToPoints"
                        style="cursor: pointer"
                      >
                        {{ editForm.score || 0 }}
                      </span>
                    </span>
                    <el-popover
                      :visible="isEditPoints"
                      title="调整积分"
                      :width="300"
                      trigger="click"
                      placement="bottom"
                    >
                      <EditPoints
                        @close="
                          (score) => {
                            editForm.score = score
                            isEditPoints = false
                          }
                        "
                        :userInfo="editForm"
                      />
                      <template #reference>
                        <el-icon
                          @click="isEditPoints = true"
                          style="cursor: pointer; position: absolute; right: -15px"
                        >
                          <EditPen />
                        </el-icon>
                      </template>
                    </el-popover> -->
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="星星:" prop="stars" label-width="80" style="margin: 0 0 0 0">
                    <!-- <span style="color: #02a7f0">
                      <span
                        @click="turnToStars"
                        style="cursor: pointer"
                      >
                        {{ editForm.stars || 0 }}
                      </span>
                    </span> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="团队:" prop="userLevel">
            <el-popover placement="top-start" :show-after="800" trigger="hover" content="当前层级">
              <template #reference>
                <span>{{ editForm.userLevel }}</span>
              </template>
            </el-popover>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <el-popover placement="top-start" :show-after="800" trigger="hover" content="直属下级人数">
              <template #reference>
                <span>{{ editForm.directSubCnt }}</span>
              </template>
            </el-popover>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <el-popover placement="top-start" :show-after="800" :width="100" trigger="hover" content="团队总人数">
              <template #reference>
                <span>{{ editForm.totalTeamCnt }}</span>
              </template>
            </el-popover>
            <!-- {{ editForm.userLevel }} | {{ editForm.directSubCnt }} | {{ editForm.totalTeamCnt }} -->
          </el-form-item>
          <el-form-item label="注册时间 | IP:" prop="userLevel">
            {{ unitFormatDate(editForm.regTime, 'yyyy-MM-dd HH:mm:ss') }} |
            {{ !editForm.regIP ? '未知' : editForm.regIP }}
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-form-item label="用户标签:">
            <!-- <div style="max-height: 100px; overflow-y: auto">
              <el-popover
                placement="right"
                :width="600"
                :show-after="800"
                :visible="editUserTagsVisible"
              >
                <template #reference>
                  <el-button
                    round
                    size="small"
                    :icon="Edit"
                    @click="editUserTags"
                  >
                    编辑标签
                  </el-button>
                </template>
                <TagMaster
                  v-if="editUserTagsVisible"
                  @close="editUserTagsVisible = false"
                  @refresh="refreshUserTags"
                  :userId="editForm.userId"
                />
              </el-popover>

              <el-tag
                v-for="tag in editForm.tags"
                type="primary"
                round
                plain
                size="small"
                style="margin: 0 0 0 5px"
                :key="tag"
              >
                {{ tag.tagName }}
              </el-tag>
            </div> -->
          </el-form-item>
          <el-form-item label="手机号码:" prop="mobile">
            <PhoneInput
              v-if="props.accountInfo"
              v-model:mobile-country-code="editForm.mobileCountryCode"
              v-model:mobile="editForm.mobile"
            />
            <!-- <el-row style="width: 100%">
              <el-col
                :span="8"
                style="padding: 0 0px 0 0"
              >
                <selectCode
                  placeholderString="手机区号"
                  v-model="editForm.mobileCountryCode"
                ></selectCode>
              </el-col>
              <el-col :span="14">
                <el-input
                  :disabled="!isShowPhone"
                  v-model.trim="editForm.mobile"
                  style="width: 100%"
                  placeholder="请输入手机号码"
                  autocomplete="off"
                />
              </el-col>
              <el-col
                :span="2"
                style="display: flex; justify-content: flex-end; align-items: center"
              >
                <el-icon @click="viewMobile">
                  <View v-if="isShowPhone" />
                  <Hide v-else />
                </el-icon>
              </el-col>
            </el-row> -->
          </el-form-item>
          <el-form-item label="账户昵称:" prop="nickname" style="width: 100%">
            <el-input
              v-model.trim="editForm.nickname"
              placeholder="请输入账户昵称"
              autocomplete="off"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="用户状态:" prop="userStatus">
            <el-radio-group v-model="editForm.userStatus">
              <el-radio
                v-for="item in optionsUserStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户类型:" prop="userType">
            <el-radio-group v-model="editForm.userType">
              <el-radio
                v-for="item in optionsUserType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="关联账户:" prop="innerDistribution">
            <el-input
              v-model="editForm.innerDistribution"
              maxlength="30"
              style="width: 100%"
              autocomplete="off"
              placeholder="请输入关联账户"
            />
          </el-form-item>
          <el-form-item label="用户备注:" prop="userMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入用户备注"
              maxlength="200"
              :rows="2"
              v-model="editForm.userMemo"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="邮箱:" prop="email" style="width: 100% !important">
            <el-row style="width: 100%">
              <el-col :span="22">
                <el-input
                  :disabled="!isShowEmail"
                  v-model.trim="editForm.email"
                  placeholder="请输入邮箱"
                  autocomplete="off"
                  style="width: 100% !important"
                />
              </el-col>
              <el-col :span="2" style="display: flex; justify-content: flex-end; align-items: center">
                <el-icon @click="viewEmail">
                  <View v-if="isShowEmail" />
                  <Hide v-else />
                </el-icon>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="用户上级:" prop="parentId">
            <el-col :span="22">
              <SelectUserIdAndNickname
                v-show="parentEdit"
                v-model="editForm.parentId"
                id="userId"
                :group="['nickname', 'loginId']"
                placeholder="用户昵称｜帐号"
              />
              <div v-show="!parentEdit">
                <el-popover placement="top-start" :show-after="800" :width="240" trigger="hover">
                  <template #reference>
                    <p
                      v-if="!editForm.parentId || editForm.parentId == 0"
                      style="display: inline-block; height: 33.31px"
                    >
                      无上级
                    </p>
                    <p v-else style="display: inline-block; height: 33.31px">
                      {{ editForm.parentId }}
                    </p>
                  </template>
                  <template #default>
                    <template v-if="editForm?.userPath?.length == 0">无上级</template>
                    <template v-else>
                      <p v-for="(item, index) in editForm?.userPath?.slice()?.reverse()" :key="index">
                        第{{ index + 1 }}层 - {{ item }}
                      </p>
                    </template>
                  </template>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="2" style="display: flex; justify-content: flex-end; align-items: center">
              <el-icon @click="editIdutton">
                <el-icon><Edit /></el-icon>
                <!-- <View v-if="isShowEmail"/>
                  <Hide v-else/> -->
              </el-icon>
            </el-col>
            <el-popover placement="top-start" :show-after="800" :width="240" trigger="hover">
              <template #reference>
                <!-- <el-button style="width:15%" type="info" plain>路径</el-button> -->
              </template>
              <template #default>
                <template v-if="editForm?.userPath?.length == 0">无上级</template>
                <template v-else>
                  <p v-for="(item, index) in editForm?.userPath?.slice()?.reverse()" :key="index">
                    第{{ index + 1 }}层 - {{ item }}
                  </p>
                </template>
              </template>
            </el-popover>

            <!-- <el-input v-model="editForm.parentId" autocomplete="off" placeholder="请输入用户上级" /> -->
          </el-form-item>
          <el-form-item label="上级备注:" prop="upperMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入上级备注"
              maxlength="200"
              :rows="2"
              v-model="editForm.upperMemo"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="运营状态:" prop="accountType">
            <el-radio-group v-model="editForm.accountType">
              <el-radio
                v-for="item in optionsAccountType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上次登入时间 | IP:" prop="userLevel">
            {{ unitFormatDate(editForm.lastLoginTime, 'yyyy-MM-dd HH:mm:ss') }} |
            {{ !editForm.lastLoginIP ? '未知' : editForm.lastLoginIP }}
          </el-form-item>
          <el-form-item label="后台备注:" prop="sysMemo">
            <el-input
              type="textarea"
              show-word-limit
              placeholder="请输入系统备注"
              maxlength="200"
              :rows="2"
              v-model="editForm.sysMemo"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
    </el-form>
  </el-scrollbar>
  <div class="button-row" v-if="displayHandleButton">
    <el-button @click="closeHand">取消</el-button>
    <el-button type="primary" :loading="isLoading2" @click="addFormInfo(editFormRef)">提交</el-button>
  </div>
</template>
<script setup lang="ts">
import { optionsUserStatus, optionsUserType, optionsAccountType } from '@/const/options'
import {
  reqUserEdit,
  reqShowMobile,
  reqShowEmail,
  reqUserInfo,
  reqUserList,
  IReqShowMobileQueryParams
} from '@/api/user/index'
import { UserFilled } from '@element-plus/icons-vue'
import { defineEmits } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { Edit, EditPen } from '@element-plus/icons-vue'
import TagMaster from './TagMaster/index.vue'
const emit = defineEmits(['closeTabs'])
const editUserTagsVisible = ref<boolean>(false)
import mAvatar from '@/components/cropImg/cropImg.vue'
import EditPoints from './editPoints/index.vue'
import PhoneInput from './phoneInput.vue'

//上传相关
const { VITE_CDN_URL } = webConfigApi

import i18n from '@/i18n'
import { GetUserIdResponse, IAccountInfoQueryParams } from '@/api/user/type'
import { useModalsStore } from '@/stores/modalStore'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
// import { viewDepthKey } from 'vue-router'
// import { Avatar } from '@element-plus/icons-vue/dist/types'
// import { accountInfo } from '@/api'
const { t } = i18n.global as any
// //用户状态
// const { formatValue: formatUserStatus } = useOptions(optionsUserStatus)
// //用户类型
// const { formatValue: formatUserType } = useOptions(optionsUserType)
// //团队状态
// const { formatValue: formatTeamStatus } = useOptions(optionsTeamStatus)
// //账号类型
// const { formatValue: formatAccountType } = useOptions(optionsAccountType)
const modalsStore = useModalsStore()
// 父组件传参props
interface AccountInfoProps {
  accountInfo: IAccountInfoQueryParams
  displayHandleButton?: boolean
}
const props = withDefaults(defineProps<AccountInfoProps>(), {
  displayHandleButton: false
})

const editForm: any = ref<any>({})
const editFormRef = ref()
// const clipperRef = ref(null)
const isLoading2 = ref(false)
// const basicList = ref({
//   avatar_: ''
// })
const isShowPhone = ref(false)
const isShowEmail = ref(false)
const tempPhone = ref(props.accountInfo?.mobile)
const tempEmail = ref(props.accountInfo?.email)
const parentEdit = ref(false)
const imgUrl = props.accountInfo?.avatar ? VITE_CDN_URL + props.accountInfo?.avatar : ''
const avatarUrl = ref(imgUrl)
const isEditPoints = ref(false)

// function initAvatar() {
//   if (!props.accountInfo.avatar) {
//     return null
//   } else {
//     return VITE_CDN_URL + props.accountInfo.avatar
//   }
// }
// const avatarUrl = ref(initAvatar())
// const avatarUrl = computed(() => {
//   if (!props.accountInfo?.avatar) {
//     return null
//   } else {
//     return VITE_CDN_URL + props.accountInfo.avatar
//   }
// })
// const clipperData = ref({
//   type: '',
//   allowTypeList: '',
//   limitSize: '',
//   fixedNumber: '',
//   fixedNumberAider: '',
//   previewWidth: ''
// })

const validateEmail = (rule: any, value: any, callback: any) => {
  // 新的正则表达式：只能包含数字和英文字符
  let pwdRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (editForm.value.email == '') {
    callback()
  }
  if (editForm.value.email == tempEmail.value) {
    callback()
  } else {
    if (!pwdRegex.test(value)) {
      callback(new Error('请输入正确的邮箱地址'))
    } else {
      callback()
    }
  }

  // if (!pwdRegex.test(value)) {
  //     callback(new Error('请输入英文,数字,符号-,符号_组成值'));
  // } else {
  //     callback();
  // }
}

editForm.value = {
  ...props.accountInfo,
  parentId: props.accountInfo?.parentId == 0 ? '' : props.accountInfo?.parentId
}
if (editForm.value.mobileCountryCode) {
}
const rulesUser = ref({
  loginId: [{ message: '请输入账户名称', trigger: 'blur' }],
  email: [{ validator: validateEmail, message: '请输入正确的邮箱地址', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }]
  // mobileCountryCode:[{ required: true, message: '请选择手机区号', trigger: 'blur' }],
  // mobile:[]
})

watch(
  () => props.accountInfo,
  (newVal) => {
    // console.log('ac',props.accountInfo);
    if (newVal && Object.keys(newVal).length > 0) {
      editForm.value = { ...newVal }
      tempPhone.value = newVal?.mobile
      tempEmail.value = newVal?.email
      editForm.value.parentId = newVal?.parentId == 0 ? '' : newVal?.parentId
    }
  },
  { deep: true }
)
// 获取路由实例
const router = useRouter()
const route = useRoute()
const turnToPoints = () => {
  // console.log('click');
  console.log('turnToPoints', route)
  // 使用 router.push 更新路由，清空查询参数
  router.push({ path: route.path }) // 只传递路径，不传递查询参数

  modalsStore.userInfoModal.isVisible = true
  modalsStore.userInfoModal.activeTab = 'points'
}

const turnToStars = () => {
  router.push({ path: route.path }) // 只传递路径，不传递查询参数
  modalsStore.userInfoModal.isVisible = true
  modalsStore.userInfoModal.activeTab = 'stars'
}

const handleUploadResponse = async (_res) => {
  // console.log('_res', _res)
  if (_res) {
    // avatarUrl.value = VITE_CDN_URL + _res.path
    editForm.value.avatar = _res.path
    avatarUrl.value = VITE_CDN_URL + _res.path
    // console.log(editForm.value.avatar)
  }
}
const editUserTags = () => {
  editUserTagsVisible.value = true
}
const addFormInfo = async (FormRef) => {
  isLoading2.value = true
  await FormRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        const data = { ...editForm.value }
        let res = await reqUserEdit({ ...data, parentId: !!data.parentId ? data.parentId : 0 })
        if (res.success) {
          ElMessage({
            showClose: true,
            message: t('table.controls') + t('errorCode.0'),
            type: 'success'
          })
          closeHand()
          // searchButton({
          //   ...Object.assign(queryForm.value, initQueryForm()),
          //   ...Object.assign(pageObj.value, initPageObj())
          // })
          // isEditForm.value = false
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

const closeHand = () => {
  emit('closeTabs')
}
const editIdutton = () => {
  parentEdit.value = !parentEdit.value
}

const viewMobile = async () => {
  if (isShowPhone.value) {
    isShowPhone.value = false
    editForm.value.mobile = tempPhone.value
  } else {
    try {
      const query: IReqShowMobileQueryParams = {
        userId: props?.accountInfo?.userId,
        manageSiteId: manageSite?.manageSiteId
      }
      let res = await reqShowMobile(query)
      // remoteOptions.value = res.data.list
      if (res.success) {
        editForm.value.mobile = res.data
        isShowPhone.value = isShowPhone.value ? false : true
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  }
}
const viewEmail = async () => {
  if (isShowEmail.value) {
    isShowEmail.value = false
    editForm.value.email = tempEmail.value
  } else {
    try {
      let res = await reqShowEmail(props.accountInfo?.userId)
      // remoteOptions.value = res.data.list
      console.log(333)
      if (res.success) {
        editForm.value.email = res.data
        isShowEmail.value = isShowEmail.value ? false : true
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  }
}
const refreshUserTags = async () => {
  try {
    const res = await reqUserInfo(props.accountInfo?.userId)
    if (res.success && res.data) {
      editForm.value.tags = res.data.tags
    }
  } catch (error) {
    console.error(error)
  }
}

const stateChange = (row) => {
  let { gender } = row
  editForm.value.gender = gender
}
const talentChange = (row) => {
  let { talent } = row
  editForm.value.talent = talent
}
</script>

<style lang="less" scoped>
.box_avatar {
  position: relative;
  height: 6rem;

  .img_avatar {
    // width: 4rem;
    // border-radius: 4rem;
    position: absolute;
    top: 13%;
    left: 3%;
  }

  .edit_avatar {
    position: absolute;
    bottom: 0;
  }
}

#system_account .el-input__wrapper {
  max-width: 100%;
}
</style>
