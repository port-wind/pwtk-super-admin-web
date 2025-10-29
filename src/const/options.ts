// options.ts

import { ref, computed } from 'vue'
//语言列表
export const optionsLang = [
  {
    value: 'cn',
    label: '中文简体'
  },
  {
    value: 'tc',
    label: '中文繁体'
  },
  {
    value: 'en',
    label: '英语'
  },
  {
    value: 'jp',
    label: '日语'
  },
  {
    value: 'kr',
    label: '韩语'
  },
  {
    value: 'th',
    label: '泰语'
  },
  {
    value: 'ar',
    label: '阿拉伯语'
  }
]
//地区列表
export const optionsArea = [
  {
    value: 'cn',
    label: '中国'
  },
  {
    value: 'tw',
    label: '台湾'
  },
  {
    value: 'hk',
    label: '香港'
  },
  {
    value: 'mo',
    label: '澳门'
  },
  {
    value: 'th',
    label: '泰国'
  },
  {
    value: 'kr',
    label: '韩国'
  },
  {
    value: 'jp',
    label: '日本'
  },
  {
    value: 'us',
    label: '美国'
  }
]
export const domainStatusDetail = [
  {
    value: 'y',
    label: '启用'
  },
  { value: 'n', label: '关闭' }
]
// 网站状态
export const websiteStatus = [
  {
    value: 'y',
    label: '启用'
  },
  { value: 'm', label: '维护' },
  { value: 'c', label: '关闭' }
]

// 网站统计代码
export const hasStatsCode = [
  {
    value: 'y',
    label: '启用'
  },
  { value: 'n', label: '不启用' }
]
// 域名状态　ドメインステータス
export const domainStatus = [
  {
    value: 'y',
    label: '已绑定'
  },
  {
    value: 'n',
    label: '未绑定'
  }
]
export const domainStatusLabel = [
  { value: 'y', label: '启用' },
  { value: 'c', label: '关闭' },
  { value: 'n', label: '维护' }
]
//客户端字典 多端
export const optionsTargets = [
  {
    value: 'h',
    label: 'H5端'
  },
  {
    value: 'a',
    label: 'APP端'
  },
  {
    value: 'p',
    label: 'PC端'
  },
  {
    value: 'i',
    label: 'IOS端'
  },
  {
    value: 'g',
    label: 'Android端'
  }
]
//客户端字典 多端
export const optionsScope = [
  {
    value: 'g',
    label: '全站'
  },
  {
    value: 'u',
    label: '用户中心'
  },
  {
    value: 'a',
    label: '活动中心'
  },
  {
    value: 'r',
    label: '注册'
  },
  {
    value: 'l',
    label: '登录'
  }
]
//客户端字典

//草图类型sketchType
export const optionsSketch = [
  {
    value: 'nav',
    label: '导航站'
  },
  {
    value: 'tk',
    label: '图库'
  },
  {
    value: 'bbs',
    label: '论坛'
  },
  {
    value: 'news',
    label: '新闻站'
  },
  {
    value: 'soft-download',
    label: '软件下载站'
  },
  {
    value: 'apk-download',
    label: 'Android下载站'
  },
  {
    value: 'ipa-download',
    label: 'IOS下载站'
  },
  {
    value: 'spa',
    label: '单页网站'
  },
  {
    value: 'movies',
    label: '电影网站'
  }
]

//支持的登录方式字典
export const optionsSupportLogin = [
  {
    value: 'h',
    label: 'H5登陆'
  }
]
//第三方登录方式字典
export const optionsThirdLogin = [
  {
    value: 'h',
    label: 'H5登陆'
  }
]
// 导航选择算法
export const optionsNavAlgo = [
  {
    value: 'r',
    label: '随机'
  },
  {
    value: 'o',
    label: '顺序'
  },
  {
    value: 'p',
    label: 'ip-hash'
  }
  // {
  //   value: 't',
  //   label: 'token-hash'
  // }
]
// 是否支持
export const optionsSupport = [
  {
    value: 'y',
    label: '支持'
  },
  {
    value: 'n',
    label: '不支持'
  }
]

// 公告和维护计划状态
export const optionsPlanStatus = [
  {
    value: 'y',
    label: '有效'
  },
  {
    value: 'n',
    label: '关闭'
  },
  {
    value: 'e',
    label: '过期'
  }
]

// 导航方式 h302,h301,delay,lines,click,delay_click,delay_lines,auto_select_lines
export const optionsNavOutStyle = [
  {
    value: 'h302',
    label: '302跳转'
  },
  {
    value: 'h301',
    label: '301跳转'
  },
  {
    value: 'delay',
    label: '延迟跳转'
  },
  {
    value: 'click',
    label: '点击跳转'
  },
  {
    value: 'delay_click',
    label: '延迟点击跳转'
  },
  {
    value: 'lines',
    label: '线路页'
  },
  {
    value: 'delay_lines',
    label: '延迟线路页'
  },
  {
    value: 'auto_select_lines',
    label: '自动线路页'
  }
]

// 域名来源
export const domainFrom = [
  {
    value: 'c',
    label: '客户'
  },
  {
    value: 's',
    label: '内置'
  }
]
export const textAreaLimit: number = 225
// 域名类型
export const domainType = [
  {
    value: 'f',
    label: '前端'
  },
  {
    value: 'm',
    label: '管端'
  },
  {
    value: 'z',
    label: '总管'
  },
  {
    value: 'p',
    label: '前端永久'
  },
  {
    value: 'b',
    label: '前端备用'
  }
]
// 落地页
export const landingPage = [
  {
    value: 'p',
    label: '首页'
  },
  {
    value: 'r',
    label: '注册页'
  },
  {
    value: 'u',
    label: '会员中心'
  },
  {
    value: 'c',
    label: '充值页'
  },
  {
    value: 'l',
    label: '登录页'
  },
  {
    value: 'a',
    label: '活动页'
  },
  {
    value: 'm',
    label: '消息中心'
  }
]
//用户状态
export const optionsUserStatus = [
  {
    value: 'y',
    label: '启用'
  },
  {
    value: 'n',
    label: '停用'
  },
  {
    value: 't',
    label: '停权'
  },
  {
    value: 'f',
    label: '冻结'
  },
  {
    value: 'u',
    label: '未启用'
  },
  {
    value: 'z',
    label: '保留'
  },
  {
    value: 'v',
    label: '浏览'
  },
  {
    value: 'x',
    label: '关停'
  }
]
//domain域名是否启用SSL证书
export const supportSslStatus = [
  {
    value: 'y',
    label: '启用'
  },
  {
    value: 'n',
    label: '不启用'
  }
]
//是否强制https访问
export const forceHttpsStatus = [
  {
    value: 'y',
    label: '是'
  },
  {
    value: 'n',
    label: '否'
  }
]
//用户类型
export const optionsUserType = [
  {
    value: 'u',
    label: '用户'
  },
  {
    value: 'a',
    label: '代理'
  },
  {
    value: 's',
    label: '子账号'
  },
  {
    value: 'b',
    label: '后台'
  },
  {
    value: 'o',
    label: '开放平台'
  }
]
//团队状态
export const optionsTeamStatus = [
  {
    value: 'y',
    label: '启用'
  },
  {
    value: 'n',
    label: '停用'
  },
  {
    value: 't',
    label: '停权'
  },
  {
    value: 'f',
    label: '冻结'
  },
  {
    value: 'u',
    label: '未启用'
  },
  {
    value: 'z',
    label: '保留'
  },
  {
    value: 'v',
    label: '浏览'
  },
  {
    value: 'x',
    label: '关停'
  }
]
//账户类型
export const optionsAccountType = [
  {
    value: 'f',
    label: '未上线'
  },
  {
    value: 'u',
    label: 'UAT'
  },
  {
    value: 't',
    label: '测试'
  },
  {
    value: 'd',
    label: '演示'
  },
  {
    value: 'p',
    label: '已上线'
  },
  {
    value: 'n',
    label: '已下线'
  },
  {
    value: 's',
    label: '停用'
  },
  {
    value: 'z',
    label: '归档'
  }
]
//注册用户来源
export const optionsRegType = [
  {
    value: 'w',
    label: 'pc Web端'
  },
  {
    value: 'h',
    label: 'H5端'
  },
  {
    value: 'a',
    label: 'android端'
  },
  {
    value: 'i',
    label: 'Iphone端'
  },
  {
    value: 'o',
    label: 'openAPIreg端'
  }
]

//附件类型
export const optionsAttachmentType = [
  {
    value: 'p',
    label: '图片'
  },
  {
    value: 'f',
    label: '文件'
  },
  {
    value: 'a',
    label: 'APK'
  },
  {
    value: 'e',
    label: 'EXE'
  },
  {
    value: 'v',
    label: '视频'
  },
  {
    value: 's',
    label: '声频'
  },
  {
    value: 'm',
    label: '音乐'
  }
]

export const optionsViewFlag = [
  {
    value: 'a',
    label: '所有可见'
  },
  {
    value: 'u',
    label: '用户可见'
  },
  {
    value: 'r',
    label: '关注可见'
  },
  {
    value: 'f',
    label: '好友可见'
  }
]

export function useOptions(optionsList: { value: string; label: string }[]) {
  const options = ref(optionsList)
  const selectedOptionLabel = (optionValue: string) => {
    return computed(() => {
      const selected = options.value.find((option) => option.value === optionValue)
      return selected ? selected.label : ''
    }).value
  }
  const formatData = (data: string[]): string => {
    if (data.length === 0) {
      return ''
    }
    const labels = data.map((value) => selectedOptionLabel(value)).filter((label) => label !== '') // 过滤掉找不到的值
    return labels.join(', ')
  }
  const formatSketch = (optionValue: string) => {
    return computed(() => {
      const selected = options.value.find((option) => option.value === optionValue)
      return selected
    }).value?.label
  }
  const formatScope = (optionValue: string) => {
    return computed(() => {
      const selected = options.value.find((option) => option.value === optionValue)
      return selected
    }).value?.label
  }
  const formatValue = (optionValue: string) => {
    return computed(() => {
      const selected = options.value.find((option) => option.value === optionValue)
      return selected
    }).value?.label
  }
  return {
    selectedOptionLabel,
    formatData,
    formatSketch,
    formatScope,
    formatValue
  }
}
