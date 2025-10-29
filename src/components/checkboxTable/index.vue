<template>
  <el-dialog
    v-model="isVisible"
    class="tabs-dialog"
    draggable
    destroy-on-close
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-tabs v-model="activeName" class="m_tabs">
      <el-tab-pane label="子站点同步" name="first" class="m_tabs_pane">
        <div v-if="bbsForumPostFlag && !resultFlag" style="display: flex; align-items: center; margin-left: 10px">
          <el-checkbox v-model="postisAll" />
          <span style="margin: 0 10px 0 5px">同步历史期数</span>
          <span style="color: red; font-size: 12px">※点击后将同步包含当前期以前的所有期数数据</span>
        </div>
        <div class="main_flex_table">
          <el-table ref="tableRef" :data="paginatedData" :loading="isLoading" stripe highlight-current-row>
            <el-table-column width="55" v-if="!resultFlag">
              <template #header>
                <el-checkbox v-model="isAllSelected" :indeterminate="isIndeterminate" @change="handleSelectAll" />
              </template>
              <template #default="{ row }">
                <el-checkbox v-model="row.checked" @change="handleCheckboxChange" />
              </template>
            </el-table-column>
            <el-table-column label="序号" prop="key" align="left" width="100" />
            <el-table-column label="子站点名称" prop="siteName" align="left" />
            <el-table-column label="网址" prop="oapiUrl" align="left" />
            <el-table-column v-if="resultFlag" label="结果" prop="result" align="left">
              <template #default="{ row }">
                <span :class="row.result ? 'success-text' : 'failure-text'">
                  {{ row.result ? '成功' : '失败' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination" style="margin-bottom: 30px">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="total"
            layout="prev, pager, next, jumper, ->, sizes, total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="button-row" v-if="!resultFlag">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="handleConfirm">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'

const modalsStore = useModalsStore()
const { checkboxTable } = storeToRefs(modalsStore)
const emits = defineEmits(['afterConfirm'])
const isVisible = computed(() => checkboxTable.value.isVisible)
const bbsForumPostFlag = computed(() => checkboxTable.value.modalData?.flag === 'bbsForumPost')
const postisAll = ref(false)
const activeName = ref('first')
const isLoading = ref(false)
const tableRef = ref()
const pushFunction = computed(() => checkboxTable.value.modalData?.pushFunction)
const fullTableList = ref<any[]>([])
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const currentPage = ref(1)
const pageSize = ref(5)
const selectedRows = computed(() => fullTableList.value.filter((item) => item.checked).map((item) => item.siteId))
const numOfSuccess = ref(0)
const resultFlag = computed(() => numOfSuccess.value > 0)
const total = computed(() => fullTableList.value.length)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return fullTableList.value.slice(start, end)
})

function resetPagination() {
  currentPage.value = 1
}
watch(
  () => checkboxTable.value.modalData?.tableList,
  (newTableList) => {
    if (newTableList) {
      console.log('newTableList', newTableList)
      fullTableList.value = newTableList.map((item) => ({ ...item, checked: false }))
      resetPagination()
    }
  },
  { deep: true }
)
function handleSelectAll(val: CheckboxValueType) {
  fullTableList.value.forEach((row) => {
    row.checked = val
  })
  isAllSelected.value = val as boolean
  isIndeterminate.value = false
}

function handleCheckboxChange() {
  const allChecked = fullTableList.value.every((item) => item.checked)
  const someChecked = fullTableList.value.some((item) => item.checked)

  isAllSelected.value = allChecked
  isIndeterminate.value = someChecked && !allChecked
}

function handleSizeChange(val: number) {
  pageSize.value = val
  resetPagination()
}

function handleCurrentChange(val: number) {
  currentPage.value = val
}

function closeDialog() {
  checkboxTable.value.isVisible = false
}
function showConfirm(num: number, data: { [key: string]: boolean }) {
  ElMessageBox.confirm(`同步成功！成功同步${num}个网站`, {
    confirmButtonText: '确认',
    type: 'success',
    showCancelButton: false
  })
    .then(
      () => {
        console.log('确认')
      },
      () => {
        console.log('取消')
      }
    )
    .catch(() => {
      throw new Error('用户取消操作')
    })
    .finally(() => {
      currentPage.value = 1
      fullTableList.value = fullTableList.value
        .filter((item) => item.checked)
        .map((item) => ({ ...item, result: data[item.siteId] }))
      numOfSuccess.value = num
    })
}
async function handleConfirm() {
  console.log('pushFunction', pushFunction.value)
  if (selectedRows.value.length === 0) {
    ElMessage({
      message: '请选择要同步的网站',
      type: 'warning'
    })
    return
  }
  try {
    const query = {
      list: selectedRows.value,
      isAll: ''
    }
    if (bbsForumPostFlag.value) {
      query.isAll = postisAll.value ? 'y' : 'n'
    }
    const response = await pushFunction.value(query)
    if (response.success) {
      emits('afterConfirm')
      // closeDialog()
      const { data } = response
      const num = Object.keys(data).filter((key) => data[key] === true).length
      if (num === 0) {
        ElMessage({
          message: '同步失败',
          type: 'error'
        })
        emits('afterConfirm', response.message)
        return
      }
      showConfirm(num, data)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error:', error)
    emits('afterConfirm', error)
  }
}
</script>

<style scoped lang="less">
.success-text {
  color: #67c23a;
}
.failure-text {
  color: #f56c6c;
}
</style>
