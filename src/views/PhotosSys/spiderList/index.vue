<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form
        :inline="true"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
        @keyup.enter="fetchData({ page: 1, size: 15 })"
      >
        <el-form-item label="" prop="baseUrl">
          <el-input v-model.trim="queryForm.baseUrl" placeholder="目标URL" />
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="状态" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option label="启用" value="y" />
            <el-option label="关闭" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="startTime">
          <TimeSelect
            start-placeholder="发布开始时间"
            end-placeholder="发布结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData()" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="() => handleAddButton()">
            <el-icon>
              <Plus />
            </el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        :pagination="true"
        stripe
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #baseUrl="{ scope }">
          <p class="like-a overflow-hidden" @click="handleURLEdit(scope)">
            {{ truncateText(scope.row.baseUrl, 20) }}
          </p>
        </template>
        <template #status="{ scope }">
          {{ scope.row.status === 'y' ? '启用' : '关闭' }}
          <status-toggle
            v-if="scope.row.status"
            v-model="scope.row.status"
            :field-name="'status'"
            :item="scope.row"
            :update-api="updateStatus"
            @refresh-needed="fetchData"
          />
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #remark="{ scope }">
          {{ truncateText(scope.row.remark, 15) }}
        </template>
      </m-table>
    </section>
  </section>
  <spider-dialog v-if="addDialogVisible" v-model="addDialogVisible" @refresh="fetchData" :id="selectedId" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSpiderList, updateStatus } from '@/api/photoSys/spider'
import type { IReqHttpBBsForumListData, IReqHttpBBsForumListQueryParams } from '@/api/bss/postContentManagement/types'

import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { truncateText } from '@/utils/dataFormat'

import { unitFormatDate } from '@/utils/dateFormat'

const queryRef = ref()
const tableData = ref<IReqHttpBBsForumListData[]>([])
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)

const addDialogVisible = ref(false)
const selectedId = ref('')
const initForm = (): any => ({
  baseUrl: '',
  status: 'L',
  startTime: '',
  endTime: '',
  page: 1,
  size: 15
})

const queryForm = reactive<any>(initForm())
const options = ref<any[]>([
  {
    prop: 'baseUrl',
    label: '目标URL',
    slot: 'baseUrl',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    slot: 'createTime',
    columAttr: { minWidth: 200 }
  },
  {
    prop: 'remark',
    label: '备注',
    slot: 'remark',
    columAttr: { minWidth: 200 }
  }
])

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  queryForm.size = val
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
}

//---------------------------------------------------Search新增按钮点击---------------------------------------------------
const handleAddButton = (params?: any) => {
  console.log('🚀 ~ handleAddButton ~ params:', params)
  selectedId.value = ''
  addDialogVisible.value = true
}

//页面初始化获取数据
const fetchData = async (queryParams?: Partial<IReqHttpBBsForumListQueryParams>) => {
  isLoading.value = true
  try {
    const query: any = {
      ...queryForm,
      ...queryParams
    }
    if (query.status === 'L') {
      delete query.status
    }
    if (!query.startTime) {
      delete query.startTime
    }
    if (!query.endTime) {
      delete query.endTime
    }
    const response = await getSpiderList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total) ?? 0
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

// 使用示例

const resetButton = () => {
  Object.assign(queryForm, initForm())
  fetchData()
}

const handleURLEdit = (scope: any) => {
  console.log('🚀 ~ handleURLEdit ~ scope:', scope)
  selectedId.value = scope.row.id
  addDialogVisible.value = true
}

//页面初始化加载
onMounted(async () => {
  await fetchData()
})
</script>

<style scoped lang="less">
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
