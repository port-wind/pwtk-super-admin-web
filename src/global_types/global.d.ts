import { I18n } from 'vue-i18n'

declare global {
  const webConfigApi: {
    apiPath: string
    logoPath: string
    phone: string
    whatsapp: string
    facebook: string
    instagram: string
    PUBLIC_KV_URL: string
    VITE_PROXY_DOMAIN: string
    VITE_PROXY_UPLOAD: string
    VITE_SERVER_CALLBACK: string
    VITE_CDN_URL: string
    VITE_STORY_TYPE: string
    VITE_STORAGE_BUCKET: string
    VITE_NODE_ENV: string
    VITE_CHAT_DOMAIN: string
    VITE_PUBLIC_ENCRYPTION_URL: string
    VITE_PUBLIC_AES_KEY_VERSION: string
    version: string
    apiPathBeforeLogin: string
  }
  interface Window {
    webConfigApi: {
      apiPath: string
      logoPath: string
      phone: string
      whatsapp: string
      facebook: string
      instagram: string
      PUBLIC_KV_URL: string
      VITE_PROXY_DOMAIN: string
      VITE_PROXY_UPLOAD: string
      VITE_SERVER_CALLBACK: string
      VITE_CDN_URL: string
      VITE_STORY_TYPE: string
      VITE_STORAGE_BUCKET: string
      VITE_NODE_ENV: string
      VITE_CHAT_DOMAIN: string
      VITE_PUBLIC_ENCRYPTION_URL: string
      VITE_PUBLIC_AES_KEY_VERSION: string
      version: string
      apiPathBeforeLogin: string
    }
  }
}

export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $i18n: I18n
    $t: I18n['global']['t']
  }
}

export {}
