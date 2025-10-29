// Header头部tag
import { defineStore } from 'pinia'
export const useTagViewStore = defineStore('tagview', {
  state: () => {
    return {
      tagslist: <any>[]
    }
  },
  actions: {
    settags(tags: any) {
      this.tagslist = tags
    },
    addtags(tag: any) {
      this.tagslist.push(tag)
    },
    delTags(index: number) {
      this.tagslist.splice(index, 1)
    }
  }
})
