export interface FormOptions {
  // 字段名称
  prop: string
  // 表头
  label: string
  // 表单项类型
  type?: 'input' | 'text' | 'date' | 'radio' | 'select' | 'textarea' | 'unModify' | 'radio-group'
  // 表单项的校验规则
  rules?: any[]
  // 是否禁用
  disabled?: boolean
  // 自定义列模板的插槽名
  slot?: string

  //mode 是否区分编辑模式或者新增模式
  mode?: 'add' | 'edit'

  //date 需要传入
  dateData?: {
    placeholder: string
  }

  inputData?: {
    maxLength?: string | number
    placeholder?: string
  }

  //textarea 需要传入
  textareaData?: {
    maxLength: string
    placeholder: string
  }

  //radio:需要传入参数
  radioData?: {
    radioName: string
    RadioOption?: RadioOption[]
  }

  // 下拉框数据
  selectData?: {
    selectName: string
    placeholder: string
    SelectOption?: SelectOption[]
  }
}

interface RadioOption {
  value: string
  label: string
}
interface SelectOption {
  value: string
  label: string
}
