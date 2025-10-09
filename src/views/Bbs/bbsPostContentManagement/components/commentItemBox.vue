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
    </div>
    <div class="body">
      <p ref="contentRef" :class="{ truncate: !expanded }" v-html="formattedContent"></p>
      <el-button v-if="showExpandButton" type="text" class="expand-button" @click="toggleExpand">
        {{ expanded ? '收起' : '展开' }}
        <el-icon :class="{ rotate: expanded }"><ArrowDown /></el-icon>
      </el-button>
      <media-preview :attachments="comment.attachments" />
    </div>
    <div class="actions">
      <span class="time">{{ formattedTime }}</span>
      <el-button type="info" link @click="emitFunc(comment)" :disabled="props.disabledAction">回复</el-button>
      <up-icon-toggle
        v-model:iconState="thumbState"
        :ItemInfo="{
          selectedUserId: props.selectedUserId,
          targetId: comment.postId,
          targetRef: comment.postRef,
          disabledAction: props.disabledAction
        }"
        like-flag="c"
      />
      <down-icon-toggle
        v-model:iconState="thumbState"
        :ItemInfo="{
          selectedUserId: props.selectedUserId,
          targetId: comment.postId,
          targetRef: comment.postRef,
          disabledAction: props.disabledAction
        }"
        like-flag="c"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { unitFormatDate } from '@/utils/dateFormat/index'

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
  disabledAction: {
    type: Boolean,
    default: false
  }
})
const contentRef = ref(null)
const expanded = ref(false)
const showExpandButton = ref(false)
const thumbState = ref<'like' | 'dislike' | 'unset'>('unset')
const toggleExpand = () => {
  expanded.value = !expanded.value
}

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
  if (props.disabledAction) {
    ElMessage({
      message: `请确认模拟用户`,
      type: 'warning'
    })
    return
  }
  emit('reply', comment)
}

onMounted(async () => {
  await nextTick()
  if (contentRef.value) {
    const element = contentRef.value as HTMLElement
    showExpandButton.value = element.scrollHeight > element.clientHeight
  }
  if (props.comment.likeStatus === 'y') {
    thumbState.value = 'like'
  } else if (props.comment.dislikeStatus === 'y') {
    thumbState.value = 'dislike'
  } else {
    thumbState.value = 'unset'
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
