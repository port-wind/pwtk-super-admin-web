import type { TableOptions } from '@/components/mTable/types'
import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'
import { reqHttp as reqMainboardHttp } from '@/api/bss/mainboardManagement/index'

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
    prop: 'sortNum',
    label: '排序编号',
    slot: 'sortNum',
    align: 'center',
    columAttr: {
      minWidth: 80
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
    prop: 'sortNum',
    label: '排序编号：',
    type: 'input',
    attrs: {
      maxlength: 10
    }
  },
  {
    prop: 'isTop',
    label: '置顶：',
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
    prop: 'isBloom',
    label: '爆款：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumStatus',
    label: '论坛状态：',
    type: 'radio-group',
    value: 'y',
    columnSpan: 20,
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
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
    prop: 'sortNum',
    label: '排序编号：',
    type: 'input',
    attrs: {
      maxlength: 10
    }
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumCategory',
    label: '论坛类别：',
    type: 'input'
  },
  {
    prop: 'isBloom',
    label: '爆款：',
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
    prop: 'createTime',
    label: '创建时间：',
    type: 'dateText'
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
