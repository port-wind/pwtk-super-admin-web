<template>
  <div>
    <el-form :model="editForm" ref="editFormRef" :rules="rulesUser">
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10"></el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-form-item label="uD:" prop="loginId">
            {{ '123456' }}
            <!-- {{ editForm.loginId }} -->
            <!-- <copy :content="editForm.loginId"></copy> -->
            <!-- <el-input v-model.trim="editForm.loginId" placeholder="请输入账户名称" autocomplete="off" /> -->
          </el-form-item>
          <el-form-item label="所属用户ID:" prop="mobile">
            {{ '12345' }}
          </el-form-item>
          <el-form-item label="引用模板ID:" prop="mobile">
            {{ '12345' }}
          </el-form-item>
          <el-form-item label="站点标题:" prop="nickname">
            <el-input v-model.trim="editForm.nickname" placeholder="" autocomplete="off" />
          </el-form-item>
          <el-form-item label="关键字:" prop="nickname">
            <el-input v-model.trim="editForm.nickname" placeholder="" autocomplete="off" />
          </el-form-item>

          <el-form-item label="状态:" prop="userStatus">
            <el-radio-group v-model="editForm.userStatus">
              <el-radio
                v-for="item in optionsUserStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="语言:">
            <el-select v-model="value" placeholder="Select" size="default" style="width: 240px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="站点内部名称:" prop="email">
            <el-input v-model.trim="editForm.email" placeholder="请输入站点内部名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="所属用户昵称:" prop="loginId">
            {{ 'ausgtin' }}
          </el-form-item>
          <el-form-item label="引用模板名称:" prop="loginId">
            {{ '1234567' }}
          </el-form-item>
          <el-form-item label="站点描述:" prop="nickname">
            <el-input v-model.trim="editForm.nickname" placeholder="" autocomplete="off" />
          </el-form-item>
          <el-form-item label="在线客服代码:" prop="nickname">
            <el-input v-model.trim="editForm.nickname" placeholder="" autocomplete="off" />
          </el-form-item>
          <el-form-item label="创建时间:" prop="loginId">
            {{ '1234567' }}
          </el-form-item>
          <el-form-item label="备注:" prop="nickname">
            <el-input v-model.trim="editForm.nickname" placeholder="" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地区:">
            <el-select v-model="value" placeholder="Select" size="default" style="width: 240px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
      <div class="button-row">
        <el-button @click="closeHand">取消</el-button>
        <el-button type="primary" :loading="isLoading2" @click="addFormInfo(editFormRef)">提交</el-button>
      </div>
    </el-form>
    <!-- <el-tab-pane
        name="second"
        label="引用模板"
      >
        引用模板
      </el-tab-pane>
      <el-tab-pane
        name="third"
        label="引用草图"
      >
        引用草图
      </el-tab-pane>
      <el-tab-pane
        name="fourth"
        label="已绑定域名"
      >
        已绑定域名
      </el-tab-pane>
      <el-tab-pane
        name="fifth"
        label="未绑定域名"
      >
        未绑定域名
      </el-tab-pane> -->
  </div>
</template>
<script setup lang="ts">
import {
  useOptions,
  optionsUserStatus,
  optionsUserType,
  optionsTeamStatus,
  optionsAccountType,
  optionsRegType
} from '@/const/options'
import { reqUserEdit } from '@/api/user/index'
import { defineEmits } from 'vue'

const emit = defineEmits(['closeTabs'])

import i18n from '@/i18n'
import { viewDepthKey } from 'vue-router'
const { t } = i18n.global as any
const activeName = ref('first')
//用户状态
const { formatValue: formatUserStatus } = useOptions(optionsUserStatus)
//用户类型
const { formatValue: formatUserType } = useOptions(optionsUserType)
//团队状态
const { formatValue: formatTeamStatus } = useOptions(optionsTeamStatus)
//账号类型
const { formatValue: formatAccountType } = useOptions(optionsAccountType)
const props = defineProps({
  accountInfo: {
    type: Object
  }
})

const editForm: any = ref<any>({})
const editFormRef = ref()
const clipperRef = ref(null)
const isLoading2 = ref(false)
const basicList = ref({
  avatar_: ''
})
const clipperData = ref({
  type: '',
  allowTypeList: '',
  limitSize: '',
  fixedNumber: '',
  fixedNumberAider: '',
  previewWidth: ''
})

editForm.value = { ...props.accountInfo }
const rulesUser = ref({
  loginId: [{ message: '请输入账户名称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
  // mobileCountryCode:[{ required: true, message: '请选择手机区号', trigger: 'blur' }],
  // mobile:[]
})

watch(
  () => props.accountInfo,
  (newVal) => {
    editForm.value = { ...newVal }
  },
  { deep: true }
)

const addFormInfo = async (FormRef) => {
  isLoading2.value = true
  await FormRef.validate(async (valid, fields) => {
    if (valid) {
      try {
        let res = await reqUserEdit({ ...editForm.value })
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
          ElMessage({
            showClose: true,
            message: res.errMessage,
            type: 'error'
          })
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

const onConfirm = () => {}

const viewMobile = () => {}
</script>
<style lang="less"></style>
