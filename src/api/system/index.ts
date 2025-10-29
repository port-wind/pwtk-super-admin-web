import http from '@/utils/http/index'
import type { IBaseResponse, IResponse } from '../type'

//获取操作日志列表
export const operationLogList = (data: any) => {
  return http.post('/account/operationLog/list', data)
}
//获取权限集
export const menupermissions = () => {
  return http.get('/menu/permissions')
}
//获取资源管理列表
export const menulist = (data: any) => {
  return http.post('/menu/list', data)
}
//资源列表新增资源
export const addresource = (data: any) => {
  return http.post('/menu/add', data)
}
//资源列表修改资源
export const editresource = (data: any) => {
  return http.post('/menu/edit', data)
}
//资源列表删除资源
export const deletesource = (data: any) => {
  return http.post('/menu/delete', data)
}

export interface IMenu {
  id: number
  parentId: number
  type: number // 0 for menu, 1 for button
  path: string
  name: string
  nameZh: string
  nameEn: string
  component: string // Frontend component route
  perms: string // Permission identifier
  orderNum: number // Sort order
  hasParent: boolean
  hasChildren: boolean
  selected: boolean // Whether selected
  createTime: string // Format: yyyy-MM-dd HH:mm:ss
  modifyTime: string // Format: yyyy-MM-dd HH:mm:ss
  children: IMenu[] // Array of child menu items
}
//资源列表获取路由地址
export const menupage = (): Promise<IResponse<IMenu>> => {
  return http.get('/menu/page')
}
