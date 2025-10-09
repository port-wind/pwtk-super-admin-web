<template>
  <el-form :model="formState" :rules="issueFormRules" class="dialog-form" v-bind="$attrs" ref="formRef">
    <div class="form-content">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="彩种:" prop="gameType">
            <GameTypeList v-model="form.gameType" :withDefault="!isEditMode" @onSelect="handleGameTypeChange" />
          </el-form-item>

          <el-form-item label="年份:" prop="year">
            <el-select v-model="form.year" placeholder="年份" @change="handleYearChange">
              <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="期数:" prop="issue">
            <el-select
              v-model="form.issue"
              placeholder="请选择期数"
              filterable
              :disabled="!form.gameType || !form.year"
            >
              <el-option
                v-for="item in issueOptionsState.data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <p v-else>{{ form.issue }}</p> -->
          </el-form-item>

          <el-form-item label="图纸名称:" prop="name">
            <el-input v-model.trim="form.name" searchKey="name" clearable placeholder="图纸名称" />
          </el-form-item>

          <el-form-item label="图纸系列:" prop="seriesCode">
            <UniRemoteInput
              v-model.trim="form.seriesCode"
              :search-obj="{ gameType: form.gameType }"
              valueKey="seriesCode"
              labelKey="seriesName"
              searchKey="seriesCode"
              placeholder="请输入系列ID"
              event-focus="focus"
              @value-change="onSeriesCodeChange"
              :fetchOptions="listGameTypeSeries"
              :formatLabel="(item) => (item.seriesName ? `${item.seriesCode} - ${item.seriesName}` : item.seriesCode)"
            />
          </el-form-item>

          <el-form-item label="图纸报纸:" prop="newspaperCode">
            <UniRemoteInput
              v-model.trim="form.newspaperCode"
              :search-obj="{ seriesCode: form.seriesCode }"
              valueKey="newspaperCode"
              labelKey="newspaperName"
              searchKey="newspaperCode"
              :placeholder="placeholderText"
              :disabled="isNewspaperCodeDisabled"
              @option-change="onNewspaperCodeChange"
              :fetchOptions="getNewsPaperList"
              :formatLabel="
                (item) => (item.newspaperName ? `${item.newspaperCode} - ${item.newspaperName}` : item.newspaperCode)
              "
            />
          </el-form-item>

          <el-form-item label="评论:">
            <el-radio-group v-model="form.commentFlag">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="投票:">
            <el-radio-group v-model="form.voteFlag">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="创建时间:" v-if="isEditMode">
            <p>{{ unitFormatDate(form.createTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="推荐:">
            <el-radio-group v-model="form.isRecommended">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="热门:">
            <el-radio-group v-model="form.isHot">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="置顶:">
            <el-radio-group v-model="form.isTop">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="精选:">
            <el-radio-group v-model="form.isSelected">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="爆款:">
            <el-radio-group v-model="form.isBloom">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="彩色:">
            <el-radio-group v-model="form.isColorful">
              <el-radio value="y">是</el-radio>
              <el-radio value="n">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="isEditMode" label="状态:">
            <el-radio-group v-model="form.status">
              <el-radio value="y">启用</el-radio>
              <el-radio value="n">删除</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="isEditMode" label="阅读数量:">
            {{ form.readCount }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="注解:">
            <el-input
              v-model="form.annotateContent"
              type="textarea"
              placeholder="请输入注解"
              show-word-limit
              maxlength="512"
              :rows="4"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>

    <div class="image-upload-wrapper">
      <slot name="imageUploader"></slot>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { listGameTypeSeries } from '@/api/photoSys/series'
import { getNewsPaperList } from '@/api/photoSys/issues'
import { YearTypes } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { FormInstance } from 'element-plus'
import { RxState, useIssueForm } from '@/views/PhotosSys/newsPaperIssue/composables/useIssueForm'
import { useBettingStore } from '@/stores/bettingStore'
import type { IssueFormData } from '../IssueTypes/index'

const props = defineProps({
  isEditMode: {
    type: Boolean,
    required: true
  },
  rxState: {
    type: Object as () => RxState<IssueFormData>,
    required: true
  }
})
const { form, injectFormRef, isAddMode, placeholderText, issueOptionsState, loadIssueOptions, setNewspaperOptions } =
  useIssueForm(props.rxState)
const gameTypeOptions = ref<any[]>([])
const bettingStore = useBettingStore()
const formRef = ref<FormInstance>()
const yearOptions = YearTypes
const issueFormRules = {
  seriesCode: [{ required: true, message: '请选择图纸系列', trigger: 'change' }],
  name: [{ required: true, message: '请输入图纸名称', trigger: 'change' }],
  newspaperCode: [{ required: true, message: '请选择报纸', trigger: 'change' }],
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: true, message: '请选择期数', trigger: 'change' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
}
const formState = props.rxState.formState
const isNewspaperCodeDisabled = computed(() => !form.value.seriesCode)
watch(
  () => ({ gameType: formState.gameType, year: formState.year }),
  async (newParams) => {
    await loadIssueOptions(newParams.gameType, newParams.year)
  },
  { immediate: true }
)

const handleGameTypeChange = async () => {
  formState.seriesCode = ''
  formState.newspaperCode = ''
  await loadIssueOptions(form.value.gameType, form.value.year)
  formState.issue = issueOptionsState.data[0]?.value || ''
}
const handleYearChange = async () => {
  await loadIssueOptions(form.value.gameType, form.value.year)
  formState.issue = issueOptionsState.data[0]?.value || ''
}
const onSeriesCodeChange = (item: any) => {
  formState.newspaperCode = ''
}

const onNewspaperCodeChange = (options: any) => {
  setNewspaperOptions(options)
}
onMounted(async () => {
  gameTypeOptions.value = bettingStore.getAllGetGameType()
  injectFormRef(formRef.value as FormInstance)
  if (isAddMode.value) {
    await handleYearChange()
  }
})
</script>

<style scoped lang="less">
.dialog-form {
  display: flex;

  .form-content {
    flex: 0.5;
  }

  .image-upload-wrapper {
    flex: 0.5;
  }

  .front-end-font-outside {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .front-end-font {
      flex-grow: 1;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
