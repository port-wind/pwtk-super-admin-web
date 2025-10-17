<template>
  <section id="system_account">
    <section id="customerForm">
      <el-form ref="ruleRormRef" :model="customerTags" status-icon :rules="rules">
        <!-- <el-form-item
          label="子站点ID:"
          name=""
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-button type="primary" @click="openEditModal">新建标签</el-button>
      </el-form>
    </section>

    <section class="main_flex_table">
      <m-table
        :options="customerTagOptions"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        stripe
        pagination
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #tagName="{ scope }">
          <span style="margin-right: 10px">
            <linkWithCopy
              :row-data="scope.row"
              :config="{ idKey: 'tagName', hoverShowCopy: true }"
              @click="openEditModal(scope.row)"
            />
          </span>
        </template>
        <template #state="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.state === 'y' ? '启用' : '关闭' }}
          </span>
          <el-switch
            v-model="scope.row.state"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row, updateCustomerTags, fetchData, 'state')"
          ></el-switch>
        </template>
      </m-table>
    </section>
    <edit-customer-tag v-if="modalsStore.editCustomerTagModal.isVisible" @refreshPage="fetchData" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { statusChanged } from '@/utils/table'
import type { TableData, GetRequest } from '@/api/bss/infoManagement/types'

import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import { reqCustomerTags, updateCustomerTags } from '@/api/user/customerTags'
import { useModalsStore } from '@/stores/modalStore'

const customerTags = ref()
const rules = ref()
const queryForm = reactive({
  manageSiteId: ''
})
const modalsStore = useModalsStore()
const tableData = ref<TableData[]>([])
const customerTagOptions = ref<TableOptions[]>([
  {
    label: '序号',
    prop: 'seq',
    width: 100
  },
  {
    label: '标签类型',
    prop: 'flag'
  },
  {
    label: '标签名称',
    prop: 'tagName',
    slot: 'tagName'
  },
  {
    label: '状态',
    prop: 'state',
    slot: 'state'
  },
  {
    label: '更新时间',
    prop: 'createTime',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  }
])

const isLoading = ref(false)
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

const openEditModal = (row) => {
  modalsStore.editCustomerTagModal.modalData = {
    tagId: row.tagId,
    tagName: row.tagName,
    flag: row.flag
  }
  modalsStore.showModal('editCustomerTagModal')
}

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      // Handle valid form submission
    } else {
      console.log('表单验证失败')
    }
  })
}

const fetchData = async (_queryForm?: GetRequest) => {
  if (_queryForm?.page) {
    currentPage.value = _queryForm.page
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value
  }
  isLoading.value = true
  try {
    const response = await reqCustomerTags(params)
    if (response.success) {
      console.log(response.data)
      tableData.value = response.data.list.map((item, index) => ({
        ...item,
        seq: (currentPage.value - 1) * pageSize.value + index + 1
      }))
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
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

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Add any component-specific styles here */
.tags-main-header {
  margin: 10px 0 20px 0;
}
.main_flex_table {
  border-top: 1px solid #e6e6e6;
}
:deep(.el-table__cell) {
  padding: 12px 0 !important;
}
</style>
