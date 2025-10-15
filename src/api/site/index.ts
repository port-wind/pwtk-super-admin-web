import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '../type'
import type {
  ISketchData,
  ISketchListQueryParams,
  ITemplateListQueryParams,
  ISketchCodeQueryParams,
  ISketchEditQueryParams,
  ISketchCreateQueryParams,
  ISketchCodeDeleteQueryParams,
  IExistSketchNameQueryParams,
  IPromotionCodeSearchQueryParams,
  IPromotionCodeDeleteQueryParams,
  IPromotionCodeAddQueryParams,
  IPromotionCodeEditQueryParams,
  IBingWebSiteQueryParams,
  IBingWebsiteDomainQueryParams,
  IUnBingWebsiteDomainQueryParams,
  IDomainConfigBbsAndNavigaQueryParams,
  ITemplateDeleteQueryParams,
  ITemplateCreateQueryParams,
  ITemplateEditQueryParams,
  IRefWebsiteConfigQueryParams,
  IIsTemplateIdExitQueryParams,
  IIsTemplateNameExitQueryParams,
  IListBlurTemplateQueryParams,
  ITemplateListData,
  IReqSketchEditData,
  IReqSketchCreateData,
  IReqSketchCodeDeleteData,
  IReqExistSketchCodeData,
  IReqGetALLSketchListData,
  IReqPromotionCodeSearchData,
  IReqPromotionCodeDeleteData,
  IReqPromotionCodeAddData,
  IReqPromotionCodeEditData,
  IReqDomainData,
  ISetBingWebSiteData,
  IReqBingWebsiteDomainData,
  IReqUnBingWebsiteDomainData,
  IReqDomainConfigBbsAndNavigaData,
  IReqTemplateDeleteData,
  IReqTemplateEditData,
  IGetRefWebsiteConfigData,
  IReqGetAllTemplateIdData,
  IReqIsTemplateIdExitData,
  IReqIsTemplateNameExitData,
  IReqSysTemplateListData,
  IReqListBlurTemplateData,
  IReqListBlurTemplateAndSketchCodeData,
  IGetTemplateIdListData,
  IListBlurTemplateWithUserInfoData,
  IReqListTemplateData,
  IReqListBlurTemplateWithoutStatusData,
  IReqGetALLWebsiteListData,
  IReqSetWebSiteListIdData,
  ISetWebSiteListIdData,
  IGetWebSiteInfoData,
  IReqWebsiteCodeDeleteData,
  ICheckUserDomainData,
  IReqWebsiteCodeEditData,
  IReqClientTemplateInfoByWebsiteIdData,
  IReqSketchInfoByWebsiteIdData,
  IReqClientWebsiteConfigData,
  IReqTemplateInfoByTemplateIdData,
  IReqLangAndAreaCodesBasedOnSketchData,
  IReqSearchSketchCodeData,
  IReqSketchInfoBySketchCodeData,
  IUnBingWebsiteData,
  IListTemplateBySketchCodeWithPageData,
  IGetBingTemplateWebsiteData,
  IlistTemplateBySketchCodeWithPageQueryParams,
  IReqListBlurTemplateWithoutStatusQueryParams,
  IReqSearchSketchCodeQueryParams,
  ISketchInfoQueryParams,
  IReqGetALLWebsiteListQueryParams,
  IReqListTemplateQueryParams,
  IReqListBlurTemplateAndSketchCodeQueryParams,
  IListBlurTemplateAndSketchCodeData,
  IReqWebsiteCodeAddQueryParams,
  IListBlurTemplateWithUserInfoQueryParams,
  IReqGetALLSketchListParameter,
  IReqGetAllTemplateIdParameter,
  IReqSysTemplateListParameter,
  IGetBingTemplateWebsiteQueryParams
} from './types'
import { qs } from '@/utils/dataFormat'
const prefix = '/super'

//网站骨架列表查询
export const reqSketchList = (data: ISketchListQueryParams): Promise<IResponse<ISketchData>> => {
  return http.post('/webgw' + prefix + '/sketch/list', data)
}
//骨架编辑
export const reqSketchEdit = (data: ISketchEditQueryParams): Promise<IResponse<IReqSketchEditData>> => {
  return http.post('/webgw' + prefix + '/sketch/edit', data)
}
//骨架新增
export const reqSketchCreate = (data: ISketchCreateQueryParams): Promise<IResponse<IReqSketchCreateData>> => {
  return http.post('/webgw' + prefix + '/sketch/create', data)
}
//骨架删除
export const reqSketchCodeDelete = (data: ISketchCodeDeleteQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/sketch/editStatus', data)
}
//骨架名称是否存在
export const reqExistSketchName = (data: IExistSketchNameQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw' + prefix + '/sketch/existSketchName ', data)
}
//骨架编码是否存在
export const reqExistSketchCode = (data: ISketchCodeQueryParams): Promise<IBaseResponse<Boolean>> => {
  return http.post('/webgw' + prefix + '/sketch/existSketchCode', data)
}
//获取所有骨架列表
export const reqGetALLSketchList = (
  data: IReqGetALLSketchListParameter
): Promise<IResponse<IReqGetALLSketchListData>> => {
  const queryString = qs(data)
  if (queryString) {
    return http.get(`/webgw${prefix}/sketch/listSketchCode?${queryString}`)
  } else {
    return http.get(`/webgw${prefix}/sketch/listSketchCode`)
  }
}
//推广码查询
export const reqPromotionCodeSearch = (
  data: IPromotionCodeSearchQueryParams
): Promise<IResponse<IReqPromotionCodeSearchData>> => {
  return http.post('/webgw' + prefix + '/promotionCode/search', data)
}
//推广码删除
export const reqPromotionCodeDelete = (
  data: IPromotionCodeDeleteQueryParams
): Promise<IResponse<IReqPromotionCodeDeleteData>> => {
  return http.post('/webgw' + prefix + '/promotionCode/delete', data)
}
//推广码新增
export const reqPromotionCodeAdd = (
  data: IPromotionCodeAddQueryParams
): Promise<IResponse<IReqPromotionCodeAddData>> => {
  return http.post('/webgw' + prefix + '/promotionCode/add', data)
}
//推广码编辑
export const reqPromotionCodeEdit = (
  data: IPromotionCodeEditQueryParams
): Promise<IResponse<IReqPromotionCodeEditData>> => {
  return http.post('/webgw' + prefix + '/promotionCode/update', data)
}
//模版查询
export const reqTemplateList = (data: ITemplateListQueryParams): Promise<IResponse<ITemplateListData>> => {
  return http.post('/webgw' + prefix + '/template/list', data)
}
// 通过website的ID获取已绑定的域名和没有绑定的域名
export const reqDomain = (data: any): Promise<IResponse<IReqDomainData>> => {
  return http.post('/webgw' + prefix + '/website/getDomain', data)
}
// 域名绑定站点
export const setBingWebSite = (data: IBingWebSiteQueryParams): Promise<IResponse<ISetBingWebSiteData>> => {
  return http.post('/webgw' + prefix + '/domain/setBingWebSite', data)
}
// 已绑定域名中检索域名
export const reqBingWebsiteDomain = (
  data: IBingWebsiteDomainQueryParams
): Promise<IResponse<IReqBingWebsiteDomainData>> => {
  return http.post('/webgw' + prefix + '/website/getBingWebsiteDomain', data)
}
// 未绑定域名中检索域名
export const reqUnBingWebsiteDomain = (
  data: IUnBingWebsiteDomainQueryParams
): Promise<IResponse<IReqUnBingWebsiteDomainData>> => {
  return http.post('/webgw' + prefix + '/website/getUnBingWebsiteDomain', data)
}
// 模糊获取domain
export const reqDomainConfigBbsAndNaviga = (
  data: IDomainConfigBbsAndNavigaQueryParams
): Promise<IResponse<IReqDomainConfigBbsAndNavigaData>> => {
  return http.post('/webgw' + prefix + '/domain/getDomainConfigBbsAndNaviga', data)
}

//模版删除 修改状态
export const reqTemplateDelete = (data: ITemplateDeleteQueryParams): Promise<IResponse<IReqTemplateDeleteData>> => {
  return http.post('/webgw' + prefix + '/template/editStatus', data)
}
//模版新增
export const reqTemplateCreate = (data: ITemplateCreateQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/template/create', data)
}
//模版编辑
export const reqTemplateEdit = (data: ITemplateEditQueryParams): Promise<IResponse<IReqTemplateEditData>> => {
  return http.post('/webgw' + prefix + '/template/edit', data)
}
//检查ownerUserId和模板ID有没有绑定的站点
export const getRefWebsiteConfig = (
  data: IRefWebsiteConfigQueryParams
): Promise<IResponse<IGetRefWebsiteConfigData>> => {
  return http.post('/webgw' + prefix + '/website/getRefWebsiteConfig', data)
}
//获取所有的模版ID
export const reqGetAllTemplateId = (
  data: IReqGetAllTemplateIdParameter
): Promise<IResponse<IReqGetAllTemplateIdData>> => {
  const queryString = qs(data)
  if (queryString) {
    return http.get(`/webgw${prefix}/template/listTemplate?${queryString}`)
  } else {
    return http.get(`/webgw${prefix}/template/listTemplate`)
  }
}
//模版ID是否存在
export const reqIsTemplateIdExit = (
  data: IIsTemplateIdExitQueryParams
): Promise<IResponse<IReqIsTemplateIdExitData>> => {
  return http.post('/webgw' + prefix + '/template/existTemplate', data)
}
//模版名称是否存在
export const reqIsTemplateNameExit = (
  data: IIsTemplateNameExitQueryParams
): Promise<IResponse<IReqIsTemplateNameExitData>> => {
  return http.post('/webgw' + prefix + '/template/existTemplateName', data)
}
//获取所有的系统模版列表
export const reqSysTemplateList = (data: IReqSysTemplateListParameter): Promise<IResponse<IReqSysTemplateListData>> => {
  const queryString = qs(data)
  if (queryString) {
    return http.get(`/webgw${prefix}/template/getSysTemplate?${queryString}`)
  } else {
    return http.get(`/webgw${prefix}/template/getSysTemplate`)
  }
}
//通过模糊查询获取所有的模版ID(查询出的是处于有效状态的模版ID)
export const reqListBlurTemplate = (
  data: IListBlurTemplateQueryParams
): Promise<IResponse<IReqListBlurTemplateData>> => {
  return http.post('/webgw' + prefix + '/template/listBlurTemplate', data)
}
// https://dev-torna.pwtk.cc/#/view/r2jRVK2G
//通过模糊查询获取所有的模版ID和模版ID对应的模版名称和草图代码(查询出的是处于有效状态的模版ID)
export const reqListBlurTemplateAndSketchCode = (
  data: IReqListBlurTemplateAndSketchCodeQueryParams
): Promise<IBaseResponse<IListBlurTemplateAndSketchCodeData[]>> => {
  return http.post('/webgw' + prefix + '/template/listBlurTemplateAndSketchCode', data)
}
// cyu panya mezurai  miti hiyoukakaru  youyuu semaku tomamerareru anzei reiji fukuro jikannkakaru matase omikagi jizenn nagare nidai mottosumuzu kauhituyougaaru anzen torikumeru 　いちだいふ kaikei jizenn tani nidai  reijikauhituyou okyaku
// speed wadai sport  3.kokunai saisin kazu 4.kuruma uten itijikann tanosimikudasai   1. 4 s  seikai jidousya speed degisn sport  kokunai kazu jisai  norukuruma modal
//获取模板list
export const getTemplateIdList = (data: {
  websiteId: string
  ownerUserId: string
}): Promise<IResponse<IGetTemplateIdListData>> => {
  return http.post('/webgw' + prefix + '/domain/getTemplateIdList', data)
}

//通过模糊查询获取所有的模版ID(查询出的是传入用户Id的，处于有效状态的模版ID)
export const listBlurTemplateWithUserInfo = (
  data: IListBlurTemplateWithUserInfoQueryParams
): Promise<IBaseResponse<IListBlurTemplateWithUserInfoData[]>> => {
  return http.post('/webgw' + prefix + '/template/listBlurTemplateWithUserInfo', data)
}

//已经绑定的站点模板下拉列表 模糊匹配
export const reqListTemplate = (data: IReqListTemplateQueryParams): Promise<IBaseResponse<string[]>> => {
  return http.post('/webgw' + prefix + '/website/getlistTemplate', data)
}

//模糊查询获取所有的模版ID website all table
export const reqListBlurTemplateWithoutStatus = (
  data: IReqListBlurTemplateWithoutStatusQueryParams
): Promise<IResponse<IReqListBlurTemplateWithoutStatusData>> => {
  return http.post('/webgw' + prefix + '/template/listBlurTemplateWithoutStatus', data)
}

//获取所有站点
export const reqGetALLWebsiteList = (
  data: IReqGetALLWebsiteListQueryParams
): Promise<IResponse<IReqGetALLWebsiteListData>> => {
  return http.post('/webgw' + prefix + '/website/getWebsiteConfig', data)
}
//获取站点Idlist 模糊查询
export const reqSetWebSiteListId = (data: any): Promise<IResponse<IReqSetWebSiteListIdData>> => {
  return http.post('/webgw' + prefix + '/domain/setWebSiteListId', data)
}
//获取站点Idlist
export const setWebSiteListId = (data: any): Promise<IResponse<ISetWebSiteListIdData>> => {
  return http.post('/webgw' + prefix + '/domain/setWebSiteListId', data)
}
//获取启用的站点list
export const getWebSiteInfo = (data: any): Promise<IResponse<IGetWebSiteInfoData>> => {
  return http.post('/webgw' + prefix + '/domain/getWebSiteInfo', data)
}

//站点删除
export const reqWebsiteCodeDelete = (data: any): Promise<IResponse<IReqWebsiteCodeDeleteData>> => {
  return http.post('/webgw' + prefix + '/website/delWebsiteConfig', data)
}
//站点新增
export const reqWebsiteCodeAdd = (data: IReqWebsiteCodeAddQueryParams): Promise<IBaseResponse<never>> => {
  return http.post('/webgw' + prefix + '/website/addWebsiteConfig', data)
}
//检查旧的ownerUserId有没有绑定的domain
export const checkUserDomain = (data: any): Promise<IResponse<ICheckUserDomainData>> => {
  return http.post('/webgw' + prefix + '/website/checkUserDomain', data)
}
//站点编辑
export const reqWebsiteCodeEdit = (data: any): Promise<IResponse<IReqWebsiteCodeEditData>> => {
  return http.post('/webgw' + prefix + '/website/editWebsiteConfig', data)
}
// 通过website的Id获取模板信息
export const reqClientTemplateInfoByWebsiteId = (
  data: any
): Promise<IResponse<IReqClientTemplateInfoByWebsiteIdData>> => {
  return http.post('/webgw' + prefix + '/website/getTemplate', data)
}
// 通过website的ID获取草图信息
export const reqSketchInfoByWebsiteId = (data: any): Promise<IResponse<IReqSketchInfoByWebsiteIdData>> => {
  return http.post('/webgw' + prefix + '/website/getSketch', data)
}
// 通过webSiteId获取信息
export const reqClientWebsiteConfig = (data: any): Promise<IResponse<IReqClientWebsiteConfigData>> => {
  return http.post('/webgw' + prefix + '/website/getClientWebsiteConfig', data)
}
// 通过模版ID查询模版信息（完全匹配）
export const reqTemplateInfoByTemplateId = (data: any): Promise<IResponse<IReqTemplateInfoByTemplateIdData>> => {
  return http.post('/webgw' + prefix + '/template/getTemplateInfoByTemplateId', data)
}
// 通过模糊查询获取所有的模版ID
/* export const reqListBlurTemplate = (data: any): Promise<IResponse<IConstData>> => {
  return http.post('/webgw' +prefix +'/template/listBlurTemplate', data)
} */
// 查询草图编码对应的对应的语言列表和适用的地区列表,这个请求到的优先级比reqClientWebsiteSketch权重要高。修正：站点详情权重大于template大于sketch
export const reqLangAndAreaCodesBasedOnSketch = (
  data: any
): Promise<IResponse<IReqLangAndAreaCodesBasedOnSketchData>> => {
  return http.post('/webgw' + prefix + '/sketch/langAndAreaCodes', data)
}

// 通过模糊查询获取所有的草图Code
export const reqSearchSketchCode = (
  data: IReqSearchSketchCodeQueryParams
): Promise<IResponse<IReqSearchSketchCodeData>> => {
  return http.post('/webgw' + prefix + '/sketch/listBlurSketchCode', data)
}

//通过草图编码查询草图信息
export const reqSketchInfoBySketchCode = (
  data: ISketchInfoQueryParams
): Promise<IResponse<IReqSketchInfoBySketchCodeData>> => {
  return http.post('/webgw' + prefix + '/sketch/getSketchInfoBySketchCode', data)
}
//域名解绑站点
export const unBingWebsite = (data: any): Promise<IResponse<IUnBingWebsiteData>> => {
  return http.post('/webgw' + prefix + '/domain/setUnBingWebSite', data)
}

//通过草图代码,获取绑定该草图代码的模版id列表(有分页功能)
export const listTemplateBySketchCodeWithPage = (
  data: IlistTemplateBySketchCodeWithPageQueryParams
): Promise<IResponse<IListTemplateBySketchCodeWithPageData>> => {
  return http.post('/webgw' + prefix + '/template/listTemplateBySketchCodeWithPage', data)
}

//通过引用模板ID获取绑定模板的站点
export const getBingTemplateWebsite = (
  data: IGetBingTemplateWebsiteQueryParams
): Promise<IResponse<IGetBingTemplateWebsiteData>> => {
  return http.post('/webgw' + prefix + '/website/getBingTemplateWebsite', data)
}
