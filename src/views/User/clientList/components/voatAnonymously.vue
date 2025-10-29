<template>
  <!-- 匿名投票 -->
  <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
    <el-tab-pane v-for="game in gameList" :lazy="true" :label="game.gameTypeName" :name="game.gameType">
      <SubVoat :reqType="game.gameType" :account-info="props.accountInfo"></SubVoat>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="ts">
import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import count from '@/utils/tableHeight'
import _Options from '@/const/options.json'
import { reqListDeviceVote, reqGameList } from '@/api/user/index'
import SubVoat from './subComponet/subVoat.vue'
import { create } from 'domain'
const props = defineProps({
  accountInfo: {
    type: Object
  }
})

const initPageObj = () => ({
  page: 1,
  size: 15
})

//Table需要的数据
const options: TableOptions[] = [
  {
    prop: 'year',
    label: '年份'
  },
  {
    prop: 'issue',
    label: '期数',
    slot: 'issue'
  },
  {
    prop: 'vote',
    label: '标的'
  },
  {
    prop: 'gameType',
    label: '游戏类型'
  },
  {
    prop: 'voteType',
    label: '投票类型'
  },
  {
    prop: 'createTime',
    label: '投票',
    slot: 'button'
  }
]

const pageObj = ref(initPageObj())
const activeName = ref('211')
const gameList = ref([])

//获取游戏类型列表
const reqGameTypeList = async () => {
  try {
    let res = await reqGameList({ sortName: '', sortOrder: 'DESC', ...pageObj.value })
    if (res.success) {
      gameList.value = res.data.list
    } else {
      showErrorMessage(res)
    }
  } catch (err) {}
}

onMounted(() => {
  reqGameTypeList()
})
</script>
