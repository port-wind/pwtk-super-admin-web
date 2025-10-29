<template>
  <div id="system_account">
    <div class="search" ref="tableRef">
      <div class="search_left">
        <el-input v-model="mes" :placeholder="t('input.QueryContent')" clearable></el-input>
        <el-select v-model="value" effect="light" @change="selectChange(value)">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="serachAccount">
          {{ t('button.search') }}
        </el-button>
      </div>
      <div class="search_right">
        <el-button
          :disabled="per.includes('account:add') ? false : true"
          type="success"
          @click="addAcount(ruleFormRef)"
        >
          {{ t('button.addAcount') }}
        </el-button>
      </div>
    </div>
    <div class="account-table">
      <el-table :data="tableData" border style="width: 100%" stripe highlight-current-row :height="count(tableRef)">
        <el-table-column #default="scope" :label="t('table.accountNumber')" width="180" align="left">
          <div>
            {{ scope.row.username }}
            <copy :content="scope.row.username" :title="t('table.accountNumber')" />
          </div>
        </el-table-column>
        <el-table-column :label="t('table.role')" min-width="600">
          <template #default="{ row }">
            <el-tooltip :content="row.roleIds.join(' | ')" placement="top" v-if="row.roleIds">
              <div class="account-role">
                {{ row.roleIds.join(' | ') }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="t('table.mobilePhoneNumber')" width="150" align="left">
          <template #default="{ row }">
            <span v-if="row.cc">+{{ row.cc }}&nbsp;&nbsp;&nbsp;</span>
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="t('table.status')" width="80" align="left">
          <template #default="{ row }">
            <div style="color: #67c23a; font-weight: 800" v-if="row.state == 1">
              {{ t('button.enable') }}
            </div>
            <div style="color: #f56c6c; font-weight: 800" v-else>
              {{ t('button.disable') }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('table.controls')" align="center" width="170">
          <template #default="{ row }">
            <el-button
              :disabled="per.includes('account:edit') ? false : true"
              type="primary"
              @click="editt(row, ruleFormRef)"
            >
              {{ t('button.edit') }}
            </el-button>
            <el-popconfirm
              :confirm-button-text="t('button.confirm')"
              :cancel-button-text="t('button.cancel')"
              icon-color="#f5c357"
              :title="
                t('button.whether') +
                (row.state == 1 ? t('button.disable') : t('button.enable')) +
                t('button.selectedSsers') +
                '?'
              "
              @confirm="confirmEvent(row)"
              @cancel="cancelEvent"
              width="250"
            >
              <template #reference>
                <el-button
                  :disabled="per.includes('account:forbidden') ? false : true"
                  :type="row.state == 1 ? 'danger' : 'success'"
                >
                  {{ row.state == 1 ? t('button.disable') : t('button.enable') }}
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 30, 50, 100]"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 新增/编辑 账号弹出框 -->
    <el-dialog v-model="dialogFormVisible" class="tabs-dialog">
      <el-tabs class="m_tabs" v-model="activeTab">
        <el-tab-pane
          :label="distinguish ? t('button.edit') + t('table.accountNumber') : t('button.addAcount')"
          name="editTask_tab"
          class="m_tabs_pane"
        >
          <el-form :model="accountForm" ref="ruleFormRef" status-icon :rules="rules" class="dialog-form single-form">
            <el-form-item :label="t('login.userName') + ' :'" prop="userName">
              <el-input v-model="accountForm.userName" :disabled="distinguish" clearable />
            </el-form-item>
            <el-form-item
              :label="distinguish ? t('login.editpassWord') + ' :' : t('login.passWord') + ' :'"
              prop="passWord"
            >
              <el-input v-model="accountForm.passWord" type="password" show-password />
            </el-form-item>
            <el-form-item :label="t('login.confirmPassword') + ' :'" prop="passWord1">
              <el-input v-model="accountForm.passWord1" type="password" show-password />
            </el-form-item>
            <el-form-item :label="t('pop.systemIdentity') + ' :'">
              <div class="checked">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
                  {{ t('input.SelectAll') }}
                </el-checkbox>
                <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="city in cities" :key="city" :label="city">
                    {{ city }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item :label="t('table.mobilePhoneNumber') + ' :'">
              <div class="phone">
                <p>+</p>
                <el-form-item>
                  <div class="one">
                    <select-code :toValue="phoneValue" @getValue="phoneCode" ref="phoneValueRef"></select-code>
                  </div>
                </el-form-item>
                <el-form-item prop="phone">
                  <div class="two">
                    <el-input class="twoo" v-model="accountForm.phone"></el-input>
                  </div>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item :label="t('pop.secretkey') + ' :'" v-if="distinguish">
              <div class="secret-key">
                <div class="one">
                  <el-input disabled class="onee" v-model="accountForm.secret"></el-input>
                </div>
                <div class="two">
                  <el-button @click="getSecret">{{ t('pop.getsecretkey') }}</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="t('table.qrcode') + ' :'" v-if="showQrcode">
              <div class="QR-code">
                <div>
                  <qrcode-vue :value="accountForm.payUrl" :size="128" level="H" />
                </div>
                <p>{{ t('pop.ScanQRcode') }}</p>
              </div>
            </el-form-item>
          </el-form>
          <div class="button-row">
            <el-button @click="cancellation">{{ t('button.cancel') }}</el-button>
            <el-button type="primary" @click="confirm(ruleFormRef)">
              {{ t('button.confirm') }}
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { setPermissionsStore } from '@/stores/index'
import { reqRoleDAll } from '@/api/system/roles/index'
import {
  reqSystemUserAccountList,
  reqSystemUserCreate,
  reqSystemUserEdit,
  reqGoogle,
  reqForbidden
} from '@/api/system/account/index'
import type { FormInstance, FormRules } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const activeTab = ref('editTask_tab') //tab切换第一条
// 计算表格高度
import count from '@/utils/tableHeight'
const tableRef = ref(null)
const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)
console.log(per, 'per')
//g国际电话号
const phoneValueRef = ref(null)
const phoneValue = ref('')
// 选中国际区号的值
const phoneCode = (val) => {
  accountForm.cc = val
  phoneValue.value = val
}
//搜索
const serachAccount = async () => {
  if (value.value == '0') {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  } else if (value.value == '1') {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      state: 1,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  } else {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      state: 0,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  }
}
//查看状态是禁用还是启用的数据
const selectChange = async (val) => {
  if (val == 0) {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  } else if (val == 1) {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      state: 1,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  } else {
    let res = await reqSystemUserAccountList({
      page: currentPage.value,
      size: pageSize.value,
      state: 0,
      username: mes.value
    })
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
  }
}
//分页器相关
const currentPage = ref(1)
const pageSize = ref(15)
const handleSizeChange = (val) => {
  pageObj.size = val
  getAccount(pageObj)
}
const handleCurrentChange = (val) => {
  pageObj.page = val
  getAccount(pageObj)
}
const confirmEvent = async (row) => {
  let state = row.state == 1 ? 0 : 1
  let id = row.id
  let res = await reqForbidden({
    id,
    state
  })
  if (res.success) {
    ElMessage({
      message: t('table.controls') + t('errorCode.0'),
      type: 'success'
    })
    getAccount(pageObj)
  } else {
    showErrorMessage(res)
  }
}
const cancelEvent = () => {}
//表单校验
const ruleFormRef = ref<FormInstance>()
//弹出框中 表单的头部宽度
const formLabelWidth = '240px'
//弹出框中 表单的信息
const accountForm = reactive({
  userName: '',
  passWord: '',
  passWord1: '',
  cc: '',
  phone: '',
  secret: '',
  payUrl: ''
})
//校验规则
const validateName = (rule: any, value: any, callback: any) => {
  if (value.length < 3 || value.length > 20) {
    callback(new Error(t('input.checkUserName')))
  } else if (value == '') {
    callback(new Error(t('input.Cannotempty')))
  }
  callback()
}
const validatePass = (rule: any, value: any, callback: any) => {
  let pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}')
  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPassword')))
  } else {
    callback()
  }
}
const validatePass1 = (rule: any, value: any, callback: any) => {
  if (value !== accountForm.passWord) {
    callback(new Error(t('input.Passwordinconsistency')))
  } else {
    callback()
  }
}
const validateIphon = (rule: any, value: any, callback: any) => {
  let pwdRegex = new RegExp('^[0-9]*$')

  if (!pwdRegex.test(value)) {
    callback(new Error(t('input.checkPhone')))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  userName: [{ validator: validateName, required: true, trigger: 'blur' }],
  passWord: [{ validator: validatePass, required: true, trigger: 'blur' }],
  passWord1: [{ validator: validatePass1, required: true, trigger: 'blur' }],
  phone: [{ validator: validateIphon, required: true, trigger: 'blur' }]
})
//弹出框表单 取消按钮
const cancellation = () => {
  dialogFormVisible.value = false
}
//弹出框表单 确认按钮
const confirm = async (formEl: FormInstance | undefined) => {
  if (distinguish.value) {
    //如果点击的是编辑账号
    if (!formEl) return
    formEl.validateField('passWord1', async (valid) => {
      if (valid) {
        formEl.validateField('phone', async (valid) => {
          if (valid) {
            try {
              let res = await reqSystemUserEdit({
                id: accountId.value,
                cc: accountForm.cc,
                phone: accountForm.phone,
                googleSecret: accountForm.secret,
                password: accountForm.passWord,
                roleIds: checkedCities.value
              })
              // console.log(accountForm.cc, 9999999999999)
              // console.log(res)
              if (res.success) {
                ElMessage({
                  message: t('button.edit') + t('errorCode.0'),
                  type: 'success'
                })
                dialogFormVisible.value = false
                getAccount(pageObj)
              } else {
                showErrorMessage(res)
                dialogFormVisible.value = false
              }
            } catch (error) {}
          }
        })
      } else {
        return false
      }
    })
  } else {
    //如果点击的是新增账号
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          let obj = {
            username: '',
            password: '',
            confirmPassword: '',
            cc: '',
            phone: '',
            roleIds: []
          }
          obj.username = accountForm.userName
          obj.password = accountForm.passWord
          obj.confirmPassword = accountForm.passWord1
          obj.cc = accountForm.cc
          obj.phone = accountForm.phone
          obj.roleIds = checkedCities.value
          let res = await reqSystemUserCreate(obj)
          if (res.success) {
            ElMessage({
              message: t('button.add') + t('errorCode.0'),
              type: 'success'
            })
            dialogFormVisible.value = false
            getAccount(pageObj)
            showQrcode.value = false
          } else {
            showErrorMessage(res)
            dialogFormVisible.value = false
          }
        } catch (error) {}
      } else {
        return false
      }
    })
  }
}

//区分点击的是新增账号还是编辑账号   如果为真 则是编辑
const distinguish = ref(false)
//控制弹出框表单 身分 是否全选
const checkAll = ref(false)
//弹出框中  哪些系统身份被勾选
const checkedCities = ref([])
//弹出框中  有哪些系统身份
const cities = ref([])
//弹出框中  点击全选的回调
const isIndeterminate = ref(true)
const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val ? cities.value : []
  isIndeterminate.value = false
}
//弹出框中  系统身份按钮回调
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === cities.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
}
//账号id
const accountId = ref()
//账号状态
const accountState = ref()
//是否显示微信二维码
const showQrcode = ref(false)
//编辑按钮回调
const editt = (row, ruleFormRef) => {
  getRolesAll()
  checkedCities.value = row.roleIds
  dialogFormVisible.value = true
  distinguish.value = true
  showQrcode.value = false
  accountId.value = row.id
  accountState.value = row.state
  accountForm.passWord = ''
  accountForm.passWord1 = ''
  accountForm.phone = row.originPhone
  accountForm.cc = row.cc
  phoneValue.value = row.cc
  checkedCities.value = row.roleIds
  if (ruleFormRef) {
    ruleFormRef.clearValidate()
  }
  // 更新国际区号
  if (phoneValueRef.value) {
    phoneValueRef.value.doUpdateValue(row.cc)
  }
  accountForm.userName = row.username
}
//获取密钥
const getSecret = async () => {
  let data = {
    accountId: accountId.value,
    cc: accountForm.cc,
    phone: accountForm.phone
  }
  console.log(data)
  let res = await reqGoogle(data)
  if (res.success) {
    ElMessage({
      message: t('pop.getsecretkey') + t('errorCode.0'),
      type: 'success'
    })
    accountForm.secret = res.data.googleSecret
    accountForm.payUrl = res.data.qrCode
    showQrcode.value = true
  } else {
    showErrorMessage(res)
  }
}
//搜索的字符串
const mes = ref('')
//状态默认显示全部
const value = ref('0')
//状态时 启用|禁用
const options = [
  {
    value: '0',
    label: t('input.all')
  },
  {
    value: '1',
    label: t('button.enable')
  },
  {
    value: '2',
    label: t('button.disable')
  }
]
const total = ref(0)
//表格展示的数据
const tableData = ref()
//控制弹出框是否展示
const dialogFormVisible = ref(false)
//按钮  新增账号的回调
const addAcount = (ruleFormRef) => {
  getRolesAll()
  accountForm.userName = ''
  accountForm.cc = phoneValue.value
  accountForm.phone = ''
  accountForm.passWord = ''
  accountForm.passWord1 = ''
  accountForm.secret = ''
  checkAll.value = false
  distinguish.value = false
  showQrcode.value = false
  dialogFormVisible.value = true
  checkedCities.value = []
  if (ruleFormRef) {
    ruleFormRef.clearValidate()
  }
  // 重置国际区号
  if (phoneValueRef.value) {
    phoneValueRef.value.reset()
  }
}
onMounted(() => {
  getAccount(pageObj)
})
const getRolesAll = async () => {
  let res = await reqRoleDAll()
  cities.value = res.data.roles
}
const pageObj = reactive({
  page: currentPage.value,
  size: pageSize.value
})
const getAccount = async (pageObj) => {
  let res = await reqSystemUserAccountList(pageObj)
  tableData.value = res.data.list
  total.value = parseInt(res.data.total)
}
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

.el-input {
  width: 300px;
}

.search {
  display: flex;
  margin-bottom: 2px;
  align-items: center;
  justify-content: space-between;

  .search_left {
    > div {
      margin-bottom: 10px;
      margin-right: 10px;
    }

    .el-input {
      width: 7.5rem;
    }

    .el-select {
      width: 6.25rem;
    }

    .el-button {
      margin-bottom: 10px;
    }
  }

  .search_right {
    .el-button {
      margin-bottom: 10px;
    }
  }
}
</style>
