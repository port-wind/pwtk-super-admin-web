<template>
  <el-dialog
    class="mDialog"
    :visible.sync="visible"
    v-model="isVisible"
    :title="title"
    @close="handleCancel"
    v-bind="$attrs"
  >
    <el-form :model="editFormData" :rules="formRules" ref="formRef">
      <!-- 遍历表单项配置生成表单项 -->
      <template v-for="(item, index) in formOptions" :key="index">
        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules" v-if="modeDifferent(item)">
          <template #default="scope">
            <template v-if="item.slot">
              <slot :name="item.slot" :scope="scope" :form="editFormData"></slot>
            </template>
            <template v-else>
              <template v-if="item.type === 'input'">
                <el-input
                  v-model="editFormData[item.prop]"
                  :disabled="item.disabled"
                  autocomplete="off"
                  :maxlength="item.inputData?.maxLength"
                  :placeholder="item.inputData?.placeholder"
                />
              </template>
              <template v-if="item.type === 'text'">
                <span>{{ editFormData[item.prop] }}</span>
                <copy :content="editFormData[item.prop]" />
              </template>
              <template v-if="item.type === 'unModify'">
                <template v-if="props.mode === 'add'">
                  <el-input
                    v-model="editFormData[item.prop]"
                    :disabled="item.disabled"
                    :maxlength="item.inputData?.maxLength"
                    :placeholder="item.inputData?.placeholder"
                    autocomplete="off"
                  />
                </template>
                <template v-else>
                  <span>{{ editFormData[item.prop] }}</span>
                  <copy :content="editFormData[item.prop]" />
                </template>
              </template>
              <template v-if="item.type === 'date'">
                <el-date-picker
                  v-model="editFormData[item.prop]"
                  type="date"
                  :placeholder="item.dateData?.placeholder || '请选择日期'"
                ></el-date-picker>
              </template>
              <template v-if="item.type === 'textarea'">
                <el-input
                  type="textarea"
                  :placeholder="item.textareaData?.placeholder || '请输入内容'"
                  show-word-limit
                  :maxlength="item.textareaData?.maxLength || 255"
                  :rows="2"
                  v-model="editFormData[item.prop]"
                  autocomplete="off"
                />
              </template>
              <template v-if="item.type === 'radio'">
                <el-radio-group v-model="editFormData[item.prop]">
                  <el-radio
                    v-for="(label, value)  in  _Options[item.radioData?.radioName!]"
                    :key="value"
                    :label="label"
                    :value="value"
                  ></el-radio>
                </el-radio-group>
              </template>
              <template v-if="item.type === 'select'">
                <el-select v-model="editFormData[item.prop]" placeholder="请选择">
                  <el-option
                    v-for="(label, value)  in  _Options[item.selectData?.selectName!]"
                    :key="value"
                    :label="label"
                    :value="value"
                  ></el-option>
                </el-select>
              </template>
            </template>
          </template>
        </el-form-item>
      </template>
    </el-form>

    <template #footer>
      <div class="dialog-footer dialog-footer-submit">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits } from 'vue'
import _Options from '@/const/options.json'
import { ElForm } from 'element-plus'
import type { FormOptions } from './types'

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '表单'
  },
  formData: {
    type: Object,
    required: true
  },
  formOptions: {
    type: Array as () => FormOptions[],
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    required: true,
    validator: (value: string) => ['add', 'edit'].includes(value)
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const isVisible = ref(props.visible)
const editFormData = ref<any>({})

//区分模式 如果模式一致则显示
const modeDifferent = (item) => {
  if (item.mode) {
    return item.mode === props.mode
  }
  return true
}

const initializeFormData = () => {
  if (props.mode === 'add') {
    // 初始化模式
    editFormData.value = {}
    props.formOptions.forEach((option) => {
      if (option.prop) {
        const propType = typeof props.formData[option.prop]
        if (propType === 'string') {
          editFormData.value[option.prop] = ''
        } else if (propType === 'number') {
          editFormData.value[option.prop] = 0
        } else if (Array.isArray(props.formData[option.prop])) {
          editFormData.value[option.prop] = []
        } else if (propType === 'object' && props.formData[option.prop] !== null) {
          editFormData.value[option.prop] = {}
        } else {
          editFormData.value[option.prop] = null
        }

        // 如果是 radio 类型，设置初始值
        if (
          option.type === 'radio' &&
          !editFormData.value[option.prop] &&
          option.radioData &&
          option.radioData.radioName
        ) {
          const firstKey = Object.keys(_Options[option.radioData.radioName])[0]
          editFormData.value[option.prop] = firstKey
        }

        // 如果是 select 类型，设置初始值
        if (
          option.type === 'select' &&
          !editFormData.value[option.prop] &&
          option.selectData &&
          option.selectData.selectName
        ) {
          const firstKey = Object.keys(_Options[option.selectData.selectName])[0]
          editFormData.value[option.prop] = firstKey
        }
      }
    })
  } else {
    // 编辑模式
    editFormData.value = { ...props.formData }
  }
}

const formRules = ref({ ...props.rules })

const formRef = ref<InstanceType<typeof ElForm>>()

const handleCancel = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('submit', editFormData.value)
      emit('update:visible', false)
    } else {
      console.log('表单验证失败')
    }
  })
}

watch(
  () => props.formData,
  (newVal) => {
    if (props.mode === 'edit') {
      editFormData.value = { ...newVal }
    }
  },
  { deep: true }
)

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      initializeFormData()
    }
  },
  { immediate: true }
)
</script>
