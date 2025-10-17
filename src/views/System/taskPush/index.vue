<template>
  <div id="system_account">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left" label-width="70px">
        <el-form-item label="" prop="taskName">
          <AutoComplete
            v-model="queryForm.taskName"
            :httpFunc="reqHttp"
            keyword="taskName"
            placeholder="任务名称"
            :displayFields="['taskName']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item label="" prop="taskType">
          <el-select v-model="queryForm.taskType" placeholder="类型" clearable>
            <el-option value="onetime" />
            <el-option value="circle" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1, size: pageSize })" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- Data Table -->
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #taskError="{ scope }">
          <span v-if="scope.row.taskError" class="like-a" @click="showErrorInfo(scope.row)">查看</span>
        </template>
        <template #startTime="{ scope }">
          {{ unitFormatDate(scope.row.startTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
    <!-- 异常弹窗 -->
    <section class="dialogErrorMessage">
      <el-dialog v-model="isShowError" class="tabs-dialog">
        <el-tabs v-model="activeTab" class="m_tabs">
          <el-tab-pane label="异常" name="first" class="m_tabs_pane">
            <el-scrollbar>
              <p>{{ lineFormData.taskError }}</p>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import count from '@/utils/tableHeight'

import { Search, Refresh } from '@element-plus/icons-vue'

import { reqHttp } from '@/api/system/taskPush/index'
import { options } from '@/views/System/taskPush/data'

import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'

const tableRef = ref()
const queryRef = ref()

const tableData = ref<any[]>([])

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//tabs
const activeTab = ref('first')

//loading 按钮
const isLoading = ref(false)

//窗口控制
const isShowError = ref(false)

const initForm = {
  taskId: '',
  taskName: '',
  taskType: '',
  taskRef: ''
}

const queryForm = ref(initForm)

//一行信息
const lineFormData = ref()

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

//页面初始化获取数据
const fetchData = async (_queryForm?) => {
  if (_queryForm?.page) {
    currentPage.value = _queryForm.page
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  params = queryForm ? { ...params, ...queryForm.value } : params
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
      if (total.value < (currentPage.value - 1) * pageSize.value) {
        currentPage.value = 1
        fetchData()
      }
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

const resetButton = () => {
  queryRef.value.resetFields()
  currentPage.value = 1
  fetchData()
}

const showErrorInfo = (row) => {
  lineFormData.value = row
  isShowError.value = true
}

onMounted(fetchData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
