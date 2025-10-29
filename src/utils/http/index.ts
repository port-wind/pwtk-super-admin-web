import axios from 'axios'
import type { ResponseType, AxiosResponse, AxiosInstance, AxiosError } from 'axios'
import router from '@/router'
import { ElMessage, ElMessageBox, ElLoading, ElNotification } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'
import { getGlobalVariables } from '@/utils/globalVariables'
import Cookies from 'js-cookie'
import i18n from '@/i18n'
import { ref } from 'vue'
import { getManageSiteId } from '../dataFormat'
const { t } = i18n.global

enum Msgs {
  '操作成功' = 200,
  '无权操作' = 401,
  '禁止访问' = 403,
  '系统内部错误' = 500
}
const Msg = (num: number) => {
  switch (num) {
    case 200:
      return t('input.caozuochengong')
    case 401:
      return t('input.wuquancaozuo')
    case 403:
      return t('input.jinzhifangwen')
    case 500:
      return t('input.xitongneibucuowu')
    default:
      return t('input.qingqiushibai')
  }
}
declare module 'axios' {
  interface IAxios {
    success: boolean
    errorCode: string | number
    data: any
    errMessage: string
  }
  // interface AxiosInstance{
  //   (config:AxiosRequestConfig):Promise<any>
  // }
  export interface AxiosResponse<T = any> extends IAxios {}
}
// 避免多个接口401弹出多个弹框
let isRefreshing = false
// 全局遮罩
let loadingInstance: LoadingInstance

const { VITE_NODE_ENV, VITE_PROXY_DOMAIN, VITE_CHAT_DOMAIN } = import.meta.env
const apiPath =
  VITE_NODE_ENV === 'development' && window.location.hostname === 'localhost' ? VITE_PROXY_DOMAIN : webConfigApi.apiPath
// 创建http实例

// obj:{
// baseurl:string 自定义基础路径
// contenttype:string  参数格式
// responseType:请求数据的格式
// }

interface AxiosInstanceOptions {
  baseurl?: string
  contenttype?: string
  responseType?: ResponseType
  timeout?: number
  isAdd?: boolean
  headers?: {
    [key: string]: any
  }
}
const random = ref<string | undefined>()
const instance = (obj?: AxiosInstanceOptions): AxiosInstance => {
  const https = axios.create({
    baseURL: obj?.baseurl ?? apiPath,
    timeout: obj?.timeout ?? 60000,
    responseType: obj?.responseType ?? 'json',
    headers: {
      'Content-Type': obj?.contenttype ?? 'application/json;charset=UTF-8',
      device: 'Web',
      language: localStorage.getItem('language') === 'en' ? 'EN' : 'CN',
      slk: random.value,
      add: obj?.isAdd ?? null,
      ...obj?.headers
    }
  })
  // 添加请求拦截器
  https.interceptors.request.use(
    (config) => {
      if (config.headers.add) {
        // console.log('loading', config.headers.add)
        loadingInstance = ElLoading.service({ fullscreen: true, text: 'Loading...' })
      }
      config.headers = config.headers || {}
      const token = Cookies.get('token')
      const cid = Cookies.get('cid') || config?.params?.data?.cid

      if (token) {
        config.headers['Token'] = token
        config.headers['cid'] = cid
      }

      // business
      if ((config && config.data && config.data.manageSiteId) || (config.url && getManageSiteId(config.url))) {
        if (config.data) {
          config.headers['manageSiteId'] = config.data.manageSiteId || (config.url && getManageSiteId(config.url))
        }
      }
      // 如果business 没有加,先按照全局加为了方便解决目前所有接口都有变动的问题
      // 但是有些接口是无法使用的例如 webgw/user/${userId}
      // const regex = /^\/webgw\/user\/\d+$/ //
      if (getGlobalVariables('manageSiteId')) {
        config.headers['manageSiteId'] = getGlobalVariables('manageSiteId')
      }

      return config
    },
    (error) => {
      if (loadingInstance) loadingInstance.close()
      return Promise.reject(error)
    }
  )

  // 添加响应拦截器
  https.interceptors.response.use(
    (res: AxiosResponse) => {
      if (loadingInstance) loadingInstance.close()
      if (obj && obj.responseType == 'blob') {
        return res
      } else if (obj) {
        if (res.data.errCode === '10006') {
          if (!isRefreshing) {
            isRefreshing = true
            Cookies.remove('token')
            Cookies.remove('cid')
            Cookies.remove('state')
            localStorage.removeItem('imgUrl')
            router.push('/login')
            isRefreshing = false
            // ElNotification({
            //   type: 'warning',
            //   message: '当前用户已过期，请重新登入'
            // })
            // ElMessageBox({
            //   message: '当前用户已过期，请重新登入',
            //   title: t('input.prompt')
            // })
          }
        }
        if (res.data) {
          return res.data
        } else {
          return res
        }
      } else {
        const obj = res.data
        if (obj.errCode === '10006') {
          if (!isRefreshing) {
            isRefreshing = true

            Cookies.remove('token')
            Cookies.remove('cid')
            Cookies.remove('state')
            localStorage.removeItem('imgUrl')
            router.push('/login')
            // ElNotification({
            //   type: 'warning',
            //   message: '当前用户已过期，请重新登入'
            // })
            // ElMessageBox({
            //   message: '当前用户已过期，请重新登入',
            //   title: t('input.prompt')
            // })
            isRefreshing = false
          }
        }
        return res.data
      }
    },
    (err: AxiosError) => {
      if (loadingInstance) loadingInstance.close()
      const { response } = err
      if (err.code == 'ECONNABORTED') {
        ElMessage.error(t('input.wanglufanwanghsaohou'))
      }
      if (!response) return Promise.reject(err)
      const errCodes = [401, 403]
      const code = response.status
      if (errCodes.includes(code)) {
        if (!isRefreshing) {
          isRefreshing = true
          ElMessageBox({
            message: Msg(code),
            title: t('input.prompt')
          })
            .then(() => {
              router.push('/login')
            })
            .catch(() => {
              router.push('/login')
            })
            .finally(() => {
              isRefreshing = false
              Cookies.remove('token')
              Cookies.remove('cid')
              Cookies.remove('state')
              localStorage.removeItem('imgUrl')
            })
        }
        // removeUserInfo()

        return Promise.reject(err)
      }
      ElMessage(Msg(code) || t('input.qingqiushibai'))
      return Promise.reject(err)
    }
  )

  return https
}

const http = {
  get: <T>(url: string, data?: any, obj?: AxiosInstanceOptions): Promise<T> => {
    return obj
      ? instance(obj).get(url, { params: data ? data : '' })
      : instance().get(url, { params: data ? { data: data } : '' })
  },
  post: <T>(url: string, data: any, obj?: any): Promise<T> => {
    return obj ? instance(obj).post(url, data) : instance().post(url, data)
  },
  postWithConfig: <T>(url: string, data: any, obj?: any, headers?: any) => {
    const axiosInstance = obj ? instance(obj) : instance()
    console.log(headers, 'headers')

    return axiosInstance.post(url, data, {
      headers: { ...axiosInstance.defaults.headers, ...headers }
    })
  },
  put: <T>(url: string, data: any): Promise<T> => {
    return instance().put(url, { data: data })
  },
  delete: <T>(url: string, data: any): Promise<T> => {
    return instance().delete(url, { data: data })
  },
  patch: <T>(url: string, data: any): Promise<T> => {
    return instance().patch(url, { data: data })
  }
}
export const chatApiPath =
  VITE_NODE_ENV === 'development' && window && window.location && window.location.hostname === 'localhost'
    ? VITE_CHAT_DOMAIN
    : webConfigApi.VITE_CHAT_DOMAIN

export default http
