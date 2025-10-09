<template>
  <el-scrollbar class="scrollbardiv">
    <div class="tagbox">
      <el-tag
        @click="changePage(tag.path)"
        :type="route.path === tag.path ? null : 'info'"
        v-for="(tag, index) in tagview.tagslist"
        :key="index"
        :closable="tagview.tagslist.length === 1 ? false : true"
        @close.stop="closePage(tag.path, index)"
        class="tag"
      >
        {{ tag.title }}
      </el-tag>
    </div>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import i18n from '@/i18n'
const { t } = i18n.global as any
import { useTagViewStore } from '@/stores/tagview'
const route = useRoute()
const router = useRouter()
const tagview = useTagViewStore()
watch(route, () => {
  addTags()
})
const addTags = () => {
  const { name } = route
  // console.log(route, '监听路由')
  if (name) {
    if (tagview.tagslist.length > 19) {
      tagview.delTags(0)
    }
    let obj = { path: route.path, title: t(route.meta.title) }
    let canAdd = true
    for (let t of tagview.tagslist) {
      if (t.path === obj.path) {
        canAdd = false
        break
      }
    }
    if (canAdd) {
      tagview.addtags(obj)
    }
  }
}
const closePage = (path, i) => {
  if (path === route.path) {
    if (i !== tagview.tagslist.length - 1) {
      let index = tagview.tagslist.length - 1
      router.push(tagview.tagslist[index].path)
      tagview.delTags(i)
    } else {
      let index = tagview.tagslist.length - 2
      router.push(tagview.tagslist[index].path)
      tagview.delTags(i)
    }
  } else {
    tagview.delTags(i)
  }
}
const changePage = (path) => {
  router.push(path)
}
addTags()
</script>
<style lang="less" scoped>
.scrollbardiv {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.tagbox {
  padding: 5px 0;
  display: flex;
  padding-left: 15px;
  border-bottom: 1px solid #d8dce5;

  .tag {
    margin-left: 5px;
    cursor: pointer;
    flex-shrink: 0;
  }
}
</style>
