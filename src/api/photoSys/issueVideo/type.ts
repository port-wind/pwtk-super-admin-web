export interface IIssueVideo {
  id: number
  videoTitle: string
  year: number
  gameType: string // string to match IGameType.gameType
  issue: number
  videoPath: string
  videoSize: string
  uploadVideoTime: string
  updateVideoTime: string
  videoPicture: string
}

export interface IIssueVideoListParams {
  videoTitle?: string
  year?: string
  gameType?: string | number
  issue?: number
  page: number
  size: number
}

export interface IIssueVideoListResponse {
  total: number
  list: IIssueVideo[]
}

export interface IIssueVideoDetailParams {
  id: number
}

export interface IIssueVideoExistParams {
  gameType: string
  year: number
  issue: number
}

export interface IIssueVideoCreateParams {
  id?: string
  insertOrUpdateFlag?: string
  videoTitle: string
  gameType: string
  year: number
  issue: number
  videoPicture?: string
  videoPath: string
}

export interface IUploadResponse {
  videoPath: string
  size?: string
}
