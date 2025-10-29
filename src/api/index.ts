import axios from 'axios'
import http from '@/utils/http/index'
import type { IAccountInfoData, IBaseResponse } from './type'

export interface IMenu {
  id: string
  parentId: string
  path: string
  name: string
  component: string
  hasParent: boolean
  hasChildren: boolean
  children: IMenu[]
}
// 获取菜单栏列表
export const getmenulist = (): Promise<IBaseResponse<IMenu[]>> => {
  return http.get('/menu/index')
}

// 查询个人信息接口
export const accountInfo = (): Promise<IBaseResponse<IAccountInfoData>> => {
  return http.get('/account/info')
}

// 获取类型接口
export const getSelectType = (data: any) => {
  return http.get('/dict/getDictByType', data)
}

// 用户编号模糊查询
export const getBlurquery = (data: any) => {
  return http.get('/user/queryBlurUserId', data)
}

// 获取ip地址
// Constants for cache configuration
const IP_CACHE_KEY = 'user_ip_data'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

interface CachedData {
  value: string
  timestamp: number
}

export const getIpData = async (): Promise<string> => {
  // Check cache first
  const cachedData = localStorage.getItem(IP_CACHE_KEY)

  if (cachedData) {
    const parsed: CachedData = JSON.parse(cachedData)
    const isValid = Date.now() - parsed.timestamp < CACHE_DURATION

    if (isValid) {
      return parsed.value
    }
  }

  try {
    // Fetch new data if cache is invalid or missing
    const response = await axios.get('https://ip.ai4funs.com/')
    const jsonString = JSON.stringify(response.data)
    // const base64String = btoa(jsonString) // 在non-Latin1 会报错
    // like "JP", "Honchō", and other potential non-Latin1 characters in your JSON.
    const base64String = btoa(unescape(encodeURIComponent(jsonString)))

    // Cache the result
    const cacheData: CachedData = {
      value: base64String,
      timestamp: Date.now()
    }
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify(cacheData))

    return base64String
  } catch (error) {
    console.error('Error fetching IP data:', error)
    // Return cached data if available, even if expired
    if (cachedData) {
      return JSON.parse(cachedData).value
    }
    throw error
  }
}
// Generate unique IDs admin API
// export const generateUniqueIds = (count: number = 1) => {
//   return http.post('/webgw/issueMapping/generateUniqueIds', { count })
// }
