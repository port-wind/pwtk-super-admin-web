import http from '@/utils/http/index'
const prefix = '/super'
//系统组件列表查询
export const reqSysCompList = (data: any) => {
  return http.post('/webgw' + prefix + '/sysComponent/getSysComponent', data)
}

//系统组件新增
export const reqAddSysComp = (data: any) => {
  return http.post('/webgw' + prefix + '/sysComponent/addSysComponent', data)
}

//系统组件编辑
export const reqEditSysComp = (data: any) => {
  return http.post('/webgw' + prefix + '/sysComponent/editSysComponent', data)
}
//获取所有组件类型
export const reqGetAllCompType = (data: any) => {
  return http.post('/webgw' + prefix + '/sysComponent/getComponentIdAndName', data)
}
