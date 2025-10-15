<template>
  <!-- 用户收藏 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.targetId"
            maxlength="64"
            placeholder="收藏对象ID"
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
        <template #userDisplay="{ scope }">
          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.targetId }}
            </span>
            <copy v-if="scope.row.targetId != ''" :content="scope.row.targetId"></copy>
          </p>
        </template>
        <template #userFavoriteRef="{ scope }">
          <p>
            {{ scope.row.targetRef }}
          </p>
        </template>
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.createTime) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/attachmentManagement/types'
import { reqListUserFavorite } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import { dataSemantics } from '@/utils/dataSemantics'
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
  userId: props.accountInfo!.userId,
  userIdPrecise: true,
  targetId: '',
  favoriteFlag: props.reqType,
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
  {
    prop: ' targetId',
    label: '收藏对象ID',
    slot: 'userDisplay'
  },
  {
    prop: 'targetName',
    label: '收藏对象',
    slot: 'userFavoriteRef'
  },
  {
    prop: 'createTime',
    label: '收藏时间',
    slot: 'time'
  }
]

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqListUserFavorite(vals)
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
  searchButton()
})
</script>
