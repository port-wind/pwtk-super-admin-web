<template>
  <section id="system_account" class="dialogEdit">
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
      <mTabPane label="论坛">
        <div class="m-level-table-outside">
          <m-form
            ref="editForm"
            :file-list="fileList"
            :modelForm="forumInfo"
            :options="editBbsForumOptions"
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
                    {{ item.forumId }}
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
                :options="postOptions"
                :data="childrenListTableData"
                isEditRow
                :isLoading="loadingChildren"
                stripe
                size="small"
              >
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
import { useForumApi } from '@/api/bss/forumManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'

//数据
import { editBbsForumOptions, postOptions } from '@/views/Bbs/bbsForum/data'

//面包屑相关
import { ArrowRight } from '@element-plus/icons-vue'
import { usePostApi } from '@/api/bss/postContentManagement/index'

//上传相关
import type { UploadUserFile } from 'element-plus'

const { VITE_CDN_URL } = webConfigApi

import { computed } from 'vue'
import { useModalsStore } from '@/stores/modalStore'

const emit = defineEmits(['refreshPage'])

const modalsStore = useModalsStore()

const isVisible = computed(() => modalsStore.forumSeriesModal.isVisible)
const modalData = computed(() => modalsStore.forumSeriesModal.modalData || {})
const isOperateShow = computed(() => modalsStore.forumSeriesModal.modalData?.isOperateShow || false)
const manageSiteId = computed(() => modalsStore.forumSeriesModal.modalData?.manageSiteId || '')

// const props = defineProps({
//   forumId: {
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

const initForumInfo = () => ({
  forumId: '',
  forumName: '',
  forumCategory: '',
  createTime: null,
  forumIcon: '',
  forumStatus: 'y',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isBloom: 'n'
})

const forumInfo = ref(initForumInfo())
const forumId = ref()

//图片地址
const imgUrl = ref('')
const fileList = ref<UploadUserFile[]>([])

//上传参数
const uploadData = {
  fileType: 'img',
  uploadFrom: 'bbs/forum/icon',
  storageStyle: 6
}

//面包屑相关
const childrenHeaderList = ref()
const childrenListTableData = ref()
const loadingChildren = ref(false)

const { editHttp, queryHttp } = useForumApi(manageSiteId)
const reqPostHttp = usePostApi(manageSiteId).reqHttp

//编辑的时候的
const rulesEdit = ref({
  mainboardId: [
    { required: true, message: '主板ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '主板ID不符合标准', trigger: 'blur' }
  ],
  forumId: [
    { required: true, message: '论坛ID不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]*$/, message: '论坛ID不符合标准', trigger: 'blur' }
  ],
  forumName: [{ required: true, message: '论坛名称不能为空', trigger: 'blur' }],
    sortNum: [
    { required: true, message: '排序编号不能为空', trigger: 'blur' },
    { pattern: /^[0-9]*$/, message: '排序编号必须为数字', trigger: 'blur' }
  ]
})

const handleSubmit = async (scope) => {
  scope.form.validate(async (valid, fields) => {
    if (valid) {
      const row = scope.model
      let params = row
      if (imgUrl.value) {
        params.forumIcon = imgUrl.value
      } else if (!fileList.value.length) {
        params.forumIcon = null
      }
      // return
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
      const { forumId } = row
      response = await reqPostHttp({ forumId, page: 1, size: 999 })
    } else {
      return
    }
    if (response?.success) {
      childrenHeaderList.value.splice(index + 1)
      childrenListTableData.value = []
      childrenListTableData.value = response.data.list
      if (index == 0) {
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
const reqForumInfoObject = async (id) => {
  if (id) {
    childrenHeaderList.value = []
    try {
      let res = await queryHttp({ forumId: id })
      if (res.success) {
        forumInfo.value = { ...res.data }
        if (forumInfo.value.forumIcon) {
          const parts = forumInfo.value.forumIcon?.split('/')
          const lastPart = parts[parts.length - 1]
          fileList.value.push({
            name: lastPart,
            url: VITE_CDN_URL + forumInfo.value.forumIcon
          })
        }
        childrenHeaderList.value.push({ forumId: forumInfo.value.forumId })
        handleChildrenList(forumInfo.value, 0)
      } else {
        showErrorMessage(res)
      }
    } catch (err) {}
  } else {
  }
}

const openReq = () => {
  //console.log('id is ', mainboardId.value, props)
  forumId.value = modalData.value.forumId
  reqForumInfoObject(forumId.value)
}

//关闭窗口
const closeTabs = () => {
  modalsStore.hideModal('forumSeriesModal')
  Object.assign(forumInfo.value, initForumInfo())
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
