// 可配置的表单

import type { CSSProperties } from 'vue'
import type { RuleItem } from './rule'

import type { ValidateFieldsError } from 'async-validator'
import type { number } from 'echarts'
interface Callback {
  (isValid?: boolean, invalidFields?: ValidateFieldsError): void
}
//colum 分段显示

// 表单每一项的配置选项
export interface FormOptions {
  // 表单项显示的元素
  type:
    | 'cascader'
    | 'checkbox'
    | 'checkbox-group'
    | 'checkbox-button'
    | 'color-picker'
    | 'date-picker'
    | 'input'
    | 'input-number'
    | 'radio'
    | 'radio-group'
    | 'radio-button'
    | 'rate'
    | 'select'
    | 'option'
    | 'slider'
    | 'switch'
    | 'time-picker'
    | 'time-select'
    | 'transfer'
    | 'upload'
    | 'editor'
    | 'text'
    | 'spliceText'
    | 'dateText'
    | 'image'
    | 'mAutoComplete'
    | 'slot'
    | 'action'
  // 表单项的值
  value?: any
  // 表单项label
  label?: string
  // 表单项的标识
  prop?: string
  // 表单项的验证规则
  rules?: RuleItem[]
  // 表单项的占位符
  placeholder?: string
  //是否显示复制按钮
  isCopy?: boolean
  //是否在末尾显示复制按钮
  isEndCopy?: boolean
  //排列方式 8为3列，12为两列，24为3列
  columnSpan?: number
  // 表单元素特有的属性
  attrs?: {
    // css样式
    style?: CSSProperties
    clearable?: boolean
    showPassword?: boolean
    disabled?: boolean
    multiple?: boolean
    type?: string
    maxlength?: number
    src?: string
  }

  // rowAttrs 表单项的样式
  rowAttrs?: {
    style?: CSSProperties
    gutter?: number
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around'
    align?: 'top' | 'middle' | 'bottom'
  }

  spliceText?: string[]
  textData?: {
    isCopy: boolean
    isHandleStr?: boolean
  }

  // 表单项的子元素
  children?: FormOptions[]
  // 处理上传组件的属性和方法
  uploadAttrs?: {
    action?: string
    headers?: object
    method?: 'post' | 'put' | 'patch'
    multiple?: boolean
    data?: any
    name?: string
    withCredentials?: boolean
    showFileList?: boolean
    drag?: boolean
    accept?: string
    thumbnailMode?: boolean
    fileList?: any[]
    listType?: 'text' | 'picture' | 'picture-card'
    autoUpload?: boolean
    disabled?: boolean
    limit?: number
  }
  autoData?: {
    httpReq: Function
    keyword?: string
    placeholder: string
    isPage: boolean
    isList: boolean
    inputValue?: string
    displayFields: string[]
  }
  visible?: boolean
  spliceTextData?: {
    prop: string
    displayType: 'text' | 'truncated' | 'mask'
    showCopy?: boolean
    maskData?: {
      firstLength: number
      lastLength: number
      maxLength: number
      mask: string
    }
  }[]
}

export interface ValidateFieldCallback {
  (message?: string, invalidFields?: ValidateFieldsError): void
}

export interface FormInstance {
  registerLabelWidth(width: number, oldWidth: number): void
  deregisterLabelWidth(width: number): void
  autoLabelWidth: string | undefined
  emit: (evt: string, ...args: any[]) => void
  labelSuffix: string
  inline?: boolean
  model?: Record<string, unknown>
  size?: string
  showMessage?: boolean
  labelPosition?: string
  labelWidth?: string
  rules?: Record<string, unknown>
  statusIcon?: boolean
  hideRequiredAsterisk?: boolean
  disabled?: boolean
  validate: (callback?: Callback) => Promise<boolean>
  resetFields: () => void
  clearValidate: (props?: string | string[]) => void
  validateField: (props: string | string[], cb: ValidateFieldCallback) => void
}
