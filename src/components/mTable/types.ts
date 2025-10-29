export interface TableOptions {
  // 字段名称
  prop?: string
  // 表头
  label: string
  // 对应列的宽度
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  //表格行配置项
  type?: 'selection' | 'index' | 'expand'
  columAttr?: Record<string, any>
  // 自定义列模板的插槽名
  slot?: string
  // 是否是操作项
  action?: {
    label?: string
    width?: string | number
    align?: 'left' | 'center' | 'right'
  }
  isCopyText?: boolean
  //时间数据
  dateName?: string
  //时间格式化
  formatStr?: string

  //图片数据
  image?: {
    src: string
  }

  cellType?: 'isCopyText' | 'dateName' | 'jsonData' | 'image'

  //JSON数据 sourceName 为JSON的名称，keyName为JSON的值
  json?: {
    sourceName: string
    keyName: string
  }
  // 是否可以编辑
  editable?: boolean

  //是否显示省略号
  showOmission?: boolean

  //isFixed 是否固定显示
  fixed?: 'left' | 'right'
  hide?: boolean
  truncateText?: boolean
  truncateTextLength?: number
}
