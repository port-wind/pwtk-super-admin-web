export interface leftComponentData {
  text: string
  type: string
  icon?: string
  name?: string
  disabled?: boolean
  component?: string
  active?: boolean
  style?: string
  setStyle?: {
    componentId: string
    componentName: string
    configParamJson: Record<string, any> // 或者更具体的类型
  }
}
