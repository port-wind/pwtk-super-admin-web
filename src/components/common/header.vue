<template>
  <div id="header">
    <div class="top">
      <div style="display: flex; align-items: center">
        <Fold @click="toggleClick" v-if="isunfold" style="width: 20px; cursor: pointer" />
        <Expand @click="toggleClick" v-else style="width: 20px; cursor: pointer" />
        <el-breadcrumb separator="/" style="margin-left: 5px">
          <div v-if="levelList.length < 1">{{ isLang }}</div>
          <el-breadcrumb-item v-for="item in levelList" :key="item.path">
            <div>{{ item }}</div>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="display: flex; margin-right: 20px">
        <el-dropdown trigger="click">
          <div class="avatar">
            <div class="img">{{ userInfo.username ? userInfo.username.substring(0, 1) : '' }}</div>
            {{ userInfo.username }}
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="setAccount(ruleFormRef)">
                {{ t('com.AccountSettings') }}
              </el-dropdown-item>
              <el-dropdown-item @click="logout">{{ t('com.Successfullyset') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <TagsView />
    <!-- <div>{{ levelList }}</div>
    <div div>{{ isLang }}</div> -->
  </div>
  <el-dialog v-model="dialogFormVisible" :title="t('com.AccountSettings')">
    <el-form :model="userInfo" ref="ruleFormRef" status-icon label-width="auto" :rules="rules">
      <el-form-item :label="t('login.userName')">
        <el-input v-model="userInfo.username" disabled clearable />
      </el-form-item>
      <el-form-item :label="t('login.editpassWord')" prop="password">
        <el-input v-model="userInfo.password" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('login.confirmPassword')" prop="password1">
        <el-input v-model="userInfo.password1" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('table.mobilePhoneNumber') + ' :'">
        <MobileCountry style="width: 300px" v-model:mobile-country-code="userInfo.cc" v-model:mobile="userInfo.phone" />
      </el-form-item>
      <el-form-item :label="t('pop.secretkey')">
        <div class="secret-key">
          <div class="one">
            <el-input disabled class="onee" v-model="userInfo.googleSercet"></el-input>
          </div>
          <div class="two">
            <el-button @click="getSecret">{{ t('pop.getsecretkey') }}</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="t('table.qrcode')" v-if="showQrcode">
        <div class="QR-code">
          <div>
            <qrcode-vue :value="userInfo.payUrl" :size="128" level="H" />
          </div>
          <p>{{ t('pop.ScanQRcode') }}</p>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer dialog-footer-submit">
        <el-button @click="cancellation">{{ t('button.cancel') }}</el-button>
        <el-button type="primary" @click="confirm(ruleFormRef)">
          {{ t('button.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { reqSystemUserEdit } from '@/api/system/account/index'
import { reqGoogle } from '@/api/system/account/index'
import { reqLogout } from '@/api/login/index'
import type { IMenuOption } from '@/stores/menulist'
import { useMenuListStore } from '@/stores/menulist'
import { accountInfo } from '@/api/index'
import { useTagViewStore } from '@/stores/tagview'
import QrcodeVue from 'qrcode.vue'
import type { FormRules, FormInstance } from 'element-plus'
import Cookies from 'js-cookie'
import { sessionCache } from '@/hooks/useSession'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
const tagview = useTagViewStore()
const emit = defineEmits(['toggleClick'])
const isunfold = ref(true)
interface BreadcrumbItem {
  path: string
  meta: {
    title: string
  }
}

const levelList = ref<BreadcrumbItem[]>([])
//弹出框中 表单的头部宽度
const formLabelWidth = '240px'
//控制弹出框显示
const dialogFormVisible = ref(false)
const menuliststore = useMenuListStore()
const userInfo = reactive({
  cc: '',
  googleSercet: '',
  password: '',
  password1: '',
  id: 0,
  phone: '',
  username: '',
  payUrl: ''
})
const phoneClone = ref('')
const ccClone = ref('')
//校验规则
const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}
const validatePass1 = (rule: any, value: any, callback: any) => {
  if (value !== userInfo.password) {
    callback(new Error(t('input.Passwordinconsistency')))
  } else {
    callback()
  }
}
const validateIphon = (rule: any, value: any, callback: any) => {
  let pwdRegex = new RegExp('^[0-9]*$')

  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.Pleasenternumbers')))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  password: [{ validator: validatePass, trigger: 'blur' }],
  password1: [{ validator: validatePass1, trigger: 'blur' }],
  phone: [{ validator: validateIphon, trigger: 'blur' }]
})
//是否显示微信二维码
const showQrcode = ref(false)
const phoneselect = (phone) => {
  userInfo.cc = phone
}
let route = useRoute()
// export interface IMenu {
//   name: string
//   index: string
//   path: { path: string }
//   children?: IMenu[]
// }
const isLang = ref<string>()
isLang.value =
  localStorage.getItem('language') == 'en' ? 'HomePage' : localStorage.getItem('language') == 'zh-cn' ? '首页' : '首頁'
const menulist = ref<IMenuOption[]>([])

// 面包屑
const getBreadcrumb = () => {
  levelList.value = []
  for (let item of route.matched) {
    if (item.meta && item.meta.title) {
      levelList.value.push(t(item.meta.title))
    }
  }
}

//弹出框表单 取消按钮
const cancellation = () => {
  dialogFormVisible.value = false
}
//表单校验
const ruleFormRef = ref<FormInstance>()
//弹出框表单 确认按钮
const confirm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      try {
        const res = await reqSystemUserEdit({
          id: userInfo.id,
          cc: userInfo.cc,
          phone: userInfo.phone,
          googleSecret: userInfo.googleSercet,
          password: userInfo.password
        })

        if (res.success) {
          ElMessage({
            message: t('com.Successfullyset'),
            type: 'success'
          })

          const infoRes = await accountInfo()
          if (infoRes.success) {
            const { cc, googleSercet, id, phone, username } = infoRes.data
            Object.assign(userInfo, { cc, googleSercet, id, phone, username })
            phoneClone.value = phone
            ccClone.value = cc
          }
        } else {
          ElMessage({
            message: res.errMessage,
            type: 'error'
          })
        }

        dialogFormVisible.value = false
      } catch (error) {
        console.error('验证或提交失败:', error)
      }
    } else {
      throw new Error('表单验证失败')
    }
  })
}

//账号设置
const setAccount = (ruleFormRef) => {
  userInfo.password = ''
  userInfo.password1 = ''
  userInfo.phone = phoneClone.value
  userInfo.cc = ccClone.value
  userInfo.googleSercet = ''
  showQrcode.value = false
  dialogFormVisible.value = true

  phoneValue.value = userInfo.cc
  if (ruleFormRef) {
    ruleFormRef.clearValidate()
  }
  // 更新国际区号
  // if (phoneValueRef.value) {
  //   phoneValueRef.value.doUpdateValue(userInfo.cc)
  // }
}

//获取密钥
const getSecret = async () => {
  let obj = {
    accountId: userInfo.id,
    cc: userInfo.cc,
    phone: userInfo.phone
  }
  let res = await reqGoogle(obj)
  userInfo.googleSercet = res.data.googleSecret
  userInfo.payUrl = res.data.qrCode
  showQrcode.value = true
}

getBreadcrumb()

// 获取个人信息
const getUserInfo = () => {
  accountInfo().then((res) => {
    if (res.success) {
      sessionCache.setCache('userID', res.data.id)
      let data = res.data
      userInfo.cc = data.cc
      userInfo.googleSercet = data.googleSercet
      userInfo.id = data.id
      userInfo.phone = data.phone
      userInfo.username = data.username
      phoneClone.value = data.phone
      ccClone.value = data.cc
      menuliststore.roleIds = data.roleIds
    }
  })
}
watch(route, () => {
  getBreadcrumb()
})

const timer = ref()
const imState = ref(1)
onMounted(() => {
  getUserInfo()
  // 定时刷新IM状态
  timer.value = setInterval(() => {
    imState.value = Number(Cookies.get('state'))
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})
//g国际电话号
const phoneValueRef = ref(null)
const phoneValue = ref('')
// 选中国际区号的值
const phoneCode = (val) => {
  userInfo.cc = val
  phoneValue.value = val
}
// 展开收缩
const toggleClick = () => {
  isunfold.value = !isunfold.value
  emit('toggleClick', isunfold.value)
}
const router = useRouter()
//退出登录
const logout = async () => {
  let res = await reqLogout()
  if (res.success) {
    ElMessage({
      message: t('com.Successfullyset'),
      type: 'success'
    })
    tagview.settags([])
    Cookies.remove('token') // 只移除 token，路由守卫会处理其他清理
    router.push('/login')
  }

  // try {
  //   let res = await reqLogout()
  //   Cookies.remove('token')
  //   Cookies.remove('cid')
  //   Cookies.remove('state')
  //   localStorage.removeItem('imgUrl')
  //   localStorage.removeItem('last_bbs_post_content')
  //   if (res.success) {
  //     ElMessage({
  //       message: t('com.Successfullyset'),
  //       type: 'success'
  //     })
  //     tagview.settags([])
  //     router.push('login')
  //   }
  // } catch (error) {

  // } finally {
  //   tagview.settags([])
  //   Cookies.remove('token')
  //   Cookies.remove('cid')
  //   Cookies.remove('state')
  //   localStorage.removeItem('imgUrl')
  //   router.push('login')
  // }
}
</script>
<style lang="less" scoped>
:deep(.el-input__wrapper) {
  width: 120px;
}

.el-input {
  width: 300px;
}

.secret-key {
  display: flex;

  .one {
    .onee {
      width: 200px;
      margin-right: 10px;
    }
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
      width: 150px;
    }
  }
}

#header {
  display: block !important;
  .top {
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 20px;
  }
}

.avatar {
  display: flex;
  align-items: center;
  cursor: pointer;

  .img {
    width: 36px;
    height: 36px;
    border-radius: 30px;
    background-color: aquamarine;
    margin-right: 5px;
    color: #ffffff;
    text-align: center;
    line-height: 32px;
    font-size: 28px;
  }
}
</style>
