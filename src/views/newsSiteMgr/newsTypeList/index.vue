<template>
  <section id="system_account">
    <section id="domainSearchForm" ref="tableRef">
      <m-search
        ref="searchFormRef"
        :isLoading="isLoading"
        :formOptions="searchOptions"
        :buttonOptions="searchBtnOptions"
        @query="fetchData"
      >
        <template #autoNews="{ scope, form }">
          <AutoComplete
            v-model="form.siteName"
            max-length="255"
            keyword="siteName"
            :httpFunc="reqInputHttp"
            :displayFields="['siteName', 'appId']"
            :trigger-on-focus="true"
            placeholder="新闻站点名称"
            @keyup.enter="fetchData"
            @input="(val) => handleInput(val, form)"
            @select="(val) => handleAppIdChange(val, form)"
          ></AutoComplete>
        </template>
        <template #autoTypes="{ scope, form }">
          <AutoComplete
            v-model="form.typeName"
            max-length="255"
            keyword="typeName"
            :httpFunc="reqListTypeName"
            :displayFields="['typeName']"
            :displayName="'typeName'"
            :trigger-on-focus="true"
            @keyup.enter="fetchData"
            :searchObj="{ appId: form.appId, siteName: form.siteName }"
            placeholder="分类名称"
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
        border
        :stripe="!isTreeQuery"
        :total="total"
        rowKey="typeId"
        :currentPage="currentPage"
        :pageSize="pageSize"
        :row-style="rowStyle"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #appId_siteName="{ scope }">
          <span v-if="!isTreeQuery || !scope.row.level">
            {{ `${scope.row.siteName} | ${scope.row.appId}` }}
          </span>
        </template>
        <template #typeId="{ scope }">
          <span v-if="!isTreeQuery">{{ `${scope.row.typeName} | ${scope.row.typeId}` }}</span>
          <span v-else-if="!!scope.row.level">
            {{
              '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(scope.row.level - 1) +
              `${scope.row.typeName} | ${scope.row.typeId}`
            }}
          </span>
        </template>
      </m-table>
    </section>
    <!-- 新增/编辑 账号弹出框 -->
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SearchBtnOptions, SearchOption } from '@/components/mSearchForm/types'
import { reqHttp, reqInputHttp, reqTreeList, reqListTypeName } from '@/api/newsSiteMgr/newsTypeList/index'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/newsTypeList/types'
import { TableOptions } from '@/components/mTable/types'
import { TableHeaderColors } from '@/const/commonSet'
const searchFormRef = ref()
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
const { t } = i18n.global as any
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const sortName = ref('type_id')
const sortOrder = ref('ASC')
const total = ref<number>(0)
const isTreeQuery = ref(true)
const cloneRef = ref()
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'appId',
    label: '新闻站点名称 | ID',
    width: '220',
    slot: 'appId_siteName'
  },
  {
    prop: 'typeId',
    label: '分类名称 | ID',
    slot: 'typeId'
  },
  {
    prop: 'level',
    label: '分类层级',
    width: '100',
    align: 'right'
  },
  {
    prop: 'updateTime',
    label: '修改时间',
    dateName: 'updateTime'
  },
  {
    prop: 'status',
    label: '状态',
    width: '100',
    json: {
      sourceName: 'statusType',
      keyName: 'status'
    }
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

//翻页功能 前一页
const handleSizeChange = (val: number) => {
  currentPage.value = 1
  pageSize.value = val
  fetchData()
}
//翻页功能 后一页
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
const rowStyle = ({ row }) => {
  if (isTreeQuery.value) {
    const { level } = row
    return { 'background-color': level ? TableHeaderColors[level] : 'white' }
  } else {
    return {}
  }
}

//页面初始化获取数据
const fetchData = async () => {
  cloneRef.value = searchFormRef.value.getFormData()
  tableData.value = []

  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: sortName.value,
    sortOrder: sortOrder.value
  }
  params = cloneRef.value ? { ...params, ...cloneRef.value } : params
  params = {
    ...params,
    appId: params.selectedAppId ?? params.appId,
    siteName: params.selectedSiteName ?? params.siteName,
    typeName: params.selectedTypeName ?? params.typeName
  }
  isLoading.value = true
  try {
    let response
    isTreeQuery.value = !(params?.appId || params?.siteName || params?.typeName || params?.level)
    if (isTreeQuery.value) {
      response = await reqTreeList(params)
    } else {
      response = await reqHttp(params)
    }
    if (response.success) {
      await nextTick()
      tableData.value = response.data.list.map((item, index) => {
        return isTreeQuery.value
          ? {
              ...item,
              typeId: -(index + 1).toString()
            }
          : item
      })
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
const handleAppIdChange = (val, form) => {
  console.log(val)
  if (val?.valueObj?.appId) {
    form.appId = val.valueObj.appId
  }
  cloneRef.value.typeName = ''
}
const handleInput = (val, form) => {
  if (form?.appId) {
    form.appId = ''
  }
}

//搜索组件数据
const searchOptions: SearchOption[] = [
  {
    prop: 'siteName',
    type: 'autoComplete',
    slot: 'autoNews'
  },
  {
    prop: 'typeName',
    type: 'autoComplete',
    slot: 'autoTypes'
  },
  {
    prop: 'level',
    type: 'select',
    selectData: {
      clearable: true,
      selectName: 'levelOfNews',
      placeholder: '层级'
    }
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
