export interface sysComOption {
  comId: number
  comType: 'banner' | 'header' | 'footer' | 'textContent'
  comName: string
  comOrder: number
  comStatus: 'y' | 'n'
  comIsView: 'y' | 'n'
}
