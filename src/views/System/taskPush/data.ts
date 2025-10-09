//Table需要的数据
export const options = [
  {
    prop: 'taskName',
    label: '任务名称',
    columAttr: {
      minWidth: 180
    }
  },
  {
    prop: 'taskType',
    label: '类型',
    width: 80
  },
  {
    prop: 'taskARef',
    label: '任务引用',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'taskBRef',
    label: '任务引用',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'taskCRef',
    label: '任务引用',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'taskDRef',
    label: '任务引用',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'taskStatus',
    label: '状态',
    json: {
      sourceName: 'taskStatus',
      keyName: 'taskStatus'
    },
    width: 80
  },
  {
    prop: 'taskError',
    label: '异常',
    width: 60,
    slot: 'taskError'
  },
  {
    prop: 'startTime',
    label: '启动时间',
    width: 180,
    slot: 'startTime'
  },
  {
    prop: 'endTime',
    label: '结束时间',
    width: 180,
    slot: 'endTime'
  }
]
