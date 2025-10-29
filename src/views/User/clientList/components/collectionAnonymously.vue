<template>
  <!-- 匿名收藏 -->
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane :lazy="true" label="BBS" name="b">
      <subCollection reqType="b" :account-info="props.accountInfo"></subCollection>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="论坛" name="f">
      <subCollection reqType="f" :account-info="props.accountInfo"></subCollection>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="主板" name="m">
      <subCollection reqType="m" :account-info="props.accountInfo"></subCollection>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="帖子" name="p">
      <subCollection reqType="p" :account-info="props.accountInfo"></subCollection>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="图库" name="t">
      <subCollection reqType="t" :account-info="props.accountInfo"></subCollection>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import subCollection from './subComponet/subCollection.vue'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'targetId',
    label: '收藏对象ID'
  },
  {
    prop: 'targetName',
    label: '收藏对象'
  },
  {
    prop: 'likeFlag',
    label: '收藏类型',
    json: {
      sourceName: 'likeFlag',
      keyName: 'likeFlag'
    }
  },
  {
    prop: 'createTime',
    label: '点赞时间'
  }
]
const activeName = ref('b')

onMounted(() => {})
</script>
