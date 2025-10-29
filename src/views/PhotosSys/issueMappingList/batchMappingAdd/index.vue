<template>
  <div id="system_account" class="main_container">
    <!-- <div style="width: 120px">
      <ManageSiteSelect v-model="manageSiteId" />
    </div> -->

    <!-- <section class="main_flex_table"> -->
    <el-form ref="formRef" :model="formData" :rules="rules" :validate-on-rule-change="false" class="main_flex_table">
      <el-table
        class="batch-add-table"
        ref="tableRef"
        :data="fullTableList"
        :loading="isLoading"
        stripe
        highlight-current-row
      >
        <el-table-column width="55" v-if="!resultFlag">
          <template #header>
            <el-checkbox v-model="isAllSelected" :indeterminate="isIndeterminate" @change="handleSelectAll" />
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.checked" @change="handleCheckboxChange" />
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="seq" width="60" />
        <el-table-column label="彩种" prop="gameType" slot="gameType">
          <template #default="{ row, $index }">
            <el-form-item :prop="`tableData.${$index}.gameType`">
              <el-select v-model="row.gameType" @change="changeGameType(row)">
                <el-option v-for="item in gameTypeList" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="系列名称" prop="seriesCode" slot="seriesCode">
          <template #default="{ row, $index }">
            <el-form-item :prop="`tableData.${$index}.seriesCode`">
              <el-select v-model="row.seriesCode" :disabled="!row.gameType" @change="changeSeries(row)">
                <el-option
                  v-for="item in row.seriesList"
                  :key="item.seriesCode"
                  :label="item.seriesName"
                  :value="item.seriesCode"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="报纸名称:" prop="newspaperCode" slot="newspaperCode">
          <template #default="{ row, $index }">
            <el-form-item :prop="`tableData.${$index}.newspaperCode`">
              <el-select v-model="row.newspaperCode" :disabled="!row.seriesCode">
                <el-option
                  v-for="item in row.newspaperList"
                  :key="item.newspaperCode"
                  :label="item.newspaperName"
                  :value="item.newspaperCode"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="版面位置" prop="layoutPosition" slot="layoutPosition">
          <template #default="{ row, $index }">
            <el-form-item :prop="`tableData.${$index}.layoutPosition`">
              <el-select v-model="row.layoutPosition">
                <el-option value="A" />
                <el-option value="B" />
                <el-option value="C" />
                <el-option value="D" />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="文件名称" prop="fileId" slot="fileId">
          <template #default="{ row, $index }">
            <el-form-item :prop="`tableData.${$index}.fileId`">
              <el-input v-model="row.fileId" placeholder="文件名称" />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <span v-if="row.seq == 1" type="text" style="color: #409eff; cursor: pointer" @click="handleAdd">增加</span>
            <span v-else type="text" style="color: #f56c6c; cursor: pointer" @click="handleDelete(row)">移除</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- </section> -->
    <section class="footer">
      <el-checkbox
        v-model="isAllSelected"
        :indeterminate="isIndeterminate"
        @change="handleSelectAll"
        style="margin-right: 20px"
      >
        全选
      </el-checkbox>
      <BachAddSet :isVisible="isEditVisible" :manage-site-id="manageSiteId" @back="batchAdd">
        <el-button @click="handleBatchSet">批量设置</el-button>
      </BachAddSet>
      <el-button @click="handleRemove">移除</el-button>
      <el-button type="primary" @click="handleConfirm">提交</el-button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import { storeToRefs } from 'pinia'
import showErrorMessage from '@/utils/showErrorMessage'
import { fetchGameTypes } from '@/utils/table'
import { useSeriesApi } from '@/api/photoSys/series'
import { FormItemRule } from 'element-plus'
import BachAddSet from './bachAddSet.vue'
import { useIssueMappingApi } from '@/api/photoSys/issueMappingList'
import router from '@/router'

const modalsStore = useModalsStore()
const { checkboxTable } = storeToRefs(modalsStore)
const formRef = ref()
const isLoading = ref(false)
const tableRef = ref()
const fullTableList = ref<any[]>([])
const isAllSelected = ref(true)
const isIndeterminate = ref(false)
const selectedRows = computed(() => fullTableList.value.filter((item) => item.checked).map((item) => item.siteId))
const manageSiteId = ref('')
const { getGameTypeSeries, getGameTypeNewspaper } = useSeriesApi(manageSiteId)
const { batchAddIssueMapping } = useIssueMappingApi(manageSiteId)
const formData = computed(() => ({
  tableData: fullTableList.value
}))
const numOfSuccess = ref(0)
const resultFlag = computed(() => numOfSuccess.value > 0)
const resultData = ref()

const gameTypeList = ref<any[]>([])
const isEditVisible = ref(false)

// 定义一个空的校验规则对象
const rules = reactive<Partial<Record<string, FormItemRule[]>>>({})

// 定义一个方法，用于生成校验规则
const generateRules = () => {
  formData.value.tableData.forEach((_, index) => {
    rules[`tableData.${index}.gameType`] = [{ required: true, message: '请选择彩种', trigger: 'change' }]
    rules[`tableData.${index}.seriesCode`] = [{ required: true, message: '请选择系列名称', trigger: 'change' }]
    rules[`tableData.${index}.newspaperCode`] = [{ required: true, message: '请选择报纸名称', trigger: 'change' }]
    rules[`tableData.${index}.layoutPosition`] = [{ required: false, message: '请选择版面位置', trigger: 'change' }]
    rules[`tableData.${index}.fileId`] = [{ required: true, message: '请输入文件名称', trigger: 'change' }]
  })
}

// 初始生成规则
generateRules()

// 监听表格数据的变化（如增删行），重新生成校验规则
watch(
  () => formData.value.tableData.length,
  () => {
    console.log('formData', formData.value.tableData)
    generateRules()
  }
)

function handleSelectAll(val: boolean) {
  fullTableList.value.forEach((row) => (row.checked = val))
  isAllSelected.value = val
  isIndeterminate.value = false
}

function handleCheckboxChange() {
  const allChecked = fullTableList.value.every((item) => item.checked)
  const someChecked = fullTableList.value.some((item) => item.checked)
  isAllSelected.value = allChecked
  isIndeterminate.value = someChecked && !allChecked
}

function handleAdd() {
  fullTableList.value.push({
    seq: fullTableList.value.length + 1,
    gameType: '',
    seriesCode: '',
    newspaperCode: '',
    layoutPosition: '',
    fileId: '',
    seriesList: [],
    newspaperList: [],
    checked: true
  })
  handleCheckboxChange()
}

async function handleDelete(row: any) {
  fullTableList.value = fullTableList.value
    .filter((item) => item.seq !== row.seq)
    .map((item, index) => ({ ...item, seq: index + 1 }))
  console.log('formData', formData.value.tableData)
  handleCheckboxChange()
}

//批量移除
function handleRemove() {
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  ElMessageBox.confirm('已选择' + count + '条数据 ，确认移除吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      fullTableList.value = fullTableList.value.filter((item) => item.checked !== true)
      fullTableList.value = fullTableList.value.map((item, index) => ({
        ...item,
        seq: index + 1
      }))
      if (fullTableList.value.length === 0) {
        handleAdd()
      }
      console.log('formData', formData.value.tableData)
      handleCheckboxChange()
      generateRules()
    })
    .catch(() => {})
}

//提交
async function handleConfirm() {
  // if (!manageSiteId.value) {
  //   ElMessage.warning('请先选择站点')
  //   return
  // }
  // 过滤出选中的条目
  const selectedItems = fullTableList.value.filter((item) => item.checked === true)
  if (selectedItems.length === 0) {
    return
  }
  const valid = await formRef.value?.validate()
  if (!valid) {
    console.log('提交失败！')
    return
  }
  try {
    // 构造请求参数
    const params = {
      issueMappingList: selectedItems.map((item) => ({
        fileId: item.fileId,
        newspaperCode: item.newspaperCode,
        seriesCode: item.seriesCode,
        gameType: item.gameType,
        layoutPosition: item.layoutPosition
      }))
    }
    // 发送请求
    const response = await batchAddIssueMapping(params)
    if (!response.success) {
      showErrorMessage(response)
      return
    }
    handleResponse(response)
  } catch (error) {
    showErrorMessage(error)
  }
}

function handleResponse(response: any) {
  resultData.value = response.data
  const failedItems = resultData.value.filter((item) => !item.success)
  if (failedItems.length === 0) {
    ElMessage({
      type: 'success',
      message: '提交成功'
    })
    router.push('/photosSys/issueMappingList')
  } else {
    handleFailedItems(failedItems)
  }
}

function handleFailedItems(failedItems: any[]) {
  failedItems.forEach((item) => {
    ElMessage({
      type: 'error',
      message: `${item.targetId} ${item.reason}`
    })
  })
  // 更新 fullTableList，仅保留失败的条目
  fullTableList.value = fullTableList.value
    .filter((row) => failedItems.some((item) => item.targetId === row.fileId))
    .map((item, index) => ({
      ...item,
      seq: index + 1
    }))
  console.log('fullTableList.value', fullTableList.value)
  handleCheckboxChange()
  generateRules()
}

const changeGameType = async (row) => {
  row.seriesCode = ''
  row.newspaperCode = ''
  row.seriesList = []
  row.newspaperList = []
  let params = {
    page: 1,
    size: 999,
    gameType: row.gameType
  }
  try {
    let response = await getGameTypeSeries(params)
    if (response.success) {
      row.seriesList = response.data.list || []
      console.log(row.seriesList)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const changeSeries = async (row) => {
  row.newspaperCode = ''
  row.newspaperList = []
  let params = {
    page: 1,
    size: 999,
    gameType: row.gameType,
    seriesCode: row.seriesCode
  }
  try {
    let response = await getGameTypeNewspaper(params)
    if (response.success) {
      row.newspaperList = response.data.list || []
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const handleBatchSet = () => {
  isEditVisible.value = true
}

const batchAdd = (data?) => {
  console.log(data)
  if (data) {
    fullTableList.value.forEach((item) => {
      if (item.checked) {
        item.gameType = data.gameType
        item.seriesCode = data.seriesCode
        item.newspaperCode = data.newspaperCode
        item.seriesList = data.seriesList
        item.newspaperList = data.newspaperList
      }
    })
  }
  isEditVisible.value = false
}

onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  handleAdd()
})
</script>

<style scoped lang="less">
.success-text {
  color: #67c23a;
}
.failure-text {
  color: #f56c6c;
}
.footer {
  display: flex;
  justify-content: left;
  margin-top: auto;
  margin-bottom: 20px;
  padding-top: 20px;
}
</style>
