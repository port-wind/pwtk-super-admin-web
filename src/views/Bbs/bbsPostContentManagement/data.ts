import type { TableOptions } from '@/components/mTable/types'
import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr, YearTypes } from '@/utils/dataFormat'
import { reactive } from 'vue'

// Table需要的数据
// Data needed for the table
export const options: TableOptions[] = [
  {
    prop: 'title',
    label: '帖子标题',
    slot: 'postInfo',
    width: 230
  },
  {
    prop: 'forumInfo',
    label: '论坛',
    slot: 'forumInfo',
    columAttr: {
      minWidth: 140
    }
  },
  {
    prop: 'postGametypeRef',
    label: '彩种',
    slot: 'gameType'
  },
  {
    prop: 'postYear',
    label: '发布年份',
    align: 'right',
    columAttr: {
      minWidth: 80
    }
  },
  {
    prop: 'postIssue',
    label: '发布期数',
    align: 'right',
    columAttr: {
      minWidth: 100
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
    prop: 'countInfo',
    label: '点赞｜收藏｜回覆｜阅读数量',
    slot: 'countInfo',
    columAttr: {
      minWidth: 210
    }
  },
  {
    prop: 'isAttachment',
    label: '附件',
    slot: 'isAttachment',
    columAttr: {
      minWidth: 60
    }
  },
  {
    prop: 'postStatus',
    label: '帖子状态',
    slot: 'isSwitch',
    columAttr: {
      minWidth: 110
    }
  },
  {
    prop: 'postTime',
    label: '创建时间',
    slot: 'postTime',
    columAttr: {
      minWidth: 170
    }
  }
]

//新增时候需要的数据
export const addDialogOptions: FormOptions[] = [
  {
    prop: 'forumId',
    label: '论坛ID:',
    type: 'slot',
    value: ''
  },
  {
    prop: 'isTop',
    label: '置顶:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postUserId',
    label: '发布用户ID:',
    type: 'slot',
    value: ''
  },
  {
    prop: 'isSelected',
    label: '精选:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'title',
    label: '帖子标题:',
    type: 'input',
    value: ''
  },
  {
    prop: 'isHot',
    label: '热门:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postStatus',
    label: '帖子状态:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isBloom',
    label: '爆款:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postGameRef',
    label: '游戏标记:',
    type: 'input'
  },
  {
    prop: 'isRecommended',
    label: '推荐:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postGametypeRef',
    label: '彩种:',
    type: 'slot',
    value: ''
  },
  {
    prop: 'isVote',
    label: '投票:',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postYear',
    label: '发布年份:',
    type: 'slot'
    // type: 'select',
    // placeholder: '',
    // value: YearTypes[0],
    // children: YearTypes as FormOptions[],
    // attrs: {
    //   clearable: true,
    //   style: {
    //     width: '100px',
    //     'flex-grow': 'unset'
    //   }
    // }
  },
  {
    prop: 'enableAnonymous',
    label: '匿名回复:',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('isAnonymous', 'radio') as FormOptions[]
  },
  {
    prop: 'postIssue',
    label: '发布期数:',
    type: 'slot',
    value: ''
  },
  {
    prop: 'viewFlag',
    label: '可见标记:',
    type: 'radio-group',
    value: 'a',
    children: changeJsonToArr('viewFlag', 'radio') as FormOptions[]
  },
  {
    prop: '',
    label: '',
    type: 'slot'
  }
]
//编辑时候需要的数据
export const editDialogOptions = [
  {
    prop: 'postId',
    label: '帖子 | ID：',
    type: 'spliceText',
    spliceTextData: [
      {
        prop: 'title',
        displayType: 'truncated',
        showCopy: false
      },
      {
        prop: 'postId',
        displayType: 'mask',
        showCopy: true
      }
    ]
  },
  {
    prop: 'isTop',
    label: '置顶：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'forumId',
    label: '论坛 | ID：',
    type: 'spliceText',
    spliceTextData: [
      {
        prop: 'forumName',
        displayType: 'truncated',
        showCopy: false
      },
      {
        prop: 'forumId',
        displayType: 'mask',
        showCopy: true,
        maskData: {
          firstLength: 6,
          lastLength: 4,
          maxLength: 10,
          mask: '***'
        }
      }
    ]
  },
  {
    prop: 'isSelected',
    label: '精选：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'userId',
    label: '发布用户ID：',
    type: 'slot',
    value: ''
  },
  {
    prop: 'isHot',
    label: '热门：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postStatus',
    label: '帖子状态：',
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
    prop: 'postGameRef',
    label: '游戏标记：',
    type: 'input'
  },
  {
    prop: 'isRecommended',
    label: '推荐：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postGametypeRef',
    label: '彩种：',
    type: 'slot',
    value: ''
  },
  {
    prop: 'isVote',
    label: '投票：',
    type: 'radio-group',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'postTime',
    label: '发布时间：',
    type: 'dateText'
  },
  {
    prop: 'readThreadCount',
    label: '阅读｜回复数量：',
    type: 'spliceText',
    spliceTextData: [
      {
        prop: 'readCount',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'threadCount',
        displayType: 'text',
        showCopy: false
      }
    ]
  },
  {
    prop: 'enableAnonymous',
    label: '匿名回复：',
    type: 'radio-group',
    children: changeJsonToArr('isAnonymous', 'radio') as FormOptions[]
  },
  {
    prop: 'likeFavoriteCount',
    label: '点赞｜收藏数量：',
    type: 'spliceText',
    spliceTextData: [
      {
        prop: 'likeCount',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'favoriteCount',
        displayType: 'text',
        showCopy: false
      }
    ]
  },
  {
    prop: 'viewFlag',
    label: '可见标记：',
    type: 'radio-group',
    children: changeJsonToArr('viewFlag', 'radio') as FormOptions[]
  },
  {
    prop: 'postYearIssue',
    label: '发布年份｜发布期数：',
    type: 'spliceText',
    spliceTextData: [
      {
        prop: 'postYear',
        displayType: 'text',
        showCopy: false
      },
      {
        prop: 'postIssue',
        displayType: 'text',
        showCopy: false
      }
    ]
  }
]
const attachmentOptionsCommon: TableOptions[] = [
  {
    prop: 'attachmentType',
    label: '类型',
    json: {
      sourceName: 'attachmentType',
      keyName: 'attachmentType'
    }
  },
  { prop: 'attachmentStatus', label: '附件状态', slot: 'attachmentStatus' },
  { prop: 'isView', label: '是否可见', slot: 'isView' },
  { prop: 'prefixPostfixFlag', label: '插入位置', slot: 'prefixPostfixFlag' },
  {
    prop: 'operate',
    label: '操作',
    slot: 'operate',
    width: '140px'
  }
]
//附件列表需要的数据
export const attachmentOptions: TableOptions[] = [
  {
    prop: 'attachmentId',
    label: '附件',
    slot: 'attachmentId'
  },
  ...attachmentOptionsCommon
]
export const attachmentOptionsForAdd: TableOptions[] = [
  {
    prop: 'fileName',
    label: '附件',
    slot: 'fileName'
  },
  ...attachmentOptionsCommon
]

//附件表单需要的数据
export const editAttachmentOptions: FormOptions[] = reactive([
  {
    prop: 'attachmentStatus',
    label: '附件状态：',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('isOpen', 'radio') as FormOptions[]
  },
  {
    prop: 'isView',
    label: '可见：',
    type: 'radio-group',
    value: 'y',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  {
    prop: 'prefixPostfixFlag',
    label: '插入位置：',
    type: 'radio-group',
    value: 'h',
    children: changeJsonToArr('prefixPostfixType', 'radio') as FormOptions[]
  },
  {
    prop: 'attachmentUrl',
    label: '附件URL：',
    type: 'text',
    textData: {
      isCopy: true,
      isHandleStr: true
    }
  },
  {
    type: 'upload',
    label: '附件上传：',
    prop: 'attachment',
    uploadAttrs: {
      multiple: false,
      limit: 1,
      listType: 'text'
    },
    rules: [
      {
        required: true,
        message: '附件不能为空',
        trigger: 'blur'
      }
    ]
  }
])
