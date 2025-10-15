<template>
  <div id="system_account" class="main_container">
    <div class="gray-box">
      <el-row :gutter="20">
        <!-- Score statistics -->
        <el-col :span="3">
          <el-statistic title="积分" :value="displayScore" :value-style="fontStyle(true)"></el-statistic>
          <!-- <div class="stat-header">积分</div>
          <div class="stat-content">
            {{ displayScore.toFixed(0) }}
          </div> -->
        </el-col>
        <el-col :span="3">
          <el-statistic
            title="累计发放积分"
            :value="displayTotalScore"
            :value-style="fontStyle(false)"
            @click="viewScoreDetails({ type: '1' })"
          ></el-statistic>
        </el-col>
        <el-col :span="3">
          <el-statistic
            title="累计消耗积分"
            :value="displayConsumeScore"
            :value-style="fontStyle(false)"
            @click="viewScoreDetails({ type: '2' })"
          ></el-statistic>
        </el-col>
        <el-col :span="3">
          <span class="blue-link" @click="viewScoreDetails">查看积分明细</span>
        </el-col>

        <!-- Star statistics -->
        <el-col :span="3">
          <el-statistic title="可用星星" :value="displayStar" :value-style="fontStyle(true)"></el-statistic>
        </el-col>
        <el-col :span="3">
          <el-statistic
            title="累计发放星星"
            :value="displayTotalStar"
            :value-style="fontStyle(false)"
            @click="viewStarDetails({ type: '1' })"
          ></el-statistic>
        </el-col>
        <el-col :span="3">
          <el-statistic
            title="累计消耗星星"
            :value="displayConsumeStar"
            :value-style="fontStyle(false)"
            @click="viewStarDetails({ type: '2' })"
          ></el-statistic>
        </el-col>
        <el-col :span="3">
          <span class="blue-link link-url-text" @click="viewStarDetails">查看星星明细</span>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button type="primary" @click="editBaseConfig">修改基础配置</el-button>
    </div>
    <!-- Data Table -->
    <section class="main_flex_table">
      <m-table
        class="m_table_image"
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></m-table>
    </section>
  </div>
  <!-- 新增 弹出框 -->
  <base-config-tab v-if="modalsStore.editBaseConfigModal.isVisible" @refresh="fetchData" />
  <!-- 编辑 -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTransition } from '@vueuse/core'
// import i18n from '@/i18n'
// const { t } = i18n.global as any
import showErrorMessage from '@/utils/showErrorMessage'
import { reqPointRules, reqScoreStatistics, reqStarStatistics } from '@/api/user/pointRules'
import { TableOptions } from '@/components/mTable/types'
import router from '@/router'
//上传相关
import { useModalsStore, useValueBus } from '@/stores/modalStore'
const valueBus = useValueBus()
const tableData = ref<any[]>([])
const modalsStore = useModalsStore()
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const fontStyle = (plain: boolean) => {
  return plain
    ? { fontSize: '24px', fontWeight: 'bold' }
    : { color: '#409eff', cursor: 'pointer', fontSize: '24px', fontWeight: 'bold' }
}

//新增弹窗
const addDialogVisible = ref(false)

//loading 按钮
const isLoading = ref(false)

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
    } else {
      console.log('表单验证失败')
    }
  })
}

// Define individual stat values and their transitions
const score = ref(0)
const displayScore = useTransition(score, { duration: 1500 })

const totalScore = ref(0)
const displayTotalScore = useTransition(totalScore, { duration: 1500 })

const consumeScore = ref(0)
const displayConsumeScore = useTransition(consumeScore, { duration: 1500 })

const star = ref(0)
const displayStar = useTransition(star, { duration: 1500 })

const totalStar = ref(0)
const displayTotalStar = useTransition(totalStar, { duration: 1500 })

const consumeStar = ref(0)
const displayConsumeStar = useTransition(consumeStar, { duration: 1500 })

const viewScoreDetails = (data: any) => {
  console.log('查看积分明细')
  valueBus.resetValue('pointDetailModal')
  valueBus.setValue('pointDetailModal', { ...data, componentKey: Math.random() })
  router.push('/user/pointDetail').catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
    }
  })
}

const viewStarDetails = (data: any) => {
  console.log('查看星星明细')
  valueBus.resetValue('starDetailModal')
  valueBus.setValue('starDetailModal', { ...data, componentKey: Math.random() })
  router.push('/user/starDetail').catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
    }
  })
}

const editBaseConfig = () => {
  console.log('修改基础配置')
  modalsStore.editBaseConfigModal.isVisible = true
}

// Update the onMounted function
onMounted(async () => {
  try {
    const scoreRes: any = await reqScoreStatistics()
    const starRes: any = await reqStarStatistics()
    console.log('data', scoreRes, starRes)
    const scoreData = scoreRes.data
    const starData = starRes.data

    // Update each stat value
    score.value = Number(scoreData?.availableTotal)
    totalScore.value = Number(scoreData?.grandTotal)
    consumeScore.value = Number(scoreData?.consumeTotal)
    star.value = Number(starData?.availableTotal)
    totalStar.value = Number(starData?.grandTotal)
    consumeStar.value = Number(starData?.consumeTotal)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
  fetchData()
})

const options = ref<TableOptions[]>([
  {
    label: '规则名称',
    prop: 'bizName'
  },
  {
    label: '规则详情',
    prop: 'bizDesc'
  },
  {
    label: '更新时间',
    prop: 'createTime',
    dateName: 'createTime'
  }
])
//页面初始化获取数据
const fetchData = async () => {
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }

  isLoading.value = true
  try {
    const response = await reqPointRules(params)
    if (response.success) {
      tableData.value = response!.data!.list
      total.value = Number(response!.data!.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
.gray-box {
  background-color: #f5f7fa;
  border: none;
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.el-row {
  margin-bottom: 0;
}

.el-col {
  margin-bottom: 10px;
  padding: 10px;
}

.stat-header {
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}

.stat-content {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blue-text {
  color: #409eff !important;
}
.blue-text-hover {
  color: #409eff !important;
  cursor: pointer;
  :deep(.el-statistic__number) {
    color: #409eff !important;
  }
}
.blue-link {
  color: #409eff;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
}
</style>
