<template>
  <!-- @keydown.enter.native.prevent="handleSubmit" -->
  <el-form
    ref="form"
    class="m_form"
    v-if="model"
    :validate-on-rule-change="false"
    :model="model"
    :rules="rules"
    v-bind="$attrs"
  >
    <el-scrollbar>
      <el-row v-bind="rowAttrs">
        <template v-for="(item, index) in optionData" :key="index">
          <el-col :span="item.columnSpan ? item.columnSpan : commonSpan" v-if="item.visible !== false">
            <!-- 插槽测试代码 -->
            <el-form-item v-if="item.type === 'slot'" :prop="item.prop" :label="item.label">
              <slot :name="item.prop" :form="model"></slot>
            </el-form-item>

            <el-form-item v-else :prop="item.prop" :label="item.label">
              <template v-if="!item.children || !item.children!.length">
                <template v-if="item.type === 'text' && model[item.prop!]">
                  <span v-if="item.textData?.isHandleStr">
                    {{ handleStr10And10(model[item.prop!]) }}
                  </span>
                  <span v-else>{{ model[item.prop!] }}</span>
                  <copy v-if="item.textData?.isCopy || item.isEndCopy" :content="model[item.prop!]" />
                </template>
                <!-- 拼接文本 spliceText -->
                <template v-if="item.type === 'spliceText' && item.spliceTextData?.length">
                  <div class="splice-text">
                    <template v-for="(child, i) in item.spliceTextData" :key="i">
                      <template v-if="model[child.prop]">
                        <template v-if="child.displayType === 'text'">
                          <el-text>{{ model[child.prop] }}</el-text>
                        </template>
                        <template v-else-if="child.displayType === 'truncated'">
                          <el-text class="truncated" truncated>
                            {{ model[child.prop] }}
                          </el-text>
                        </template>
                        <template v-else-if="child.displayType === 'mask'">
                          <el-text class="mask">
                            {{
                              handleStrMask(
                                model[child.prop],
                                child.maskData?.firstLength,
                                child.maskData?.lastLength,
                                child.maskData?.maxLength,
                                child.maskData?.mask
                              )
                            }}
                          </el-text>
                        </template>
                        <span v-if="i < item.spliceTextData.length - 1">&nbsp;|&nbsp;</span>
                        <copy class="showCopy" v-if="child.showCopy !== false" :content="model[child.prop]"></copy>
                      </template>
                    </template>
                  </div>
                </template>
                <!-- 拼接文本 spliceText -->
                <!-- 日期文本 dateText -->
                <template v-if="item.type === 'dateText'">
                  <span>{{ unitFormatDate(model[item.prop!], 'yyyy-MM-dd HH:mm:ss') }}</span>
                </template>
                <!-- 日期文本 dateText -->
                <template v-if="item.type === 'mAutoComplete'">
                  <m-autoComplete
                    v-model="model[item.prop!]"
                    :httpFunc="item.autoData?.httpReq || (() => [])"
                    :keyword="item.autoData?.keyword || ''"
                    :inputValue="item.autoData?.inputValue"
                    :placeholder="item.autoData?.placeholder"
                    :isPage="item.autoData?.isPage"
                    :isList="item.autoData?.isList"
                    :displayFields="item.autoData?.displayFields"
                    @select="handleAutoSelect"
                    @reqData="handleReqData"
                    v-bind="item.attrs"
                  ></m-autoComplete>
                </template>
                <!-- 上传组件部分 -->
                <template v-if="item.type === 'upload'">
                  <el-upload
                    v-bind="item.uploadAttrs"
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
                <!-- 上传组件部分 -->
                <!-- 组件自动引入部分 -->
                <template v-if="item.type !== 'upload' && item.type !== 'editor'">
                  <component
                    :placeholder="item.placeholder"
                    v-bind="item.attrs"
                    :is="`el-${item.type}`"
                    v-model="model[item.prop!]"
                  ></component>

                  <copy v-if="item?.isCopy" :content="model[item.prop!]" />
                </template>
                <!-- 组件自动引入部分 -->
                <!-- <div
                id="editor"
                v-bind="item.attrs"
                v-if="item.type === 'editor'"
              ></div> -->
              </template>
              <template v-if="item.children && item.children.length">
                <component
                  :placeholder="item.placeholder"
                  v-bind="item.attrs"
                  :is="`el-${item.type}`"
                  v-model="model[item.prop!]"
                >
                  <component
                    v-for="(child, i) in item.children"
                    :key="i"
                    :is="`el-${child.type}`"
                    :label="child.label"
                    :value="child.value"
                  ></component>
                </component>
              </template>
              <!-- 操作按钮 -->
              <template v-if="item.type === 'action' && isInlineAction">
                <slot name="action" :form="form" :model="model"></slot>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-scrollbar>
    <div v-if="!isInlineAction">
      <slot name="action" :form="form" :model="model"></slot>
    </div>
  </el-form>
  <el-dialog v-model="dialogVisible">
    <img w-full width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { PropType, ref, onMounted, watch, nextTick, computed } from 'vue'
import { FormInstance, FormOptions } from './types'
import { cloneDeep } from 'lodash-es'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { AddRequest, FileUploadRequest, IUploadRequestConfig } from '@/api/system/upload/types'
import { sessionCache } from '@/hooks/useSession'
import { addHttp, uploadSingle } from '@/api/system/upload'
// import type { UploadProps } from 'element-plus';
import { handleStr10And10, handleStrMask } from '@/utils/dataFormat'
import mAutoComplete from '@/components/mAutocomplete/index.vue'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

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
  'on-reqData',
  'on-formchange'
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
// 初始化表单
let initForm = (newVal) => {
  optionData.value = newVal
  if (optionData.value && optionData.value.length) {
    let m: any = {}
    let r: any = {}
    optionData.value.map((item: FormOptions) => {
      m[item.prop!] = item.value
      r[item.prop!] = item.rules
    })
    model.value = cloneDeep(m)
    rules.value = cloneDeep(r)
  }
}

// 重置表单
let resetFields = () => {
  // 重置element-plus的表单
  form.value!.resetFields()
  // 重置富文本编辑器的内容
  // 获取到富文本的配置项
  // if (props.options && props.options.length) {
  //   let editorItem = props.options.find((item) => item.type === 'editor')!
  //   editorItem && edit.value.txt.html(editorItem.value)
  // }
}
// 表单验证方法
let validate = () => {
  return form.value!.validate
}
// 获取表单数据
let getFormData = () => {
  return model.value
}
//修改Form
let setFormData = (val) => {
  model.value = val
}

// 分发方法
defineExpose({
  resetFields,
  validate,
  getFormData,
  setFormData
})

onBeforeUnmount(() => {
  // 组件销毁时，销毁编辑器实例
  if (edit.value) {
    edit.value.destroy()
  }
})
// 监听父组件传递进来的options
watch(
  () => props.options,
  (newVal) => {
    initForm(newVal)
  },
  { deep: true }
)

watch(
  () => props.modelForm,
  (newVal) => {
    model.value = newVal
  },
  { deep: true }
)

watch(
  () => model,
  (newVal) => {
    emits('on-formchange', newVal)
  },
  { deep: true }
)

watch(
  () => props.fileList,
  (newList) => {
    fileList.value = newList
  },
  { deep: true }
)

// 上传组件的所有方法
let onPreview: any['onPreview'] = (uploadFile) => {
  emits('on-preview', uploadFile)
  if (props.onPreview) {
    return props.onPreview(uploadFile)
  } else {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
  }
}
let onRemove: any['onRemove'] = (uploadFile, uploadFiles) => {
  emits('on-remove', { uploadFile, uploadFiles })

  if (props.onRemove) {
    return props.beforeUpload({ uploadFile, uploadFiles })
  } else {
    console.log(uploadFile, uploadFiles)
  }
}

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
/**
 * 上传图片成功
 * @param {Object} response 上传成功后服务器返回的结果
 * @param {File} file 上传的文件
 * @param {FileList} fList 上传的文件列表
 */
let onSuccess = async (response: any, file: File, fList: FileList) => {
  // 上传图片成功 给表单上传项赋值
  response && uploadLog(response)
  responseData.value = response
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
let beforeUpload = (file: File) => {
  emits('before-upload', file)
  if (props.beforeUpload) {
    return props.beforeUpload(file)
  } else {
    return handleBeforeUpload(file)
  }
}
let beforeRemove = (file: File, fileList: FileList) => {
  emits('before-remove', { file, fileList })
}
let onExceed = (files: File, fileList: FileList) => {
  emits('on-exceed', { files, fileList })
}
// 自动选择
let handleAutoSelect = (item) => {
  emits('on-selectAuto', item)
}
// 请求数据
let handleReqData = (item) => {
  emits('on-reqData', item)
}

let fileData = ref()
//上传部分 功能
const handleBeforeUpload = (file: File) => {
  fileData.value = file
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  return true
}

const handelCustomRequest = async (options: any) => {
  const param = {
    fileType: props.uploadData?.fileType ?? 'img', // 提供一个默认值
    uploadFrom: props.uploadData?.uploadFrom,
    storageStyle: props.uploadData?.storageStyle || 6
  }

  // 如果你能确保 fileType 一定有值，可以使用类型断言
  const formData: FileUploadRequest = {
    uploadTarget: options.file.name,
    file: options.file,
    storageType: VITE_STORY_TYPE,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
    ...param
  } as FileUploadRequest // 使用类型断言
  const obj: IUploadRequestConfig = {
    baseurl: VITE_PROXY_UPLOAD,
    contenttype: 'multipart/form-data'
    // clientType: 'Web'
  }
  await uploadSingle(formData, obj)
    .then((response) => {
      nextTick(() => {
        onSuccess(response.data, options.file, options.fileList)
      })
    })
    .catch((error) => {
      console.log(error)
    })
}
const uploadLog = async (param) => {
  if (!param && fileData.value.length <= 0) {
    return
  }
  const uploadUser = sessionCache.getCache('userID')
  const formData: AddRequest = {
    storageStyle: props.uploadData?.storageStyle || 6,
    fileType: props.uploadData?.fileType ?? 'img',
    uploadFrom: param.data ? param.data.path : param.path ?? '',
    uploadTarget: fileData.value.name,
    storageType: VITE_STORY_TYPE,
    uploadUser,
    biz: 'upload',
    fileSize: fileData.value.size,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod'
  }
  // console.log(obj)
  await addHttp(formData)
    .then((response) => {
      ElMessage.success('上传成功')
    })
    .catch((error) => {
      console.log(error)
      ElMessage.success('上传失败')
    })
}

onMounted(() => {
  if (props?.modelForm) {
    model.value = props.modelForm
  }
  initForm(props.options)
})
</script>

<style lang="scss" scoped>
#copy {
  display: none;
}
.splice-text {
  display: flex;
  align-items: center;
  flex-grow: 1;
  .truncated {
    width: 9rem;
  }
  .mask {
    margin-left: 0.5rem;
  }
}
.splice-text:hover {
  #copy {
    display: block;
  }
}
</style>
