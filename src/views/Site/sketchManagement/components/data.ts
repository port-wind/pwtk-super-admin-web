import type { TableOptions } from '@/components/mTable/types'
import { domainFrom, domainStatusLabel, domainType } from '@/const/options'
export const firstTabName = 'sketch',
  secondTabName = 'sketchPath',
  thirdTabName = 'templatePath'
export const sketchOptions: TableOptions[] = [
  {
    prop: 'templateName',
    label: '模板名称',
    slot: 'templateName'
  },
  {
    prop: 'loginId',
    label: '所属用户',
    slot: 'loginId'
  },
  {
    prop: 'templateStatus',
    label: '状态',
    slot: 'templateStatus'
  },
  {
    prop: 'isSystem',
    label: '系统模板',
    slot: 'isSystem'
  },
  {
    prop: 'sysTemplateRefName',
    label: '引用模板'
  }
]
export const getWebsiteStatusLabel = (status: string) => {
  switch (status) {
    case 'y':
      return '启用'
    case 'm':
      return '维护'
    case 'c':
      return '关闭'
    default:
      return '启用'
  }
}
export const getTemplateStatusLabel = (status: string) => {
  switch (status) {
    case 'y':
      return '启用'
    case 'm':
      return '维护'
    case 'n':
      return '关闭'
    default:
      return '启用'
  }
}
export const getDomainTypeLabel = (value: string): string => {
  const option = domainType.find((option) => option.value === value)
  return option ? option.label : '前端'
}
export const getDomainFromLabel = (value: string): string => {
  const option = domainFrom.find((option) => option.value === value)
  return option ? option.label : '客户'
}
export const getDomainStatusLabel = (value: string): string => {
  const option = domainStatusLabel.find((option) => option.value === value)
  return option ? option.label : '启用'
}
export const templateOptions: TableOptions[] = [
  {
    prop: 'websiteInnerName',
    label: '站点名称',
    slot: 'websiteInnerName'
  },
  {
    prop: 'userName',
    label: '所属用户',
    slot: 'userName'
  },
  {
    prop: 'websiteStatus',
    label: '状态',
    slot: 'websiteStatus'
  },
  {
    prop: 'websiteTitle',
    label: '标题'
  }
]
export const websiteOptions: TableOptions[] = [
  {
    prop: 'domain',
    label: '域名'
  },
  {
    prop: 'domainType',
    label: '类型',
    slot: 'domainType'
  },
  {
    prop: 'domainFrom',
    label: '来源',
    slot: 'domainFrom'
  },
  {
    prop: 'domainStatus',
    label: '状态',
    slot: 'domainStatus'
  },
  {
    prop: 'ownerUserId',
    label: '所属用户',
    slot: 'ownerUserId'
  },
  {
    prop: 'websiteTitle',
    label: '标题'
  }
]
