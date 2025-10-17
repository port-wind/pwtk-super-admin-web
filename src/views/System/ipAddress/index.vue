<template>
  <div id="system_account">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left" label-width="70px">
        <el-form-item label="" prop="ip">
          <AutoComplete
            v-model="queryForm.ip"
            :httpFunc="reqHttp"
            keyword="ip"
            placeholder="IP"
            :displayFields="['ip']"
            :trigger-on-focus="true"
            isPage
            isList
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData({ page: 1 })" :loading="isLoading">
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
        <template #time="{ scope }">
          {{ unitFormatDate(scope.row.lastUpdateTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
      </m-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import count from '@/utils/tableHeight'

import { Search, Refresh } from '@element-plus/icons-vue'

import { reqHttp } from '@/api/system/ipAddress/index'
import { options } from '@/views/System/ipAddress/data'

import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'

const tableRef = ref()
const queryRef = ref()

const tableData = ref<any[]>([])

const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//loading 按钮
const isLoading = ref(false)

const initForm = {
  ip: ''
}

const queryForm = ref(initForm)

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
    size: pageSize.value,
    sortName: 'last_update_time',
    sortOrder: 'DESC'
  }
  params = { ...params, ...queryForm.value }
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

onMounted(fetchData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
