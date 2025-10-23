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
      <mTabPane label="BBS">
        <div class="m-level-table-outside">
          <m-form
            ref="editForm"
            :file-list="fileList"
            :modelForm="bbsInfo"
            :options="editDialogOptions"
            :rules="rulesEdit"
            :commonSpan="10"
            :uploadData="uploadData"
            @on-success="handleSuccess"
            @on-exceed="handleExceed"
            style="height: auto"
            :rowAttrs="rowAttrs"
          >
            <template #uploadArea>
              <el-icon>
                <Plus />
              </el-icon>
            </template>
            <template #action="scope" v-if="isOperateShow">
              <section class="button-row dialog-footer-submit">
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
                    {{ item.bbsId }}
                  </span>
                  <span class="like-a" @click="handleChildrenList(item, index)" v-if="index == 1">
                    {{ item.mainboardId }}
                  </span>
                  <span class="like-a" @click="handleChildrenList(item, index)" v-if="index == 2">
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
                <template #mainboardInfo="{ scope }">
                  <el-link class="like-a" @click="handleChildrenList(scope.row, 1)">
                    {{ scope.row.mainboardId }}
                  </el-link>
                </template>
                <template #isMainboardSwitch="{ scope }">
                  <template v-if="scope.row.mainboardStatus == 'y'">
                    <el-tag type="success">启用</el-tag>
                  </template>
                  <template v-else>
                    <el-tag type="info">关闭</el-tag>
                  </template>
                </template>
                <template #forumInfo="{ scope }">
                  <el-link class="like-a" @click="handleChildrenList(scope.row, 2)">
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
import { useBbsApi } from '@/api/bss/infoManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'

//数据
import { editDialogOptions, mainboardOptions, forumOptions, postOptions } from '@/views/Bbs/bbsInfo/data'

//上传
import type { UploadUserFile } from 'element-plus'

const { VITE_CDN_URL } = webConfigApi

//面包屑相关
import { ArrowRight } from '@element-plus/icons-vue'
import { useMainboardApi } from '@/api/bss/mainboardManagement/index'
import type { GetRequest as GetMainboardRequest } from '@/api/bss/mainboardManagement/types'
import { useForumApi } from '@/api/bss/forumManagement/index'
import type { GetRequest as GetForumRequest } from '@/api/bss/forumManagement/types'
import { usePostApi } from '@/api/bss/postContentManagement/index'
import type { GetRequest as GetPostRequest } from '@/api/bss/postContentManagement/types'

import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'
const emit = defineEmits(['refreshPage'])

const modalsStore = useModalsStore()

const isVisible = computed(() => modalsStore.bbsSeriesModal.isVisible)
const modalData = computed(() => modalsStore.bbsSeriesModal.modalData || {})
const isOperateShow = computed(() => modalsStore.bbsSeriesModal.modalData?.isOperateShow || false)
const manageSiteId = computed(() => modalsStore.bbsSeriesModal.modalData?.manageSiteId || '')

// const props = defineProps({
//   bbsId: {
//     type: String,
//     required: true
//   },
//   searchFunk: {
//     type: Function,
//     default: null,
//     required: false
//   }
// })
//const isTabs = defineModel('isTabs', { default: false })

const initBbsInfo = () => ({
  bbsId: '',
  bbsName: '',
  createTime: null,
  bbsIcon: '',
  bbsStatus: 'y',
  isTop: 'n',
  isSelected: 'n',
  isHot: 'n',
  isBloom: 'n',
  isRecommended: 'n'
})

const bbsInfo = ref(initBbsInfo())
const bbsId = ref()

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

//上传参数
const uploadData = {
  fileType: 'img', // 提供一个默认值
  uploadFrom: 'bbs/icon',
  storageStyle: 6
}

//面包屑相关
const childrenHeaderList = ref()
const childrenListTableData = ref()
const loadingChildren = ref(false)
//面包屑表格列表
const breadcrumbOptions = ref(mainboardOptions)

const { editHttp, queryHttp } = useBbsApi(manageSiteId)
const reqMainboardHttp = useMainboardApi(manageSiteId).reqHttp
const reqForumHttp = useForumApi(manageSiteId).reqHttp
const reqPostHttp = usePostApi(manageSiteId).reqHttp

//编辑的时候的
const rulesEdit = ref({
  bbsId: [
    { required: true, message: 'bbs ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: 'bbs ID不符合标准', trigger: 'blur' }
  ],
  bbsName: [{ required: true, message: 'bbs名称不能为空', trigger: 'blur' }]
})

//提交
const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      if (imgUrl.value) {
        params.bbsIcon = imgUrl.value
      } else if (!fileList.value.length) {
        params.bbsIcon = null
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
const handleSuccess = (val: any) => {
  console.log('success')
  console.log(2, val, val.response?.path)
  imgUrl.value = val.response?.path
}

const handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 张头像`)
}

//面包屑相关
const handleChildrenList = async (row: any, index) => {
  let response: { success?: boolean; data?: any } = {}
  try {
    loadingChildren.value = true
    if (index == 0) {
      const { bbsId } = row
      breadcrumbOptions.value = mainboardOptions
      response = await reqMainboardHttp({ bbsId, page: 1, size: 999 } as GetMainboardRequest)
    } else if (index == 1) {
      const { mainboardId } = row
      breadcrumbOptions.value = forumOptions
      response = await reqForumHttp({ mainboardId, page: 1, size: 999 } as GetForumRequest)
      childrenHeaderList.value.push({ mainboardId })
    } else if (index == 2) {
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
      if (index == 2) {
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

//获取bbs信息
const reqBbsInfoObject = async (id) => {
  if (id) {
    childrenHeaderList.value = []
    try {
      let res = await queryHttp({ bbsId: id })
      if (res.success) {
        bbsInfo.value = { ...res.data }
        if (bbsInfo.value.bbsIcon) {
          const parts = bbsInfo.value.bbsIcon?.split('/')
          const lastPart = parts[parts.length - 1]
          fileList.value.push({ name: lastPart, url: VITE_CDN_URL + bbsInfo.value.bbsIcon })
        }
        childrenHeaderList.value.push({ bbsId: bbsInfo.value.bbsId })
        handleChildrenList(bbsInfo.value, 0)
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  } else {
  }
}

const openReq = () => {
  bbsId.value = modalData.value.bbsId
  reqBbsInfoObject(bbsId.value)
}

//关闭窗口
const closeTabs = () => {
  //isTabs.value = false
  modalsStore.hideModal('bbsSeriesModal')
  Object.assign(bbsInfo.value, initBbsInfo())
  fileList.value = []
  imgUrl.value = ''
}

const closeEditTab = () => {
  closeTabs()
  emit('refreshPage')
  // props?.searchFunk()
}

const rowAttrs = {
  gutter: 0,
  justify: 'center'
}

onMounted(() => {
  //console.log(2221, modalData)
})
</script>
