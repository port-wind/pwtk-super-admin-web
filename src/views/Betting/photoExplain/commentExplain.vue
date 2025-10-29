<template>
  <div class="issue-image-post">
    <el-image :src="imgPath" fit="scale-down" class="content-with-border-issue" style="flex: 0.8; width: 100%" />
    <div
      class="content-with-border-issue"
      v-html="selectedRow.postContent"
      style="flex: 0.2; width: 100%; margin: 10px 0; padding: 10px; overflow: auto"
    ></div>
  </div>

  <div class="tab-content comments-tab">
    <PhoneFrame>
      <template #mainBody>
        <div class="post-content-wrapper">
          <section>
            <el-form
              style="display: flex; align-items: center; justify-content: space-between; width: 38%"
              ref="photoGroupReplyFormRef"
              :rules="replyRules"
              :model="photoGroupReplyForm"
            >
              <el-form-item prop="replyUserId" label="模拟用户" :label-width="'85px'" style="margin-bottom: 7px">
                <UniRemoteInput
                  v-model="photoGroupReplyForm.replyUserId"
                  valueKey="userId"
                  labelKey="nickname"
                  searchKey="userId"
                  placeholder="用户ID"
                  event-focus="focus"
                  :fetchOptions="reqUserListByUserId"
                  :disabled="!!photoGroupSelectedUserId"
                  style="width: 240px"
                  :formatLabel="(item) => (item.loginId ? `${item.loginId} - ${item.userId}` : item.userId)"
                  @valueChange="handlePhotoGroupReplyUserIdChange"
                />
              </el-form-item>
              <el-form-item class="reply-actions" style="margin-left: 5px; margin-bottom: 7px">
                <el-button size="small" @click="closePhotoGroupReply" v-if="!!photoGroupSelectedUserId">取消</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="submitPhotoGroupReply"
                  v-else-if="photoGroupReplyForm.replyUserId"
                >
                  确认
                </el-button>
              </el-form-item>
            </el-form>
          </section>
          <section style="flex: 1; overflow: hidden">
            <comments-reply
              :postId="''"
              :postUserId="photoGroupReplyForm.replyUserId ?? ''"
              :selectedUserId="photoGroupSelectedUserId"
              :postType="'a'"
              :imageExplainId="imageExplainId"
            ></comments-reply>
          </section>
        </div>
      </template>
    </PhoneFrame>
  </div>
</template>
<script lang="ts" setup>
import { reqUserListByUserId } from '@/api/user/index'
import { resetPhotoGroupState, usePhotoGroupState } from '@/stores/photoGroupState'
import commentsReply from '@/views/Bbs/bbsPostContentManagement/comments.vue'
const { VITE_CDN_URL } = webConfigApi

const props = defineProps({
  selectedRow: {
    type: Object,
    required: true
  }
})

const { photoGroupState } = usePhotoGroupState()
const imageExplainId = ref('')

const imgPath = ref('')

const photoGroupSelectedUserId = ref()
const photoGroupReplyFormRef = ref()

const photoGroupReplyForm = reactive({
  replyUserId: ''
})
const replyRules = ref({
  replyUserId: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
})
const resetMainReplyForm = () => {
  photoGroupReplyForm.replyUserId = ''
  photoGroupSelectedUserId.value = ''
  resetPhotoGroupState({ subjectName: 'issue' })
}
const handlePhotoGroupReplyUserIdChange = (selectedUser) => {
  if (selectedUser) {
    photoGroupReplyForm.replyUserId = selectedUser.userId
    // Trigger validation for the replyUserId field
    photoGroupReplyFormRef.value.validateField('replyUserId')
  }
}
const submitPhotoGroupReply = () => {
  photoGroupReplyFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      console.log('valid', valid)
      resetPhotoGroupState()
      photoGroupSelectedUserId.value = photoGroupReplyForm.replyUserId
      photoGroupState.disabledAction = false
      photoGroupState.selectedUserId = photoGroupReplyForm.replyUserId
    } else {
      console.log('表单验证失败')
    }
  })
}
const closePhotoGroupReply = () => {
  photoGroupSelectedUserId.value = ''
  photoGroupReplyForm.replyUserId = ''
  photoGroupState.disabledAction = true
}
onMounted(async () => {
  resetMainReplyForm()

  const { postId, postYear, postIssue, issueId } = props.selectedRow
  imgPath.value = VITE_CDN_URL + props.selectedRow.issueDTO.imgPath
  imageExplainId.value = postId
  photoGroupState.disabledAction = true
  photoGroupState.postYear = postYear
  photoGroupState.postIssue = postIssue
  photoGroupState.issueId = issueId
})
</script>
<style lang="less" scoped>
.post-content-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 20px);
}
.phoneAll {
  height: 100%;
  overflow: hidden;
}

:deep(.comments-tab) {
  padding: 3px 10px;
}

:deep(.comment-list) {
  height: calc(100% - 44px) !important;
}

:deep(.hide-add) {
  .el-upload--picture-card {
    display: none;
  }
}
.issue-image-post {
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.content-with-border-issue {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
