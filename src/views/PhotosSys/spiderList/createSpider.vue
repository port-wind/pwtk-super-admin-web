<template>
  <div class="spider-form" v-loading="isLoading">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="formRules" style="flex: 1; overflow-y: auto">
      <el-row>
        <el-col :span="24">
          <!-- Video Author -->
          <el-row justify="center">
            <el-col :span="14">
              <!-- Video Title -->
              <el-form-item label="目标URL:" prop="baseUrl">
                <el-input v-model="form.baseUrl" :maxlength="200" placeholder="请输入目标URL" />
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <!-- Video Description -->
              <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio value="y">启用</el-radio>
                  <el-radio value="n">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="14" v-if="isEdit">
              <el-form-item label="创建时间:" prop="createTime">
                {{ unitFormatDate(form.createTime, 'yyyy-MM-dd HH:mm:ss') }}
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="备注:" prop="remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  rows="3"
                  show-word-limit
                  :maxlength="200"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <section class="button-row">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="isSubmitting" @click="handleSubmit">提交</el-button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { createSpider, getSpiderInfo, updateSpider } from '@/api/photoSys/spider'
import { unitFormatDate } from '@/utils/dateFormat'

const props = defineProps<{
  id: string
}>()

const isEdit = computed(() => props.id)

const emit = defineEmits(['close', 'refresh'])
const formRef = ref<FormInstance>()
const isLoading = ref(false)
const isSubmitting = ref(false)
const form = reactive<any>({
  baseUrl: '',
  status: 'y',
  remark: ''
})

const formRules = reactive({
  userId: [{ required: true, message: '请选择创建人', trigger: 'change' }],
  title: [{ required: true, message: '请输入视频标题', trigger: 'change' }],
  tags: [{ required: true, message: '请选择视频标签', trigger: 'change' }]
})

// Close modal
const handleCancel = () => {
  emit('close')
}
// Submit form with upload
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    isSubmitting.value = true

    try {
      // Create video with uploaded URL
      const queryParams = {
        ...form
      }

      console.log('Creating video with data:', queryParams)
      const result = isEdit.value ? await updateSpider(queryParams) : await createSpider(queryParams)

      if (result.success) {
        ElMessage.success(isEdit.value ? '修改成功' : '创建成功')
        handleCancel()
        emit('refresh')
      } else {
        ElMessage.error(result.message || (isEdit.value ? '修改失败' : '创建失败'))
      }
    } catch (error: any) {
      console.error('Submit error:', error)
      ElMessage.error(error.message || '提交失败')
    } finally {
      isSubmitting.value = false
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查必填项')
    isSubmitting.value = false
  }
}

// Initialize component
onMounted(async () => {
  if (props.id) {
    const result = await getSpiderInfo({ id: props.id })
    if (result.success) {
      Object.assign(form, result.data)
    } else {
      ElMessage.error(result.message || '获取爬取信息失败')
    }
  }
})
</script>

<style scoped lang="less">
.spider-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.button-row {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  padding: 10px 0;
}
</style>
