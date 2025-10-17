<template>
  <!-- 匿名访客 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.targetId"
            maxlength="64"
            placeholder="访客ID"
          />
        </el-form-item>
        <!-- <el-form-item label="" prop="likeFlag">
                    <el-select v-model="queryForm.likeFlag" placeholder="类型" style="width: 100px;">
                        <el-option label="全部" value="L" />
                        <el-option  v-for="(value,key) in _Options.likeFlag" :key="key" :value="key" :label="value" />
                    </el-select>
                </el-form-item> -->
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSizes="[5, 15, 30, 50, 100]"
      >
        <template #lastVisitTime="{ scope }">
          <p>{{ dataSemantics(scope.row.lastVisitTime) }}</p>
        </template>
        <template #firstVisitTime="{ scope }">
          <p>{{ dataSemantics(scope.row.firstVisitTime) }}</p>
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import { reqDeviceVisit } from '@/api/user/index'
import { dataSemantics } from '@/utils/dataSemantics'
import { GetUserIdResponse } from '@/api/user/type'
const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})
const initQueryForm = () => ({
  userId: props!.accountInfo!.userId,
  userIdPrecise: true,
  visitorId: '',
  visitorIdPrecise: false,
  clientFlag: null,
  targetId: '',
  sortOrder: 'DESC',
  sortName: 'last_visit_time'
})

const initForm = () => ({
  componentName: '',
  componentType: '',
  sketchCodeList: [],
  status: 'y',
  isView: 'y',
  memo: ''
})

const initPageObj = () => ({
  page: 1,
  size: 5
})

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'visitorCid',
    label: '访客ID'
  },
  {
    prop: ' lastVisitTime',
    label: '访问时间',
    slot: 'lastVisitTime'
  },
  {
    prop: 'firstVisitTime',
    label: '首次访问时间',
    slot: 'firstVisitTime'
  }
]
const isLoading = ref(false)
const tableData: any = ref([])
const queryRef = ref()
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqDeviceVisit(vals)
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
