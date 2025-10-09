<template>
  <section>
    <section class="header-inside-dialog" style="display: flex; margin: 20px 50px">
      <h3>层级表示(</h3>
      <el-breadcrumb :separator-icon="ArrowRight" style="display: flex">
        <el-breadcrumb-item v-for="(item, index) in childrenHeaderList" :key="item.loginId">
          <span class="like-a" @click="handleHeaderClick(item, index)">
            {{ item.nickname }}
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <h3>)</h3>
    </section>
    <section style="margin: 0 50px; min-height: 600px">
      <m-table
        :options="options"
        :pageSizes="[5, 15, 30, 50, 100]"
        :data="childrenListTableData"
        isEditRow
        :isLoading="loadingChildren"
        border
        stripe
        size="small"
      >
        <template #userId="{ scope }">
          <span @click="handleClick(scope.row)" class="like-a">
            {{ formateStrNum(scope.row.userId) }}
          </span>
          <copy :content="scope.row.userId" style="margin-left: 3px"></copy>
        </template>
        <template #userStatus="{ scope }">
          <span class="el-dropdown-link">
            <el-tag v-if="scope.row.userStatus == 'y'" class="mx-1" type="primary">启用</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 'n'" class="mx-1" type="warning">停用</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 't'" class="mx-1" type="warning">停权</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 'f'" class="mx-1" type="warning">冻结</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 'u'" class="mx-1" type="primary">未启用</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 'z'" class="mx-1" type="primary">保留</el-tag>
            <el-tag v-else-if="scope.row.userStatus == 'v'" class="mx-1" type="primary">浏览</el-tag>
            <el-tag v-else class="mx-1" type="info">关闭</el-tag>
          </span>
        </template>
      </m-table>
    </section>
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import mTable from '@/components/mTable/index.vue'
import { ArrowRight } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { formateStrNum } from '@/utils/dataFormat'

import { directSubUsers } from '@/api/user/myTeam'
import { GetUserIdResponse } from '@/api/user/type'
const childrenHeaderList: any = ref<any[]>([])
const childrenListTableData: any = ref<any>([])
const loadingChildren = ref(false)
const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})
const options: any = [
  {
    prop: 'userId',
    label: '直属用户ID',
    slot: 'userId'
  },
  {
    prop: 'nickname',
    label: '用户名称'
  },
  {
    prop: 'userLevel',
    label: '层级',
    width: '100',
    align: 'right'
  },
  {
    prop: 'childrenSize',
    label: '直属人数',
    width: '100',
    align: 'right'
  },
  {
    prop: 'regTime',
    label: '注册时间',
    dateName: 'regTime'
  },
  {
    prop: 'userStatus',
    label: '状态',
    slot: 'userStatus'
  }
]

const handleClick = async (accountInfo: any) => {
  const { loginId } = accountInfo
  try {
    loadingChildren.value = true
    const response = await directSubUsers({ loginId })
    if (checkSuccess(response)) {
      console.log(response)
      childrenHeaderList.value.push({ ...response.data })
      childrenListTableData.value = response.data.children
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loadingChildren.value = false
  }
}
const handleHeaderClick = async (item: any, index: number) => {
  const isLastItem = index === childrenHeaderList.value.length - 1
  if (!isLastItem) {
    childrenHeaderList.value = childrenHeaderList.value.slice(0, index + 1)
  }

  try {
    loadingChildren.value = true
    const response = await directSubUsers({ loginId: item.loginId })
    if (checkSuccess(response)) {
      // Update the item in childrenHeaderList with the new data
      childrenHeaderList.value[index] = { ...response.data }
      childrenListTableData.value = response.data.children
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    showErrorMessage('Failed to fetch updated data')
  } finally {
    loadingChildren.value = false
  }
}
onMounted(async () => {
  childrenHeaderList.value = []
  if (props.accountInfo) {
    await handleClick({ ...props.accountInfo })
  }
})
const checkSuccess = (res) => {
  if (res?.success) {
    return true
  }
  showErrorMessage(res)

  return false
}
</script>
