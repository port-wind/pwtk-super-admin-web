<template>
  <!-- 用户点赞 -->
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane :lazy="true" label="BBS" name="b">
      <SubLikes reqType="b" :account-info="props.accountInfo"></SubLikes>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="论坛" name="f">
      <SubLikes reqType="f" :account-info="props.accountInfo"></SubLikes>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="主板" name="m">
      <SubLikes reqType="m" :account-info="props.accountInfo"></SubLikes>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="帖子" name="p">
      <SubLikes reqType="p" :account-info="props.accountInfo"></SubLikes>
    </el-tab-pane>
    <el-tab-pane :lazy="true" label="图库" name="t">
      <SubLikes reqType="t" :account-info="props.accountInfo"></SubLikes>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import { reqLike } from '@/api/user/index'
import { TableOptions } from '@/components/mTable/types'
import type { TableData, AddRequest, EditRequest, GetRequest } from '@/api/bss/attachmentManagement/types'
import mTable from '@/components/mTable/index.vue'
import showErrorMessage from '@/utils/showErrorMessage'
const tableRef = ref(null)
import count from '@/utils/tableHeight'
import i18n from '@/i18n'
import SubLikes from './subComponet/subLikes.vue'
import { GetUserIdResponse } from '@/api/user/type'
const { t } = i18n.global as any

const props = defineProps({
  accountInfo: {
    type: Object as () => GetUserIdResponse['data'] | null
  }
})

const initQueryForm = () => ({
  hostUserId: '',
  targetRef: '',
  targetId: '',
  likeFlag: ''
})

const initPageObj = () => ({
  page: 1,
  size: 15
})
const tableData = ref<TableData[]>([])
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref<number>(0)
const pageObj = ref(initPageObj())
const queryForm = ref(initQueryForm())
const activeName = ref('b')

//loading 按钮
const isLoading = ref(false)

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'attachmentId',
    label: '点赞用户昵称 | ID',
    slot: 'userDisplay'
  },
  {
    prop: ' likeFlag',
    label: '点赞类型',
    json: {
      sourceName: ' likeFlag',
      keyName: ' likeFlag'
    }
  },
  {
    prop: 'targetRef',
    label: '点赞对象'
  },
  {
    prop: 'targetId',
    label: '点赞对象ID'
  },
  {
    prop: 'createTime',
    label: '点赞时间',
    dateName: 'createTime',
    width: 170
  }
]

onMounted(() => {})
</script>
