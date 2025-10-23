<template>
  <section>
    <section style="display: inline-flex; justify-content: space-between; margin-bottom: 5px">
      <el-button @click="handleReplyMain" size="small" :disabled="props.disabledAction">回复帖子</el-button>
      <section
        style="
          display: inline-flex;
          width: 80px;
          justify-content: space-between;
          align-items: center;
          margin-left: 10px;
        "
      >
        <star-icon-toggle
          v-model:iconState="starState"
          :ItemInfo="{
            selectedUserId: props.selectedUserId,
            targetId: props.postId,
            targetRef: props.forumId,
            disabledAction: props.disabledAction
          }"
          like-flag="p"
        />
        <up-icon-toggle
          v-model:iconState="thumbState"
          :ItemInfo="{
            selectedUserId: props.selectedUserId,
            targetId: props.postId,
            targetRef: props.forumId,
            disabledAction: props.disabledAction
          }"
          like-flag="p"
        />
        <down-icon-toggle
          v-model:iconState="thumbState"
          :ItemInfo="{
            selectedUserId: props.selectedUserId,
            targetId: props.postId,
            targetRef: props.forumId,
            disabledAction: props.disabledAction
          }"
          like-flag="p"
        />
      </section>
    </section>

    <comment-item-form v-if="showMainReplyForm" @cancel="closeReplyMain" @submit="reply" />
  </section>
  <el-divider style="margin: 0" />
  <div class="comment-list">
    <div v-for="comment in comments" :key="comment.postId" class="comment">
      <div class="avatar">
        <el-image
          :src="VITE_CDN_URL + comment.avatar"
          alt="avatar"
          style="width: 40px; height: 40px; border-radius: 50%"
        />
      </div>
      <div class="comment-content">
        <comment-item-box
          :comment="comment"
          :selectedUserId="props.selectedUserId"
          :disabledAction="props.disabledAction"
          @reply="handleReplyOpen"
        ></comment-item-box>

        <comment-item-form
          v-if="comment.isReplyContent"
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
                  style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid #d7dfe6; margin-right: 10px"
                />
              </div>
              <comment-item-box
                :comment="reply"
                :selectedUserId="props.selectedUserId"
                :disabledAction="props.disabledAction"
                @reply="(r) => handleChildReplyOpen(r, reply, comment)"
              ></comment-item-box>
            </section>

            <comment-item-form
              v-if="reply.isReplyContent"
              @cancel="() => closeChildReplyInput(reply, comment.replies)"
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
import { ref, computed, onMounted, watch } from 'vue'
import { ElButton, ElImage, type UploadUserFile } from 'element-plus'
import type { CommonData } from '@/components/mComment/types'
import { addReplyHttp, reqTreeHttp } from '@/api/bss/postContentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { changeUploadData } from '@/utils/dataFormat'

// eslint-disable-next-line no-undef
const { VITE_CDN_URL } = webConfigApi
const INITIAL_COMMENT_PAGE = 1
const INITIAL_COMMENT_PAGE_SIZE = 15

// Props
const props = defineProps({
  postId: { type: String, required: true },
  postUserId: { type: String, required: true },
  forumId: { type: String, required: true },
  selectedUserId: { type: String, default: '' },
  disabledAction: { type: Boolean, default: true }
})

// State
const showMainReplyForm = ref(false)
const comments = ref<any[]>([])
const total = ref(0)
const currentPage = ref(INITIAL_COMMENT_PAGE)
const pageSize = ref(INITIAL_COMMENT_PAGE_SIZE)
const postYear = ref('')
const postIssue = ref('')
const starState = ref<'star' | 'unset'>('unset')
const thumbState = ref<'like' | 'dislike' | 'unset'>('unset')

// Computed properties
const hasMoreComments = computed(() => total.value > comments.value.length)

// Pure functions
const transformComment = (comment: CommonData) => ({
  ...comment,
  replies: [],
  showChildren: false,
  isReplyContent: false,
  likeStatus: comment.likeStatus ?? 'n',
  dislikeStatus: comment.dislikeStatus ?? 'n',
  repliesPage: 0,
  repliesPageSize: INITIAL_COMMENT_PAGE_SIZE,
  repliesTotal: Number(comment.childrenSize ?? 0),
  attachments: comment.attachments || []
})

// Comment update strategies
const appendComments = (oldComments: any[], newComments: any[]) => [...oldComments, ...newComments]
const replaceComments = (_oldComments: any[], newComments: any[]) => newComments
const prependComment = (oldComments: any[], newComment: any) => [newComment, ...oldComments]
const replaceLastNWithPagination = (page: number, size: number) => (oldComments: any[], newComments: any[]) => {
  const keepCount = oldComments.length - Math.max(0, oldComments.length - (page - 1) * size)
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

// API Calls
const loadComments = async (updateType: 'append' | 'replace' | 'replaceLastN') => {
  if (!props.postId) return

  try {
    const response = await reqTreeHttp({
      selectedUserId: props.selectedUserId,
      postId: props.postId,
      page: currentPage.value,
      size: pageSize.value,
      postYear: postYear.value,
      postIssue: postIssue.value
    })

    if (!response.success) {
      showErrorMessage(response)
      return
    }

    const { data } = response as any
    const newComments = data?.replies?.map(transformComment) || []

    total.value = Number(data.childrenSize)
    const updateStrategy = updateComments(updateType, currentPage.value, pageSize.value)
    comments.value = updateStrategy(comments.value, newComments)
  } catch (error) {
    showErrorMessage(error)
  }
}

const initComments = async () => {
  if (!props.postId) {
    console.error('Post ID is required')
    return
  }

  comments.value = []
  showMainReplyForm.value = false
  currentPage.value = INITIAL_COMMENT_PAGE
  pageSize.value = INITIAL_COMMENT_PAGE_SIZE
  try {
    const response = await reqTreeHttp({
      selectedUserId: props.selectedUserId,
      postId: props.postId,
      page: currentPage.value,
      size: pageSize.value,
      postYear: postYear.value,
      postIssue: postIssue.value
    })

    if (!response.success) {
      showErrorMessage(response)
      return
    }

    const { data } = response as any
    if (!data) return

    if (data?.likeStatus === 'y') {
      thumbState.value = 'like'
    } else if (data?.dislikeStatus === 'y') {
      thumbState.value = 'dislike'
    } else {
      thumbState.value = 'unset'
    }

    starState.value = data.favoriteStatus === 'y' ? 'star' : 'unset'
    total.value = Number(data.childrenSize)
    const newComments = data?.replies?.map(transformComment) || []

    comments.value = replaceComments(comments.value, newComments)
  } catch (error) {
    showErrorMessage(error)
  }
}

const loadReplies = async (comment: any) => {
  try {
    comment.repliesPage += 1
    const response: any = await reqTreeHttp({
      selectedUserId: props.selectedUserId,
      postId: comment.postId,
      page: comment.repliesPage,
      size: comment.repliesPageSize,
      postYear: postYear.value,
      postIssue: postIssue.value
    })

    if (!response.success) {
      showErrorMessage(response)
      return
    }

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

// Form handling
const closeAllCommentForms = () => {
  // Close main reply form
  showMainReplyForm.value = false

  // Close all comment reply forms
  comments.value.forEach((comment) => {
    comment.isReplyContent = false
    comment.replies.forEach((reply) => {
      reply.isReplyContent = false
    })
  })
}

// Event handlers
const handleReplyOpen = (comment: any) => {
  closeAllCommentForms()
  comments.value = comments.value.map((c) => ({
    ...c,
    isReplyContent: c.postId === comment.postId
  }))
}

const handleChildReplyOpen = (_scope: any, reply: any, comment: any) => {
  closeAllCommentForms()
  comment.replies.forEach((r) => {
    r.isReplyContent = r.postId === reply.postId
  })
}

const closeChildReplyInput = (reply: any, replies: any[]) => {
  replies.forEach((r) => {
    r.isReplyContent = false
  })
}

const closeReplyInput = (comment: any) => {
  comments.value = comments.value.map((c) => (c.postId === comment.postId ? { ...c, isReplyContent: false } : c))
}

const handleReplyMain = () => {
  closeAllCommentForms()
  showMainReplyForm.value = true
}

const closeReplyMain = () => {
  showMainReplyForm.value = false
}

const hasMoreReplies = (comment: any) => {
  return comment.replies.length < comment.repliesTotal
}

const getRemainingRepliesCount = (comment: any) => {
  return comment.repliesTotal - comment.replies.length
}

const loadMoreReplies = async (comment: any) => {
  const updatedComment = await loadReplies(comment)
  comments.value = comments.value.map((c) => (c.postId === updatedComment.postId ? updatedComment : c))
}

const loadMoreComments = () => {
  currentPage.value += 1
  loadComments('append')
}

// Reply handling
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
  const response = await addReplyHttp({
    ...params,
    postYear: postYear.value,
    postIssue: postIssue.value,
    postRef: props.postId
  })

  if (!response.success) {
    showErrorMessage(response)
  }

  return response
}

const reply = async (scope: any) => {
  const row = scope.model
  const attachments = scope.fileList.map(createAttachment)
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
    // @ts-ignore
    const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    // @ts-ignore
    comments.value = updateStrategy(comments.value, newComment)

    // Increment the total count
    total.value += 1
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const replyForChild = async (scope: any, comment: any) => {
  const row = scope.model
  const attachments = scope.fileList.map(createAttachment)
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

    // @ts-ignore
    const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    if (comment.replies.length > 0) {
      // @ts-ignore
      comment.replies = updateStrategy(comment.replies, newComment)
    }

    // Increment the total count
    comment.repliesTotal += 1
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const replyForLeaf = async (scope: any, leaf: any, comment: any) => {
  const row = scope.model
  const attachments = scope.fileList.map(createAttachment)
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
    // @ts-ignore
    const newComment = transformComment(afterSubmit.data)

    // Update the comments state using the 'prepend' strategy
    const updateStrategy = updateComments('prepend')
    if (comment.replies.length > 0) {
      // @ts-ignore
      comment.replies = updateStrategy(comment.replies, newComment)
    }

    // Increment the total count
    comment.repliesTotal += 1
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

// Watch for changes to selectedUserId
watch(
  () => props.selectedUserId,
  () => {
    initComments()
  }
)

// Initialize on mount
onMounted(async () => {
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
