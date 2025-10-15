<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <m-search
        :isLoading="isLoading"
        :formOptions="searchOptions"
        :buttonOptions="searchBtnOptions"
        @query="fetchData"
      >
        <template #autoComplete="{ scope, form }">
          <AutoComplete
            v-model="form.siteName"
            max-length="255"
            keyword="siteName"
            :httpFunc="reqInputHttp"
            :displayFields="['siteName', 'appId']"
            :trigger-on-focus="true"
            placeholder="新闻站点名称"
            clearable
            @input="(val) => handleInput(val, form)"
            @select="(val) => handleAppIdChange(val, form)"
            @keyup.enter="fetchData({ ...form })"
          ></AutoComplete>
        </template>
      </m-search>
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
        <template #appId_siteName="{ scope }">
          <span>{{ `${scope.row.siteName} | ${scope.row.appId} ` }}</span>
        </template>
      </m-table>
    </section>
    <!-- 新增/编辑 账号弹出框 -->
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import { reqHttp, reqInputHttp } from '@/api/newsSiteMgr/newsSiteList'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/newsSiteList/types'
import { TableOptions } from '@/components/mTable/types'

const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
const { t } = i18n.global as any

const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const sortName = ref('app_id')
const sortOrder = ref('ASC')
const total = ref<number>(0)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'appId',
    label: '新闻站点名称 | ID',
    slot: 'appId_siteName'
  },
  {
    prop: 'articleCount',
    label: '文章数量',
    align: 'right'
  },
  {
    prop: 'websiteUrl',
    label: '官网地址'
  },
  {
    prop: 'queryDataUrl',
    label: '爬取数据地址'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime'
  }
]
//   appId: string //新闻站点ID
//   siteName: string // 新闻站点名称
//   articleCount: number //文章数量
//   websiteUrl: string // 官网地址
//   queryDataUrl?: string // 爬取数据地址
//   createTime?: string // 创建时间

//loading 按钮
const isLoading = ref(false)
const handleAppIdChange = (val, form) => {
  console.log('item', val)
  if (val?.valueObj?.appId) {
    form.appId = val.valueObj.appId
  }
}
const handleInput = (val, form) => {
  if (form?.appId) {
    form.appId = ''
  }
}
//翻页功能 前一页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

//页面初始化获取数据
const fetchData = async (queryForm?: GetRequest) => {
  console.log(queryForm)
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: sortName.value,
    sortOrder: sortOrder.value,
    ...queryForm
  }
  params = queryForm ? { ...params, ...queryForm } : params
  params = {
    ...params,
    appId: params.selectedAppId ?? params.appId,
    siteName: params.selectedSiteName ?? params.siteName
  }
  isLoading.value = true
  try {
    const response = await reqHttp(params)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

//搜索组件数据
const searchOptions: SearchOption[] = [
  {
    prop: 'siteName',
    type: 'autoComplete',
    slot: 'autoComplete'
  }
]
//搜索按钮数据
const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}
//页面初始化加载
onMounted(fetchData)
</script>

<style scoped lang="less"></style>
