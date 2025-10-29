interface ApiResponse {
  success: boolean // 表示请求是否成功
  errCode: string // 错误代码，类型为字符串
  errMessage: string // 错误信息，类型为字符串
  data: string[] // 数据，类型为数组，可以包含任意类型的元素
}
