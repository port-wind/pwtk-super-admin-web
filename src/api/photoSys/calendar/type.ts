export interface IOpenDateItem {
  /**
   *
   */
  openTime: string
  /**
   * 开奖日期(yyyy-MM-dd) Validate[regexp: \\d{4}-\\d{2}-\\d{2}; ]
   */
  openDate: string
  gameType: number
  issue: number | string
}

export interface IGetOpenDateListQueryParams {
  year: number
  month: number
  gameType: number
}
export interface IGetOpenDateListResponse {
  openDateList: IOpenDateItem[]
}
export interface ICreateOpenDateQueryParams {
  /**
   * 日期 Validate[regexp: ^\\d{4}-\\d{2}-\\d{2}$; ]
   */
  date: string
  /**
   * 时间  Validate[regexp: ^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$; ]
   */
  time?: string
  gameType: number
  issue: number | string
}
export interface IUpdateOpenDateQueryParams {
  /**
   * 日期 Validate[regexp: ^\\d{4}-\\d{2}-\\d{2}$; ]
   */
  date: string
  /**
   * 时间  Validate[regexp: ^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$; ]
   */
  time?: string
  gameType: number
  issue: number | string
}
export interface IDeleteOpenDateQueryParams {
  /**
   * 日期 Validate[regexp: ^\\d{4}-\\d{2}-\\d{2}$; ]
   */
  date: string
  /**
   * 时间  Validate[regexp: ^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$; ]
   */
  time?: string
  gameType: number
  issue: number | string
}

export interface IEditOpenDateQueryParams {
  year: number
  month: number
  gameType: number
  issue: number
  isNext: string
  openDateList: IOpenDateItem[]
}
export interface IPushOpenDateQueryParams {
  list: number[]
}
export interface IPushOpenDateResponse {
  [key: string]: boolean
}
