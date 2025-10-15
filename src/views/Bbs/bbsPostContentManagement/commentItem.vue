<template>
  <div class="comment-item">
    <div class="header">
      <link-with-copy
        :row-data="comment"
        :config="{ idKey: 'postUserId', notShowLink: true, hoverShowCopy: true }"
        :use-slot="true"
      >
        <span class="nickname">{{ getNickname(comment) }}</span>
        <el-button
          type="primary"
          plain
          disabled
          style="width: 25px; height: 15px; font-size: 12px; margin-left: 5px"
          v-if="comment.isAuthor && comment.isAuthor === 'y'"
        >
          作者
        </el-button>
      </link-with-copy>
      <!-- {{ comment.postUserId }}/ {{ commentsState.postUserId }} -->
      <!-- <span class="nickname">{{ getNickname(comment) }}</span> -->
      <!-- v-if="comment.postUserId && comment.postUserId === commentsState.postUserId" -->

      <!-- {{ comment.postUserId }} / {{ commentsState.postUserId }} -->
    </div>
    <div class="body">
      <p ref="contentRef" :class="{ truncate: !expanded }" v-html="formattedContent"></p>
      <el-button v-if="showExpandButton" type="text" class="expand-button" @click="toggleExpand">
        {{ expanded ? '收起' : '展开' }}
        <el-icon :class="{ rotate: expanded }"><ArrowDown /></el-icon>
      </el-button>
      <MediaPreview :attachments="comment.attachments" />
    </div>
    <div class="actions">
      <span class="time">{{ formattedTime }}</span>
      <el-button type="info" link @click="emitFunc(comment)" :disabled="commentsState.disabledAction">回复</el-button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import ThumbDownFill from '@/assets/images/ri--thumb-down-fill.svg'
import ThumbUpFill from '@/assets/images/ri--thumb-up-fill.svg'
import ThumbUpLine from '@/assets/images/ri--thumb-up-line.svg'
import ThumbDownLine from '@/assets/images/ri--thumb-down-line.svg'
import MediaPreview from './mediaPreview.vue' // Adjust the import path as needed
import { clickDisabled, useCommentsState } from '@/stores/commentsState'
import { dislikeHttp, likeHttp } from '@/api/bss/postContentManagement/index'
import showErrorMessage from '@/utils/showErrorMessage'
import { useIssuesApi } from '@/api/photoSys/issues/index'
import { getIpData } from '@/api/index'
import { clickPhotoGroupDisabled, usePhotoGroupState } from '@/stores/photoGroupState'
const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  selectedUserId: {
    type: String
  },
  dateForm: {
    type: String,
    default: 'yyyy-MM-dd HH:mm:ss'
  },
  postType: {
    type: String,
    default: 'p'
  }
})
const postType = computed(() => props.postType)
const { photoGroupState: commentsState } =
  postType.value === 'a' ? usePhotoGroupState() : { photoGroupState: useCommentsState().commentsState }
const { dislikeIssuePost, likeIssuePost } = useIssuesApi(postType)
const isThumbLoading = ref(false)
const thumbUpActive = ref(false)
const thumbDownActive = ref(false)
const contentRef = ref(null)
const expanded = ref(false)
const showExpandButton = ref(false)
const reqLike = computed(() => {
  return commentsState.subjectName === 'post' ? likeHttp : likeIssuePost
})
const reqCancleLike = computed(() => {
  return commentsState.subjectName === 'post' ? dislikeHttp : dislikeIssuePost
})
// const reqLikeBackup = computed(() => {
//   return commentsState.subjectName === 'post' ? likeHttp : likeIssuePost
// })
// const reqDislikeBackup = computed(() => {
//   return commentsState.subjectName === 'post' ? dislikeHttp : dislikeIssuePost
// })
const toggleExpand = () => {
  expanded.value = !expanded.value
}
watch(
  () => props.selectedUserId,
  (newVal) => {
    if (!newVal) {
      thumbUpActive.value = false
      thumbDownActive.value = false
    }
  },
  { immediate: true }
)
watch(
  () => props.comment.likeStatus,
  (newVal) => {
    thumbUpActive.value = newVal === 'y'
  },
  { immediate: true }
)

watch(
  () => props.comment.dislikeStatus,
  (newVal) => {
    thumbDownActive.value = newVal === 'y'
  },
  { immediate: true }
)

const emit = defineEmits(['reply'])

const getNickname = (comment: any) => {
  return comment.nickname && comment.nickname.trim() !== '' ? comment.nickname : '匿名用户'
}
const formattedContent = computed(() => {
  const { toNickname, commentedNickname, postContent } = props.comment
  const replyName = toNickname && toNickname.length > 0 ? toNickname : commentedNickname
  const prefix = replyName ? `<span class="reply-prefix">回复 ${replyName}: </span>` : ''
  return `${prefix}${postContent}`
})
const formattedTime = computed(() => {
  return unitFormatDate(Number(props.comment.postTime), props.dateForm)
})
const emitFunc = (comment: any) => {
  console.log('postUserId', comment.postUserId)
  console.log('commentsState.postUserId', commentsState.postUserId)
  if (commentsState.disabledAction) {
    postType.value === 'a' ? clickPhotoGroupDisabled() : clickDisabled()
    return
  }
  emit('reply', comment)
}

const handleThumbToggle = async (type, val) => {
  if (isThumbLoading.value) return
  isThumbLoading.value = true

  if (type === 'up' && thumbDownActive.value) thumbDownActive.value = false
  if (type === 'down' && thumbUpActive.value) thumbUpActive.value = false

  await commitThumbAction(type, val)
  isThumbLoading.value = false
}

const commitThumbAction = async (type, val) => {
  try {
    const req = {
      userId: props.selectedUserId,
      targetRef: commentsState.subjectName === 'post' ? commentsState.postId : commentsState.issueId,
      targetId: props.comment.postId,
      likeType: type === 'up' ? 'l' : 'h',
      ipInfo: await getIpData(),
      likeFlag: commentsState.subjectName === 'post' ? 'c' : 'u'
    }
    const func = val ? reqCancleLike.value : reqLike.value
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
    showErrorMessage(error)
    if (type === 'up') thumbUpActive.value = val
    else thumbDownActive.value = val
    isThumbLoading.value = false
  }
}

const handleThumbDownToggle = (val) => handleThumbToggle('down', val)
const handleThumbUpToggle = (val) => handleThumbToggle('up', val)

onMounted(async () => {
  await nextTick()
  if (contentRef.value) {
    const element = contentRef.value as HTMLElement
    showExpandButton.value = element.scrollHeight > element.clientHeight
  }
})
</script>

<style scoped lang="less">
.nickname {
  font-weight: bold;
}

.body {
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  align-items: center;
}

.time {
  font-size: 12px;
  color: #999;
  min-width: 150px;
}

.text-plain {
  cursor: pointer;
  color: #807d7d;
}
.content-wrapper {
  position: relative;
}
:deep(.media-item) {
  width: 100px;
  height: 130px;
}
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  max-height: 1.5em;
}

.expand-button {
  right: 0;
  bottom: 0;
  background: white;
  color: #999;
}

.rotate {
  transform: rotate(180deg);
}
</style>
