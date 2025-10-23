<template>
  <!-- 匿名点赞 -->

  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane :lazy="true" label="BBS" name="b">
      <SubLike reqType="b" :account-info="props.accountInfo"></SubLike>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="论坛" name="f">
      <SubLike reqType="f" :account-info="props.accountInfo"></SubLike>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="主板" name="m">
      <SubLike reqType="m" :account-info="props.accountInfo"></SubLike>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="帖子" name="p">
      <SubLike reqType="p" :account-info="props.accountInfo"></SubLike>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="图库" name="t">
      <SubLike reqType="t" :account-info="props.accountInfo"></SubLike>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import SubLike from './subComponet/subLike.vue'
import { reqListDeviceLike } from '@/api/user/index'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})
//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'targetId',
    label: '点赞对象ID'
  },
  {
    prop: 'likeFlag',
    label: '点赞类型',
    json: {
      sourceName: 'likeFlag',
      keyName: 'likeFlag'
    }
  },
  {
    prop: 'createTime',
    label: '点赞时间',
    slot: 'timeFormat'
  }
]

const activeName = ref('b')

onMounted(() => {})
</script>
