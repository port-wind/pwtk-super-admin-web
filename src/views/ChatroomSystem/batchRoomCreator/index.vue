<template>
  <div id="system_account" class="main_container">
    <section id="domainSearchForm" ref="queryRef">
      <el-button type="primary" @click="handleAddChatroom">添加聊天室</el-button>
    </section>
    <section class="main_flex_table">
      <el-table ref="tableRef" :data="fullTableList" :loading="isLoading" stripe highlight-current-row>
        <el-table-column width="55" v-if="!resultFlag">
          <template #header>
            <el-checkbox v-model="isAllSelected" :indeterminate="isIndeterminate" @change="handleSelectAll" />
          </template>
          <template #default="{ row }">
            <el-checkbox v-model="row.checked" @change="handleCheckboxChange" />
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="roomSeq" align="left" width="60" />
        <el-table-column label="聊天室名称" prop="chatroomName" align="left">
          <template #default="{ row }">
            {{ row.chatroomName }}
            <EditablePopover
              v-model:visible="row.editChatroomNameVisible"
              @edit="handleChatroomNameEdit(row)"
              @confirm="handleChatroomNameConfirm(row)"
            >
              <el-form ref="editChatroomNameFormRef" :model="{ ...row }" :rules="editChatroomRules">
                <el-form-item label="" prop="chatroomName">
                  <el-input v-model="row.chatroomNameTemp" />
                </el-form-item>
              </el-form>
            </EditablePopover>
          </template>
        </el-table-column>
        <el-table-column label="聊天室简介" prop="chatroomIntro">
          <template #default="{ row }">
            {{ row.chatroomIntro }}
            <!-- v-model:visible="row.editChatroomIntroVisible" -->

            <EditablePopover
              v-model:visible="row.editChatroomIntroVisible"
              @edit="handleChatroomIntroEdit(row)"
              @confirm="handleChatroomIntroConfirm(row)"
            >
              <el-form ref="editChatroomIntroFormRef" :model="{ ...row }" :rules="editChatroomRules">
                <el-form-item label="" prop="chatroomIntro">
                  <el-input type="textarea" rows="5" v-model="row.chatroomIntroTemp" />
                </el-form-item>
              </el-form>
            </EditablePopover>
          </template>
        </el-table-column>
        <el-table-column label="加热时间" width="200">
          <template #default="{ row }">
            {{ unitFormatDate(row.heatStartTime, 'yyyy-MM-dd HH:mm:ss') }} 至
            {{ unitFormatDate(row.heatEndTime, 'yyyy-MM-dd HH:mm:ss') }}
            <EditablePopover
              v-model:visible="row.editHeatTimeVisible"
              @edit="handleHeatTimeEdit(row)"
              @confirm="handleHeatTimeConfirm(row)"
            >
              <el-form ref="editHeatTimeFormRef" :model="{ ...row }" :rules="editChatroomRules">
                <TimeSelect2
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model:startDate="row.heatStartTimeTemp"
                  v-model:endDate="row.heatEndTimeTemp"
                  :minDate="new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())"
                ></TimeSelect2>
              </el-form>
            </EditablePopover>
          </template>
        </el-table-column>
        <el-table-column label="是否置顶" width="100">
          <template #default="{ row }">
            <span style="margin-right: 10px">
              {{ row.isTop === 'y' ? '是' : '否' }}
            </span>
            <el-switch
              v-model="row.isTop"
              :active-value="'y'"
              :inactive-value="'n'"
              :before-change="() => statusChanged(row, updateRowDetail, fetchData)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="房主">
          <template #default="{ row }">
            {{ row.homeownerName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template #default="{ row }">
            <span type="text" style="color: #409eff; cursor: pointer" @click="addOwner(row)">添加房主</span>
            <span type="text" style="color: #f56c6c; cursor: pointer; margin-left: 20px" @click="deleteChatroom(row)">
              移除
            </span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="footer">
      <el-checkbox
        v-model="isAllSelected"
        :indeterminate="isIndeterminate"
        @change="handleSelectAll"
        style="margin-right: 20px"
      >
        全选
      </el-checkbox>
      <el-button @click="handleBatchName">批量设置名称</el-button>
      <el-button @click="handleBatchHomeowner">批量设置房主</el-button>
      <el-button @click="handleRemove">移除</el-button>
      <el-button type="primary" @click="handleConfirm">提交</el-button>
    </section>
    <!-- 添加房住弹出框 -->
    <AddOwnerDialog
      v-if="editHomeownerVisible"
      :isVisible="editHomeownerVisible"
      :userId="userId"
      @callBack="confirmOwner"
    ></AddOwnerDialog>
    <addChatroomNameDialog
      v-if="editChatroomNameVisible"
      :isVisible="editChatroomNameVisible"
      @callBack="confirmChatroomName"
    ></addChatroomNameDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import { storeToRefs } from 'pinia'
import showErrorMessage from '@/utils/showErrorMessage'
import EditablePopover from '@/views/ChatroomSystem/batchRoomCreator/components/mPopover.vue'
import { statusChanged } from '@/utils/table'
import AddOwnerDialog from '@/views/ChatroomSystem/batchRoomCreator/components/addOwnerDialog.vue'
import addChatroomNameDialog from './components/addChatroomNameDialog.vue'
import { unitFormatDate } from '@/utils/dateFormat/index'

const modalsStore = useModalsStore()
const { checkboxTable } = storeToRefs(modalsStore)

const isLoading = ref(false)
const tableRef = ref()
const pushFunction = computed(() => checkboxTable.value.modalData?.pushFunction)
const fullTableList = ref<any[]>([])
const editChatroomNameFormRef = ref()
const editChatroomIntroFormRef = ref()
const editHeatTimeFormRef = ref()
const isAllSelected = ref(false)
const isIndeterminate = ref(false)
const selectedRows = computed(() => fullTableList.value.filter((item) => item.checked).map((item) => item.siteId))
const editChatroomRules = ref({
  chatroomName: [{ required: true, message: '请输入聊天室名称', trigger: 'blur' }],
  chatroomIntro: [{ required: true, message: '请输入聊天室简介', trigger: 'blur' }]
})
const numOfSuccess = ref(0)
const resultFlag = computed(() => numOfSuccess.value > 0)

const userId = ref()
const editHomeownerVisible = ref(false)
const roomSeq = ref()

const editChatroomNameVisible = ref(false)

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
function handleAddChatroom() {
  fullTableList.value.push({
    roomSeq: fullTableList.value.length + 1,
    chatroomName: 'TK聊天室-' + (fullTableList.value.length + 1),
    oapiUrl: '',
    chatroomIntro: '欢迎大家加入聊天室，多多交流！',
    heatStartTime: new Date().getTime(),
    heatEndTime: new Date().getTime() + 1000 * 60 * 60 * 24,
    isTop: 'n',
    homeownerName: '',
    homeownerId: '',
    editChatroomNameVisible: false,
    editChatroomIntroVisible: false,
    editHeatTimeVisible: false,
    checked: false
  })
}

//清除全部编辑框
function clearAllEdit() {
  fullTableList.value.forEach(
    (item) => (
      (item.editChatroomIntroVisible = false),
      (item.editHeatTimeVisible = false),
      (item.editChatroomNameVisible = false)
    )
  )
}

//聊天室名称
function handleChatroomNameEdit(row: any) {
  console.log('row', row)
  clearAllEdit()
  row.chatroomNameTemp = row.chatroomName
  row.editChatroomNameVisible = true
}
function handleChatroomNameConfirm(row: any) {
  row.chatroomName = row.chatroomNameTemp
  row.editChatroomNameVisible = false
}

//聊天室简介
function handleChatroomIntroEdit(row: any) {
  console.log('row', row)
  clearAllEdit()
  row.chatroomIntroTemp = row.chatroomIntro
  row.editChatroomIntroVisible = true
}
function handleChatroomIntroConfirm(row: any) {
  row.chatroomIntro = row.chatroomIntroTemp
  row.editChatroomIntroVisible = false
}

//加热时间
function handleHeatTimeEdit(row: any) {
  console.log('row', row)
  clearAllEdit()
  row.heatStartTimeTemp = row.heatStartTime
  row.heatEndTimeTemp = row.heatEndTime
  row.editHeatTimeVisible = true
}
function handleHeatTimeConfirm(row: any) {
  row.heatStartTime = row.heatStartTimeTemp
  row.heatEndTime = row.heatEndTimeTemp
  row.editHeatTimeVisible = false
}

//房主
async function addOwner(row: any) {
  console.log('row', row)
  roomSeq.value = row.roomSeq
  userId.value = row.homeownerId
  editHomeownerVisible.value = true
}

function confirmOwner(userInfo: any) {
  console.log('userInfo', userInfo)
  if (userInfo) {
    if (roomSeq.value) {
      fullTableList.value.forEach((item) => {
        console.log('item', item, roomSeq.value)
        if (item.roomSeq == roomSeq.value) {
          item.homeownerName = userInfo.loginId
          item.homeownerId = userInfo.userId
          roomSeq.value = ''
          userId.value = ''
          return
        }
      })
    } else {
      fullTableList.value.forEach((item) => {
        if (item.checked == true) {
          item.homeownerName = userInfo.loginId
          item.homeownerId = userInfo.userId
        }
      })
    }
  }
  editHomeownerVisible.value = false
}

async function deleteChatroom(row: any) {
  console.log('row', row)
  fullTableList.value = fullTableList.value
    .filter((item) => item.roomSeq !== row.roomSeq)
    .map((item, index) => ({ ...item, roomSeq: index + 1 }))
}

function updateRowDetail(row: any) {
  return Promise.resolve({ success: true })
}
function fetchData() {
  return Promise.resolve({ success: true })
}

//批量设置房主
function handleBatchHomeowner() {
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  userId.value = ''
  editHomeownerVisible.value = true
}

//批量设置房间名字
function handleBatchName() {
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  editChatroomNameVisible.value = true
}

function confirmChatroomName(chatroomName: any) {
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  fullTableList.value.forEach((item) => {
    if (item.checked == true) {
      item.chatroomName = chatroomName
    }
  })
  editChatroomNameVisible.value = false
}

//批量移除
function handleRemove() {
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  ElMessageBox.confirm('已选择 ' + count + ' 个聊天室，确认移除吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      fullTableList.value = fullTableList.value.filter((item) => item.checked !== true)
      fullTableList.value = fullTableList.value.map((item, index) => ({
        ...item,
        roomSeq: index + 1
      }))
    })
    .catch(() => {})
}

//提交
async function handleConfirm() {
  console.log('提交', fullTableList.value)
  const count = fullTableList.value.filter((item) => item.checked === true).length
  if (count === 0) {
    return
  }
  // if (selectedRows.value.length === 0) {
  //   ElMessage({
  //     message: '请选择要同步的网站',
  //     type: 'warning'
  //   })
  //   return
  // }
  // try {
  //   const response = await pushFunction.value({ list: selectedRows.value })
  //   if (response.success) {
  //     // closeDialog()
  //     const { data } = response
  //     console.log('data', data)
  //   } else {
  //     showErrorMessage(response)
  //   }
  // } catch (error) {
  //   console.error('Error:', error)
  // }
}

onMounted(() => {})
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
