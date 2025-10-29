<template>
  <div id="system_account" class="main_container">
    <section class="level-rule-main-header">
      <el-button type="primary" @click="openEditRuleModal">修改规则</el-button>
    </section>

    <section class="main_flex_table">
      <m-table :options="memberLevelOptions" :data="tableData" :isLoading="isLoading" isEditRow stripe>
        <template #vipLevel="{ scope }">
          <span>VIP{{ scope.row.vipLevel }}</span>
        </template>
        <template #score="{ scope }">
          <span>积分达到 &nbsp;{{ scope.row.score }}</span>
        </template>
      </m-table>
    </section>
    <edit-level-rule v-if="modalsStore.editLevelRuleModal.isVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import type { GetRequest } from '@/api/bss/infoManagement/types'

import showErrorMessage from '@/utils/showErrorMessage'
import { TableOptions } from '@/components/mTable/types'
import { reqMemberLevel } from '@/api/user/memberLevel'
import { useModalsStore } from '@/stores/modalStore'
import { IReqMevvberLevel } from '@/api/user/memberLevel/types'

const modalsStore = useModalsStore()
const tableData = ref<IReqMevvberLevel[]>([])
const memberLevelOptions = ref<TableOptions[]>([
  {
    prop: 'vipLevel',
    label: '等级名称',
    slot: 'vipLevel',
    width: 200,
    columAttr: {
      align: 'center'
    }
  },
  {
    prop: ' ',
    label: ' ',
    align: 'left',
    width: 150
  },
  {
    prop: 'score',
    label: '升级条件',
    slot: 'score',
    columAttr: {
      minWidth: 300,
      'class-name': 'margin-column'
    }
  },
  {
    prop: 'createTime',
    label: '更新时间',
    dateName: 'createTime',
    formatStr: 'yyyy-MM-dd HH:mm:ss',
    columAttr: {
      minWidth: 230
    }
  }
])

const isLoading = ref(false)

const openEditRuleModal = () => {
  modalsStore.showModal('editLevelRuleModal')
}

const fetchData = async (_queryForm?: GetRequest) => {
  isLoading.value = true
  try {
    const response = await reqMemberLevel()
    if (response.success) {
      tableData.value = response.data!
    } else {
      tableData.value = []
      showErrorMessage(response)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  fetchData()
})

watch(
  () => modalsStore.editLevelRuleModal.isVisible,
  (newVal) => {
    if (!newVal) {
      fetchData()
    }
  }
)
</script>

<style scoped>
/* Add any component-specific styles here */
.level-rule-main-header {
  margin: 10px 0 20px 0;
}
.main_flex_table {
  border-top: 1px solid #e6e6e6;
}
:deep(.el-table__cell) {
  padding: 12px 0 !important;
}
</style>
