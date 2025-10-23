import { reqHttp } from '@/api/manageSite/manageSiteList/index'
import type { TableOptions } from '@/components/mTable/types'
import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'manageInfo',
    label: '管端节点',
    slot: 'manageInfo',
    width: 200
  },
  {
    prop: 'oapiUrl',
    label: '网址',
    showOmission: true
  },
  {
    prop: 'accessKey',
    label: '访问密钥',
    showOmission: true
  },
  {
    prop: 'fsiteStatus',
    label: '站点状态',
    slot: 'isSwitch',
    width: 110
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime',
    width: 110
  },
  {
    prop: 'openAdminUrl',
    label: '打开站点',
    slot: 'link',
    width: 110
  }
]

//新增时候需要的数据
export const addOptions: FormOptions[] = [
  {
    prop: 'manageId',
    label: '站点ID：',
    type: 'input',
    attrs: {
      maxlength: 30
    }
  },
  {
    prop: 'siteName',
    label: '站点名称:',
    type: 'input',
    attrs: {
      maxlength: 30
    }
  },
  {
    prop: 'siteStatus',
    label: '站点状态:',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('manageSiteStatus', 'radio') as FormOptions[]
  },
  {
    prop: 'oapiUrl',
    label: '网址：',
    type: 'input'
  },
  {
    prop: 'accessKey',
    label: '访问密钥：',
    type: 'input'
  },
  {
    prop: 'operStatus',
    label: '运营状态:',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('operStatus', 'radio') as FormOptions[]
  }
]

//编辑时候需要的数据
export const editOptions: FormOptions[] = [
  {
    prop: 'manageId',
    label: '站点ID：',
    type: 'text',
    isEndCopy: true
  },
  {
    prop: 'siteName',
    label: '站点名称：',
    type: 'input',
    attrs: {
      maxlength: 30
    }
  },
  {
    prop: 'siteStatus',
    label: '站点状态：',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('manageSiteStatus', 'radio') as FormOptions[]
  },
  {
    prop: 'oapiUrl',
    label: '网址：',
    type: 'input'
  },
  {
    prop: 'accessKey',
    label: '访问密钥：',
    type: 'input'
  },
  {
    prop: 'createTime',
    label: '创建时间：',
    type: 'dateText'
  },
  {
    prop: 'operStatus',
    label: '运营状态:',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('operStatus', 'radio') as FormOptions[]
  }
]
