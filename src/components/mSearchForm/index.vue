<template>
  <section ref="formSectionRef">
    <el-form :inline="true" :model="editFormData" class="search_left" :rules="formRules" ref="formRef" v-bind="$attrs">
      <!-- 遍历表单项配置生成表单项 -->
      <template v-for="(item, index) in formOptions" :key="index">
        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules" :style="{ width: item.width }">
          <template #default="scope">
            <template v-if="item.slot">
              <slot :name="item.slot" :scope="scope" :form="editFormData"></slot>
            </template>

            <!-- <template v-else-if="item.type === 'autoComplete'">
            <AutoComplete
              v-model="item.prop"
              :max-length="item.autocompleteData?.maxLength"
              :keyword="item.autocompleteData?.keyword"
              :is-empty="item.autocompleteData?.isEmpty"
              :httpFunc="item.autocompleteData?.httpFunc"
              :trigger-on-focus="item.autocompleteData?.triggerOnFocus"
              :placeholder="item.autocompleteData?.placeholder"
            ></AutoComplete>
          </template> -->
            <!-- <template v-else-if="item.type === 'timeLine'">
            <TimeSelect
              :name="item.timeLineData?.name || '时间选择'"
              :start-placeholder="item.timeLineData?.startPlaceholder || '上传开始时间'"
              :end-placeholder="item.timeLineData?.endPlaceholder || '上传结束时间'"
              v-model:startDate="item.timeLineData?.startName || 'startDate'"
              v-model:endDate="item.timeLineData?.endName || 'endDate'"
            ></TimeSelect>
          </template> -->
            <template v-else>
              <component
                :is="getComponentType(item.type)"
                v-model="editFormData[item.prop]"
                v-bind="getComponentProps(item)"
              >
                <template v-if="item.type === 'select'">
                  <el-option
                    v-for="(label, value) in _Options[item.selectData?.selectName!]"
                    :key="value"
                    :label="label"
                    :value="value"
                  ></el-option>
                </template>
              </component>
            </template>
          </template>
        </el-form-item>
      </template>
      <ExpandableSection v-if="isexpandable" v-model="isExpanded" :resizeRef="formSectionRef"></ExpandableSection>

      <el-form-item style="margin-left: auto">
        <el-button type="primary" v-if="buttonOptions.isSearch" @click="handleQuery" :loading="isLoading">
          <el-icon style="margin: 0 5px 0 0">
            <Search />
          </el-icon>
          查询
        </el-button>
        <el-button v-if="buttonOptions.isReset" type="primary" @click="handleReset" plain>
          <el-icon style="margin: 0 5px 0 0">
            <Refresh />
          </el-icon>
          重置
        </el-button>
        <el-button v-if="buttonOptions.isAdd" type="success" @click="handleAddButton">
          <el-icon style="margin: 0 5px 0 0">
            <Plus />
          </el-icon>
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits } from 'vue'
import _Options from '@/const/options.json'
import { ElForm } from 'element-plus'
import type { SearchOption, SearchBtnOptions } from './types'
import ExpandableSection from '@/components/expandIcon/index.vue'

const props = defineProps({
  formOptions: {
    type: Array as () => SearchOption[],
    required: true
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  buttonOptions: {
    type: Object as () => SearchBtnOptions,
    required: true
  },
  isLoading: {
    type: Boolean,
    required: true
  },
  isexpandable: {
    type: Boolean
  }
})

const emit = defineEmits(['query', 'addNew', 'reset'])

const editFormData = ref<Record<string, any>>({})
const formRules = ref({ ...props.rules })
const formRef = ref<InstanceType<typeof ElForm>>()
const formSectionRef = ref()
const isExpanded = ref(false)

const handleQuery = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      emit('query', editFormData.value)
    } else {
      console.log('表单验证失败')
    }
  })
}

const handleAddButton = () => {
  emit('addNew')
}

const handleReset = () => {
  editFormData.value = {}
  formRef.value?.resetFields()
  emit('query')
  emit('reset')
}

const getComponentType = (type: string) => {
  switch (type) {
    case 'input':
      return 'el-input'
    case 'date':
      return 'el-date-picker'
    case 'select':
      return 'el-select'
    case 'dateRange':
      return 'el-date-picker'
    default:
      return ''
  }
}

const getComponentProps = (item: SearchOption) => {
  switch (item.type) {
    case 'input':
      return {
        autocomplete: 'off',
        maxlength: item.inputData?.maxLength,
        placeholder: item.inputData?.placeholder || '请输入内容'
      }
    case 'date':
      return {
        type: 'date',
        placeholder: item.dateData?.placeholder || '请选择日期'
      }
    case 'select':
      return {
        placeholder: item.selectData?.placeholder || '请选择',
        clearable: item.selectData?.clearable || false
      }
    case 'dateRange':
      return {
        type: 'dateRange',
        'start-placeholder': '开始日期',
        'end-placeholder': '结束日期',
        placeholder: item.dateData?.placeholder || '请选择日期范围'
      }

    default:
      return {}
  }
}

// 获取表单数据
let getFormData = () => {
  return editFormData.value
}

// 分发方法
defineExpose({
  getFormData
})
</script>

<style scoped></style>
