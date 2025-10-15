<template>
  <div id="system_account" class="main_container">
    <!-- Search Form -->
    <div ref="tableRef">
      <el-form ref="queryRef" :inline="true" :model="queryForm" class="search_left">
        <el-form-item label="" prop="userName">
          <el-input v-model="queryForm.userName" placeholder="用户昵称" />
        </el-form-item>
        <el-form-item label="" prop="">
          <TimeSelect
            start-placeholder="加入开始时间"
            end-placeholder="加入结束时间"
            v-model:startDate="queryForm.joinStartTime"
            v-model:endDate="queryForm.joinEndTime"
          ></TimeSelect>
        </el-form-item>
        <el-form-item label="" prop="state">
          <el-select v-model="queryForm.state" placeholder="全部状态">
            <el-option label="全部" value="L" />
            <el-option label="在线" value="1" />
            <el-option label="已上麦" value="2" />
            <el-option label="闭麦中" value="3" />
            <el-option label="已退出" value="4" />
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
          <el-button type="success" @click="handleAddButton">
            <el-icon>
              <Plus />
            </el-icon>
            新增
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
      >
        <template #userName="{ scope }">
          <p class="like-a overflow-hidden">{{ scope.row.userName }}</p>
        </template>
        <template #joinStartTime="{ scope }">
          {{ unitFormatDate(scope.row.joinStartTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #joinEndTime="{ scope }">
          {{ unitFormatDate(scope.row.joinEndTime, 'yyyy-MM-dd HH:mm:ss') }}
        </template>
        <template #state="{ scope }">
          <el-dropdown trigger="click" size="small" @command="stateChange">
            <span class="el-dropdown-link">
              <el-tag v-if="scope.row.state == '1'" class="mx-1" type="primary">在线</el-tag>
              <el-tag v-else-if="scope.row.state == '2'" class="mx-1" type="success">已上麦</el-tag>
              <el-tag v-else-if="scope.row.state == '3'" class="mx-1" type="warning">闭麦中</el-tag>
              <el-tag v-else-if="scope.row.state == '4'" class="mx-1" type="danger" effect="dark">已退出</el-tag>
            </span>
            <template #dropdown>
              <el-dropdown-menu v-if="!(scope.row.state == '4')">
                <el-dropdown-item
                  v-if="scope.row.state == '1' || scope.row.state == '3'"
                  class="mx-1"
                  :command="{ userId: scope.row.userId, userStatus: '2' }"
                >
                  <el-tag type="success">上麦</el-tag>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.state == '2' || scope.row.state == '3'"
                  class="mx-1"
                  :command="{ userId: scope.row.userId, userStatus: '1' }"
                >
                  <el-tag type="primary">下麦</el-tag>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.state == '2'"
                  class="mx-1"
                  :command="{ userId: scope.row.userId, userStatus: '3' }"
                >
                  <el-tag type="warning">闭麦</el-tag>
                </el-dropdown-item>
                <el-dropdown-item class="mx-1" :command="{ userId: scope.row.userId, userStatus: '4' }">
                  <el-tag type="danger" effect="dark">踢出</el-tag>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template #operation="{ scope }">
          <el-link type="primary" style="color: #00aaaa">消息管理</el-link>
        </template>
      </m-table>
    </section>

    <!-- 新增 弹出框 -->
    <AddVoiceRoomUser :isVisible="addDialogVisible" @callBack="closeDialog()" />
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
    userId: 1,
    userName: '1凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    joinStartTime: 1729562275,
    joinEndTime: 1729563275,
    speakNum: 1,
    state: '1'
  },
  {
    userId: 2,
    userName: '2凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    joinStartTime: 2729562275,
    joinEndTime: 2729563275,
    speakNum: 2,
    state: '2'
  },
  {
    userId: 3,
    userName: '3凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    joinStartTime: 3729562275,
    joinEndTime: 3729563275,
    speakNum: 3,
    state: '3'
  },
  {
    userId: 4,
    userName: '4凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数凑字数',
    joinStartTime: 4729562275,
    joinEndTime: 4729563275,
    speakNum: 4,
    state: '4'
  }
])

const voiceRoomId = computed(() => valueBus.voiceRoomUserModal?.voiceRoomId)
const componentKey = computed(() => valueBus.voiceRoomUserModal?.componentKey)

const tableRef = ref()
const queryRef = ref()
const tableData = ref<any>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
//新增弹窗
const addDialogVisible = ref(false)
//loading 按钮
const isLoading = ref(false)
const initForm = {
  voiceRoomId: voiceRoomId.value,
  userName: '',
  state: 'L',
  joinStartTime: null,
  joinEndTime: null,
  sortName: 'create_time',
  sortOrder: 'DESC'
}
const queryForm = ref(initForm)

const options = ref<TableOptions[]>([
  {
    label: '用户昵称',
    prop: 'userName',
    slot: 'userName'
  },
  {
    label: '加入时间',
    prop: 'joinStartTime',
    slot: 'joinStartTime'
  },
  {
    label: '退出时间',
    prop: 'joinEndTime',
    slot: 'joinEndTime'
  },
  {
    label: '发言数',
    prop: 'speakNum',
    align: 'right'
  },
  {
    label: '当前状态',
    prop: 'state',
    slot: 'state'
  },
  {
    label: '操作',
    prop: 'operation',
    slot: 'operation'
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
  queryForm.value.joinEndTime = null
  queryForm.value.joinStartTime = null
  currentPage.value = 1
  fetchData()
}

//弹窗添加按钮点击
const handleAddButton = () => {
  addDialogVisible.value = true
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
const stateChange = () => {}

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
          addDialogVisible.value = false
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

const closeDialog = () => {
  addDialogVisible.value = false
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
