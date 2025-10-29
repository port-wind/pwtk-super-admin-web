import type { FormOptions } from '@/components/mForm/types'
import { changeJsonToArr } from '@/utils/dataFormat'
// Adjust this import path as needed

// Assuming forGameTypeList is defined elsewhere, you might need to import it or define it here

export const dialogOptions = {
  siteIdInput: {
    prop: 'siteId',
    label: 'ID:',
    type: 'input',
    attrs: {
      maxlength: '30'
    },
    columnSpan: 5
  },
  siteIdText: {
    prop: 'siteId',
    label: 'ID:',
    type: 'text'
  },
  createTime: {
    prop: 'createTime',
    label: '创建时间:',
    type: 'dateText',
    dateName: 'createTime'
  },
  siteNameInput: {
    prop: 'siteName',
    label: '名称:',
    type: 'input',
    attrs: {
      maxLength: '30'
    },
    columnSpan: 5
  },
  siteNameText: {
    prop: 'siteName',
    label: '名称:',
    type: 'text'
  },
  isRecommended: {
    prop: 'isRecommended',
    label: '推荐:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  isHot: {
    prop: 'isHot',
    label: '热门:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[],
    columnSpan: 10
  },
  isTop: {
    prop: 'isTop',
    label: '置顶:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  isSelected: {
    prop: 'isSelected',
    label: '精选:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  isBloom: {
    prop: 'isBloom',
    label: '爆款:',
    type: 'radio-group',
    value: 'n',
    children: changeJsonToArr('yOrN', 'radio') as FormOptions[]
  },
  siteUrl1: {
    prop: 'siteUrl1',
    label: 'URL1:',
    type: 'input',
    attrs: {
      width: '100%'
    }
  },
  siteUrl2: {
    prop: 'siteUrl2',
    label: 'URL2:',
    type: 'input',
    attrs: {
      width: '100%'
    }
  },
  siteUrl3: {
    prop: 'siteUrl3',
    label: 'URL3:',
    type: 'input',
    attrs: {
      width: '100%'
    }
  },
  siteUrl4: {
    prop: 'siteUrl4',
    label: 'URL4:',
    type: 'input',
    attrs: {
      width: '100%'
    }
  },
  siteUrl5: {
    prop: 'siteUrl5',
    label: 'URL5:',
    type: 'input',
    attrs: {
      width: '100%'
    }
  },
  memo: {
    prop: 'memo',
    label: '备注:',
    type: 'input',
    attrs: {
      type: 'textarea'
    }
    // columnSpan: 8
  },
  sortNum: {
    prop: 'sortNum',
    label: '排序编号:',
    type: 'input',
    value: 0,
    attrs: {
      maxlength: 8
    },
    columnSpan: 5
  },
  siteLogo: {
    type: 'upload',
    label: '主板图标:',
    prop: 'siteLogo',
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
  siteDesc: {
    prop: 'siteDesc',
    label: '站点简介:',
    type: 'input',
    attrs: {
      type: 'textarea'
    }
  }
}
