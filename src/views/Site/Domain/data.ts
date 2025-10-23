import type { TableOptions } from '@/components/mTable/types'
import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'forumIcon',
    label: '图标',
    slot: 'imageInfo',
    width: 56,
    columAttr: {
      align: 'center'
    }
  },
  {
    prop: 'forumInfo',
    label: '论坛名称',
    slot: 'forumInfo',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'mainboardInfo',
    label: '主板名称',
    slot: 'mainboardInfo',
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'forumCategory',
    label: '论坛类别',
    showOmission: true,
    columAttr: {
      minWidth: 200
    }
  },
  {
    prop: 'tags',
    label: '标签',
    slot: 'tags',
    columAttr: {
      minWidth: 230
    }
  },
  {
    prop: 'forumStatus',
    label: '论坛状态',
    slot: 'isSwitch',
    columAttr: {
      minWidth: 100
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    slot: 'time',
    columAttr: {
      minWidth: 190
    }
  }
]

//新增时候需要的数据
export const addBbsForumOptions: FormOptions[] = [
  {
    type: 'upload',
    label: '论坛图标：',
    prop: 'forumIcon',
    uploadAttrs: {
      multiple: false,
      listType: 'picture-card',
      limit: 1
    },
    rules: [
      {
        required: true,
        message: '图片不能为空',
        trigger: 'blur'
      }
    ],
    columnSpan: 20
  },
  {
    prop: 'forumId',
    label: '论坛ID：',
    type: 'input',
    attrs: {
      maxlength: 20
    }
  },
  {
    prop: 'isRecommended',
    label: '推荐：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'mainboardId',
    label: '主板ID：',
    type: 'slot',
    value: '',
    attrs: {
      maxlength: 20
    }
  },
  {
    prop: 'isHot',
    label: '热门：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumName',
    label: '论坛名称：',
    type: 'input',
    attrs: {
      maxlength: 100
    }
  },
  {
    prop: 'isSelected',
    label: '精选：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumCategory',
    label: '论坛类别：',
    type: 'input'
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumStatus',
    label: '论坛状态：',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isBloom',
    label: '爆款：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  }
]

//编辑时候需要的数据
export const editBbsForumOptions: FormOptions[] = [
  {
    type: 'upload',
    label: '论坛图标：',
    prop: 'forumIcon',
    uploadAttrs: {
      multiple: false,
      listType: 'picture-card',
      limit: 1
    },
    rules: [
      {
        required: true,
        message: '图片不能为空',
        trigger: 'blur'
      }
    ],
    columnSpan: 20
  },
  {
    prop: 'forumId',
    label: '论坛ID：',
    type: 'text',
    isEndCopy: true
  },
  {
    prop: 'isRecommended',
    label: '推荐：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'mainboardId',
    label: '主板ID：',
    type: 'text',
    isEndCopy: true
  },
  {
    prop: 'isHot',
    label: '热门：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumName',
    label: '论坛名称：',
    type: 'input',
    value: 'forumName',
    attrs: {
      maxlength: 100
    }
  },
  {
    prop: 'isSelected',
    label: '精选：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumCategory',
    label: '论坛类别：',
    type: 'input'
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumStatus',
    label: '论坛状态：',
    type: 'radio-group',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isBloom',
    label: '爆款：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'createTime',
    label: '创建时间：',
    type: 'dateText',
    columnSpan: 20
  }
]

export const postOptions: TableOptions[] = [
  {
    prop: 'postId',
    label: '帖子ID',
    width: 180
  },
  {
    prop: 'title',
    label: '帖子名称',
    width: 150,
    showOmission: true
  },
  {
    prop: 'postYear',
    label: '发布年份',
    width: 100
  },
  {
    prop: 'postIssue',
    label: '发布期数',
    width: 100
  },
  {
    prop: 'countInfo',
    label: '点赞｜收藏｜回覆｜阅读数量',
    slot: 'countInfo'
  },
  {
    prop: 'isAttachment',
    label: '附件',
    slot: 'isAttachment',
    width: 80
  }
]

//搜索组件数据
export const searchOptions: SearchOption[] = [
  {
    prop: 'manageSiteId',
    slot: 'manageSiteId',
    type: 'slot'
  },
  {
    prop: 'domain',
    inputData: {
      maxLength: 255,
      placeholder: '域名'
    },
    type: 'input'
  },
  {
    prop: 'domain_in',
    inputData: {
      maxLength: 255,
      placeholder: '站点内部名称'
    },
    type: 'input'
  },
  {
    prop: 'title',
    inputData: {
      maxLength: 255,
      placeholder: '标题'
    },
    type: 'input'
  },

  {
    prop: 'bind',
    inputData: {
      maxLength: 255,
      placeholder: '绑定站点ID'
    },
    type: 'input'
  },
  {
    prop: 'template_id',
    inputData: {
      maxLength: 255,
      placeholder: '绑定模版 | ID'
    },
    type: 'input'
  }
]
//搜索按钮数据
export const searchBtnOptions: SearchBtnOptions = {
  isSearch: true,
  isReset: true,
  isAdd: false
}

export interface SearchOption {
  // 字段名称
  prop: string
  // 表单项类型
  type: 'input' | 'date' | 'select' | 'autoComplete' | 'dateRange' | 'button' | 'timeLine' | 'slot'
  // 表头
  label?: string

  // 表单项的校验规则
  rules?: any[]
  // 自定义列模板的插槽名

  width?: string | number
  slot?: string

  //date 需要传入
  dateData?: {
    placeholder: string
  }

  //输入最大值
  inputData?: {
    maxLength: string | number
    placeholder: string
  }

  // 下拉框数据
  selectData?: {
    selectName: string
    placeholder: string
    clearable?: boolean
    SelectOption?: SelectOption[]
  }
  //AutoComplete必须要输入
  autocompleteData?: {
    keyword: string
    isEmpty: boolean
    placeholder: string
    httpFunc: Function
    triggerOnFocus: false
    maxLength: string | number
  }

  timeLineData?: {
    name?: string
    startPlaceholder?: string
    endPlaceholder?: string
    startName: string
    endName: string
  }
}

interface SelectOption {
  value: string
  label: string
}

export interface SearchBtnOptions {
  isSearch: boolean
  isReset: boolean
  isAdd: boolean
}
