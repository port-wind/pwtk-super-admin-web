<template>
  <div id="login">
    <SwithLanguage />
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="@/assets/images/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <h1 class="login_title">{{ t('login.titleName') }}</h1>
      <h1 class="login_title">{{ t('login.title') }}</h1>
      <h2 class="login_title">version: {{ version }}</h2>
      <el-form
        label-width="66px"
        class="login_form"
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
      >
        <!-- 用户名 -->
        <el-form-item :label="t('login.userName')" prop="username">
          <el-input v-model="ruleForm.username" type="text" :placeholder="t('login.inputName')"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item :label="t('login.passWord')" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            show-password
            :placeholder="t('login.inputPass')"
          ></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item :label="t('login.code')" prop="googleToken">
          <el-input
            v-model="ruleForm.googleToken"
            type="text"
            oninput="value=value.replace(/[^\d]/g,'')"
            :maxlength="8"
            :placeholder="t('login.inputCode')"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-row justify="end">
          <el-form-item class="login_btn">
            <el-button type="primary" @click="doLogin(ruleFormRef)">
              {{ t('login.loginBtn') }}
            </el-button>
            <el-button type="info" @click="resetForm(ruleFormRef)">
              {{ t('login.reset') }}
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="contact_admin">
      <span @click="contactAdmin()">{{ t('login.contactAdmin') }}</span>
    </div>
    <!-- 联系管理员 -->
    <div class="contact-dialog">
      <el-dialog v-model="dialogVisible" :title="t('login.contactAdmin')" width="500">
        <div>
          <p>
            Phone:
            <a href="javascript:void(0);" @click="copyInfo(contactList.phone, 'Phone')">
              {{ contactList.phone }}
            </a>
          </p>
          <p>
            Whatsapp:
            <a href="javascript:void(0);" @click="copyInfo(contactList.whatsapp, 'Whatsapp')">
              {{ contactList.whatsapp }}
            </a>
          </p>
          <p>
            Facebook:
            <a href="javascript:void(0);" @click="copyInfo(contactList.facebook, 'Facebook')">
              {{ contactList.facebook }}
            </a>
          </p>
          <p>
            Instagram:
            <a href="javascript:void(0);" @click="copyInfo(contactList.instagram, 'Instagram')">
              {{ contactList.instagram }}
            </a>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserInfoStore } from '@/stores/userinfo'
import { useI18n } from 'vue-i18n'
import SwithLanguage from '@/components/switchLanguage/index.vue'
import { FormInstance, FormRules, ElMessageBox } from 'element-plus'
import uuid from '@/utils/uuid/uuid'
import encryptMD5 from '@/utils/encryption/encryptMD5'
const { t } = useI18n()
const { version } = webConfigApi
const ruleFormRef = ref<FormInstance>()
//获取用户小仓库
const userInfoStore = useUserInfoStore()
//获取路由器对象
const route = useRoute()
const router = useRouter()
const dialogVisible = ref(false)
const contactList = reactive({
  phone: '',
  whatsapp: '',
  facebook: '',
  instagram: ''
})

//重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 校验
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('login.nameCheck')))
  } else {
    callback()
  }
}
const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}
const validateCode = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error(t('login.codeCheck')))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  username: '',
  password: '',
  salt: '',
  // cid: uuid,
  cid: 86,
  imageCode: '111111',
  googleToken: ''
})
const rules = reactive<FormRules>({
  username: [{ validator: validateName, trigger: 'blur' }],
  password: [{ validator: validatePass, trigger: 'blur' }],
  // code: [{ validator: validateCode, trigger: 'blur' }]
  googleToken: [{ validator: validateCode, trigger: 'blur' }]
})
// 登录
const doLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      try {
        // ruleForm.salt = new Date().getTime() + ''
        ruleForm.salt = '1234'
        let password = encryptMD5(encryptMD5(ruleForm.password) + ruleForm.salt)
        userInfoStore.login(
          {
            username: ruleForm.username,
            password: password,
            googleToken: ruleForm.googleToken,
            cid: ruleForm.cid,
            salt: ruleForm.salt
          },
          router,
          route
        )
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log('error submit!')
      // return false
    }
  })
}
// 联系管理员
const contactAdmin = () => {
  contactList.phone = webConfigApi ? webConfigApi.phone : ''
  contactList.whatsapp = webConfigApi ? webConfigApi.whatsapp : ''
  contactList.facebook = webConfigApi ? webConfigApi.facebook : ''
  contactList.instagram = webConfigApi ? webConfigApi.instagram : ''
  dialogVisible.value = true
}
// 点击复制
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
const copyInfo = async (val, name) => {
  try {
    await toClipboard(val.toString())
    ElMessage.success(name + t('pop.ReplicatingSuccess'))
  } catch (e) {
    ElMessage.warning(t('pop.Yoursupportcopying') + ':', e)
  }
}
onMounted(() => {
  document.onkeydown = function (e) {
    // 回车提交表单
    // 兼容FF和IE和Opera
    let theEvent: any = window.event || e
    let code = theEvent.keyCode || theEvent.which || theEvent.charCode
    if (code == 13) {
      doLogin(ruleFormRef.value)
    }
  }
})
</script>

<style lang="less" scoped>
#login {
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
  .login_box {
    // 宽500像素
    width: 500px;
    // 高400像素
    height: 400px;
    // 背景颜色
    background-color: #fff;
    // 圆角边框3像素
    border-radius: 3px;
    // 绝对定位
    position: absolute;
    // 距离左则50%
    left: 50%;
    // 上面距离50%
    top: 50%;
    // 进行位移，并且在横轴上位移-50%，纵轴也位移-50%
    transform: translate(-50%, -50%);

    .avatar_box {
      // 盒子高度120像素
      height: 120px;
      // 宽度120像素
      width: 120px;
      // 边框线1像素 实线
      border: 1px solid #eee;
      // 圆角
      // border-radius: 50%;
      // 内padding
      // padding: 10px;
      // 添加阴影 向外扩散10像素 颜色ddd
      box-shadow: 0 0 10px #ddd;
      // 绝对定位
      position: absolute;
      // 距离左则
      left: 50%;
      // 位移
      transform: translate(-50%, -50%);
      // 背景
      // background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        // border-radius: 50%;
        // background-color: #eee;
      }
    }
  }
  .login_title {
    color: #2c3e50;
    position: relative;
    top: 20%;
    text-align: center;
    font-weight: bolder;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 40px 0 30px;
    box-sizing: border-box;
  }

  .login_btn {
    // 设置弹性布局
    display: flex;
    // 横轴上尾部对齐
    justify-content: flex-end;
  }
  .admin {
    width: 80px;
    height: 20px;
    color: #b9e90d;
    position: fixed;
    right: 0px;
    bottom: 10px;
  }
  .contact_admin {
    position: absolute;
    right: 15px;
    bottom: 15px;
    color: white;
    font-size: 20px;

    span {
      border-bottom: 2px solid;
      padding-bottom: 3px;
    }
  }
  .contact-dialog {
    div {
      p {
        display: block;
        font-size: 18px;
        line-height: 40px;
        text-align: center;
        a {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
: any: { toString: () => string }: string
