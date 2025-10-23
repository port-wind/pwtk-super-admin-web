<script setup lang="ts">
import { type FormInstance, type FormRules } from 'element-plus'
import {
  insertADoubleCheck,
  updateADoubleCheck,
  insertHKDoubleCheck,
  updateHKDoubleCheck,
  insertSGDoubleCheck,
  updateSGDoubleCheck,
  insertTWDoubleCheck,
  updateTWDoubleCheck,
  insertKL8DoubleCheck,
  updateKL8DoubleCheck,
  insertXADoubleCheck,
  updateXADoubleCheck,
  type InsertOrUpdateDoubleCheckParams,
  getAllIssueListForGameRusult,
  getNextOpenTime
} from '@/api/photoSys/gameResult'
import { unitFormatDate } from '@/utils/dateFormat'
import { findDuplicates, isWithinRangeStrict } from '@/utils/filterUtils'
import showErrorMessage from '@/utils/showErrorMessage'
import { useBettingStore } from '@/stores/bettingStore'

export interface ReviewData {
  year: number | null
  issue: number | null | string
  doubleCheckNum1: number | null
  doubleCheckNum2: number | null
  doubleCheckNum3: number | null
  doubleCheckNum4: number | null
  doubleCheckNum5: number | null
  doubleCheckNum6: number | null
  doubleCheckNumTe: number | null
  doubleCheckMemo: string
  autoPush?: boolean
  updateHistoryData?: boolean
  nextOpenTime?: number | null
}
// Review 展示用数据
export interface DoubleCheckShowData {
  doubleCheckOper: string
  doubleCheckTime: string
  doubleCheckUpdateCount: number
  doubleCheckLastUpdateTime: string
}

interface Props {
  reviewData: (InsertOrUpdateDoubleCheckParams & DoubleCheckShowData) | null
  tab: Tab
  gameType: string
  yearOptions: { label: string; value: string }[]
}

type Tab = 'a' | 'hk' | 'sg' | 'tw' | 'xa' | 'kl8'

const METHODS = {
  a: {
    insert: insertADoubleCheck,
    update: updateADoubleCheck
  },
  hk: {
    insert: insertHKDoubleCheck,
    update: updateHKDoubleCheck
  },
  sg: {
    insert: insertSGDoubleCheck,
    update: updateSGDoubleCheck
  },
  tw: {
    insert: insertTWDoubleCheck,
    update: updateTWDoubleCheck
  },
  xa: {
    insert: insertXADoubleCheck,
    update: updateXADoubleCheck
  },
  kl8: {
    insert: insertKL8DoubleCheck,
    update: updateKL8DoubleCheck
  }
}
const bettingStore = useBettingStore()
const checkboxAutoPush = ref(false)
const updateHistoryData = ref(false)
const gameTypeList = computed(
  () => bettingStore.gameType.map((item) => ({ value: item.gameType, label: item.gameTypeName })) || []
)
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
const doubleCheckLastUpdateTime = ref<string | null>()
// props.reviewData.doubleCheckLastUpdateTime
const formData = reactive<ReviewData>({
  year: yearDefault,
  issue: null,
  doubleCheckNum1: null,
  doubleCheckNum2: null,
  doubleCheckNum3: null,
  doubleCheckNum4: null,
  doubleCheckNum5: null,
  doubleCheckNum6: null,
  doubleCheckNumTe: null,
  doubleCheckMemo: '',
  nextOpenTime: null
})
watch(
  () => formData.year,
  () => {
    loadIssueOptions(props.gameType, formData.year?.toString() || '')
  }
)
const activeTab = ref('gameResult')

const isLoading = ref(false)
const ishowAutoPush = ref<boolean>(false)

function checkAllNumber(reviewData) {
  return !!(
    !reviewData.doubleCheckNum1 ||
    !reviewData.doubleCheckNum2 ||
    !reviewData.doubleCheckNum3 ||
    !reviewData.doubleCheckNum4 ||
    !reviewData.doubleCheckNum5 ||
    !reviewData.doubleCheckNum6 ||
    !reviewData.doubleCheckNumTe
  )
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
async function beforeOpen() {
  updateHistoryData.value = false
  if (props.reviewData) {
    mode.value = 'update'
    formData.year = props.reviewData.year || yearDefault
    await loadIssueOptions(props.gameType, formData.year?.toString() || '')

    formData.issue = props.reviewData.issue
    formData.doubleCheckNum1 = props.reviewData.doubleCheckNum1
    formData.doubleCheckNum2 = props.reviewData.doubleCheckNum2
    formData.doubleCheckNum3 = props.reviewData.doubleCheckNum3
    formData.doubleCheckNum4 = props.reviewData.doubleCheckNum4
    formData.doubleCheckNum5 = props.reviewData.doubleCheckNum5
    formData.doubleCheckNum6 = props.reviewData.doubleCheckNum6
    formData.doubleCheckNumTe = props.reviewData.doubleCheckNumTe
    formData.doubleCheckMemo = props.reviewData.doubleCheckMemo

    if (props.reviewData.doubleCheckLastUpdateTime && checkAllNumber(props.reviewData)) {
      autoPushNotChange.value = true
      checkboxAutoPush.value = true
      isAvaliblepushBtn.value = true
      ishowAutoPush.value = true
    } else {
      autoPushNotChange.value = false
      checkboxAutoPush.value = false
      isAvaliblepushBtn.value = false
      ishowAutoPush.value = false
    }
  } else {
    mode.value = 'insert'
    formData.year = yearDefault
    await loadIssueOptions(props.gameType, formData.year?.toString() || '')
    formData.issue = issueOptionsState.data[0]?.value || ''

    formData.doubleCheckNum1 = null
    formData.doubleCheckNum2 = null
    formData.doubleCheckNum3 = null
    formData.doubleCheckNum4 = null
    formData.doubleCheckNum5 = null
    formData.doubleCheckNum6 = null
    formData.doubleCheckNumTe = null
    formData.doubleCheckMemo = ''

    autoPushNotChange.value = false
    checkboxAutoPush.value = false
    isAvaliblepushBtn.value = false
    ishowAutoPush.value = false
  }
  formData.nextOpenTime = null
}

const rules = reactive<FormRules<ReviewData>>({
  year: [{ required: true, message: '请选择年份', trigger: 'change' }],
  issue: [{ required: true, message: '请输入期数', trigger: 'change' }]
  // doubleCheckNum1: [{ validator: createValidateNum }]
})

// 正码：1～49 ※且七个号码都不能彼此重复
function createValidateNum(live: boolean) {
  const checkList = [
    formData.doubleCheckNum1,
    formData.doubleCheckNum2,
    formData.doubleCheckNum3,
    formData.doubleCheckNum4,
    formData.doubleCheckNum5,
    formData.doubleCheckNum6,
    formData.doubleCheckNumTe
  ]

  const emptyList = checkList.filter((item) => item === null)
  const duplicateList = findDuplicates(checkList) || []
  const rangeIllegal = isWithinRangeStrict(1, 49, live)(checkList)
  // 实时推送号数 可以号码不全
  if (emptyList.length > 0 && !live) {
    ElMessage({
      type: 'error',
      message: `号码不全，请填完整七个号码`
    })
    return false
  } else if (duplicateList.length > 0) {
    ElMessage({
      type: 'error',
      message: `有数字重复请检查`
    })
    return false
  } else if (rangeIllegal.illegal) {
    ElMessage({
      type: 'error',
      message: `数字不合法:${rangeIllegal.illegalValues.toString()}`
    })
    return false
  }
  return true
}
function createValidateInput() {
  const checkList = [
    formData.doubleCheckNum1,
    formData.doubleCheckNum2,
    formData.doubleCheckNum3,
    formData.doubleCheckNum4,
    formData.doubleCheckNum5,
    formData.doubleCheckNum6,
    formData.doubleCheckNumTe
  ]

  const emptyList = checkList.filter((item) => !!item)
  const pureNumList = emptyList.map((item) => Number(item)).filter((item) => !Number.isNaN(Number(item)))
  const multiContentList = emptyList.filter((item) => Number.isNaN(Number(item)))
  const validContentLength = multiContentList.filter((item) => `${item}`?.length > 1)
  console.log('pureNumList', pureNumList)
  console.log('validContentLength', validContentLength)

  const duplicateList = findDuplicates(pureNumList) || []
  const rangeIllegal = isWithinRangeStrict(1, 49, true)(pureNumList)
  // 实时推送号数 可以号码不全
  if (emptyList.length === 0) {
    ElMessage({
      type: 'error',
      message: `请输入推送内容`
    })
    return false
  }
  if (duplicateList.length > 0) {
    ElMessage({
      type: 'error',
      message: `有数字重复请检查`
    })
    return false
  }
  if (validContentLength.length > 0) {
    ElMessage({
      type: 'error',
      message: `每一项只能输入一个汉字或英文`
    })
    return false
  }
  if (pureNumList.length > 0 && rangeIllegal.illegal) {
    ElMessage({
      type: 'error',
      message: `数字不合法:${rangeIllegal.illegalValues.toString()}`
    })
    return false
  }
  return true
}

const isAvaliblepushBtn = ref(false)
const autoPushNotChange = ref(false)
const pushLoading = ref(false)

const onChangeAutoPus = async () => {
  formRef.value?.clearValidate(['doubleCheckNum1'])
  // console.log('🚀 ~ onChangeAutoPus ~ value:', value)
  isAvaliblepushBtn.value = !isAvaliblepushBtn.value
  if (isAvaliblepushBtn.value) {
    try {
      const { gameTypeCode } = bettingStore
        .getAllGetGameType()
        .find((item) => item.gameType.toString() === props.gameType.toString())!
      if (!gameTypeCode) {
        throw new Error('获取默认开奖时间失败')
      }
      const res = await getNextOpenTime(gameTypeCode)
      if (res.success) {
        formData.nextOpenTime = res.data.nextOpenTime
      } else {
        ElMessage.error(res.errMessage)
      }
    } catch (error) {
      ElMessage.error('获取默认开奖时间失败')
    }
  } else {
    formData.nextOpenTime = null
  }
}
const disabledDate = (time: Date) => {
  // Disable all dates before today (but allow today)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set to start of today
  return time.getTime() < today.getTime()
}
const handleDateTimeChange = (value: number | null) => {
  if (value) {
    const selectedTime = new Date(value)
    const now = new Date()

    if (selectedTime <= now) {
      ElMessage.warning('请选择未来时间')
      const futureTime = new Date()
      futureTime.setMinutes(futureTime.getMinutes())
      formData.nextOpenTime = futureTime.getTime()
    }
  }
}
function onSubmit() {
  formRef.value?.validate(async (valid, fields) => {
    if (valid) {
      const validnumber = checkboxAutoPush.value ? createValidateInput() : createValidateNum(false)
      if (!validnumber) {
        return
      }

      try {
        isLoading.value = true
        const method = mode.value === 'insert' ? METHODS[props.tab].insert : METHODS[props.tab].update

        formData.issue = Number(formData.issue)
        formData.autoPush = checkboxAutoPush.value
        formData.updateHistoryData = updateHistoryData.value
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

const pushPartDataOfLottry = async (autoCheck = false) => {
  autoPushNotChange.value = true
  console.log('autoCheck', autoCheck)

  const validateNumber = autoCheck ? createValidateInput() : createValidateNum(true)

  if (!validateNumber) {
    return
  }
  pushLoading.value = true
  const method = mode.value === 'insert' ? METHODS[props.tab].insert : METHODS[props.tab].update
  try {
    formData.autoPush = checkboxAutoPush.value
    const res = await method(formData)
    if (res.success) {
      ElMessage({
        type: 'success',
        message: `已发送成功`
      })
    } else {
      ElMessage.error(res.errMessage)
    }
  } catch (error) {
    ElMessage.error('操作失败')
  } finally {
    pushLoading.value = false
  }

  // setTimeout(() => {
  //   pushLoading.value = false

  // }, 2000)

  // gamenumber push
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
                <el-form-item label="年份:" prop="year" label-width="80px">
                  <el-select
                    v-model="formData.year"
                    placeholder="年份"
                    style="width: 120px"
                    @change="yearChange"
                    :disabled="mode === 'update'"
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
            <el-form-item label="正码:" prop="doubleCheckNum1" label-width="80px">
              <el-row :gutter="3" style="width: 90%" v-if="!checkboxAutoPush">
                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum1"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum2"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum3"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum4"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum5"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNum6"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>

                <el-col :span="3" :offset="1">
                  <el-input-number
                    class="input-number"
                    v-model="formData.doubleCheckNumTe"
                    :min="1"
                    :max="49"
                    step-strictly
                    controls-position="right"
                  />
                </el-col>
                <el-col :span="2" v-if="isAvaliblepushBtn">
                  <el-button
                    :loading="pushLoading"
                    style="height: 30px; line-height: 30px"
                    type="success"
                    @click="pushPartDataOfLottry()"
                  >
                    推送
                  </el-button>
                </el-col>
              </el-row>
              <el-row :gutter="3" style="width: 90%" v-else>
                <el-col :span="3" v-for="i in 6" :key="i">
                  <el-input class="input-number" maxlength="2" v-model="formData[`doubleCheckNum${i}`]" />
                </el-col>
                <el-col :span="3" :offset="1">
                  <el-input class="input-number" maxlength="2" v-model="formData.doubleCheckNumTe" />
                </el-col>
                <el-col :span="2" v-if="isAvaliblepushBtn">
                  <el-button
                    :loading="pushLoading"
                    style="height: 30px; line-height: 30px"
                    type="success"
                    @click="pushPartDataOfLottry(checkboxAutoPush)"
                  >
                    推送
                  </el-button>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="操作员:" v-if="mode === 'update'" label-width="80px">
              {{ props.reviewData?.doubleCheckOper }}
            </el-form-item>

            <el-form-item label="复核时间:" v-if="mode === 'update'" label-width="80px">
              {{
                props.reviewData?.doubleCheckTime
                  ? unitFormatDate(props.reviewData?.doubleCheckTime, 'yyyy-MM-dd HH:mm:ss')
                  : ''
              }}
            </el-form-item>

            <el-form-item label="复核次数:" v-if="mode === 'update'" label-width="80px">
              {{ props.reviewData?.doubleCheckUpdateCount }}
            </el-form-item>

            <el-form-item label="更新时间:" v-if="mode === 'update'" label-width="80px">
              {{
                props.reviewData?.doubleCheckLastUpdateTime
                  ? unitFormatDate(props.reviewData?.doubleCheckLastUpdateTime, 'yyyy-MM-dd HH:mm:ss')
                  : ''
              }}
            </el-form-item>
            <el-form-item label="备注:" prop="doubleCheckMemo" label-width="80px">
              <el-input
                v-model="formData.doubleCheckMemo"
                placeholder="备注"
                type="textarea"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
            <!-- <el-form-item>
              <el-checkbox v-model="isAvaliblepushBtn" label="自动推送" size="large" />
            </el-form-item> -->
            <el-form-item label="下期开奖:" prop="nextOpenTime" label-width="80px" v-if="isAvaliblepushBtn">
              <el-date-picker
                style="width: 40%"
                v-model="formData.nextOpenTime!"
                type="datetime"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="x"
                :disabled-date="disabledDate"
                @change="handleDateTimeChange"
              />
            </el-form-item>
            <el-form-item
              v-show="mode === 'insert' || ishowAutoPush"
              label=""
              prop="checkboxAutoPush"
              label-width="80px"
              style="margin-bottom: 0"
            >
              <el-popover
                ref="popover"
                placement="right"
                title="注："
                :width="200"
                trigger="hover"
                content="一旦点击推送按钮将直接反应到开奖历史中，无法终止推送也无法取消自动推送状态"
              >
                <template #reference>
                  <el-checkbox
                    :disabled="autoPushNotChange || updateHistoryData"
                    v-model="checkboxAutoPush"
                    @change="onChangeAutoPus()"
                    label="自动推送"
                    size="large"
                  />
                </template>
              </el-popover>
              <span v-if="autoPushNotChange" class="push_warnning">
                {{ '一旦点击推送按钮将直接反应到开奖历史中，无法终止推送也无法取消自动推送状态' }}
              </span>
            </el-form-item>
            <!-- <el-form-item
              v-show="mode === 'insert' || ishowAutoPush"
              label=""
              prop="updateHistoryData"
              label-width="80px"
            >
              <el-checkbox :disabled="checkboxAutoPush" v-model="updateHistoryData" label="修改开奖结果" size="large" />
            </el-form-item> -->
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

.push_warnning {
  color: red;
  margin-left: 10px;
}
</style>
