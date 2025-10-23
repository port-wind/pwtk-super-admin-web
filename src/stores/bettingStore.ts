import { defineStore, type _GettersTree } from 'pinia'
import { listPlayTypeCode } from '@/api/betting'
import { BizFlag } from '@/api/betting/types'
import type { IListTypeCode } from '@/api/betting/types'
// import { listPlayType } from '@/api/expert/sale-list'
import { getStarBizTypeList, reqStarActivityList } from '@/api/global'
import type { IGameType, IGameTypePlatformBodyParameter, IPointEvent, IStarBizType } from '@/api/global/types'
import { gameTypePlatformList } from '@/api/system/gameTypeManagement'

export const gameTypeMapToCode = (game: string): number => {
  switch (game) {
    case 'a':
      return 2032
    case 'hk':
      return 1
    case 'sg':
      return 3995
    case 'tw':
      return 84
    case 'xa':
      return 5
    case 'kl8':
      return 6
    default:
      console.error('Invalid gameType value:', game)
      return 0
  }
}
interface IState {
  gameType: IGameType[]
  gameListTypeCode: IListTypeCode[]
  // gameSubListTypeCode: IListPlayTypeData[]
  isLoading: boolean
  error: string | null
  pointEvent: IPointEvent[]
  startEvent: IStarBizType[]
}

interface IOption {
  value: string
  label: string
  disabled?: boolean
}

interface IGetter extends _GettersTree<IState> {
  labelOption: (_: IState) => IOption[]
  // gameSubList: (state: IState) => (gameTypeCode: string) => IListPlayTypeData[]
  getActiveGameType: (_: IState) => () => IGameType[]
  getAllGetGameType: (_: IState) => () => IGameType[]
}

interface IAction {
  getGameType: (_?: IGameTypePlatformBodyParameter) => Promise<void>
  /** 获取 投票类型: 全部 特肖 特码 单双 平特肖 大小 波色 连肖 */
  getListPlayTypeCode: (_?: BizFlag) => Promise<void>
  getPointEvent: () => Promise<void>
  /** 获取星星活动列表 */
  getStarEventList: () => Promise<void>
  // getlistPlayType: () => Promise<void>
}

export const useBettingStore = defineStore<'bettingStore', IState, IGetter, IAction>('bettingStore', {
  state: (): IState => ({
    gameType: [],
    gameListTypeCode: [],
    pointEvent: [],
    startEvent: [],
    isLoading: false,
    error: null
    // gameSubListTypeCode: []
  }),
  getters: {
    // 处理后的数据（例如排序或过滤）
    labelOption: (state: IState) => {
      return state.startEvent.map((item) => ({
        label: item.bizDesc,
        value: item.bizCode
      }))
    },
    // gameSubList: (state: IState) => {
    //   return (gameTypeCode: string) => {
    //     return (
    //       state.gameSubListTypeCode?.find((item) => item.playTypeCode === gameTypeCode)
    //         ?.children || []
    //     )
    //   }
    // },
    getActiveGameType: (state: IState) => {
      return () => {
        return state.gameType.filter((item) => item.status === 'y')
      }
    },
    getAllGetGameType: (state: IState) => {
      return () => {
        return state.gameType
      }
    }
  },
  actions: {
    async getGameType(_Query?: IGameTypePlatformBodyParameter) {
      this.isLoading = true
      this.error = null
      try {
        // getGameTypePlatformList
        const query: IGameTypePlatformBodyParameter = {
          page: 1,
          size: 100,
          sortName: '',
          sortOrder: 'ASC',
          gameTypeShortName: '',
          gameTypeName: '',
          status: undefined,
          ..._Query
        }
        const res = (await gameTypePlatformList(query)) as any
        this.gameType = res.data.list
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    },
    async getListPlayTypeCode(bizFlag?: BizFlag) {
      this.isLoading = true
      this.error = null
      try {
        const res = await listPlayTypeCode({ bizFlag: bizFlag || BizFlag.Gallery })
        this.gameListTypeCode = res.data.list
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    },
    async getPointEvent() {
      this.isLoading = true
      this.error = null
      try {
        const res = await reqStarActivityList()
        this.pointEvent = res.data.list
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    },
    async getStarEventList() {
      this.isLoading = true
      this.error = null
      try {
        const res = await getStarBizTypeList()
        this.startEvent = res.data!
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error'
      } finally {
        this.isLoading = false
      }
    }
    // async getlistPlayType() {
    //   this.isLoading = true
    //   this.error = null
    //   try {
    //     const res = await listPlayType()
    //     if (res.success) {
    //       this.gameSubListTypeCode = res.data?.list!
    //     }
    //   } catch (error) {
    //     this.error = error instanceof Error ? error.message : 'Unknown error'
    //   } finally {
    //     this.isLoading = false
    //   }
    // }
  }
})
