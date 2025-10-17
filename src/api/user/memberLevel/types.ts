export interface IReqMevvberLevel {
  /** VIP等级 */
  vipLevel: number // int32, 必填
  /** 达到 vipLevel 需要累计获取的积分 */
  score: number // int32, 必填
  /** 更新时间 */
  createTime: string // string, 必填，格式为 yyyy-MM-dd HH:mm:ss
}

export interface IUploadMemberLevelQueryParams {
  vipLevel: number
  score: number
}
