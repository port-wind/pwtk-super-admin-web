<template>
  <section id="system_account">
    <!-- Search Form -->
    <section id="domainSearchForm" ref="tableRef">
      <el-form :inline="true" class="search_left" :model="queryForm" label-width="70px">
        <!-- <el-form-item
          label=""
          prop="manageSiteId"
        >
          <ManageSiteSelect v-model="queryForm.manageSiteId" />
        </el-form-item> -->
        <el-form-item label="" prop="seriesCode">
          <AutoComplete
            v-model="queryForm.seriesCode"
            max-length="255"
            isList
            keyword="seriesCode"
            :httpFunc="listGameTypeSeries"
            :displayFields="['seriesCode']"
            :searchObj="{ manageSiteId: queryForm.manageSiteId }"
            :trigger-on-focus="true"
            placeholder="系列ID"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="seriesName">
          <AutoComplete
            v-model="queryForm.seriesName"
            max-length="255"
            isList
            keyword="seriesName"
            :httpFunc="listGameTypeSeries"
            :searchObj="{ manageSiteId: queryForm.manageSiteId }"
            :displayFields="['seriesName']"
            :trigger-on-focus="true"
            placeholder="系列名称"
            @keyup.enter="fetchData"
          ></AutoComplete>
        </el-form-item>
        <el-form-item label="" prop="gameType">
          <el-select v-model="queryForm.gameType" placeholder="彩种">
            <el-option label="全部" value="L" />
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="fetchData" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleReset" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="openAddDialog">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button v-if="isShowCheckboxTable" type="success" plain @click="() => handleSpecialClick('series')">
            <el-icon style="margin: 0 5px 0 0"><Connection /></el-icon>
            同步
          </el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- Data Table -->
    <section class="account-table">
      <m-table
        :options="tableOptions"
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
        <template #seriesCode="{ scope }">
          <p class="like-a overflow-hidden" @click="handleClickDetail(scope.row)">
            {{ scope.row.seriesName }}
          </p>
          <!-- <linkWithCopy
            :row-data="scope.row"
            :config="{ idKey: 'seriesCode' }"
            @action="handleClickDetail(scope.row)"
            :limit-func="formateStrNum"
          /> -->
        </template>
        <template #tags="{ scope }">
          {{ getTagLabels(scope) }}
        </template>
        <template #gameType="{ scope }">
          <p>{{ gameTypeList?.find((item) => item.value === scope.row.gameType)?.label }}</p>
        </template>
      </m-table>
    </section>
  </section>
  <photoSeriesModal @alreadySubmit="handleSave" />
  <checkbox-table v-if="modalsStore?.checkboxTable?.isVisible" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import showErrorMessage from '@/utils/showErrorMessage'
import photoSeriesModal from '@/components/modalCommon/photoSeriesModal/index.vue'
import count from '@/utils/tableHeight'
import { createGameTypeSeries, editGameTypeSeries, listGameTypeSeries } from '@/api/photoSys/series'
import { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'
import { unitFormatDate } from '@/utils/dateFormat'
import { formateStrNum } from '@/utils/dataFormat'
import { fetchGameTypes } from '@/utils/table'
import { useModalsStore } from '@/stores/modalStore'
import { useDeployConfig } from '@/components/checkboxTable/util'
const { isShowCheckboxTable, handleSpecialClick } = useDeployConfig()

// Constants and refs
const tableRef = ref()
const tableData = ref([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)
const isLoading = ref(false)
const dialogVisible = ref(false)
const editFormRef = ref()
const gameTypeList = ref()
const getGameTypeName = computed(() => (gameType: string) => {
  const gameTypeObj = gameTypeList.value.find((item) => item.value === gameType)
  return gameTypeObj ? gameTypeObj.label : ''
})
const modalsStore = useModalsStore()
// Form data
const initQueryForm = () => ({
  seriesCode: '',
  seriesName: '',
  gameType: '',
  manageSiteId: ''
})

const queryForm = reactive(initQueryForm())
const initEditForm = () => ({
  seriesCode: '',
  seriesName: '',
  gameType: '',
  hasColorful: 'y',
  hasBlackWhite: 'y',
  seriesDesc: '',
  isRecommended: 'n',
  isHot: 'n',
  isTop: 'n',
  isSelected: 'n',
  isBloom: 'n',
  memo: '',
  createTime: ''
})
const addInitData = ref(initEditForm())

const editFormData = ref(initEditForm())
const formMode = ref<string>('add')
const lineFormData = ref(initEditForm())

//新增的时候的
const rulesAdd = ref({
  seriesCode: [
    { required: true, message: '请输入系列ID', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]*$/, message: '系列ID不符合标准', trigger: 'blur' }
  ],
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})
//编辑的时候的
const rulesEdit = ref({
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})

const formRules = ref(formMode.value === 'add' ? rulesAdd : rulesEdit)

// Table options
const tableOptions = [
  { prop: 'seriesCode', label: '系列名称', slot: 'seriesCode', columAttr: { minWidth: 180 } },
  { prop: 'sortNo', label: '排序', align: 'right', columAttr: { minWidth: 100 } },
  { prop: 'gameType', label: '彩种', slot: 'gameType', columAttr: { minWidth: 70 } },
  { prop: 'colorfulCount', label: '彩色图纸数量', align: 'right', columAttr: { minWidth: 120 } },
  { prop: 'blackWhiteCount', label: '黑白图纸数量', align: 'right', columAttr: { minWidth: 120 } },
  { prop: 'seriesDesc', label: '描述', showOmission: true, columAttr: { minWidth: 240 } },
  // {
  //   prop: 'isRecommended',
  //   label: '推荐',
  //   width: 70,
  //   json: {
  //     sourceName: 'yOrN',
  //     keyName: 'isRecommended'
  //   }
  // },
  // {
  //   prop: 'isHot',
  //   label: '热门',
  //   width: 80,
  //   json: {
  //     sourceName: 'yOrN',
  //     keyName: 'isHot'
  //   }
  // },
  // {
  //   prop: 'isTop',
  //   label: '置顶',
  //   width: 80,
  //   json: {
  //     sourceName: 'yOrN',
  //     keyName: 'isTop'
  //   }
  // },
  // {
  //   prop: 'isSelected',
  //   label: '精选',
  //   width: 80,
  //   json: {
  //     sourceName: 'yOrN',
  //     keyName: 'isSelected'
  //   }
  // },
  // {
  //   prop: 'isBloom',
  //   label: '爆款',
  //   width: 80,
  //   json: {
  //     sourceName: 'yOrN',
  //     keyName: 'isBloom'
  //   }
  // },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    width: 220
  },
  { prop: 'memo', label: '备注', showOmission: true, columAttr: { minWidth: 240 } },
  { prop: 'createTime', label: '创建时间', dateName: 'createTime', columAttr: { minWidth: 120 } }
]
const resetForm = () => {
  Object.assign(lineFormData.value, initEditForm())
}
const yOrN = changeJsonToArr('yOrN', 'radio') as FormOptions[]
const showOrNot = computed(() => formMode.value === 'edit')
const forGameTypeList = computed(() => {
  return gameTypeList.value.map((item) => ({
    label: item.label,
    value: item.value
  }))
})
// Methods
const fetchData = async () => {
  isLoading.value = true
  try {
    const req = {
      page: currentPage.value,
      size: pageSize.value,
      sortName: 'sort_no',
      sortOrder: 'DESC',
      ...queryForm
    }

    const response = await listGameTypeSeries(req)

    if (response.success) {
      tableData.value = response.data.list || []
      total.value = Number(response.data.list ? response.data.total : 0)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
  fetchData()
}

const openAddDialog = () => {
  // if (!queryForm.manageSiteId) {
  //   ElMessage.warning('请先选择站点')
  //   return
  // }
  modalsStore.setModalData('photoSeriesModal', {
    manageSiteId: queryForm.manageSiteId
  })
  modalsStore.showModal('photoSeriesModal')
  // nextTick(() => {
  //   editFormRef.value.clearValidate()
  // })
}
const handleClickDetail = (row: any) => {
  modalsStore.showModal('photoSeriesModal')
  modalsStore.setModalData('photoSeriesModal', {
    id: row.seriesCode,
    manageSiteId: queryForm.manageSiteId
  })
  // lineFormData.value = {
  //   ...row,
  //   createTime: unitFormatDate(row.createTime, 'yyyy-MM-dd HH:mm:ss')
  // }
  // nextTick(() => {
  //   editFormRef.value.clearValidate()
  // })
}

const handleSave = async (isNeedResetPage: boolean) => {
  if (isNeedResetPage) {
    currentPage.value = 1
    pageSize.value = 15
  }
  fetchData()
}

//table标签的展示
const getTagLabels = (scope: any) => {
  const labels: string[] = []
  if (scope.row.isRecommended === 'y') labels.push('推荐')
  if (scope.row.isHot === 'y') labels.push('热门')
  if (scope.row.isSelected === 'y') labels.push('精选')
  if (scope.row.isTop === 'y') labels.push('置顶')
  if (scope.row.isBloom === 'y') labels.push('爆款')

  return labels.join('｜')
}

// Lifecycle hooks
onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  fetchData()
})
</script>

<style scoped lang="less">
// Add any necessary styles here
</style>
