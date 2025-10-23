<script setup lang="ts">
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import { unitFormatDate } from '@/utils/dateFormat'
import {
  type ListParams,
  type HistoryItem,
  getAHistory,
  getHKHistory,
  getSGHistory,
  getTWHistory,
  getXAHistory,
  getKL8History,
  updateSettleCheck
} from '@/api/photoSys/gameResult'
import { View } from '@element-plus/icons-vue'
import { gameTypeMapToCode } from '@/stores/bettingStore'
import useIssueOptionLogic from '../useIssueOptionLogic'
import useYearOptionLogic from '../useYearOptionLogic'
import { tableOptions } from './data'
import type { Tab } from '../data'
import { dayjs, type FormRules } from 'element-plus'

interface IProps {
  tab: Tab
}

const props = defineProps<IProps>()
const { issueOptionsState, loadIssueOptions } = useIssueOptionLogic()
const { yearOptionsState, loadYearOptionsByGameType } = useYearOptionLogic()
const isLoading = ref(false)
const isError = ref(false)
const total = ref<number>(0)
const pageSize = ref(15)
const currentPage = ref(1)
const activeTab = ref<Tab>(props.tab)

const searchBarOptions: SearchOption[] = [
  {
    prop: 'year',
    type: 'select',
    slot: 'year'
  },
  {
    prop: 'issue',
    type: 'select',
    slot: 'issue'
  }
]
const searchBtnOptions: SearchBtnOptions = { isSearch: true, isReset: true, isAdd: false, isEdit: false }

const params = ref<ListParams>({
  page: 1,
  size: 15,
  year: '',
  issue: ''
})
const paramsIssue = ref<string>('')
const paramsYear = ref<string>('')
const history = ref<HistoryItem[]>([])
const showSync = ref(false)
function onClickGlobalSync() {
  showSync.value = true
}

const yearChange = async () => {
  console.log('yearChange', paramsYear.value)
  await resetIssue(activeTab.value)
  // paramsIssue.value = issueOptionsState.data[0]?.value || ''
}

const resetIssue = async (tab: Tab) => {
  paramsIssue.value = ''
  params.value.issue = ''
  const gameType = gameTypeMapToCode(tab)
  await loadIssueOptions(String(gameType), paramsYear.value?.toString() || '')
}

async function initHistory(_tab: Tab) {
  let method

  switch (_tab) {
    case 'a':
      method = getAHistory
      break
    case 'hk':
      method = getHKHistory
      break
    case 'sg':
      method = getSGHistory
      break
    case 'tw':
      method = getTWHistory
      break
    case 'xa':
      method = getXAHistory
      break
    case 'kl8':
      method = getKL8History
      break
    default:
      throw Error('彩种代码未找到')
  }

  try {
    isLoading.value = true
    isError.value = false
    const res = await method(params.value)
    if (!res.success) {
      isError.value = true
      total.value = 0
      return
    }

    total.value = Number(res.data.total ?? '0')
    history.value = (res.data.list as any) === '' ? [] : res.data.list
  } catch (error) {
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

const onView = (row: HistoryItem) => {
  console.log('onView', row)
  formRef.value?.resetFields()
  visible.value = true
  formData.value = {
    issue: row.issue,
    year: row.year,
    doubleCheckNum1: row.num1,
    doubleCheckNum2: row.num2,
    doubleCheckNum3: row.num3,
    doubleCheckNum4: row.num4,
    doubleCheckNum5: row.num5,
    doubleCheckNum6: row.num6,
    doubleCheckNumTe: row.teNum,
    doubleCheckMemo: row.doubleCheckMemo
  }
}

const visible = ref(false)

interface IFormData {
  issue: number
  year: number
  doubleCheckMemo: string
  doubleCheckNum1: number
  doubleCheckNum2: number
  doubleCheckNum3: number
  doubleCheckNum4: number
  doubleCheckNum5: number
  doubleCheckNum6: number
  doubleCheckNumTe: number
}

const formData = ref<IFormData>({
  issue: 0,
  year: 0,
  doubleCheckNum1: 0,
  doubleCheckNum2: 0,
  doubleCheckNum3: 0,
  doubleCheckNum4: 0,
  doubleCheckNum5: 0,
  doubleCheckNum6: 0,
  doubleCheckNumTe: 0,
  doubleCheckMemo: ''
})
const baseRules = {
  doubleCheckNum1: [{ validator: createValidateNum(1, '正码1'), trigger: 'blur' }],
  doubleCheckNum2: [{ validator: createValidateNum(2, '正码2'), trigger: 'blur' }],
  doubleCheckNum3: [{ validator: createValidateNum(3, '正码3'), trigger: 'blur' }],
  doubleCheckNum4: [{ validator: createValidateNum(4, '正码4'), trigger: 'blur' }],
  doubleCheckNum5: [{ validator: createValidateNum(5, '正码5'), trigger: 'blur' }],
  doubleCheckNum6: [{ validator: createValidateNum(6, '正码6'), trigger: 'blur' }],
  doubleCheckNumTe: [{ validator: createValidateNum(7, '特码'), trigger: 'blur' }]
}

const validateIssue = (rule: any, value: any, callback: any) => {
  const strValue = String(value)
  if (strValue.length !== 7) {
    callback(new Error('请输入7位期数'))
    return
  }
  const num = Number(value)
  if (isNaN(num)) {
    callback(new Error('请输入数字'))
    return
  }
  callback()
}

const validatorHk = (rule: any, value: any, callback: any) => {
  const strValue = String(value)
  if (strValue.length !== 3) {
    callback(new Error('请输入3位期数'))
    return
  }
  const num = Number(value)
  if (isNaN(num)) {
    callback(new Error('请输入数字'))
    return
  }
  if (num < 100 || num > 999) {
    callback(new Error('请输入100-999的期数'))
    return
  }
  callback()
}

const getRules = computed(() => {
  // 台六（无限制）    新六  新澳六   快乐8 澳六 （7位数字）   港六 （3个数字不带）
  switch (activeTab.value as Tab) {
    case 'hk':
      return {
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { validator: validatorHk, trigger: 'blur' }
        ],
        ...baseRules
      }
    case 'a':
      return {
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { validator: validateIssue, trigger: 'blur' }
        ],
        ...baseRules
      }
    case 'sg':
      return {
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { validator: validateIssue, trigger: 'blur' }
        ],
        ...baseRules
      }
    case 'tw':
      return {
        issue: [{ required: true, message: '请输入期数', trigger: 'blur' }],
        ...baseRules
      }
    case 'xa':
      return {
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { validator: validateIssue, trigger: 'blur' }
        ],
        ...baseRules
      }
    case 'kl8':
      return {
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { validator: validateIssue, trigger: 'blur' }
        ],
        ...baseRules
      }
    default:
      return {
        issue: [{ required: true, message: '请输入期数', trigger: 'blur' }],
        ...baseRules
      }
  }
})

// 正码：1～49 ※且七个号码都不能彼此重复
function createValidateNum(index: number, label: string) {
  return function (rule: any, _value: any, callback: any) {
    const checkList = [
      formData.value.doubleCheckNum1,
      formData.value.doubleCheckNum2,
      formData.value.doubleCheckNum3,
      formData.value.doubleCheckNum4,
      formData.value.doubleCheckNum5,
      formData.value.doubleCheckNum6,
      formData.value.doubleCheckNumTe
    ]

    const value = checkList[index - 1]

    // 检查是否为空或未定义
    if (value === null || value === undefined || String(value).trim() === '') {
      callback(new Error(`请输入${label}`))
      return
    }

    // 转换为数字
    const numValue = Number(value)

    // 检查是否为有效数字
    if (isNaN(numValue)) {
      callback(new Error(`${label}必须是数字`))
      return
    }

    // 检查范围
    if (numValue < 1 || numValue > 49) {
      callback(new Error(`${label}只能是1～49`))
      return
    }

    // 检查重复 - 移除当前号码自身的比较
    const checkListCopy = [...checkList]
    checkListCopy.splice(index - 1, 1)

    // 转换为数字进行比较
    const duplicateFound = checkListCopy.some((item) => {
      return item !== null && item !== undefined && String(item).trim() !== '' && Number(item) === numValue
    })

    if (duplicateFound) {
      callback(new Error(`${label}不能与其他号码重复`))
      return
    }

    callback()
  }
}

const formRef = ref()

const onSubmit = async () => {
  isLoading.value = true
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    console.log('🚀 ~ onSubmit ~ valid:', valid)
    if (!valid) return

    const res = await updateSettleCheck(gameTypeMapToCode(activeTab.value.toString()).toString(), {
      issue: formData.value.issue,
      year: formData.value.year,
      doubleCheckMemo: formData.value.doubleCheckMemo,
      doubleCheckNum1: formData.value.doubleCheckNum1,
      doubleCheckNum2: formData.value.doubleCheckNum2,
      doubleCheckNum3: formData.value.doubleCheckNum3,
      doubleCheckNum4: formData.value.doubleCheckNum4,
      doubleCheckNum5: formData.value.doubleCheckNum5,
      doubleCheckNum6: formData.value.doubleCheckNum6,
      doubleCheckNumTe: formData.value.doubleCheckNumTe,
      updateHistoryData: true
    })

    if (res.success) {
      ElMessage.success('提交成功')
      visible.value = false
      formRef.value?.resetFields()
      // 刷新列表数据
      await initHistory(activeTab.value)
    } else {
      ElMessage.error(res.errMessage)
    }
  } catch (error) {
    console.error('表单验证失败', error)
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadYearOptionsByGameType(gameTypeMapToCode(activeTab.value.toString()).toString())
  await initHistory(activeTab.value)
})
</script>

<template>
  <div class="search-bar">
    <m-search
      class="cc-search"
      :isLoading="isLoading"
      :formOptions="searchBarOptions"
      :buttonOptions="searchBtnOptions"
      style="margin-right: -10px"
      @query="
        (e) => {
          if (!e) return
          params.issue = paramsIssue
          params.year = paramsYear
          initHistory(activeTab)
        }
      "
      @reset="
        () => {
          params = {
            page: 1,
            size: 15,
            year: '',
            issue: ''
          }
          paramsIssue = ''
          paramsYear = ''
          initHistory(activeTab)
        }
      "
    >
      <template #issue>
        <el-select
          v-model="paramsIssue"
          placeholder="期数"
          style="width: 150px"
          :disabled="!paramsYear"
          :loading="issueOptionsState.loading"
        >
          <el-option
            v-for="(item, index) in issueOptionsState.data"
            :label="item.label"
            :value="item.value"
            :key="index"
          />
        </el-select>
      </template>

      <template #year>
        <el-select v-model="paramsYear" placeholder="年份" style="width: 120px" @change="yearChange">
          <el-option
            v-for="(item, index) in yearOptionsState.data"
            :label="item.label"
            :value="item.value"
            :key="index"
          />
        </el-select>
      </template>
    </m-search>
  </div>

  <m-table
    :options="tableOptions"
    :data="history"
    tableHeight="calc(100vh - 310px)"
    :total="total"
    :currentPage="currentPage"
    :pageSize="pageSize"
    @size-change="
            (val:number) => {
              params.size = val
              pageSize = val
              params.page = 1
              currentPage = 1
              initHistory(activeTab)
            }
          "
    @current-change="
            (val:number) => {
              params.page = val
              currentPage = val
              initHistory(activeTab)
            }
          "
    stripe
    pagination
  >
    <template #openTime="{ scope }">
      {{ unitFormatDate(scope.row.openTime, 'yyyy-MM-dd HH:mm:ss') }}
    </template>

    <template #result="{ scope }">
      <div style="display: inline-flex; align-items: center">
        <lottoBall
          v-for="i in 6"
          :key="i"
          :number="scope.row.numInfo[i - 1].num"
          :color="scope.row.numInfo[i - 1].color"
          :zodiacSigns="scope.row.numInfo[i - 1].shengxiao"
        />
        <span style="margin: 0 2px">+</span>
        <lottoBall
          :number="scope.row.numInfo[6].num"
          :color="scope.row.numInfo[6].color"
          :zodiacSigns="scope.row.numInfo[6].shengxiao"
        />
      </div>
    </template>
    <template #operator="{ scope }">
      <el-button size="small" type="primary" @click="onView(scope.row)" :icon="View">选择</el-button>
    </template>
  </m-table>

  <el-dialog v-model="visible" title="编辑开奖结果" :loading="isLoading" width="70%">
    <el-form ref="formRef" :model="formData" :rules="getRules" label-width="120px">
      <el-form-item label="期数" prop="issue">
        <el-input v-model="formData.issue" style="max-width: 160px" />
      </el-form-item>
      <el-form-item label="" prop="year" style="display: none">
        <el-input v-model="formData.year" />
      </el-form-item>
      <el-form-item label="正码:">
        <div class="form-row">
          <el-form-item prop="doubleCheckNum1" class="form-item">
            <el-input-number v-model="formData.doubleCheckNum1" :min="1" :max="49" controls-position="right" />
          </el-form-item>
          <el-form-item prop="doubleCheckNum2" class="form-item">
            <el-input-number v-model="formData.doubleCheckNum2" :min="1" :max="49" controls-position="right" />
          </el-form-item>
          <el-form-item prop="doubleCheckNum3" class="form-item">
            <el-input-number v-model="formData.doubleCheckNum3" :min="1" :max="49" controls-position="right" />
          </el-form-item>
          <el-form-item prop="doubleCheckNum4" class="form-item">
            <el-input-number v-model="formData.doubleCheckNum4" :min="1" :max="49" controls-position="right" />
          </el-form-item>
          <el-form-item prop="doubleCheckNum5" class="form-item">
            <el-input-number v-model="formData.doubleCheckNum5" :min="1" :max="49" controls-position="right" />
          </el-form-item>
          <el-form-item prop="doubleCheckNum6" class="form-item">
            <el-input-number
              v-model="formData.doubleCheckNum6"
              :min="1"
              :max="49"
              placeholder="1-49"
              controls-position="right"
              input-style="text-align: center;"
            />
          </el-form-item>
          <el-form-item prop="doubleCheckNumTe" class="form-item form-item-te">
            <el-input-number
              v-model="formData.doubleCheckNumTe"
              type="number"
              :min="1"
              :max="49"
              placeholder="特码"
              controls-position="right"
              input-style="text-align: center;"
            />
          </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="备注:" prop="doubleCheckMemo">
        <el-input v-model="formData.doubleCheckMemo" type="textarea" style="max-width: 667px" />
      </el-form-item>
      <el-form-item>
        <div class="cc-submit">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="visible = false">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.placeholder {
  height: 60px;
  width: 100%;
}

.search-bar {
  display: flex;
  padding: 2px;
  gap: 20px;
}

.cc-search :deep(.el-form-item) {
  margin-right: 10px;
}

.form-row {
  display: flex;
  gap: 3px;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.form-item {
  width: 90px;
}
.form-item-te {
  margin-left: 20px;
}
.cc-submit {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
