import { defineStore } from 'pinia'

interface ModalState {
  isVisible: boolean
  activeTab: string
  modalData: Record<string, any> | null
}

interface ModalsState {
  [key: string]: ModalState
}
interface PointDetailModal {
  componentKey: number
  type: string
}
type Optional<T> = {
  [P in keyof T]?: T[P]
}

interface VoiceRoomUserModal {
  componentKey: number
  voiceRoomId: string
}

interface ValueBusState {
  pointDetailModal: Optional<PointDetailModal> | null
  starDetailModal: Optional<PointDetailModal> | null
  voiceRoomUserModal: Optional<VoiceRoomUserModal> | null
}

export const useValueBus = defineStore('valueBus', {
  state: (): ValueBusState => ({
    pointDetailModal: null,
    starDetailModal: null,
    voiceRoomUserModal: null
  }),
  actions: {
    setValue<K extends keyof ValueBusState>(key: K, value: ValueBusState[K]) {
      this[key] = value
    },
    getValue<K extends keyof ValueBusState>(key: K): ValueBusState[K] {
      return this[key]
    },
    resetValue<K extends keyof ValueBusState>(key: K) {
      this[key] = null as ValueBusState[K]
    }
  }
})
export const useModalsStore = defineStore('modalsStore', {
  state: (): ModalsState => ({
    // 图库系列弹窗
    photoSeriesModal: {
      isVisible: false,
      activeTab: '',
      modalData: { id: null as number | null, manageSiteId: '' }
    },
    // 新闻系列弹窗
    newsSeriesModal: {
      isVisible: false,
      activeTab: 'basic',
      modalData: null
    },
    // 域名系列弹窗
    domainSeriesModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    // 域名系列弹窗
    domainInfoModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    // 站点详情
    websiteInfoModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    // 站点详情
    siteDetailModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //bbs
    bbsSeriesModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //主板
    mainboardSeriesModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //论坛
    forumSeriesModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //帖子
    postSeriesModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //用户信息
    userInfoModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: null
    },
    //template模板
    templateInfoModal: {
      isVisible: false,
      activeTab: 'tab1',
      modalData: {
        showOtherTabs: true,
        isSysTemplateRef: false
      }
    },
    //会员等级
    editLevelRuleModal: {
      isVisible: false,
      activeTab: 'basic',
      modalData: null
    },
    //用户标签
    editCustomerTagModal: {
      isVisible: false,
      activeTab: 'basic',
      modalData: null
    },
    //积分规则
    editBaseConfigModal: {
      isVisible: false,
      activeTab: 'basic',
      modalData: null
    },
    checkboxTable: {
      isVisible: false,
      activeTab: 'basic',
      modalData: {
        tableList: [],
        pushFunction: () => {}
      }
    },
    postScreenDetailModal: {
      isVisible: false,
      activeTab: 'first',
      modalData: null
    },
    batchAddIssueModal: {
      isVisible: false,
      activeTab: 'first',
      modalData: null
    }
  }),
  actions: {
    showModal(modalKey: keyof ModalsState) {
      this[modalKey].isVisible = true
      console.log(this[modalKey])
    },
    hideModal(modalKey: keyof ModalsState) {
      this[modalKey].isVisible = false
    },
    setActiveTab(modalKey: keyof ModalsState, tab: string) {
      this[modalKey].activeTab = tab
    },
    setModalData(modalKey: keyof ModalsState, modalData: Record<string, any>) {
      this[modalKey].modalData = modalData
    },
    resetModal(modalKey: keyof ModalsState) {
      this[modalKey] = {
        isVisible: false,
        activeTab: 'tab1',
        modalData: null
      }
    }
  }
})
