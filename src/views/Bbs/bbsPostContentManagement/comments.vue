<template>
  <section>
    <section style="display: inline-flex; justify-content: space-between; margin-bottom: 5px">
      <el-button @click="handleReplyMain" size="small" :disabled="commentsState.disabledAction">
        {{ postType === 'a' ? '发布评论' : '回复帖子' }}
      </el-button>
      <section
        style="
          display: inline-flex;
          width: 80px;
          justify-content: space-between;
          align-items: center;
          margin-left: 10px;
        "
      >
        <IconToggle
          :inactive-icon="Star"
          :active-icon="StarFilled"
          alt-text="Star"
          inactive-color="default"
          active-color="star-filled"
          :initialState="starActive"
          @update:initialState="(e) => toggleStar(e)"
          :postType="postType"
        />
        <IconToggle
          :inactive-icon="ThumbUpLine"
          :active-icon="ThumbUpFill"
          alt-text="Thumb Up"
          inactive-color="default"
          active-color="thumb-up"
          :initialState="thumbUpActive"
          @update:initialState="(e) => handleThumbUpToggle(e)"
          :loading="isThumbLoading"
          :postType="postType"
        />
        <IconToggle
          :inactive-icon="ThumbDownLine"
          :active-icon="ThumbDownFill"
          alt-text="Thumb Down"
          inactive-color="default"
          active-color="thumb-down"
          :initialState="thumbDownActive"
          @update:initialState="(e) => handleThumbDownToggle(e)"
          :loading="isThumbLoading"
          :postType="postType"
        />
      </section>
    </section>

    <CommentForm
      v-if="commentsState.showMainReplyForm"
      :fileList="commentsState.fileList"
      :options="options"
      :replyRules="replyRules"
      :uploadData="uploadData"
      @remove="handleRemove"
      @before-upload="beforeUpload"
      @success="handleSuccess"
      @cancel="closeReplyMain"
      @submit="reply"
    />
  </section>
  <el-divider style="margin: 0" />
  <div class="comment-list">
    <div v-for="comment in commentsState.comments" :key="comment.postId" class="comment">
      <div class="avatar">
        <el-image
          :src="VITE_CDN_URL + comment.avatar"
          alt="avatar"
          style="width: 40px; height: 40px; border-radius: 50%"
        />
      </div>
      <div class="comment-content">
        <CommentItem
          :comment="comment"
          :date-form="dateForm"
          :postType="postType"
          :selectedUserId="props.selectedUserId"
          @reply="handleReplyOpen"
        />
        <CommentForm
          v-if="comment.isReplyContent"
          :fileList="commentsState.fileList"
          :options="options"
          :uploadData="uploadData"
          :replyRules="replyRules"
          :postType="postType"
          @remove="handleRemove"
          @before-upload="beforeUpload"
          @success="handleSuccess"
          @cancel="() => closeReplyInput(comment)"
          @submit="(scope) => replyForChild(scope, comment)"
        />
        <div class="children" v-if="comment.showChildren">
          <div v-for="reply in comment.replies" :key="reply.postId" class="reply-comment">
            <section style="display: flex">
              <div class="avatar">
                <el-image
                  :src="VITE_CDN_URL + reply.avatar"
                  alt="avatar"
                  x
                  style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #d7dfe6; margin-right: 10px"
                />
              </div>
              <CommentItem
                :comment="reply"
                :date-form="dateForm"
                :postType="postType"
                :selectedUserId="props.selectedUserId"
                @reply="(r) => handleChildReplyOpen(r, reply, comment)"
              />
            </section>

            <CommentForm
              v-if="reply.isReplyContent"
              :fileList="commentsState.fileList"
              :options="options"
              :uploadData="uploadData"
              :replyRules="replyRules"
              @remove="handleRemove"
              @before-upload="beforeUpload"
              @success="handleSuccess"
              @cancel="(scope) => closeChildReplyInput(scope, comment.replies)"
              @submit="(scope) => replyForLeaf(scope, reply, comment)"
            />
          </div>
        </div>
        <span v-if="hasMoreReplies(comment)" class="text-plain" @click="loadMoreReplies(comment)">
          {{ `展开${getRemainingRepliesCount(comment)}条回复` }}
        </span>
      </div>
    </div>
    <el-button v-if="hasMoreComments" class="show-more-btn" @click="loadMoreComments">查看更多</el-button>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ElButton, ElImage, UploadUserFile } from 'element-plus'
import { CommonData } from '@/components/mComment/types'
import {
  addReplyHttp,
  cancelFavoriteHttp,
  dislikeHttp,
  favoriteHttp,
  likeHttp,
  reqTreeHttp
} from '@/api/bss/postContentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import ThumbDownFill from '@/assets/images/ri--thumb-down-fill.svg'
import ThumbUpFill from '@/assets/images/ri--thumb-up-fill.svg'
import ThumbUpLine from '@/assets/images/ri--thumb-up-line.svg'
import ThumbDownLine from '@/assets/images/ri--thumb-down-line.svg'
import StarFilled from '@/assets/images/ph--star-fill.svg'
import Star from '@/assets/images/ph--star-light.svg'
import { FormOptions } from '@/components/mForm/types'
import { changeUploadData } from '@/utils/dataFormat'
import { useIssuesApi } from '@/api/photoSys/issues/index'
import { clearFileList, useCommentsState } from '@/stores/commentsState'
import { useModalsStore } from '@/stores/modalStore'
import { getIpData } from '@/api/index'
import { usePhotoGroupState } from '@/stores/photoGroupState'
const testData = {
  postId: '10033',
  postContent: '接口api开发中,当前仅展示测试数据',
  postTime: '1719464400000',
  // @ts-ignore
  postUserId: '12702801985829601331',
  postThreadSeq: 0,
  likeCount: '73',
  favoriteCount: '20',
  threadCount: '5',
  readCount: '200',
  enableAnonymous: 'y',
  viewFlag: 'u',
  postYear: '2024',
  postIssue: 'issue3',
  hasAttachment: 'y',
  postStatus: 'n',
  forumName: '论坛2',
  lastEditTime: 1724791236000,
  userMakeNoSenseCount: 13,
  avatar: 'devmedia/pwtk/user/avatar/24/08/13/23f5f30ec819451dbeb9aceef3b740ce.jpeg',
  nickname: 'TestUser',
  replies: [],
  attachments: [
    {
      fileType: 'p',
      url: 'devmedia/pwtk/bbs/article/24/08/07/5be0d8b588f64b77bbd2a7834fb34cb0.jpeg'
    }
  ],
  childrenSize: 0,
  likeStatus: 'n'
}
const { VITE_PROXY_UPLOAD, VITE_SERVER_CALLBACK, VITE_CDN_URL, VITE_STORY_TYPE } = webConfigApi
const dateForm = 'yyyy-MM-dd HH:mm:ss'
const uploadData = {
  fileType: 'ico',
  uploadFrom: 'bbs/6',
  storageStyle: 6
}
const isThumbLoading = ref(false)

const props = defineProps({
  postId: { type: String, required: true },
  postUserId: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  selectedUserId: { type: String, default: '' },
  postType: { type: String, default: 'p' },
  imageExplainId: { type: String, default: null },
  operationTypeFlag: { type: String, default: 't' }
})
const postType = computed(() => props.postType)
const imageExplainId = computed(() => props.imageExplainId)
const { photoGroupState: commentsState } =
  postType.value === 'a' ? usePhotoGroupState() : { photoGroupState: useCommentsState().commentsState }

const modalsStore = useModalsStore()
const {
  cancelStarIssuePost,
  dislikeIssuePost,
  getNewspaperIssuePostList,
  likeIssuePost,
  replyIssuePost,
  starIssuePost
} = useIssuesApi(postType, imageExplainId)
watch(
  () => props.selectedUserId,
  (newVal) => {
    initComments()
  }
)
const reqListTree = computed(() => {
  return commentsState.subjectName === 'post' ? reqTreeHttp : getNewspaperIssuePostList
})
const reqLike = computed(() => {
  return commentsState.subjectName === 'post' ? likeHttp : likeIssuePost
})
const reqDislike = computed(() => {
  return commentsState.subjectName === 'post' ? dislikeHttp : dislikeIssuePost
})
const reqStar = computed(() => {
  return commentsState.subjectName === 'post' ? favoriteHttp : starIssuePost
})
const reqCancelStar = computed(() => {
  return commentsState.subjectName === 'post' ? cancelFavoriteHttp : cancelStarIssuePost
})
const reqSubmitReply = computed(() => {
  return commentsState.subjectName === 'post' ? addReplyHttp : replyIssuePost
})
const hasMoreComments = computed(() => commentsState.total > commentsState.comments.length)
const starActive = ref(false)
const thumbUpActive = ref(false)
const thumbDownActive = ref(false)

const replyRules = {
  replyContent: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
}

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

// Pure functions
const transformComment = (comment: CommonData) => ({
  ...comment,
  replies: [],
  showChildren: false,
  isReplyContent: false,
  likeStatus: comment.likeStatus ?? 'n',
  dislikeStatus: comment.dislikeStatus ?? 'n',
  repliesPage: 0,
  repliesPageSize: 15,
  repliesTotal: Number(comment.childrenSize ?? 0),
  attachments: comment.attachments || []
})

// Pure functions for updating comments
const appendComments = (oldComments: any[], newComments: any[]) => [...oldComments, ...newComments]

const replaceComments = (_oldComments: any[], newComments: any[]) => newComments

const prependComment = (oldComments: any[], newComment: any) => [newComment, ...oldComments]

const replaceLastNWithPagination = (page: number, size: number) => (oldComments: any[], newComments: any[]) => {
  const keepCount = oldComments.length - Math.max(0, oldComments.length - (page - 1) * size)
  console.log(keepCount)

  return [...oldComments.slice(0, keepCount), ...newComments]
}

// Higher-order function to select the update strategy
const updateComments = (
  updateType: 'append' | 'replace' | 'replaceLastN' | 'prepend',
  page?: number,
  size?: number
) => {
  switch (updateType) {
    case 'append':
      return appendComments
    case 'replace':
      return replaceComments
    case 'replaceLastN':
      if (typeof page !== 'number' || typeof size !== 'number' || page <= 0 || size <= 0) {
        return () => []
      }
      return replaceLastNWithPagination(page, size)
    case 'prepend':
      return prependComment
    default:
      throw new Error('Invalid update type')
  }
}

const loadComments = async (updateType: 'append' | 'replace' | 'replaceLastN') => {
  if (!props.postId && commentsState.subjectName === 'post') return
  console.log('loadComments')
  try {
    const response = await reqListTree.value({
      selectedUserId: props.selectedUserId,
      postId: props.postId,
      page: commentsState.currentPage,
      size: commentsState.pageSize,
      postYear: commentsState.postYear,
      postIssue: commentsState.postIssue,
      issueId: commentsState.issueId
    })
    if (!response.success) {
      showErrorMessage(response)
      return
    }
    const data = response.data
    const newComments = data?.replies?.map(transformComment) || []
    console.log('response.data.postUserId', response.data.postUserId)

    commentsState.total = Number(data.childrenSize)
    const updateStrategy = updateComments(updateType, commentsState.currentPage, commentsState.pageSize)
    commentsState.comments = updateStrategy(commentsState.comments, newComments)
  } catch (error) {
    showErrorMessage(error)
  }
}

const initComments = async () => {
  if (!props.postId && commentsState.subjectName === 'post') return
  console.log('initComments')
  commentsState.postId = props.postId
  try {
    const response = await reqListTree.value({
      selectedUserId: props.selectedUserId,
      postId: props.postId,
      page: commentsState.currentPage,
      size: commentsState.pageSize,
      postYear: commentsState.postYear,
      postIssue: commentsState.postIssue,
      issueId: commentsState.issueId
    })
    if (!response.success) {
      showErrorMessage(response)
      return
    }

    const data = response.data
    starActive.value = data.favoriteStatus === 'y'
    thumbUpActive.value = data.likeStatus === 'y'
    thumbDownActive.value = data.dislikeStatus === 'y'
    const newComments = data?.replies?.map(transformComment) || []
    commentsState.postUserId = response.data.postUserId

    commentsState.total = Number(data.childrenSize)
    commentsState.comments = replaceComments(commentsState.comments, newComments)
  } catch (error) {
    showErrorMessage(error)
  }
}

const loadReplies = async (comment: any) => {
  try {
    comment.repliesPage++
    const response = await reqListTree.value({
      selectedUserId: props.selectedUserId,
      postId: comment.postId,
      page: comment.repliesPage,
      size: comment.repliesPageSize,
      postYear: commentsState.postYear,
      postIssue: commentsState.postIssue,
      issueId: commentsState.issueId
    })
    if (!response.success) {
      showErrorMessage(response)
      return
    }
    // commentsState.postUserId = response.data.postUserId
    const newReplies = response.data?.replies || []
    return {
      ...comment,
      replies: [...comment.replies, ...newReplies],
      repliesPage: comment.repliesPage,
      showChildren: true
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Event handlers
const handleReplyOpen = (comment: any) => {
  console.log(comment)
  closeAllCommentForms()
  commentsState.comments = commentsState.comments.map((c) => ({
    ...c,
    isReplyContent: c.postId === comment.postId
  }))
}

const handleChildReplyOpen = (scope: any, reply: any, comment: any) => {
  console.log(scope, reply, comment)

  closeAllCommentForms()
  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []

  comment.replies.forEach((r) => {
    r.isReplyContent = r.postId === reply.postId
  })
  console.log(comment.replies)
}
const closeChildReplyInput = (comment: any, replies: any[]) => {
  replies.forEach((r) => {
    r.isReplyContent = false
  })

  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []
}
const closeReplyInput = (comment: any) => {
  commentsState.comments = commentsState.comments.map((c) =>
    c.postId === comment.postId ? { ...c, isReplyContent: false } : c
  )
  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []
}

const handleReplyMain = () => {
  closeAllCommentForms()
  commentsState.showMainReplyForm = true
}

const closeReplyMain = (scope: any) => {
  console.log(scope)
  commentsState.showMainReplyForm = false
  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []
}

const hasMoreReplies = (comment: any) => {
  return comment.replies.length < comment.repliesTotal
}

const getRemainingRepliesCount = (comment: any) => {
  return comment.repliesTotal - comment.replies.length
}

const loadMoreReplies = async (comment: any) => {
  console.log(comment)

  const updatedComment = await loadReplies(comment)
  commentsState.comments = commentsState.comments.map((c) => (c.postId === updatedComment.postId ? updatedComment : c))
}

const handleThumbToggle = async (type, val) => {
  if (isThumbLoading.value) return

  isThumbLoading.value = true
  try {
    if (type === 'up' && thumbDownActive.value) thumbDownActive.value = false
    if (type === 'down' && thumbUpActive.value) thumbUpActive.value = false

    await commitThumbAction(type, val)
  } finally {
    isThumbLoading.value = false
  }
}

const commitThumbAction = async (type, val) => {
  try {
    const targetId = commentsState.subjectName === 'post' ? props.postId : props.imageExplainId ?? commentsState.issueId
    const req = {
      userId: props.selectedUserId,
      targetRef: modalsStore.postSeriesModal.modalData?.forumId,
      targetId,
      likeType: type === 'up' ? 'l' : 'h',
      ipInfo: await getIpData(),
      likeFlag: commentsState.subjectName === 'post' ? 'p' : props.operationTypeFlag
    }
    const func = val ? reqDislike.value : reqLike.value
    const res = await func(req)

    if (!res.success) {
      showErrorMessage(res)
      return
    }

    if (type === 'up') {
      thumbUpActive.value = !val
    } else {
      thumbDownActive.value = !val
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    if (type === 'up') thumbUpActive.value = val
    else thumbDownActive.value = val
    isThumbLoading.value = false
  }
}

const handleThumbUpToggle = (val) => handleThumbToggle('up', val)
const handleThumbDownToggle = (val) => handleThumbToggle('down', val)

const toggleStar = async (val) => {
  try {
    const targetId = commentsState.subjectName === 'post' ? props.postId : props.imageExplainId ?? commentsState.issueId
    const req = {
      userId: props.selectedUserId,
      targetRef: modalsStore.postSeriesModal.modalData?.forumId,
      targetId,
      ipInfo: await getIpData(),
      favoriteFlag: commentsState.subjectName === 'post' ? 'p' : props.operationTypeFlag
    }
    const func = val ? reqCancelStar.value : reqStar.value
    const res = await func(req)
    if (!res.success) {
      showErrorMessage(res)
      return
    }
    starActive.value = !val
  } catch (error) {
    showErrorMessage(error)
    starActive.value = val
  }
}

const handleSuccess = (val: any) => {
  const { response, file } = val
  const fList = val.fileList
  commentsState.fileList = fList.map((item: any) => {
    const foundFlag = item.raw.uid === file.raw.uid
    return {
      ...item,
      response: foundFlag ? response : item.response
    }
  })
}

const beforeUpload = (val: any) => {
  Object.assign(uploadData, changeUploadData(val.type, 'bbs/forum/attachment').uploadData)
}

const handleRemove = (val: any) => {
  commentsState.fileList = commentsState.fileList.filter((item) => item!.raw!.uid !== val.raw.uid)
}

const loadMoreComments = () => {
  commentsState.currentPage++
  loadComments('append')
}

// Pure functions
const createAttachment = (item: UploadUserFile) => ({
  // @ts-ignore
  url: item.response!.path,
  fileType: changeUploadData(item.raw!.type, 'bbs/forum/attachment').fileType
})

const validateForm = (form: any): Promise<boolean> => {
  return new Promise((resolve) => {
    form.validate((valid: boolean) => resolve(valid))
  })
}

const submitReply = async (params: any) => {
  const response = await reqSubmitReply.value({
    ...params,
    postYear: commentsState.postYear,
    postIssue: commentsState.postIssue,
    issueId: commentsState.issueId,
    postRef: props.postId
  })
  if (!response.success) {
    showErrorMessage(response)
  }
  return response
}

const replyForChild = async (scope: any, comment: any) => {
  const row = scope.model
  const attachments = commentsState.fileList.map(createAttachment)
  const params = {
    threadPostId: comment.postId,
    postContent: row.replyContent,
    postUserId: props.postUserId,
    attachments,
    replyLevel: 'children'
  }
  const isValid = await validateForm(scope.form)
  if (!isValid) {
    console.log('表单验证失败')
    return
  }
  closeAllCommentForms()
  try {
    const afterSubmit = await submitReply(params)
    if (!afterSubmit.success) {
      showErrorMessage(afterSubmit)
      return
    }

    // if (props.postId) {
    //   const response = await reqTreeHttp({
    //     selectedUserId: props.selectedUserId,
    //     postId: comment.postId,
    //     page: Number(comment.repliesPage) <= 0 ? 1 : comment.repliesPage,
    //     size: comment.repliesPageSize
    //   })
    //   if (!response.success) {
    //     showErrorMessage(response)
    //     return
    //   }
    //   const data = response.data
    //   const newComments = data?.replies?.map(transformComment) || []

    //   comment.repliesTotal = Number(data.childrenSize)
    //   const updateStrategy = updateComments(
    //     'replaceLastN',
    //     comment.repliesPage,
    //     comment.repliesPageSize
    //   )
    //   if (comment.replies.length > 0) {
    //     comment.replies = updateStrategy(comment.replies, newComments)
    //   }
    // }
    // @ts-ignore
    const newComment = transformComment(afterSubmit.data ?? testData)
    // const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    if (comment.replies.length > 0) {
      // @ts-ignore
      comment.replies = updateStrategy(comment.replies, newComment)
    }
    // Increment the total count
    comment.repliesTotal += 1

    clearFileList()
  } catch (error) {
    console.error('Error saving data:', error)
  }
}
const replyForLeaf = async (scope: any, leaf: any, comment: any) => {
  const row = scope.model
  const attachments = commentsState.fileList.map(createAttachment)
  const params = {
    threadPostId: leaf.postId,
    postContent: row.replyContent,
    postUserId: props.postUserId,
    attachments,
    replyLevel: 'children'
  }
  const isValid = await validateForm(scope.form)
  if (!isValid) {
    console.log('表单验证失败')
    return
  }

  try {
    const afterSubmit = await submitReply(params)
    if (!afterSubmit.success) {
      showErrorMessage(afterSubmit)
      return
    }
    closeAllCommentForms()
    // if (props.postId) {
    //   const response = await reqTreeHttp({
    //     selectedUserId: props.selectedUserId,
    //     postId: comment.postId,
    //     page: Number(comment.repliesPage) <= 0 ? 1 : comment.repliesPage,
    //     size: comment.repliesPageSize
    //   })

    //   const data = response.data
    //   const newComments = data?.replies?.map(transformComment) || []

    //   comment.repliesTotal = Number(data.childrenSize)
    //   const updateStrategy = updateComments(
    //     'replaceLastN',
    //     comment.repliesPage,
    //     comment.repliesPageSize
    //   )
    //   if (comment.replies.length > 0) {
    //     comment.replies = updateStrategy(comment.replies, newComments)
    //   }
    // }
    // @ts-ignore
    const newComment = transformComment(afterSubmit.data ?? testData)
    // const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    if (comment.replies.length > 0) {
      // @ts-ignore
      comment.replies = updateStrategy(comment.replies, newComment)
    }
    // Increment the total count
    comment.repliesTotal += 1
    clearFileList()
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

// Main reply function
const reply = async (scope: any) => {
  const row = scope.model
  const attachments = commentsState.fileList.map(createAttachment)
  const params = {
    threadPostId: props.postId,
    postContent: row.replyContent,
    postUserId: props.postUserId,
    attachments
  }
  const isValid = await validateForm(scope.form)
  if (!isValid) {
    console.log('表单验证失败')
    return
  }

  try {
    const afterSubmit = await submitReply(params)
    if (!afterSubmit.success) {
      showErrorMessage(afterSubmit)
      return
    }
    closeAllCommentForms()
    // if (props.postId) {
    //   const response = await reqTreeHttp({
    //     selectedUserId: props.selectedUserId,
    //     postId: props.postId,
    //     page: commentsState.currentPage,
    //     size: commentsState.pageSize
    //   })

    //   const data = response.data
    //   const newComments = data?.replies?.map(transformComment) || []

    //   commentsState.total = Number(data.childrenSize)
    //   const updateStrategy = updateComments(
    //     'replaceLastN',
    //     commentsState.currentPage,
    //     commentsState.pageSize
    //   )
    //   commentsState.comments = updateStrategy(commentsState.comments, newComments)
    // }
    // Use the new comment data returned from the API

    // @ts-ignore
    const newComment = transformComment(afterSubmit.data ?? testData)
    // const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    // @ts-ignore
    commentsState.comments = updateStrategy(commentsState.comments, newComment)

    // Increment the total count
    commentsState.total += 1
    clearFileList()
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const closeAllCommentForms = () => {
  // Close main reply form
  commentsState.showMainReplyForm = false

  // Close all comment reply forms
  commentsState.comments.forEach((comment) => {
    comment.isReplyContent = false
    comment.replies.forEach((reply) => {
      reply.isReplyContent = false
    })
  })

  // Clear reply form content and file list
  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []
}

onMounted(async () => {
  // resetCommentsState()
  await new Promise((resolve) => setTimeout(resolve, 100))

  await initComments()
})
</script>

<style lang="less" scoped>
:deep(.el-form-item) {
  margin-bottom: 15px;
}
:deep(.el-upload--picture-card) {
  width: 40px !important;
  height: 40px !important;
}
:deep(.el-upload-list__item) {
  width: 60px !important;
  height: 80px !important;
}
.comment-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  gap: 6px;
}

.comment {
  display: flex;
  padding: 3px 0px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  margin-left: 10px;
  flex: 1;
}

.body {
  margin-bottom: 10px;
}

.children {
  margin-top: 10px;
}

.reply-comment {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  // width: calc(100% - 40px) !important;
}

.reply-comment .avatar img {
  width: 30px;
  height: 30px;
}

.show-more-btn {
  margin-top: 20px;
  align-self: center;
}

.text-plain {
  cursor: pointer;
  color: #807d7d;
}
</style>
