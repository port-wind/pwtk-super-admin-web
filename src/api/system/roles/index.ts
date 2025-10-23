import http from '@/utils/http/index'
import type { listData, deleteData } from './types'
const prefix = '/super'
enum api {
  LIST = '/role/list',
  ADD = '/role/add',
  EDIT = '/role/edit',
  DELETE = '/role/delete',
  ALL = '/role/all',
  MENU = '/role/menu'
}

//角色管理列表接口
export const reqRolesList = (data: listData) => {
  return http.post(api.LIST, data)
}
//新增角色接口
export const reqRolesAdd = (data: any) => {
  return http.post(api.ADD, data)
}
//修改角色接口
export const reqRolesEdit = (data: any) => {
  return http.post(api.EDIT, data)
}
//删除角色接口
export const reqRoleDelete = (data: deleteData) => {
  return http.post(api.DELETE, data)
}
//获取所有角色
export const reqRoleDAll = () => {
  return http.get(api.ALL)
}
//获取角色列表
export const reqRoleMenu = (id: any) => {
  return http.get(`/role/menu/${id}`)
}
