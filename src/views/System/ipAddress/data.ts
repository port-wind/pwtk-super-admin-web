//Table需要的数据
export const options = [
  {
    prop: 'ip',
    label: 'IP',
    columAttr: {
      minWidth: 320
    }
  },
  {
    prop: 'country',
    label: '国家',
    columAttr: {
      minWidth: 110
    }
  },
  {
    prop: 'city',
    label: '市',
    columAttr: {
      minWidth: 110
    }
  },
  {
    prop: 'region',
    label: '地区',
    columAttr: {
      minWidth: 110
    }
  },
  {
    prop: 'latitude',
    label: '纬度',
    align: 'right',
    width: 100
  },
  {
    prop: 'longitude',
    label: '经度',
    align: 'right',
    width: 200
  },
  {
    prop: ' ',
    label: ' ',
    align: ' ',
    width: 100
  },
  {
    prop: 'lastUpdateTime',
    label: '更新时间',
    slot: 'time',
    width: 200
  }
]
