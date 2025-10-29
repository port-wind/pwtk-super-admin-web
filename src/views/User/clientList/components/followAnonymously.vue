<template>
  <!-- 匿名关注 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.toUserId"
            maxlength="64"
            placeholder="被关注者ID"
          />
        </el-form-item>
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.targetId"
            maxlength="64"
            placeholder="被关注者昵称"
          />
        </el-form-item>
        <!-- <el-form-item label="" prop="likeFlag">
                    <el-select v-model="queryForm.favoriteFlag" placeholder="类型" style="width: 100px;">
                        <el-option label="关系" value="L" />
                        <el-option  v-for="(value,key) in _Options.favoriteFlag" :key="key" :value="key" :label="value" />
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
              {{ scope.row.toUserId }}
            </span>
            <copy v-if="scope.row.toUserId != ''" :content="scope.row.toUserId"></copy>
          </p>
        </template>
        <template #time="{ scope }">
          <p>{{ dataSemantics(scope.row.fanTime) }}</p>
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
import { reqListDeviceRelationship } from '@/api/user/index'
import timezone from '@/utils/timezone'
import { dataSemantics } from '@/utils/dataSemantics'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})
const initQueryForm = () => ({
  cid: props.accountInfo.cid,
  toUserId: '',
  relationFlag: null,
  sortOrder: 'DESC',
  cidPrecise: true,
  sortName: 'fan_time'
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
    prop: 'toUserId',
    label: '被关注者ID',
    slot: 'id'
  },
  {
    prop: 'toUserNickname',
    label: '被关注者昵称'
  },
  {
    prop: 'fanTime',
    label: '建立关系时间',
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
    let res = await reqListDeviceRelationship(vals)
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
