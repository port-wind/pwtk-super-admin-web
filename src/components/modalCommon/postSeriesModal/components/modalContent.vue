<template>
  <div style="display: flex; flex-direction: column; flex: 1; overflow-y: auto; overflow-x: hidden" ref="tabRef">
    <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden" v-if="gamePage">
      <LotteryGameTypeEditor
        v-if="isLotteryContent"
        @cancel="cancel"
        @gameOn="gameOn"
        :queryForm="postInfo"
        ref="gamePageRef"
        style="flex: 1"
      />
      <StaticGamePage v-if="!isLotteryContent" @cancel="cancel" :postPrediction="postPrediction" style="flex: 1" />
    </div>
    <el-row style="display: flex; flex-direction: column; position: relative" v-show="!gamePage">
      <el-row style="display: flex; flex-direction: row; margin: 10px 0">
        <el-col :span="13" style="flex: 1; padding: 0 0 0 10px; position: relative">
          <BBSPostForm
            :queryForm="postInfo"
            :initial-form="initialForm"
            ref="editFormRef"
            v-loading="isLoading"
            style="flex: 1"
            :showLastContent="false"
            mode="edit"
          />
          <div class="competition-btn">
            <div style="display: flex; justify-content: space-around; align-items: center" v-if="!!postPrediction">
              <el-button type="primary" :icon="Trophy" color="#67C23A" style="color: white" @click="showGameInfo">
                参赛信息
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="11" style="display: flex; flex-direction: row; justify-content: center">
          <PhoneFrame
            v-if="isLotteryContent"
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
                        <TextEditor
                          placeholder="请输入正文..."
                          v-model="postContent!"
                          mode="simple"
                          style="height: 500px"
                        />
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
                    <el-form-item prop="replyUserId" label="模拟用户" :label-width="'85px'" style="margin-bottom: 7px">
                      <SelectUserIdAndNickname
                        v-model="mainReplyForm.replyUserId"
                        :disabled="!!selectedUserId"
                        id="userId"
                        :group="['nickname', 'loginId']"
                        placeholder="用户昵称｜帐号"
                        style="width: 220px"
                      />
                    </el-form-item>
                    <el-form-item class="reply-actions" style="margin-left: 5px; margin-bottom: 7px">
                      <el-button size="small" @click="closeReply" v-if="!!selectedUserId">取消</el-button>
                      <el-button type="primary" size="small" @click="submitReply" v-else-if="mainReplyForm.replyUserId">
                        确认
                      </el-button>
                    </el-form-item>
                  </el-form>
                </section>
                <section class="outside-comment-list" v-if="computedPostId">
                  <post-comments
                    :postId="computedPostId"
                    :forumId="postInfo.forumId!"
                    :postUserId="userId ?? ''"
                    :selectedUserId="selectedUserId"
                    :disabledAction="disabledAction"
                  />
                </section>
              </div>
            </template>
          </PhoneFrame>
        </el-col>
      </el-row>
    </el-row>
    <!-- <AttachmentManage :queryForm="postInfo" /> -->
    <div style="height: 100%; display: flex" v-show="!gamePage && !isLotteryContent">
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
</template>
<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { Trophy } from '@element-plus/icons-vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { statusChanged } from '@/utils/table'
import { attachmentOptions } from '@/views/Bbs/bbsPostContentManagement/data'
import {
  getPostDetail,
  getPostPredictionRules,
  reqHttpBBsForumList,
  updateBbsPost
} from '@/api/bss/postContentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { changeUploadDataWithCustom } from '@/utils/dataFormat'
import {
  reqHttp as reqAttachmentHttp,
  addHttp as addAttachmentHttp,
  delHttp as delAttachmentHttp,
  editHttp as editAttachmentHttp
} from '@/api/bss/attachmentManagement/index'
import mUpload from '@/components/mUpload/index.vue'
import PhoneFrame from '@/views/Bbs/bbsPostContentManagement/phoneFrame.vue'

import type { FileType } from '@/api/system/upload/types'
import MediaPreview from '@/views/Bbs/bbsPostContentManagement/mediaPreview.vue'
import { getGameTypePlatformList } from '@/api/global/index'
import type { IUpdateBbsPostQueryParams } from '@/api/bss/postContentManagement/types'
import i18n from '@/locales'
import { usePostGameUtilLogic } from '@/views/Bbs/bbsPostContentManagement/new/components/usePostGameUtilLogic'

const props = defineProps({
  modalData: {
    type: Object,
    default: () => ({})
  }
})
const disabledAction = ref(true)
const { t } = i18n.global as any
const gamePageRef = ref()
const emit = defineEmits(['close', 'submit'])
const gamePage = ref(false)
const postPrediction = ref()
const isOperateShow = computed(() => props.modalData?.isOperateShow || false)
// eslint-disable-next-line no-undef
const { VITE_CDN_URL } = webConfigApi
const participationFlag = ref(false)

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
const isLotteryContent = computed(() => {
  return postInfo.forumId === 'lottery'
})
const postId = ref()
const { loadLotteryContentByPredictionsStrategy } = usePostGameUtilLogic()
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
const fileList = ref<any[]>([])

//上传相关
const fileType = ref()
const computedPostId = computed(() => postInfo?.postId || '')

//评论
const selectedUserId = ref()
const mainReplyFormRef = ref()
const tabRef = ref()
const editFormRef = ref()
const mainReplyForm = reactive({
  replyUserId: ''
})
const userId = computed(() => mainReplyForm?.replyUserId)

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
      postInfo.attachments = response.data?.list
      attachmentData.value = response.data?.list!
      attachmentTotal.value = Number(response.data?.total)
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
//关闭窗口
const closeTabs = () => {
  emit('close')
  Object.assign(postInfo, initPostInfo())
}
//提交
const handleSubmit = async (_: FormInstance | undefined) => {
  const { valid } = await editFormRef.value!.validateForm()
  if (valid) {
    const params = postInfo
    const res = await getPostPredictionRules({
      gameType: postInfo.postGametypeRef!,
      forumId: postInfo.forumId!
    })
    if (res.success && res.data && res.data.length > 0) {
      const dicList = res.data![0].playRules
      if (dicList && postInfo.predictions && postInfo.predictions.length > 0 && isLotteryContent.value) {
        params.predictions = postInfo.predictions?.map((item, index) => {
          const dic = dicList[index]
          return {
            ...item,
            // @ts-ignore
            code: dic?.code,
            name: dic?.name,
            // @ts-ignore
            playTypeCode: dic?.code
          }
        })
      }
    }
    try {
      const response = await updateBbsPost(params)
      if (response.success) {
        closeTabs()
        ElMessage.success('提交成功')
        emit('submit')
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
  if (mode === 'code') {
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
  selectedUserId.value = ''
  mainReplyForm.replyUserId = ''
  disabledAction.value = true
}

//重置回复按钮
const resetMainReplyForm = () => {
  mainReplyForm.replyUserId = ''
  selectedUserId.value = ''
}

//提交回复
const submitReply = () => {
  mainReplyFormRef.value.validate(async (valid) => {
    if (valid) {
      selectedUserId.value = mainReplyForm.replyUserId
      disabledAction.value = false
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

//附件删除
const handleAttachmentDel = (scope: any) => {
  ElMessageBox.confirm(t('pop.areyousurepage'), t('pop.warn'), {
    confirmButtonText: t('button.determine'),
    cancelButtonClass: t('button.cancel'),
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

const handleRemove = (_: any) => {
  dialogThirdFormData.value.attachmentUrl = ''
}

//获取帖子信息
const reqPostInfoObject = async () => {
  postInfo.userId = postInfo.postUserId
  // postInfo = { ...res.data?.list[0] }
  if (!postInfo.title) {
    if (postInfo.postContent) {
      postInfo.title = postInfo.postContent.slice(0, 10)
    } else {
      postInfo.title = '帖子标题'
    }
  }
  disabledAction.value = true
  resetMainReplyForm()
  attachmentFormMode.value = 'add'
  fetchAttachmentData()
}

const gameOn = async (state: any) => {
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
const cancel = async () => {
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
  postId.value = props.modalData.postId
  try {
    const response = await getGameTypePlatformList({ page: 1, size: 999 })
    if (response.success) {
      gameTypeList.value =
        response.data?.list?.map((item) => ({
          label: item.gameTypeName,
          value: item.gameType
        })) || []
    }
    const res = await getPostDetail({ postId: postId.value })
    if (res.success) {
      console.log('res.data:', res.data)
      Object.assign(postInfo, res.data)
      const singlePostInfo = await reqHttpBBsForumList({ postId: postId.value, page: 1, size: 1 })
      if (singlePostInfo.success) {
        postInfo.forumName = singlePostInfo.data?.list[0].forumName
      }
      await reqPostInfoObject()

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
        }
      }
      if (res.data?.viewFlag) {
        postInfo.viewFlag = res.data?.viewFlag
      }
      postInfo.predictionMode = res?.data?.postPredictions?.code
      postInfo.predictions = res?.data?.postPredictions?.predictionDTOList || []
      const dicRes = await getPostPredictionRules({
        gameType: postInfo.postGametypeRef!,
        forumId: postInfo.forumId!
      })
      if (dicRes.success && dicRes.data && dicRes.data.length > 0) {
        const dicList = dicRes.data![0].playRules
        if (dicList && postInfo.predictions && postInfo.predictions.length > 0 && isLotteryContent.value) {
          postInfo.predictions = postInfo.predictions?.map((item, index) => {
            const dic = dicList[index]
            return {
              ...item,
              // @ts-ignore
              code: dic?.code,
              name: dic?.name,
              // @ts-ignore
              playTypeCode: dic?.code
            }
          })
        }
      }
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
.competition-btn {
  position: absolute;
  top: 0;
  right: 10px;
}
</style>
