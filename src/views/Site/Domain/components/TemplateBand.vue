<template>
  <!-- ドマインはウェブの繋がりがある場合に、ダイアログを開いた後、タブ三つ目である。 -->
  <!-- 父コンポーネントはDomainTable -->
  <el-form v-if="hasTemplateData" :model="formModel" label-width="160">
    <el-row :gutter="20" class="center-row">
      <!-- 第一列 -->
      <el-col :span="18">
        <div class="column-content">
          <!-- 第一列的内容 -->
          <el-form-item :label="formLabelObj.templateId.chnProp + ':'" prop="templateId">
            {{ formModel.templateName }} | {{ formModel.templateId }}
            <copy :content="formModel.templateId" v-if="formModel.templateId"></copy>
          </el-form-item>
          <el-form-item :label="formLabelObj.theme.chnProp + ':'" prop="theme">
            {{ formModel.theme }}
          </el-form-item>
          <el-form-item :label="formLabelObj.sketchCode.chnProp + ':'" prop="sketchCode">
            {{ formModel.sketchName }} | {{ formModel.sketchCode }}
            <!-- <copy :content="formModel.sketchCode"></copy> -->
          </el-form-item>
          <el-form-item :label="formLabelObj.sysTemplateRef.chnProp + ':'" prop="sysTemplateRef">
            {{ formModel.sysTemplateRefName }}
            <span v-if="formModel.sysTemplateRefName && formModel.sysTemplateRef">&nbsp;|&nbsp;</span>
            {{ formModel.sysTemplateRef }}
            <!-- <copy :content="formModel.sysTemplateRef"></copy> -->
          </el-form-item>

          <el-form-item :label="formLabelObj.cdnUrl.chnProp + ':'" prop="cdnUrl">
            {{ formModel.cdnUrl }}
          </el-form-item>
          <el-form-item :label="formLabelObj.onlineServiceCode.chnProp + ':'" prop="onlineServiceCode">
            {{ formModel.onlineServiceCode }}
          </el-form-item>
          <el-form-item :label="formLabelObj.statsCodeJsUrl.chnProp + ':'" prop="statsCodeJsUrl">
            {{ formModel.statsCodeJsUrl }}
          </el-form-item>

          <el-form-item :label="formLabelObj.memo.chnProp + ':'" prop="memo">
            {{ formModel.memo }}
          </el-form-item>
        </div>
      </el-col>
    </el-row>
  </el-form>
  <noData v-else />
</template>
<script lang="ts" setup>
interface propsInterface {
  domain: string
}
import { getTemplateRefMsgByDomain } from '@/api/site/domain'
import noData from '../../siteManagement/components/noData.vue'
import { initTemplateInfo, TemplateInfo } from '@/views/Site/Domain/type'
import { defineProps, withDefaults } from 'vue'
// import { addTypeToObjects } from '@/utils/dataFormat'
// Use defineProps to define the props
const props = withDefaults(defineProps<propsInterface>(), {
  domain: '' // Set default value
})
const hasTemplateData = ref(false)
const formModel = reactive<TemplateInfo>(initTemplateInfo())
const formLabelObj = reactive<any>({
  templateId: { chnProp: '模板名称 | ID' },
  theme: { chnProp: '主题' },
  sketchCode: { chnProp: '模板草图名称 | 代码' },
  sysTemplateRef: { chnProp: '系统模板名称 | ID' },
  memo: { chnProp: '备注' },
  cdnUrl: { chnProp: 'CDN地址' },
  onlineServiceCode: { chnProp: '在线客服代码' },
  statsCodeJsUrl: { chnProp: '统计代码链接' }
})
onMounted(() => {
  const { domain } = props
  getTemplateRefMsgByDomain({ domain })
    .then((res) => {
      if (res && res.errMessage === 'success' && res.data.length > 0) {
        hasTemplateData.value = true
        Object.assign(formModel, res.data[0])
      } else {
        hasTemplateData.value = false
      }
    })
    .catch((err) => {
      console.error('err', err)
      hasTemplateData.value = false
    })
})
</script>
<style scoped>
.center-row {
  justify-content: center;
  display: flex;
  width: 80%;
}
</style>
