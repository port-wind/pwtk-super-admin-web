import http from '@/utils/http/index'
const prefix = '/super'
//获取模版组件列表
export const getTemplateComponent = (data: any) => {
  // return http.post('/webgw/template/getSysTemplate', data)
  return http.post('/webgw' + prefix + '/templateComponent/getTemplateComponent', data)
}

//添加模版组件 这个api可能写错
export const reqAddTemplateComp = (data: any) => {
  return http.post('/webgw' + prefix + '/templateComponent/getTemplateComponent', data)
}
//编辑模版组件
export const reqEditTemplateComp = (data: any) => {
  return http.post('/webgw' + prefix + '/sketch/listBlurSketchCode', data)
}
