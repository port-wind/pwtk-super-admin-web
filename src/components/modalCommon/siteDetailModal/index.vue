<template>
  <el-dialog v-model="dialogVisible" v-bind="$attrs" @close="close">
    <template #default>
      <div class="site-detail-modal">
        <div class="site-detail-modal-header">
          <div class="site-detail-modal-header-title">
            <span>站点详情</span>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useModalsStore } from '@/stores/modalStore'

const modalsStore = useModalsStore()

const dialogVisible = ref(modalsStore.siteDetailModal.isVisible)

const close = () => {
  modalsStore.hideModal('siteDetailModal')
}
</script>

<style lang="scss" scoped></style>
