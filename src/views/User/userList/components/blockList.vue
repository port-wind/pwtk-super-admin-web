<template>
  <!-- 黑名单 -->

  <section class="single-table">
    <!-- :tableHeight="count(tableRef).toString()" -->
    <m-table
      :options="options"
      :data="tableData"
      :isLoading="isLoading"
      isEditRow
      pagination
      stripe
      :pageSizes="[5, 15, 30, 50, 100]"
      :total="total"
      :currentPage="pageObj.page"
      :pageSize="pageObj.size"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #userDisplay="{ scope }">
        <p>{{ scope.row.blockUserNickname }}</p>
        <p>{{ scope.row.blockUserId }}</p>
      </template>
    </m-table>
  </section>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import type { TableData } from '@/api/bss/attachmentManagement/types'
import { reqBlocklist } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import { GetUserIdResponse } from '@/api/user/type'
const { t } = i18n.global as any

const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})

const initQueryForm = () => ({
  hostUserId: '',
  blockUserId: '',
  blockReason: '',
  userId: ''
})

const initPageObj = () => ({
  page: 1,
  size: 5
})

const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())
//loading 按钮
const isLoading = ref(false)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'attachmentId',
    label: '被拉黑用户昵称/ID',
    slot: 'userDisplay'
  },
  {
    prop: 'blockReason',
    label: '拉黑原因'
  },
  {
    prop: 'blockTime',
    label: '拉黑时间',
    dateName: 'blockTime',
    width: 170
  },
  {
    prop: 'memo',
    label: '备注'
  }
]

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  // console.log('黑名单',props.accountInfo.userId)
  // queryForm.value.hostUserId = props.accountInfo.userId
  // console.log(queryForm.value)
  // console.log('默认',vals)
  // 后端要求userId，此处转换hostUserId为userId
  vals.userId = vals.hostUserId
  try {
    let res = await reqBlocklist(vals)
    tableData.value = res.data.list
    total.value = parseInt(res.data.total)
    if (res.success) {
    } else {
      showErrorMessage(res)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const handleSizeChange = (val) => {
  pageObj.value.size = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}
const handleCurrentChange = (val) => {
  pageObj.value.page = val
  searchButton({ ...queryForm.value, ...pageObj.value })
}

onMounted(() => {
  queryForm.value.hostUserId = props.accountInfo!.userId.toString()
  searchButton()
})

defineExpose({
  searchButton
})
</script>
