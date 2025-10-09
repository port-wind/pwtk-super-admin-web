<template>
  <m-form
    ref="form"
    :fileList="fileList"
    :options="options"
    :commonSpan="22"
    :uploadData="uploadData"
    @on-remove="handleRemove"
    @before-upload="beforeUpload"
    @on-success="handleSuccess"
    style="height: auto; overflow: hidden"
    :rowAttrs="rowAttrs"
  >
    <template #uploadArea>
      <el-icon><Plus /></el-icon>
    </template>
    <template #file="{ file }">
      <enhanced-file-upload :key="file.uid" :file="file" @remove="handleRemove" />
    </template>
    <template #action="scope">
      <section class="button-row" style="width: 100%; text-align: right">
        <el-button size="small" @click="emit('cancel', scope)">取消</el-button>
        <el-button type="primary" size="small" @click="submit(scope)">提交</el-button>
      </section>
    </template>
  </m-form>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { UploadUserFile } from 'element-plus'
import type { FormOptions } from '@/components/mForm/types'
import { changeUploadData } from '@/utils/dataFormat'
import type { FileUploadRequest } from '@/api/system/upload/types'

const uploadData = reactive({
  fileType: 'ico',
  uploadFrom: 'bbs/6',
  storageStyle: 6
} as FileUploadRequest)
const fileList = ref<UploadUserFile[]>([])
const options: FormOptions[] = [
  {
    prop: 'replyContent',
    label: '',
    type: 'input',
    columnSpan: 24,
    attrs: { type: 'textarea' },
    rules: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
  },
  {
    type: 'upload',
    prop: 'pic',
    // @ts-ignore
    columnSpan: 15,
    uploadAttrs: {
      listType: 'picture-card',
      autoUpload: true,
      multiple: true
    }
  },
  {
    type: 'action',
    prop: 'action',
    // @ts-ignore
    columnSpan: 9
  }
]

const rowAttrs = {
  gutter: 0
}
const emit = defineEmits(['cancel', 'submit'])

const handleRemove = (val: any) => {
  fileList.value = fileList.value.filter((item) => item!.raw!.uid !== val.raw.uid)
}

const beforeUpload = (val: any) => {
  // emit('beforeUpload', val)
  Object.assign(uploadData, changeUploadData(val.type, 'bbs/forum/attachment').uploadData)
}

const handleSuccess = (val: any) => {
  // emit('success', val)
  const { response, file } = val
  const fList = val.fileList
  fileList.value = fList.map((item: any) => {
    const foundFlag = item.raw.uid === file.raw.uid
    return {
      ...item,
      response: foundFlag ? response : item.response
    }
  })
}
const submit = (scope: { model: any; form: any }) => {
  emit('submit', { model: scope.model, form: scope.form, fileList: fileList.value })
}
</script>
