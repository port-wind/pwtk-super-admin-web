import http from '@/utils/http/index'

const prefix = 'super/'

export const getSpiderList = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/list`, data)
}

export const createSpider = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/create`, data)
}

export const getSpiderInfo = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/detail`, data)
}

export const updateSpider = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/update`, data)
}

export const updateStatus = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/updateStatus`, data)
}

export const getBaseUrlList = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/baseUrlList`, data)
}

export const getSpiderCheckList = (data: any) => {
  return http.post<any>(`webgw/${prefix}gamePictureConfirm/list`, data)
}

export const downloadIssuesByUrl = (data: any) => {
  return http.post<any>(`webgw/${prefix}gameTypeNewspaperIssue/downloadIssuesByUrl`, data)
}

export const getPureIssueBaseUrlList = (data: any) => {
  return http.post<any>(`webgw/${prefix}issueBaseUrl/baseUrlList`, data)
}

export const commitSpiderCheck = (data: any) => {
  return http.post<any>(`webgw/${prefix}gamePictureConfirm/commit`, data)
}
