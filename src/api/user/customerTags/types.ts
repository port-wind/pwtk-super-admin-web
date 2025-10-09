export interface IGetAllCustomerTagsData {
  mapKey: IMapKey[] // map key (数组类型)
}
export interface IMapKey {
  tagId: number // 标签 ID (int64)
  tagName: string // 标签名称
  state: 'y' | 'n' // 状态 ('y': 正常, 'n': 禁用)
  flag: string // 标签类型
  createTime: string // 创建/修改时间 (格式: yyyy-MM-dd HH:mm:ss)
}
