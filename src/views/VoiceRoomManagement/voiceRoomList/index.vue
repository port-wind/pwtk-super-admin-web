<template>
  <div id="system_account" class="main_container">
    <section ref="queryRef">
      <el-form :inline="true" class="search_left" :model="queryForm">
        <el-form-item label="" prop="voiceRoomId">
          <el-input v-model="queryForm.voiceRoomId" placeholder="语音房ID" />
        </el-form-item>
        <el-form-item label="" prop="voiceRoomName">
          <el-input v-model="queryForm.voiceRoomName" placeholder="语音房名称" />
        </el-form-item>
        <el-form-item label="" prop="creater">
          <el-input v-model="queryForm.creater" placeholder="创建人" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
            v-model:startDate="queryForm.startCreateTime"
            v-model:endDate="queryForm.endCreateTime"
          ></TimeSelect2>
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect2
            start-placeholder="热门开始时间"
            end-placeholder="热门结束时间"
            v-model:startDate="queryForm.startHotTime"
            v-model:endDate="queryForm.endHotTime"
          ></TimeSelect2>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="queryForm.state" placeholder="状态">
            <el-option label="全部" value="L" />
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <ExpandableSection v-model="isExpanded" :resizeRef="queryRef" :numVisibleItems="4"></ExpandableSection>
        <el-form-item style="margin-left: auto">
          <el-button type="primary" @click="() => fetchData(queryForm)" :loading="isLoading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="handleResetRefresh" plain>
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="addVoiceRoom">
            <el-icon><Plus /></el-icon>
            新增语音房
          </el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="main_flex_table">
      <m-table
        :options="options"
        :data="tableData"
        :total="total"
        :currentPage="currentPage"
        :pageSize="pageSize"
        pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="table"
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #voiceRoomId="{ scope }">
          <p class="like-a overflow-hidden" @click="editVoiceRoom">
            {{ scope.row.voiceRoomId }}
          </p>
        </template>
        <template #creater="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ scope.row.creater }}
          </p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #endTime="{ scope }">
          {{ unitFormatDate(scope.row.endTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #hotTime="{ scope }">
          <p>{{ unitFormatDate(scope.row.startHotTime, 'yyyy-MM-dd HH:mm:ss') }} 至</p>
          <p>{{ unitFormatDate(scope.row.endHotTime, 'yyyy-MM-dd HH:mm:ss') }}</p>
        </template>
        <template #state="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.state == '1' ? '启用' : '禁用' }}
          </span>
          <el-switch
            v-model="scope.row.state"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="() => statusChanged(scope.row)"
          ></el-switch>
        </template>
        <template #operation="{ scope }">
          <el-link style="color: blue; margin-right: 20px" @click="viewUserManagement(scope.row)">成员管理</el-link>
          <el-link type="primary" style="color: #00aaaa">消息管理</el-link>
        </template>
      </m-table>
    </section>
  </div>
  <!-- 新增 弹出框 -->
  <AddVoiceRoom :isVisible="addDialogVisible" @callBack="returnFetchData" />
  <!-- 编辑 -->
  <EditVoiceRoom
    :isVisible="editDialogVisible"
    @callBack="
      () => {
        editDialogVisible = false
      }
    "
  />
  <!-- 用户页面 -->
  <UserListComponent />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import i18n from '@/i18n'
const { t } = i18n.global as any
import showErrorMessage from '@/utils/showErrorMessage'
import ExpandableSection from '@/components/expandIcon/index.vue'
//import router from '@/router'
import { unitFormatDate } from '@/utils/dateFormat/index'
import AddVoiceRoom from './addVoiceRoom.vue'
import EditVoiceRoom from './editVoiceRoom.vue'
import type { TableOptions } from '@/components/mTable/types'

import { useModalsStore, useValueBus } from '@/stores/modalStore'
import router from '@/router'
const modalsStore = useModalsStore()
const valueBus = useValueBus()

const tableData = ref<any[]>([])
const isExpanded = ref(false)
const queryRef = ref()

const options = ref<TableOptions[]>([
  {
    label: '语音房ID',
    prop: 'voiceRoomId',
    slot: 'voiceRoomId',
    align: 'right'
  },
  {
    label: '语音房名称',
    prop: 'voiceRoomName'
  },
  {
    label: '语音房简介',
    prop: 'voiceRoomDesc'
  },
  {
    label: '创建人',
    prop: 'creater',
    slot: 'creater'
  },
  {
    label: '在线人数',
    prop: 'onlineUserNum',
    align: 'right'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    slot: 'createTime',
    width: 180
  },
  {
    label: '结束时间',
    prop: 'endTime',
    slot: 'endTime',
    width: 180
  },
  {
    label: '热门时间',
    prop: 'hotTime',
    slot: 'hotTime',
    width: 180
  },
  {
    label: '状态',
    prop: 'state',
    slot: 'state',
    width: 110
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation',
    width: 180
  }
])

const initQueryForm = () => {
  return {
    voiceRoomId: '',
    voiceRoomName: '',
    creater: '',
    startCreateTime: '',
    endCreateTime: '',
    startHotTime: '',
    endHotTime: '',
    state: 'L'
  }
}

const queryForm = reactive(initQueryForm())
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)

//新增弹窗
const addDialogVisible = ref(false)
//编辑弹窗
const editDialogVisible = ref(false)
//loading 按钮
const isLoading = ref(false)

//模拟数据
const data = ref<any[]>([
  {
    voiceRoomId: '1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    voiceRoomName: '名称1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    voiceRoomDesc: '简介1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    creater: '1297873773466223631',
    onlineUserNum: 1,
    createTime: 1729560275,
    endTime: 1729561275,
    startHotTime: 1729562275,
    endHotTime: 1729563275,
    state: '1'
  },
  {
    voiceRoomId: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    voiceRoomName: '名称2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    voiceRoomDesc: '简介2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    creater: '1298225617812062209',
    onlineUserNum: 2,
    createTime: 1729560275,
    endTime: 1729561275,
    startHotTime: 1729562275,
    endHotTime: 1729563275,
    state: '0'
  }
])

const viewUserDetails = (rowData: any) => {
  console.log('查看用户详情', rowData)
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: rowData.creater
  })
  modalsStore.showModal('userInfoModal')
}

const returnFetchData = () => {
  addDialogVisible.value = false
  editDialogVisible.value = false
  fetchData()
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  returnFetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
    } else {
      console.log('表单验证失败')
    }
  })
}

const handleResetRefresh = () => {
  handleReset()
  // @ts-ignore
  queryForm.startTime = ''
  // @ts-ignore
  queryForm.endTime = ''
  fetchData()
}

const handleReset = () => {
  Object.assign(queryForm, initQueryForm())
  currentPage.value = 1
  pageSize.value = 15
}

//页面初始化获取数据
const fetchData = async (_queryForm?: any) => {
  let params = {
    ..._queryForm,
    page: currentPage.value,
    size: pageSize.value
  }
  if (params.type === 'L') {
    delete params.type
  }
  tableData.value = data.value
  console.log(111, tableData.value)
  // isLoading.value = true
  // try {
  //   const response = await reqPointRulesDetail(params)
  //   if (response.success) {
  //     tableData.value = response!.data!.list
  //     total.value = Number(response!.data!.total)
  //   } else {
  //     tableData.value = []
  //     total.value = 0
  //     showErrorMessage(response)
  //   }
  // } catch (error) {
  //   console.error('Error fetching data:', error)
  // } finally {
  //   isLoading.value = false
  // }
}

const statusChanged = (row) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(t('fyComfirm.switchComfirm'), t('pop.warn'), {
      confirmButtonText: t('button.determine'),
      cancelButtonClass: t('button.cancel'),
      type: 'warning'
    })
      .then(() => {
        updateStatus(row).then(resolve).catch(reject)
      })
      .catch(() => {
        reject(new Error('用户取消操作'))
      })
  })
}

const updateStatus = async (row) => {
  const params = row
  params.bbsStatus = row.bbsStatus === '1' ? '0' : '1'
  // try {
  //   const response = await editHttp(params)
  //   if (response.success) {
  //     ElMessage({
  //       message: '修改成功',
  //       type: 'success'
  //     })
  //     return Promise.resolve()
  //   } else {
  //     ElMessage({
  //       showClose: true,
  //       message: response.errMessage,
  //       type: 'error'
  //     })
  //     return Promise.reject(new Error(response.errMessage))
  //   }
  // } catch (error) {
  //   console.error('Error saving data:', error)
  //   ElMessage({
  //     showClose: true,
  //     message: '保存数据时出错',
  //     type: 'error'
  //   })

  //   return Promise.reject(error)
  // }
}

const addVoiceRoom = () => {
  addDialogVisible.value = true
  console.log('新增聊天室')
}

const editVoiceRoom = () => {
  editDialogVisible.value = true
  console.log('编辑聊天室')
}

const viewUserManagement = (data: any) => {
  console.log('成员管理')
  valueBus.resetValue('voiceRoomUserModal')
  valueBus.setValue('voiceRoomUserModal', { ...data, componentKey: Math.random() })
  router.push('/voiceRoomManagement/voiceRoomUserManagement').catch((err) => {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
    }
  })
}

onMounted(async () => {
  fetchData()
})
</script>

<style scoped lang="less">
/* Add any component-specific styles here */
.gray-box {
  background-color: #f5f7fa;
  border: none;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 8px;
}

.el-row {
  margin-bottom: 0;
}

.el-col {
  margin-bottom: 10px;
  padding: 10px;
}

.stat-header {
  font-weight: normal;
  font-size: 14px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
}

.stat-content {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blue-text {
  color: #409eff;
}
</style>
