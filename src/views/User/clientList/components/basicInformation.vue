<template>
  <!-- 基本信息 -->
  <div>
    <el-form :model="editForm" ref="editFormRef" style="margin: 0 auto" label-width="130">
      <el-row>
        <el-col :span="1"></el-col>
        <el-col :span="14">
          <el-form-item label="客户端ID:" prop="cid">
            {{ editForm.cid }}
          </el-form-item>
          <el-form-item label="UA:" prop="UA">
            {{ editForm.ua }}
          </el-form-item>
          <el-form-item label="OS:" prop="OS">
            {{ editForm.os }}
          </el-form-item>
          <el-form-item label="最后使用的用户:" prop="lastUserId">
            {{ editForm.lastUserId }}
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
        <el-col :span="6">
          <el-form-item label="申请时IP:" prop="regIP" style="width: 100% !important">
            {{ editForm.regIP }}
          </el-form-item>

          <el-form-item label="申请时间:" prop="regTime">
            {{ unitFormatDate(editForm.regTime, 'yyyy-MM-dd hh:mm:ss') }}
          </el-form-item>

          <el-form-item label="终端类型:" prop="businessType">
            {{ _Options.businessType[editForm.businessType] }}
          </el-form-item>
          <el-form-item label="终端标记:" prop="clientFlag">
            {{ _Options.clientFlag[editForm.clientFlag] }}
          </el-form-item>
        </el-col>
        <el-col :span="1"></el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { unitFormatDate, convertToTimestamp } from '@/utils/dateFormat/index'
import showErrorMessage from '@/utils/showErrorMessage'
import _Options from '@/const/options.json'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})

const editForm: any = ref({})
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
