<template>
  <div id="system_account">
    <section ref="tableRef">
      <mSearch :isLoading="isLoading" :formOptions="searchOptions" :buttonOptions="searchBtnOptions" @query="fetchData">
        <template #upload_target="{ scope, form }">
          <AutoComplete
            v-model="form.uploadTarget"
            max-length="255"
            keyword="uploadTarget"
            :httpFunc="reqHttp"
            :displayFields="['uploadTarget']"
            :isList="true"
            :debounce="500"
            :trigger-on-focus="true"
            placeholder="文件名称"
          ></AutoComplete>
        </template>
        <template #upload_from="{ scope, form }">
          <AutoComplete
            v-model="form.uploadFrom"
            max-length="255"
            keyword="uploadFrom"
            :httpFunc="reqHttp"
            :displayFields="['uploadFrom']"
            :debounce="500"
            :trigger-on-focus="true"
            placeholder="文件路径"
          ></AutoComplete>
        </template>
        <template #file_type="{ scope, form }">
          <AutoComplete
            v-model="form.fileType"
            max-length="255"
            keyword="siteName"
            :httpFunc="reqHttp"
            :displayFields="['fileType']"
            :debounce="500"
            :trigger-on-focus="true"
            placeholder="文件类型"
          ></AutoComplete>
        </template>

        <template #timeLine="{ scope, form }">
          <TimeSelect
            name="时间选择"
            start-placeholder="上传开始时间"
            end-placeholder="上传结束时间"
            v-model:startDate="form.uploadStartTime"
            v-model:endDate="form.uploadEndTime"
          ></TimeSelect>
        </template>
      </mSearch>
    </section>
    <section class="account-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        border
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #uploadId="{ scope }">
          <span>{{ formateStrNum(scope.row.uploadId) }}</span>
        </template>
        <template #uploadFrom="{ scope }">
          <span>{{ limitToLast10Digits(scope.row.uploadFrom, 15) }}</span>
        </template>
        <template #fileSize="{ scope }">
          <span>{{ showFileSize(scope.row.fileSize) }}</span>
        </template>
      </m-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reqHttp } from '@/api/system/upload/index'
import count from '@/utils/tableHeight'
import type { TableOptions } from '@/components/mTable/types'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import type { GetRequest, TableData } from '@/api/system/upload/types'
import { showFileSize, formateStrNum } from '@/utils/dataFormat'
import { limitToLast10Digits } from '@/utils/dateFormat'
// import SearchForm from './components/SearchForm.vue'
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'uploadId',
    label: '文件ID',
    fixed: 'left',
    slot: 'uploadId',
    width: 120
  },
  {
    prop: 'uploadTarget',
    label: '文件名称',
    width: 220
  },
  {
    prop: 'uploadFrom',
    label: '文件路径',
    width: 220,
    slot: 'uploadFrom'
  },
  {
    prop: 'fileType',
    label: '文件类型',
    width: 100
  },

  {
    prop: 'fileSize',
    label: '文件大小',
    slot: 'fileSize',
    width: 100
  },

  {
    prop: 'storageType',
    label: '存储类型',
    width: 100
  },
  {
    prop: 'storageStyle',
    label: '存储方式',
    width: 100
  },
  {
    prop: 'env',
    label: '存储环境',
    width: 100
  },
  {
    prop: 'uploadUser',
    label: '上传者'
  },
  {
    prop: 'recordTime',
    label: '上传时间',
    width: 180,
    dateName: 'recordTime'
  }
]

const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

const tableRef = ref(null)

//loading 按钮
const isLoading = ref(false)
//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

//页面初始化获取数据
const fetchData = async (queryForm?: GetRequest) => {
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  params = queryForm ? { ...params, ...queryForm } : params
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      console.error('Error', response.errMessage)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const searchOptions: SearchOption[] = [
  {
    prop: 'uploadTarget',
    type: 'input',
    slot: 'upload_target'
  },
  {
    prop: 'uploadFrom',
    type: 'input',
    slot: 'upload_from'
  },
  {
    prop: 'fileType',
    type: 'input',
    slot: 'file_type'
  },
  {
    prop: 'timeLine',
    type: 'slot',
    slot: 'timeLine',
    width: '20rem'
  }
]

const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}

//页面初始化加载
onMounted(fetchData)
</script>
