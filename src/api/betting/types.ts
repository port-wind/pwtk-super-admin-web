export interface IGameTypeSeriesListParameter {
  /**
   * 页码
   */
  page: number

  /**
   * 每页显示条数
   */
  size: number

  /**
   * 排序字段名称
   */
  sortName?: string

  /**
   * 排序顺序
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * 图纸系列(长度最长32位)
   */
  seriesCode?: string

  /**
   * 彩种(长度最长32位)
   */
  gameType?: string

  /**
   * 系列名称(长度最长128位)
   */
  seriesName?: string

  /**
   * 是否有黑白图纸; y,有; n,没有; (长度最长1位)
   */
  hasBlackWhite?: 'y' | 'n'

  /**
   * 是否有彩色图纸; y,有; n,没有; (长度最长1位)
   */
  hasColorful?: 'y' | 'n'

  /**
   * 创建时间(长度最长30位)
   */
  createTime?: string // yyyy-MM-dd HH:mm:ss

  /**
   * 系列描述(长度最长255位)
   */
  seriesDesc?: string

  /**
   * 备注(长度最长64位)
   */
  memo?: string

  /**
   * 是否推荐; y,是; n,否; (长度最长1位)
   */
  isRecommended?: 'y' | 'n'

  /**
   * 是否热门; y,是; n,否; (长度最长1位)
   */
  isHot?: 'y' | 'n'

  /**
   * 是否置顶; y,是; n,否; (长度最长1位)
   */
  isTop?: 'y' | 'n'

  /**
   * 是否精选; y,是; n,否; (长度最长1位)
   */
  isSelected?: 'y' | 'n'

  /**
   * 是否爆款; y,是; n,否; (长度最长1位)
   */
  isBloom?: 'y' | 'n'
}

export interface IGameTypeSeriesDetails {
  /**
   * 图纸系列(长度最长32位)
   */
  seriesCode: string

  /**
   * 彩种(长度最长32位)
   */
  gameType: string

  /**
   * 系列名称(长度最长128位)
   */
  seriesName: string

  /**
   * 黑白图纸数量 0,没有；>0表示有的数量(长度最长11位)
   */
  blackWhiteCount: string

  /**
   * 彩色图纸数量 0,没有；>0表示有的数量;(长度最长11位)
   */
  colorfulCount: string

  /**
   * 创建时间(长度最长30位)
   */
  createTime: string // yyyy-MM-dd HH:mm:ss

  /**
   * 系列描述(长度最长255位)
   */
  seriesDesc: string

  /**
   * 备注(长度最长64位)
   */
  memo: string

  /**
   * 是否推荐; y,是; n,否; (长度最长1位)
   */
  isRecommended: 'y' | 'n'

  /**
   * 是否热门; y,是; n,否; (长度最长1位)
   */
  isHot: 'y' | 'n'

  /**
   * 是否置顶; y,是; n,否; (长度最长1位)
   */
  isTop: 'y' | 'n'

  /**
   * 是否精选; y,是; n,否; (长度最长1位)
   */
  isSelected: 'y' | 'n'

  /**
   * 是否爆款; y,是; n,否; (长度最长1位)
   */
  isBloom?: 'y' | 'n' // 复制字段
}

export interface IListPayTypeCodeBodyParameter {
  /**
   * 业务类型:b(bbs),t(图库),p(竞选),r(心水)
   */
  bizFlag: 'b' | 't' | 'p' | 'r'
}

export interface IListTypeCode {
  playTypeCode: 'string'
  predictionTypeName: 'string'
}

export interface IPredictTypeListBodyParameter {
  /**
   * 页码
   */
  page: number

  /**
   * 每页显示条数
   */
  size: number

  /**
   * 排序字段名称
   */
  sortName?: string

  /**
   * 排序顺序
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * 玩法code (长度最长16位)
   */
  playTypeCode?: string

  /**
   * 预测类型名称 (长度最长64位)
   */
  predictionTypeName?: string

  /**
   * 业务类型: b(bbs), t(图库), p(竞选), r(心水) (长度最长1位)
   */
  bizFlag: 'b' | 't' | 'p' | 'r' // 复制字段
}

export interface IExtensionField {
  /**
   * 扩展字段，字段定义到java对象里面，转为json存储
   */
  [key: string]: any // 可以根据需要定义具体的属性
}

export interface IGameTypePlayDetails {
  /**
   * 玩法code
   */
  playTypeCode: string

  /**
   * 父类玩法code(0代表没有父类玩法code)
   */
  parentPlayTypeCode: string

  /**
   * 预测类型名称
   */
  predictionTypeName: string

  /**
   * 玩法层级
   */
  level: number

  /**
   * 玩法层级路径
   */
  path: string

  /**
   * 可选内容
   */
  optionList: any[] // 根据具体内容定义类型

  /**
   * 最大数量
   */
  maxCount: number

  /**
   * 最小数量
   */
  minCount: number

  /**
   * 最大积分
   */
  maxScore: number

  /**
   * 最小积分
   */
  minScore: number

  /**
   * 玩法对应预测类型(b(bbs), t(图库), p(竞选), r(心水))
   */
  bizFlag: 'b' | 't' | 'p' | 'r'

  /**
   * 玩法规则说明
   */
  rule: string

  /**
   * 扩展字段
   */
  extensionField: IExtensionField

  /**
   * 是否有效(y,有效；n,失效)
   */
  status: 'y' | 'n'

  /**
   * 创建时间
   */
  createTime: string // yyyy-MM-dd HH:mm:ss

  /**
   * 修改时间
   */
  modifyTime: string // yyyy-MM-dd HH:mm:ss
}

export interface IPredictTypeEditStatusBodyParameter {
  /***
   * 玩法code (长度最长16位)
   */
  playTypeCode: string

  /**
   * 业务类型: b(bbs), t(图库), p(竞选), r(心水) (长度最长1位)
   */
  bizFlag: 'b' | 't' | 'p' | 'r'

  /**
   * 状态 (长度最长1位)
   */
  status: 'y' | 'n' // 假设状态为有效(y)或失效(n)
}

export interface IPredictListBodyParameter {
  /**
   * 页码
   */
  page: number

  /**
   * 每页显示条数
   */
  size: number

  /**
   * 业务类型: b(bbs), t(图库), p(竞选), r(心水) (长度最长1位)
   */
  bizFlag: 'b' | 't' | 'p' | 'r'

  /**
   * 排序字段名称
   */
  sortName?: string

  /**
   * 排序顺序
   */
  sortOrder?: 'ASC' | 'DESC'

  /**
   * login id
   */
  loginId?: string

  /**
   * 模糊查询
   */
  searchId?: string

  /**
   * 业务id (如果后期需要作为筛选条件)
   * 竞选活动传竞选活动id
   * 竞猜小组传期刊id
   * 参赛贴传帖子id
   * 心水不传
   */
  bizId?: number // int64

  /**
   * 年份
   */
  year?: number // int32

  /**
   * 期号
   */
  issue?: number // int64

  /**
   * 彩种
   */
  gameType?: number // int64

  /**
   * 玩法code (长度最长16位)
   */
  playTypeCode?: string

  /**
   * 玩法二级类型code (长度最长16位)
   */
  playTypeSubCode?: string

  /**
   * 用户id (长度最长32位)
   * 如果输入的是全数字，后台将当作用户id处理，会返回0条数据和空数组(userId)将做精确匹配
   */
  userId?: string

  /**
   * 用户昵称 (长度最长128位)
   */
  nickname?: string

  /**
   * 是否命中; y, n, i, 如果要查全部，传 L (长度最长1位)
   */
  isHit?: 'y' | 'n' | 'i' | 'L' // 复制字段

  /**
   * 年内期数 (注意是期数，不是期号,需要作为筛选条件的时候使用)
   */
  period?: number // int64
}
export interface IPredictionResult {
  /**
   * 预测id
   */
  predictId: number // int64

  /**
   * 年份
   */
  year: number // int32

  /**
   * 期号
   */
  issue: number // int64

  /**
   * 游戏类型
   */
  gameType: number // int64

  /**
   * 业务id
   */
  bizId: number // int64

  /**
   * 玩法code
   */
  playTypeCode: string

  /**
   * 预测类型名称
   */
  predictionTypeName: string

  /**
   * 玩法二级类型code
   */
  playTypeSubCode: string

  /**
   * 玩法二级类型名称
   */
  playTypeSubName: string

  /**
   * 正特码类型 (正码一: 1, 正码二: 2, 正码三: 3, 正码四: 4, 正码五: 5, 正码六: 6, 特码: 7)
   */
  playTypeCheckNumberCode: string

  /**
   * 预测标题
   */
  predictTitle: string

  /**
   * 预测结果
   */
  predict: string[] // 根据具体内容定义类型

  /**
   * 用户id
   */
  userId: number // int64

  /**
   * loginId
   */
  loginId: string

  /**
   * 用户昵称
   */
  nickname: string

  /**
   * 是否命中; y, n, i 我是否中奖
   */
  isHit: 'y' | 'n' | 'i'

  /**
   * 审核状态
   */
  reviewStatus: string

  /**
   * 年内期数 (注意是期数，不是期号)
   */
  period: number // int64

  /**
   * 创建时间
   */
  createTime: string // yyyy-MM-dd HH:mm:ss
}

export interface IGameTypePlayDetailsData {
  /**
   * 玩法code
   */
  playTypeCode: string

  /**
   * 父类玩法code (0代表没有父类玩法code)
   */
  parentPlayTypeCode: string

  /**
   * 预测类型名称
   */
  predictionTypeName: string

  /**
   * 游戏详解
   */
  ruleExplain: string
  /**
   * 玩法层级
   */
  level: number

  /**
   * 玩法层级路径
   */
  path: string

  /**
   * 可选内容
   */
  optionList: string[]

  /**
   * 最大数量
   */
  maxCount: number

  /**
   * 最小数量
   */
  minCount: number

  /**
   * 最大积分
   */
  maxScore: number

  /**
   * 最小积分
   */
  minScore: number

  /**
   * 玩法对应预测类型(b(bbs), t(图库), p(竞选), r(心水))
   */
  bizFlag: 'b' | 't' | 'p' | 'r'

  /**
   * 玩法规则说明
   */
  rule: string

  /**
   * 扩展字段
   */
  extensionField: {
    [key: string]: any // 可以根据需要定义具体的属性
  }

  /**
   * 是否有效(y,有效；n,失效)
   */
  status: 'y' | 'n'

  /**
   * 创建时间
   */
  createTime: number // timestamp

  /**
   * 修改时间
   */
  modifyTime: number // timestamp
}

export enum BizFlag {
  BBS = 'b', // bbs
  Gallery = 't', // 图库
  Campaign = 'p', // 竞选
  Insight = 'r' //心水 六合王专用
}
