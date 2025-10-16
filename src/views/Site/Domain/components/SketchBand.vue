<template>
  <!-- ドマインはウェブの繋がりがある場合に、ダイアログを開いた後、タブ四つ目である。 -->
  <!-- 父コンポーネントはDomainTable -->
  <el-form v-if="hasSketchData" :model="formModel">
    <el-row :gutter="20" class="center-row">
      <!-- 第一列 -->
      <el-col :span="14">
        <div class="column-content">
          <!-- 第一列的内容 -->
          <el-form-item :label="formLabelObj.sketchCode.chnProp + ':'" prop="sketchCode">
            {{ formModel.sketchName }} | {{ formModel.sketchCode }}
            <copy :content="formModel.sketchCode"></copy>
          </el-form-item>
          <el-form-item :label="formLabelObj.sketchType.chnProp + ':'" prop="sketchType">
            {{ getLanguageLabels(formModel.sketchType, optionsSketch) }}
          </el-form-item>
          <el-form-item :label="formLabelObj.langCodes.chnProp + ':'" prop="langCodes">
            {{ getLanguageLabels(formModel.langCodes, optionsLang) }}
          </el-form-item>
          <el-form-item :label="formLabelObj.areaCodes.chnProp + ':'" prop="areaCodes">
            {{ getLanguageLabels(formModel.areaCodes, optionsArea) }}
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
import noData from '../../siteManagement/components/noData.vue'
import { getSketchRefMsgByDomain } from '@/api/site/domain'
import { optionsArea, optionsSketch, optionsLang } from '@/const/options'
import { initSketchInfo, getLanguageLabels, SketchInfo } from '@/views/Site/Domain/type'
import { defineProps, withDefaults } from 'vue'
// import { addTypeToObjects } from '@/utils/dataFormat'
// Use defineProps to define the props
const props = withDefaults(defineProps<propsInterface>(), {
  domain: '' // Set default value
})

const formModel = reactive<SketchInfo>(initSketchInfo())
const formLabelObj = reactive<any>({
  sketchCode: { chnProp: '草图名称 | 代码' },
  sketchType: { chnProp: '草图类型' },
  langCodes: { chnProp: '语言' },
  areaCodes: { chnProp: '地区' },
  memo: { chnProp: '备注' },
  cdnUrl: { chnProp: 'CDN地址' }
})
const hasSketchData = ref(false)
onMounted(() => {
  const { domain } = props
  getSketchRefMsgByDomain({ domain })
    .then((res) => {
      if (res && res.errMessage === 'success' && res.data.length > 0) {
        hasSketchData.value = true
        Object.assign(formModel, res.data[0])
        //   console.log('formModel',formModel);
      } else {
        hasSketchData.value = false
      }
    })
    .catch((err) => {
      console.error('err', err)
      hasSketchData.value = false
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
