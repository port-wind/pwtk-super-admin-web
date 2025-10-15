<template>
  <!-- 用户收藏 -->

  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane :lazy="true" label="BBS" name="b">
      <SubFavorite reqType="b" :account-info="props.accountInfo || {}"></SubFavorite>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="论坛" name="f">
      <SubFavorite reqType="f" :account-info="props.accountInfo || {}"></SubFavorite>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="主板" name="m">
      <SubFavorite reqType="m" :account-info="props.accountInfo || {}"></SubFavorite>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="帖子" name="p">
      <SubFavorite reqType="p" :account-info="props.accountInfo || {}"></SubFavorite>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="图库" name="t">
      <SubFavorite reqType="t" :account-info="props.accountInfo || {}"></SubFavorite>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { TableOptions } from '@/components/mTable/types'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/attachmentManagement/types'
import { reqFavorite } from '@/api/user/index'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
import SubFavorite from './subComponet/subFavorite.vue'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import { GetUserIdResponse } from '@/api/user/type'
const { t } = i18n.global as any

const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})
const initPageObj = () => ({
  page: 1,
  size: 15
})
//loading 按钮
const isLoading = ref(false)
const activeName = ref('b')

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: ' hostUserId',
    label: '收藏用户昵称 | ID',
    slot: 'userDisplay'
  },
  {
    prop: 'targetName',
    label: '收藏对象'
  },
  {
    prop: 'createTime',
    label: '收藏时间',
    dateName: 'createTime',
    width: 170
  }
]

onMounted(() => {})
// onUpdated(() => {
//     searchButton()
// })
</script>
