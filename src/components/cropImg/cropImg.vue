<template>
  <div>
    <!-- <el-icon><Edit @click="dialogVisible = true"/></el-icon> -->
    <!-- <el-icon><UploadFilled @click="dialogVisible = true"/></el-icon> -->
    <div class="edit_avatar">
      <el-button
        :disabled="props.btnDisabled ? false : true"
        size="small"
        @click="dialogVisible = true"
        type="primary"
        round
      >
        {{ t('com.Editavatar') }}
      </el-button>
    </div>

    <el-dialog v-model="dialogVisible" class="cropper_dialog" :title="t('com.KJNovaClipper')">
      <template #default>
        <div class="cropper">
          <div class="cropper_left">
            <vueCropper
              :style="{ width: '400px' }"
              ref="cropperRef"
              :img="options.img"
              :info="true"
              :info-true="options.infoTrue"
              :auto-crop="options.autoCrop"
              :fixed-box="options.fixedBox"
              :can-move="options.canMoveBox"
              :can-scale="options.canScale"
              :fixed-number="fixedNumber"
              :fixed="options.fixed"
              :full="options.full"
              :center-box="options.centerBox"
              @real-time="previewHandle"
            />
            <div class="reupload_box">
              <template v-if="!isLoading">
                <el-upload ref="upload" :limit="1" :show-file-list="false" :before-upload="beforeUpload">
                  <template #trigger>
                    <el-button type="primary" :loading="isLoading">
                      {{ t('com.Uploadfiles') }}
                    </el-button>
                  </template>
                  <!-- <template #tip>
                    <div class="el-upload__tip color_red">
                      {{ t('prompt.coverUploadTips') }}
                    </div>
                  </template> -->
                </el-upload>
              </template>
              <template v-else>
                <el-button type="primary" :loading="isLoading">
                  {{ t('com.Uploadfiles') }}
                </el-button>
              </template>
              <div style="margin-left: 200px">
                <el-icon class="rotate_right" @click="changeScale(1)">
                  <CirclePlus />
                </el-icon>
                <el-icon class="rotate_right" @click="changeScale(-1)">
                  <Remove />
                </el-icon>
                <el-icon class="rotate_right" @click="rotateRight">
                  <RefreshRight />
                </el-icon>
              </div>
            </div>
            <div class="el-upload__tip color_red">
              {{ t('prompt.coverUploadTips') }}
            </div>
          </div>

          <div class="cropper_right">
            <div class="preview_text">
              {{ t('button.preview') }}
            </div>
            <div :style="getStyle">
              <div :style="previewFileStyle">
                <img :style="previews.img" :src="previews.url" alt="" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="button-row">
          <el-button @click="dialogVisible = false" type="info">
            {{ t('button.cancel') }}
          </el-button>
          <el-button @click="refreshCrop">
            {{ t('login.reset') }}
          </el-button>
          <el-button type="primary" @click="onConfirm" :loading="isLoading">
            {{ t('button.confirm') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 需要引入的库
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import i18n from '@/i18n'
const { t } = i18n.global as any
import { ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'
// import { upload } from '@/api/user/contact/index'
import { sessionCache } from '@/hooks/useSession'
import { addHttp, uploadSingle } from '@/api/system/upload'
import { AddRequest, FileUploadRequest, IFileUploadParams } from '@/api/system/upload/types'
import { UPLOAD_FILE_LIMIT } from '@/const/commonSet'

const { VITE_PROXY_UPLOAD, VITE_STORY_TYPE, VITE_NODE_ENV } = webConfigApi

const dialogVisible = ref<boolean>(false) // dialog的显示与隐藏

const emits = defineEmits(['getResponse']) // 自定义事件

// 裁剪组件需要使用到的参数
interface Options {
  img: string | ArrayBuffer | null // 裁剪图片的地址
  info: true // 裁剪框的大小信息
  outputSize: number // 裁剪生成图片的质量 [1至0.1]
  outputType: string // 裁剪生成图片的格式
  canScale: boolean // 图片是否允许滚轮缩放
  autoCrop: boolean // 是否默认生成截图框
  autoCropWidth: number // 默认生成截图框宽度
  autoCropHeight: number // 默认生成截图框高度
  fixedBox: boolean // 固定截图框大小 不允许改变
  fixed: boolean // 是否开启截图框宽高固定比例
  fixedNumber: Array<number> // 截图框的宽高比例  需要配合centerBox一起使用才能生效
  full: boolean // 是否输出原图比例的截图
  canMoveBox: boolean // 截图框能否拖动
  original: boolean // 上传图片按照原始比例渲染
  centerBox: boolean // 截图框是否被限制在图片里面
  infoTrue: boolean // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  accept: string // 上传允许的格式
}

// 父组件传参props
interface IProps {
  type: string // 上传类型, 企业logo / 浏览器logo
  allowTypeList: string[] // 接收允许上传的图片类型
  limitSize: number // 限制大小
  btnDisabled?: boolean
  fixedNumber: number[] // 截图框的宽高比例
  fixedNumberAider?: number[] // 侧边栏收起截图框的宽高比例
  previewWidth: number // 预览宽度
  title?: string // 裁剪标题
  uploadData?: any
}

// 预览样式
interface IStyle {
  width: number | string
  height: number | string
}

/* 父组件传参 */
const props = withDefaults(defineProps<IProps>(), {
  type: 'systemLogo',
  allowTypeList: () => ['jpg', 'png', 'jpeg'],
  limitSize: 1,
  fixedNumber: () => [1, 1],
  fixedNumberAider: () => [1, 1],
  previewWidth: 228,
  title: 'LOGO',
  btnDisabled: false,
  uploadData: {
    fileType: 'img', // 提供一个默认值
    uploadFrom: '',
    storageStyle: 6,
    uploadTarget: '',
    file: {},
    storageType: '',
    env: 'dev'
  }
})

// const props = defineProps<{
//      btnDisabled: boolean; // 确保类型正确
//    }>();
// 裁剪组件需要使用到的参数
const options = reactive<Options>({
  img: '', // 需要剪裁的图片
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 150, // 默认生成截图框的宽度
  autoCropHeight: 150, // 默认生成截图框的长度
  fixedBox: false, // 是否固定截图框的大小 不允许改变
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 裁剪生成图片的质量 [1至0.1]
  outputType: 'png', // 裁剪生成图片的格式
  canScale: true, // 图片是否允许滚轮缩放
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [1, 1], // 截图框的宽高比例 需要配合centerBox一起使用才能生效 1比1
  full: true, // 是否输出原图比例的截图
  canMoveBox: false, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  accept: 'image/jpeg,image/jpg,image/png,image/gif,image/x-icon'
})

const getStyle = ref<IStyle>({
  width: '',
  height: ''
})

/* 允许上传的类型 */
const acceptType = ref<string[]>([])

// 裁剪后的预览样式信息
const previews: any = ref({})
const previewFileStyle = ref({})

// 裁剪组件Ref
const cropperRef: any = ref({})
const oldImage = ref()
const isLoading = ref(false)

const fileData = ref()

// 回显图片使用的方法
const beforeUpload = (file) => {
  // isLoading.value = true
  // console.log('beforeUpload', file)
  // const URL = window.URL || window.webkitURL
  const isLtM = file.size / 1024 / 1024 < UPLOAD_FILE_LIMIT
  if (!isLtM) {
    alert(`文件大小不能超过 ${UPLOAD_FILE_LIMIT}MB!`)
    return false
  }
  if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) == -1) {
    ElMessage({
      type: 'warning',
      message: t('com.Onlyjpegjpgpngimages')
    })
    return false
  }
  fileData.value = file

  // console.log(URL.createObjectURL(file))
  options.img = URL.createObjectURL(file)
  return false
  // handelCustomRequest(options)
  // 传原图
  // const fileFormData = new FormData()
  // fileFormData.append('file', file)
  // upload((options.img = URL.createObjectURL(file))).then((res) => {
  //   console.log(res.data)
  //   if (res.success) {
  //     isLoading.value = false
  //     oldImage.value = res.data.path
  //   } else {
  //     ElMessage({
  //       message: t('button.upload') + t('button.fail'),
  //       type: 'error'
  //     })
  //   }
  // })
}

/* 重置裁剪组件 */
const refreshCrop = () => {
  // cropperRef裁剪组件自带很多方法，可以打印看看
  cropperRef.value.refresh()
}

/* 右旋转图片 */
const rotateRight = () => {
  cropperRef.value.rotateRight()
}

/* 放大缩小图片比例 */
const changeScale = (num: number) => {
  const scale = num || 1
  cropperRef.value.changeScale(scale)
}

// 缩放的格式
const tempScale = ref<number>(0)

// base64转图片文件
const dataURLtoFile = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
  const bstr = atob(arr[1])
  let len = bstr.length
  const u8arr = new Uint8Array(len)
  while (len--) {
    u8arr[len] = bstr.charCodeAt(len)
  }
  return new File([u8arr], filename, { type: mime })
}

/* 上传成功方法 */
const cropperSuccess = async (dataFile) => {
  // console.log('onsuccess', dataFile)
  const fileFormData = new FormData()
  fileFormData.append('file', dataFile)
  // 在接口请求中需要上传file文件格式, 并且该接口需要改header头部为form-data格式
  // console.log(fileFormData, 'fileFormData')
  // upload(fileFormData).then((res) => {
  //   if (res.success) {
  //     let data = res.data
  //     data.oldImage = oldImage.value
  //     emits('confirm', res.data)
  //     dialogVisible.value = false
  //   } else {
  //     ElMessage({
  //       message: t('button.upload') + t('button.fail'),
  //       type: 'error'
  //     })
  //   }
  // })
}

// 上传图片（点击保存按钮）
const onConfirm = () => {
  // console.log('onConfirm')
  cropperRef.value.getCropData(async (data: string) => {
    const dataFile: File = dataURLtoFile(data, fileData.value.name)
    await handelCustomRequest(dataFile)
  })

  // cropperRef.value
  //   .getCropData()
  //   .then((res) => {
  //     cropperSuccess(res)
  //   })
  //   .finally(() => {
  //     // loading.value = false;
  //   })
}

// 裁剪之后的数据
const previewHandle = (data: any) => {
  previews.value = data // 预览img图片
  tempScale.value = props.previewWidth / data.w
  previewFileStyle.value = {
    width: data.w + 'px',
    height: data.h + 'px',
    margin: 0,
    overflow: 'hidden',
    zoom: tempScale.value,
    position: 'relative',
    border: '1px solid #e8e8e8',
    'border-radius': '100px'
  }
}

// watch(
//   () => props,
//   () => {
//     /* 预览样式 */
//     getStyle.value = {
//       width: props.previewWidth + 'px', // 预览宽度
//       height: props.previewWidth / props.fixedNumber[0] + 'px' // 预览高度
//     }
//     // 上传格式tips信息
//     acceptType.value = []
//     for (let i = 0; i < props.allowTypeList.length; i++) {
//       acceptType.value.push(props.allowTypeList[i].toUpperCase())
//     }
//   },
//   {
//     deep: true
//   }
// )

const handelCustomRequest = async (file: any) => {
  // const fileFormData = new FormData()
  // fileFormData.append('file', options)
  // console.log('options', options)
  // console.log('fileFormData', fileFormData)
  // return
  const param = {
    fileType: props.uploadData?.fileType ?? 'img', // 提供一个默认值
    uploadFrom: props.uploadData?.uploadFrom || 'user/profile/header',
    storageStyle: props.uploadData?.storageStyle || 6
  }

  // 如果你能确保 fileType 一定有值，可以使用类型断言
  const formData: IFileUploadParams = {
    uploadTarget: file.name,
    file: file,
    storageType: VITE_STORY_TYPE,
    env: VITE_NODE_ENV === 'development' ? 'dev' : 'prod',
    ...param
  } // 使用类型断言
  const obj = {
    baseurl: VITE_PROXY_UPLOAD,
    contenttype: 'multipart/form-data'
    // clientType: 'Web'
  }
  console.log('upload cropImg.vue')
  await uploadSingle(formData, obj)
    .then((response) => {
      // const { path } = response.data
      emits('getResponse', response.data)
      uploadLog(response)
    })
    .catch((error) => {
      console.log(error)
      ElMessage({
        message: t('button.upload') + t('button.fail'),
        type: 'error'
      })
    })
}
const uploadLog = async (param) => {
  if (!param && fileData.value.length <= 0) {
    // console.log()
    return
  }
  const uploadUser = sessionCache.getCache('userID')
  const formData: AddRequest = {
    storageStyle: props.uploadData?.storageStyle || 6,
    fileType: props.uploadData?.fileType ?? 'img',
    uploadFrom: param.data.path,
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
      // let data = response.data
      // data.oldImage = oldImage.value

      dialogVisible.value = false
    })
    .catch((error) => {
      console.log(error)
      ElMessage({
        message: t('button.upload') + t('button.fail'),
        type: 'error'
      })
    })
}
</script>
<style lang="scss" scoped>
.edit_avatar {
  // background-color: black;
  // border: 1px solid black;
  // border-radius: 20px;
  // font-size: 12px;
  // width: 70px;
  // height: 24px;
  // line-height: 20px;
  // color: white;
  // text-align: center;
  // cursor: pointer;
  position: absolute;
  bottom: 0;
}

.cropper {
  width: 100%;
  height: 300px;
  display: flex;
  overflow: hidden;

  .cropper_left {
    display: flex;
    flex-direction: column;

    .reupload_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 10px;

      .reupload_text {
        color: var(--primary-color);
        cursor: pointer;
      }

      .rotate_right {
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }

  .cropper_right {
    flex: 1;
    margin-left: 44px;
    .preview_text {
      margin-bottom: 12px;
    }
  }
}
</style>
