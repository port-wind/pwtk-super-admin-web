<script setup lang="ts">
import { ArrowLeft } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { getOpenDateList, editOpenDate, type OpenDateItem, type EditOpenDateParams } from '@/api/photoSys/gameResult'
import { Check, RefreshLeft } from '@element-plus/icons-vue'
import { nextTick } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import { useDeployConfig } from '@/components/checkboxTable/util'

const categoryList = [
  { label: '澳六', value: 'a', code: 2032 },
  { label: '台六', value: 'tw', code: 84 },
  { label: '港六', value: 'hk', code: 1 },
  { label: '新六', value: 'sg', code: 3995 },
  { label: '新澳六', value: 'xa', code: 5 },
  { label: '快乐8', value: 'kl8', code: 6 }
]

const activeTab = ref('a')

const isLoading = ref(false)
const isError = ref(false)

const modalsStore = useModalsStore()
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

const currentMonth = ref(dayjs().toDate())

const currentMonthNumber = computed(() => dayjs(currentMonth.value).month() + 1)

const currentMonthYearNumber = computed(() => dayjs(currentMonth.value).year())

const currentGameTypeCode = computed(() => categoryList.find((item) => item.value === activeTab.value)!.code)

const openDateList = ref<OpenDateItem[]>([])

const openDateListBackup = ref<OpenDateItem[]>([])

const isChange = computed(() => {
  const current = openDateList.value.map((item) => item.openDate).sort()

  const backup = openDateListBackup.value.map((item) => item.openDate).sort()

  return JSON.stringify(current) !== JSON.stringify(backup)
})

async function initData() {
  console.log('initData', currentGameTypeCode.value)
  try {
    isLoading.value = true
    isError.value = false

    const res = await getOpenDateList(currentMonthYearNumber.value, currentMonthNumber.value, currentGameTypeCode.value)
    if (res.success) {
      // 针对接口的特殊处理
      if (res.data == '') {
        openDateList.value = []
        openDateListBackup.value = []
      }
      // 针对接口的特殊处理
      else if (res.data.openDateList == '') {
        openDateList.value = []
        openDateListBackup.value = []
      } else {
        openDateList.value = [...res.data.openDateList]
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
    if (isOpenDate(dateStr)) {
      openDateList.value = openDateList.value.filter((item) => item.openDate !== dateStr)
    } else {
      openDateList.value.push({
        openDate: dateStr,
        gameType: currentGameTypeCode.value,
        issue: null
      })
    }
  }
}

function reset() {
  openDateList.value = [...openDateListBackup.value]
}

async function save() {
  const params: EditOpenDateParams = {
    openDateList: openDateList.value,
    gameType: currentGameTypeCode.value,
    year: currentMonthYearNumber.value,
    month: currentMonthNumber.value
  }

  try {
    isLoading.value = true
    const res = await editOpenDate(params)
    if (res.success) {
      ElMessage.success('保存成功')
      initData()
    } else {
      ElMessage.error(res.errMessage)
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('保存失败')
  } finally {
    isLoading.value = false
  }
}

async function nextMonth() {
  if (!isChange.value || (await beforeLeave())) {
    currentMonth.value = dayjs(currentMonth.value).add(1, 'month').toDate()
    initData()
  }
}

async function prevMonth() {
  if (!isChange.value || (await beforeLeave())) {
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'month').toDate()
    initData()
  }
}

async function nextYear() {
  if (!isChange.value || (await beforeLeave())) {
    currentMonth.value = dayjs(currentMonth.value).add(1, 'year').toDate()
    initData()
  }
}

async function prevYear() {
  if (!isChange.value || (await beforeLeave())) {
    currentMonth.value = dayjs(currentMonth.value).subtract(1, 'year').toDate()
    initData()
  }
}

async function beforeLeave(): Promise<boolean> {
  try {
    await ElMessageBox.confirm('有未保存的修改，是否离开当前月份？', '提示', {
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      type: 'warning'
    })
    return true
  } catch (error) {
    return false
  }
}
onMounted(() => {
  initData()
})
</script>

<template>
  <div class="wrapper">
    <div class="placeholder">
      <el-button :icon="RefreshLeft" @click="reset" :loading="isLoading">复原</el-button>
      <el-button type="primary" :icon="Check" @click="save" :disabled="!isChange" :loading="isLoading">保存</el-button>
      <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('gameOpenDate')">
        <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
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
          <el-tab-pane v-for="tab of categoryList" :key="tab.value" :label="tab.label" :name="tab.value" />
        </el-tabs>
      </div>
      <div class="content">
        <el-calendar class="cc-calendar" v-model="currentMonth" v-loading="isLoading">
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
                  'no-select': true
                }"
              >
                {{ dayjs(data.date).date() }}
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
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
</style>
