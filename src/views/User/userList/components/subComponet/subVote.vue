<template>
  <!-- 匿名投票 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="year">
          <el-select v-model="queryForm.year" placeholder="年份" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in yearArray" :key="key" :value="value" :label="value" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="issue">
          <el-select v-model="queryForm.issue" placeholder="期数" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in userIssueList" :key="key" :value="value" :label="'第' + value + '期'" />

            <!-- <el-option  v-for="(value,key) in _Options.likeFlag" :key="key" :value="key" :label="value" /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="voteType">
          <el-select v-model="queryForm.voteType" placeholder="投票类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.voteType" :key="key" :value="key" :label="value" />
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
        <template #issue="{ scope }">
          {{ `第${scope.row.issue}期` }}
        </template>
      </m-table>
    </section>
  </div>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import _Options from '@/const/options.json'
import { reqListUserVote } from '@/api/user/index'
import { reqListUserVoteIssue } from '@/api/user/index'
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
function generateYearArray(start, end) {
  const years: number[] = []
  for (let i = start; i <= end; i++) {
    years.push(i)
  }
  return years
}
const initQueryForm = () => ({
  cid: props.accountInfo!.cid,
  targetId: '',
  gameType: props.reqType,
  year: null,
  issue: null,
  voteType: null,
  cidPrecise: true,
  sortOrder: 'DESC',
  sortName: 'year',
  userId: ''
})

const initForm = () => ({
  componentName: '',
  componentType: '',
  sketchCodeList: [],
  memo: ''
})

const initPageObj = () => ({
  page: 1,
  size: 5
})

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'year',
    label: '年份'
  },
  {
    prop: 'issue',
    label: '期数',
    slot: 'issue'
  },
  {
    prop: 'vote',
    label: '标的',
    json: {
      sourceName: 'vote',
      keyName: 'vote'
    }
  },
  {
    prop: 'voteType',
    label: '投票类型',
    json: {
      sourceName: 'voteType',
      keyName: 'voteType'
    }
  }
]
const isLoading = ref(false)
const tableData: any = ref([])
const queryRef = ref()
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())
const addForm: any = ref(initForm())
const yearArray = ref(generateYearArray(2020, 2030))
const userIssueList = ref([])

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  vals.userId = props.accountInfo!.userId
  try {
    let res = await reqListUserVote(vals)
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
//获取全部用户期数列表
const getAllDeviceIssueList = async () => {
  let res = await reqListUserVoteIssue()
  if (res.success) {
    userIssueList.value = res.data
  } else {
    showErrorMessage(res)
  }
}

onMounted(() => {
  searchButton()
})
</script>
