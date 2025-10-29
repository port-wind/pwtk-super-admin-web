<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { useManageSiteStore } from '@/stores/manageSiteStore'
import { SiteInfo } from '@/api/manageSite/manageSiteList/types'

// 定义 emits
const emit = defineEmits<{
  (e: 'onSelect', value: SiteInfo): void
  (e: 'update:modelValue', value: string): void
}>()

const manageSite = useManageSiteStore()
const selectedValue = ref('')
const handleChange = (val) => {
  const data = manageSite.manageSiteList.find((item) => item.manageId === val)
  emit('update:modelValue', val)
  manageSite.setManageSiteId(val)
  if (emit.hasOwnProperty('onSelect') && data) {
    emit('onSelect', data)
  }
}

onMounted(async () => {
  if (manageSite.manageSiteList.length === 0) {
    await manageSite.getAllManageSiteInfo()
  }
})
</script>

<template>
  <el-select v-model="selectedValue" placeholder="站点选择" @change="handleChange" v-loading="manageSite.isLoading">
    <el-option label="全部" value=""></el-option>
    <el-option
      v-for="item in (manageSite.manageSiteList as any)"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<style lang="less" scoped></style>
