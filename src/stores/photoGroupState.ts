import type { CommonData } from '@/components/mComment/types'
import { ElMessage, type UploadUserFile } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CommentsState } from './commentsState'

export const usePhotoGroupState = defineStore('photoGroupState', () => {
  const photoGroupState = ref<CommentsState>({
    comments: [],
    total: 0,
    currentPage: 1,
    pageSize: 15,
    showMainReplyForm: false,
    replyForm: { replyContent: '' },
    fileList: [],
    isStarred: false,
    disabledAction: true,
    mainReplyFormRef: null,
    postUserId: '',
    selectedUserId: '',
    subjectName: 'post',
    postYear: '',
    postIssue: '',
    issueId: '',
    postId: '',
    manageSiteId: ''
  })

  return { photoGroupState }
})
const { photoGroupState } = usePhotoGroupState()
// You can add any utility functions here that directly manipulate the state
export const clearPhotoGroupFileList = () => {
  photoGroupState.fileList = []
}
export const clickPhotoGroupDisabled = () => {
  if (photoGroupState.disabledAction) {
    // commentsState.mainReplyFormRef.validate(async (valid: any, fields: any) => {
    //   if (valid) {
    //     commentsState.disabled = false
    //   } else {
    //     console.log('表单验证失败')
    //   }
    // })
    ElMessage({
      message: `请确认模拟用户`,
      type: 'warning'
    })
  }
}

export const resetPhotoGroupState = (subject?: { subjectName: 'issue' | 'post' }) => {
  photoGroupState.comments = []
  photoGroupState.total = 0
  photoGroupState.currentPage = 1
  photoGroupState.pageSize = 15
  photoGroupState.showMainReplyForm = false
  photoGroupState.replyForm.replyContent = ''
  photoGroupState.fileList = []
  photoGroupState.isStarred = false
  photoGroupState.mainReplyFormRef = null
  photoGroupState.postUserId = ''
  photoGroupState.selectedUserId = ''

  if (subject) {
    photoGroupState.subjectName = subject.subjectName
    if (subject.subjectName === 'issue') {
      photoGroupState.postYear = ''
      photoGroupState.postIssue = ''
    }
  }
}

// Add more state manipulation functions as needed
