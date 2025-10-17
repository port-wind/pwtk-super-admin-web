<template>
  <!-- 我的粉丝 -->
  <div id="system_account">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <el-form-item label="" prop="targetId" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.fromUserId"
            maxlength="64"
            placeholder="关注者ID"
          />
        </el-form-item>
        <el-form-item label="" prop="toUserNickname" style="width: 200px">
          <el-input
            @keyup.enter="searchButton({ ...queryForm, ...pageObj })"
            v-model="queryForm.fromUserNickname"
            maxlength="64"
            placeholder="关注者昵称"
          />
        </el-form-item>
        <el-form-item label="" prop="voteType">
          <el-select v-model="queryForm.relationFlag" placeholder="关系类型" style="width: 100px">
            <el-option label="全部" value="L" />
            <el-option v-for="(value, key) in _Options.relationFlag" :key="key" :value="key" :label="value" />
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
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pageSizes="[5, 15, 30, 50, 100]"
      >
        <template #userDisplay="{ scope }">
          <!-- <p>{{ scope.row.toUserNickname }}</p> -->

          <p>
            <span class="" @click="" type="primary">
              {{ scope.row.fromUserId }}
            </span>
            <copy v-if="scope.row.fromUserId != ''" :content="scope.row.fromUserId"></copy>
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
import { useRouter, useRoute } from 'vue-router'
import { TableOptions } from '@/components/mTable/types'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/attachmentManagement/types'
import { reqListUserRelationship } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import { dataSemantics } from '@/utils/dataSemantics'
import { GetUserIdResponse } from '@/api/user/type'
const { t } = i18n.global as any

const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})
const initQueryForm = () => ({
  fromUserId: '',
  toUserId: props!.accountInfo!.userId,
  fromUserNickname: '',
  relationFlag: null,
  toUserIdPrecise: true,
  sortOrder: 'DESC',
  sortName: 'fan_time'
})

const initPageObj = () => ({
  page: 1,
  size: 15
})
// 获取路由对象
const router = useRouter()
const useRoutes = useRoute()
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
    prop: 'fromUserId',
    label: '关注用户ID',
    slot: 'userDisplay'
  },
  {
    prop: 'relationFlag',
    label: '关系标记',
    json: {
      sourceName: 'relationFlag',
      keyName: 'relationFlag'
    }
  },
  {
    prop: 'fanTime',
    label: '建立关系时间',
    slot: 'time'
  }
]

//搜索
async function searchButton(vals = { ...queryForm.value, ...initPageObj() }) {
  // console.log(queryForm.value)
  isLoading.value = true
  try {
    let res = await reqListUserRelationship(vals)
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
  // queryForm.value.fromUserId = props.accountInfo.userId
  searchButton()
})
defineExpose({
  searchButton
})
const jumpView = ({ id, type }) => {
  // 获取当前页面的完整URL（不包含查询参数）
  let currentUrl = ''
  if (router.resolve(useRoutes.fullPath).href.includes('?')) {
    currentUrl = router.resolve(useRoutes.fullPath).href.split('?')[0]
  } else {
    currentUrl = router.resolve(useRoutes.fullPath).href
  }
  console.log('当前url', currentUrl)
  // // 编码 componentId
  // const encodedComponentId = encodeURIComponent(componentId)
  // 目标页面的 URL
  const baseURL = `${currentUrl}?viewId=${id}&$type=${type}`

  // 使用方法 / Usage
  openInNewTab(useRoutes.fullPath, { viewId: '1000000', type: '1' })
}
function openInNewTab(route, params) {
  const routeData = router.resolve({
    path: route,
    query: params
  })
  console.log('params', params)
  window.open(routeData.href, '_blank')
}
</script>
