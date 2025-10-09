<script lang="ts" setup>
import { ref, reactive, withDefaults } from 'vue'
import { addDialogOptions } from './data'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false
})

const emit = defineEmits<Emits>()

// 表单引用
const addForm = ref()

// 对话框可见性
const addDialogVisible = ref(false)

// 行属性
const rowAttrs = {
  gutter: 20
}

// 初始表单数据
const initAddForm = reactive({
  postUserId: '',
  forumId: '',
  postGametypeRef: '',
  postYear: '',
  postIssue: ''
  // ... 其他表单字段
})

// 表单验证规则
const rulesAdd = {
  postUserId: [{ required: true, message: '请选择用户', trigger: 'change' }],
  forumId: [{ required: true, message: '请选择论坛', trigger: 'change' }],
  postGametypeRef: [{ required: true, message: '请选择彩种', trigger: 'change' }]
  // ... 其他验证规则
}

// 查询表单
const queryForm = reactive({
  postGametypeRef: '',
  postYear: '',
  postIssue: ''
})

// 游戏类型列表
const gameTypeList = ref<Array<{ label: string; value: string }>>([])

// 期数列表
const GameIssueList = ref<Array<{ label: string; value: string }>>([])

// 获取用户列表
const reqUserList = async (query: string) => {
  // 实现用户列表请求逻辑
  return []
}

// 获取论坛列表
const reqForumHttp = async (query: string) => {
  // 实现论坛列表请求逻辑
  return []
}

// 关闭对话框
const closeDialog = () => {
  //   addDialogVisible.value = false
  emit('update:modelValue', false) // 更新 modelValue
  emit('close') // 通知父组件关闭事件
  console.log('🚀 ~ closeDialog ~ emit:')
}

// 处理表单提交
const handleRules = async (scope: { form: any }) => {
  if (!addForm.value) return

  await addForm.value.validate(async (valid: boolean) => {
    if (valid) {
      // 实现提交逻辑
      console.log('form:', scope.form)
      closeDialog()
    }
  })
}

// 可以添加其他需要的方法和计算属性
</script>

<template>
  <el-dialog v-model="props.modelValue" draggable overflow destroy-on-close @close="closeDialog" class="tabs-dialog">
    <mTabPane label="帖子">
      <m-form
        ref="addForm"
        :options="addDialogOptions"
        :modelForm="initAddForm"
        :rowAttrs="rowAttrs"
        :commonSpan="10"
        :rules="rulesAdd"
      >
        <template #postUserId="scope">
          <UniRemoteInput
            v-model="scope.form.postUserId"
            :search-obj="{}"
            valueKey="userId"
            labelKey="loginId"
            searchKey="userId"
            event-focus="focus"
            :fetchOptions="reqUserList"
            :formatLabel="(item) => (item.loginId ? `${item.loginId} - ${item.userId}` : item.userId)"
          />
        </template>
        <template #forumId="scope">
          <UniRemoteInput
            v-model="scope.form.forumId"
            :search-obj="{}"
            valueKey="forumId"
            labelKey="forumName"
            searchKey="forumId"
            event-focus="focus"
            :fetchOptions="reqForumHttp"
            :formatLabel="(item) => (item.forumName ? `${item.forumName} - ${item.forumId}` : item.forumId)"
          />
        </template>
        <template #postGametypeRef="scope">
          <el-select v-model="queryForm.postGametypeRef" placeholder="">
            <el-option v-for="item in gameTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template #postIssue="scope">
          <el-select
            v-model="queryForm.postIssue"
            placeholder="选择期数"
            :disabled="!queryForm.postGametypeRef || !queryForm.postYear"
          >
            <el-option v-for="item in GameIssueList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
        <template #action="scope">
          <section class="button-row">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="handleRules(scope)">提交</el-button>
          </section>
        </template>
      </m-form>
    </mTabPane>
  </el-dialog>
</template>

<style lang="less" scoped></style>
