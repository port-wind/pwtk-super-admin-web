import type { CommonData } from '@/components/mComment/types'
import showErrorMessage from '@/utils/showErrorMessage'
import { ElMessage, type FormInstance, type UploadUserFile } from 'element-plus'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export interface CommentsState {
  comments: CommonData[]
  total: number
  currentPage: number
  pageSize: number
  showMainReplyForm: boolean
  replyForm: { replyContent: string }
  fileList: UploadUserFile[]
  isStarred: boolean
  disabledAction: boolean
  mainReplyFormRef: any
  postUserId: string
  selectedUserId: string
  subjectName: 'issue' | 'post'
  postYear: string
  postIssue: string
  issueId: string
  postId: string
  manageSiteId: string
}
export const useCommentsState = defineStore('state', () => {
  const commentsState = ref<CommentsState>({
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

  return { commentsState }
})
const { commentsState } = useCommentsState()
// You can add any utility functions here that directly manipulate the state
export const clearFileList = () => {
  commentsState.fileList = []
}
export const clickDisabled = () => {
  // commentsState.mainReplyFormRef.clearValidate()
  if (commentsState.disabledAction) {
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
export const toggleStar = () => {
  commentsState.isStarred = !commentsState.isStarred
}
export const resetCommentsState = (subject?: { subjectName: 'issue' | 'post' }) => {
  commentsState.comments = []
  commentsState.total = 0
  commentsState.currentPage = 1
  commentsState.pageSize = 15
  commentsState.showMainReplyForm = false
  commentsState.replyForm.replyContent = ''
  commentsState.fileList = []
  commentsState.isStarred = false
  commentsState.mainReplyFormRef = null
  commentsState.postUserId = ''
  commentsState.selectedUserId = ''

  if (subject) {
    commentsState.subjectName = subject.subjectName
    if (subject.subjectName === 'issue') {
      commentsState.postYear = ''
      commentsState.postIssue = ''
    }
  }
}

// Add more state manipulation functions as needed
