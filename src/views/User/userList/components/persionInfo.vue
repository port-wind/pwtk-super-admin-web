<template>
  <div>
    <el-form :model="editForm">
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="10">
          <el-form-item label="性别:" prop="gender">
            <span v-if="editForm.gender == 'm'">男</span>
            <span v-if="editForm.gender == 'f'">女</span>
            <span v-if="editForm.gender == 'x'">未知</span>
          </el-form-item>
          <el-form-item label="生日:" prop="parentId"></el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="10">
          <el-form-item label="所在地:" prop="mobileCountryCode"></el-form-item>

          <el-form-item label="星座:" prop="isAuthentication"></el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { reqUserList } from '@/api/user/index'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})

const editForm: any = ref<any>({})
const editFormRef = ref()

editForm.value = { ...props.accountInfo }

watch(
  () => props.accountInfo,
  (newVal) => {
    editForm.value = { ...newVal }
  },
  { deep: true }
)
</script>
