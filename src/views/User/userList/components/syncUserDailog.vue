<template>
  <el-dialog v-model="isVisible" @close="closeDialog" class="tabs-dialog">
    <el-tabs class="m_tabs" v-model="activeTab">
      <el-tab-pane label="子站点同步" name="config" class="m_tabs_pane">
        <div class="main_flex_table">
          <m-table
            :options="tableOptions"
            :data="tableData"
            isEditRow
            :isLoading="isLoading"
            stripe
            size="large"
            :total="total"
            :currentPage="queryForm.page"
            :pageSize="queryForm.size"
            pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @selection-change="handleSelectionChange"
            showSelection
          >
            <template #key="{ scope }">
              <div>{{ scope.row.key }}</div>
            </template>
            <template #siteStatus="{ scope }">
              <template v-if="scope.row.siteStatus === 'y'">
                <el-tag type="success">开启</el-tag>
              </template>
              <template v-else-if="scope.row.siteStatus === 'n'">
                <el-tag type="info">关闭</el-tag>
              </template>
              <template v-else>
                <el-tag type="warning">未知状态</el-tag>
              </template>
            </template>
            <template #operStatus="{ scope }">
              <el-tag v-if="scope.row.operStatus === 'y'" type="success">开启</el-tag>
              <el-tag v-else-if="scope.row.operStatus === 'n'" type="info">关闭</el-tag>
            </template>
          </m-table>
          <div class="button-row">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" :loading="isSubmitting" @click="onSubmit()">提交</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reqManageSiteList, reqUserListPush } from '@/api/super'
import type {
  IReqManageSiteListData,
  IReqManageSiteListQueryParams,
  IReqUserListPushQueryParams
} from '@/api/super/types'
import type { IReqUserListData } from '@/api/user/type'
import type { TableOptions } from '@/components/mTable/types'
import { defineExpose, watch } from 'vue'

const isVisible = ref(false)
export interface IExpose {
  openDialog: (value: IReqUserListData[]) => void // 明确暴露的类型
}
// 打开 Dialog 方法（可供外部调用）
const openDialog = (value: IReqUserListData[]) => {
  if (value.length > 0) {
    isVisible.value = true
    syncUserQueryForm.userIds = value.map((item) => item.userId)
  } else {
    ElMessageBox.confirm('请注意,你没指定任何一个用户,这样会同步所有用户?', 'Warning', {
      confirmButtonText: '继续',
      cancelButtonText: '重新选择',
      type: 'warning'
    }).then(() => {
      isVisible.value = true
      syncUserQueryForm.userIds = []
    })
  }
}

defineExpose<IExpose>({
  openDialog
})

const isLoading = ref(false)
const total = ref(0)

interface ISyncUserQueryForm {
  manageId: string[]
  userIds: string[]
}

const syncUserQueryForm = reactive<ISyncUserQueryForm>({
  manageId: [],
  userIds: []
})

const queryForm = reactive<IReqManageSiteListQueryParams>({
  page: 1,
  size: 15,
  sortName: 'create_time',
  sortOrder: 'DESC'
})

const tableOptions: TableOptions[] = [
  {
    prop: 'key',
    label: '序号',
    align: 'left',
    width: 80
  },
  {
    prop: 'siteName',
    label: '子站点名称',
    align: 'left',
    width: 140
  },
  {
    prop: 'oapiUrl',
    align: 'left',
    label: '网址'
  }
  // {
  //   prop: 'manageId',
  //   align: 'left',
  //   label: '网站ID'
  // }
  //   prop: 'siteStatus',
  //   align: 'left',
  //   label: '网站状态',
  //   slot: 'siteStatus',
  //   width: 95
  // },
  // {
  //   prop: 'operStatus',
  //   align: 'left',
  //   label: '站点运营状态',
  //   slot: 'operStatus',
  //   width: 120
  // }
]

const fetchData = async () => {
  isLoading.value = true
  try {
    const query: IReqManageSiteListQueryParams = {
      ...queryForm
    }
    const res = await reqManageSiteList(query)
    if (res.success) {
      tableData.value = res.data.list.map((item, index) => {
        return {
          ...item,
          key: index + 1
        }
      })
      total.value = Number(res.data.total)
      console.log('🚀 ~ fetchData ~ res.data.total:', res.data.total)
    }
  } catch (error) {
  } finally {
    isLoading.value = false
  }
}

const isSubmitting = ref(false)
const activeTab = ref('config')

const onSubmit = async () => {
  isSubmitting.value = true
  try {
    const query: IReqUserListPushQueryParams = {
      ...syncUserQueryForm
    }
    const res = await reqUserListPush(query)
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '同步完成'
      })
    } else {
      ElMessage({
        message: res.errMessage,
        type: 'error'
      })
    }
  } catch (error) {
    console.error('验证或提交失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

function closeDialog() {
  isVisible.value = false
}

// 表格数据
const tableData = ref<IReqManageSiteListData[]>([])

const handleSizeChange = (val) => {
  queryForm.size = val
}
const handleCurrentChange = (val) => {
  queryForm.page = val
}

const handleSelectionChange = (val: IReqManageSiteListData[]) => {
  syncUserQueryForm.manageId = val.map((item) => item.manageId)
}

watch(
  () => [queryForm.page, queryForm.size],
  (newVal) => {
    if (newVal) {
      fetchData()
    }
  }
)

onMounted(() => {
  fetchData()
})
</script>
