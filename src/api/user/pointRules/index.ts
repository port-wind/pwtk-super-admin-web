import http from '@/utils/http/index'
const prefix = '/super'
// 获取积分规则列表
export const reqPointRules = (params: any) => {
  return http.post('/webgw/score/listRule', { ...params })
}

// 获取星星规则详情
export const reqStarRulesDetail = (params: any) => {
  return http.post('/webgw/userScore/starList', { ...params })
}

// 获取积分规则详情
export const reqPointRulesDetail = (params: any) => {
  return http.post('/webgw' + prefix + '/userScore/list', { ...params })
}

// 获取积分活动列表
export const reqPointActivityList = () => {
  return http.get('/webgw' + prefix + '/userScore/listBizType')
}

// 获取用户积分余额
export const reqUserScoreBalance = () => {
  return http.get('/webgw/userScore/balance')
}

// 积分统计调用，在 /webgw' + prefix +'/score/statistics
export const reqScoreStatistics = () => {
  return http.get('/webgw/score/statistics')
}

// 星星统计调用，在 /webgw' + prefix +'/star/statistics
export const reqStarStatistics = () => {
  return http.get('/webgw/star/statistics')
}

// 分页获取积分规则列表
export const reqPointRulesList = (params?: any) => {
  if (!params) {
    params = {}
  }
  params.size = params?.size || 999
  params.page = params?.page || 1
  return http.post('/webgw' + prefix + 'score/listRule', { ...params })
}

// 分页获取星星规则列表
export const reqStarRulesList = (params?: any) => {
  if (!params) {
    params = {}
  }
  params.size = params?.size || 999
  params.page = params?.page || 1
  return http.post('/webgw/star/listRule', { ...params })
}

// 更新积分规则
export const reqUpdatePointRules = (params: any) => {
  return http.post('/webgw/score/updateRule', params)
}

// 更新星星规则
export const reqUpdateStarRules = (params: any) => {
  return http.post('/webgw/star/updateRule', params)
}

// 获取积分每日限制
export const reqPointDailyLimit = () => {
  return http.get('/webgw/score/dailyLimit')
}
