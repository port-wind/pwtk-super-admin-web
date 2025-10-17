// types/index.ts
export interface IssueFormData {
  issueId?: string
  issue: string
  year: string
  seriesCode: string
  newspaperCode: string
  gameType: string
  imgPath: string
  isColorful: string
  isTop: string
  isSelected: string
  isHot: string
  isBloom: string
  isRecommended: string
  commentFlag: string
  voteFlag: string
  isAllAnnotateContent: string
  annotateContent: string
  status: string
  createTime: number
  seriesName: string
  newspaperName: string
  name: string
  readCount: number
}

export interface IssueTableItem extends IssueFormData {
  id: string
}

export interface QueryForm {
  year: string
  issue: string
  gameType: string
  name: string
  newspaperName: string
  newspaperCode: string
}

export interface IssueOptionState {
  data: Array<{ value: string; label: string }>
  loading: boolean
  error?: any
}

export interface UploadFileItem {
  name: string
  url?: string
  raw?: File
  issueNumber?: number
}

export interface TableState {
  tableData: IssueTableItem[]
  total: number
  currentPage: number
  pageSize: number
  isLoading: boolean
}

export interface NewspaperOption {
  newspaperCode: string
  newspaperName: string
  [key: string]: any
}
