<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs class="m_tabs">
      <el-tab-pane label="基本信息" class="m_tabs_pane">
        <el-form :model="lineFormData" :rules="rulesForm" ref="formRef" class="dialog-form">
          <el-row justify="center" :gutter="20">
            <el-col :span="10">
              <el-form-item label="语音房关联彩种:" prop="gameType">
                <el-select>
                  <el-select v-model="lineFormData.gameType" placeholder="彩种">
                    <el-option v-for="item in gameTypeList" :label="item.label" :value="item.value" />
                  </el-select>
                </el-select>
              </el-form-item>
              <el-form-item label="语音房关联系列:" prop="series">
                <el-select>
                  <el-select v-model="lineFormData.series" placeholder="系列">
                    <el-option v-for="item in seriesList" :label="item.label" :value="item.value" />
                  </el-select>
                </el-select>
              </el-form-item>
              <el-form-item label="语音房关联期数:" prop="period">
                <el-select>
                  <el-select v-model="lineFormData.period" placeholder="系列">
                    <el-option v-for="item in periodList" :label="item.label" :value="item.value" />
                  </el-select>
                </el-select>
              </el-form-item>
              <el-form-item label="语音房名称:" prop="voiceRoomName">
                <el-input
                  v-model="lineFormData.voiceRoomName"
                  maxlength="24"
                  show-word-limit
                  placeholder="语音房名称"
                />
                <span>
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  随机房名
                </span>
              </el-form-item>
              <el-form-item label="语音房简介:" prop="voiceRoomDesc">
                <el-input
                  type="textarea"
                  show-word-limit
                  placeholder="聊天室简介"
                  maxlength="100"
                  :rows="3"
                  v-model="lineFormData.voiceRoomDesc"
                  autocomplete="off"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="加热时间:" prop="hotTime">
                <TimeSelect2
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model:startDate="lineFormData.startHotTime"
                  v-model:endDate="lineFormData.endHotTime"
                ></TimeSelect2>
              </el-form-item>
              <el-form-item label="置顶:" prop="isTop">
                <el-switch v-model="lineFormData.isTop" :active-value="'y'" :inactive-value="'n'"></el-switch>
              </el-form-item>
              <el-form-item label="选择房主:" prop="voiceRoomOwner">
                <UniRemoteInput
                  v-model="lineFormData.voiceRoomOwner"
                  :search-obj="{}"
                  valueKey="userId"
                  labelKey="loginId"
                  searchKey="userId"
                  placeholder="房主"
                  event-focus="focus"
                  :fetchOptions="filteredReqUserList"
                  style="width: 240px"
                  :formatLabel="(item) => (item.nickname ? `${item.nickname} - ${item.userId}` : item.userId)"
                  @valueChange="handleReplyUserIdChange"
                />
                <el-button type="primary" @click="handleAddOwner">查询</el-button>
              </el-form-item>
              <div class="owener-list">
                <div class="owener-item" v-for="item in lineFormData.voiceRoomOwnerList" :key="item.userId">
                  <el-row class="owener-item-header">
                    <el-col :span="18">用户昵称</el-col>
                    <el-col :span="6">操作</el-col>
                  </el-row>
                  <el-row class="owener-item-body">
                    <el-col :span="18" class="owener-item-userInfo">
                      <el-image :src="VITE_CDN_URL + item.avatar" class="owener-item-img" />
                      <span class="like-a">{{ item.nickname }}</span>
                    </el-col>
                    <el-col :span="6">
                      <span class="like-a" @click="removeOwner">移除</span>
                    </el-col>
                  </el-row>
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
import { reqUserList } from '@/api/user/index'
import { fetchGameTypes } from '@/utils/table'

const { VITE_CDN_URL } = webConfigApi
const seriesList = ref([
  {
    label: '特肖',
    value: 0
  },
  {
    label: '特码',
    value: 1
  }
])

const periodList = ref([
  {
    label: '100期',
    value: '100'
  },
  {
    label: '99期',
    value: '99'
  },
  {
    label: '98期',
    value: '98'
  }
])

const props = defineProps({
  isOperateShow: {
    type: Boolean,
    default: true
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  row: {
    type: Object,
    default: () => ({})
  }
})

const chosenUserInfo = ref({})
const formRef = ref()
const gameTypeList = ref()
const isLoading = ref(false)

const isVisible = computed(() => props.isVisible)

const filteredReqUserList = computed(() => {
  return async (query: string) => {
    try {
      const response = await reqUserList(query)
      const result = { ...response }
      if (result.success) {
        result.data.list = result.data.list.map((item) => ({
          ...item,
          disabled: lineFormData.value.voiceRoomOwnerList.some((owner) => owner.userId === item.userId)
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

const initVoiceRoomForm = () => {
  return {
    voiceRoomId: '',
    voiceRoomName: '',
    voiceRoomDesc: '',
    gameType: '',
    series: '',
    period: '',
    startHotTime: '',
    endHotTime: '',
    isTop: 'n',
    comment: 'y',
    voiceRoomOwner: '',
    voiceRoomOwnerList: [] as any[]
  }
}
const lineFormData = ref(initVoiceRoomForm())

const emit = defineEmits(['callBack', 'refreshPage'])

//新增的时候的
const rulesForm = ref({
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }],
  series: [{ required: true, message: '请选择系列', trigger: 'change' }],
  voiceRoomName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  voiceRoomOwner: [{ required: true, message: '请输入房主', trigger: 'blur' }]
})

const handleReplyUserIdChange = (userInfo) => {
  chosenUserInfo.value = userInfo
}

const handleAddOwner = () => {
  lineFormData.value.voiceRoomOwnerList = []
  if (Object.keys(chosenUserInfo.value).length > 0) {
    lineFormData.value.voiceRoomOwnerList.push({
      ...chosenUserInfo.value
    })
  }
  lineFormData.value.voiceRoomOwner = ''
}

const removeOwner = () => {
  chosenUserInfo.value = {}
  handleAddOwner()
}

const close = () => {
  emit('callBack')
}

const handleSave = async () => {}

const cancle = () => {
  emit('callBack')
  console.log('取消')
}

onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
})
</script>

<style lang="less" scoped>
.owener-item {
  margin-left: 130px;
  margin-bottom: 20px;
  width: 80%;
  .owener-item-header {
    background-color: #f2f2f2;
    padding: 8px 20px;
  }
  .owener-item-body {
    padding: 20px;
    align-items: center;
    border: 1px solid #d7d7d7;
    border-top: 0;
    .owener-item-userInfo {
      display: flex;
      align-items: center;
      .owener-item-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
  }
}
</style>
