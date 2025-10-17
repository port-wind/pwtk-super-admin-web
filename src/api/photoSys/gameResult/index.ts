import type { IBaseResponse, IResponse } from '@/api/type'
import http from '@/utils/http/index'

export interface ListParams {
  page: number
  size: number
  year: string
  issue: string
}

export interface HistoryItem {
  issue: number
  year: number
  color: string
  openTime: string
  result: string
  teNum: number
  num1: number
  num2: number
  num3: number
  num4: number
  num5: number
  num6: number
  recordTime: string
  fiveElements: string
  oddEven: string
  totalOddEven: string
  size: string
  totalSize: string
  tePrefix: number
  teSuffix: number
  animalFlag: string
  totalNum: number
  totalNumSize: string
  totalNumOddEven: string
  animalCount: number
  suffixCount: number
  status: string
  numInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
}

export interface ReviewItem {
  issue: number
  year: number
  gameType: number
  firstCheckNum1: number | ''
  firstCheckNum2: number | ''
  firstCheckNum3: number | ''
  firstCheckNum4: number | ''
  firstCheckNum5: number | ''
  firstCheckNum6: number | ''
  firstCheckNumTe: number | ''
  firstCheckTime: string
  firstCheckLastUpdateTime: string
  firstCheckUpdateCount: number
  firstCheckIsApi: 'y' | 'n'
  firstCheckOpid: string
  firstCheckOper: string
  firstCheckMemo: string
  doubleCheckNum1: number | ''
  doubleCheckNum2: number | ''
  doubleCheckNum3: number | ''
  doubleCheckNum4: number | ''
  doubleCheckNum5: number | ''
  doubleCheckNum6: number | ''
  doubleCheckNumTe: number | ''
  doubleCheckTime: string
  doubleCheckLastUpdateTime: string
  doubleCheckUpdateCount: number
  doubleCheckIsApi: 'y' | 'n'
  doubleCheckOpid: string
  doubleCheckOper: string
  doubleCheckMemo: string
  compareResult: 'y' | 'n'
  isAutoConfirm: 'y' | 'n' | 's'
  firstCheckNumsInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
  doubleCheckNumsInfo: {
    fiveElements: 'j' | 'm' | 's' | 'h' | 't'
    oddEven: 'e' | 's'
    size: 'b' | 's'
    color: 'R' | 'B' | 'G'
    num: number
    index: number
    shengxiao: string
  }[]
  firstCheckGameDataFrom: string
  existFirstCheck: string
  existDoubleCheck: string
  doubleCheckGameDataFrom: string
}

export interface ResultType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: HistoryItem[]
  }
}

export interface ReviewResultType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    total: number
    list: ReviewItem[]
  }
}

export interface CheckParams {
  issue: number
  year: number
  doubleCheckNum1: number
  doubleCheckNum2: number
  doubleCheckNum3: number
  doubleCheckNum4: number
  doubleCheckNum5: number
  doubleCheckNum6: number
  doubleCheckNumTe: number
  doubleCheckMemo: string
}

export interface InsertOrUpdateFirstCheckParams {
  issue: number | null | string
  year: number | null
  firstCheckNum1: number | null
  firstCheckNum2: number | null
  firstCheckNum3: number | null
  firstCheckNum4: number | null
  firstCheckNum5: number | null
  firstCheckNum6: number | null
  firstCheckNumTe: number | null
  firstCheckMemo: string
}

export interface InsertOrUpdateDoubleCheckParams {
  issue: number | null
  year: number | null
  doubleCheckNum1: number | null
  doubleCheckNum2: number | null
  doubleCheckNum3: number | null
  doubleCheckNum4: number | null
  doubleCheckNum5: number | null
  doubleCheckNum6: number | null
  doubleCheckNumTe: number | null
  doubleCheckMemo: string
}

export interface PushReviewParams {
  issue: number
  year: number
  gameType: number
  confirmResult: boolean
}

export interface ResType {
  success: boolean
  errCode: string
  errMessage: string
}

export interface PushDataParams {
  issue: number | null
  year: number
  gameType: number
}

export interface OpenDateItem {
  issue: number | null
  gameType: number
  openDate: string
}

export interface OpenDateResType {
  success: boolean
  errCode: string
  errMessage: string
  data: {
    openDateList: OpenDateItem[]
  }
}

export interface EditOpenDateParams {
  year: number
  month: number
  gameType: number
  openDateList: OpenDateItem[]
}

// 澳6开奖历史表
export const getAHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/aSix/list', { ...data, sortOrder: 'DESC', sortName: 'issue' })
}

// 港6开奖历史表
export const getHKHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/hkSix/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 新6开奖历史表
export const getSGHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/sgSix/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 台6开奖历史表
export const getTWHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/twSix/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 新澳6开奖历史表
export const getXAHistory = (data: ListParams) => {
  return http.post<ResultType>('webgw/xaSix/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 快乐8开奖历史表
export const getKL8History = (data: ListParams) => {
  return http.post<ResultType>('webgw/kl8/list', { ...data, sortOrder: 'DESC' })
}

// 澳6开奖开奖结果
export const getAReview = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/a6/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 港6开奖开奖结果
export const getHKReview = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/hk6/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 新6开奖开奖结果
export const getSGReview = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/sg6/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 台6开奖开奖结果
export const getTWReview = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/tw6/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 新澳6开奖开奖结果
export const getXAReview = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/xa6/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

// 新澳6开奖开奖结果
export const getKL8Review = (data: ListParams) => {
  return http.post<ReviewResultType>('webgw/game/type/kl8/list', {
    ...data,
    sortOrder: 'DESC',
    sortName: 'issue'
  })
}

export type TGameId = 'aSix' | 'hkSix' | 'sgSix' | 'twSix' | 'xaSix' | 'kl8'

export type TGameTypeNumber = 'a6' | 'hk6' | 'sg6' | 'tw6' | 'xa6' | 'kl8'

export interface IGetGameHistoryQueryParams {
  page: number
  size: number
  year: number
  sortOrder: 'DESC' | 'ASC'
  // issue: number  不需要传这个参数了
}

// 新增或者修改澳6的复核结果
export const updateOrInsertAReview = (data: CheckParams) => {
  return http.post<ResType>('webgw/game/type/a6/updateOrInsertDoubleCheck', {
    ...data,
    gameType: 2032
  })
}

// 新增或者修改港6的复核结果
export const updateOrInsertHKReview = (data: CheckParams) => {
  return http.post<ResType>('webgw/game/type/hk6/updateOrInsertDoubleCheck', {
    ...data,
    gameType: 1
  })
}

// 新增或者修改新6的复核结果
export const updateOrInsertSGReview = (data: CheckParams) => {
  return http.post<ResType>('webgw/game/type/sg6/updateOrInsertDoubleCheck', {
    ...data,
    gameType: 3995
  })
}

// 新增或者修改台6的复核结果
export const updateOrInsertTWReview = (data: CheckParams) => {
  return http.post<ResType>('webgw/game/type/tw6/updateOrInsertDoubleCheck', {
    ...data,
    gameType: 84
  })
}

// 新增或者修改新澳6的复核结果
export const updateOrInsertXAReview = (data: CheckParams) => {
  return http.post<ResType>('webgw/game/type/xa6/updateOrInsertDoubleCheck', {
    ...data,
    gameType: 5
  })
}

// 推送确认澳6的复核结果
export const pushAReview = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/a6/inner/pushData', data)
}

// 推送确认港6的复核结果
export const pushHKReview = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/hk6/inner/pushData', data)
}

// 推送确认新6的复核结果
export const pushSGReview = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/sg6/inner/pushData', data)
}

// 推送确认台6的复核结果
export const pushTWReview = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/tw6/inner/pushData', data)
}

// 推送确认新澳6的复核结果
export const pushXAReview = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/xa6/inner/pushData', data)
}

// 推送确认快乐8的复核结果
export const pushKL8Review = (data: PushReviewParams) => {
  return http.post<ResType>('webgw/game/result/kl8/inner/pushData', data)
}

// A6 新增 first check
export const insertAFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/a6/insertFirstCheck', {
    ...data,
    gameType: 2032
  })
}

// A6 修改 first check
// /webgw/game/type/a6/updateFirstCheck
export const updateAFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/a6/updateFirstCheck', {
    ...data,
    gameType: 2032
  })
}

// A6 新增 double check
// /webgw/game/type/a6/insertDoubleCheck
export const insertADoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/a6/insertDoubleCheck', {
    ...data,
    gameType: 2032
  })
}

// A6 修改 double check
// /webgw/game/type/a6/updateDoubleCheck
export const updateADoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/a6/updateDoubleCheck', {
    ...data,
    gameType: 2032
  })
}

// 港6 新增 first check
// /webgw/game/type/hk6/insertFirstCheck
export const insertHKFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/hk6/insertFirstCheck', {
    ...data,
    gameType: 1
  })
}

// 港6 修改 first check
// /webgw/game/type/hk6/updateFirstCheck
export const updateHKFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/hk6/updateFirstCheck', {
    ...data,
    gameType: 1
  })
}

// 港6 新增 double check
// /webgw/game/type/hk6/insertDoubleCheck
export const insertHKDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/hk6/insertDoubleCheck', {
    ...data,
    gameType: 1
  })
}

// 港6 修改 double check
// /webgw/game/type/hk6/updateDoubleCheck
export const updateHKDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/hk6/updateDoubleCheck', {
    ...data,
    gameType: 1
  })
}

// 新6 新增 first check
// /webgw/game/type/sg6/insertFirstCheck
export const insertSGFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/sg6/insertFirstCheck', {
    ...data,
    gameType: 3995
  })
}

// 新6 修改 first check
// /webgw/game/type/sg6/updateFirstCheck
export const updateSGFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/sg6/updateFirstCheck', {
    ...data,
    gameType: 3995
  })
}

// 新6 新增 double check
// /webgw/game/type/sg6/insertDoubleCheck
export const insertSGDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/sg6/insertDoubleCheck', {
    ...data,
    gameType: 3995
  })
}

// 新6 修改 double check
// /webgw/game/type/sg6/updateDoubleCheck
export const updateSGDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/sg6/updateDoubleCheck', {
    ...data,
    gameType: 3995
  })
}

// 台6 新增 first check
// /webgw/game/type/tw6/insertFirstCheck
export const insertTWFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/tw6/insertFirstCheck', {
    ...data,
    gameType: 84
  })
}

// 台6 修改 first check
// /webgw/game/type/tw6/updateFirstCheck
export const updateTWFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/tw6/updateFirstCheck', {
    ...data,
    gameType: 84
  })
}

// 台6 新增 double check
// /webgw/game/type/tw6/insertDoubleCheck
export const insertTWDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/tw6/insertDoubleCheck', {
    ...data,
    gameType: 84
  })
}

// 台6 修改 double check
// /webgw/game/type/tw6/updateDoubleCheck
export const updateTWDoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/tw6/updateDoubleCheck', {
    ...data,
    gameType: 84
  })
}

// 新澳6 新增 first check
// /webgw/game/type/xa6/insertFirstCheck
export const insertXAFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/xa6/insertFirstCheck', {
    ...data,
    gameType: 5
  })
}

// 新澳6 修改 first check
// /webgw/game/type/xa6/updateFirstCheck
export const updateXAFirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/xa6/updateFirstCheck', {
    ...data,
    gameType: 5
  })
}

// 快乐8 新增 first check
// /webgw/game/type/tw6/insertFirstCheck
export const insertKL8FirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/kl8/insertFirstCheck', {
    ...data,
    gameType: 6
  })
}

// 快乐8 修改 first check
// /webgw/game/type/kl8/updateFirstCheck
export const updateKL8FirstCheck = (data: InsertOrUpdateFirstCheckParams) => {
  return http.post<ResType>('webgw/game/type/kl8/updateFirstCheck', {
    ...data,
    gameType: 6
  })
}

// 快乐8 新增 double check
// /webgw/game/type/kl8/insertDoubleCheck
export const insertKL8DoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/kl8/insertDoubleCheck', {
    ...data,
    gameType: 6
  })
}
export const getNextOpenTime = (gameTypeName: string) => {
  return http.post<any>(`webgw/game/type/${gameTypeName}/nextOpenTime`, {})
}

// 快乐8 修改 double check
// /webgw/game/type/kl8/updateDoubleCheck
export const updateKL8DoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/kl8/updateDoubleCheck', {
    ...data,
    gameType: 6
  })
}
// 新澳6 新增 double check
// /webgw/game/type/xa6/insertDoubleCheck
export const insertXADoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/xa6/insertDoubleCheck', {
    ...data,
    gameType: 5
  })
}

// 新澳6 修改 double check
// /webgw/game/type/xa6/updateDoubleCheck
export const updateXADoubleCheck = (data: InsertOrUpdateDoubleCheckParams) => {
  return http.post<ResType>('webgw/game/type/xa6/updateDoubleCheck', {
    ...data,
    gameType: 5
  })
}

// A6 推送按钮推送数据
export const pushAData = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/a6/push', { ...data, gameType: 2032 })
}

// 港6 推送按钮推送数据
export const pushHKData = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/hk6/push', { ...data, gameType: 1 })
}

// 新6 推送按钮推送数据
export const pushSGData = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/sg6/push', { ...data, gameType: 3995 })
}

// 台6 推送按钮推送数据
export const pushTWData = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/tw6/push', { ...data, gameType: 84 })
}

// 新澳6 推送按钮推送数据
export const pushXAData = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/xa6/push', { ...data, gameType: 5 })
}

// 快乐8 推送按钮推送数据
export const pushKL8Data = (data: PushDataParams) => {
  return http.post<ResType>('webgw/game/type/kl8/push', { ...data, gameType: 6 })
}

// 查询开奖日期列表(yyyy-MM-dd)
export const getOpenDateList = (year: number, month: number, gameType: number) => {
  return http.post<OpenDateResType>('/webgw/game/open/date/list', { year, month, gameType })
}

// 增删改开奖日期接口，传list列表(yyyy-MM-dd),哪一年哪一月的数据
export const editOpenDate = (data: EditOpenDateParams) => {
  return http.post<ResType>('/webgw/game/open/date/edit', data)
}

// 点击首合按钮
export const callGameResultServiceToConfirmForFirst = (
  issue: number,
  year: number,
  gameType: number,
  gameTypeCode: string
) => {
  return http.post<ResType>(`/webgw/game/type/${gameTypeCode}/callGameResultServiceToConfirmForFirst`, {
    issue,
    year,
    gameType
  })
}

// 点击复核按钮
export const callGameResultServiceToConfirmForDouble = (
  issue: number,
  year: number,
  gameType: number,
  gameTypeCode: string
) => {
  return http.post<ResType>(`/webgw/game/type/${gameTypeCode}/callGameResultServiceToConfirmForDouble`, {
    issue,
    year,
    gameType
  })
}

//  issue是否已存在
export const existIssue = (issue: number, year: number, gameType: number, gameTypeCode: string) => {
  return http.post<ResType>(`/webgw/game/type/${gameTypeCode}/existIssue`, {
    issue,
    year,
    gameType
  })
}

// 查询全站同步的数据
export const listHistoryDataFromOfficial = (
  page: number,
  size: number,
  startDate: string,
  endDate: string,
  sortName?: string,
  sortOrder?: string
) => {
  return http.post<ResType>('/webgw/aSix/listHistoryDataFromOfficial', {
    page,
    size,
    startDate,
    endDate,
    sortName,
    sortOrder
  })
}

// 全站同步
export const pushByOfficial = (
  gameTypeCode: string,
  list: { issue: string; year: number }[],
  manageIdList?: string[]
) => {
  return http.post<ResType>(`/webgw/${gameTypeCode}/pushByOfficial`, { list, manageIdList })
}

// 查询Admin缺失的开奖数据（单条）
export const getMissingData = (gameTypeCode: string, issue: number, year: number) => {
  return http.post<ResType>(`/webgw/${gameTypeCode}/exist`, { issue, year })
}

// 同步某一期的开奖数据到所有站点
export const pushByIssue = (gameTypeCode: string, issue: number, year: number) => {
  return http.post<ResType>(`/webgw/${gameTypeCode}/pushIssue`, { issue, year })
}

interface NumInfo {
  fiveElements: string // 五行
  oddEven: string // 单双
  size: string // 大小
  color: string // 颜色
  num: number // 号码
  index: number // 索引
  shengxiao: string // 生肖
}
export interface IGetGameHistoryData {
  animalCount: number // 动物数量
  animalFlag: string // 动物标志
  color: string // 颜色
  fiveElements: string // 五行
  issue: string // 期号
  num1: number // 第1个号码
  num2: number // 第2个号码
  num3: number // 第3个号码
  num4: number // 第4个号码
  num5: number // 第5个号码
  num6: number // 第6个号码
  numInfo: NumInfo[] // 号码详细信息
  oddEven: string // 单双
  openTime: number // 开奖时间戳
  recordTime: number // 记录时间戳
  result: string // 开奖结果字符串
  size: string // 大小
  suffixCount: number // 后缀计数
  teNum: number // 特码
  tePrefix: number // 特码前缀
  teSuffix: number // 特码后缀
  totalNum: number // 总和
  totalNumOddEven: string // 总和单双
  totalNumSize: string // 总和大小
  totalOddEven: string // 总单双
  totalSize: string // 总大小
  year: number // 年份
}
// 新澳6开奖历史表
export const getGameHistory = (
  gameId: TGameId,
  data: IGetGameHistoryQueryParams
): Promise<IResponse<IGetGameHistoryData>> => {
  return http.post(`webgw/${gameId}/list`, data)
}

// webgw/gameResult/realTimeOpen
export interface IPushRealTimeOpenQueryParams {
  issue: string
  year: string
  gameType: string
}
export const pushRealTimeOpen = (data: IPushRealTimeOpenQueryParams): Promise<IBaseResponse<never>> => {
  return http.post(`webgw/gameResult/realTimeOpen`, data)
}
export const getAllIssueListForGameRusult = (data: any): Promise<IBaseResponse<any>> => {
  return http.post(`webgw/super/tk/gameTypePlatform/allIssueList`, data)
}
// webgw/game/type/a6/callGameResultServiceToConfirmForDouble
export interface IGetCallGameResultServiceToConfirmForDoubleQueryParams {
  issue: string
  year: string
  gameType: string
}
export const getCallGameResultServiceToConfirmForDouble = (
  data: IGetCallGameResultServiceToConfirmForDoubleQueryParams
): Promise<IBaseResponse<never>> => {
  return http.post(`webgw/game/type/a6/callGameResultServiceToConfirmForDouble`, data)
}
export const getYearOptionsByGameType = (gameType: string): Promise<IBaseResponse<any>> => {
  return http.post(`/webgw/super/tk/gameTypePlatform/yearList`, { gameType })
}
// webgw/game/type/a6/updateDoubleCheck
export interface IUpdateDoubleCheckQueryParams {
  issue: string
  year: string
  gameType: string
  doubleCheckNum1: number
  doubleCheckNum2: number
  doubleCheckNum3: number
  doubleCheckNum4: number
  doubleCheckNum5: number
  doubleCheckNum6: number
  doubleCheckNumTe: number
  doubleCheckMemo: string
}
export const updateDoubleCheck = (data: IUpdateDoubleCheckQueryParams): Promise<IBaseResponse<never>> => {
  return http.post(`webgw/game/type/a6/updateDoubleCheck`, data)
}
