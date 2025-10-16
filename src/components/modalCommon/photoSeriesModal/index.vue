<script setup lang="ts">
import { useModalsStore } from '@/stores/modalStore'
import {
  createGameTypeSeries,
  editGameTypeSeries,
  getGameTypeSeriesDetail,
  getMaxSortNo,
  checkSortNoExist
} from '@/api/photoSys/series'
import { fetchGameTypes } from '@/utils/table'
import type { FormInstance, FormRules } from 'element-plus'
import { unitFormatDate } from '@/utils/dateFormat/index'
import linkWithCopy from '@/components/linkWithCopy/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import { cloneDeep } from 'lodash-es'
interface FormModelType {
  seriesCode: string
  gameType: string | null
  seriesName: string
  seriesShortName: string
  blackWhiteCount: string
  colorfulCount: string
  createTime: string
  sortNo: string
  seriesDesc: string
  memo: string
  isRecommended: 'y' | 'n'
  isHot: 'y' | 'n'
  isTop: 'y' | 'n'
  isSelected: 'y' | 'n'
  isBloom: 'y' | 'n'
  manageSiteId: string
}

interface GameOptionType {
  label: string
  value: string
}

const props = defineProps({
  isOperateShow: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<{
  alreadyClosed: []
  alreadySubmit: [isNeedResetPage: boolean]
}>()

const ME = 'photoSeriesModal'

const modalStore = useModalsStore()

const formRef = ref<FormInstance>()

const { isVisible, modalData } = toRefs(modalStore.photoSeriesModal)

const isLoading = ref(false)

const mode = ref<'add' | 'edit'>('add')

const gameOptions = ref<GameOptionType[]>([])

const formModel = ref<FormModelType | null>(null)

// 备份一份formModel，提交时如果没有修改，直接关闭 (只在修改时使用)
const formModelBackup = ref<FormModelType | null>(null)

//最大排序
const maxSortNoValue = ref()

const rules = computed(() => ({
  seriesName: [{ required: true, message: '请输入系列名称', trigger: 'blur' }],
  gameType: [{ required: true, message: '请选择彩种', trigger: 'change' }],
  seriesShortName: [{ required: true, message: '请输入系列简称', trigger: 'blur' }],
  sortNo: [{ required: true, message: '请输入序列', trigger: 'blur' }],
  seriesCode:
    mode.value === 'add'
      ? [
          { required: true, message: '请输入系列ID', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_]*$/, message: '系列ID不符合标准', trigger: 'blur' }
        ]
      : []
}))

async function initData() {
  mode.value = modalData.value?.id ? 'edit' : 'add'
  formModelBackup.value = null
  formModel.value = null
  maxSortNoValue.value = await maxSortNo()
  if (mode.value === 'add') {
    formModel.value = {
      seriesCode: '',
      gameType: '',
      seriesName: '',
      seriesShortName: '',
      blackWhiteCount: '',
      colorfulCount: '',
      createTime: '',
      sortNo: maxSortNoValue.value,
      seriesDesc: '',
      memo: '',
      isRecommended: 'n',
      isHot: 'n',
      isTop: 'n',
      isSelected: 'n',
      isBloom: 'n',
      manageSiteId: modalData.value?.manageSiteId
    }
    setTimeout(() => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }, 0)
    return
  }
  isLoading.value = true
  try {
    const res = await getGameTypeSeriesDetail({
      page: 1,
      size: 1,
      seriesCode: modalData.value?.id,
      manageSiteId: modalData.value?.manageSiteId
    })

    formModel.value = res.data
    formModel.value!.manageSiteId = modalData.value?.manageSiteId
    formModelBackup.value = cloneDeep(formModel.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    setTimeout(() => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }, 0)
  }
}

function beforeClose(isDataChanged = false) {
  if (isLoading.value) return
  modalStore.hideModal(ME)
  modalStore.setModalData('photoSeriesModal', { id: undefined })
  if (isDataChanged) {
    emit('alreadySubmit', mode.value === 'add')
  } else {
    emit('alreadyClosed')
  }
}

async function checkSortNo() {
  try {
    const res = await checkSortNoExist({
      sortNo: formModel.value?.sortNo,
      manageSiteId: modalData.value?.manageSiteId
    })
    if (res.success) {
      if (res.data) {
        ElMessage.error('序列已存在')
        return true
      } else {
        return false
      }
    }
  } catch (error) {
    return true
  } finally {
  }
}

function submitForm() {
  if (mode.value === 'edit' && JSON.stringify(formModel.value) === JSON.stringify(formModelBackup.value)) {
    ElMessage.warning('未修改任何数据')
    beforeClose()
    return
  }
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    if (mode.value === 'add' && (await checkSortNo())) return
    isLoading.value = true
    try {
      const res = await (mode.value === 'edit' ? editGameTypeSeries : createGameTypeSeries)(formModel.value)
      if (res.success) {
        ElMessage.success(mode.value === 'edit' ? '更新成功' : '添加成功')
        isLoading.value = false
        beforeClose(true)
      } else {
        ElMessage.error(res.errMessage)
      }
      isLoading.value = false
    } catch (error) {
      console.error(error)
    }
  })
}

const maxSortNo = async () => {
  try {
    const response = await getMaxSortNo({ manageSiteId: modalData.value?.manageSiteId })
    if (response.success) {
      return response.data + 1
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    gameOptions.value = (await fetchGameTypes(isLoading, modalData.value?.manageSiteId)) as GameOptionType[]
  } catch (error) {
    console.error(error)
    // TODO: 提示错误
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <el-dialog
    v-model="isVisible"
    draggable
    :before-close="beforeClose"
    @open="initData"
    append-to-body
    class="tabs-dialog"
  >
    <m-tab-pane label="图纸系列">
      <el-scrollbar v-loading="isLoading">
        <el-form v-if="formModel" ref="formRef" :model="formModel" :rules="rules" status-icon class="dialog-form">
          <el-row justify="center" :gutter="20">
            <el-col :span="10">
              <el-form-item label="系列ID:" prop="seriesCode">
                <linkWithCopy
                  v-if="mode === 'edit'"
                  :row-data="formModel"
                  :config="{ idKey: 'seriesCode', notShowLink: true }"
                ></linkWithCopy>
                <el-input v-else v-model="formModel.seriesCode" />
              </el-form-item>

              <el-form-item label="系列名称:" prop="seriesName">
                <el-input v-model="formModel.seriesName" />
              </el-form-item>
              <el-form-item maxlength="12" label="系列简称:" prop="seriesShortName">
                <el-input v-model="formModel.seriesShortName" placeholder="系列简称" />
              </el-form-item>
              <el-form-item label="彩种:" prop="gameType">
                <el-select v-model="formModel.gameType" placeholder="请选择彩种" :disabled="mode === 'edit'">
                  <el-option v-for="item in gameOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>

              <el-form-item label="序列:" prop="sortNo">
                <el-input v-model="formModel.sortNo" placeholder="序列" maxlength="8" />
              </el-form-item>

              <el-form-item label="系列描述:" prop="description">
                <el-input
                  type="textarea"
                  show-word-limit
                  maxlength="255"
                  placeholder="系列描述"
                  v-model="formModel.seriesDesc"
                  :rows="7"
                />
              </el-form-item>
              <el-form-item label="备注:" prop="memo">
                <el-input type="textarea" v-model="formModel.memo" show-word-limit maxlength="64" placeholder="备注" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="推荐:" prop="isRecommended">
                <el-radio-group v-model="formModel.isRecommended">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="热门:" prop="isHot">
                <el-radio-group v-model="formModel.isHot">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="置顶:" prop="isTop">
                <el-radio-group v-model="formModel.isTop">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="精选:" prop="isSelected">
                <el-radio-group v-model="formModel.isSelected">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="爆款:" prop="isPopular">
                <el-radio-group v-model="formModel.isBloom">
                  <el-radio value="y">是</el-radio>
                  <el-radio value="n">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="mode === 'edit'" label="黑白图纸:" prop="hasColorImage">
                {{
                  !isNaN(Number(formModel.blackWhiteCount)) && Number(formModel.blackWhiteCount) > 0
                    ? `${formModel.blackWhiteCount} 张`
                    : '无'
                }}
              </el-form-item>
              <el-form-item v-if="mode === 'edit'" label="彩色图纸:" prop="hasColorImage">
                {{
                  !isNaN(Number(formModel.colorfulCount)) && Number(formModel.colorfulCount) > 0
                    ? `${formModel.colorfulCount} 张`
                    : '无'
                }}
              </el-form-item>
              <el-form-item v-if="mode === 'edit'" label="创建时间:" prop="createTime">
                <span style="size: 14px">
                  {{ unitFormatDate(formModel.createTime, 'yyyy-MM-dd HH:mm:ss') }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <div class="button-row" v-if="isOperateShow">
        <el-button @click="beforeClose" :disabled="isLoading">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm">提交</el-button>
      </div>
    </m-tab-pane>
  </el-dialog>
</template>

<style scoped></style>
