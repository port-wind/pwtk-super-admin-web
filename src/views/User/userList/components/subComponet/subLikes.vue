<template>
  <!-- 用户点赞 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.targetId"
            maxlength="64"
            placeholder="点赞对象ID"
          />
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="searchButton({ ...queryForm, ...pageObj })" :loading="isLoading">
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
    </section>
    <section class="account-table">
      <!-- :tableHeight="count(queryRef).toString()" -->
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="pageObj.page"
        :pageSize="pageObj.size"
        :pageSizes="[5, 15, 30, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #id="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.targetId }}
            </span>
            <copy v-if="scope.row.targetId != ''" :content="scope.row.targetId"></copy>
          </p>
        </template>
        <template #timeFormat="{ scope }">
          {{ scope.row.createTime }}
        </template>
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.createTime) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import { reqListUserLike } from '@/api/user/index'
import { TableOptions } from '@/components/mTable/types'
import type { TableData } from '@/api/bss/attachmentManagement/types'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import { dataSemantics } from '@/utils/dataSemantics'
import i18n from '@/i18n'
const { t } = i18n.global as any

const props = defineProps({
  accountInfo: {
    type: Object
  },
  reqType: {
    type: String,
    default: null,
    request: true
  }
})

const initQueryForm = () => ({
  hostUserId: '',
  userId: '',
  targetRef: '',
  targetId: '',
  likeFlag: props.reqType,
  sortName: 'create_time',
  sortOrder: 'DESC'
})

const initPageObj = () => ({
  page: 1,
  size: 5
})
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())

//loading 按钮
const isLoading = ref(false)

//Table需要的数据
const options: TableOptions[] = [
  // {
  //     prop: 'attachmentId',
  //     label: '点赞用户昵称 | ID',
  //     slot: 'userDisplay'
  // },
  {
    prop: 'targetId',
    label: '点赞对象ID',
    slot: 'id'
  },
  {
    prop: 'createTime',
    label: '点赞时间',
    slot: 'time'
  }
]

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  // 后端要求userId，此处转换hostUserId为userId
  vals.userId = vals.hostUserId
  try {
    let res = await reqListUserLike(vals)
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
const resetButton = () => {
  Object.assign(queryForm.value, initQueryForm())
  searchButton({
    ...Object.assign(queryForm.value, initQueryForm()),
    ...Object.assign(pageObj.value, initPageObj())
  })
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
  queryForm.value.hostUserId = props!.accountInfo!.userId
  searchButton()
})
defineExpose({
  searchButton
})
</script>
