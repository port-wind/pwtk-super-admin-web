export interface SearchOption {
  // 字段名称
  prop: string
  // 表单项类型
  type: 'input' | 'date' | 'select' | 'autoComplete' | 'dateRange' | 'button' | 'timeLine' | 'slot'
  // 表头
  label?: string

  // 表单项的校验规则
  rules?: any[]
  // 自定义列模板的插槽名

  width?: string | number
  slot?: string

  //date 需要传入
  dateData?: {
    placeholder: string
  }

  //输入最大值
  inputData?: {
    maxLength: string | number
    placeholder: string
  }

  // 下拉框数据
  selectData?: {
    selectName: string
    placeholder: string
    clearable?: boolean
    SelectOption?: SelectOption[]
  }

  //AutoComplete必须要输入
  autocompleteData?: {
    keyword: string
    isEmpty: boolean
    placeholder: string
    httpFunc: Function
    triggerOnFocus: false
    maxLength: string | number
  }

  timeLineData?: {
    name?: string
    startPlaceholder?: string
    endPlaceholder?: string
    startName: string
    endName: string
  }
}
interface SelectOption {
  value: string
  label: string
}
export interface SearchBtnOptions {
  isSearch: boolean
  isReset: boolean
  isAdd: boolean
}
