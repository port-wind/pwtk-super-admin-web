<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <el-form-item label="" prop="voiceRoomId">
          <el-input v-model="queryForm.voiceRoomId" placeholder="语音房ID" />
        </el-form-item>
        <el-form-item label="" prop="voiceRoomName">
          <el-input v-model="queryForm.voiceRoomName" placeholder="语音房名称" />
        </el-form-item>
        <el-form-item label="" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="发表开始时间"
            end-placeholder="发表结束时间"
            v-model:startDate="queryForm.startTime"
            v-model:endDate="queryForm.endTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="state">
          <el-select v-model="queryForm.state" placeholder="全部状态">
            <el-option label="全部" value="L" />
            <el-option label="显示" value="1" />
            <el-option label="隐藏" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData(1)" :loading="isLoading">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button type="primary" @click="resetButton" plain>
            <el-icon>
              <Refresh />
            </el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Data Table -->
    <section class="main_flex_table">
      <m-table
        class="m_table_image"
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
        :show-overflow-tooltip="{ disabled: true }"
      >
        <template #userName="{ scope }">
          <p class="like-a overflow-hidden" @click="viewUserDetails(scope.row)">
            {{ scope.row.userName }}
          </p>
        </template>
        <template #createTime="{ scope }">
          {{ unitFormatDate(scope.row.createTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #state="{ scope }">
          <span style="margin-right: 10px">
            {{ scope.row.state == '1' ? '显示' : '隐藏' }}
          </span>
          <el-switch
            v-model="scope.row.state"
            :active-value="'1'"
            :inactive-value="'0'"
            :before-change="() => stateChange(scope.row)"
          ></el-switch>
        </template>
      </m-table>
    </section>
    <UserListComponent></UserListComponent>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n from '@/i18n'
const { t } = i18n.global as any
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import { reqHttp, addHttp } from '@/api/bss/infoManagement/index'
import AutoComplete from '@/components/AutoComplete/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useModalsStore, useValueBus } from '@/stores/modalStore'
import { TableOptions } from '@/components/mTable/types'
const modalsStore = useModalsStore()
const valueBus = useValueBus()

//模拟数据
const data = ref<any[]>([
  {
    voiceRoomId: '1凑字数凑字数凑字数凑字数凑字数凑字',
    voiceRoomName: '1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    userId: 1,
    userName: '1凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    msgContent: '1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑',
    createTime: 1729562275,
    state: '0'
  },
  {
    voiceRoomId: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    voiceRoomName: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    userId: 2,
    userName: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    msgContent: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    createTime: 2729562275,
    state: '1'
  }
])

const tableRef = ref()
const queryRef = ref()
const tableData = ref<any>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
//loading 按钮
const isLoading = ref(false)
const initForm = {
  voiceRoomId: '',
  voiceRoomName: '',
  msgContent: '',
  userId: '',
  userName: '',
  state: 'L',
  startTime: null,
  endTime: null,
  sortName: 'create_time',
  sortOrder: 'DESC'
}
const queryForm = ref(initForm)

const options = ref<TableOptions[]>([
  {
    label: '语音房ID',
    prop: 'voiceRoomId',
    align: 'right'
  },
  {
    label: '语音房名称',
    prop: 'voiceRoomName'
  },
  {
    label: '用户昵称',
    prop: 'userName',
    slot: 'userName'
  },
  {
    label: '消息内容',
    prop: 'msgContent'
  },
  {
    label: '发表时间',
    prop: 'createTime',
    slot: 'createTime',
    width: 180
  },
  {
    label: '当前状态',
    prop: 'state',
    slot: 'state',
    width: 110
  }
])

//页面初始化获取数据
const fetchData = async (page?) => {
  if (page) {
    currentPage.value
  }
  let params = {
    page: currentPage.value,
    size: pageSize.value,
    ...queryForm.value
  }
  tableData.value = data.value
  // isLoading.value = true
  // try {
  //   const response = await reqHttp(params)
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

//重置按钮
const resetButton = () => {
  queryRef.value.resetFields()
  queryForm.value.endTime = null
  queryForm.value.startTime = null
  currentPage.value = 1
  fetchData()
}

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  currentPage.value = Math.ceil(((currentPage.value - 1) * pageSize.value + 1) / val)
  pageSize.value = val
  fetchData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

//状态修改
const stateChange = (row) => {}

//提交按钮
const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      try {
        const response = await addHttp(params)

        if (response.success) {
          fetchData() // 保存成功后重新获取数据
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

const viewUserDetails = (row) => {
  modalsStore.setActiveTab('userInfoModal', 'tab1')
  modalsStore.setModalData('userInfoModal', {
    userId: row.userId
  })
  modalsStore.showModal('userInfoModal')
}

onMounted(fetchData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
