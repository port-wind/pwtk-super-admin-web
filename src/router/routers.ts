// import i18n from '@/i18n'
// const { t } = i18n.global as any
const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home',
    component: () => import('@/views/Home/index.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Home/echarts/index.vue'),
        meta: {
          title: 'menu.home',
          keepAlive: false
        }
      }
    ]
  },
  //站点组件模块
  {
    path: '/webVision',
    name: '/webVision',
    meta: {
      title: 'menu.componentControl',
      keepAlive: true
    },
    component: () => import('@/views/WebVision/index.vue')
  },
  //404
  {
    path: '/404',
    name: '404',
    meta: {
      title: 'menu.404',
      keepAlive: false
    },
    component: () => import('@/views/404.vue')
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  },
  // 系统管理
  {
    path: '/system',
    name: 'system',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.system',
      keepAlive: false
    },
    children: [
      {
        path: 'account', //账号管理
        name: 'account',
        component: () => import('@/views/System/account/index.vue'),
        meta: {
          title: 'menu.account',
          keepAlive: false
        }
      },
      {
        path: 'roles', //角色管理
        name: 'roles',
        component: () => import('@/views/System/roles.vue'),
        meta: {
          title: 'menu.roles',
          keepAlive: false
        }
      },
      {
        path: 'resource', //资源管理
        name: 'resource',
        component: () => import('@/views/System/resource.vue'),
        meta: {
          title: 'menu.resource',
          keepAlive: false
        }
      },
      {
        path: 'gameTypeManagement', //彩种管理
        name: 'gameTypeManagement',
        component: () => import('@/views/System/gameTypeManage/index.vue'),
        meta: {
          title: 'menu.gameTypeManagement',
          keepAlive: false
        }
      },
      {
        path: 'log', //操作日志
        name: 'log',
        component: () => import('@/views/System/operationLog.vue'),
        meta: {
          title: 'menu.log',
          keepAlive: false
        }
      },
      {
        path: 'task', //任务调度
        name: 'task',
        component: () => import('@/views/System/task.vue'),
        meta: {
          title: 'menu.task',
          keepAlive: false
        }
      },
      {
        path: 'taskPush', //任务推送
        name: 'taskPush',
        component: () => import('@/views/System/taskPush/index.vue'),
        meta: {
          title: 'menu.taskPush',
          keepAlive: false
        }
      },
      {
        path: 'ipAddress', //ip地址
        name: 'ipAddress',
        component: () => import('@/views/System/ipAddress/index.vue'),
        meta: {
          title: 'menu.ipAddress',
          keepAlive: false
        }
      },
      {
        path: 'uploadLog', //上传日志
        name: 'uploadLog',
        component: () => import('@/views/System/uploadLog/index.vue'),
        meta: {
          title: 'menu.uploadLog',
          keepAlive: false
        }
      },
      {
        path: 'dictionary', //全局参数配置
        name: 'dictionary',
        component: () => import('@/views/System/dictionary.vue'),
        meta: {
          title: 'menu.dictionary',
          keepAlive: false
        }
      }
      //网站管理 隐藏起来.super admin不再需要这个功能, 通过SSO跳转打开管端,直接访问
      // {
      //   path: 'smsManage', //全局参数配置
      //   name: 'smsManage',
      //   component: () => import('@/views/System/SMSManage/index.vue'),
      //   meta: {
      //     title: 'menu.smsManage',
      //     keepAlive: false
      //   }
      // },
      // {
      //   path: 'sensitiveWord', //全局参数配置
      //   name: 'sensitiveWord',
      //   component: () => import('@/views/System/sensitiveWord/index.vue'),
      //   meta: {
      //     title: 'menu.sensitiveWord',
      //     keepAlive: false
      //   }
      // }
      // Sensitive words
    ]
  },
  //网站管理
  // {
  //   path: '/site',
  //   name: 'site',
  //   component: () => import('@/views/Home/index.vue'),
  //   meta: {
  //     title: 'menu.site',
  //     keepAlive: true
  //   },
  //   children: [
  //     {
  //       path: 'codeManagement', //推广码管理
  //       name: 'codeManagement',
  //       component: () => import('@/views/Site/codeManagement.vue'),
  //       meta: {
  //         title: 'menu.codeManagement',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'templateManagement', //模板管理
  //       name: 'templateManagement',
  //       component: () => import('@/views/Site/templateManagement/index.vue'),
  //       meta: {
  //         title: 'menu.templateManagement',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'sketchManagement', //草图管理
  //       name: 'sketchManagement',
  //       component: () => import('@/views/Site/sketchManagement/index.vue'),
  //       meta: {
  //         title: 'menu.sketchManagement',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'siteManagement', //站点管理
  //       name: 'siteManagement',
  //       component: () => import('@/views/Site/siteManagement/index.vue'),
  //       meta: {
  //         title: 'menu.siteManagement',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'domainManagement', //域名管理
  //       name: 'domainManagement',
  //       component: () => import('@/views/Site/Domain/index.vue'),
  //       meta: {
  //         title: 'menu.domainManagement',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'navigationConfig', //导航站管理
  //       name: 'navigationConfig',
  //       component: () => import('@/views/Site/Navi/navigationConfig.vue'),
  //       meta: {
  //         title: 'menu.navigationConfig',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'componentBase', //页面组件库
  //       name: 'componentBase',
  //       component: () => import('@/views/Site/componentBase/index.vue'),
  //       meta: {
  //         title: 'menu.componentBase',
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // 帖子管理
  {
    path: '/bbsList',
    name: 'bbsList',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.bbsList',
      keepAlive: false
    },
    children: [
      {
        // 高手论坛
        path: 'bbsPostContentList/userPublic',
        name: 'bbsPostContentList/userPublic',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.userPublic',
          keepAlive: false
        }
      },
      {
        // 推荐论坛
        path: 'bbsPostContentList/recommend',
        name: 'bbsPostContentList/recommend',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.recommend',
          keepAlive: false
        }
      },
      {
        // 我的创作
        path: 'bbsPostContentList/myForum',
        name: 'bbsPostContentList/myForum',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.myForum',
          keepAlive: false
        }
      },
      {
        // 竞猜推荐论坛
        path: 'bbsPostContentList/lottery',
        name: 'bbsPostContentList/lottery',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.lottery',
          keepAlive: false
        }
      },
      {
        // 图片幽默竞猜
        path: 'bbsPostContentList/guessImg',
        name: 'bbsPostContentList/guessImg',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.guessImg',
          keepAlive: false
        }
      },
      {
        // 视频幽默竞猜
        path: 'bbsPostContentList/guessVideo',
        name: 'bbsPostContentList/guessVideo',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.guessVideo',
          keepAlive: false
        }
      }
    ]
  },
  //论坛管理
  {
    path: '/bbs',
    name: 'bbs',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.bbs',
      keepAlive: false
    },
    children: [
      {
        path: 'bbsMainboard', // 论坛主版管理
        name: 'bbsMainboard',
        component: () => import('@/views/Bbs/bbsMainboard/index.vue'),
        meta: {
          title: 'menu.bbsMainboard',
          keepAlive: false
        }
      },
      {
        path: 'bbsForum', //论坛管理
        name: 'bbsForum',
        component: () => import('@/views/Bbs/bbsForum/index.vue'),
        meta: {
          title: 'menu.bbsForum',
          keepAlive: false
        }
      },
      {
        path: 'bbsAttachmentManagement', // 附件管理
        name: 'bbsAttachmentManagement',
        component: () => import('@/views/Bbs/bbsAttachmentManagement/index.vue'),
        meta: {
          title: 'menu.bbsAttachmentManagement',
          keepAlive: false
        }
      },
      {
        path: 'bbsPostContentManagement', // 帖子管理
        name: 'bbsPostContentManagement',
        component: () => import('@/views/Bbs/bbsPostContentManagement/index.vue'),
        meta: {
          title: 'menu.bbsPostContentManagement',
          keepAlive: false
        }
      },
      {
        path: 'bbsInfo', //论坛信息
        name: 'bbsInfo',
        component: () => import('@/views/Bbs/bbsInfo/index.vue'),
        meta: {
          title: 'menu.bbsInfo',
          keepAlive: false
        }
      }
    ]
  },
  //新闻站点
  {
    path: '/newsSiteMgr',
    name: 'newsSiteMgr',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.newsSiteMgr',
      keepAlive: false
    },
    children: [
      {
        path: 'newsSiteList', // 新闻站点列表
        name: 'newsSiteList',
        component: () => import('@/views/newsSiteMgr/newsSiteList/index.vue'),
        meta: {
          title: 'menu.newsSiteList',
          keepAlive: false
        }
      },
      {
        path: 'newsTypeList', //	新闻栏位列表
        name: 'newsTypeList',
        component: () => import('@/views/newsSiteMgr/newsTypeList/index.vue'),
        meta: {
          title: 'menu.newsTypeList',
          keepAlive: false
        }
      },
      {
        path: 'testForm', //	测试表单
        name: 'testForm',
        component: () => import('@/views/newsSiteMgr/testForm/index.vue'),
        meta: {
          title: 'menu.testForm',
          keepAlive: false
        }
      },
      {
        path: 'articleList', // 正文列表
        name: 'articleList',
        component: () => import('@/views/newsSiteMgr/articleList/index.vue'),
        meta: {
          title: 'menu.articleList',
          keepAlive: false
        }
      }
    ]
  },
  // 图库系统
  {
    path: '/photosSys',
    name: 'photosSys',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.photosSys',
      keepAlive: false
    },
    children: [
      {
        path: 'series',
        name: 'series',
        component: () => import('@/views/PhotosSys/series/index.vue'),
        meta: {
          title: 'menu.series',
          keepAlive: false
        }
      },
      {
        path: 'newspaper',
        name: 'newspaper',
        component: () => import('@/views/PhotosSys/newspaper/index.vue'),
        meta: {
          title: 'menu.newspaper',
          keepAlive: false
        }
      },
      {
        path: 'newsPaperIssue',
        name: 'newsPaperIssue',
        component: () => import('@/views/PhotosSys/newsPaperIssue/index.vue'),
        meta: {
          title: 'menu.newsPaperIssue',
          keepAlive: false
        }
      },
      {
        path: 'issueMappingList',
        name: 'issueMappingList',
        component: () => import('@/views/PhotosSys/issueMappingList/index.vue'),
        meta: {
          title: 'menu.issueMappingList',
          keepAlive: false
        }
      },
      {
        path: 'batchIssueAdd',
        name: 'batchIssueAdd',
        component: () => import('@/views/PhotosSys/issueMappingList/batchMappingAdd/index.vue'),
        meta: {
          title: 'menu.batchIssueAdd',
          keepAlive: false
        }
      },
      {
        path: 'websites',
        name: 'websites',
        component: () => import('@/views/PhotosSys/websites/index.vue'),
        meta: {
          title: 'menu.websites',
          keepAlive: false
        }
      },
      {
        path: 'guarantee',
        name: 'guarantee',
        component: () => import('@/views/PhotosSys/guarantee/index.vue'),
        meta: {
          title: 'menu.guarantee',
          keepAlive: false
        }
      },
      {
        path: 'bbsEncyclopedia',
        name: 'bbsEncyclopedia',
        component: () => import('@/views/PhotosSys/bbsEncyclopedia/index.vue'),
        meta: {
          title: 'menu.bbsEncyclopedia',
          keepAlive: false
        }
      },
      {
        path: 'gameResult',
        name: 'gameResult',
        component: () => import('@/views/PhotosSys/gameResult/index.vue'),
        meta: {
          title: 'menu.gameResult',
          keepAlive: false
        }
      },
      {
        path: 'issueVideo',
        name: 'issueVideo',
        component: () => import('@/views/PhotosSys/issueVideo/index.vue'),
        meta: {
          title: 'menu.issueVideo',
          keepAlive: false
        }
      },

      {
        path: 'batchIssueAdd',
        name: 'batchIssueAdd',
        component: () => import('@/views/PhotosSys/issueMappingList/batchMappingAdd/index.vue'),
        meta: {
          title: 'menu.batchIssueAdd',
          keepAlive: false
        }
      },
      {
        path: 'spiderList',
        name: 'spiderList',
        component: () => import('@/views/PhotosSys/spiderList/index.vue'),
        meta: {
          title: 'menu.spiderList',
          keepAlive: false
        }
      }
    ]
  },
  //消息公告
  {
    path: '/messageNotice',
    name: 'messageNotice',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.messageNotice',
      keepAlive: true
    },
    children: [
      {
        path: 'notice', //公告管理
        name: 'notice',
        component: () => import('@/views/MessageNotice/notice.vue'),
        meta: {
          title: 'menu.notice',
          keepAlive: true
        }
      },
      {
        path: 'maintenance', //维护管理
        name: 'maintenance',
        component: () => import('@/views/MessageNotice/maintenance.vue'),
        meta: {
          title: 'menu.maintenance',
          keepAlive: true
        }
      }
    ]
  },
  //用户管理
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.user',
      keepAlive: true
    },
    children: [
      {
        path: 'userList', //用户列表
        name: 'userList',
        component: () => import('@/views/User/userList/index.vue'),
        meta: {
          title: 'menu.userList',
          keepAlive: true
        }
      },
      {
        path: 'clientList', //客户端列表
        name: 'clientList',
        component: () => import('@/views/User/clientList/index.vue'),
        meta: {
          title: 'menu.clientList',
          keepAlive: true
        }
      },
      {
        path: 'customerTags', //用户标签
        name: 'customerTags',
        component: () => import('@/views/User/customerTags/index.vue'),
        meta: {
          title: 'menu.customerTags',
          keepAlive: true
        }
      },
      {
        path: 'memberLevel', //会员等级
        name: 'memberLevel',
        component: () => import('@/views/User/memberLevel/index.vue'),
        meta: {
          title: 'menu.memberLevel',
          keepAlive: true
        }
      },
      {
        path: 'pointsRules', //积分规则
        name: 'pointsRules',
        component: () => import('@/views/User/pointsRules/index.vue'),
        meta: {
          title: 'menu.pointsRules',
          keepAlive: true
        }
      },
      {
        path: 'pointDetail', //积分明细
        name: 'pointDetail',
        component: () => import('@/views/User/pointDetail/index.vue'),
        meta: {
          title: 'menu.pointDetail',
          keepAlive: true
        }
      },
      {
        path: 'starDetail', //星星明细
        name: 'starDetail',
        component: () => import('@/views/User/starDetail/index.vue'),
        meta: {
          title: 'menu.starDetail',
          keepAlive: true
        }
      },
      {
        path: 'activityCenter', //活动中心
        name: 'activityCenter',
        component: () => import('@/views/User/activityCenter/index.vue'),
        meta: {
          title: 'menu.activityCenter',
          keepAlive: true
        }
      }
      // {
      //   path: 'leaderboard', //排行榜
      //   name: 'leaderboard',
      //   component: () => import('@/views/User/leaderboard/index.vue'),
      //   meta: {
      //     title: 'menu.leaderboard',
      //     keepAlive: true
      //   }
      // },
      // {
      //   path: 'recommendList', //推广列表
      //   name: 'recommendList',
      //   component: () => import('@/views/User/recommendList/index.vue'),
      //   meta: {
      //     title: 'menu.recommendList',
      //     keepAlive: true
      //   }
      // }
    ],
    props: true
  },
  //聊天室系统
  {
    path: '/chatroomSystem',
    name: 'chatroomSystem',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.chatroomSystem',
      keepAlive: true
    },
    children: [
      {
        path: 'chatroomList', //聊天室列表
        name: 'chatroomList',
        component: () => import('@/views/ChatroomSystem/chatroomList/index.vue'),
        meta: {
          title: 'menu.chatroomList',
          keepAlive: true
        }
      },
      {
        path: 'batchRoomCreator', //批量创建
        name: 'batchRoomCreator',
        component: () => import('@/views/ChatroomSystem/batchRoomCreator/index.vue'),
        meta: {
          title: 'menu.batchRoomCreator',
          keepAlive: true
        }
      },
      {
        path: '/softwareWebSite',
        name: 'softwareWebSite',
        component: () => import('@/views/Home/index.vue'),
        meta: {
          title: 'menu.softwareWebSite',
          keepAlive: true
        },
        children: []
      }
    ]

    // {
    //   path: 'chatroomUserList', //成员列表
    //   name: 'chatroomUserList',
    //   component: () => import('@/views/ChatroomSystem/chatroomUserList/index.vue'),
    //   meta: {
    //     title: 'menu.chatroomUserList',
    //     keepAlive: true
    //   }
    // },
    // {

    //   path: 'chatroomUserManagement', //成员管理
    //   name: 'chatroomUserManagement',
    //   component: () => import('@/views/ChatroomSystem/chatroomUserManagement/index.vue'),
    //   meta: {
    //     title: 'menu.chatroomUserManagement',
    //     keepAlive: false
    //   }
    // },
    // {
    //   path: 'chatroomMsgList', //消息列表
    //   name: 'chatroomMsgList',
    //   component: () => import('@/views/ChatroomSystem/chatroomMsgList/index.vue'),
    //   meta: {
    //     title: 'menu.chatroomMsgList',
    //     keepAlive: false
    //   }
    // },
    // {
    //   path: 'chatroomMsgManagement', //消息管理
    //   name: 'chatroomMsgManagement',
    //   component: () => import('@/views/ChatroomSystem/chatroomMsgManagement/index.vue'),
    //   meta: {
    //     title: 'menu.chatroomMsgManagement',
    //     keepAlive: false
    //   }
    // }
    // ]
  },
  //管端管理
  {
    path: '/manageSite',
    name: 'manageSite',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.manageSite',
      keepAlive: true
    },
    children: [
      {
        path: 'manageSiteList', //管理节点列表
        name: 'manageSiteList',
        component: () => import('@/views/ManageSite/manageSiteList/index.vue'),
        meta: {
          title: 'menu.manageSiteList',
          keepAlive: true
        }
      }
    ]
  },
  //语音房管理
  {
    path: '/voiceroomManagement',
    name: 'voiceroomManagement',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.voiceroomManagement',
      keepAlive: true
    },
    children: [
      {
        path: 'voiceroomList', //语音房列表
        name: 'voiceroomList',
        component: () => import('@/views/VoiceRoomManagement/voiceRoomList/index.vue'),
        meta: {
          title: 'menu.voiceroomList',
          keepAlive: true
        }
      },
      {
        path: 'voiceroomUserList', //用户列表
        name: 'voiceroomUserList',
        component: () => import('@/views/VoiceRoomManagement/voiceRoomUserList/index.vue'),
        meta: {
          title: 'menu.voiceroomUserList',
          keepAlive: true
        }
      },
      {
        path: 'voiceroomMsgList', //消息列表
        name: 'voiceroomMsgList',
        component: () => import('@/views/VoiceRoomManagement/voiceRoomMsgList/index.vue'),
        meta: {
          title: 'menu.voiceroomMsgList',
          keepAlive: true
        }
      },
      {
        path: 'voiceRoomUserManagement', //用户管理
        name: 'voiceRoomUserManagement',
        component: () => import('@/views/VoiceRoomManagement/voiceRoomUserManagement/index.vue'),
        meta: {
          title: 'menu.voiceRoomUserManagement',
          keepAlive: true
        }
      },
      {
        path: 'voiceRoomMessageManagement', //消息管理
        name: 'voiceRoomMessageManagement',
        component: () => import('@/views/VoiceRoomManagement/voiceRoomMessageManagement/index.vue'),
        meta: {
          title: 'menu.voiceRoomMessageManagement',
          keepAlive: true
        }
      }
    ]
  },
  //订单中心
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.order',
      keepAlive: true
    },
    children: [
      {
        path: 'orderList', //订单列表
        name: 'orderList',
        component: () => import('@/views/Order/orderList/index.vue'),
        meta: {
          title: 'menu.orderList',
          keepAlive: true
        }
      }
    ]
  },
  //竞猜管理
  {
    path: '/betting',
    name: 'betting',
    component: () => import('@/views/Home/index.vue'),
    meta: {
      title: 'menu.betting',
      keepAlive: true
    },
    children: [
      {
        path: 'bettingList', //竞猜列表
        name: 'bettingList',
        component: () => import('@/views/Betting/bettingList/index.vue'),
        meta: {
          title: 'menu.bettingList',
          keepAlive: true
        }
      },
      {
        path: 'photoExplain', //图解列表
        name: 'photoExplain',
        component: () => import('@/views/Betting/photoExplain/index.vue'),
        meta: {
          title: 'menu.photoExplain',
          keepAlive: true
        }
      }
    ]
  },
  //专家管理
  // {
  //   path: '/expertManagement',
  //   name: 'expertManagement',
  //   component: () => import('@/views/Home/index.vue'),
  //   meta: {
  //     title: 'menu.expertManagement',
  //     keepAlive: true
  //   },
  //   children: [
  //     {
  //       path: 'expertList', //专家列表
  //       name: 'expertList',
  //       component: () => import('@/views/ExpertManagement/expertList/index.vue'),
  //       meta: {
  //         title: 'menu.expertList',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'competitionList', //竞选列表
  //       name: 'competitionList',
  //       component: () => import('@/views/ExpertManagement/competitionList/index.vue'),
  //       meta: {
  //         title: 'menu.competitionList',
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: 'pointsList', //打赏记录
  //       name: 'pointsList',
  //       component: () => import('@/views/ExpertManagement/pointsList/index.vue'),
  //       meta: {
  //         title: 'menu.pointsList',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'saleList', //卖料列表
  //       name: 'saleList',
  //       component: () => import('@/views/ExpertManagement/saleList/index.vue'),
  //       meta: {
  //         title: 'menu.saleList',
  //         keepAlive: false
  //       },
  //       props: true
  //     },
  //     {
  //       path: 'buyingList', //买料列表
  //       name: 'buyingList',
  //       component: () => import('@/views/ExpertManagement/buyingList/index.vue'),
  //       meta: {
  //         title: 'menu.buyingList',
  //         keepAlive: false
  //       }
  //     },
  //     {
  //       path: 'sixKingList',
  //       name: 'sixKingList',
  //       component: () => import('@/views/ExpertManagement/sixKingList/index.vue'),
  //       meta: {
  //         title: 'menu.sixKingList',
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: 'login.title',
      keepAlive: false
    }
  }
]

export default routes
