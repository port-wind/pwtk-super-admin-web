// 菜单列表
import { defineStore, type _GettersTree } from 'pinia'

export interface IMenuOption {}

interface IState {}
interface IAction {}

export const useMenuListStore = defineStore<'siteManage', IState, _GettersTree<IState>, IAction>('siteManage', {
  state: (): IState => ({}),
  getters: {
    labelOption: (state: IState) => {
      return state
    }
  },
  actions: {}
})
