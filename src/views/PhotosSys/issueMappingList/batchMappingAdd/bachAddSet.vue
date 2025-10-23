<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { useSeriesApi } from '@/api/photoSys/series'
import { fetchGameTypes } from '@/utils/table'

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  manageSiteId: {
    type: String,
    default: ''
  }
})
const manageSiteId = computed(() => props.manageSiteId)
const { getGameTypeSeries, getGameTypeNewspaper } = useSeriesApi(manageSiteId)

const emit = defineEmits(['back'])

const isVisible = computed(() => props.isVisible)
const isLoading = ref(false)
const formRef = ref()

const initFormData = () => ({
  gameType: '',
  seriesCode: '',
  seriesList: [],
  newspaperCode: '',
  newspaperList: []
})

const formData = ref<any>(initFormData())
const gameTypeList = ref<any[]>([])

const changeGameType = async () => {
  console.log(formData)
  formData.value.seriesCode = ''
  formData.value.seriesList = []
  formData.value.newspaperCode = ''
  formData.value.newspaperList = []
  let params = {
    page: 1,
    size: 999,
    gameType: formData.value.gameType
  }
  try {
    let response = await getGameTypeSeries(params)
    if (response.success) {
      formData.value.seriesList = response.data.list || []
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const changeSeries = async () => {
  formData.value.newspaperCode = ''
  formData.value.newspaperList = []
  let params = {
    page: 1,
    size: 999,
    gameType: formData.value.gameType,
    seriesCode: formData.value.seriesCode
  }
  try {
    let response = await getGameTypeNewspaper(params)
    if (response.success) {
      formData.value.newspaperList = response.data.list || []
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    showErrorMessage(error)
  } finally {
  }
}

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log('back', formData.value)
      emit('back', formData.value)
      formData.value = initFormData()
    }
  })
}

const handleCancel = () => {
  emit('back')
  formData.value = initFormData()
}

onMounted(async () => {
  gameTypeList.value = await fetchGameTypes(isLoading)
})
</script>
<template>
  <el-popover :visible="isVisible" :width="200">
    <div>
      <el-form :model="formData" ref="formRef" class="dialog-form" label-position="top">
        <el-form-item label="彩种:" prop="gameType">
          <el-select v-model="formData.gameType" placeholder="彩种" @change="changeGameType">
            <el-option v-for="item in gameTypeList" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="系列名称:" prop="seriesCode">
          <el-select
            v-model="formData.seriesCode"
            placeholder="系列名称"
            :disabled="!formData.gameType"
            @change="changeSeries"
          >
            <el-option
              v-for="item in formData.seriesList"
              :key="item.seriesCode"
              :label="item.seriesName"
              :value="item.seriesCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报纸名称:" prop="newspaperCode">
          <el-select v-model="formData.newspaperCode" placeholder="报纸名称" :disabled="!formData.seriesCode">
            <el-option
              v-for="item in formData.newspaperList"
              :key="item.newspaperCode"
              :label="item.newspaperName"
              :value="item.newspaperCode"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align: right; margin: 0">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <template #reference>
      <slot></slot>
    </template>
  </el-popover>
</template>
