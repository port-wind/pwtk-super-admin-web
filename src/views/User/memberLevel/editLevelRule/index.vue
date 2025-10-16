<template>
  <el-dialog class="tabs-dialog" v-model="isVisible" v-bind="$attrs" @close="close">
    <el-tabs v-model="activeTab" class="m_tabs">
      <el-tab-pane label="修改规则" name="basic" class="m_tabs_pane" v-loading="isLoading">
        <el-form :model="lineFormData" :rules="rules" ref="editFormRef" class="dialog-form">
          <el-row justify="center">
            <el-col :span="20">
              <div class="level-rule-header">
                <span style="font-weight: 900">等级名称</span>
                <span style="font-weight: 900">升级条件</span>
              </div>
            </el-col>
          </el-row>
          <el-row justify="center" v-for="(item, index) in arrayData">
            <el-col :span="10" class="level-rule-item">
              <span>{{ item.level }}</span>
            </el-col>
            <el-col :span="10" class="level-rule-item">
              <span>积分达到</span>
              <el-form-item :prop="`level${index + 1}`">
                <el-input-number
                  v-model="lineFormData[`level${index + 1}`]"
                  :min="1"
                  :max="10000000000"
                  :precision="0"
                  controls-position="right"
                />
              </el-form-item>

              <!-- <el-input v-model="lineFormData[`level${index + 1}`]" /> -->
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row">
          <el-button @click="cancle">取消</el-button>
          <el-button type="primary" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'
import { reqMemberLevel, uploadMemberLevel } from '@/api/user/memberLevel'
import { IReqMevvberLevel, IUploadMemberLevelQueryParams } from '@/api/user/memberLevel/types'

const modalsStore = useModalsStore()
const isLoading = ref(false)
const editFormRef = ref()
const arrayData = ref<IReqMevvberLevel[]>([])
const maxLevel = computed(() => arrayData?.value?.length)
const isVisible = computed(() => modalsStore.editLevelRuleModal.isVisible)
const activeTab = computed(() => modalsStore.editLevelRuleModal.activeTab)
const initMemberLevelEditForm = () => {
  return Array.from({ length: maxLevel.value }, (_, index) => index + 1).reduce((acc, level) => {
    acc[`level${level}`] = 0
    return acc
  }, {})
}

const lineFormData = reactive<any>(initMemberLevelEditForm())
const emit = defineEmits(['callBack', 'refreshPage'])
const validateLevel = (level: number) => {
  return (rule: any, value: any, callback: Function) => {
    const currentValue = Number(value)
    const prevLevel = level > 1 ? Number(lineFormData[`level${level - 1}`]) : 0

    if (isNaN(currentValue)) {
      callback(new Error('请输入有效的数字'))
    } else if (level > 0 && currentValue <= prevLevel) {
      callback(new Error(`升级条件必须大于 VIP ${level - 1}`))
    } else {
      callback()
    }
  }
}
const rules = computed(() => {
  return Array.from({ length: maxLevel.value }, (_, index) => ({
    [`level${index + 1}`]: [
      { required: true, message: `请输入VIP ${index + 1}的升级条件`, trigger: 'blur' },
      { validator: validateLevel(index + 1), trigger: ['blur', 'change'] }
    ]
  })).reduce((acc, rule) => ({ ...acc, ...rule }), {})
})

const close = () => {
  modalsStore.hideModal('editLevelRuleModal')
}

const cancle = () => {
  modalsStore.hideModal('editLevelRuleModal')
  modalsStore.resetModal('editLevelRuleModal')
  modalsStore.editLevelRuleModal.activeTab = 'basic'
}
const handleSave = async () => {
  try {
    await editFormRef.value.validate()

    if (!lineFormData || typeof lineFormData !== 'object') {
      throw new Error('Form data is invalid')
    }

    const dataToSend: IUploadMemberLevelQueryParams[] = Object.entries(lineFormData)
      .map(([k, v]) => ({
        vipLevel: parseInt(k.replace('level', ''), 10),
        score: parseInt((v as number).toString(), 10)
      }))
      .filter((item) => !isNaN(item.vipLevel) && !isNaN(item.score))
    if (dataToSend.length === 0) {
      throw new Error('No valid data to send')
    }
    const response = await uploadMemberLevel(dataToSend)
    if (response.success) {
      ElMessage.success('更新成功')
      close()
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const initializeFormData = async () => {
  // lineFormData.value = modalData.value\
  isLoading.value = true
  try {
    const response = await reqMemberLevel()
    if (response.success) {
      const levelData = response.data
      arrayData.value = levelData?.map((item, index) => ({
        level: `VIP ${index + 1}`,
        score: item.score
      }))
      const data = levelData.reduce((acc, item) => {
        if (item.vipLevel <= maxLevel.value) {
          acc[`level${item.vipLevel}`] = parseInt(item.score) ?? 0
        } else {
          console.error('Error fetching data item.vipLevel:', item.vipLevel)
        }
        return acc
      }, initMemberLevelEditForm())
      Object.assign(lineFormData, data)
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(async () => {
  await initializeFormData()
  console.log(rules.value)
})
</script>

<style lang="scss" scoped>
.level-rule-header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 16px;

  color: #333;
  background-color: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  height: 60px;
}
.level-rule-header ::before {
  font-weight: 900 !important;
}
.level-rule-header ::after {
  font-weight: 900 !important;
}
.level-rule-item {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  :deep(.el-form-item) {
    margin: 18px;
  }
}
</style>
