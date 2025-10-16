import type { TableOptions } from '@/components/mTable/types'
import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'

//Table需要的数据
export const options: TableOptions[] = [
  {
    prop: 'mainboardIcon',
    label: '图标',
    slot: 'imageInfo',
    width: 56,
    columAttr: {
      align: 'center'
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
    prop: 'bbsId',
    label: 'BBS名称',
    slot: 'bbsInfo',
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
    prop: 'mainboardStatus',
    label: '主板状态',
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
      minWidth: 180
    }
  }
]

//新增时候需要的数据
export const addDialogOptions: FormOptions[] = [
  {
    type: 'upload',
    label: '主板图标：',
    prop: 'mainboardIcon',
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
    prop: 'mainboardId',
    label: '主板ID：',
    placeholder: '主板ID',
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
    prop: 'bbsId',
    label: 'BBS ID：',
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
    prop: 'mainbordName',
    label: '主板名称：',
    placeholder: '主板名称',
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
    prop: 'mainboardStatus',
    label: '主板状态：',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: '',
    label: '',
    type: 'text'
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
export const editDialogOptions: FormOptions[] = [
  {
    type: 'upload',
    label: '主板图标：',
    prop: 'mainboardIcon',
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
    prop: 'mainboardId',
    label: '主板ID：',
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
    prop: 'bbsId',
    label: 'BBS ID：',
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
    prop: 'mainbordName',
    label: '主板名称：',
    type: 'input',
    attrs: {
      style: {
        width: '600px'
      },
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
    prop: 'mainboardStatus',
    label: '主板状态：',
    type: 'radio-group',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'createTime',
    label: '创建时间：',
    type: 'dateText'
  },
  {
    prop: 'isBloom',
    label: '爆款：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  }
]

//论坛
export const forumOptions: TableOptions[] = [
  {
    prop: 'forumInfo',
    label: '论坛ID',
    slot: 'forumInfo',
    width: 180
  },
  {
    prop: 'forumName',
    label: '论坛名称'
  },
  {
    prop: 'forumCategory',
    label: '论坛类别'
  },
  {
    prop: 'forumStatus',
    label: '论坛状态',
    slot: 'isForumSwitch',
    width: 80
  },
  {
    prop: 'createTime',
    label: '创建时间',
    dateName: 'createTime'
  }
]

//帖子
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
