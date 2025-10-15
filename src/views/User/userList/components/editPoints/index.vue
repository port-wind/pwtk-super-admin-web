<script setup lang="ts">
import { setTransferScore } from '@/api/user'
import { useModalsStore } from '@/stores/modalStore'
const modalsStore = useModalsStore()

const prop = defineProps({
  userInfo: {
    type: Object
  }
})
const emit = defineEmits(['close'])

const userInfo = computed(() => prop.userInfo)
const score = ref(0)
const formRef = ref()
const initForm = () => ({
  score: '',
  bak: ''
})
const editForm = ref(initForm())
const rules = ref({
  score: [
    { required: true, message: '请输入数量', trigger: 'blur' },
    { pattern: /^-?[0-9]+$/, message: '请输入正数(加积分)或是负数(减积分)', trigger: 'blur' }
  ],
  bak: [{ required: true, message: '请输入原因', trigger: 'blur' }]
})

const verificationQuantity = () => {
  if (Number(editForm.value.score) > 100000) {
    ElMessage.error('积分调整失败，单次增加不得超过10万')
    return true
  } else {
    return false
  }
}

const onSubmit = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (verificationQuantity()) return
      const params = {
        userId: userInfo.value!.userId,
        score: Number(editForm.value.score),
        bak: editForm.value.bak
      }
      const res = await setTransferScore(params)
      if (res.success) {
        // console.log('submit!')
        score.value = Number(editForm.value.score) + userInfo.value!.score
        closeHand()
        modalsStore.setActiveTab('userInfoModal', 'points')
        modalsStore.userInfoModal.modalData!.refresh = !modalsStore.userInfoModal.modalData!.refresh
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const closeHand = () => {
  formRef.value.resetFields()
  console.log('close')
  emit('close', score.value)
}
</script>
<template>
  <el-form ref="formRef" :model="editForm" label-position="top" :rules="rules">
    <el-form-item label="数量:" prop="score">
      <el-input v-model="editForm.score" placeholder="请输入正数(加积分)或是负数(减积分)" />
    </el-form-item>
    <el-form-item label="原因:" prop="bak">
      <el-input v-model="editForm.bak" type="textarea" maxlength="200" show-word-limit />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="closeHand">取消</el-button>
    </el-form-item>
  </el-form>
</template>
