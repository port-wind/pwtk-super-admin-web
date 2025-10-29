<template>
  <el-form
    :model="form"
    class="dialog-form"
    :style="{ width: 'auto', margin: '0 auto', padding: '0 1rem' }"
    ref="formRef"
    label-width="180"
  >
    <el-row>
      <el-col :span="12">
        <el-form-item label="域名:" prop="domain">
          <span>{{ form.domain }}</span>
          <copy :content="form?.domain"></copy>
        </el-form-item>
        <el-form-item label="所属用户ID/昵称:" prop="ownerUserId">
          <span>{{ form.ownerUserId }}</span>
          <copy :content="form?.ownerUserId"></copy>
        </el-form-item>
        <el-form-item label="绑定站点ID/名称:" prop="websiteRef">
          <span>{{ form.websiteRef }}</span>
          <copy :content="form?.websiteRef"></copy>
        </el-form-item>
        <el-form-item label="在线客服代码:" prop="onlineServiceCode">
          <el-input v-model="form.onlineServiceCode" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网站描述:" prop="descriptions">
          <el-input v-model="form.descriptions" autocomplete="off" />
        </el-form-item>
        <el-form-item label="配置ssl证书" prop="isSupportSsl">
          <el-radio-group v-model="form.isSupportSsl">
            <el-radio v-for="item in supportSslStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="统计代码:" prop="hasStatsCode">
          <el-radio-group v-model="form.hasStatsCode">
            <el-radio v-for="item in hasStatsCode" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="语言:" prop="langCodes">
          <el-select v-model="form.langCodes" multiple placeholder="语言">
            <el-option v-for="item in optionsLang" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="强制https访问:" prop="isForceHttps">
          <el-radio-group v-model="form.isForceHttps">
            <el-radio v-for="item in forceHttpsStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提示下载APP:" prop="isAppDownloadHint">
          <el-radio-group v-model="form.isAppDownloadHint">
            <el-radio v-for="item in forceHttpsStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="域名:" prop="domain">
          <el-input v-model="form.domain" autocomplete="off" />
        </el-form-item>
        <el-form-item label="域名类型:" prop="domainType">
          <el-input v-model="form.ownerUserId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="域名来源:" prop="domainFrom">
          <el-input v-model="form.ownerUserId" autocomplete="off" />
        </el-form-item>
        <el-form-item label="关键字:" prop="keyWords">
          <el-input v-model="form.keyWords" autocomplete="off" />
        </el-form-item>
        <el-form-item label="域名状态:" prop="domainStatus">
          <!-- <el-input
            v-model="form.domainStatus"
            autocomplete="off"
          /> -->
          <el-radio-group v-model="form.domainStatus">
            <el-radio v-for="item in websiteStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="ssl证书到期日期" prop="sslExpiry" :style="{ width: '100%' }">
          <el-date-picker
            v-model="form.sslExpiry"
            type="date"
            placeholder="选择日期"
            :style="{ width: '100%' }"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="落地页:" prop="landingPage">
          <el-input v-model="form.landingPage" autocomplete="off" />
        </el-form-item>
        <el-form-item label="适用的地区列表" prop="areaCodes">
          <el-select v-model="form.areaCodes" multiple placeholder="地区">
            <el-option v-for="item in optionsArea" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="CDN地址:" prop="cdnUrl">
          <el-input v-model="form.cdnUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="ops管理代码:" prop="opsManageCode">
          <el-input v-model="form.opsManageCode" autocomplete="off" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item label="备注" prop="memo">
        <el-input
          type="textarea"
          placeholder="备注"
          show-word-limit
          maxlength="255"
          :rows="2"
          v-model="form.memo"
          autocomplete="off"
        />
      </el-form-item>
    </el-row>
  </el-form>
</template>
<script setup lang="ts">
import i18n from '@/i18n'
const { t } = i18n.global as any
import { defineProps, defineEmits, ref, onMounted } from 'vue'
import {
  useOptions,
  optionsLang,
  optionsArea,
  landingPage,
  supportSslStatus,
  hasStatsCode,
  forceHttpsStatus,
  websiteStatus
} from '@/const/options'

import type { EditRequest } from '@/api/site/domain/types'
import type { TabsPaneContext } from 'element-plus'
import { isEqual } from 'lodash-es'

const activeName = ref('first')
// 定义 props
const props = defineProps<{
  rowData: RowData | null
}>()
// 监听 rowData 的变化
watch(
  () => props.rowData,
  (newValue) => {
    if (newValue) {
      console.log('rowData in child component changed:', newValue)
      // 这里可以添加响应 rowData 变化的逻辑
      // 例如，重新初始化表单、更新本地状态等
    }
  },
  { deep: true }
) // 使用 deep 选项以监听对象内部的变化
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const initFormData = () => ({
  domain: '',
  keyWords: '',
  descriptions: '',
  cdnUrl: '',
  memo: '',
  ownerUserId: '',
  websiteRef: '',
  onlineServiceCode: '',
  isSupportSsl: 'n',
  domainStatus: '0',
  domainType: '',
  domainFrom: '',
  hasStatsCode: 'n',
  langCodes: [],
  areaCodes: [],
  landingPage: '',
  isForceHttps: 'n',
  sslExpiry: '',
  isAppDownloadHint: 'n',
  opsManageCode: '',
  promotionCode: ''
})
const formData = ref<EditRequest>(initFormData())
const initialForm = reactive<EditRequest>(initFormData())
const form = reactive<EditRequest>({ ...initialForm })

const isFormChanged = () => {
  return !isEqual(toRaw(form), toRaw(initialForm))
}

const emit = defineEmits(['update:visible', 'save'])

const handleCancel = () => {
  emit('update:visible', false)
}

const handleSave = () => {
  if (isFormChanged()) {
    emit('save', { ...form })
  } else {
    ElMessage({
      showClose: true,
      message: '没有任何修改',
      type: 'warning'
    })
  }
}
</script>
