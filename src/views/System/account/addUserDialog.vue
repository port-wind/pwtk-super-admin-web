<template>
  <el-dialog v-model="rulesDialogVisible" class="tabs-dialog" destroy-on-close @closed="onClosed">
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane :label="currentUserId ? '更新用户' : '新增用户'" name="template_detail" class="m_tabs_pane">
        <el-form class="single-form" :model="queryForm" ref="ruleFormRef" status-icon :rules="getRules">
          <el-form-item label="用户名" prop="username">
            <el-input maxlength="16" v-model="queryForm.username" auto-complete="off" :disabled="!!currentUserId" />
          </el-form-item>
          <el-form-item :label="currentUserId ? t('login.editpassWord') : t('login.passWord') + ' :'" prop="password">
            <el-input v-model="queryForm.password" type="password" auto-complete="off" show-password />
          </el-form-item>
          <el-form-item :label="t('login.confirmPassword') + ' :'" prop="passwordRety">
            <el-input v-model="queryForm.passwordRety" type="password" show-password />
          </el-form-item>
          <el-form-item :label="t('pop.systemIdentity') + ' :'">
            <div class="checked">
              <el-checkbox v-model="checkAll" @change="handleCheckAllChange" :indeterminate="isIndeterminate">
                {{ t('input.SelectAll') }}
              </el-checkbox>
              <el-checkbox-group v-model="queryForm.roleIds" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="role in rolesList" :key="role" :label="role">
                  {{ role }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item :label="t('table.mobilePhoneNumber') + ' :'" prop="phone">
            <MobileCountry
              style="width: 300px"
              v-model:mobile-country-code="queryForm.cc"
              v-model:mobile="queryForm.phone"
            />
          </el-form-item>
          <el-form-item :label="t('pop.secretkey') + ' :'" v-if="currentUserId">
            <div class="secret-key">
              <div class="one">
                <el-input disabled class="onee" v-model="currentGoogleSecret"></el-input>
              </div>
              <div class="two">
                <el-button @click="getSecret">{{ t('pop.getsecretkey') }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item :label="t('table.qrcode') + ' :'" v-if="showQrcode">
            <div class="QR-code">
              <div>
                <qrcode-vue :value="qrCode" :size="128" level="H" />
              </div>
              <p>{{ t('pop.ScanQRcode') }}</p>
            </div>
          </el-form-item>
        </el-form>
        <div class="submit-wrapper" v-if="showSubmitBar">
          <div class="btn">
            <el-button @click="rulesDialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="isSumitFormLoading" @click="submitForm(ruleFormRef)">提交</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import i18n from '@/i18n'
const { t } = i18n.global as any
import { ElMessage, type CheckboxValueType, type FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { reqRoleDAll } from '@/api/system/roles/index'
import type { InternalRuleItem } from '@/components/mForm/rule'
import QrcodeVue from 'qrcode.vue'
import { reqGoogle, reqSystemUserAccountList, reqSystemUserCreate, reqSystemUserEdit } from '@/api/system/account'
import type {
  IReqGoogleQueryParams,
  IReqSystemUserAccountListData,
  IReqSystemUserAccountListQueryParams,
  IReqSystemUserCreateQueryParams,
  IReqSystemUserEditQueryParams
} from '@/api/system/account/types'
import showErrorMessage from '@/utils/showErrorMessage'

const emits = defineEmits(['onClose'])
const ruleFormRef = ref<FormInstance>()
const isSumitFormLoading = ref(false)
const activeTab = ref('template_detail')
const rulesDialogVisible = ref(false)
const currentUserId = ref<number>()
const passwordRety = ref('')
const showSubmitBar = computed(() => {
  return activeTab.value === 'template_detail'
})

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
//控制弹出框表单 身分 是否全选
const checkAll = ref(false)
//弹出框中  哪些系统身份被勾选
const checkedCities = ref<string[]>()
//弹出框中  有哪些系统身份
const rolesList = ref<string[]>()

//弹出框中  点击全选的回调
const isIndeterminate = ref(false)
const handleCheckAllChange = (val: CheckboxValueType) => {
  queryForm.roleIds = val ? rolesList.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === rolesList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < rolesList.value.length
}

//账号状态
const accountState = ref()
//是否显示微信二维码
const showQrcode = ref(false)
const currentGoogleSecret = ref()
const qrCode = ref()
//获取密钥
const getSecret = async () => {
  if (!queryForm.cc) {
    ElMessage({
      type: 'warning',
      message: '请选择国家手机区号'
    })
    return
  }
  if (!queryForm.phone) {
    ElMessage({
      type: 'warning',
      message: '请添加手机号'
    })
    return
  }
  let data: IReqGoogleQueryParams = {
    accountId: currentUserId.value?.toString()!,
    cc: queryForm.cc,
    phone: queryForm.phone
  }
  console.log(data)
  let res = await reqGoogle(data)
  if (res.success) {
    ElMessage({
      message: t('pop.getsecretkey') + t('errorCode.0'),
      type: 'success'
    })
    currentGoogleSecret.value = res.data?.googleSecret
    qrCode.value = res.data?.qrCode
    showQrcode.value = true
  } else {
    showErrorMessage(res)
  }
}

const onClosed = () => {
  resetForm()
  emits('onClose')
  rulesDialogVisible.value = false
}

const checkUsernameExsit = (rule: InternalRuleItem, value: any, callback: (error?: string | Error) => void) => {
  // 编辑
  if (currentUserId.value) {
    callback()
  } else {
    if (value) {
      // 新增
      const query: IReqSystemUserAccountListQueryParams = {
        page: 1,
        size: 15,
        username: value
      }
      reqSystemUserAccountList(query).then((res) => {
        if (res.success) {
          if (res.data.list.length > 0) {
            callback(new Error('用户名已经存在'))
          } else {
            callback()
          }
        }
      })
    }
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  // 编辑
  if (currentUserId.value) {
    if (queryForm.passwordRety) {
      if (queryForm.password !== queryForm.passwordRety) {
        callback(new Error('两次密码不一致'))
      }
    }
  } else {
    // 新增
    if (!value) {
      callback(new Error('请输入密码'))
    }
  }
  callback()
}

const validatePassRety = (rule: any, value: any, callback: any) => {
  // 编辑
  if (currentUserId.value) {
    if (value) {
      if (queryForm.password !== queryForm.passwordRety) {
        callback(new Error('两次密码不一致'))
      }
    }
  } else {
    // 新增
    if (queryForm.password !== queryForm.passwordRety) {
      callback(new Error('两次密码不一致'))
    }
  }
  callback()
}

const getRules = computed(() => {
  return currentUserId.value ? editRules : newRules
})

const newRules = reactive({
  username: [
    { required: true, message: '用户名不能为空' },
    {
      validator: checkUsernameExsit
    }
  ],
  password: [{ required: true, message: '密码不能为空' }, { validator: validatePass }],
  passwordRety: [{ required: true, message: '请再次输入密码' }, { validator: validatePassRety }],
  phone: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          callback()
        } else {
          if (value.length > 10) {
            callback(new Error('最多10位电话号码'))
          } else {
            callback()
          }
        }
      }
    }
  ]
})

const editRules = reactive({
  password: [
    {
      validator: {
        validator: (rule: any, value: any, callback: any) => {
          if (value) {
            if (queryForm.passwordRety) {
              if (value === queryForm.passwordRety) {
                callback()
              } else {
                callback(new Error('两次密码不一致'))
              }
            } else {
              //
              callback(new Error('请再次输入密码'))
            }
          } else {
            callback()
          }
        }
      }
    }
  ],
  passwordRety: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (queryForm.password) {
          if (!value) {
            // 请再次输入密码
            callback(new Error('请再次输入密码'))
          } else {
            if (value === queryForm.password) {
              callback()
            } else {
              callback(new Error('两次密码不一致'))
            }
          }
        } else {
          callback()
        }
      }
    }
  ],
  phone: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (!value) {
          callback()
        } else {
          if (value.length > 10) {
            callback(new Error('最多10位电话号码'))
          } else {
            callback()
          }
        }
      }
    }
  ]
})

const initQueryForm = (): IReqSystemUserCreateQueryParams => ({
  username: '',
  password: '',
  cc: '',
  phone: '',
  roleIds: [],
  passwordRety: ''
})

const queryForm = reactive<IReqSystemUserCreateQueryParams>(initQueryForm())

const resetForm = () => {
  ruleFormRef.value?.resetFields()
  currentUserId.value = undefined
  currentGoogleSecret.value = ''
  qrCode.value = ''
  showQrcode.value = false
  Object.assign(queryForm, initQueryForm())
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isSumitFormLoading.value = true
        let res
        // update template
        if (currentUserId.value) {
          // 更新
          const queryEdit: IReqSystemUserEditQueryParams = {
            ...queryForm,
            id: currentUserId.value,
            phone: queryForm.phone
          }
          if (!queryEdit.password) {
            delete queryEdit.password
          }

          if (currentGoogleSecret.value === queryEdit.googleSecret) {
            delete queryEdit.googleSecret
          }

          delete queryEdit.passwordRety
          res = await reqSystemUserEdit(queryEdit)
        } else {
          //创建
          const query: IReqSystemUserCreateQueryParams = {
            ...queryForm
          }

          delete query.passwordRety
          res = await reqSystemUserCreate(query)
        }
        if (res.success) {
          ElMessage({
            message: currentUserId.value ? '更新成功' : '已添加',
            type: 'success'
          })
          // 关闭dailog
          rulesDialogVisible.value = false
          activeTab.value = 'template_detail'
          resetForm()
        } else {
          ElMessage({
            message: res.errMessage,
            type: 'error'
          })
        }
      } catch (error) {
        ElMessage({
          message: '提交出错',
          type: 'error'
        })
      } finally {
        isSumitFormLoading.value = false
      }
    } else {
      console.info('error submit!', fields)
    }
  })
}

const openDailog = (row?: IReqSystemUserAccountListData) => {
  rulesDialogVisible.value = true
  activeTab.value = 'template_detail'
  getRolesAll()
  if (row?.id) {
    Object.assign(queryForm, row)
    queryForm.phone = row.originPhone
    currentGoogleSecret.value = row.googleSecret
    currentUserId.value = row.id
    if (row?.roleIds?.length > 0) {
      isIndeterminate.value = true
    }
  } else {
    resetForm()
    currentUserId.value = undefined
  }
}
export interface IExpose {
  openDailog: (row?: IReqSystemUserAccountListData) => void
}
// 分发方法
defineExpose<IExpose>({
  openDailog
})

const fetchData = async (siteId) => {
  // isLoading.value = true
  // try {
  //   // getClientWebsiteConfig
  //   const query: IReqAdvertisementGetOneQueryParams = {
  //     siteId
  //   }
  //   // get tempalte detail getTemplateInfoByTemplateId
  //   const res = await reqAdvertisementGetOne(query)
  //   if (res.success && res.data) {
  //     Object.assign(queryForm, res.data)
  //     createTime.value = res.data?.createTime
  //     currentUserId.value = res.data.siteId
  //     currentSiteName.value = res.data.siteName
  //   } else {
  //     ElMessage({
  //       type: 'warning',
  //       message: '数据读取失败'
  //     })
  //   }
  // } catch (error) {
  //   console.error(error)
  // } finally {
  //   isLoading.value = false
  // }
}

const getRolesAll = async () => {
  let res = await reqRoleDAll()
  if (res.success) {
    rolesList.value = res.data?.roles
  }
}
</script>

<style lang="less" scoped>
.input-sitename {
  width: 100%;
}

.template_id_text {
  display: flex;
  justify-content: center;
}

.submit-wrapper {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0;
}

//  custom-tabs-dialog
.custom-tabs-dialog {
  margin-top: 80px;
  padding: 10px;
  height: calc(100vh - 8.5rem);
  width: 78%;
  position: relative;
  border-radius: 0.6rem;
}

.custom-tabs-dialog .el-dialog__header {
  padding: 0;
  position: absolute;
  right: -15px;
  top: -15px;
  z-index: 1;
  border-radius: 100%;
  background: #e4e7ed;
  height: 40px;
  width: 40px;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn {
  height: 40px;
  width: 40px;
  line-height: 1;
}

.custom-tabs-dialog .el-dialog__header .el-dialog__headerbtn .el-dialog__close {
  color: red;
}

.custom-tabs-dialog .el-dialog__body {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.custom-tabs-dialog .el-dialog__body .el-tabs {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;
}

.custom-tabs-dialog .el-dialog__body .el-tabs .el-tabs__content {
  flex: 1;
  overflow-y: auto;
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
      margin-right: 10px;
    }
  }
}

.single-form {
  flex: 1;
  overflow: auto;
}

.is-no-required .el-form-item__label::before {
  color: white !important;
}
</style>
