import type { TableOptions } from '@/components/mTable/types'

// 年份 期数 图纸名称 报纸名称 系列名称 彩种 发布用户 评论内容
//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'username',
    label: '账号',
    slot: 'username',
    columAttr: {
      width: 180
    }
  },
  {
    prop: 'roleIds',
    label: '角色身份',
    slot: 'roleIds',
    columAttr: {
      minWidth: 240
    }
  },
  {
    prop: 'phone',
    label: '手机号',
    slot: 'phone',
    columAttr: {
      width: 155
    }
  },
  {
    prop: 'state',
    label: '状态',
    slot: 'state',
    columAttr: {
      width: 80
    }
  },
  {
    prop: 'id',
    label: '操作',
    slot: 'id',
    columAttr: {
      width: 160
    }
  }
]
