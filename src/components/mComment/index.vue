<!-- Comment.vue -->
<template>
  <div class="comment">
    <div class="avatar">
      <el-image
        :src="VITE_CDN_URL + comment.avatar"
        alt="avatar"
        style="width: 40px; height: 40px; border-radius: 50%"
      />
    </div>
    <div class="comment-content">
      <div class="header">
        <span class="nickname">{{ comment.nickname }}</span>
        <span class="time">{{ unitFormatDate(Number(comment.postTime), dateForm) }}</span>
      </div>
      <div class="body">
        <p v-html="comment.postContent"></p>
      </div>
      <div class="actions">
        <el-button v-if="withReply" type="text" @click="handleReply">回复</el-button>
        <el-button type="text" @click="toggleChildren">
          {{ showChildren ? '隐藏' : '查看' }} ({{ comment.replies.length }})
        </el-button>
      </div>

      <!-- 提交回复部分 -->
      <el-form ref="replyFormRef" class="reply-content" :rules="replyRules" :model="replyForm" v-if="isReplyContent">
        <el-form-item prop="replyContent">
          <el-input type="textarea" v-model="replyForm.replyContent"></el-input>
        </el-form-item>
        <el-form-item class="reply-actions">
          <el-button size="small" @click="closeReplyInput">取消</el-button>
          <el-button type="primary" size="small" @click="submitReplyInput">提交</el-button>
        </el-form-item>
      </el-form>

      <!-- 子评论展示部分 -->
      <div v-if="showChildren" class="children">
        <m-comment
          v-for="reply in comment.replies"
          :key="reply.postId"
          :comment="reply"
          :withReply="withReply"
          class="reply-comment"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, reactive } from 'vue'
import { unitFormatDate } from '@/utils/dateFormat/index'
import { ElButton } from 'element-plus'
import { CommonData } from '@/components/mComment/types'

const { VITE_CDN_URL } = webConfigApi
const dateForm = 'yyyy-MM-dd HH:mm:ss'

// 获取父组件注入的 addReply 函数
const addReply = inject('addReply') as Function

// 接收从父组件传递下来的 comment prop
const props = defineProps({
  comment: {
    type: Object as PropType<CommonData>,
    required: true
  },
  withReply: {
    type: Boolean,
    default: true
  }
})

const showChildren = ref(false)
const isReplyContent = ref(false)
const replyFormRef = ref()
const replyForm = reactive({
  replyContent: ''
})

const replyRules = ref({
  replyContent: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})

const handleReply = () => {
  // 处理回复按钮点击事件
  console.log(`回复评论: ${props.comment.postId}`)
  isReplyContent.value = true
}

const toggleChildren = () => {
  // 切换回复内容的显示和隐藏
  showChildren.value = !showChildren.value
}

const closeReplyInput = () => {
  isReplyContent.value = false
  replyForm.replyContent = ''
}

const submitReplyInput = () => {
  replyFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      const params = { replyContent: replyForm.replyContent, ...props.comment }
      // 使用注入的 addReply 函数来添加回复
      addReply(params)
      closeReplyInput()
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>

<style scoped>
.comment {
  display: flex;
  padding: 10px;
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

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.nickname {
  font-weight: bold;
}

.time {
  font-size: 12px;
  color: #999;
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

/* .children {
  margin-top: 10px;
  padding-left: 50px;
  border-left: 2px solid #ebedf0;
} */

.reply-comment {
  margin-top: 10px;
}
</style>
