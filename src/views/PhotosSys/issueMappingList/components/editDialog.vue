<script setup lang="ts">
import { fetchGameTypes } from '@/utils/table'
import { useIssueMappingApi } from '@/api/photoSys/issueMappingList'
import showErrorMessage from '@/utils/showErrorMessage'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { useSeriesApi } from '@/api/photoSys/series'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  fileId: {
    type: String,
    default: ''
  },
  manageSiteId: {
    type: String,
    default: ''
  }
})
const manageSiteId = computed(() => props.manageSiteId)
const { getGameTypeSeries, getGameTypeNewspaper } = useSeriesApi(manageSiteId)
const { getIssueMapping, editIssueMapping } = useIssueMappingApi(manageSiteId)
const initForm = () => {
  return {
    gameType: '',
    seriesCode: '',
    newspaperCode: '',
    fileId: '',
    createTime: ''
  }
}

const lineFormData = ref(initForm())
const fileId = computed(() => props.fileId)
const isVisible = ref(props.isVisible)
const gameTypeList = ref<any[]>([])
const seriesList = ref<any[]>([])
const newspaperList = ref<any[]>([])
const isLoading = ref(false)
const formRef = ref()
const emit = defineEmits(['back'])

const rulesForm = ref({
  gameType: [{ required: true, message: '请选择彩种', trigger: 'blur' }],
  seriesCode: [{ required: true, message: '请选择系列名称', trigger: 'blur' }],
  newspaperCode: [{ required: true, message: '请选择报纸名称', trigger: 'blur' }],
  fileId: [{ required: true, message: '请输入文件名称', trigger: 'blur' }]
})

const fetchData = async () => {
  if (!fileId.value) {
    return
  }
  try {
    let response: any = await getIssueMapping({ fileId: fileId.value })
    if (response.success) {
      lineFormData.value = response.data
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const changeGameType = async () => {
  lineFormData.value.seriesCode = ''
  lineFormData.value.newspaperCode = ''
  getSeriesList()
}

const getSeriesList = async () => {
  let params = {
    page: 1,
    size: 999,
    gameType: lineFormData.value.gameType
  }
  try {
    let response = await getGameTypeSeries(params)
    if (response.success) {
      seriesList.value = response.data.list || []
      console.log(seriesList.value)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const changeSeries = async () => {
  lineFormData.value.newspaperCode = ''
  getSeriesList()
}

const getNewspaperList = async () => {
  let params = {
    page: 1,
    size: 999,
    gameType: lineFormData.value.gameType,
    seriesCode: lineFormData.value.seriesCode
  }
  try {
    let response = await getGameTypeNewspaper(params)
    if (response.success) {
      newspaperList.value = response.data.list
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        let response: any = await editIssueMapping(lineFormData.value)
        if (response.success) {
          closeDialog()
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        showErrorMessage(error)
      } finally {
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

const closeDialog = () => {
  isVisible.value = false
  emit('back')
}

onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
  await fetchData()
  getSeriesList()
  getNewspaperList()
})
</script>

<template>
  <el-dialog
    v-model="isVisible"
    draggable
    overflow
    destroy-on-close
    class="tabs-dialog operate-button"
    @close="closeDialog"
  >
    <el-tabs class="m_tabs">
      <el-tab-pane label="映射" class="m_tabs_pane">
        <el-form
          :model="lineFormData"
          :rules="rulesForm"
          ref="formRef"
          class="dialog-form"
          style="width: 600px; margin: auto"
        >
          <el-form-item label="彩种:" prop="gameType">
            <el-select v-model="lineFormData.gameType" placeholder="彩种" style="width: 200px" @change="changeGameType">
              <el-option v-for="item in gameTypeList" :label="item.label" :value="Number(item.value)" />
            </el-select>
          </el-form-item>
          <el-form-item label="系列名称:" prop="seriesCode">
            <el-select
              v-model="lineFormData.seriesCode"
              placeholder="系列名称"
              :disabled="!lineFormData.gameType"
              @change="changeSeries"
            >
              <el-option
                v-for="item in seriesList"
                :key="item.seriesCode"
                :label="item.seriesName"
                :value="item.seriesCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="报纸名称:" prop="newspaperCode">
            <el-select v-model="lineFormData.newspaperCode" placeholder="报纸名称" :disabled="!lineFormData.seriesCode">
              <el-option
                v-for="item in newspaperList"
                :key="item.newspaperCode"
                :label="item.newspaperName"
                :value="item.newspaperCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件名称:" prop="fileId">
            <el-input v-model="lineFormData.fileId" />
          </el-form-item>
          <el-form-item label="创建时间:" prop="createTime">
            <span>{{ unitFormatDate(lineFormData.createTime, 'yyyy-MM-dd HH:mm:ss') }}</span>
          </el-form-item>
        </el-form>
        <div class="button-row">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="handleSubmit">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
