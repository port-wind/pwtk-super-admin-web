import http from '@/utils/http/index'
import type { listData, addData, editData, deleteData } from './types'

enum api {
  LIST = '/dict/list',
  ADD = '/dict/add',
  EDIT = '/dict/edit',
  DELETE = '/dict/delete'
}

//字典列表接口回调
export const reqDictList = (data: listData) => {
  return http.post(api.LIST, data)
}
//新增字典接口回调
export const reqDictAdd = (data: addData) => {
  return http.post(api.ADD, data, true, { isAdd: 1 })
}
//编辑字典接口回调
export const reqDictEdit = (data: editData) => {
  return http.post(api.EDIT, data, true, { isAdd: 1 })
}
//删除字典接口
export const reqDictDelete = (data: deleteData) => {
  return http.post(api.DELETE, data, true, { isAdd: 1 })
}
