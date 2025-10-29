import type { TableOptions } from '@/components/mTable/types'

export const tableOptions: TableOptions[] = [
  {
    prop: 'issue',
    label: '期数',
    align: 'center',
    columAttr: {
      minWidth: 60
    }
  },
  {
    prop: 'openTime',
    label: '开奖时间',
    slot: 'openTime',
    align: 'center',
    columAttr: {
      minWidth: 150
    }
  },
  {
    prop: 'result',
    label: '开奖号码',
    slot: 'result',
    align: 'center',
    columAttr: {
      minWidth: 250
    }
  },
  {
    label: '操作',
    prop: 'operator',
    slot: 'operator',
    align: 'center',
    columAttr: {
      minWidth: 80
    }
  }
]
