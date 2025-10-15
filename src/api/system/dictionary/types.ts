export interface listData {
  name?: string
  page: number
  size: number
  type?: string
}
export interface addData {
  name: string
  type: string
  value: string
  remark: string
}

export interface editData {
  id: number
  name: string
  type?: string
  value?: string
  remark?: string
}

export interface deleteData {
  id: number
}
