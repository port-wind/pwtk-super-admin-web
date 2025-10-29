import type { TableOptions } from '@/components/mTable/types'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'openDate',
    label: '开奖日期',
    align: 'center',
    columAttr: {
      width: 105
    }
  },
  {
    prop: 'openTime',
    label: '开奖时间',
    align: 'center',
    columAttr: {
      width: 90
    }
  },
  {
    prop: 'issue',
    label: '期数',
    align: 'center',
    columAttr: {
      minWidth: 100
    }
  }
]

// gameType : "2032"
// issue : ""
// openDate : "2025-10-01"
// openTime : ""
