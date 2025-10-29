<template>
  <!-- 浏览记录 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.targetId"
            maxlength="64"
            placeholder="浏览对象ID"
          />
        </el-form-item>
        <el-form-item label="" prop="viewType">
          <el-select v-model="queryForm.viewType" placeholder="类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.viewType" :key="key" :value="key" :label="value" />
          </el-select>
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
        max-height="55vh"
        height="55vh"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="pageObj.page"
        :pageSize="pageObj.size"
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
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.viewTime) }}</p>
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
import { reqListDeviceViewHistory } from '@/api/user/index'
import timezone from '@/utils/timezone'
import { dataSemantics } from '@/utils/dataSemantics'
import { differenceInDays, format, differenceInHours } from 'date-fns'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})
const initQueryForm = () => ({
  cid: props.accountInfo.cid,
  targetId: '',
  viewType: null,
  cidPrecise: true,
  sortOrder: 'DESC',
  sortName: 'view_time'
})

const initForm = () => ({
  componentName: '',
  componentType: '',
  sketchCodeList: [],
  memo: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'targetId',
    label: '浏览对象',
    slot: 'id'
  },
  {
    prop: 'viewType',
    label: '浏览类型',
    json: {
      sourceName: 'viewType',
      keyName: 'viewType'
    }
  },
  {
    prop: 'viewTime',
    label: '浏览时间',
    slot: 'time'
  }
]
const isLoading = ref(false)
const tableData: any = ref([])
const queryRef = ref()
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())
const addForm: any = ref(initForm())

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqListDeviceViewHistory(vals)
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
