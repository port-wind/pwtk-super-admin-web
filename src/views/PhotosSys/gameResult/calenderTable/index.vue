<script setup lang="ts">
import { options } from './data'
import type { IOpenDateItem } from '@/api/photoSys/calendar/type'

const props = defineProps<{
  data: IOpenDateItem[]
}>()
</script>

<template>
  <m-table height="600px" :options="options" :data="props.data"></m-table>
</template>

<style lang="scss" scoped></style>
