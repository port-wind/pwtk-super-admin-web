<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs class="m_tabs">
      <el-tab-pane label="基本信息" class="m_tabs_pane">
        <el-form :model="lineFormData" :rules="formRules" ref="editFormRef" class="dialog-form">
          <el-row justify="center" :gutter="20">
            <el-col :span="10">
              <el-form-item label="聊天室名称:" prop="chatroomName">
                <el-input v-model="lineFormData.chatroomName" maxlength="24" show-word-limit placeholder="聊天室名称" />
                <span>
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  随机房名
                </span>
              </el-form-item>
              <el-form-item label="聊天室简介:" prop="chatroomDesc">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="聊天室简介"
                  maxlength="255"
                  :rows="3"
                  v-model="lineFormData.chatroomDesc"
                  autocomplete="off"
                />
              </el-form-item>
              <el-form-item label="加热时间:" prop="heatTime">
                <TimeSelect2
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model:startDate="lineFormData.startHeatTime"
                  v-model:endDate="lineFormData.endHeatTime"
                ></TimeSelect2>
              </el-form-item>

              <el-form-item label="置顶:" prop="isTop">
                <el-radio-group v-model="lineFormData.isTop">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="选择房主:" prop="chatroomOwner">
                <UniRemoteInput
                  v-model="lineFormData.chatroomOwner"
                  :search-obj="{}"
                  valueKey="userId"
                  labelKey="nickname"
                  searchKey="userId"
                  placeholder="房主"
                  event-focus="focus"
                  :fetchOptions="filteredReqUserList"
                  style="width: 240px"
                  :formatLabel="(item) => (item.nickname ? `${item.nickname} - ${item.userId}` : item.userId)"
                  @valueChange="handleReplyUserIdChange"
                />
                <el-button @click="handleAddOwner">添加</el-button>
              </el-form-item>
              <div class="owenerList">
                <div class="owenerItem" v-for="item in lineFormData.chatroomOwnerList" :key="item.userId">
                  <span>房主:</span>
                  <span>{{ item.nickname }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row" v-if="isOperateShow">
          <el-button @click="cancle">取消</el-button>
          <el-button type="primary" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { create, update, getDetailById } from '@/api/photoSys/news'
import { reqUserList } from '@/api/user/index'

const props = defineProps({
  isOperateShow: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  formMode: {
    type: String,
    default: 'add'
  },
  row: {
    type: Object,
    default: () => ({})
  }
})
const chosenUserInfo = ref({})
const editFormRef = ref()

const isVisible = computed(() => props.isVisible)
const formMode = computed(() => props.formMode)
const modalData = computed(() => props.row)
const row: any = computed(() => props.row)

const filteredReqUserList = computed(() => {
  return async (query: string) => {
    try {
      const response = await reqUserList(query)
      const result = { ...response }
      if (result.success) {
        result.data.list = result.data.list.map((item) => ({
          ...item,
          disabled: lineFormData.value.chatroomOwnerList.some((owner) => owner.userId === item.userId)
        }))
      }
      return result
    } catch (error: any) {
      const res = {
        errMessage: error.message,
        errCode: error.code
      }
      showErrorMessage(res)
      return res
    }
  }
})
const initChatroomForm = () => {
  return {
    chatroomName: '',
    chatroomDesc: '',
    startHeatTime: '',
    endHeatTime: '',
    isTop: 'n',
    chatroomOwner: '',
    chatroomOwnerList: [] as any[]
  }
}
const lineFormData = ref(initChatroomForm())

const emit = defineEmits(['callBack', 'refreshPage'])

//新增的时候的
const rulesAdd = ref({
  seriesCode: [{ required: true, message: '请输入系列ID', trigger: 'blur' }],
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  newspaperCode: [
    { required: true, message: '请输入报纸ID', trigger: 'blur' },
    {
      pattern: /^[a-z0-9]+$/,
      message: '报纸ID只能包含小写英文字母和数字',
      trigger: 'blur'
    }
  ],
  newspaperName: [{ required: true, message: '请输入报纸名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})
//编辑的时候的
const rulesEdit = ref({
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }]
})

const formRules = ref(formMode.value === 'add' ? rulesAdd : rulesEdit)
const handleReplyUserIdChange = (userInfo) => {
  console.log('value', userInfo)
  chosenUserInfo.value = userInfo

  console.log('lineFormData.value', lineFormData.value)
}
const handleAddOwner = () => {
  console.log('添加房主')
  lineFormData.value.chatroomOwnerList.push({
    ...chosenUserInfo.value
  })
  lineFormData.value.chatroomOwner = ''
}
const close = () => {
  emit('callBack')
  console.log('关闭')
}

const handleSave = async () => {
  try {
    await editFormRef.value.validate()
    const action = formMode.value === 'add' ? create : update
    const dataToSend = {
      ...lineFormData.value
    }
    const response = await action(dataToSend)
    if (response.success) {
      ElMessage.success(formMode.value === 'add' ? '添加成功' : '更新成功')
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const cancle = () => {
  emit('callBack')
  console.log('取消')
}
const initializeFormData = async () => {
  if (formMode.value === 'edit') {
    const { id, seriesCode, gameType } = row.value
    const { newspaperCode, newspaperId } = modalData.value

    const response = await getDetailById({
      id: newspaperId,
      seriesCode,
      newspaperCode,
      newspaperId
    })
    if (response.success) {
      const { newsLayoutRelations, layoutCode } = response.data

      lineFormData.value = {
        ...response.data
      }
    }
  }
}
onMounted(async () => {
  await initializeFormData()
})
</script>

<style lang="scss" scoped></style>
