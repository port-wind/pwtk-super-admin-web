<template>
  <div class="custommodulestyle">
    <el-form ref="ruleFormRef" :model="form" :rules="rules" label-position="top" class="demo-form-inline">
      <!-- 组件ID -->
      <el-form-item class="componentId" prop="componentId">
        <el-input v-model="form.componentId" />
      </el-form-item>
      <!-- 组件名称 -->
      <el-form-item v-if="pageModel === 'componentMode'" label="组件名称" prop="name">
        <el-input v-model="form.componentName" />
      </el-form-item>
      <!-- JSON数据 -->
      <el-form-item label="JSON数据" prop="jsonData">
        <el-input v-model="form.configParamJson" :rows="25" type="textarea" placeholder="请输入 JSON 格式数据" />
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit(ruleFormRef)">提交</el-button>
        <el-button type="default" @click="formatJson" @mousedown.prevent>格式化</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ComponentStyle } from '@/views/WebVision/type'
import _ from 'lodash-es'

const ruleFormRef = ref<FormInstance>()
// 接收 props
const props = defineProps({
  datas: { type: Object as PropType<ComponentStyle>, required: true },
  pageModel: { type: String }
})
onMounted(() => {
  // console.log('rightslider-custommodulestyle', props.datas)
})
// 定义表单数据
const form = ref({ ...props.datas })

watch(
  () => props.datas,
  (newVal) => {
    form.value = newVal
  },
  { deep: true }
)
interface RuleForm {
  componentName: string
  configParamJson: string
}
const rules = reactive<FormRules<RuleForm>>({
  configParamJson: [
    { required: true, message: '请输入json数据', trigger: 'blur' },
    { min: 3, max: 5000, message: '不能小于3个字符，不能大于5000个字符', trigger: 'blur' }
  ]
})
const emit = defineEmits(['submitJson'])
// 提交方法
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('fields', form.value)
      // console.log('fields', fields)
      // console.log('submit!')
      emit('submitJson', form.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}

// const jsonInput = ref('') // 输入的 JSON 字符串
// const jsonOutput = ref('') // 格式化后的 JSON 输出

// 格式化 JSON 输入
const formatJson = () => {
  if (!form.value.configParamJson) return
  const result = _.attempt(JSON.parse, form.value.configParamJson)

  if (_.isError(result)) {
    ElMessage.error('JSON 格式无效，保持原样')
    // 如果解析失败，保持原样
    return
  }

  // 解析成功，格式化 JSON
  form.value.configParamJson = JSON.stringify(result, null, 2)
  ElMessage.success('JSON 格式化成功')
}

// 提交 JSON 数据
// const handleSubmit = () => {
//   try {
//     jsonOutput.value = JSON.parse(jsonInput.value)
//     ElMessage.success('JSON 数据已成功提交')
//   } catch (error) {
//     ElMessage.error('提交失败，输入的内容不是有效的 JSON 格式')
//   }
// }
</script>

<style scoped lang="less">
.custommodulestyle {
  width: 100%;
  left: 0;
  top: 0;
  padding: 0;
  box-sizing: border-box;
  .componentId {
    display: none;
  }
  /* 标题 */
  h2 {
    padding: 24px 16px 24px 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #f2f4f6;
    font-size: 18px;
    font-weight: 600;
    color: #323233;
  }
}
</style>
