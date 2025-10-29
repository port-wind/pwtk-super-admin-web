<template>
  <section class="wrapper">
    <section ref="queryRef">
      <el-form :inline="true" class="custom-el-form no-rule" :model="queryForm" label-width="auto">
        <el-form-item label="" prop="gameTypeName">
          <el-input v-model.trim="queryForm.gameTypeName" placeholder="彩种名称" style="width: 147px" />
        </el-form-item>
        <el-form-item label="" prop="gameTypeShortName">
          <el-input v-model.trim="queryForm.gameTypeShortName" placeholder="彩种简称" style="width: 147px" />
        </el-form-item>
        <el-form-item label="" prop="status">
          <el-select v-model="queryForm.status" placeholder="状态" style="width: 147px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="y" />
            <el-option label="禁用" value="n" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData()" :loading="isLoading">
            <el-icon style="margin: 0 5px 0 0">
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon style="margin: 0 5px 0 0">
              <Refresh />
            </el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openAddDailog()">
            <el-icon style="margin: 0 5px 0 0">
              <Plus />
            </el-icon>
            新增
          </el-button>
          <!-- <el-button
            v-if="isShowCheckboxTable"
            type="success"
            plain
            @click="() => handleSpecialClick('gameTypePlatform')"
          >
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button> -->
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :tableHeight="count(tableRef).toString()"
        :isLoading="isLoading"
        isEditRow
        pagination
        stripe
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #gameTypeName="{ scope }">
          <p class="like-a overflow-hidden" @click="handTabs(scope.row)" type="primary">
            {{ truncateText(scope.row.gameTypeName) }}
          </p>
        </template>
        <template #status="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.status === 'y' ? '启用' : '禁用' }}
          </span>
          <el-switch
            v-model="scope.row.status"
            :active-value="'y'"
            :inactive-value="'n'"
            :before-change="() => statusChanged(scope.row, gameTypePlatformUpdate, fetchData)"
          ></el-switch>
        </template>
      </m-table>
    </section>
  </section>
  <addGameType v-if="addDialogVisible" v-model:visible="addDialogVisible" @refreshPage="fetchData"></addGameType>
  <editGameType
    v-if="editDialogVisible"
    v-model:visible="editDialogVisible"
    :editFormData="editFormData"
    @refreshPage="fetchData"
  ></editGameType>
  <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TableData, GetRequest } from '@/api/newsSiteMgr/articleList/types'
import type { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import { fetchGameTypes, statusChanged } from '@/utils/table'
import { gameTypePlatformList, gameTypePlatformUpdate } from '@/api/system/gameTypeManagement'
import { truncateText, unitFormatDate } from '@/utils/dataFormat'
import { useDeployConfig } from '@/components/checkboxTable/util'
import { useModalsStore } from '@/stores/modalStore'
const { VITE_DEPLOY_CONFIG } = import.meta.env
const modalsStore = useModalsStore()
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()
// Refs
const gameTypeList = ref()

const tableRef = ref()
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const isLoading = ref(false)
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editFormData = ref<any>({})
// Constants

const initQueryFormValue = () => ({
  gameTypeName: '',
  gameType: '',
  gameTypeShortName: '',
  gameTypeLongName: '',
  areaCode: '',
  gameTypeCode: '',
  status: ''
})

const queryForm = reactive(initQueryFormValue())
const handleReset = () => {
  Object.assign(queryForm, initQueryFormValue())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'gameTypeName',
    label: '彩种名称',
    slot: 'gameTypeName',
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'gameTypeShortName',
    label: '彩种简称',
    truncateText: true,
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'openTime',
    label: '开奖时间',
    align: 'right',
    columAttr: { minWidth: 100 }
  },

  {
    prop: 'gameTypeLongName',
    label: '彩种全称',
    truncateText: true,
    columAttr: { minWidth: 180 }
  },
  {
    prop: 'status',
    label: '状态',
    slot: 'status',
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'areaCode',
    label: '所属地区',
    truncateText: true,
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'classifier',
    label: '分类',
    truncateText: true,
    columAttr: { minWidth: 100 }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    columAttr: { minWidth: 100 }
  }
]

// Methods
const fetchData = async (val?: GetRequest) => {
  let params: any = {
    page: currentPage.value,
    size: pageSize.value,
    sortName: 'create_time',
    sortOrder: 'DESC',
    ...queryForm
  }
  if (params.status === 'L') {
    delete params.status
  }
  isLoading.value = true
  try {
    const response = (await gameTypePlatformList(params)) as any
    const dataList = response?.data?.list ?? []
    if (response.success && dataList.length > 0) {
      const list =
        dataList?.map((item: any) => {
          return {
            ...item
          }
        }) || []
      tableData.value =
        (list &&
          list?.map((item: any) => ({
            ...item
          }))) ||
        []
      total.value = Number(response?.data?.total) || 0
    } else {
      tableData.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}
const openAddDailog = () => {
  addDialogVisible.value = true
}
const handTabs = (row) => {
  console.log(row)
  editFormData.value = row
  editDialogVisible.value = true
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  await fetchData()
})
</script>

<style scoped lang="less">
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}
</style>
