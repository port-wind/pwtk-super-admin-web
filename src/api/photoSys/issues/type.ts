export interface ICrawlIssuesQueryParams {
  gameType: string
  issue: string
}

export interface ICrawlIssuesResponse {
  downloadStatus: EDownloadStatus
  message: string
  downloadCode: number
}

export enum EDownloadStatus {
  STARTED = 'STARTED',
  DOWNLOADING = 'DOWNLOADING',
  LAST_TASK_DOWNLOADING_PLEASE_WAIT = 'LAST_TASK_DOWNLOADING_PLEASE_WAIT',
  FINISHED = 'FINISHED',
  NO_DATA = 'NO_DATA',
  DOWNLOADING_HAVE_A_FEW_DATA = 'DOWNLOADING_HAVE_A_FEW_DATA',
  DOWNLOADING_NOT_YET_HAVE_DATA = 'DOWNLOADING_NOT_YET_HAVE_DATA'
}
