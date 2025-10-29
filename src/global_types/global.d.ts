// src/global_types/global.d.ts
import type { WebConfigApi } from '@/webConfigApi'

declare global {
  interface Window {
    webConfigApi: WebConfigApi
  }

  const webConfigApi: WebConfigApi
}

export {}
