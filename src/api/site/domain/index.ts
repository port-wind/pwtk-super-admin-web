import http from '@/utils/http/index'
import type {
  IReqDomainQueryParams,
  EditResponse,
  IDelDomainQueryParams,
  DelResponse,
  IAddDomainQueryParams,
  AddResponse,
  IReqDomainData,
  IGetDomainDetailQueryParams,
  IGetDomainDetailData,
  IGetLangCodesData,
  IGetLangCodesQueryParams,
  IGetAreaCodesData,
  IGetAreaCodesQueryParams,
  IGetWebsiteRefMsgByDomainData,
  IGetWebsiteRefMsgByDomainQueryParams,
  IGetTemplateRefMsgByDomainData,
  IGetTemplateRefMsgByDomainQueryParams,
  IGetSketchRefMsgByDomainData,
  IGetSketchRefMsgByDomainQueryParams,
  ISetWebSiteListIdData,
  ISetWebSiteListIdQueryParams,
  IAddDomainData,
  IDelDomainData,
  IEditDomainData,
  IReqAllUserIDData,
  IEditDomainQueryParams,
  IReqAllUserIDQueryParams
} from './types'
import type { IResponse } from '@/api/type'
const prefix = '/super'
enum api {
  GetAll = '/webgw' + prefix + '/domain/getDomainConfig',
  AddOne = '/webgw' + prefix + '/domain/addDomainConfig',
  DeleteOne = '/webgw' + prefix + '/domain/delDomainConfig',
  EditOne = '/webgw' + prefix + '/domain/editDomainConfig',
  GetOne = '/webgw' + prefix + '/domain/getClientDomainConfig',
  GetWebsiteRefMsgByDomain = '/webgw' + prefix + '/domain/getWebSite',
  GetTemplateRefMsgByDomain = '/webgw' + prefix + '/domain/getTemplate',
  GetSketchRefMsgByDomain = '/webgw' + prefix + '/domain/getSketch',
  GetLangCodes = '/webgw' + prefix + '/domain/getLangCodes',
  GetAreaCodes = '/webgw' + prefix + '/domain/getAreaCodes'
}

// 获取所有域名 /webgw/domain/getDomainConfig
export const reqDomain = (data: IReqDomainQueryParams): Promise<IResponse<IReqDomainData>> => {
  return http.post(api.GetAll, data)
}

// 添加域名  /webgw/domain/addDomainCon
export const addDomain = (data: IAddDomainQueryParams): Promise<IResponse<IAddDomainData>> => {
  return http.post<AddResponse>(api.AddOne, data)
}

// 删除域名  /webgw/domain/delDomainConfig
export const delDomain = (data: IDelDomainQueryParams): Promise<IResponse<IDelDomainData>> => {
  return http.post<DelResponse>(api.DeleteOne, data)
}

// 编辑域名  /editDomainConfig
export const editDomain = (data: IEditDomainQueryParams): Promise<IResponse<IEditDomainData>> => {
  return http.post<EditResponse>(api.EditOne, data)
}

// 获取所有用户ID
export const reqAllUserID = (data: IReqAllUserIDQueryParams): Promise<IResponse<IReqAllUserIDData>> => {
  return http.post(api.EditOne, data)
}

// 通过domain获取一条具体信息
export const getDomainDetail = (data: IGetDomainDetailQueryParams): Promise<IResponse<IGetDomainDetailData>> => {
  return http.post(api.GetOne, data)
}

// 获取语言list
export const GetLangCodes = (data: IGetLangCodesQueryParams): Promise<IResponse<IGetLangCodesData>> => {
  return http.post(api.GetLangCodes, data)
}

// 获取地区list
export const GetAreaCodes = (data: IGetAreaCodesQueryParams): Promise<IResponse<IGetAreaCodesData>> => {
  return http.post(api.GetAreaCodes, data)
}

// 通过domain获取绑定的站点信息
export const getWebsiteRefMsgByDomain = (
  data: IGetWebsiteRefMsgByDomainQueryParams
): Promise<IResponse<IGetWebsiteRefMsgByDomainData>> => {
  return http.post(api.GetWebsiteRefMsgByDomain, data)
}

// 通过domain获取模板信息
export const getTemplateRefMsgByDomain = (
  data: IGetTemplateRefMsgByDomainQueryParams
): Promise<IResponse<IGetTemplateRefMsgByDomainData>> => {
  return http.post(api.GetTemplateRefMsgByDomain, data)
}

// 通过domain获取草图信息
export const getSketchRefMsgByDomain = (
  data: IGetSketchRefMsgByDomainQueryParams
): Promise<IResponse<IGetSketchRefMsgByDomainData>> => {
  return http.post(api.GetSketchRefMsgByDomain, data)
}

// 获取站点Idlist
export const setWebSiteListId = (data: ISetWebSiteListIdQueryParams): Promise<IResponse<ISetWebSiteListIdData>> => {
  return http.post('/webgw/domain/setWebSiteListId', data)
}
