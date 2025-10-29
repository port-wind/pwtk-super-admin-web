export interface CommonData {
  postId: string
  avatar: string
  nickname: string
  postContent: string
  postTime: string
  replies: CommonData[]
  childrenSize: number
  showChildren: boolean
  isReplyContent: boolean
  repliesPage?: number
  repliesPageSize?: number
  repliesTotal?: number
  attachments: { url: string; fileType: string }[]
  likeStatus?: string
  dislikeStatus?: string
}
