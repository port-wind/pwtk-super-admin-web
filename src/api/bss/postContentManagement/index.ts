import http from '@/utils/http/index'
import type {
  DelRequest,
  DelResponse,
  EditResponse,
  GetResponse,
  GetTreeRequest,
  GetTreeResponse,
  AddReplyRequest,
  AddReplyResponse,
  ActionRequest,
  ICreateBbsPostQueryParams,
  IGetBbsForumPostByIdQueryParams,
  IGetBbsForumPostByIdData,
  IUpdateBbsPostQueryParams,
  PredictionInfo,
  IPostPredictionRule,
  ILastIssuePostParams,
  IReqHttpBBsForumListQueryParams,
  IReqHttpBBsForumListData
} from './types'
import type { Ref } from 'vue'
import type { IBaseResponse, IResponse } from '@/api/type'
import { GameTypeMap } from '../../../const/commonSet'
// import { IResponse } from '../type'
const perfix = '/super'
enum api {
  //查询
  GetAll = 'webgw' + perfix + '/bbsForumPost/list',
  //创建
  AddOne = 'webgw' + perfix + '/bbsForumPost/createPost',
  //获取单个
  GetOne = 'webgw' + perfix + '/bbsForumPost/selectPostById',
  // 删除
  DeleteOne = 'webgw' + perfix + '/bbsForumPost/delete',
  //修改
  EditOne = 'webgw' + perfix + '/bbsForumPost/edit',
  // 获取树列表
  GetTreeList = 'webgw' + perfix + '/bbsForumPost/listTree',
  //新增回复
  AddReply = 'webgw' + perfix + '/bbsForumPost/replyPost',

  Like = 'webgw' + perfix + '/bbsForumPost/like',
  Dislike = 'webgw' + perfix + '/bbsForumPost/dislike',
  Favorite = 'webgw' + perfix + '/bbsForumPost/favorite'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttp = (data: IReqHttpBBsForumListQueryParams): Promise<IResponse<IReqHttpBBsForumListData>> => {
  return http.post(api.GetAll, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addHttp = (data: IGetBbsForumPostByIdQueryParams): Promise<IBaseResponse<IGetBbsForumPostByIdData>> => {
  return http.post(api.GetOne, data)
}

// 开奖历史表
export const getHittedHistory = (data: {
  gameTypeName: string
  year: string
  issue: string
}): Promise<IBaseResponse<{ list: any[] }>> => {
  const { year, issue, gameTypeName } = data
  const gameType = GameTypeMap[gameTypeName]
  return http.post(`webgw/${gameType}/list`, { year, issue, sortOrder: 'DESC', page: 1, size: 10 })
}

export interface IGetPostPredictionRulesQueryParams {
  gameType: string
  /**
   * forumId: userPublic , lottery
   */
  forumId: string
}

export const getPostPredictionRules = (
  data: IGetPostPredictionRulesQueryParams
): Promise<IBaseResponse<IPostPredictionRule[]>> => {
  return http.post('webgw' + perfix + '/bbsForumPost/postPredictionRules', data)
}
// 删除域名  /webgw/domain/delDomainConfig
export const delHttp = (data: DelRequest) => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editHttp = (data: IUpdateBbsPostQueryParams): Promise<IResponse<never>> => {
  return http.post(api.EditOne, data)
}

export const reqTreeHttp = (data: GetTreeRequest) => {
  return http.post<GetTreeResponse>(api.GetTreeList, data)
}

export const getBbsForumPostById = (
  data: IGetBbsForumPostByIdQueryParams
): Promise<IBaseResponse<IGetBbsForumPostByIdData>> => {
  return http.post(api.GetOne, data)
}

// 编辑域名  /editDomainConfig
export const updateBbsPost = (data: IUpdateBbsPostQueryParams): Promise<IBaseResponse<never>> => {
  return http.post(api.EditOne, data)
}

export const updateStatusApi = (data: any): Promise<IResponse<any>> => {
  return http.post('webgw' + perfix + '/bbsForumPost/updateStatus', { ...data, status: data.postStatus })
}
// 获取所有域名 /webgw/domain/getDomainConfig
export const reqHttpBBsForumList = (
  data: IReqHttpBBsForumListQueryParams
): Promise<IResponse<IReqHttpBBsForumListData>> => {
  return http.post(api.GetAll, data)
}

export const createBbsPost = (data: ICreateBbsPostQueryParams): Promise<IBaseResponse<ICreateBbsPostQueryParams>> => {
  if (!data.title) {
    if (data.postContent) {
      data.title = data.postContent.slice(0, 10)
    } else {
      data.title = '帖子标题'
    }
  }
  return http.post(api.AddOne, data)
}
export const getPostDetail = (data: { postId: string }): Promise<IBaseResponse<any>> => {
  return http.post('webgw' + perfix + '/bbsForumPost/detail', data)
}
// 新增回复
export const addReplyHttp = (data: AddReplyRequest) => {
  return http.post<AddReplyResponse>(api.AddReply, data)
}

export const likeHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw' + perfix + '/like/toggle', data)
}

export const dislikeHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw' + perfix + '/like/toggle', data)
}

export const favoriteHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw' + perfix + '/favorite/toggle', data)
}
export const cancelFavoriteHttp = (data: Partial<ActionRequest>) => {
  return http.post<ActionRequest>('webgw' + perfix + '/favorite/toggle', data)
}
export const getLotteryContentByPredictions = (predictions: PredictionInfo[]): Promise<IBaseResponse<any>> => {
  // const result = { postContent: 'test content' }
  // return new Promise((resolve) => {
  //   resolve({ success: true, data: result })
  // })
  return http.post('webgw' + perfix + '/bbsForumPost/getLotteryContentByPredictions', { predictions })
}
export const lastIssuePost = (data: ILastIssuePostParams): Promise<IBaseResponse<any>> => {
  return http.post('webgw' + perfix + '/bbsForumPost/lastIssuePost', data)
}
export function usePostApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    delHttp: (params?: any) => delHttp(injectSiteId(params)),
    addHttp: (params?: any) => addHttp(injectSiteId(params)),
    editHttp: (params?: any) => editHttp(injectSiteId(params)),
    reqHttp: (params?: any) => reqHttp(injectSiteId(params)),
    reqTreeHttp: (params?: any) => reqTreeHttp(injectSiteId(params)),
    addReplyHttp: (params?: any) => addReplyHttp(injectSiteId(params)),
    likeHttp: (params?: any) => likeHttp(injectSiteId(params)),
    dislikeHttp: (params?: any) => dislikeHttp(injectSiteId(params)),
    favoriteHttp: (params?: any) => favoriteHttp(injectSiteId(params)),
    cancelFavoriteHttp: (params?: any) => cancelFavoriteHttp(injectSiteId(params))
  }
}

export function usePostManagementApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    addReplyHttp: (params?: any) => addReplyHttp(injectSiteId(params)),
    cancelFavoriteHttp: (params?: any) => cancelFavoriteHttp(injectSiteId(params)),
    dislikeHttp: (params?: any) => dislikeHttp(injectSiteId(params)),
    favoriteHttp: (params?: any) => favoriteHttp(injectSiteId(params)),
    likeHttp: (params?: any) => likeHttp(injectSiteId(params)),
    reqTreeHttp: (params?: any) => reqTreeHttp(injectSiteId(params))
  }
}
