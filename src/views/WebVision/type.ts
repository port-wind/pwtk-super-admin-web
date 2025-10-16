export interface ComponentStyle {
  componentId: string
  componentName: string
  configParamJson: string // 或者更具体的类型
  disabled?: boolean
}

// 定义 PageSetup 接口
export type PageSetup = {
  name: string
  details?: string
  isPerson?: boolean
  isBack?: boolean
  titleHeight?: number
  bgColor?: string
  bgImg?: string
}
export type PageComponent = {
  active?: boolean
  component: string
  componentId?: string
  templateId?: string
  websiteId?: string
  setStyle?: ComponentStyle
  pageRenderingSeq?: number
  style?: string
  text?: string
  type: string
  selected?: boolean
}
// 定义 Data 接口，包含页面ID、页面设置和页面组件
export interface Data {
  id: number | null
  pageSetup: PageSetup
  pageComponents: PageComponent[]
}
export interface Choose {
  deleShow: boolean
  index: number
  rightcom: string
  currentproperties: unknown
  offsetY: number
  onlyOne: string[]
  pointer: { show: boolean }
}
