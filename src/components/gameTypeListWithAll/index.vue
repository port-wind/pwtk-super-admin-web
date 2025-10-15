<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import type { IGameType } from '@/api/global/types'
// 定义 emits
const emit = defineEmits<{
  (e: 'onSelect', value: IGameType | undefined): void
  (e: 'update:modelValue', value: string | undefined): void
  (e: 'defaultLoaded', value: string | undefined): void
}>()

const props = defineProps<{
  modelValue: string | undefined
  // showActiveGameTypes?: boolean
  withDefault?: boolean
  allGame?: boolean
  showTotal?: boolean //是否显示全部， 默认不显示
}>()
const tempValue = ref<string | undefined>('')
const bettingStore = useBettingStore()
const handleChange = (val) => {
  const data = bettingStore.gameType.find((item) => item.gameType === val)
  emit('update:modelValue', val)
  emit('onSelect', data)
}

onMounted(async () => {
  tempValue.value = props.modelValue
  if (bettingStore.gameType.length === 0) {
    await bettingStore.getGameType()
  }
  if (props.withDefault) {
    tempValue.value = gameTypeList.value.find((item) => item.status === 'y')?.gameType
    // tempValue.value = gameTypeList.value[0].gameType
    emit('update:modelValue', tempValue.value)
    emit('defaultLoaded', tempValue.value)
  }
})
const gameTypeList = computed(() => {
  // return props.showActiveGameTypes ? bettingStore.getActiveGameType() : bettingStore.getAllGetGameType()
  return bettingStore.getAllGetGameType()
})
watch(
  () => props.modelValue,
  (val) => {
    tempValue.value = val
  }
)
</script>

<template>
  <el-select v-bind="$attrs" v-model="tempValue" @change="handleChange" placeholder="彩种">
    <el-option v-if="props.showTotal" label="全部" :value="0"></el-option>
    <el-option
      v-for="item in gameTypeList"
      :key="item.gameType"
      :label="item.gameTypeName"
      :value="item.gameType"
      :disabled="!props.allGame && item.status === 'n'"
      :title="!props.allGame && item.status === 'n' ? '当前彩票已停止' : ''"
    />
  </el-select>
</template>

<style lang="less" scoped></style>
