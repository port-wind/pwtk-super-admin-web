<template>
  <div v-if="isVisible" class="front-modal" :style="{ width: windowWidth + 'px', height: windowHeight + 'px' }">
    <el-tabs v-model="activeName" style="flex: 1; overflow: hidden; display: flex; flex-direction: column">
      <el-tab-pane
        label="帖子信息"
        name="first"
        class="m_tabs_pane"
        style="overflow: hidden; height: 100%; display: flex; flex-direction: column"
      >
        <div style="display: flex; flex-direction: column; flex: 1; overflow-y: auto; overflow-x: hidden" ref="tabRef">
          <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden" v-if="gamePage">
            <LotteryGameTypeEditor
              v-if="isContentFixed"
              @cancel="cancel"
              @gameOn="gameOn"
              :queryForm="postInfo"
              ref="gamePageRef"
              style="flex: 1"
            />
            <StaticGamePage
              v-if="!isContentFixed"
              @cancel="() => cancel(false)"
              :postPrediction="postPrediction"
              style="flex: 1"
            />
          </div>
          <el-row style="display: flex; flex-direction: column; position: relative" v-show="!gamePage">
            <el-row style="display: flex; flex-direction: row; margin: 10px 0">
              <el-col :span="13" style="flex: 1; padding: 0 0 0 10px">
                <BBSPostForm
                  :queryForm="postInfo"
                  :initial-form="initialForm"
                  ref="editFormRef"
                  v-loading="isLoading"
                  style="flex: 1"
                  :showLastContent="false"
                  mode="edit"
                />
              </el-col>
              <el-col :span="8" style="display: flex; flex-direction: row; justify-content: center">
                <PhoneFrame
                  v-if="isContentFixed"
                  :set-height="tabRef?.clientHeight < 710 ? 710 : tabRef?.clientHeight"
                  style="margin: 0 0 10px 0"
                >
                  <template #mainBody>
                    <LotteryGameContent :queryForm="postInfo" />
                  </template>
                </PhoneFrame>
                <PhoneFrame
                  v-else
                  :set-height="tabRef?.clientHeight < 710 ? 710 : tabRef?.clientHeight"
                  style="margin: 0 0 10px 0"
                >
                  <template #mainBody>
                    <div class="post-content-wrapper">
                      <el-form :model="postInfo" width="100%" label-width="auto">
                        <el-form-item label="帖子标题:" style="margin-bottom: 5px">
                          <el-input v-model="postInfo.title" :disabled="isEditContent" />
                        </el-form-item>
                        <el-form-item style="margin-bottom: 7px">
                          <section>
                            <span style="margin-right: 10px">帖子内容</span>
                            <div v-show="isShowButton" style="display: inline-block">
                              <el-button size="small" round @click="editPostContent('rich')">编辑</el-button>
                            </div>
                          </section>
                          <section style="width: 100%">
                            <div v-show="isEditContent" class="post-content-text resizable-content">
                              <div v-html="postInfo?.postContent || null"></div>
                            </div>
                            <div v-if="!isEditContent">
                              <TextEditor placeholder="请输入正文..." v-model="postContent!" mode="simple" />
                            </div>
                          </section>
                        </el-form-item>
                      </el-form>
                      <MediaPreview v-if="!isShowButton" :attachments="handledAttachments" class="post-media-preview" />
                      <div class="button-row" v-show="!isShowButton" style="justify-content: space-between">
                        <div style="display: flex; justify-content: space-between">
                          <mUpload
                            class="custom-upload"
                            :useDefault="true"
                            :uploadOption="uploadDataHead"
                            mute
                            :before-upload="beforeUpload"
                            @on-success="(val) => handleSuccessOfAttachment(val, 'h')"
                            @on-remove="handleRemove"
                            @on-exceed="handleExceed"
                            style="margin-right: 10px"
                          >
                            <template #uploadArea>
                              <el-button color="#409EFF" size="small" plain>
                                <el-icon><Upload /></el-icon>
                                上传附件
                              </el-button>
                            </template>
                          </mUpload>
                        </div>
                        <div style="display: flex; justify-content: space-between">
                          <!-- <el-button size="small" @click="closeEditorDialog">取消</el-button> -->
                          <el-button size="small" type="primary" @click="handleEditorSubmit">预览</el-button>
                        </div>
                      </div>
                      <section>
                        <el-form
                          style="display: flex; align-items: center; justify-content: space-between; width: 38%"
                          ref="mainReplyFormRef"
                          :rules="mainReplyRules"
                          :model="mainReplyForm"
                        >
                          <el-form-item
                            prop="replyUserId"
                            label="模拟用户"
                            :label-width="'85px'"
                            style="margin-bottom: 7px"
                          >
                            <SelectUserId
                              placeholder="用户ID"
                              :disabled="!!selectedUserId"
                              style="width: 220px"
                              id="userId"
                              v-model="mainReplyForm.replyUserId"
                            />
                          </el-form-item>
                          <el-form-item class="reply-actions" style="margin-left: 5px; margin-bottom: 7px">
                            <el-button size="small" @click="closeReply" v-if="!!selectedUserId">取消</el-button>
                            <el-button
                              type="primary"
                              size="small"
                              @click="submitReply"
                              v-else-if="mainReplyForm.replyUserId"
                            >
                              确认
                            </el-button>
                          </el-form-item>
                        </el-form>
                      </section>
                      <section class="outside-comment-list" v-if="computedPostId">
                        <comments-reply
                          :postId="computedPostId"
                          :postUserId="userId ?? ''"
                          :selectedUserId="selectedUserId"
                        ></comments-reply>
                      </section>
                    </div>
                  </template>
                </PhoneFrame>
              </el-col>
              <el-col :span="3">
                <div style="display: flex; justify-content: space-around; align-items: center" v-if="!!postPrediction">
                  <el-button type="primary" :icon="Trophy" color="#67C23A" style="color: white" @click="showGameInfo">
                    参赛信息
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-row>
          <!-- <AttachmentManage :queryForm="postInfo" /> -->
          <div style="height: 100%; display: flex" v-show="!gamePage && !isContentFixed">
            <!-- -----------------------------------------------------------------------------------------table部分----------------------------------------------------------------------------------------- -->
            <div style="height: 100%; display: flex; flex-direction: column; flex: 1">
              <m-table
                :options="attachmentOptions"
                :data="attachmentData"
                :isLoading="isLoading"
                isEditRow
                stripe
                :total="attachmentTotal"
                :currentPage="attachmentCurrentPage"
                :pageSize="attachmentPageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
                <template #attachmentId="{ scope }">
                  <!-- {{ scope.row }} -->
                  <el-image
                    v-if="scope.row.attachmentUrl"
                    style="width: 48px; height: 48px; object-fit: contain"
                    :src="VITE_CDN_URL + scope.row.attachmentUrl"
                    fit="cover"
                  ></el-image>
                </template>
                <template #prefixPostfixFlag="{ scope }">
                  <span style="margin-right: 10px">
                    {{ scope.row.prefixPostfixFlag === 'h' ? '在前面' : '在后面' }}
                  </span>
                  <el-switch
                    v-model="scope.row.prefixPostfixFlag"
                    :active-value="'h'"
                    :inactive-value="'t'"
                    :before-change="
                      () =>
                        statusChanged(scope.row, editAttachmentHttp, fetchAttachmentData, 'prefixPostfixFlag', {
                          activeValue: 'h',
                          inactiveValue: 't'
                        }) as any
                    "
                    class="custom-switch-prefix-postfix"
                  ></el-switch>
                </template>
                <template #attachmentStatus="{ scope }">
                  <span style="margin-right: 10px">
                    {{ scope.row.attachmentStatus === 'y' ? '启用' : '关闭' }}
                  </span>
                  <el-switch
                    v-model="scope.row.attachmentStatus"
                    :active-value="'y'"
                    :inactive-value="'n'"
                    :before-change="
                      () => statusChanged(scope.row, editAttachmentHttp, fetchAttachmentData, 'attachmentStatus') as any
                    "
                  ></el-switch>
                </template>
                <template #isView="{ scope }">
                  <span style="margin-right: 10px">
                    {{ scope.row.isView === 'y' ? '是' : '否' }}
                  </span>
                  <el-switch
                    v-model="scope.row.isView"
                    :active-value="'y'"
                    :inactive-value="'n'"
                    :before-change="() => statusChanged(scope.row, editAttachmentHttp, fetchAttachmentData, 'isView') as any"
                  ></el-switch>
                </template>
                <template #operate="{ scope }">
                  <el-button size="small" type="danger" plain @click="handleAttachmentDel(scope)">删除</el-button>
                </template>
              </m-table>
            </div>
          </div>
        </div>
        <section class="button-row dialog-footer-submit" v-if="!gamePage && isOperateShow">
          <el-button @click="closeTabs">取消</el-button>
          <el-button type="primary" @click="handleSubmit(editFormRef)">提交</el-button>
        </section>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'

import { Trophy } from '@element-plus/icons-vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { statusChanged } from '@/utils/table'
import { attachmentOptions } from '@/views/Bbs/bbsPostContentManagement/data'
import { getPostDetail, reqHttpBBsForumList, updateBbsPost } from '@/api/bss/postContentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { changeUploadDataWithCustom } from '@/utils/dataFormat'
import { resetCommentsState, useCommentsState } from '@/stores/commentsState'
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import mUpload from '@/components/mUpload/index.vue'
import commentsReply from '@/views/Bbs/bbsPostContentManagement/comments.vue'
import PhoneFrame from '@/views/Bbs/bbsPostContentManagement/phoneFrame.vue'

import { useModalsStore } from '@/stores/modalStore'
import type { FileType } from '@/api/system/upload/types'
import MediaPreview from '@/views/Bbs/bbsPostContentManagement/mediaPreview.vue'
import { getGameTypePlatformList } from '@/api/global/index'
import type { DetailPredictionData, IUpdateBbsPostQueryParams } from '@/api/bss/postContentManagement/types'
import { useParticipationLogic } from '@/views/Bbs/bbsPostContentManagement/new/components/useParticipationLogic'
// import i18n from '@/locales'

const { commentsState } = useCommentsState()

// const { t } = i18n.global as any
const gamePageRef = ref()
defineEmits(['refreshPage'])
const modalsStore = useModalsStore()
const modalData = computed(() => modalsStore.postScreenDetailModal.modalData || {})
const gamePage = ref(false)
const postPrediction = ref()
const isVisible = computed(() => modalsStore.postScreenDetailModal.isVisible)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)
const isOperateShow = computed(() => modalsStore.postScreenDetailModal.modalData?.isOperateShow || false)
// @ts-ignore
// eslint-disable-next-line no-undef
const { VITE_CDN_URL } = webConfigApi
const cachePostPrediction = ref<DetailPredictionData>()

const participationFlag = ref(false)

const isContentFixed = computed(() => {
  return postInfo.forumId === 'lottery'
})
//表单居中
const rowAttrs = {
  gutter: 0,
  justify: 'center'
}
const uploadDataHead = ref({
  fileType: 'img' as FileType,
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})

const initPostInfo = (): IUpdateBbsPostQueryParams => ({
  postId: '',
  forumId: '',
  postContent: '',
  postTime: '',
  postUserId: '',
  userId: '',
  enableAnonymous: 'y',
  postGameRef: '',
  postGametypeRef: '',
  postStatus: 'y',
  hasAttachment: 'n',
  viewFlag: 'a',
  isHot: 'n',
  isSelected: 'n',
  isTop: 'n',
  isRecommended: 'n',
  isBloom: 'n',
  title: '',
  attachments: []
})

const postInfo = reactive<IUpdateBbsPostQueryParams>(initPostInfo())
const initialForm = reactive<IUpdateBbsPostQueryParams>(initPostInfo())
const postId = ref()
const { loadLotteryContentByPredictionsStrategy } = useParticipationLogic(postInfo)
const activeName = ref('first') //tab默认显示
const isLoading = ref(false)
const gameTypeList = ref()

// 帖子内容相关
const edit = ref()
const contentMode = ref(false) //true 源码 false 富文本
const isEditContent = ref(false) //true 预览 false 编辑
const isShowButton = ref(false) //true 编辑按钮 false 提交取消按钮
const postContent = computed({
  get: () => postInfo.postContent,
  set: (value) => {
    postInfo.postContent = value
  }
}) //源码编辑内容

//图片地址
const imgUrl = ref('')
const fileList = ref<any[]>([])
const fileUrl = ref()

//上传相关
const fileType = ref()
const computedPostId = computed(() => postInfo?.postId || '')
const uploadData = ref({
  fileType: 'img',
  uploadFrom: 'bbs/forum/attachment',
  storageStyle: 6
})

//评论
const selectedUserId = ref()
const mainReplyFormRef = ref()
const tabRef = ref()
const editFormRef = ref()
const userId = computed(() => mainReplyForm?.replyUserId)
const mainReplyForm = reactive({
  replyUserId: ''
})

//附件相关
const attachmentData = ref<any[]>([])
const isDisabled = ref(true)
const dialogThirdFormData = ref()
const attachmentFormMode = ref<string>('add')
const handledAttachments = computed(() => {
  return attachmentData.value.map((item) => {
    return {
      url: item.attachmentUrl,
      fileType: item.attachmentType
    }
  })
})
//附件页码
const attachmentCurrentPage = ref(1)
const attachmentPageSize = ref(15)
const attachmentTotal = ref(0)

const initAddAttachmentForm = {
  attachmentId: '',
  attachmentType: 'p',
  attachmentStatus: 'y',
  isView: 'y',
  postUserId: '',
  prefixPostfixFlag: 'h',
  attachmentUrl: ''
}

const mainReplyRules = ref({
  replyUserId: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})

//分页的每一页数据变化
const handleSizeChange = (val: number) => {
  attachmentCurrentPage.value = Math.ceil(((attachmentCurrentPage.value - 1) * attachmentPageSize.value + 1) / val)
  attachmentPageSize.value = val
  fetchAttachmentData()
}

//分页页数改变
const handleCurrentChange = (val: number) => {
  attachmentCurrentPage.value = val
  fetchAttachmentData()
}

//提交
const handleSubmit = async (formEl: FormInstance | undefined) => {
  const { valid, fields } = await editFormRef.value!.validateForm()
  if (valid) {
    const params = postInfo
    try {
      const response = await updateBbsPost(params)
      if (response.success) {
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
}

//富文本按钮的隐藏显示
const editPostContent = (mode) => {
  if (mode == 'code') {
    contentMode.value = true
  } else {
    contentMode.value = false
    edit.value?.txt?.text(postInfo.postContent)
  }
  isEditContent.value = false
  isShowButton.value = false
}

//富文本提交
const handleEditorSubmit = async () => {
  postInfo.postContent = postContent.value
  isEditContent.value = true //true 预览 false 编辑
  isShowButton.value = true //true 编辑按钮 false 提交取消按钮
}

//关闭回复
const closeReply = () => {
  resetCommentsState({ subjectName: 'post' })
  selectedUserId.value = ''
  mainReplyForm.replyUserId = ''
  commentsState.disabledAction = true
}

//重置回复按钮
const resetMainReplyForm = () => {
  mainReplyForm.replyUserId = ''
  selectedUserId.value = ''
  resetCommentsState({ subjectName: 'post' })
}

//提交回复
const submitReply = () => {
  mainReplyFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      resetCommentsState({ subjectName: 'post' })
      selectedUserId.value = mainReplyForm.replyUserId
      commentsState.disabledAction = false
      commentsState.selectedUserId = mainReplyForm.replyUserId
    } else {
      console.log('表单验证失败')
    }
  })
}

const handleSuccessOfAttachment = async (val, prefixPostfixFlag) => {
  if (attachmentTotal.value >= 9) {
    ElMessage.warning('附件数量已达上限')
    return
  }
  const { raw } = val.file
  const result = changeUploadDataWithCustom(raw.type, '')
  uploadData.value = result.uploadData
  fileType.value = result.fileType

  const attachmentUrl = val.response.path
  const params = {
    attachmentUrl,
    forumPostId: postInfo.postId,
    isView: 'y',
    attachmentStatus: 'y',
    attachmentType: fileType.value,
    prefixPostfixFlag
  }
  try {
    const response = await addAttachmentHttp(params)

    if (response.success) {
      ElMessage.success('新增成功')
      fetchAttachmentData() // 保存成功后重新获取数据
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

//附件初始化获取数据
const fetchAttachmentData = async () => {
  const params = {
    page: attachmentCurrentPage.value,
    size: attachmentPageSize.value,
    forumPostId: postInfo.postId
  }
  isLoading.value = true
  try {
    const response = await reqAttachmentHttp(params)
    if (response.success) {
      postInfo.attachments = response.data.list
      attachmentData.value = response.data.list
      attachmentTotal.value = Number(response.data.total)
    } else {
      postInfo.attachments = []
      attachmentData.value = []
      attachmentTotal.value = 0
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}

//附件删除
const handleAttachmentDel = (scope: any) => {
  ElMessageBox.confirm('当您点击确定按钮后, 这些资源将会被彻底删除, 如果其包含子资源, 也将一并删除', '警告', {
    confirmButtonText: '确定',
    cancelButtonClass: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const { attachmentId } = scope.row
      const response = await delAttachmentHttp({ attachmentId })
      if (response.success) {
        fetchAttachmentData() // 保存成功后重新获取数据
        dialogThirdFormData.value = cloneDeep(initAddAttachmentForm)
        isDisabled.value = true
        fileList.value = []
      } else {
        showErrorMessage(response)
      }
    } catch (error) {
      console.error('Error saving data:', error)
    }
  })
}

//上传
const beforeUpload = (val: any) => {
  // @ts-ignore
  uploadDataHead.value = changeUploadDataWithCustom(val.type, '').uploadData
}

const handleExceed = (val: any) => {
  console.log('handleExceed', val)
  ElMessage.warning(`只可以上传 ${val.files.length} 个文件`)
}

const handleRemove = (val: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}

//获取帖子信息
const reqPostInfoObject = async (id) => {
  if (id) {
    try {
      const res = await reqHttpBBsForumList({ postId: id, page: 1, size: 1 })
      if (res.success) {
        Object.assign(postInfo, res.data?.list[0])
        postInfo.userId = postInfo.postUserId
        // postInfo = { ...res.data?.list[0] }
        if (!postInfo.title) {
          if (postInfo.postContent) {
            postInfo.title = postInfo.postContent.slice(0, 10)
          } else {
            postInfo.title = '帖子标题'
          }
        }
        commentsState.disabledAction = true
        resetMainReplyForm()
        attachmentFormMode.value = 'add'
        fetchAttachmentData()
      } else {
        showErrorMessage(res)
      }
    } catch (err) {
      console.log('Error saving data:', err)
    }
  }
}

//关闭窗口
const closeTabs = () => {
  modalsStore.hideModal('postScreenDetailModal')
  Object.assign(postInfo, initPostInfo())
}

const closeEditTab = () => {
  closeTabs()
  edit?.value?.destroy()
}

const gameOn = async (state: any) => {
  console.log('gameOn', postInfo)
  participationFlag.value = true
  gamePage.value = false
  postInfo.predictionMode = state.predictionMode
  postInfo.predictions = state.predictions
  postInfo.postContent = await loadLotteryContentByPredictionsStrategy(
    postInfo.predictions!,
    postInfo.forumId!,
    postInfo.postContent!
  )
}
const cancel = async (reload = true) => {
  gamePage.value = false
}
watch(
  () => postInfo.userId,
  (value) => {
    postInfo.postUserId = value
  }
)
const showGameInfo = async () => {
  gamePage.value = true
}
onMounted(async () => {
  postId.value = modalData.value.postId
  try {
    const response = await getGameTypePlatformList({ page: 1, size: 999 })
    if (response.success) {
      gameTypeList.value =
        response.data?.list?.map((item) => ({
          label: item.gameTypeName,
          value: item.gameType
        })) || []
    }
    await reqPostInfoObject(postId.value)
    const res = await getPostDetail({ postId: postId.value })
    if (res.success) {
      console.log('res.data:', res.data)
      const postPredictions = res.data?.postPredictions
      if (postPredictions) {
        postPrediction.value = {
          ...postPredictions,
          gameTypeName: res.data?.gameTypeName,
          postYear: res.data.postYear,
          postIssue: res.data.postIssue
        }
        await nextTick()
        if (res.data.forumId === 'lottery') {
          postInfo.postPrediction = postPrediction.value
          cachePostPrediction.value = JSON.parse(JSON.stringify(postInfo.postPrediction))
        }
      }
      if (res.data?.viewFlag) {
        postInfo.viewFlag = res.data?.viewFlag
      }
      postInfo.predictionMode = res?.data?.postPredictions?.code
      postInfo.predictions = res?.data?.postPredictions?.predictionDTOList || []
    } else {
      showErrorMessage(res)
      console.error('Error fetching post detail:', res)
    }
  } catch (error) {
    console.error('Error fetching game types:', error)
  }
})
</script>

<style scoped lang="less">
/* Optional: Add some padding or other styles as needed */
.front-modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__nav-scroll) {
  display: flex;
  justify-content: center;
}
:deep(.m_tabs) {
  display: flex;
  flex-direction: column;
}
:deep(.el-tabs__content) {
  flex: 1;
}
.post-content-text {
  height: 100px;
  border: 1px solid #999;
  padding: 0 10px;
  margin-top: 5px;
  overflow: auto;
}
.phoneAll {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .post-content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    .outside-comment-list {
      display: flex;
      flex-direction: column;
      :deep(.comment-list) {
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}
:deep(.custom-switch-prefix-postfix) {
  --el-switch-on-color: #4eb1f3 !important;
  --el-switch-off-color: #4eb1f3 !important;
}
.post-media-preview {
  :deep(.media-item) {
    width: 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
:deep(.w-e-text-container) {
  height: 150px !important;
}
.resizable-content {
  width: 100%;
  overflow: auto;
  resize: vertical;
  padding: 10px;
  border: 1px solid #ccc;
}
.submit-wrapper-post {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-top: 10px;
}
.custom-upload {
  .el-upload--picture-card {
    height: 4rem;
    width: 4rem;
  }
}
</style>
