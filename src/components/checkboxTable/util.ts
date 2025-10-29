import {
  reqBbsForumAttachmentPush,
  reqBbsForumPostPush,
  reqBbsForumPush,
  reqBbsMainboardPush,
  reqBbsPush,
  reqGameTypeNewspaperPush,
  reqGameTypeSeriesPush,
  reqIssueMappingPush,
  reqManageSiteList,
  reqNewspaperIssuePush,
  reqWebsiteGuaranteePush,
  reqWebsitePush,
  reqGameOpenDatePush,
  reqTkBbsPush,
  reqGameTypePlatformPush
} from '@/api/super'
import { useModalsStore } from '@/stores/modalStore'
import showErrorMessage from '@/utils/showErrorMessage'
import { computed } from 'vue'

const modalsStore = useModalsStore()

const handleSyncClick = async () => {
  modalsStore.checkboxTable.isVisible = true
  try {
    const response = await reqManageSiteList({ page: 1, size: 999 })
    if (response.success) {
      modalsStore!.checkboxTable!.modalData!.tableList = response.data.list.map((item: any, index: number) => ({
        siteId: item.manageId,
        siteName: item.siteName,
        oapiUrl: item.oapiUrl,
        key: index + 1
      }))
    } else {
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

export const handleSpecialClick = async (
  name:
    | 'guarantee'
    | 'website'
    | 'bbs'
    | 'tkbbs'
    | 'newsPaperIssue'
    | 'series'
    | 'mapping'
    | 'newsPaper'
    | 'issue'
    | 'bbsForumPost'
    | 'bbsForum'
    | 'bbsMainboard'
    | 'bbsForumAttachment'
    | 'gameOpenDate'
    | 'gameTypePlatform'
) => {
  modalsStore!.checkboxTable!.modalData!.flag = name
  switch (name) {
    case 'guarantee':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqWebsiteGuaranteePush
      break
    case 'website':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqWebsitePush
      break
    case 'bbs':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsPush
      break
    case 'tkbbs':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqTkBbsPush
      break
    case 'newsPaperIssue':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqNewspaperIssuePush
      break
    case 'series':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqGameTypeSeriesPush
      break
    case 'mapping':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqIssueMappingPush
      break
    case 'newsPaper':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqGameTypeNewspaperPush
      break
    case 'bbsForumPost':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsForumPostPush
      break
    case 'bbsForum':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsForumPush
      break
    case 'bbsMainboard':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsMainboardPush
      break
    case 'bbsForumAttachment':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqBbsForumAttachmentPush
      break
    case 'gameOpenDate':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqGameOpenDatePush
      break
    case 'gameTypePlatform':
      modalsStore!.checkboxTable!.modalData!.pushFunction = reqGameTypePlatformPush
      break
    default:
      console.error('未找到对应的功能')
      break
  }
  handleSyncClick()
}

// Composable function for deployment config
export const useDeployConfig: any = () => {
  const isShowCheckboxTable = true

  return {
    isShowCheckboxTable,
    handleSpecialClick
  }
}

// Use the composable
export const { isShowCheckboxTable } = useDeployConfig()
