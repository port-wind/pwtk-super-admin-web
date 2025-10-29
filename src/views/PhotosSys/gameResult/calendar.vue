<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { Check, Delete, Connection } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import { useDeployConfig } from '@/components/checkboxTable/util'
import CalenderTable from './calenderTable/index.vue'
import type { CalendarDateType, CalendarInstance, FormInstance } from 'element-plus'
import { createOpenDate, getOpenDateList, updateOpenDate, deleteOpenDate } from '@/api/photoSys/calendar/index'
import type { IGetOpenDateListQueryParams } from '@/api/photoSys/calendar/type'
import type { IOpenDateItem } from '@/api/photoSys/calendar/type'
import { gameTypePlatformList } from '@/api/system/gameTypeManagement'
import type { IGameInfo } from '@/api/system/gameTypeManagement/type'

const categoryList = [
  { label: '澳六', value: 'a', code: 2032 }, // 7位数字      !
  { label: '台六', value: 'tw', code: 84 }, // 9位数字
  { label: '港六', value: 'hk', code: 1 }, // 3位数字        !
  { label: '新六', value: 'sg', code: 3995 }, // 7位数字
  { label: '新澳六', value: 'xa', code: 5 }, // 7位数字       !
  { label: '快乐8', value: 'kl8', code: 6 } // 7位数字       !
]

const activeTab = ref('a')

const isLoading = ref(false)
const isError = ref(false)

const isEdit = ref(false)

const modalsStore = useModalsStore()
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

const currentMonth = ref(dayjs().toDate())
console.log('🚀 ~ currentMonth:', currentMonth)

const currentMonthNumber = computed(() => dayjs(currentMonth.value).month() + 1)

const currentMonthYearNumber = computed(() => dayjs(currentMonth.value).year())

const currentGame = computed(() => categoryList.find((item) => item.value === activeTab.value))

const currentGameTypeCode = computed(() => categoryList.find((item) => item.value === activeTab.value)!.code)

// 获取当前游戏的默认开奖时间
const currentGameOpenTime = computed(() => {
  const game = gameList.value.find((item) => Number(item.gameType) === currentGameTypeCode.value)
  console.log('🚀 ~ 当前游戏类型代码:', currentGameTypeCode.value, '匹配到的游戏数据:', game)
  return game?.openTime || '10:30:00'
})

const openDateList = ref<IOpenDateItem[]>([])

const openDateListBackup = ref<IOpenDateItem[]>([])

const gameList = ref<IGameInfo[]>([])

// 表单引用
const formRef = ref<FormInstance>()

// 表单验证规则
const formRules = {
  openTime: [{ required: true, message: '请选择开奖时间', trigger: 'change' }],
  issue: [{ required: true, message: '选择一个期数', trigger: 'change' }]
}

// 判断某个标签是否被禁用
const isTabDisabled = (tabValue: string) => {
  const category = categoryList.find((item) => item.value === tabValue)
  if (!category) return false
  const gameInfo = gameList.value.find((item) => Number(item.gameType) === category.code)
  // 如果找不到游戏信息或状态不是 'y'，则禁用
  return !gameInfo || gameInfo.status !== 'y'
}

async function fetchGameTypeList() {
  const res = await gameTypePlatformList({ page: 1, size: 999 })
  console.log('🚀 ~ z8z8z8z8z8z8 fetchGameTypeList ~ res:', res)
  if (res.success) {
    gameList.value = res.data?.list || []
  }
}

// 对话框相关状态
const selectedDate = ref<string | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'new' | 'edit'>('new')
const formData = ref<IOpenDateItem & { openTime?: string }>({
  openDate: '',
  gameType: 0,
  openTime: '10:30:00',
  issue: '' as any
})

const isChange = computed(() => {
  const current = openDateList.value.map((item) => item.openDate).sort()

  const backup = openDateListBackup.value.map((item) => item.openDate).sort()

  return JSON.stringify(current) !== JSON.stringify(backup)
})

async function fetchData() {
  try {
    isLoading.value = true
    const query: IGetOpenDateListQueryParams = {
      year: currentMonthYearNumber.value,
      month: currentMonthNumber.value,
      gameType: currentGameTypeCode.value
    }
    const res = await getOpenDateList(query)
    if (res.success) {
      openDateList.value = res.data?.openDateList || []
      openDateListBackup.value = res.data?.openDateList || []
    } else {
      isError.value = true
      ElMessage.error(res.errMessage)
    }
  } catch (error) {
    console.error(error)
    isError.value = true
    ElMessage.error('获取开奖日期失败')
  } finally {
    isLoading.value = false
  }
}

async function initData() {
  console.log('initData', currentGameTypeCode.value)
  try {
    isLoading.value = true
    isError.value = false

    const query: IGetOpenDateListQueryParams = {
      year: currentMonthYearNumber.value,
      month: currentMonthNumber.value,
      gameType: currentGameTypeCode.value
    }
    const res = await getOpenDateList(query)

    // const res = await getOpenDateList(currentMonthYearNumber.value, currentMonthNumber.value, currentGameTypeCode.value)
    if (res.success) {
      // 针对接口的特殊处理
      if (!res.data) {
        openDateList.value = []
        openDateListBackup.value = []
      } else if (res.data?.openDateList.length === 0) {
        // 针对接口的特殊处理
        openDateList.value = []
        openDateListBackup.value = []
      } else {
        openDateList.value = [...res.data?.openDateList]
        openDateListBackup.value = [...res.data.openDateList]
      }
    } else {
      isError.value = true
      ElMessage.error(res.errMessage)
    }
  } catch (e) {
    console.error(e)
    isError.value = true
    ElMessage.error('获取开奖日期失败')
  } finally {
    isLoading.value = false
  }
}

function isOpenDate(date: string) {
  return openDateList.value.some((item) => item.openDate === date)
}

function handleDateClick(data: { date: Date; type: 'prev-month' | 'current-month' | 'next-month' }) {
  const dateStr = dayjs(data.date).format('YYYY-MM-DD')
  if (data.type === 'prev-month') {
    prevMonth()
  } else if (data.type === 'next-month') {
    nextMonth()
  } else {
    // 记录选中的日期
    selectedDate.value = dateStr

    if (isOpenDate(dateStr)) {
      // 点击已有数据 → 进入编辑模式，显示删除和编辑按钮
      console.log('选中已有数据')
      isEdit.value = true
    } else {
      // 点击空白日期 → 进入新建模式，显示新建按钮
      console.log('选中空白日期')
      isEdit.value = false
    }
  }
}

async function handleDeleteOpenDate() {
  if (selectedDate.value) {
    // 从列表中找到要删除的数据
    const existingData = openDateList.value.find((item) => item.openDate === selectedDate.value)

    if (existingData) {
      const res = await deleteOpenDate({
        date: existingData.openDate,
        time: existingData.openTime,
        gameType: existingData.gameType,
        issue: existingData.issue
      })

      if (res.success) {
        ElMessage.success('删除成功')
        selectedDate.value = null
        isEdit.value = false
        // 刷新数据
        await fetchData()
      } else {
        ElMessage.error(res.errMessage)
      }
    }
  }
}

const issueList = computed(() => {
  console.log('🚀 ~ issueList ~ currentMonthYearNumber:', currentMonthYearNumber.value)
  const issueList: { value: string; label: string }[] = []

  switch (currentGameTypeCode.value) {
    // 澳六
    case 2032:
      // 通过年份 + 【1-366】 变成。2025001 -- 2025366   {}
      // 1-366  变成。2025001 -- 2025366
      for (let i = 1; i <= 366; i++) {
        issueList.push({
          value: currentMonthYearNumber.value + String(i).padStart(3, '0'),
          label: currentMonthYearNumber.value + String(i).padStart(3, '0')
        })
      }
      return issueList
    // 港六
    case 1:
      for (let i = 1; i <= 200; i++) {
        issueList.push({
          value: String(i),
          label: String(i)
        })
      }
      return issueList
    // 快乐8
    case 6:
      for (let i = 1; i <= 366; i++) {
        issueList.push({
          value: currentMonthYearNumber.value + String(i).padStart(3, '0'),
          label: currentMonthYearNumber.value + String(i).padStart(3, '0')
        })
      }
      return issueList
    // 新澳六
    case 5:
      for (let i = 1; i <= 366; i++) {
        issueList.push({
          value: currentMonthYearNumber.value + String(i).padStart(3, '0'),
          label: currentMonthYearNumber.value + String(i).padStart(3, '0')
        })
      }
      return issueList
    default:
      return []
  }
})

// 重置表单
function resetForm() {
  formData.value = {
    openDate: '',
    gameType: currentGameTypeCode.value,
    issue: '',
    openTime: currentGameOpenTime.value
  }
  // 清除表单验证状态
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

async function newOpenDate() {
  if (selectedDate.value) {
    console.log('🚀 ~ 创建新开奖日期 ~ 当前游戏类型代码:', currentGameTypeCode.value)
    console.log('🚀 ~ 创建新开奖日期 ~ 匹配到的开奖时间:', currentGameOpenTime.value)

    dialogMode.value = 'new'
    formData.value = {
      openDate: selectedDate.value,
      gameType: currentGameTypeCode.value,
      issue: '',
      openTime: currentGameOpenTime.value
    }
    dialogVisible.value = true
  }
}

const calendar = ref<CalendarInstance>()

const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}

async function onUpdateOpenDate() {
  if (selectedDate.value) {
    dialogMode.value = 'edit'

    // 从 openDateList 中找到对应的数据
    const existingData = openDateList.value.find((item) => item.openDate === selectedDate.value)

    if (existingData) {
      formData.value = {
        openDate: existingData.openDate,
        gameType: existingData.gameType,
        issue: existingData.issue,
        openTime: existingData.openTime || '10:30:00' // 回填旧的时间，如果没有则使用默认值
      }
      dialogVisible.value = true
    }
  }
}

// 提交表单（新建或编辑）
async function handleSubmitForm() {
  if (!formRef.value) return

  // 使用 Element Plus 表单验证
  try {
    await formRef.value.validate()
  } catch (error) {
    console.log('表单验证失败:', error)
    return
  }

  // 获取开奖时间（已经是 HH:mm:ss 格式的字符串）
  const formattedTime = formData.value.openTime || ''

  if (dialogMode.value === 'new') {
    const res = await createOpenDate({
      date: formData.value.openDate,
      time: formattedTime,
      gameType: formData.value.gameType,
      issue: formData.value.issue
    })
    if (res.success) {
      ElMessage.success('新建成功')
      // 关闭对话框并重置状态
      dialogVisible.value = false
      selectedDate.value = null
      isEdit.value = false
      // 刷新数据
      await fetchData()
    } else {
      ElMessage.error(res.errMessage)
    }
  } else {
    // 编辑：更新列表中的数据
    const res = await updateOpenDate({
      date: formData.value.openDate,
      time: formattedTime,
      gameType: formData.value.gameType,
      issue: formData.value.issue
    })
    if (res.success) {
      ElMessage.success('编辑成功')
      // 关闭对话框并重置状态
      dialogVisible.value = false
      selectedDate.value = null
      isEdit.value = false
      // 刷新数据
      await fetchData()
    } else {
      ElMessage.error(res.errMessage)
    }
  }
}

async function nextMonth() {
  if (!isChange.value) {
    currentMonth.value = dayjs(currentMonth.value).add(1, 'month').toDate()
    initData()
  }
}

async function prevMonth() {
  if (!isChange.value) {
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'month').toDate()
    initData()
  }
}

async function nextYear() {
  if (!isChange.value) {
    currentMonth.value = dayjs(currentMonth.value).add(1, 'year').toDate()
    initData()
  }
}

async function prevYear() {
  if (!isChange.value) {
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'year').toDate()
    initData()
  }
}

// 取消选中状态
function cancelSelection() {
  selectedDate.value = null
  isEdit.value = false
}

// 点击空白区域取消选中
function handleWrapperClick(event: MouseEvent) {
  const target = event.target as HTMLElement

  // 如果点击的是按钮或按钮内的元素，不取消选中
  if (target.closest('button') || target.closest('.el-button')) {
    return
  }

  // 如果点击的是日期格子，不取消选中（因为日期有自己的点击逻辑）
  if (target.closest('.cc-calendar-date')) {
    return
  }

  // 其他情况都取消选中
  cancelSelection()
}

// 监听 ESC 键
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    cancelSelection()
  }
}

onMounted(() => {
  fetchGameTypeList()
  initData()
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyDown)
})

console.log('🚀 ~ currentGame. 99999:', currentGame)
</script>

<template>
  <div class="wrapper" @click="handleWrapperClick">
    <div class="placeholder">
      <template v-if="isEdit">
        <el-popconfirm
          title="确定删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="handleDeleteOpenDate"
        >
          <template #reference>
            <el-button :icon="Delete" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" :icon="Check" @click="onUpdateOpenDate" :loading="isLoading">编辑</el-button>
      </template>
      <el-button v-if="!isEdit && selectedDate" type="primary" :icon="Check" @click="newOpenDate" :loading="isLoading">
        新建
      </el-button>
      <!-- <el-button type="primary" :icon="Check" @click="save" :disabled="!isChange" :loading="isLoading">
          保存
        </el-button> -->

      <el-button
        :icon="Connection"
        v-if="isShowCheckboxTable"
        type="success"
        plain
        @click="() => handleSpecialClick('gameOpenDate')"
      >
        同步
      </el-button>
    </div>
    <div class="content-wrapper">
      <div class="cc-tabs">
        <el-tabs
          class="tabs-container"
          tab-position="left"
          v-model="activeTab"
          v-loading="isLoading"
          :before-leave="
            () => {
              nextTick(() => {
                initData()
              })
            }
          "
        >
          <el-tab-pane
            v-for="tab of categoryList"
            :key="tab.value"
            :label="tab.label"
            :name="tab.value"
            :disabled="isTabDisabled(tab.value)"
          />
        </el-tabs>
      </div>
      <div class="content">
        <div class="content-left">
          <el-calendar ref="calendar" class="cc-calendar" v-model="currentMonth" v-loading="isLoading">
            <template #header="scope">
              <div class="cc-calendar-header">
                <div>
                  <el-button type="primary" size="large" link @click="prevYear">
                    <el-icon size="28">
                      <DArrowLeft />
                    </el-icon>
                  </el-button>
                  <el-button type="primary" size="large" link @click="prevMonth">
                    <el-icon size="30"><ArrowLeft /></el-icon>
                  </el-button>
                </div>
                <span>{{ scope.date }}</span>
                <div>
                  <el-button type="primary" size="large" link @click="nextMonth">
                    <el-icon size="30">
                      <ArrowRight />
                    </el-icon>
                  </el-button>
                  <el-button type="primary" size="large" link @click="nextYear">
                    <el-icon size="28"><DArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>

            <template #date-cell="{ data }">
              <div :class="{ 'cc-calendar-date': true }" @click.stop="handleDateClick(data)">
                <div
                  :class="{
                    'cc-calendar-date-content': true,
                    'cc-calendar-date-selected': isOpenDate(dayjs(data.date).format('YYYY-MM-DD')),
                    'cc-calendar-date-new-selected': selectedDate === dayjs(data.date).format('YYYY-MM-DD') && !isEdit,
                    'cc-calendar-date-edit-selected': selectedDate === dayjs(data.date).format('YYYY-MM-DD') && isEdit,
                    'no-select': true
                  }"
                >
                  {{ dayjs(data.date).date() }}
                </div>
              </div>
            </template>
          </el-calendar>
        </div>
        <div class="content-right">
          <CalenderTable :data="openDateList" />
        </div>
      </div>
    </div>

    <!-- 新建/编辑开奖日期对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'new' ? '新建开奖日期' : '编辑开奖日期'"
      width="500px"
      @close="resetForm"
      @click="(event) => event.stopPropagation()"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="开奖日期">
          <el-input v-model="formData.openDate" disabled />
        </el-form-item>

        <el-form-item label="游戏类型">
          <!-- <el-input :value="categoryList.find((item) => item.code === formData.gameType)?.label" disabled /> -->
          {{ currentGame?.label }}
        </el-form-item>

        <el-form-item label="开奖时间" prop="openTime" required>
          <el-time-picker
            v-model="formData.openTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            placeholder="选择开奖时间"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="期数" prop="issue" required>
          <!-- <el-input-number v-model="formData.issue as any" :min="1" placeholder="请输入期数" style="width: 100%" /> -->
          <el-select v-model="formData.issue" placeholder="请选择期数" style="width: 100%" filterable>
            <el-option v-for="item in issueList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm">
          {{ dialogMode === 'new' ? '确定' : '保存' }}
        </el-button>
      </template>
    </el-dialog>

    <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
  </div>
</template>

<style scoped>
.wrapper {
  height: calc(100% - 52px);
}

.placeholder {
  height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  max-width: 1092px;
  padding-right: 3px;
  justify-content: flex-end;
}

.content-wrapper {
  display: flex;
  height: calc(100% - 60px);
}

.cc-tabs {
  height: 100%;
  width: 82px;
}

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.content-right {
  max-width: 450px;
}

.cc-calendar {
  border: 2px solid #ebeef5;
  margin-left: -2px;
  max-width: 560px;
  height: fit-content;
  border-radius: 20px;
}

.cc-calendar-header {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #409eff44;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}

.cc-calendar-header span {
  font-size: 24px;
  font-weight: bold;
  color: #31394c;
}

.cc-calendar-date {
  background-color: white;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cc-calendar-date-content {
  font-size: 24px;
  color: #31394c;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #409eff;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  color: #409eff;
}

.cc-calendar-date-selected {
  width: 40px;
  height: 40px;
  background-color: #409eff;
  border-radius: 20px;
  color: white;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
}

/* 新建模式：紫色圈（空白日期被选中） */
.cc-calendar-date-new-selected {
  border: 3px solid #9333ea !important;
  box-shadow: 0 0 12px 0 rgba(147, 51, 234, 0.3) !important;
}

/* 编辑模式：紫色外圈（已有数据被选中） */
.cc-calendar-date-edit-selected {
  box-shadow: 0 0 0 3px #9333ea, 0 0 12px 0 rgba(147, 51, 234, 0.4) !important;
}

.cc-calendar :deep(.el-calendar-day) {
  padding: 0px;
}

.cc-calendar :deep(.prev) {
  border: none;
}

.cc-calendar :deep(.current) {
  border: none;
}

.cc-calendar :deep(.next) {
  border: none;
}

.cc-calendar :deep(.prev .cc-calendar-date .cc-calendar-date-content) {
  color: darkgray;
  border: none;
}

.cc-calendar :deep(.next .cc-calendar-date .cc-calendar-date-content) {
  color: darkgray;
  border: none;
}

.cc-calendar :deep(thead th) {
  color: #31394c;
  font-weight: bold;
}

.cc-calendar :deep(.el-calendar__body) {
  padding-bottom: 0px;
}

.no-select {
  user-select: none; /* 禁止文字选中 */
  -webkit-user-select: none; /* 针对Webkit内核的浏览器 (Chrome, Safari) */
  -moz-user-select: none; /* 针对Firefox */
  -ms-user-select: none; /* 针对IE/Edge */
}

.cc-calendar :deep(.el-calendar__header) {
  padding: 0px;
  border-bottom: 0px;
}

/* 禁用标签的样式 */
.cc-tabs :deep(.el-tabs__item.is-disabled) {
  color: #c0c4cc !important;
  cursor: not-allowed !important;
  opacity: 0.5;
}

.cc-tabs :deep(.el-tabs__item.is-disabled):hover {
  color: #c0c4cc !important;
}
</style>
