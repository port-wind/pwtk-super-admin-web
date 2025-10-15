<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import {
  insertAFirstCheck,
  updateAFirstCheck,
  insertHKFirstCheck,
  updateHKFirstCheck,
  insertSGFirstCheck,
  updateSGFirstCheck,
  insertKL8FirstCheck,
  updateKL8FirstCheck,
  insertTWFirstCheck,
  updateTWFirstCheck,
  insertXAFirstCheck,
  updateXAFirstCheck,
  type InsertOrUpdateFirstCheckParams,
  getAllIssueListForGameRusult
} from '@/api/photoSys/gameResult'
import { unitFormatDate } from '@/utils/dateFormat'
import showErrorMessage from '@/utils/showErrorMessage'
import { useBettingStore } from '@/stores/bettingStore'

// Review 展示用数据
export interface FirstCheckShowData {
  firstCheckOper: string
  firstCheckTime: string
  firstCheckUpdateCount: number
  firstCheckLastUpdateTime: string
}

interface Props {
  reviewData: (InsertOrUpdateFirstCheckParams & FirstCheckShowData) | null
  tab: Tab
  gameType: string
  yearOptions: { label: string; value: string }[]
}

type Tab = 'a' | 'hk' | 'sg' | 'tw' | 'xa' | 'kl8'

const METHODS = {
  a: {
    insert: insertAFirstCheck,
    update: updateAFirstCheck
  },
  hk: {
    insert: insertHKFirstCheck,
    update: updateHKFirstCheck
  },
  sg: {
    insert: insertSGFirstCheck,
    update: updateSGFirstCheck
  },
  tw: {
    insert: insertTWFirstCheck,
    update: updateTWFirstCheck
  },
  xa: {
    insert: insertXAFirstCheck,
    update: updateXAFirstCheck
  },
  kl8: {
    insert: insertKL8FirstCheck,
    update: updateKL8FirstCheck
  }
}

const show = defineModel('show', { type: Boolean })
const issueOptionsState = reactive({
  data: [] as { value: string; label: string }[]
})
const mode = ref<'insert' | 'update'>('insert')

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [resetPage?: boolean]
}>()

const formRef = ref<FormInstance>()
let yearDefault = ''
const formData = reactive<InsertOrUpdateFirstCheckParams>({
  year: yearDefault,
  issue: null,
  firstCheckNum1: null,
  firstCheckNum2: null,
  firstCheckNum3: null,
  firstCheckNum4: null,
  firstCheckNum5: null,
  firstCheckNum6: null,
  firstCheckNumTe: null,
  firstCheckMemo: ''
})
const bettingStore = useBettingStore()
const gameTypeList = computed(
  () => bettingStore.gameType.map((item) => ({ value: item.gameType, label: item.gameTypeName })) || []
)
watch(
  () => formData.year,
  () => {
    loadIssueOptions(props.gameType, formData.year?.toString() || '')
  }
)
const isLoading = ref(false)

async function beforeOpen() {
  if (props.reviewData) {
    mode.value = 'update'
    formData.year = props.reviewData.year || yearDefault
    await loadIssueOptions(props.gameType, formData.year?.toString() || '')
    formData.issue = props.reviewData.issue
    formData.firstCheckNum1 = props.reviewData.firstCheckNum1
    formData.firstCheckNum2 = props.reviewData.firstCheckNum2
    formData.firstCheckNum3 = props.reviewData.firstCheckNum3
    formData.firstCheckNum4 = props.reviewData.firstCheckNum4
    formData.firstCheckNum5 = props.reviewData.firstCheckNum5
    formData.firstCheckNum6 = props.reviewData.firstCheckNum6
    formData.firstCheckNumTe = props.reviewData.firstCheckNumTe
    formData.firstCheckMemo = props.reviewData.firstCheckMemo
  } else {
    mode.value = 'insert'
    formData.year = yearDefault
    await loadIssueOptions(props.gameType, formData.year?.toString() || '')
    formData.issue = issueOptionsState.data[0]?.value || ''
    formData.firstCheckNum1 = null
    formData.firstCheckNum2 = null
    formData.firstCheckNum3 = null
    formData.firstCheckNum4 = null
    formData.firstCheckNum5 = null
    formData.firstCheckNum6 = null
    formData.firstCheckNumTe = null
    formData.firstCheckMemo = ''
  }
}

const rules = reactive<FormRules<InsertOrUpdateFirstCheckParams>>({
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: true, message: '请输入期数', trigger: 'change' }],
  firstCheckNum1: [
    { validator: createValidateNum(1, '正码1'), trigger: 'change' },
    {
      validator: createValidateNum(2, '正码2'),
      trigger: 'change'
    },
    {
      validator: createValidateNum(3, '正码3'),
      trigger: 'change'
    },
    {
      validator: createValidateNum(4, '正码4'),
      trigger: 'change'
    },
    {
      validator: createValidateNum(5, '正码5'),
      trigger: 'change'
    },
    {
      validator: createValidateNum(6, '正码6'),
      trigger: 'change'
    },
    {
      validator: createValidateNum(7, '特码'),
      trigger: 'change'
    }
  ]
})

const activeTab = ref('gameResult')

// 正码：1～49 ※且七个号码都不能彼此重复
function createValidateNum(index: number, label: string) {
  return function (rule: any, _value: any, callback: any) {
    const checkList = [
      formData.firstCheckNum1,
      formData.firstCheckNum2,
      formData.firstCheckNum3,
      formData.firstCheckNum4,
      formData.firstCheckNum5,
      formData.firstCheckNum6,
      formData.firstCheckNumTe
    ]

    const value = checkList[index - 1]

    if (value == null) {
      callback(new Error(`请输入${label}`))
    } else if (value < 1 || value > 49) {
      callback(new Error(`${label}只能是1～49`))
    } else {
      // 移除当前号码自身的比较
      checkList.splice(index - 1, 1)

      console.log(label, ', checkList, ', checkList, value)

      if (checkList.includes(value)) {
        // todo: 错误信息弹窗显示
        callback(new Error(`${label}不能与其他号码重复`))
      } else {
        callback()
      }
    }
  }
}
const loadIssueOptions = async (gameType: string, year: string) => {
  if (!gameType || !year) {
    issueOptionsState.data = []
    return
  }
  isLoading.value = true
  try {
    const response = await getAllIssueListForGameRusult({ gameType, year })

    if (!response?.success) {
      issueOptionsState.data = []
      showErrorMessage(response)
      return
    }

    issueOptionsState.data =
      response?.data?.map((item: string) => ({
        value: item,
        label: item
      })) || []
  } catch (error) {
    console.error('Failed to fetch issue options:', error)
    issueOptionsState.data = []
  } finally {
    isLoading.value = false
  }
}
const yearChange = async () => {
  await loadIssueOptions(props.gameType, formData.year?.toString() || '')
  formData.issue = issueOptionsState.data[0]?.value || ''
}

function onSubmit() {
  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      try {
        isLoading.value = true
        const method = mode.value === 'insert' ? METHODS[props.tab].insert : METHODS[props.tab].update

        formData.issue = Number(formData.issue)

        const res = await method(formData)
        if (res.success) {
          show.value = false
          emit('update', props.reviewData == null)
          ElMessage.success('操作成功')
        } else {
          ElMessage.error(res.errMessage)
        }
      } catch (error) {
        ElMessage.error('操作失败')
      } finally {
        isLoading.value = false
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
watch(show, (val) => {
  if (val) {
    setTimeout(() => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }, 0)
    yearDefault = props.yearOptions[0].value
  }
})
onMounted(async () => {
  await bettingStore.getGameType()
})
</script>

<template>
  <el-dialog
    draggable
    overflow
    detroy-on-close
    class="tabs-dialog"
    v-model="show"
    :close-on-click-modal="false"
    @open="beforeOpen"
  >
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="开奖结果" name="gameResult" class="m_tabs_pane">
        <el-scrollbar class="cc-scrollbar">
          <el-form ref="formRef" :rules="rules" :model="formData" class="cc-form">
            <el-row>
              <el-col :span="6">
                <el-form-item label="年份:" prop="year">
                  <el-select
                    v-model="formData.year"
                    placeholder="年份"
                    style="width: 120px"
                    :disabled="mode === 'update'"
                    @change="yearChange"
                  >
                    <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="10">
                <el-form-item label="期数:" prop="issue">
                  <el-select
                    v-model="formData.issue"
                    placeholder="期数"
                    style="width: 180px"
                    filterable
                    :disabled="!props.gameType || !formData.year || mode === 'update'"
                  >
                    <el-option
                      v-for="item in issueOptionsState.data"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="彩种:" prop="gameType">
                  {{ gameTypeList.find((item) => item.value.toString() === props.gameType.toString())?.label }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="正码:" prop="firstCheckNum1">
              <el-row :gutter="3" style="width: 90%">
                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum1"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum2"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum3"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum4"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum5"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNum6"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3" :offset="1">
                  <el-input-number
                    class="input-number"
                    v-model="formData.firstCheckNumTe"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="操作员:" v-if="mode === 'update'">
              {{ props.reviewData?.firstCheckOper }}
            </el-form-item>

            <el-form-item label="首核时间:" v-if="mode === 'update'">
              {{
                props.reviewData?.firstCheckTime
                  ? unitFormatDate(props.reviewData.firstCheckTime, 'yyyy-MM-dd HH:mm:ss')
                  : ''
              }}
            </el-form-item>

            <el-form-item label="首核次数:" v-if="mode === 'update'">
              {{ props.reviewData?.firstCheckUpdateCount }}
            </el-form-item>

            <el-form-item label="更新时间:" v-if="mode === 'update'">
              <!-- {{ props.reviewData?.firstCheckLastUpdateTime }} -->
              {{
                props.reviewData?.firstCheckLastUpdateTime
                  ? unitFormatDate(props.reviewData.firstCheckLastUpdateTime, 'yyyy-MM-dd HH:mm:ss')
                  : ''
              }}
            </el-form-item>
            <el-form-item label="备注:" prop="firstCheckMemo">
              <el-input
                v-model="formData.firstCheckMemo"
                placeholder="备注"
                type="textarea"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-scrollbar>
        <div class="dialog-footer dialog-footer-submit cc-submit">
          <el-button @click="show = false" :disabled="isLoading">取消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="isLoading">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style scoped>
.input-number {
  width: 100%;
}

.cc-scrollbar {
  padding: 0 10px;
  margin-top: 20px;
}

.cc-submit {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
}

.cc-form {
  width: 80%;
  margin: 0 auto;
}

.cc-form :deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
