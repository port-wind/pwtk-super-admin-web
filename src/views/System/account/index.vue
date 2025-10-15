<template>
  <section class="wrapper">
    <section ref="tableRef">
      <el-form
        ref="queryRef"
        :inline="true"
        @keyup.enter="fetchData({ page: 1 })"
        :model="queryForm"
        class="custom-el-form no-rule"
        label-width="70px"
      >
        <el-form-item label="" prop="username">
          <el-input v-model="queryForm.username" placeholder="查询内容" />
        </el-form-item>

        <el-form-item label="" prop="state">
          <el-select v-model="queryForm.state" placeholder="状态" style="width: 100px">
            <el-option label="全部" :value="-1" />
            <el-option label="启用" :value="1" />
            <el-option label="关闭" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="fetchData({ page: 1 })" :loading="isLoading">查询</el-button>
          <el-button type="primary" :icon="Refresh" @click="resetButton" plain>重置</el-button>
          <el-button type="success" :icon="Plus" @click="() => openNewuserDialog()">新增帐号</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="custom-table">
      <m-table
        :options="options"
        :data="tableData"
        :isLoading="isLoading"
        pagination
        stripe
        border
        :total="total"
        :currentPage="queryForm.page"
        :pageSize="queryForm.size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <template #username="{ scope }">
          <div>
            {{ scope.row.username }}
            <copy :content="scope.row.username" :title="t('table.accountNumber')" />
          </div>
        </template>
        <template #roleIds="{ scope }">
          <el-tooltip :content="scope.row.roleIds.join(' | ')" placement="top" v-if="scope.row.roleIds">
            <div class="account-role">
              {{ scope.row.roleIds.join(' | ') }}
            </div>
          </el-tooltip>
        </template>

        <template #phone="{ scope }">
          <span v-if="scope.row.cc">{{ scope.row.cc }}&nbsp;&nbsp;&nbsp;</span>
          <span>{{ scope.row.phone }}</span>
        </template>
        <template #state="{ scope }">
          <div :class="{ active: scope.row.state === 1, inactive: scope.row.state === 0 }">
            {{ scope.row.state && scope.row.state === 1 ? '启用' : '禁用' }}
          </div>
        </template>

        <template #id="{ scope }">
          <el-button
            :disabled="per.includes('account:edit') ? false : true"
            type="primary"
            @click="openNewuserDialog(scope.row)"
          >
            {{ t('button.edit') }}
          </el-button>
          <el-popconfirm
            :confirm-button-text="t('button.confirm')"
            :cancel-button-text="t('button.cancel')"
            icon-color="#f5c357"
            :title="
              t('button.whether') +
              (scope.row.state == 1 ? t('button.disable') : t('button.enable')) +
              t('button.selectedSsers') +
              '?'
            "
            @confirm="confirmEvent(scope.row)"
            width="250"
          >
            <template #reference>
              <el-button
                :disabled="per.includes('account:forbidden') ? false : true"
                :type="scope.row.state == 1 ? 'danger' : 'success'"
              >
                {{ scope.row.state == 1 ? t('button.disable') : t('button.enable') }}
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </m-table>
    </section>

    <AddUserDialog ref="AddUserDialogRef" @onClose="handleClose" />
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import i18n from '@/i18n'
const { t } = i18n.global
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { useModalsStore } from '@/stores/modalStore'
import { reqForbidden, reqSystemUserAccountList, reqSystemUserEdit } from '@/api/system/account'
import { options } from '@/views/System/account/data'
import type {
  IReqSystemUserAccountListData,
  IReqSystemUserAccountListQueryParams,
  IReqForbiddenQueryParams
} from '@/api/system/account/types'
import { setPermissionsStore } from '@/stores'

const permissionStore = setPermissionsStore()
const per = computed(() => permissionStore.menupermissions)
const tableRef = ref()
const queryRef = ref()
const AddUserDialogRef = ref()
const tableData = ref<IReqSystemUserAccountListData[]>([])

const total = ref<number>(0)

const initFormQuery = (): IReqSystemUserAccountListQueryParams => {
  return {
    page: 1,
    size: 15,
    sortName: '',
    sortOrder: 'DESC',
    username: '',
    state: -1 //全部
  }
}

const queryForm = reactive<IReqSystemUserAccountListQueryParams>(initFormQuery())

//loading 按钮
const isLoading = ref(false)

const openNewuserDialog = (row?: IReqSystemUserAccountListData) => {
  AddUserDialogRef.value.openDailog(row)
}

const confirmEvent = async (row: IReqSystemUserAccountListData) => {
  try {
    const query: IReqForbiddenQueryParams = {
      id: row.id.toString(),
      state: row.state === 1 ? 0 : 1
    }
    const res = await reqForbidden(query)
    if (res.success) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      fetchData()
    }
  } catch (error) {}
}

const handleSizeChange = (val: number) => {
  queryForm.size = val
  queryForm.page = 1
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  queryForm.page = val
  fetchData()
}

//页面初始化获取数据
const fetchData = async (_queryForm?: Partial<IReqSystemUserAccountListQueryParams>) => {
  isLoading.value = true
  try {
    const query: IReqSystemUserAccountListQueryParams = {
      ...queryForm,
      ..._queryForm
    }

    if (query.state === -1) {
      delete query.state
    }

    Object.assign(queryForm, _queryForm)

    const response = await reqSystemUserAccountList(query)
    if (response.success) {
      tableData.value = response.data.list
      total.value = Number(response.data.total)
    } else {
      tableData.value = []
      total.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

// // 更新状态
// const onchange = async (row: IReqSystemUserAccountListData, val) => {
//   console.log('🚀 ~ beforeChange ~ val:', row, val)
//   try {
//     if (row.id) {
//       isLoading.value = true
//       const query: IReqForbiddenQueryParams = {
//         id: row.id,
//         word: row,
//         status: val
//       }
//       const response = await reqSystemUserEdit(query)
//       if (response.success) {
//         fetchData()
//         ElMessage.success('操作成功')
//       } else {
//         showErrorMessage(response)
//       }
//     }
//   } catch (error) {
//     throw new Error('更新错误')
//   } finally {
//     isLoading.value = false
//   }
// }

const handleClose = () => {
  Object.assign(queryForm, initFormQuery())
  fetchData()
}

const resetButton = () => {
  queryRef.value.resetFields()
  Object.assign(queryForm, initFormQuery())
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.custom-table {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.wrapper {
  height: calc(100vh - 101px);
  display: flex;
  flex-direction: column;
}

.switch-custom .el-switch__label.is-active {
  color: #303133;
}

.active {
  color: rgb(103, 194, 58);
  font-size: 16px;
  font-weight: bold;
}

.inactive {
  color: rgb(245, 108, 108);
  font-size: 16px;
  font-weight: bold;
}
</style>
