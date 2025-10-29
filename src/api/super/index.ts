import http from '@/utils/http/index'
import type {
  IGetSSOTokenData,
  IGetSSOTokenQueryParams,
  IReqManageSiteListData,
  IReqManageSiteListQueryParams,
  IReqUserListPushQueryParams
} from './types'
import { qs } from '@/utils/dataFormat'
import type { IBaseResponse, IResponse } from '../type'
const super_prefix = '/super'
const game_prefix = '/game'
enum api {
  GetAll = '/webgw' + super_prefix + '/manageSite/listValidManageSite',
  GetSSOToken = '/webgw' + super_prefix + '/manageSite/getSSOToken',
  ReqWebsitePush = '/webgw' + super_prefix + '/tk/website/push',
  ReqWebsiteGuaranteePush = '/webgw' + super_prefix + '/tk/website/guarantee/push',
  ReqGameTypeSeriesPush = '/webgw' + super_prefix + '/tk/gameTypeSeries/push',
  ReqBbsPush = '/webgw' + super_prefix + '/bbs/push',
  ReqTkBbsPush = '/webgw' + super_prefix + '/tk/bbs/push',

  ReqBbsForumPostPush = '/webgw' + super_prefix + '/bbsForumPost/push',
  ReqBbsForumPush = '/webgw' + super_prefix + '/bbsForum/push',
  ReqBbsMainboardPush = '/webgw' + super_prefix + '/bbsMainboard/push',
  ReqBbsForumAttachmentPush = '/webgw' + super_prefix + '/bbsForumAttachment/push',
  ReqIssueMappingPush = '/webgw' + super_prefix + '/issueMapping/push',
  ReqGameTypeNewspaperPush = '/webgw' + super_prefix + '/gameTypeNewspaper/push',
  ReqNewspaperIssuePush = '/webgw' + super_prefix + '/gameTypeNewspaperIssue/push',
  ReqGameTypePush = '/webgw' + game_prefix + '/open/date/push',
  ReqUserListPush = '/webgw' + super_prefix + '/user/push',
  ReqGameTypePlatformPush = '/webgw' + super_prefix + '/tk/gameTypePlatform/push'
}

/**
 * 请求头里要有 CID 和 token
 * @param data
 * @returns
 */
export const getSSOToken = (data: IGetSSOTokenQueryParams): Promise<IBaseResponse<IGetSSOTokenData>> => {
  const queryString = qs(data)
  return http.get(`/webgw${super_prefix}/manageSite/getSSOToken?${queryString}`)
}

export const reqManageSiteList = (data: IReqManageSiteListQueryParams): Promise<IResponse<IReqManageSiteListData>> => {
  return http.post(api.GetAll, data)
}

export const reqWebsitePush = (data: any) => {
  return http.post(api.ReqWebsitePush, data)
}

export const reqWebsiteGuaranteePush = (data: any) => {
  return http.post(api.ReqWebsiteGuaranteePush, data)
}

export const reqBbsPush = (data: any) => {
  return http.post(api.ReqBbsPush, data)
}

export const reqTkBbsPush = (data: any) => {
  return http.post(api.ReqTkBbsPush, data)
}
export const reqGameTypeSeriesPush = (data: any) => {
  return http.post(api.ReqGameTypeSeriesPush, data)
}
export const reqBbsForumPostPush = (data: any) => {
  return http.post(api.ReqBbsForumPostPush, data)
}

export const reqBbsForumPush = (data: any) => {
  return http.post(api.ReqBbsForumPush, data)
}

export const reqBbsMainboardPush = (data: any) => {
  return http.post(api.ReqBbsMainboardPush, data)
}

export const reqBbsForumAttachmentPush = (data: any) => {
  return http.post(api.ReqBbsForumAttachmentPush, data)
}

export const reqIssueMappingPush = (data: any) => http.post(api.ReqIssueMappingPush, data)

export const reqGameTypeNewspaperPush = (data: any) => http.post(api.ReqGameTypeNewspaperPush, data)

export const reqNewspaperIssuePush = (data: any) => http.post(api.ReqNewspaperIssuePush, data)

export const reqGameOpenDatePush = (data: any) => http.post(api.ReqGameTypePush, data)

export const reqUserListPush = (data: IReqUserListPushQueryParams): Promise<IResponse<never>> =>
  http.post(api.ReqUserListPush, data)

export const reqGameTypePlatformPush = (data: any) => http.post(api.ReqGameTypePlatformPush, data)
