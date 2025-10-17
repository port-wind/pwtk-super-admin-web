<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view v-slot="{ Component }">
      <component :is="Component"></component>
    </router-view>
  </el-config-provider>
</template>
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/stores/changeI18n'
const appStore = useAppStore()
</script>
<style lang="less" scoped></style>
