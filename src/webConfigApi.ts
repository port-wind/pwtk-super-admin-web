// src/webConfigApi.ts
import packageJson from '../package.json'

/**
 * WebConfig API 类型定义
 */
export interface WebConfigApi {
  // 核心配置（客户特定）
  apiPath: string // 客户API地址

  // 客户品牌信息
  logoPath: string
  phone: string
  whatsapp: string
  facebook: string
  instagram: string

  // 基础服务配置（可选，有兜底）
  PUBLIC_KV_URL?: string
  VITE_PROXY_UPLOAD?: string
  VITE_SERVER_CALLBACK?: string
  VITE_CDN_URL?: string
  VITE_STORY_TYPE?: string
  VITE_STORAGE_BUCKET?: string
  VITE_NODE_ENV?: string
  VITE_CHAT_DOMAIN?: string
  VITE_PUBLIC_ENCRYPTION_URL?: string
  VITE_PUBLIC_AES_KEY_VERSION?: string
  VITE_TASK_DOMAIN?: string
  VITE_TASK_LIVE_DOMAIN?: string
  VITE_AUDIO_CONVERT_TOOL_DOMAIN?: string
  VITE_VIDEO_DOMAIN?: string
  version?: string
}

/**
 * 默认配置（用于开发环境）
 */
export const defaultWebConfig: WebConfigApi = {
  // 核心配置
  apiPath: import.meta.env.VITE_PROXY_DOMAIN,

  // 品牌信息
  logoPath: 'https://stt.pwtk.cc/devmedia/photossys/guarantee/img/24/11/18/6452534cc56f4a86a754f89e0407c457.png',
  phone: '000-000-0000',
  whatsapp: '000-000-0000',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',

  // 基础服务（开发环境配置）
  PUBLIC_KV_URL: 'https://ocs.ai4funs.com/pwtk',
  VITE_PROXY_UPLOAD: 'https://upload.pwtk.cc',
  VITE_SERVER_CALLBACK: 'https://devmedia0.s3.ap-northeast-1.amazonaws.com/',
  VITE_CDN_URL: 'https://stt.pwtk.cc/',
  VITE_STORY_TYPE: 'S3',
  VITE_STORAGE_BUCKET: 'dev',
  VITE_NODE_ENV: 'development',
  VITE_CHAT_DOMAIN: 'https://vchat.pwtk.cc',
  VITE_PUBLIC_ENCRYPTION_URL: 'https://msecret.pwtk.cc',
  VITE_PUBLIC_AES_KEY_VERSION: '0',
  VITE_TASK_DOMAIN: 'https://voice-bot.dating141.com',
  VITE_TASK_LIVE_DOMAIN: 'https://video-room-bot.pwtk.cc',
  VITE_AUDIO_CONVERT_TOOL_DOMAIN: 'https://towav.pages.dev',
  VITE_VIDEO_DOMAIN: 'https://video.pwtk.cc',

  // 版本信息
  version: packageJson.version
}

// 在开发环境中挂载到 window
if (typeof window !== 'undefined') {
  window.webConfigApi = defaultWebConfig
  console.info('🔧 webConfigApi 已加载:', defaultWebConfig)
}

// window.webConfigApi = {
//   apiPath: 'https://dev-super-admin-api.pwtk.cc',
//   logoPath: 'https://stt.pwtk.cc/devmedia/photossys/guarantee/img/24/11/18/6452534cc56f4a86a754f89e0407c457.png',
//   apiPathBeforeLogin: './',
//   phone: '000-000-0000',
//   whatsapp: '000-000-0000',
//   facebook: 'https://www.facebook.com/',
//   instagram: 'https://www.instagram.com/',
//   PUBLIC_KV_URL: 'https://ocs.ai4funs.com/pwtk',
//   VITE_PROXY_UPLOAD: 'https://upload.pwtk.cc',
//   VITE_SERVER_CALLBACK: 'https://devmedia0.s3.ap-northeast-1.amazonaws.com/',
//   VITE_CDN_URL: 'https://stt.pwtk.cc/',
//   VITE_STORY_TYPE: 's3',
//   VITE_STORAGE_BUCKET: 'dev',
//   VITE_NODE_ENV: 'development',
//   VITE_CHAT_DOMAIN: 'https://vchat.pwtk.cc',
//   VITE_PUBLIC_ENCRYPTION_URL: 'https://msecret.pwtk.cc',
//   VITE_PUBLIC_AES_KEY_VERSION: '0',
//   version: '1.2.13'
// }
