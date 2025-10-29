<template>
  <section class="dialogEdit">
    <el-dialog
      draggable
      overflow
      destroy-on-close
      v-model="isVisible"
      :close-on-click-modal="false"
      @close="closeTabs"
      @open="openReq"
      class="tabs-dialog"
    >
      <mTabPane label="主板">
        <div class="m-level-table-outside">
          <m-form
            ref="editForm"
            :file-list="fileList"
            :modelForm="mainboardInfo"
            :options="editDialogOptions"
            :rules="rulesEdit"
            :uploadData="uploadData"
            :commonSpan="10"
            @on-success="handleSuccess"
            @on-exceed="handleExceed"
            @on-remove="handleRemove"
            style="height: auto"
            :rowAttrs="rowAttrs"
          >
            <template #uploadArea>
              <el-icon>
                <Plus />
              </el-icon>
            </template>
            <template #action="scope" v-if="isOperateShow">
              <section class="button-row">
                <el-button @click="closeTabs">取消</el-button>
                <el-button type="primary" @click="handleSubmit(scope)">提交</el-button>
              </section>
            </template>
          </m-form>
          <el-divider />
          <section class="m-level-table-inside">
            <section class="header-inside-dialog">
              <h3>层级表示(</h3>
              <el-breadcrumb :separator-icon="ArrowRight" style="display: flex">
                <el-breadcrumb-item v-for="(item, index) in childrenHeaderList">
                  <span class="like-a" @click="handleChildrenList(item, index)" v-if="index == 0">
                    {{ item.mainboardId }}
                  </span>
                  <span class="like-a" @click="handleChildrenList(item, index)" v-if="index == 1">
                    {{ item.forumId }}
                  </span>
                </el-breadcrumb-item>
              </el-breadcrumb>
              <h3>)</h3>
            </section>
            <section class="m-level-table-content">
              <m-table
                :options="breadcrumbOptions"
                :data="childrenListTableData"
                isEditRow
                :isLoading="loadingChildren"
                stripe
                size="small"
              >
                <template #forumInfo="{ scope }">
                  <el-link class="like-a" @click="handleChildrenList(scope.row, 1)">
                    {{ scope.row.forumId }}
                  </el-link>
                </template>
                <template #isForumSwitch="{ scope }">
                  <template v-if="scope.row.forumStatus == 'y'">
                    <el-tag type="success">启用</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="info">关闭</el-tag>
                  </template>
                </template>
                <template #isPostSwitch="{ scope }">
                  <template v-if="scope.row.postStatus == 'y'">
                    <el-tag type="success">启用</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="info">关闭</el-tag>
                  </template>
                </template>
                <template #countInfo="{ scope }">
                  <p
                    v-if="
                      scope.row.likeCount || scope.row.favoriteCount || scope.row.threadCount || scope.row.readCount
                    "
                  >
                    <span>{{ scope.row.likeCount ? scope.row.likeCount : 0 }}</span>
                    ｜
                    <span>{{ scope.row.favoriteCount ? scope.row.favoriteCount : 0 }}</span>
                    ｜
                    <span>{{ scope.row.threadCount ? scope.row.threadCount : 0 }}</span>
                    ｜
                    <span>{{ scope.row.readCount ? scope.row.readCount : 0 }}</span>
                  </p>
                </template>
                <template #isAttachment="{ scope }">
                  <template v-if="scope.row.hasAttachment == 'y'">有</template>
                  <template v-else>无</template>
                </template>
              </m-table>
            </section>
          </section>
        </div>
      </mTabPane>
    </el-dialog>
  </section>
</template>
<script setup lang="ts">
import { useMainboardApi } from '@/api/bss/mainboardManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
//数据
import { editDialogOptions, forumOptions, postOptions } from '@/views/Bbs/bbsMainboard/data'

//面包屑相关
import { ArrowRight } from '@element-plus/icons-vue'
import { useForumApi } from '@/api/bss/forumManagement/index'
import type { GetRequest as GetForumRequest } from '@/api/bss/forumManagement/types'
import { usePostApi } from '@/api/bss/postContentManagement/index'
import type { GetRequest as GetPostRequest } from '@/api/bss/postContentManagement/types'

//上传相关
import type { UploadUserFile } from 'element-plus'

const { VITE_CDN_URL } = webConfigApi

import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'

const emit = defineEmits(['refreshPage'])

const modalsStore = useModalsStore()

const isVisible = computed(() => modalsStore.mainboardSeriesModal.isVisible)
const modalData = computed(() => modalsStore.mainboardSeriesModal.modalData || {})
const isOperateShow = computed(() => modalsStore.mainboardSeriesModal.modalData?.isOperateShow || false)
const manageSiteId = computed(() => modalsStore.mainboardSeriesModal.modalData?.manageSiteId || '')
// const props = defineProps({
//   mainboardId: {
//     type: String,
//     required: true
//   },
//   searchFunk: {
//     type: Function,
//     default: null,
//     required: false
//   }
// })
// const isTabs = defineModel('isTabs', { default: false })

const initMainboardInfo = () => ({
  mainboardId: '',
  mainbordName: '',
  createTime: null,
  mainboardIcon: '',
  mainboardStatus: 'y',
  isTop: 'n',
  isSelected: 'n',
  isHot: 'n',
  isBloom: 'n',
  isRecommended: 'n'
})

const mainboardInfo = ref(initMainboardInfo())
const mainboardId = ref()

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

//上传参数
const uploadData = {
  fileType: 'img',
  uploadFrom: 'bbs/mainboard/icon',
  storageStyle: 6
}

//面包屑相关
const childrenHeaderList = ref()
const childrenListTableData = ref()
const loadingChildren = ref(false)

//面包屑表格列表
const breadcrumbOptions = ref(forumOptions)

const { editHttp, queryHttp } = useMainboardApi(manageSiteId)
const reqForumHttp = useForumApi(manageSiteId).reqHttp
const reqPostHttp = usePostApi(manageSiteId).reqHttp

//编辑的时候的
const rulesEdit = ref({
  mainboardId: [
    { required: true, message: '主板ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '主板ID不符合标准', trigger: 'blur' }
  ],
  bbsId: [
    { required: true, message: '论坛ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '论坛ID不符合标准', trigger: 'blur' }
  ],
  mainbordName: [{ required: true, message: '主板名称不能为空', trigger: 'blur' }]
})

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      if (imgUrl.value) {
        params.mainboardIcon = imgUrl.value
      } else if (!fileList.value.length) {
        params.mainboardIcon = null
      }
      try {
        const response = await editHttp(params)
        if (response.success) {
          imgUrl.value = ''
          fileList.value = []
          closeEditTab()
        } else {
          showErrorMessage(response)
        }
      } catch (error) {
        console.error('Error saving data:', error)
      }
    } else {
      console.log('表单验证失败')
    }
  })
}

//上传
let handleExceed = (val: any) => {
  // console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
}

let handleSuccess = (val: any) => {
  // console.log('success')
  // console.log(val)
  imgUrl.value = val.response?.path
}

const handleRemove = (val: any) => {
  fileList.value = []
  imgUrl.value = ''
}

//面包屑相关
const handleChildrenList = async (row: any, index) => {
  let response: { success?: boolean; data?: any } = {}
  try {
    loadingChildren.value = true
    if (index == 0) {
      const { mainboardId } = row
      breadcrumbOptions.value = forumOptions
      response = await reqForumHttp({ mainboardId, page: 1, size: 999 } as GetForumRequest)
    } else if (index == 1) {
      const { forumId } = row
      breadcrumbOptions.value = postOptions
      response = await reqPostHttp({ forumId, page: 1, size: 999 } as GetPostRequest)
      childrenHeaderList.value.push({ forumId })
    } else {
      return
    }
    if (response?.success) {
      childrenHeaderList.value.splice(index + 1)
      childrenListTableData.value = []
      childrenListTableData.value = response.data.list
      if (index == 1) {
        childrenListTableData.value.forEach((item) => {
          if (!item.title) {
            if (item.postContent) {
              item.title = item.postContent.slice(0, 10)
            } else {
              item.title = '帖子标题'
            }
          }
        })
      }
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loadingChildren.value = false
  }
}

//获取主板信息
const reqMainboardInfoObject = async (id) => {
  if (id) {
    childrenHeaderList.value = []
    try {
      let res = await queryHttp({ mainboardId: id })
      if (res.success) {
        mainboardInfo.value = { ...res.data }
        if (mainboardInfo.value.mainboardIcon) {
          const parts = mainboardInfo.value.mainboardIcon?.split('/')
          const lastPart = parts[parts.length - 1]
          fileList.value.push({
            name: lastPart,
            url: VITE_CDN_URL + mainboardInfo.value.mainboardIcon
          })
        }
        childrenHeaderList.value.push({ mainboardId: mainboardInfo.value.mainboardId })
        handleChildrenList(mainboardInfo.value, 0)
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  } else {
  }
  // console.log('childrenHeaderList', childrenHeaderList.value);
}

const openReq = () => {
  console.log(222, modalData)
  mainboardId.value = modalData.value.mainboardId
  reqMainboardInfoObject(mainboardId.value)
}

//关闭窗口
const closeTabs = () => {
  //isTabs.value = false
  modalsStore.hideModal('mainboardSeriesModal')
  Object.assign(mainboardInfo.value, initMainboardInfo())
  fileList.value = []
  imgUrl.value = ''
}

const closeEditTab = () => {
  closeTabs()
  emit('refreshPage')
  //props?.searchFunk()
}

const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

onMounted(() => {})
</script>

<style scoped lang="less"></style>
