<template>
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @close="close">
    <template #default>
      <div class="domain-series-modal">
        <el-tabs v-model="modalsStore.domainSeriesModal.activeTab">
          <el-tab-pane label="Tab 1" name="tab1">
            {{ modalsStore.domainSeriesModal.modalData?.name }}
          </el-tab-pane>
          <el-tab-pane label="Tab 2" name="tab2">
            {{ modalsStore.domainSeriesModal.modalData?.age }}
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useModalsStore } from '@/stores/modalStore'

const modalsStore = useModalsStore()

const dialogVisible = ref(modalsStore.domainSeriesModal.isVisible)

const close = () => {
  modalsStore.hideModal('domainSeriesModal')
}
</script>

<style lang="scss" scoped></style>
