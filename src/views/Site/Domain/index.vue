<template>
  <section id="system_account">
    <!-- <section
      id="domainSearchForm"
      ref="tableRef"
    >
      <SearchForm
        @resetPagination="resetPagination"
        ref="searchFormRef"
        :loadingBtn="isLoading"
        @update:model="updateSearchModel"
        @update:visible="(val) => (addDialogVisible = val)"
        @search="(queryForm) => fetchData(queryForm)"
      />
    </section> -->
    <section id="m-form" ref="mFormRef">
      <m-search
        :isLoading="isLoading"
        :formOptions="searchOptions"
        :buttonOptions="searchBtnOptions"
        @query="fetchData"
      >
        <template #manageSiteId="{ scope, form }">
          <ManageSiteSelect v-model="form.manageSiteId" />
        </template>
      </m-search>
    </section>
    <section class="account-table">
      <TableComponent
        :tableData="tableData"
        @edit="handleTableEdit"
        :fetchData="fetchData"
        @delete="handleEditSubmit"
        :isLoading="isLoading"
        @update:isLoading="updateIsLoading"
      />
    </section>
    <section class="pagination">
      <PaginationComponent
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        @pagination-change="handleSizeChange"
      />
    </section>
    <AddDialog
      v-if="addDialogVisible"
      v-model:visible="addDialogVisible"
      :loadingBtn="isLoading"
      @save="handleAddSubmit"
    />
  </section>
</template>
<script setup lang="ts">
interface SearchForm {
  sortName: string
  sortOrder: string
  domain: string
  ownerUserId: string
  websiteRef: string
  langCodes: string[]
  areaCodes: string[]
  websiteInnerName: string
  websiteTitle: string
}
import { ref, provide } from 'vue'
import { reqDomain, addDomain, delDomain, editDomain } from '@/api/site/domain'
import SearchForm from './components/DomainSearchForm.vue'
import TableComponent from './components/DomainTable.vue'
import PaginationComponent from './components/DomainPagination.vue'
import AddDialog from './components/DomainAddDialog.vue'
import { searchOptions, searchBtnOptions } from '@/views/Site/Domain/data'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()

const searchFormRef = ref(null)
provide('searchFormRef', searchFormRef)
const tableRef = ref<InstanceType<typeof ElTable> | null>(null)
provide('tableRef', tableRef)
import type {
  IAddDomainQueryParams,
  EditRequest,
  IReqDomainData,
  IReqDomainQueryParams,
  TableData
} from '@/api/site/domain/types'
import { ElTable } from 'element-plus'
const resetPagination = () => {
  currentPage.value = 1
  pageSize.value = 15
}
const tableData = ref<IReqDomainData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const popupFormData = ref<TableData>()
const isLoading = ref<boolean>(false)
const updateIsLoading = (value: boolean) => {
  isLoading.value = value
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData({ page: currentPage.value, size: pageSize.value })
}
const searchModel = ref({})
provide('searchModel', searchModel)

const handleTableEdit = (row: TableData) => {
  console.log('row', row)
  editDialogVisible.value = true
  popupFormData.value = { ...row }
}

const fetchData = async (queryForm: any) => {
  if (!queryForm.manageSiteId) {
    ElMessage({
      message: '请选择一个站点',
      type: 'warning'
    })
    return
  }
  isLoading.value = true
  let params = {} as IReqDomainQueryParams
  if (!queryForm.page) {
    params.page = currentPage.value
  }
  if (!queryForm.size) {
    params.size = pageSize.value
  }
  params = { ...params, ...queryForm }
  try {
    const response = await reqDomain(params)
    if (response.success) {
      if (response?.data?.list) {
        tableData.value = response.data.list
      }
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
const initSearchForm = () => ({
  sortName: 'create_time',
  sortOrder: 'DESC',
  domain: '',
  ownerUserId: '',
  websiteRef: '',
  langCodes: [],
  areaCodes: [],
  websiteInnerName: '',
  websiteTitle: ''
})
const searchFormModel = ref(initSearchForm())
const updateSearchForm = (newFormModel: Partial<SearchForm>) => {
  Object.assign(searchFormModel.value, newFormModel)
}
const searchFormComputed = computed({
  get: () => searchFormModel.value,
  set: (newValue) => {
    searchFormModel.value = newValue
  }
})
provide('searchForm', {
  model: searchFormComputed,
  update: updateSearchForm
})
provide('fetchData', fetchData)
const handleEditSubmit = async (formData: EditRequest) => {
  const params = formData
  try {
    const response = await editDomain(params as EditRequest)
    if (response.success) {
      ElMessage({
        message: '修改成功',
        type: 'success'
      })
      fetchData({ page: currentPage.value, size: pageSize.value })
      editDialogVisible.value = false
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const handleAddSubmit = async (formData: any) => {
  const params = formData.value
  try {
    const response = await addDomain(params as IAddDomainQueryParams)
    if (response.success) {
      ElMessage({
        message: '新增成功!',
        type: 'success'
      })
      fetchData({ page: 1, size: 15 })
      addDialogVisible.value = false
    } else {
      ElMessage({
        showClose: true,
        message: response.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
// onMounted(() => {
//   fetchData({ page: 1, size: 15 })
// })

watch(
  () => [],
  (newValue, oldValue) => {}
)
</script>
