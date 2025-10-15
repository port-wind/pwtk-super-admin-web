<template>
  <el-dialog v-model="addDialogVisible" draggable overflow destroy-on-close @close="closeDialog" class="tabs-dialog">
    <mTabPane label="彩种新增">
      <el-form
        :model="lineFormData"
        :rules="rulesForm"
        ref="formRef"
        class="dialog-form"
        style="width: 600px; margin: auto"
      >
        <el-form-item label="彩种ID:" prop="gameType">
          {{ lineFormData.gameType }}
        </el-form-item>
        <el-form-item label="彩种名称:" prop="gameTypeName">
          <el-input v-model="lineFormData.gameTypeName" :maxlength="128" />
        </el-form-item>
        <el-form-item label="彩种简称:" prop="gameTypeShortName">
          <el-input v-model="lineFormData.gameTypeShortName" :maxlength="128" />
        </el-form-item>
        <el-form-item label="彩种全称:" prop="gameTypeLongName">
          <el-input v-model="lineFormData.gameTypeLongName" :maxlength="128" />
        </el-form-item>
        <el-form-item label="所属地区:" prop="areaCode">
          <el-input v-model="lineFormData.areaCode" :maxlength="128" />
        </el-form-item>
        <el-form-item label="游戏类型代码:" prop="gameTypeCode">
          <el-input v-model="lineFormData.gameTypeCode" :maxlength="128" />
        </el-form-item>
        <el-form-item label="排序编号:" prop="sortNum" style="width: 60%">
          <el-input
            v-model.number="lineFormData.sortNum"
            min="0"
            max="99999999"
            :precision="0"
            type="number"
            :maxlength="128"
            @input="(val) => (lineFormData.sortNum = Math.floor(Math.abs(Number(val)) || 0))"
          />
        </el-form-item>
        <!-- <el-form-item label="分类:" prop="classifier">
          <el-input v-model="lineFormData.classifier" :maxlength="128" />
        </el-form-item> -->
        <el-form-item label="自动确认:" prop="isAutoConfirm">
          <el-radio-group v-model="lineFormData.isAutoConfirm">
            <el-radio value="y">是</el-radio>
            <el-radio value="n">否</el-radio>
            <el-radio value="s">单边</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-radio-group v-model="lineFormData.status">
            <el-radio value="y">启用</el-radio>
            <el-radio value="n">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间:" prop="createTime">
          {{ unitFormatDate(lineFormData.createTime || '', 'yyyy-MM-dd HH:mm:ss') }}
        </el-form-item>
      </el-form>
      <div class="button-row">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit">提交</el-button>
      </div>
    </mTabPane>
  </el-dialog>
</template>

<script setup lang="ts">
import { gameTypePlatformListAll, gameTypePlatformUpdate } from '@/api/system/gameTypeManagement'
import { unitFormatDate } from '@/utils/dateFormat'
import showErrorMessage from '@/utils/showErrorMessage'
import {
  createAlphanumericValidator,
  createChineseAlphanumericValidator,
  createDuplicateValidator,
  createNumberValidator
} from '@/utils/validators'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  editFormData: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:visible', 'refreshPage'])
const initForm = () => {
  return {
    gameType: '',
    gameTypeName: '',
    gameTypeShortName: '',
    gameTypeLongName: '',
    areaCode: '',
    gameTypeCode: '',
    // classifier: '',
    status: 'y',
    sortNum: 1,
    isAutoConfirm: 'y',
    createTime: ''
  }
}
const lineFormData = reactive(initForm())
const allDataExisted = reactive([])
const formRef = ref()
const addDialogVisible = computed(() => props.visible)
const isLoading = ref(false)
const closeDialog = () => {
  emit('update:visible', false)
}
const rulesForm = {
  // gameType: [
  //   { required: true, message: '请输入彩种ID', trigger: 'blur' },
  //   { validator: createNumberValidator(), trigger: 'blur' },
  //   { validator: createDuplicateValidator(allDataExisted, 'gameType'), trigger: 'blur' }
  // ],
  gameTypeName: [
    { required: true, message: '请输入彩种名称', trigger: 'blur' },
    { validator: createChineseAlphanumericValidator(), trigger: 'blur' }
  ],
  gameTypeShortName: [
    { required: true, message: '请输入彩种简称', trigger: 'blur' },
    { validator: createChineseAlphanumericValidator(), trigger: 'blur' }
  ],
  gameTypeLongName: [
    { required: true, message: '请输入彩种全称', trigger: 'blur' },
    { validator: createChineseAlphanumericValidator(), trigger: 'blur' }
  ],
  areaCode: [
    { required: true, message: '请输入所属地区', trigger: 'blur' },
    { validator: createAlphanumericValidator(), trigger: 'blur' }
  ],
  gameTypeCode: [
    { required: true, message: '请输入游戏类型代码', trigger: 'blur' },
    { validator: createAlphanumericValidator(), trigger: 'blur' }
  ],
  // classifier: [
  //   { required: true, message: '请输入分类', trigger: 'blur' },
  //   { validator: createAlphanumericValidator(), trigger: 'blur' }
  // ],
  sortNum: [
    { required: true, message: '请输入排序编号', trigger: 'blur' },
    { validator: createNumberValidator(), trigger: 'blur' },
    { validator: createDuplicateValidator(allDataExisted, 'sortNum'), trigger: 'blur' }
  ]
}
const handleSubmit = async () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const params = lineFormData
      try {
        const response = (await gameTypePlatformUpdate(params)) as any
        if (response.success) {
          ElMessage.success('修改成功')
          emit('refreshPage')
          closeDialog()
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
onMounted(async () => {
  console.log(props.editFormData)
  const currentSortNum = props.editFormData.sortNum
  try {
    isLoading.value = true
    const res = (await gameTypePlatformListAll({})) as any
    console.log(res)
    if (res.success) {
      Object.assign(
        allDataExisted,
        res.data.filter((item: any) => item.sortNum !== currentSortNum)
      )
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
  Object.assign(lineFormData, props.editFormData)
})
</script>

<style scoped lang="less"></style>
