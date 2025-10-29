<template>
  <el-upload
    v-bind="uploadAttrs"
    :fileList="fileList"
    :on-success="onSuccessOriginal"
    :on-preview="onPreview"
    :on-remove="onRemove"
    :on-error="onError"
    :on-progress="onProgress"
    :on-change="onChange"
    :before-upload="beforeUpload"
    :before-remove="beforeRemove"
    :http-request="httpRequest ? httpRequest : handelCustomRequest"
    :on-exceed="onExceed"
  >
    <slot name="uploadArea"></slot>
    <slot name="uploadTip"></slot>

    <template #file="{ file }">
      <slot name="file" :file="file"></slot>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { FileUploadRequest } from '@/api/system/upload/types'
import { FormInstance, FormOptions } from '@/components/mForm/types'
import { ref } from 'vue'
import { useManageSiteStore } from '@/stores/manageSiteStore'
const manageSite = useManageSiteStore()
const uploadAttrs = ref({ multiple: false, listType: 'picture-card', limit: 1 })
let emits = defineEmits([
  'on-preview',
  'on-remove',
  'on-success',
  'on-error',
  'on-progress',
  'on-change',
  'before-upload',
  'before-remove',
  'on-exceed',
  'on-selectAuto',
  'on-reqData'
])
let props = defineProps({
  // modelValue: Object,
  modelForm: Object,
  // 表单的配置项
  options: {
    type: Array as PropType<FormOptions[]>,
    required: true
  },
  // 用户自定义上传方法
  httpRequest: {
    type: Function
  },
  beforeUpload: {
    type: Function,
    default: null
  },
  commonSpan: {
    type: Number as PropType<FormOptions['columnSpan']>,
    default: 24
  },
  fileList: {
    type: Array
  },
  uploadData: {
    type: Object as PropType<FileUploadRequest>
  },
  onPreview: {
    type: Function
  },
  onRemove: {
    type: Function
  },
  rowAttrs: {
    type: Object as PropType<FormOptions['rowAttrs']>
  }
})
const model = ref<any>({ ...props.modelForm })
let rules = ref<any>(null)
let form = ref<FormInstance | null>()
let edit = ref()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref(props.fileList)
const optionData = ref(props.options)
const responseData = ref()
const isInlineAction = computed(() => {
  return props.options.some((item) => item.type === 'action')
})
/**
 * 上传图片成功
 * @param response 上传的响应结果
 * @param file 上传的图片文件
 * @param fList 上传的文件列表
 * @description
 * 1. 将 fileList.value 指向 fList
 * 2. 上传的图片地址写到 model.value[uploadItem.prop!] 中
 * 3. 触发 on-success 事件
 * 4. 将 responseData.value 置空
 */
const onSuccessOriginal = async (response: any, file: File, fList: any[]) => {
  if (!responseData.value) return
  fileList.value = fList
  let uploadItem = props.options.find((item) => item.type === 'upload')!
  model.value[uploadItem.prop!] = { response: responseData.value, file, fileList: fileList.value }
  emits('on-success', { response: responseData.value, file, fileList: fileList.value })
  await nextTick()
  responseData.value = null
}
let onError = (err: any, file: File, fileList: FileList) => {
  emits('on-error', { err, file, fileList })
}
let onProgress = (event: any, file: File, fileList: FileList) => {
  emits('on-progress', { event, file, fileList })
}
let onChange = (file: File, fileList: FileList) => {
  emits('on-change', { file, fileList })
}
let beforeRemove = (file: File, fileList: FileList) => {
  emits('before-remove', { file, fileList })
}
const handelCustomRequest = async (options: any) => {
  const param = {
    fileType: props.uploadData?.fileType ?? 'img', // 提供一个默认值
    uploadFrom: props.uploadData?.uploadFrom,
    storageStyle: props.uploadData?.storageStyle || 6
  }
}
let onExceed = (files: File, fileList: FileList) => {
  emits('on-exceed', { files, fileList })
}
</script>
