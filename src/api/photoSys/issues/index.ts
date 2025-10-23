import type { IBaseResponse } from '@/api/type'
import http from '@/utils/http/index'
import type { Ref } from 'vue'
import type { ICrawlIssuesQueryParams, ICrawlIssuesResponse } from './type'
const prefix = 'super/'
export const create = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/create', data)
}

export const del = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/del', data)
}

export const update = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/update', data)
}

export const list = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  if (data.year === 'L') {
    delete data.year
  }
  if (data.postYear === 'L') {
    delete data.postYear
  }
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/list', data)
}
export const getIssueListByParams = (params: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/gameTypePlatform/issueList', params)
}
export const getDetailById = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/getDetailById', data)
}
export const getExplainDetailByPostId = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/detailByPostId', data)
}

export const getNewsPaperList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaper/list', data)
}

export const downloadIssueData = (): Promise<IBaseResponse<never>> => {
  return http.post('webgw/' + prefix + 'gamePicture/downloadIssueData', {})
}
export const crawlIssues = (data: ICrawlIssuesQueryParams): Promise<IBaseResponse<ICrawlIssuesResponse>> => {
  return http.post(`webgw/${prefix}gameTypeNewspaperIssue/downloadIssues`, data)
}

export const getNewspaperIssuePostList = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/listTree', data)
}

export const replyIssuePost = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/replyPost', data)
}

export const likeIssuePost = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'like/add', data)
}

export const starIssuePost = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'favorite/add', data)
}

export const cancelStarIssuePost = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'favorite/del', data)
}

export const dislikeIssuePost = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'like/del', data)
}
export const likeIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/like', data)
}

export const starIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/favorite', data)
}

export const dislikeIssuePostBackup = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/dislike', data)
}

export const batchVerify = (data: any, manageSiteId: string) => {
  return http.post<any>('webgw/' + prefix + 'issueMapping/batchVerify', {
    ...data,
    manageSiteId
  })
}
const transformToTargetFormat = (inputData: any) => {
  const commonAttribute = {
    issue: inputData.issue,
    year: inputData.year,
    isColorful: inputData.isColorful,
    isTop: inputData.isTop,
    isSelected: inputData.isSelected,
    isHot: inputData.isHot,
    isBloom: inputData.isBloom,
    isRecommended: inputData.isRecommended,
    commentFlag: inputData.commentFlag,
    voteFlag: inputData.voteFlag,
    isAllAnnotateContent: inputData.isAllAnnotateContent
  }

  const issueList = inputData.issueList.map((item: any) => ({
    fileId: item.targetId,
    imgPath: item.imgPath
  }))

  return {
    commonAttribute,
    issueList
  }
}

export const batchSave = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'gameTypeNewspaperIssue/batchSave', transformToTargetFormat(data))
}
export const graphicSolutionGroup = (data: any) => {
  if (data.gameType === 'L') {
    delete data.gameType
  }
  if (data.year === 'L') {
    delete data.year
  }
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/graphicSolutionGroup', data)
}
export const updateGraphicSolution = (data: any) => {
  return http.post<any>('webgw/' + prefix + 'tk/newspaperIssuePost/updateStatus', data)
}

export function useIssuesApi(manageSiteId: Ref<string>, postType?: Ref<string>, imageExplainId?: Ref<string>) {
  const injectSiteId = (params: any = {}) => {
    if (imageExplainId?.value) {
      params.imageExplainId = imageExplainId?.value
      params.threadPostId = imageExplainId?.value
    }
    return {
      ...params,
      manageSiteId: manageSiteId.value,
      postType: postType?.value === 'a' ? (params.replyLevel === 'children' ? 'c' : 'a') : postType?.value
    }
  }
  const injectField = (params: any = {}) => {
    return {
      ...params,
      threadPostId: params.replyLevel === 'children' ? params.threadPostId : imageExplainId?.value,
      manageSiteId: manageSiteId.value,
      postType: postType?.value === 'a' ? 'c' : postType?.value
    }
  }
  return {
    cancelStarIssuePost: (params?: any) => cancelStarIssuePost(injectSiteId(params)),
    dislikeIssuePost: (params?: any) => dislikeIssuePost(injectSiteId(params)),
    getNewspaperIssuePostList: (params?: any) => getNewspaperIssuePostList(injectSiteId(params)),
    likeIssuePost: (params?: any) => likeIssuePost(injectSiteId(params)),
    replyIssuePost: (params?: any) => replyIssuePost(injectField(params)),
    starIssuePost: (params?: any) => starIssuePost(injectSiteId(params))
  }
}
