import http from '@/utils/http/index'
import type {
  IReqListUserFavoriteQueryParams,
  IReqListUserFavoriteData,
  IReqUserListFilterQueryParams,
  IReqUserListFilterData,
  IReqUserListQueryParams,
  IReqUserListData,
  IReqUserQueryQueryParams,
  IReqUserQueryData,
  IReqUserEditQueryParams,
  IReqUserCreateQueryParams,
  IReqUserCreateData,
  IReqUpdateUserQueryParams,
  IReqUpdateUserData,
  IReqBlocklistQueryParams,
  IReqBlocklistData,
  IReqRelationshipQueryParams,
  IReqRelationshipData,
  IReqFavoriteQueryParams,
  IReqFavoriteData,
  IReqLikeQueryParams,
  IReqLikeData,
  IReqUserVisitQueryParams,
  IReqUserVisitData,
  IReqDeviceVisitQueryParams,
  IReqDeviceVisitData,
  IReqListUserLikeQueryParams,
  IReqListUserLikeData,
  IReqListDeviceLikeQueryParams,
  IReqListDeviceLikeData,
  IReqListDeviceFavoriteQueryParams,
  IReqListDeviceFavoriteData,
  IReqListUserVoteQueryParams,
  IReqListUserVoteData,
  IReqListDeviceVoteQueryParams,
  IReqListDeviceVoteData,
  IReqListUserViewHistoryQueryParams,
  IReqListUserViewHistoryData,
  IReqListDeviceViewHistoryQueryParams,
  IReqListDeviceViewHistoryData,
  IReqListUserRelationshipQueryParams,
  IReqListUserRelationshipData,
  IReqListDeviceRelationshipQueryParams,
  IReqListDeviceRelationshipData,
  IReqGameListQueryParams,
  IReqGameListData,
  IReqWebsiteManageListQueryParams,
  IReqWebsiteManageListData,
  IReqBbsForumPostListQueryParams,
  IReqBbsForumPostListData,
  IReqNewspaperIssuePostListQueryParams,
  IReqNewspaperIssuePostListData,
  IReqListPostIssueQueryParams,
  IReqListPostIssueData,
  IReqBbsForumListPostIssueQueryParams,
  IReqBbsForumListPostIssueData,
  IReqShowEmailQueryParams,
  IReqShowEmailData,
  IReqUserAchievementQueryParams,
  IReqUserAchievementData,
  ISetUserAchievementQueryParams,
  ISetUserAchievementData,
  ISetTransferScoreQueryParams,
  ISetTransferScoreData,
  IReqUserListByUserIdAndNameQueryParams,
  IReqUserListByUserIdAndNameData
} from './type'
import type { IBaseResponse, IResponse } from '@/api/type'
import showErrorMessage from '@/utils/showErrorMessage'
import type { Ref } from 'vue'
import { qs } from '@/utils/dataFormat'
const prefix = '/super'
//获取用户列表 精准 模糊查询
export const reqUserList = (data: IReqUserListQueryParams): Promise<IResponse<IReqUserListData>> => {
  return http.post('/webgw' + prefix + '/user/list', data)
}

export const reqUserListByUserIdAndName = (
  data: IReqUserListByUserIdAndNameQueryParams
): Promise<IResponse<IReqUserListByUserIdAndNameData>> => {
  return http.post('/webgw' + prefix + '/user/dynamic-search', data)
}
//获取用户列表辅助查询 模糊
export const reqUserQuery = (data: IReqUserQueryQueryParams): Promise<IResponse<IReqUserQueryData>> => {
  return http.post('/webgw' + prefix + '/user/query', data)
}
//获取用户列表 精准 模糊查询
export const reqUserListFilter = (data: IReqUserListFilterQueryParams): Promise<IResponse<IReqUserListFilterData>> => {
  return http.post('/webgw' + prefix + '/user/listfilter', data)
}
//编辑用户
export const reqUserEdit = (data: IReqUserEditQueryParams): Promise<IBaseResponse<number>> => {
  return http.post('/webgw' + prefix + '/user/edit', data)
}
//新增用户
export const reqUserCreate = (data: IReqUserCreateQueryParams): Promise<IBaseResponse<number>> => {
  return http.post('/webgw' + prefix + '/user/add', data)
}
//更新用户状态
export const reqUpdateUser = (data: IReqUpdateUserQueryParams): Promise<IResponse<IReqUpdateUserData>> => {
  return http.post('/webgw' + prefix + '/user/status', data)
}
//查询用户黑名单
export const reqBlocklist = (data: IReqBlocklistQueryParams): Promise<IResponse<IReqBlocklistData>> => {
  return http.post('/webgw' + prefix + '/userBlocklist/list', data)
}
//用户关系（关注/被关注）
export const reqRelationship = (data: IReqRelationshipQueryParams): Promise<IResponse<IReqRelationshipData>> => {
  return http.post('/webgw' + prefix + '/userRelationship/list', data)
}
//用户收藏相关
export const reqFavorite = (data: IReqFavoriteQueryParams): Promise<IResponse<IReqFavoriteData>> => {
  return http.post('/webgw' + prefix + '/userFavorite/list', data)
}
//用户点赞相关
export const reqLike = (data: IReqLikeQueryParams): Promise<IResponse<IReqLikeData>> => {
  return http.post('/webgw' + prefix + '/userLike/list', data)
}
export interface IReqShowMobileQueryParams {
  userId: string
  manageSiteId: string
}
//查看完整手机号码
export const reqShowMobile = (data: IReqShowMobileQueryParams): Promise<IResponse<any>> => {
  // return http.get(`/webgw/super/user/showMobile/${data.userId}`)
  const queryString = qs(data)
  if (queryString) {
    return http.get(`/webgw${prefix}/user/showMobile/${data.userId}?${queryString}`)
  } else {
    return http.get(`/webgw${prefix}/user/showMobile/${data.userId}`)
  }
}

//用户访客
export const reqUserVisit = (data: IReqUserVisitQueryParams): Promise<IResponse<IReqUserVisitData>> => {
  return http.post(`/webgw${prefix}/visit/listUserVisitor`, data)
}
//匿名访客
export const reqDeviceVisit = (data: IReqDeviceVisitQueryParams): Promise<IResponse<IReqDeviceVisitData>> => {
  return http.post(`/webgw${prefix}/visit/listDeviceVisitor`, data)
}
//用户点赞
export const reqListUserLike = (data: IReqListUserLikeQueryParams): Promise<IResponse<IReqListUserLikeData>> => {
  return http.post(`/webgw${prefix}/like/listUserLike`, data)
}
//匿名点赞
export const reqListDeviceLike = (data: IReqListDeviceLikeQueryParams): Promise<IResponse<IReqListDeviceLikeData>> => {
  return http.post(`/webgw${prefix}/like/listDeviceLike`, data)
}

//匿名收藏
export const reqListDeviceFavorite = (
  data: IReqListDeviceFavoriteQueryParams
): Promise<IResponse<IReqListDeviceFavoriteData>> => {
  return http.post(`/webgw${prefix}/favorite/listDeviceFavorite`, data)
}
//用户投票
export const reqListUserVote = (data: IReqListUserVoteQueryParams): Promise<IResponse<IReqListUserVoteData>> => {
  return http.post(`/webgw${prefix}/vote/listUserVote`, data)
}
//匿名投票
export const reqListDeviceVote = (data: IReqListDeviceVoteQueryParams): Promise<IResponse<IReqListDeviceVoteData>> => {
  return http.post(`/webgw${prefix}/vote/listDeviceVote`, data)
}
//用户浏览历史
export const reqListUserViewHistory = (
  data: IReqListUserViewHistoryQueryParams
): Promise<IResponse<IReqListUserViewHistoryData>> => {
  return http.post(`/webgw${prefix}/viewhistory/listUserViewHistory`, data)
}
//匿名浏览历史
export const reqListDeviceViewHistory = (
  data: IReqListDeviceViewHistoryQueryParams
): Promise<IResponse<IReqListDeviceViewHistoryData>> => {
  return http.post(`/webgw${prefix}/viewhistory/listDeviceViewHistory`, data)
}
//用户关注
export const reqListUserRelationship = (
  data: IReqListUserRelationshipQueryParams
): Promise<IResponse<IReqListUserRelationshipData>> => {
  return http.post(`/webgw${prefix}/relationship/listUserRelationship`, data)
}
//匿名关注
export const reqListDeviceRelationship = (
  data: IReqListDeviceRelationshipQueryParams
): Promise<IResponse<IReqListDeviceRelationshipData>> => {
  return http.post(`/webgw${prefix}/relationship/listDeviceRelationship`, data)
}
//获取游戏类型
export const reqGameList = (data: IReqGameListQueryParams): Promise<IResponse<IReqGameListData>> => {
  return http.post(`/webgw${prefix}/tk/gameTypePlatform/list`, data)
}

//获取管理站点
export const reqWebsiteManageList = (
  data: IReqWebsiteManageListQueryParams
): Promise<IResponse<IReqWebsiteManageListData>> => {
  return http.post('webgw/websiteManage/getWebsiteManage', data)
}

//获取用户评论帖子列表
export const reqBbsForumPostList = (
  data: IReqBbsForumPostListQueryParams
): Promise<IResponse<IReqBbsForumPostListData>> => {
  return http.post('/webgw' + prefix + '/bbsForumPost/list', data)
}
//获取用户评论图库列表
export const reqNewspaperIssuePostList = (
  data: IReqNewspaperIssuePostListQueryParams
): Promise<IResponse<IReqNewspaperIssuePostListData>> => {
  return http.post('/webgw' + prefix + '/tk/newspaperIssuePost/list', data)
}
//获取用户评论图库期数列表
export const reqListPostIssue = (data: IReqListPostIssueQueryParams): Promise<IResponse<IReqListPostIssueData>> => {
  return http.post('/webgw' + prefix + '/tk/newspaperIssuePost/listPostIssue ', data)
}
//获取用户帖子期数列表
export const reqBbsForumListPostIssue = (
  data: IReqBbsForumListPostIssueQueryParams
): Promise<IResponse<IReqBbsForumListPostIssueData>> => {
  return http.post(`/webgw${prefix}/bbsForumPost/listPostIssue`, data)
}
//查看完整邮箱号码
export const reqShowEmail = (userId: IReqShowEmailQueryParams): Promise<IResponse<IReqShowEmailData>> => {
  return http.get(`/webgw${prefix}/user/showEmail/${userId}`)
}

//获取用户勋章
export const reqUserAchievement = (
  data: IReqUserAchievementQueryParams
): Promise<IResponse<IReqUserAchievementData>> => {
  return http.post('/webgw' + prefix + '/userMedal/page', data)
}

//设置用户勋章
export const setUserAchievement = (
  data: ISetUserAchievementQueryParams
): Promise<IResponse<ISetUserAchievementData>> => {
  return http.post('/webgw' + prefix + '/userMedal/set', data)
}

//单个用户积分
export const setTransferScore = (data: ISetTransferScoreQueryParams): Promise<IResponse<ISetTransferScoreData>> => {
  return http.post('/webgw' + prefix + '/score/transferScore', data)
}

export const reqUserListByUserId = async (req: any) => {
  const newReq = {
    ...req,
    searchId: req.userId
  }
  delete newReq.userId
  try {
    const response: any = await reqUserList(newReq)
    if (response.success) {
      return response
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

//用户收藏
export const reqListUserFavorite = (
  data: IReqListUserFavoriteQueryParams
): Promise<IResponse<IReqListUserFavoriteData>> => {
  return http.post(`/webgw${prefix}/favorite/listUserFavorite`, data)
}

// http.get
//获取用户期数
export const reqListUserVoteIssue = (): Promise<IBaseResponse<never>> => {
  return http.get('/webgw' + prefix + '/vote/listUserVoteIssue')
}

// 不要加 ManageSiteId 报错
//查询单个用户详情
export const reqUserInfo = (userId: string): Promise<IBaseResponse<IReqUserListData>> => {
  return http.get(`/webgw${prefix}/user/${userId}`)
}

export function useUserApi(manageSiteId: Ref<string>) {
  const injectSiteId = (params: any = {}) => ({
    ...params,
    manageSiteId: manageSiteId.value
  })

  return {
    reqUserList: (params?: any) => reqUserList(injectSiteId(params)),
    reqUserListByUserId: (params?: any) => reqUserListByUserId(injectSiteId(params))
  }
}
