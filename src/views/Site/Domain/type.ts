export interface DomainConfig {
  domain: string
  ownerUserId: string
  userName: string
  websiteRef: string
  websiteId: string
  websiteTemplateRef: string
  templateName: string
  keyWords: string
  isSupportSsl: 'y' | 'n'
  cdnUrl: string
  domainStatus: 'y' | 'n'
  domainType: string
  domainFrom: string
  hasStatsCode: 'y' | 'n'
  areaCodes: string[]
  langCodes: string[]
  landingPage: string[] // Assuming it holds strings, adjust if it holds a different type
  isForceHttps: 'y' | 'n'
  isAppDownloadHint: 'y' | 'n'
  promotionCode: string
  createTime: number
  websiteInnerName: string
  websiteTitle: string
  memo: string
  websiteStatus: 'y' | 'n'
}
export const domainDetailDataInit = (): DomainConfig => ({
  domain: '',
  userName: '',
  templateName: '',
  ownerUserId: '',
  websiteRef: '',
  websiteId: '',
  websiteInnerName: '',
  websiteTemplateRef: '',
  websiteTitle: '',
  keyWords: '',
  isSupportSsl: 'n',
  cdnUrl: '',
  domainStatus: 'y',
  domainType: '',
  domainFrom: '',
  hasStatsCode: 'n',
  areaCodes: [],
  langCodes: [],
  landingPage: [],
  isForceHttps: 'n',
  isAppDownloadHint: 'n',
  promotionCode: '',
  createTime: Date.now(), // or set it to 0 if you prefer a specific initial value
  memo: '',
  websiteStatus: 'y'
})
//test
/* export const domainDetailDataInit = (): DomainConfig => ({
  domain: 'domain',
  templateName: 'templateName',
  ownerUserId: 'ownerUserId',
  websiteRef: 'websiteRef',
  websiteId: 'websiteId',
  websiteTitle: 'websiteTitle',
  websiteInnerName: 'websiteInnerName',
  websiteTemplateRef: 'websiteTemplateRef',
  keyWords: 'keyWords',
  memo: 'memo',
  isSupportSsl: 'n',
  cdnUrl: 'cdnUrl',
  domainStatus: 'y',
  domainType: 'domainType',
  domainFrom: 'domainFrom',
  hasStatsCode: 'n',
  areaCodes: ['cn', 'tw', 'us'],
  langCodes: ['cn', 'en'],
  landingPage: ['landingPage'],
  isForceHttps: 'n',
  isAppDownloadHint: 'n',
  promotionCode: 'promotionCode',
  createTime: Date.now(), // or set it to 0 if you prefer a specific initial value
  websiteStatus: 'y',
}) */

export interface TemplateInfo {
  templateId: string
  templateName: string
  sketchCode: string
  sketchName: string
  createTime: string
  sysTemplateRef: string
  sysTemplateRefName: string
  isSysTemplate: string
  ownerUserId: number
  ownerUserName: string
  onlineServiceCode: string
  theme: string
  loginStyle: number[]
  thirdLoginStyle: number[]
  memo: string
  templateStatus: string
  cdnUrl: string
  hasStatsCode: string
  statsCodeJsUrl: string
  statsCodeInit: string
  taskId: string
}

export function initTemplateInfo(): TemplateInfo {
  return {
    templateId: '',
    templateName: '',
    sketchCode: '',
    sketchName: '',
    createTime: '',
    sysTemplateRef: '',
    sysTemplateRefName: '',
    isSysTemplate: '',
    ownerUserId: 0,
    ownerUserName: '',
    onlineServiceCode: '',
    theme: '',
    loginStyle: [0, 0],
    thirdLoginStyle: [0, 0],
    memo: '',
    templateStatus: '',
    cdnUrl: '',
    hasStatsCode: '',
    statsCodeJsUrl: '',
    statsCodeInit: '',
    taskId: ''
  }
}
//  test
/* export function initTemplateInfo(): TemplateInfo {
      return {
        templateId: 'templateId',
        templateName: 'templateName',
        sketchCode: 'sketchCode',
        sketchName: 'sketchName',
        createTime: 'yyyy-MM-dd HH:mm:ss',
        sysTemplateRef: 'sysTemplateRef',
        sysTemplateRefName: 'sysTemplateRefName',
        isSysTemplate: 'isSysTemplate',
        ownerUserId: 0,
        ownerUserName: 'ownerUserName',
        onlineServiceCode: 'onlineServiceCode',
        theme: 'theme',
        loginStyle: [0, 0],
        thirdLoginStyle: [0, 0],
        memo: 'memo',
        templateStatus: 'templateStatus',
        cdnUrl: 'cdnUrl',
        hasStatsCode: 'hasStatsCode',
        statsCodeJsUrl: 'statsCodeJsUrl',
        statsCodeInit: 'statsCodeInit',
        taskId: 'taskId'
      };
    } */
export interface SketchInfo {
  theme: string
  sketchCode: string
  sketchName: string
  sketchType: string
  langCodes: string[]
  memo: string
  areaCodes: string[]
  createTime: string
  sketchStatus: string
  taskId: string
}

/* export function initSketchInfo(): SketchInfo {
      return {
        theme:'theme',
        sketchCode: 'sketchCode',
        sketchName: 'sketchName',
        sketchType: 'sketchType',
        langCodes: ['bbbb', 'bb'],
        memo: 'memo',
        areaCodes: ['aa', 'bbbb'],
        createTime: 'yyyy-MM-dd HH:mm:ss',
        sketchStatus: 'sketchStatus',
        taskId: 'taskId'
      };
    } */
export function initSketchInfo(): SketchInfo {
  return {
    theme: '',
    sketchCode: '',
    sketchName: '',
    sketchType: '',
    langCodes: [], // Keeping this as an empty array
    memo: '',
    areaCodes: [], // Keeping this as an empty array
    createTime: '',
    sketchStatus: '',
    taskId: ''
  }
}
type LanguageMapping = {
  value: string
  label: string
}
export function getLanguageLabels(keys: string[] | string, mapOptions: LanguageMapping[]): string {
  // 转换 keys 为数组
  const keyArray = Array.isArray(keys) ? keys : [keys]
  // 处理转换逻辑
  return keyArray
    .map((key) => {
      const match = mapOptions.find((option) => option.value === key)
      return match ? match.label : ''
    })
    .filter((label) => label) // 过滤掉空字符串
    .join(',') // 连接成字符串
}
