<template>
  <el-dialog v-model="isVisible" class="tabs-dialog" v-bind="$attrs" @close="close" draggable overflow destroy-on-close>
    <el-tabs v-model="activeTab" class="m_tabs" @tab-click="handleTabClick">
      <el-tab-pane label="积分基础配置" name="basic" class="m_tabs_pane" v-loading="isLoading">
        <el-form :model="lineFormData" ref="editFormRef" :rules="rules" class="dialog-form">
          <el-row :span="20" justify="center">
            <el-col :span="14">
              <el-form-item prop="PointUnit" label="积分单位:">
                <el-select v-model="lineFormData.PointUnit" style="width: 160px" @change="handlePointUnitChange">
                  <el-option v-for="unit in pointUnits" :key="unit" :label="unit.toString()" :value="unit.toString()" />
                </el-select>
              </el-form-item>
              <el-form-item label="积分规则配置:">
                <div v-for="(item, index) in pointConfig" :key="item.ruleId" class="config-rule-item">
                  <!-- <el-col :span="6" style="width: 100px;"><div>积分规则配置</div></el-col> -->
                  <el-col :span="8">
                    <el-form-item>
                      <el-select v-model="item.bizDesc" disabled>
                        <el-option
                          v-for="item in pointConfig"
                          :key="item.ruleId"
                          :label="item.bizDesc"
                          :value="item.bizName"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item>
                      <el-select v-model="lineFormData[item.bizName + 'Type']" disabled>
                        <el-option label="积分增加" :value="1" />
                        <el-option label="积分减少" :value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :prop="item.bizName">
                      <el-input-number
                        v-model="lineFormData[item.bizName]"
                        :min="Number(lineFormData.PointUnit)"
                        :max="Number(lineFormData.PointLimit)"
                        :step="Number(lineFormData.PointUnit)"
                        @change="(value) => handleNumberChange(item.bizName, value)"
                        :precision="0"
                        step-strictly
                        controls-position="right"
                        :rules="{
                          required: true,
                          message: 'domain can not be null',
                          trigger: 'blur'
                        }"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="积分期限:">
                <el-radio-group v-model="lineFormData.PointLimitType">
                  <el-radio label="永久有效" value="1" />
                </el-radio-group>
              </el-form-item>

              <el-form-item label="每日积分获取上限:">
                <el-input-number
                  v-model="lineFormData.PointLimit"
                  :precision="0"
                  :min="Number(lineFormData.PointUnit) * 10"
                  :step="Number(lineFormData.PointUnit)"
                  @change="(value) => handleNumberChange('PointLimit', value, 10)"
                  step-strictly
                  controls-position="right"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="button-row">
          <el-button @click="cancle">取消</el-button>
          <el-button type="primary" @click="handleSave">提交</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="星星规则配置" name="starconfig" class="m_tabs_pane" v-loading="isLoading">
        <el-form :model="starFormData" :rules="starRules" class="dialog-form" ref="starFormRef">
          <el-row :span="20" justify="center">
            <el-col :span="14">
              <el-form-item prop="StarUnit" label="星星单位:">
                <el-select v-model="lineFormData.PointUnit" style="width: 160px" disabled>
                  <el-option v-for="unit in pointUnits" :key="unit" :label="unit.toString()" :value="unit.toString()" />
                </el-select>
              </el-form-item>
              <el-form-item label="星星规则配置:">
                <div v-for="(item, index) in starConfig" :key="item.ruleId" class="config-rule-item">
                  <!-- <el-col :span="6" style="width: 100px;"><div>积分规则配置</div></el-col> -->
                  <el-col :span="8">
                    <el-form-item :prop="item.bizDesc">
                      <el-select v-model="item.bizDesc" disabled>
                        <el-option
                          v-for="item in starConfig"
                          :key="item.ruleId"
                          :label="item.bizDesc"
                          :value="item.bizName"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :prop="starFormData[item.bizName + 'Type']">
                      <el-select v-model="starFormData[item.bizName + 'Type']" disabled>
                        <el-option label="星星增加" :value="1" />
                        <el-option label="星星减少" :value="2" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :prop="item.bizName">
                      <el-input-number
                        v-model="starFormData[item.bizName]"
                        :min="Number(starFormData.StarUnit)"
                        :max="Number(starFormData.StarLimit)"
                        :step="Number(starFormData.StarUnit)"
                        @change="(value) => handleNumberChange(item.bizName, value)"
                        :precision="0"
                        step-strictly
                        controls-position="right"
                      />
                    </el-form-item>
                  </el-col>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="星星期限:">
                <el-radio-group v-model="starFormData.StarLimitType">
                  <el-radio label="永久有效" value="1" />
                </el-radio-group>
              </el-form-item>

              <el-form-item label="星星获取上限:">
                <el-input-number
                  v-model="starFormData.StarLimit"
                  :precision="0"
                  :min="Number(lineFormData.PointUnit) * 10"
                  :step="Number(lineFormData.PointUnit)"
                  @change="(value) => handleNumberChange('PointLimit', value, 10)"
                  step-strictly
                  controls-position="right"
                />
              </el-form-item>
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
import { reqPointRulesList, reqStarRulesList, reqUpdatePointRules, reqUpdateStarRules } from '@/api/user/pointRules'

const modalsStore = useModalsStore()
const pointUnits = ref([10, 100, 1000])
const isLoading = ref(false)
const editFormRef = ref()
const starFormRef = ref()
const arrayData = ref<any[]>([])
const maxLevel = computed(() => arrayData.value.length)
const isVisible = computed(() => modalsStore.editBaseConfigModal.isVisible)
const activeTab = computed(() => modalsStore.editBaseConfigModal.activeTab)
const localActiveTab = ref('basic')
const pointConfig = ref<any[]>([])
const starConfig = ref<any[]>([])
const initPointConfigEditForm = () => {
  return {
    PointUnit: '10',
    PointLimitType: '1',
    PointLimit: 100
  }
}
const initStarConfigEditForm = () => {
  return {
    StarUnit: '10',
    StarLimitType: '1',
    StarLimit: 100
  }
}
const starFormData = reactive<any>(initStarConfigEditForm())

const lineFormData = reactive<any>(initPointConfigEditForm())
const emit = defineEmits(['callBack', 'refreshPage'])
const rules = ref<any>({})
const starRules = ref<any>({})
const close = () => {
  modalsStore.hideModal('editBaseConfigModal')
}
const cancle = () => {
  modalsStore.hideModal('editBaseConfigModal')
  modalsStore.resetModal('editBaseConfigModal')
  modalsStore.editBaseConfigModal.activeTab = 'basic'
}
const handlePointUnitChange = async (value) => {
  try {
    await editFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        console.log(fields)
      } else {
        console.log(fields)
      }
    })
  } catch (error) {
    console.error('Error validating form:', error)
  }
}
const handleSave = async () => {
  console.log(activeTab.value)
  const func = localActiveTab.value === 'basic' ? reqUpdatePointRules : reqUpdateStarRules
  const config = localActiveTab.value === 'basic' ? pointConfig : starConfig
  const formData = localActiveTab.value === 'basic' ? lineFormData : starFormData
  const ref = localActiveTab.value === 'basic' ? editFormRef : starFormRef
  const res = await ref.value.validate()
  try {
    console.log(res)
    if (!res) {
      return
    }
    if (!formData || typeof formData !== 'object') {
      throw new Error('Form data is invalid')
    }
    const updatedRules = config.value.map((item) => ({
      ruleId: item.ruleId,
      value: formData[item.bizName]
    }))
    const response = await func({
      items: updatedRules,
      scoreUnit: lineFormData.PointUnit,
      scoreLimit: localActiveTab.value === 'basic' ? lineFormData.PointLimit : starFormData.StarLimit
    })
    if (response.success) {
      ElMessage.success('更新成功')
      close()
      emit('refreshPage')
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const handleTabClick = (tab) => {
  console.log(tab)
  localActiveTab.value = tab.name
}
const handleNumberChange = (bizName, value, times = 1) => {
  console.log(bizName, value)
  if (value < Number(lineFormData.PointUnit) * times) {
    lineFormData[bizName] = Number(lineFormData.PointUnit) * times
  }
}
const initializeFormData = async () => {
  // lineFormData.value = modalData.value\
  isLoading.value = true
  try {
    const response = await reqPointRulesList()
    if (response.success) {
      const newRules = {}
      lineFormData.PointLimit = Number(response.data.scoreLimit) || 100
      lineFormData.PointUnit = Number(response.data.scoreUnit) || 10
      pointUnits.value = [...new Set([10, 100, 1000, Number(response.data.scoreUnit) || 10])]
        .filter((item) => item <= lineFormData.PointLimit)
        .sort((a, b) => a - b)
      pointConfig.value = response.data.list
      pointConfig.value.forEach((config) => {
        lineFormData[config.bizName] = Number(config.value) || lineFormData.PointUnit || 0
        lineFormData[config.bizName + 'Type'] = config.type
        newRules[config.bizName] = [
          { required: true, message: `请输入积分值`, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < Number(lineFormData.PointUnit)) {
                callback(new Error('不能小于积分单位'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      })
      rules.value = newRules
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
const initializeStarFormData = async () => {
  isLoading.value = true
  try {
    const response = await reqStarRulesList()
    if (response.success) {
      const newRules = {}
      starFormData.StarLimit = Number(response.data.scoreLimit) || 100
      starConfig.value = response.data.list
      starConfig.value.forEach((config) => {
        starFormData[config.bizName] =
          Math.floor(Number(config.value) / Number(starFormData.StarUnit)) * Number(starFormData.StarUnit) || 0
        starFormData[config.bizName + 'Type'] = config.type
        newRules[config.bizName] = [
          { required: true, message: `请输入星星值`, trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value < Number(lineFormData.PointUnit)) {
                callback(new Error('不能小于星星单位'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      })
      starRules.value = newRules
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
  await initializeStarFormData()
  console.log(rules.value)
})
</script>

<style lang="scss" scoped>
.config-rule-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  :deep(.el-form-item) {
    margin-bottom: 18px;
    margin-right: 18px;
  }
}
</style>
